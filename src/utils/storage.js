// src/utils/storage.js

// Favorites storage
const FAVORITES_KEY = 'movie_favorites';
const REVIEWS_KEY = 'movie_reviews';

// ============= FAVORITES FUNCTIONS =============
export const getFavorites = () => {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const addToFavorites = (movie) => {
  try {
    const favorites = getFavorites();
    if (!favorites.some(fav => fav.id === movie.id)) {
      favorites.push(movie);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return false;
  }
};

export const removeFromFavorites = (movieId) => {
  try {
    const favorites = getFavorites();
    const updated = favorites.filter(movie => movie.id !== movieId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return false;
  }
};

export const isFavorite = (movieId) => {
  const favorites = getFavorites();
  return favorites.some(movie => movie.id === movieId);
};

// ============= REVIEWS FUNCTIONS =============
export const getReviews = (movieId) => {
  try {
    const allReviews = localStorage.getItem(REVIEWS_KEY);
    const reviews = allReviews ? JSON.parse(allReviews) : {};
    return reviews[movieId] || [];
  } catch (error) {
    console.error('Error getting reviews:', error);
    return [];
  }
};

export const saveReview = (movieId, review) => {
  try {
    const allReviews = localStorage.getItem(REVIEWS_KEY);
    const reviews = allReviews ? JSON.parse(allReviews) : {};
    
    if (!reviews[movieId]) {
      reviews[movieId] = [];
    }
    
    // Add unique ID to each review
    const newReview = {
      ...review,
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    
    reviews[movieId].push(newReview);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    
    // Dispatch a custom event so other components can listen for changes
    window.dispatchEvent(new CustomEvent('reviewsUpdated', { 
      detail: { movieId, reviews: reviews[movieId] } 
    }));
    
    return newReview;
  } catch (error) {
    console.error('Error saving review:', error);
    return null;
  }
};

export const deleteReview = (movieId, reviewId) => {
  try {
    const allReviews = localStorage.getItem(REVIEWS_KEY);
    const reviews = allReviews ? JSON.parse(allReviews) : {};
    
    if (reviews[movieId]) {
      reviews[movieId] = reviews[movieId].filter(review => review.id !== reviewId);
      
      if (reviews[movieId].length === 0) {
        delete reviews[movieId];
      }
      
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
      
      // Dispatch a custom event
      window.dispatchEvent(new CustomEvent('reviewsUpdated', { 
        detail: { movieId, reviews: reviews[movieId] || [] } 
      }));
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting review:', error);
    return false;
  }
};

export const getAllReviews = () => {
  try {
    const allReviews = localStorage.getItem(REVIEWS_KEY);
    return allReviews ? JSON.parse(allReviews) : {};
  } catch (error) {
    console.error('Error getting all reviews:', error);
    return {};
  }
};