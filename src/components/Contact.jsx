import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { apiPost } from '../utils/api';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import '../styles/Contact.css';

function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setRateLimitError(false);
      
      // Send data to the backend - matches the structure in code.gs
      const response = await apiPost({
        action: 'contact',
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        interest: formData.interest || '', // This maps to 'package' in the backend
        message: formData.message,
        timestamp: new Date().toISOString()
      });

      // Check if response indicates success
      if (response && response.success) {
        setSubmitSuccess(true);
        toast.success('Message sent successfully! We\'ll get back to you soon.');
        reset();
        
        // Reset success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        // Handle specific error cases
        if (response?.error === 'email_limit_exceeded') {
          setRateLimitError(true);
          toast.error('You\'ve reached the message limit. Please try again later or contact us directly.');
        } else if (response?.error === 'duplicate_message') {
          toast.error('You\'ve already sent a similar message. Please wait for our response.');
        } else {
          toast.error(response?.message || 'Failed to send message');
        }
      }
    } catch (error) {
      console.error('Contact form error:', error);
      
      // Handle different error types
      if (error.response?.status === 429) {
        setRateLimitError(true);
        toast.error('Too many messages. Please wait before trying again.');
      } else if (error.response?.data?.error === 'email_already_used') {
        toast.error('This email has already been used. Please use a different email or contact us directly.');
      } else if (error.response?.data?.error === 'rate_limit_exceeded') {
        setRateLimitError(true);
        toast.error('Message limit reached. Please try again in 24 hours.');
      } else {
        toast.error('Network error. Please check your connection and try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle manual retry
  const handleRetry = () => {
    setRateLimitError(false);
    setSubmitSuccess(false);
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <h1 className="contact-hero-title">Let's Connect & Create</h1>
          <p className="contact-hero-subtitle">
            Ready to elevate your style? Get in touch with theRareFold to discuss 
            your fashion journey and how we can help you express your unique identity.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="contact-info-section">
        <div className="container">
          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon">
                <FaPhone />
              </div>
              <h3 className="info-title">Call Us</h3>
              <p className="info-content">
                <a href="tel:7986337325">7986337325</a>
              </p>
              <p className="info-note">Mon-Sat, 9am-6pm</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <FaEnvelope />
              </div>
              <h3 className="info-title">Email Us</h3>
              <p className="info-content">
                <a href="mailto:officialtherarefoldin@gmail.com">officialtherarefoldin@gmail.com</a>
              </p>
              <p className="info-note">24/7 Support</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <FaMapMarkerAlt />
              </div>
              <h3 className="info-title">Visit Us</h3>
              <p className="info-content">
                Adalat Bazar, Patiala, 147001
              </p>
              <p className="info-note">By appointment only</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <FaClock />
              </div>
              <h3 className="info-title">Store Hours</h3>
              <p className="info-content">
                Monday - Saturday: 10am-7pm<br />
                Sunday: By Appointment
              </p>
              <p className="info-note">Private styling sessions available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Contact Form Section */}
      <section className="contact-form-section">
        <div className="container">
          <div className="contact-grid">
            {/* Left Column - Image */}
            <div className="contact-image-col">
              <div className="contact-image-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                  alt="Fashion styling"
                  className="contact-image"
                />
                <div className="image-overlay">
                  <h3 className="overlay-title">Your Style Journey</h3>
                  <p className="overlay-text">
                    Every outfit tells a story. Let us help you express yours through exceptional fashion.
                  </p>
                </div>
              </div>
              
              <div className="contact-testimonial">
                <div className="testimonial-quote">"</div>
                <p className="testimonial-text">
                  theRareFold transformed my wardrobe. Their attention to detail and 
                  personalized styling exceeded all my expectations.
                </p>
                <div className="testimonial-author">
                  <strong>- Jessica Chen</strong>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="contact-form-col">
              <div className="form-header">
                <h2 className="form-title">Send us a Message</h2>
                <p className="form-subtitle">
                  Fill out the form below and we'll get back to you within 24 hours
                </p>
              </div>

              {/* Success Message */}
              {submitSuccess && (
                <div className="success-message">
                  <FaCheckCircle className="success-icon" />
                  <div className="success-content">
                    <h4>Message Sent Successfully!</h4>
                    <p>We'll get back to you within 24 hours. Check your email for a confirmation.</p>
                  </div>
                </div>
              )}

              {/* Rate Limit Error Message */}
              {rateLimitError && (
                <div className="rate-limit-error">
                  <h4>Message Limit Reached</h4>
                  <p>You've reached the maximum number of messages. Please try one of these alternatives:</p>
                  <ul>
                    <li>Call us directly: <strong>437-973-4414</strong></li>
                    <li>Email us: <strong>hello@therarefold.com</strong></li>
                    <li>Try again in 24 hours</li>
                  </ul>
                  <button onClick={handleRetry} className="retry-button">
                    Try Again Later
                  </button>
                </div>
              )}

              {/* Contact Form */}
              {!rateLimitError && (
                <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
                  {/* Name Field */}
                  <div className="form-group">
                    <label className="form-label">
                      Your Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className={`form-input ${errors.name ? 'error' : ''}`}
                      {...register('name', { 
                        required: 'Name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters'
                        },
                        maxLength: {
                          value: 100,
                          message: 'Name cannot exceed 100 characters'
                        }
                      })}
                    />
                    {errors.name && (
                      <span className="error-message">{errors.name.message}</span>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="form-group">
                    <label className="form-label">
                      Email Address <span className="required">*</span>
                    </label>
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
                    {errors.email && (
                      <span className="error-message">{errors.email.message}</span>
                    )}
                    <small className="field-note">
                      We'll never share your email with anyone else.
                    </small>
                  </div>

                  {/* Phone Field - matches the phone field in code.gs */}
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="Enter your phone number (optional)"
                      className="form-input"
                      {...register('phone')}
                    />
                    {errors.phone && (
                      <span className="error-message">{errors.phone.message}</span>
                    )}
                  </div>

                  {/* Interest Selection - this maps to 'package' in the backend */}
                  <div className="form-group">
                    <label className="form-label">I'm interested in</label>
                    <select 
                      className="form-select"
                      {...register('interest')}
                    >
                      <option value="">Select an option (Optional)</option>
                      <option value="mens">Men's Collection</option>
                      <option value="womens">Women's Collection</option>
                      <option value="accessories">Accessories</option>
                      <option value="styling">Personal Styling</option>
                      <option value="collaboration">Collaboration</option>
                      <option value="general">General Inquiry</option>
                    </select>
                  </div>

                  {/* Message Field */}
                  <div className="form-group">
                    <label className="form-label">
                      Your Message <span className="required">*</span>
                    </label>
                    <textarea
                      rows="6"
                      placeholder="Tell us about your style preferences, questions, or what you're looking for..."
                      className={`form-textarea ${errors.message ? 'error' : ''}`}
                      {...register('message', { 
                        required: 'Message is required',
                        minLength: {
                          value: 20,
                          message: 'Please provide more details (at least 20 characters)'
                        },
                        maxLength: {
                          value: 2000,
                          message: 'Message cannot exceed 2000 characters'
                        }
                      })}
                    />
                    {errors.message && (
                      <span className="error-message">{errors.message.message}</span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className="submit-button"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-small"></span>
                          Sending...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="button-icon" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>

                  {/* Privacy Notice */}
                  <div className="privacy-notice">
                    <p>
                      By submitting this form, you agree to our 
                      <a href="/privacy" rel="noopener noreferrer"> Privacy Policy</a> and 
                      <a href="/terms" rel="noopener noreferrer"> Terms of Service</a>.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3 className="faq-question">How do I find my size?</h3>
              <p className="faq-answer">
                We provide detailed size guides for all our pieces. You can also book a virtual styling session for personalized fitting advice.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Do you ship internationally?</h3>
              <p className="faq-answer">
                Yes! We ship worldwide. Shipping rates and delivery times vary by location. Free shipping on orders over $200 within Canada.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">What's your return policy?</h3>
              <p className="faq-answer">
                We offer 30-day returns on all unworn items with original tags. Visit our Returns page for more details.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Do you offer personal styling?</h3>
              <p className="faq-answer">
                Absolutely! Book a complimentary virtual or in-person styling session to curate looks tailored just for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="emergency-contact">
        <div className="container">
          <div className="emergency-banner">
            <h3>Need immediate assistance?</h3>
            <p>For urgent inquiries, please call us directly at <strong>7986337325</strong></p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;