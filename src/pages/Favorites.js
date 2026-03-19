import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
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
    // Redirect if not logged in
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
        <div className="favorites-loading">Loading your favorites...</div>
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
              <MovieCard
                key={movie.id}
                movie={movie}
                onAddToFavorites={handleRemoveFromFavorites}
                isFavorite={true}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Favorites;