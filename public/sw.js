/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'movie-review-v1';
const STATIC_CACHE = 'movie-review-static-v1';
const API_CACHE = 'movie-review-api-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
];

const TMDB_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// ── Install: cache static assets ──────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS.map((url) => new Request(url, { mode: 'no-cors' })));
    }).then(() => self.skipWaiting())
  );
});

// ── Activate: delete old caches ───────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== STATIC_CACHE && name !== API_CACHE)
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch strategy ────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // TMDB API: stale-while-revalidate with timestamp check
  if (url.hostname === 'api.themoviedb.org') {
    event.respondWith(tmdbCacheStrategy(request));
    return;
  }

  // TMDB images: cache-first (long-lived)
  if (url.hostname === 'image.tmdb.org') {
    event.respondWith(imagesCacheFirst(request));
    return;
  }

  // Firebase / App: network-first with offline fallback
  if (url.hostname.includes('firebase') || url.hostname.includes('googleapis')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Static assets (JS/CSS/HTML): stale-while-revalidate
  if (
    request.destination === 'document' ||
    request.destination === 'script' ||
    request.destination === 'style'
  ) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
});

// ── Strategies ────────────────────────────────────────

async function tmdbCacheStrategy(request) {
  const cache = await caches.open(API_CACHE);
  const cached = await cache.match(request);

  if (cached) {
    const cachedDate = new Date(cached.headers.get('sw-cached-at') || 0);
    if (Date.now() - cachedDate.getTime() < TMDB_CACHE_DURATION) {
      // Serve cached and revalidate in background
      fetchAndCache(cache, request);
      return cached;
    }
  }

  try {
    return await fetchAndCache(cache, request);
  } catch {
    if (cached) return cached;
    return new Response(JSON.stringify({ results: [], total_pages: 1, error: 'Offline' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function fetchAndCache(cache, request) {
  const response = await fetch(request);
  if (response.ok) {
    const stamped = new Response(response.clone().body, {
      status: response.status,
      statusText: response.statusText,
      headers: new Headers({
        ...Object.fromEntries(response.headers.entries()),
        'sw-cached-at': new Date().toISOString(),
      }),
    });
    cache.put(request, stamped);
  }
  return response;
}

async function imagesCacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return new Response('', { status: 404 });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  return cached || fetchPromise || offlineFallback(request);
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || offlineFallback(request);
  }
}

function offlineFallback(request) {
  if (request.destination === 'document') {
    return caches.match('/offline.html');
  }
  return new Response('Offline', { status: 503 });
}

// ── Background sync for reviews ───────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-reviews') {
    event.waitUntil(syncPendingReviews());
  }
});

async function syncPendingReviews() {
  // Placeholder: implement offline review queue sync
  console.log('[SW] Syncing pending reviews...');
}

// ── Push notifications ────────────────────────────────
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const options = {
    body: data.body || 'New content available!',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' },
  };
  event.waitUntil(
    self.registration.showNotification(data.title || 'MovieReview', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});
