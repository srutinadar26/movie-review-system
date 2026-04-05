// src/pages/Favorites.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getFavorites, removeFromFavorites } from '../utils/storage';
import toast from 'react-hot-toast';
import './Favorites.css';

const Favorites = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      toast.error('Please login to view your favorites');
      navigate('/login');
      return;
    }
    loadFavorites();
  }, [currentUser, navigate]);

  const loadFavorites = () => {
    setLoading(true);
    const favs = getFavorites();
    console.log('Favorites loaded:', favs); // Debug log
    setFavorites(favs);
    setLoading(false);
  };

  const handleRemoveFromFavorites = (movie) => {
    removeFromFavorites(movie.id);
    loadFavorites();
    toast.success('Removed from favorites');
  };

  if (loading) {
    return (
      <div className="favorites">
        <h1>My Favorites</h1>
        <div className="favorites-loading">
          <div className="loading-spinner"></div>
          <p>Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites">
      <h1>My Favorites</h1>
      
      {favorites.length === 0 ? (
        <div className="empty-favorites">
          <p>Your favorites list is empty</p>
          <p>Browse movies and click the ☆ button to add them here!</p>
          <button 
            className="browse-movies-btn"
            onClick={() => navigate('/')}
          >
            Browse Movies
          </button>
        </div>
      ) : (
        <>
          <p className="favorites-count">
            You have {favorites.length} {favorites.length === 1 ? 'movie' : 'movies'} in your favorites
          </p>
          <div className="favorites-grid">
            {favorites.map(movie => (
              <div key={movie.id} className="favorite-movie-card">
                <div className="movie-poster">
                  {movie.poster_path ? (
                    <img 
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                      alt={movie.title}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>
                <div className="movie-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  <div className="movie-meta">
                    <span className="movie-year">
                      {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                    </span>
                    <span className="movie-rating">
                      ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                    </span>
                  </div>
                  <button 
                    className="remove-favorite-btn"
                    onClick={() => handleRemoveFromFavorites(movie)}
                  >
                    Remove from Favorites
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Favorites;