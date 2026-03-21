# 🎬 Movie Review System

---

**A production-grade movie discovery and review platform inspired by Netflix and IMDb, built using React and Firebase. The application enables users to explore a vast catalog of 50,000+ movies across all major genres and 30+ languages, powered by real-time data from the TMDb API.**

Users can seamlessly discover content through advanced filtering, explore movies across different languages and regions, and access rich metadata including **trailers, teasers, cast details, ratings, and release information**. The platform also supports personalized user interactions such as writing reviews, managing watchlists, and receiving movie recommendations.

Designed with a modular React architecture and optimized for performance, the system leverages lazy loading, debounced API calls, and client-side caching to ensure fast rendering and smooth navigation. Firebase Authentication enables secure, protected user flows, while LocalStorage provides lightweight persistence for user activity such as reviews and favorites.

The interface is fully responsive and crafted with a focus on intuitive UX, smooth transitions, and reusable components, delivering a polished, streaming-platform-like experience across devices. 🚀

---

## 🚀 Features

* Browse **popular, top-rated, upcoming, and trending movies**
* Watch **trailers and teasers directly within the platform**
* View **detailed cast information** with actor roles
* Explore movies across **30+ languages and multiple regions**
* Filter movies by **genre, language, year, and sorting options**
* Access **complete movie metadata** (ratings, release info, overview)
* Get **personalized recommendations** based on user activity
* Write, delete, and manage **user reviews** (authenticated users)
* Add/remove movies from a **personalized watchlist**
* Track **user activity** (reviews, favorites, engagement)
* **Secure authentication** with protected routes
* Fully **responsive UI** across devices

---

## 🛠️ Tech Stack

**Frontend**

* React.js (Hooks, Context API)
* React Router (dynamic routing)

**Backend / Services**

* Firebase Authentication

**Data & API**

* TMDb API (50,000+ movies across genres & languages)
* Axios (HTTP requests)

**Storage**

* LocalStorage (reviews, favorites, user activity)

**Styling**

* CSS3 (Flexbox, Grid, responsive design)

---

## 📁 Project Structure

```
src/
├── components/      # Reusable UI components
├── pages/           # Application pages
├── services/        # API & Firebase logic
├── context/         # Global state management
├── utils/           # Helper functions
├── App.js
└── index.js
```

---

## 🔌 API Integration

* Integrated **TMDb API** to fetch:

  * Movie listings (popular, top-rated, upcoming, trending)
  * Movies by **genre, language, and region**
  * Detailed metadata (cast, trailers, ratings)
  * Search and **filtered results**
  * Recommendation data based on user interactions

---

## ⚙️ Setup & Installation

1. Clone the repository

```bash
git clone https://github.com/srutinadar26/movie-review-system.git
cd movie-review-system
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file

```env
REACT_APP_FIREBASE_API_KEY=xxx
REACT_APP_FIREBASE_AUTH_DOMAIN=xxx
REACT_APP_FIREBASE_PROJECT_ID=xxx
REACT_APP_FIREBASE_STORAGE_BUCKET=xxx
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=xxx
REACT_APP_FIREBASE_APP_ID=xxx
REACT_APP_TMDB_API_KEY=xxx
```

4. Start the development server

```bash
npm start
```

---

## 🔐 Authentication

* Firebase email/password authentication
* Protected routes for:

  * Reviews
  * Favorites
  * User profile
  * Recommendations

---

## 💾 Data Persistence

* **LocalStorage** used for:

  * Favorites (watchlist)
  * User reviews
  * User activity tracking
* Enables fast access without backend latency

---

## ⚡ Performance Optimizations

* Lazy loading for images
* Route-based code splitting
* Debounced search to reduce API calls
* Memoization to prevent unnecessary re-renders
* Efficient API handling with Axios

---

## 🚀 Deployment

Supported platforms:

* Vercel
* Netlify

---
## 📸 Screenshots

### 🎥 Explore the Experience

| 🏠 Home | 🎬 Trailer |
|--------|-----------|
| ![](./screenshots/Home.png) | ![](./screenshots/Trailer.png) |

| 🎭 Cast | 🎞️ Movies |
|--------|-----------|
| ![](./screenshots/Cast.png) | ![](./screenshots/Movies.png) |

| 🔍 Filter | 🌐 Languages |
|----------|-------------|
| ![](./screenshots/Filter.png) | ![](./screenshots/Languages.png) |

| 👤 Profile | ❤️ Favorites |
|-----------|-------------|
| ![](./screenshots/Profile.png) | ![](./screenshots/Favorites.png) |

| ⭐ Ratings | 📝 Reviews |
|----------|------------|
| ![](./screenshots/Ratings.png) | ![](./screenshots/Reviews.png) |

| 🎯 Recommendations | 📊 Activity |
|------------------|------------|
| ![](./screenshots/Recommendations.png) | ![](./screenshots/Activity.png) |


## 🏆 Highlights

* Handles **large-scale movie data (50K+ records across genres & languages)**
* Implements **advanced filtering and recommendation system**
* Tracks **user activity and engagement**
* Demonstrates **full-stack integration (React + Firebase)**
* Built with **scalable and modular architecture**
* Delivers **production-level UI/UX experience**

---

## 📄 License

For educational and portfolio use.

---
