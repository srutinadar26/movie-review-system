import React, { useState, useEffect } from 'react';
import './ReviewList.css';

const ReviewList = ({ reviews = [], onDelete, currentUser }) => {
  const [sortedReviews, setSortedReviews] = useState([]);

  useEffect(() => {
    // Sort reviews by date (newest first)
    if (reviews && reviews.length > 0) {
      const sorted = [...reviews].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      setSortedReviews(sorted);
    } else {
      setSortedReviews([]);
    }
  }, [reviews]);

  // Calculate average rating
  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  // Get rating distribution
  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const averageRating = calculateAverageRating();
  const totalReviews = reviews.length;
  const distribution = getRatingDistribution();

  // Function to render stars
  const renderStars = (rating) => {
    return (
      <span className="review-rating">
        {[...Array(5)].map((_, index) => (
          <span key={index} className={index < rating ? 'star-filled' : 'star-empty'}>
            ★
          </span>
        ))}
      </span>
    );
  };

  // Check if current user owns this review
  const canDeleteReview = (review) => {
    return currentUser && (
      review.userId === currentUser.uid || 
      review.username === currentUser.displayName ||
      review.username === currentUser.email
    );
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="reviews-section">
        <div className="reviews-header">
          <h3>User Reviews</h3>
        </div>
        <div className="no-reviews">
          <p>No reviews yet. Be the first to review this movie!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h3>User Reviews</h3>
        <div className="rating-summary">
          <div className="average-rating">
            <span className="rating-number">{averageRating}</span>
            <span className="rating-max">/5</span>
            <div className="rating-stars">
              {renderStars(Math.round(averageRating))}
            </div>
            <span className="total-reviews">({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})</span>
          </div>
          
          {/* Rating Distribution */}
          <div className="rating-distribution">
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className="distribution-row">
                <span className="star-label">{star} ★</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${totalReviews > 0 ? (distribution[star] / totalReviews) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
                <span className="distribution-count">{distribution[star]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="reviews-list">
        {sortedReviews.map((review, index) => (
          <div key={review.id || index} className="review-item">
            <div className="review-header">
              <div className="reviewer-info">
                <span className="review-username">{review.username}</span>
                {renderStars(review.rating)}
              </div>
              <span className="review-date">{review.date}</span>
            </div>
            
            <p className="review-comment">{review.comment}</p>
            
            {/* Only show delete button if user owns this review */}
            {canDeleteReview(review) && (
              <button
                className="delete-review"
                onClick={() => onDelete(review.id || index)}
                title="Delete review"
              >
                Delete My Review
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;