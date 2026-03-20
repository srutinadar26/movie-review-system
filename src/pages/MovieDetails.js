/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, getMovieTrailers, getImageUrl } from '../services/api';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import { useAuth } from '../context/AuthContext';
import { getReviews, saveReview, deleteReview } from '../utils/storage';
import toast from 'react-hot-toast';
import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [trailers, setTrailers] = useState([]);
  const [trailerError, setTrailerError] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    loadMovieDetails();
    loadReviews();
    loadTrailers();
    
    const handleReviewsUpdated = (event) => {
      if (event.detail.movieId === id) {
        setReviews(event.detail.reviews);
      }
    };
    
    window.addEventListener('reviewsUpdated', handleReviewsUpdated);
    
    return () => {
      window.removeEventListener('reviewsUpdated', handleReviewsUpdated);
    };
  }, [id]);

  const loadMovieDetails = async () => {
    try {
      setLoading(true);
      const data = await getMovieDetails(id);
      setMovie(data);
    } catch (err) {
      setError('Failed to load movie details. Please try again later.');
      console.error('Error loading movie details:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTrailers = async () => {
    try {
      const trailerData = await getMovieTrailers(id);
      setTrailers(trailerData);
      
      if (trailerData.length > 0) {
        const officialTrailer = trailerData.find(t => t.type === 'Trailer' && t.name.toLowerCase().includes('official'));
        setSelectedTrailer(officialTrailer || trailerData[0]);
        setTrailerError(false);
      } else {
        setTrailerError(true);
      }
    } catch (err) {
      console.error('Error loading trailers:', err);
      setTrailerError(true);
    }
  };

  const loadReviews = () => {
    try {
      const movieReviews = getReviews(id);
      setReviews(movieReviews);
    } catch (err) {
      console.error('Error loading reviews:', err);
    }
  };

  const handleAddReview = (review) => {
    if (!currentUser) {
      toast.error('Please login to write a review');
      navigate('/login');
      return;
    }
    
    try {
      // Add username from current user if not provided
      const reviewWithUser = {
        ...review,
        username: currentUser.displayName || currentUser.email,
        userId: currentUser.uid
      };
      
      const savedReview = saveReview(id, reviewWithUser);
      if (savedReview) {
        loadReviews();
        setShowReviewForm(false);
        toast.success('Review posted successfully!');
      }
    } catch (err) {
      console.error('Error saving review:', err);
      toast.error('Failed to post review');
    }
  };

  const handleDeleteReview = (reviewId) => {
    if (!currentUser) {
      toast.error('Please login to delete reviews');
      navigate('/login');
      return;
    }
    
    try {
      const success = deleteReview(id, reviewId);
      if (success) {
        loadReviews();
        toast.success('Review deleted');
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      toast.error('Failed to delete review');
    }
  };

  const handleWriteReviewClick = () => {
    if (!currentUser) {
      toast.error('Please login to write a review');
      navigate('/login');
    } else {
      setShowReviewForm(!showReviewForm);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={loadMovieDetails} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="error-container">
        <p className="error-message">Movie not found</p>
      </div>
    );
  }

  return (
    <div className="movie-details">
      <div className="movie-hero" style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url(${getImageUrl(movie.backdrop_path)})`
      }}>
        <div className="movie-hero-content">
          <div className="movie-poster-large">
            <img 
              src={getImageUrl(movie.poster_path)} 
              alt={movie.title}
              onError={(e) => {
                e.target.src = '/placeholder-image.jpg';
              }}
            />
          </div>
          <div className="movie-hero-info">
            <h1>{movie.title}</h1>
            <div className="movie-meta-large">
              <span className="release-date">
                {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
              </span>
              <span className="runtime">{movie.runtime} min</span>
              <span className="rating">⭐ {movie.vote_average?.toFixed(1)}</span>
            </div>
            <div className="movie-genres">
              {movie.genres?.map(genre => (
                <span key={genre.id} className="genre-tag">{genre.name}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="movie-content">
        <div className="movie-tabs">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'cast' ? 'active' : ''}`}
            onClick={() => setActiveTab('cast')}
          >
            Cast
          </button>
          <button
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({reviews.length})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <h3>Plot</h3>
              <p>{movie.overview || 'No plot summary available.'}</p>
              
              {/* Trailer Section - Public */}
              <div className="trailer-section">
                <h3>
                  {trailers.length > 0 ? 'Trailer & Videos' : 'Videos'}
                  {trailers.length > 0 && (
                    <span className="trailer-count">({trailers.length} available)</span>
                  )}
                </h3>
                
                {trailerError ? (
                  <div className="no-trailer-message">
                    <p>No trailer available for this movie.</p>
                    <p className="trailer-note">Check back later or visit YouTube directly.</p>
                  </div>
                ) : selectedTrailer ? (
                  <>
                    {trailers.length > 1 && (
                      <div className="trailer-selector">
                        <label htmlFor="trailer-select">Select Version: </label>
                        <select
                          id="trailer-select"
                          value={selectedTrailer.key}
                          onChange={(e) => {
                            const selected = trailers.find(t => t.key === e.target.value);
                            setSelectedTrailer(selected);
                          }}
                        >
                          {trailers.map(trailer => (
                            <option key={trailer.key} value={trailer.key}>
                              {trailer.name} ({trailer.type})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    <div className="trailer-container">
                      <iframe
                        src={`https://www.youtube.com/embed/${selectedTrailer.key}?rel=0&modestbranding=1&autoplay=0`}
                        title={selectedTrailer.name}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          )}

          {activeTab === 'cast' && (
            <div className="cast-tab">
              <h3>Cast</h3>
              <div className="cast-grid">
                {movie.credits?.cast?.slice(0, 12).map(actor => (
                  <div key={actor.id} className="cast-card">
                    <img
                      src={getImageUrl(actor.profile_path)}
                      alt={actor.name}
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                    <h4>{actor.name}</h4>
                    <p>{actor.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-tab">
              {/* Write Review Button - Shows login prompt if not authenticated */}
              <div className="review-action">
                {!currentUser ? (
                  <div className="login-prompt">
                    <p>Want to write a review? </p>
                    <button 
                      className="login-to-review-btn"
                      onClick={() => navigate('/login')}
                    >
                      Login to Write Review
                    </button>
                  </div>
                ) : (
                  <button 
                    className="write-review-btn"
                    onClick={handleWriteReviewClick}
                  >
                    {showReviewForm ? 'Cancel' : 'Write a Review'}
                  </button>
                )}
              </div>

              {/* Review Form - Only shown when logged in and toggled */}
              {showReviewForm && currentUser && (
                <ReviewForm movieId={id} onSubmit={handleAddReview} />
              )}
              
              {/* Review List - Public */}
              <ReviewList 
                reviews={reviews} 
                onDelete={handleDeleteReview}
                currentUser={currentUser}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;