import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { apiGet, apiPost } from '../utils/api';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { FaStar, FaRegStar } from 'react-icons/fa';
import './Home.css'; // Make sure to import the CSS

function Home() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  
  // Review form states
  const [submitting, setSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();

  const watchRating = watch('rating');

  useEffect(() => {
    if (watchRating) {
      setSelectedRating(parseInt(watchRating));
    }
  }, [watchRating]);

  // High-quality fashion images from Unsplash
  const carouselImages = [
    {
      url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      alt: 'Street style fashion',
      caption: 'Urban Elegance'
    },
    {
      url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
      alt: 'Luxury fashion model',
      caption: 'Luxury Redefined'
    },
    {
      url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      alt: 'Casual wear collection',
      caption: 'Casual Comfort'
    },
    {
      url: 'https://images.unsplash.com/photo-1467043237213-65f2da53396f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      alt: 'Designer outfit',
      caption: 'Designer Collection'
    },
    {
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCftY7vo0xR1YjorUQPvtas2gyTl7Gmyu94w&s',
      alt: 'Shopping lifestyle',
      caption: 'Shop the Look'
    },
    {
      url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      alt: 'Clothing rack',
      caption: 'New Arrivals'
    },
    {
      url: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      alt: 'Fashion accessories',
      caption: 'Statement Accessories'
    }
  ];

  // Featured collection covers
  const collectionCovers = [
    {
      url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: 'Summer Essentials'
    },
    {
      url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: 'Urban Collection'
    },
    {
      url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
      title: 'Evening Wear'
    },
    {
      url: 'https://images.unsplash.com/photo-1467043237213-65f2da53396f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: 'Minimalist Line'
    }
  ];

  // Three featured fashion images with captions at different positions
  const featuredImages = [
    {
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKgYkJ25grAGjTcVRyxzb-kW9dzXMahVp8fg&s',
      alt: 'Stylish outfit',
      caption: 'Street Style',
      position: 'left'
    },
    {
      url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      alt: 'Casual elegance',
      caption: 'Casual Chic',
      position: 'center'
    },
    {
      url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      alt: 'Even wear',
      caption: 'Evening Glam',
      position: 'right'
    }
  ];

  // Carousel settings
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    fade: true,
    cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    appendDots: dots => (
      <div style={{ position: 'absolute', bottom: '30px', width: '100%', zIndex: 10 }}>
        <ul style={{ margin: '0', display: 'flex', justifyContent: 'center', gap: '10px' }}> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <div
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: i === currentSlide ? '#fff' : 'rgba(255,255,255,0.5)',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
      />
    )
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Fetch collections data
      const collectionsData = await apiGet('collections');
      setCollections(Array.isArray(collectionsData) ? collectionsData : []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingClick = (rating) => {
    setSelectedRating(rating);
    setValue('rating', rating.toString());
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
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Carousel Section */}
      <section className="hero-carousel">
        <Slider ref={sliderRef} {...carouselSettings}>
          {carouselImages.map((image, index) => (
            <div key={index} className="carousel-slide">
              <div 
                className="carousel-image"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${image.url})`,
                }}
              />
              <div className="carousel-caption">
                <h2>{image.caption}</h2>
                <p>Discover the latest trends and timeless styles at theRareFold</p>
                <a 
                  href="https://therarefoldinshop.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="button carousel-button"
                >
                  Shop Now
                </a>
              </div>
            </div>
          ))}
        </Slider>

        {/* Custom navigation arrows */}
        <button 
          onClick={() => sliderRef.current?.slickPrev()}
          className="carousel-arrow prev"
        >
          ←
        </button>
        <button 
          onClick={() => sliderRef.current?.slickNext()}
          className="carousel-arrow next"
        >
          →
        </button>

        {/* Slide counter */}
        <div className="slide-counter">
          {currentSlide + 1} / {carouselImages.length}
        </div>
      </section>

      {/* Welcome Section */}
      <section className="section">
        <div className="container">
          <div className="welcome-content">
            <h1>Define Your Style with theRareFold</h1>
            <p>
              Welcome to theRareFold, where fashion meets individuality. We curate 
              clothing that speaks to your unique style—whether you're looking for 
              everyday essentials or statement pieces that turn heads. Based in Toronto, 
              we bring global trends to your doorstep with quality and comfort at the forefront.
            </p>
          </div>
        </div>
      </section>

      {/* Three Featured Images Section with Varied Caption Positions */}
      <section className="section accent-bg">
        <div className="container">
          <h2 className="section-title">Featured Styles</h2>
          <div className="featured-grid">
            {featuredImages.map((image, index) => (
              <div 
                key={index} 
                className={`featured-card featured-${image.position}`}
              >
                <div className="featured-image-wrapper">
                  <img 
                    src={image.url} 
                    alt={image.alt}
                    className="featured-image"
                  />
                  <div className={`featured-caption caption-${image.position}`}>
                    <h3>{image.caption}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider thick" />

      {/* About Section with Image */}
      <section className="section">
        <div className="container">
          <div className="about-grid">
            <div className="about-content">
              <h2>More Than Just Clothing</h2>
              <blockquote>
                <p>theRareFold is where style meets substance.</p>
              </blockquote>
              <p>
                We believe that what you wear is an expression of who you are. 
                Our collections are carefully curated to help you tell your story 
                through fashion. From timeless classics to bold contemporary pieces, 
                we bring you quality fabrics, impeccable designs, and styles that 
                make you feel confident every day.
              </p>
            </div>
            <div className="about-image">
              <div className="image-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                  alt="Clothing collection"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      {collections.length > 0 && (
        <section className="section accent-bg">
          <div className="container">
            <h2 className="section-title">Featured Collections</h2>
            <div className="collections-grid">
              {collections.slice(0, 3).map((collection, index) => (
                <Link to={`/collection/${collection.id}`} key={collection.id} className="collection-card">
                  <div className="collection-image">
                    <img 
                      src={collectionCovers[index % collectionCovers.length].url}
                      alt={collection.name}
                    />
                  </div>
                  <div className="collection-info">
                    <h3>{collection.name}</h3>
                    <p className="collection-description">
                      {collection.description || 'Discover our latest collection'}
                    </p>
                    <span className="view-collection">
                      Shop Collection →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center">
              <Link to="/collections" className="button">
                View All Collections
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-grid">
            <div className="cta-image">
              <img 
                src="https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                alt="Fashion model"
              />
            </div>
            <div className="cta-content">
              <h2>Stay Ahead of the Trends</h2>
              <p>
                Subscribe to our newsletter and be the first to know about new arrivals, 
                exclusive offers, and style inspiration. Join the theRareFold community today.
              </p>
              <Link to="/contact" className="button">
                Subscribe Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Review Form Section */}
      <section className="section review-form-section">
        <div className="container">
          <div className="review-form-header">
            <h2 className="section-title">Share Your Experience</h2>
            <p className="section-subtitle">
              We value your feedback! Let us know about your experience with theRareFold.
            </p>
          </div>

          <div className="review-form-container">
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
                  placeholder="Tell us about your experience with our products and service..."
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
        </div>
      </section>
    </div>
  );
}

export default Home;