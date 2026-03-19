import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getFavorites } from '../utils/storage';
import { getMovieDetails } from '../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const { currentUser } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [userStats, setUserStats] = useState({
    favoritesCount: 0,
    reviewsCount: 0,
    averageRating: 0,
    totalWatchTime: 0,
    favoriteGenre: 'Action',
    reviews: []
  });
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [memberSince, setMemberSince] = useState('');

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
      loadUserStats();
      formatMemberSince();
    }
  }, [currentUser]);

  const formatMemberSince = () => {
    try {
      // Try to get from metadata
      if (currentUser?.metadata?.creationTime) {
        const date = new Date(currentUser.metadata.creationTime);
        if (!isNaN(date.getTime())) {
          setMemberSince(date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }));
          return;
        }
      }
      
      // Try from Firebase timestamp
      if (currentUser?.metadata?.createdAt) {
        const date = new Date(parseInt(currentUser.metadata.createdAt));
        if (!isNaN(date.getTime())) {
          setMemberSince(date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }));
          return;
        }
      }
      
      // Fallback to current date
      setMemberSince(new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }));
    } catch (error) {
      console.error('Error formatting date:', error);
      setMemberSince(new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }));
    }
  };

  const loadUserStats = async () => {
    setLoadingReviews(true);
    
    // Get favorites count
    const favorites = getFavorites();
    
    // Get all reviews from localStorage
    const allReviews = localStorage.getItem('movie_reviews');
    const reviewsData = allReviews ? JSON.parse(allReviews) : {};
    
    // Filter reviews by current user
    const userReviews = [];
    let totalRating = 0;
    
    // Collect all movie IDs to fetch
    const movieIds = [];
    Object.keys(reviewsData).forEach(movieId => {
      const movieReviews = reviewsData[movieId];
      movieReviews.forEach(review => {
        if (review.username === currentUser?.displayName || 
            review.username === currentUser?.email ||
            review.userId === currentUser?.uid) {
          userReviews.push({
            ...review,
            movieId,
            movieTitle: `Movie ${movieId}`,
            moviePoster: null
          });
          totalRating += review.rating;
          if (!movieIds.includes(movieId)) {
            movieIds.push(movieId);
          }
        }
      });
    });

    // Fetch movie details for each unique movie ID
    const movieDetailsMap = {};
    await Promise.all(
      movieIds.map(async (movieId) => {
        try {
          const movieData = await getMovieDetails(movieId);
          movieDetailsMap[movieId] = {
            title: movieData.title,
            poster: movieData.poster_path,
            year: movieData.release_date?.split('-')[0] || 'N/A'
          };
        } catch (error) {
          console.error(`Error fetching movie ${movieId}:`, error);
          movieDetailsMap[movieId] = {
            title: `Movie ${movieId}`,
            poster: null,
            year: 'N/A'
          };
        }
      })
    );

    // Update reviews with actual movie titles
    const updatedReviews = userReviews.map(review => ({
      ...review,
      movieTitle: movieDetailsMap[review.movieId]?.title || `Movie ${review.movieId}`,
      movieYear: movieDetailsMap[review.movieId]?.year,
      moviePoster: movieDetailsMap[review.movieId]?.poster
    }));

    // Calculate average rating
    const avgRating = updatedReviews.length > 0 
      ? (totalRating / updatedReviews.length).toFixed(1) 
      : 0;

    setUserStats({
      favoritesCount: favorites.length,
      reviewsCount: updatedReviews.length,
      averageRating: avgRating,
      totalWatchTime: updatedReviews.length * 2.5,
      favoriteGenre: 'Action',
      reviews: updatedReviews.sort((a, b) => new Date(b.date) - new Date(a.date))
    });

    setLoadingReviews(false);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message);
    }

    setLoading(false);
  };

  if (!currentUser) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <p>Please log in to view your profile.</p>
          <Link to="/login" className="login-btn">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0)}
        </div>
        <h1>{currentUser.displayName || 'User'}</h1>
        <p>{currentUser.email}</p>
        <p className="member-since">
          Member since {memberSince}
        </p>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile Settings
        </button>
        <button 
          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          My Stats
        </button>
        <button 
          className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          My Reviews ({userStats.reviewsCount})
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'profile' && (
          <div className="profile-settings">
            <h2>Profile Settings</h2>
            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your display name"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={currentUser.email}
                  disabled
                  className="disabled-input"
                />
                <small>Email cannot be changed</small>
              </div>

              <button type="submit" className="save-button" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="profile-stats">
            <h2>Your Movie Stats</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-number">{userStats.reviewsCount}</span>
                <span className="stat-label">Reviews Written</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{userStats.favoritesCount}</span>
                <span className="stat-label">Movies in Favorites</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{userStats.averageRating}</span>
                <span className="stat-label">Average Rating</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{Math.round(userStats.totalWatchTime)}</span>
                <span className="stat-label">Hours Watched</span>
              </div>
            </div>

            <div className="stats-details">
              <h3>Rating Distribution</h3>
              <div className="rating-distribution">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = userStats.reviews.filter(r => Math.round(r.rating) === star).length;
                  const percentage = userStats.reviewsCount > 0 
                    ? (count / userStats.reviewsCount) * 100 
                    : 0;
                  
                  return (
                    <div key={star} className="distribution-row">
                      <span className="star-label">{star} ★</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="distribution-count">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="profile-activity">
            <h2>Your Reviews</h2>
            {loadingReviews ? (
              <div className="loading-reviews">Loading your reviews...</div>
            ) : userStats.reviews.length > 0 ? (
              <div className="reviews-list">
                {userStats.reviews.map((review, index) => (
                  <div key={index} className="review-item">
                    <div className="review-header">
                      <div className="review-movie-info">
                        <Link to={`/movie/${review.movieId}`} className="movie-link">
                          <h4>{review.movieTitle}</h4>
                          {review.movieYear && <span className="movie-year">{review.movieYear}</span>}
                        </Link>
                        <div className="review-rating">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span 
                              key={star} 
                              className={star <= review.rating ? 'star-filled' : 'star-empty'}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="review-date">{review.date}</span>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-activity">No reviews yet. Start reviewing movies!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;