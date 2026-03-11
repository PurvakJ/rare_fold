import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { apiGet, apiPost } from '../utils/api';
import { FaStar, FaRegStar, FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';
import '../styles/Reviews.css';

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filterRating, setFilterRating] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();

  const watchRating = watch('rating');

  useEffect(() => {
    loadReviews();
  }, []);

  useEffect(() => {
    if (watchRating) {
      setSelectedRating(parseInt(watchRating));
    }
  }, [watchRating]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await apiGet('testimonials');
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (formData) => {
    try {
      setSubmitting(true);
      await apiPost({
        action: 'addReview',
        ...formData,
        rating: parseInt(formData.rating)
      });
      toast.success('Review submitted successfully! Thank you for your feedback.');
      reset();
      setSelectedRating(0);
      setShowForm(false);
      loadReviews();
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingCount = (rating) => {
    return reviews.filter(review => review.rating === rating).length;
  };

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter(review => filterRating === 0 || review.rating === filterRating)
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === 'highest') {
        return b.rating - a.rating;
      } else if (sortBy === 'lowest') {
        return a.rating - b.rating;
      }
      return 0;
    });

  const handleRatingClick = (rating) => {
    setSelectedRating(rating);
    setValue('rating', rating.toString());
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh' 
      }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="reviews-page">
      {/* Hero Section */}
      <section className="reviews-hero">
        <div className="container">
          <h1 className="reviews-hero-title">Client Love</h1>
          <p className="reviews-hero-subtitle">
            Read what our customers have to say about their experience with us
          </p>
        </div>
      </section>

      {/* Stats Section */}
      {reviews.length > 0 && (
        <section className="reviews-stats">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{reviews.length}</div>
                <div className="stat-label">Total Reviews</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{getAverageRating()}</div>
                <div className="stat-label">Average Rating</div>
                <div className="stat-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="star">
                      {star <= Math.round(getAverageRating()) ? '★' : '☆'}
                    </span>
                  ))}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{reviews.filter(r => r.rating === 5).length}</div>
                <div className="stat-label">5-Star Reviews</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Rating Distribution */}
      {reviews.length > 0 && (
        <section className="rating-distribution">
          <div className="container">
            <h2 className="section-subtitle">Rating Distribution</h2>
            <div className="distribution-bars">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = getRatingCount(rating);
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div 
                    key={rating} 
                    className="distribution-bar"
                    onClick={() => setFilterRating(filterRating === rating ? 0 : rating)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="bar-label">
                      <span className="rating-text">{rating} Stars</span>
                      <span className="rating-count">({count})</span>
                    </div>
                    <div className="bar-container">
                      <div 
                        className="bar-fill"
                        style={{ 
                          width: `${percentage}%`,
                          background: filterRating === rating ? 'var(--color-link)' : '#aa8d74'
                        }}
                      />
                    </div>
                    <span className="bar-percentage">{Math.round(percentage)}%</span>
                  </div>
                );
              })}
            </div>
            {filterRating > 0 && (
              <button 
                className="button -outline clear-filter"
                onClick={() => setFilterRating(0)}
                style={{ marginTop: '20px' }}
              >
                Clear Filter
              </button>
            )}
          </div>
        </section>
      )}

      {/* Review Form Toggle */}
      <section className="review-form-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <button 
              className={`button ${showForm ? '-outline' : ''}`}
              onClick={() => setShowForm(!showForm)}
              style={{ minWidth: '200px' }}
            >
              {showForm ? 'Cancel' : 'Write a Review'}
            </button>
          </div>

          {/* Review Form */}
          {showForm && (
            <div className="review-form-container">
              <h2 className="form-title">Share Your Experience</h2>
              <p className="form-subtitle">
                Your feedback helps us improve and helps other couples make their decision
              </p>
              
              <form onSubmit={handleSubmit(onSubmit)} className="review-form">
                {/* Hidden input for rating */}
                <input 
                  type="hidden" 
                  {...register('rating', { required: 'Please select a rating' })} 
                />

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Your Name *</label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className={`form-input ${errors.name ? 'error' : ''}`}
                      {...register('name', { required: 'Name is required' })}
                    />
                    {errors.name && <span className="error-message">{errors.name.message}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Your Email *</label>
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Please enter a valid email address'
                        }
                      })}
                    />
                    {errors.email && <span className="error-message">{errors.email.message}</span>}
                  </div>
                </div>

                {/* Single Line Star Rating */}
                <div className="form-group">
                  <label className="form-label">Your Rating *</label>
                  <div className="single-line-rating">
                    <div className="rating-stars-container">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`rating-star ${star <= (hoverRating || selectedRating) ? 'active' : ''}`}
                          onClick={() => handleRatingClick(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                        >
                          {star <= (hoverRating || selectedRating) ? <FaStar /> : <FaRegStar />}
                        </span>
                      ))}
                    </div>
                  </div>
                  {errors.rating && <span className="error-message">{errors.rating.message}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Your Review *</label>
                  <textarea
                    rows="5"
                    placeholder="Tell us about your experience..."
                    className={`form-textarea ${errors.description ? 'error' : ''}`}
                    {...register('description', { 
                      required: 'Review is required',
                      minLength: {
                        value: 20,
                        message: 'Please write at least 20 characters'
                      },
                      maxLength: {
                        value: 1000,
                        message: 'Review cannot exceed 1000 characters'
                      }
                    })}
                  />
                  {errors.description && <span className="error-message">{errors.description.message}</span>}
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="button submit-button"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Filters and Sort */}
      {reviews.length > 0 && (
        <section className="reviews-filters">
          <div className="container">
            <div className="filters-bar">
              <div className="sort-select">
                <label htmlFor="sort">Sort by:</label>
                <select 
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-dropdown"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                </select>
              </div>
              <div className="results-count">
                Showing {filteredReviews.length} of {reviews.length} reviews
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Reviews Grid */}
      <section className="reviews-grid-section">
        <div className="container">
          {filteredReviews.length === 0 ? (
            <div className="no-reviews">
              <FaQuoteLeft className="quote-icon" />
              <p className="no-reviews-text">
                {reviews.length === 0 
                  ? "No reviews yet. Be the first to share your experience!" 
                  : "No reviews match the selected filter."}
              </p>
              {reviews.length === 0 && (
                <button 
                  className="button"
                  onClick={() => setShowForm(true)}
                >
                  Write First Review
                </button>
              )}
            </div>
          ) : (
            <div className="reviews-grid">
              {filteredReviews.map((review, index) => (
                <div key={index} className="review-card">
                  <div className="review-card-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="reviewer-name">{review.name}</h3>
                        <div className="review-date">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="review-rating">
                      {[...Array(review.rating)].map((_, i) => (
                        <FaStar key={i} className="star filled" />
                      ))}
                      {[...Array(5 - review.rating)].map((_, i) => (
                        <FaRegStar key={i} className="star" />
                      ))}
                    </div>
                  </div>
                  
                  <div className="review-card-body">
                    <FaQuoteLeft className="quote-left" />
                    <p className="review-content">{review.description}</p>
                    <FaQuoteRight className="quote-right" />
                  </div>
                  
                  {review.rating === 5 && (
                    <div className="review-badge">
                      ⭐ Top Review
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Reviews;