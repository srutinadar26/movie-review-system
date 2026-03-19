import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './MovieCard.css';

const MovieCard = ({ movie, onAddToFavorites, isFavorite }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  const handleFavoriteClick = () => {
    if (!currentUser) {
      toast.error('Please login to add movies to favorites');
      navigate('/login');
      return;
    }
    onAddToFavorites(movie);
  };

  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          loading="lazy"
        />
        <div className="movie-overlay">
          <Link to={`/movie/${movie.id}`} className="view-details-btn">
            View Details
          </Link>
        </div>
      </div>
      
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-meta">
          <span className="movie-year">{releaseYear}</span>
          <span className="movie-rating">⭐ {rating}</span>
        </div>
        <p className="movie-description">
          {movie.overview ? movie.overview.substring(0, 100) + '...' : 'No description available'}
        </p>
        <button
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
        >
          {isFavorite ? '★ Remove from Favorites' : '☆ Add to Favorites'}
        </button>
      </div>
    </div>
  );
};

export default MovieCard;