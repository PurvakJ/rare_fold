import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { apiPost, apiGet } from '../utils/api';
import '../styles/Admin.css';
import { 
  FaTachometerAlt, 
  FaImages, 
  FaPhotoVideo, 
  FaKey, 
  FaSignOutAlt,
  FaStar,
  FaEnvelope,
  FaTrash,
  FaPlus,
  FaEye,
  FaCopy,
  FaCheck,
  FaArrowLeft,
  FaUser,
  FaCalendarAlt,
  FaPhone,
  FaComment
} from 'react-icons/fa';

function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [albums, setAlbums] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  
  // View all states
  const [viewAllMode, setViewAllMode] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);

  const { register: registerLogin, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useForm();
  const { register: registerAlbum, handleSubmit: handleAlbumSubmit, reset: resetAlbum, formState: { errors: albumErrors } } = useForm();
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, formState: { errors: passwordErrors } } = useForm();

  const loadAlbumImages = useCallback(async () => {
    if (!selectedAlbum) return;
    try {
      const data = await apiGet('albumImages', { albumId: selectedAlbum });
      setImages(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load images');
    }
  }, [selectedAlbum]);

  useEffect(() => {
    if (loggedIn) {
      loadData();
    }
  }, [loggedIn, activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadAlbumImages();
  }, [loadAlbumImages]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [albumsData, contactsData, reviewsData] = await Promise.all([
        apiGet('albums'),
        apiGet('contacts'),
        apiGet('testimonials')
      ]);
      setAlbums(Array.isArray(albumsData) ? albumsData : []);
      setContacts(Array.isArray(contactsData) ? contactsData : []);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const onLogin = async (data) => {
    try {
      const result = await apiPost({
        action: 'login',
        ...data
      });
      if (result.success) {
        setLoggedIn(true);
        setActiveTab('dashboard');
        toast.success('Login successful');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed');
    }
  };

  const onLogout = () => {
    setLoggedIn(false);
    setActiveTab('login');
    setViewAllMode(null);
    setSelectedContact(null);
    setSelectedReview(null);
    toast.success('Logged out successfully');
  };

  const onChangePassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const result = await apiPost({
        action: 'changePassword',
        username: 'admin',
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      });
      if (result.success) {
        toast.success('Password changed successfully');
        resetPassword();
      } else {
        toast.error('Current password is incorrect');
      }
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  const onCreateAlbum = async (data) => {
    try {
      const result = await apiPost({
        action: 'createAlbum',
        ...data
      });
      if (result.success) {
        toast.success('Album created successfully');
        resetAlbum();
        loadData();
      }
    } catch (error) {
      toast.error('Failed to create album');
    }
  };

  const onAddImages = async () => {
    if (!selectedAlbum) {
      toast.error('Please select an album');
      return;
    }
    if (!imageUrls.trim()) {
      toast.error('Please enter image URLs');
      return;
    }

    const urls = imageUrls.split('\n').filter(url => url.trim());
    try {
      await apiPost({
        action: 'addImages',
        albumId: selectedAlbum,
        imageUrls: urls
      });
      toast.success(`${urls.length} images added successfully`);
      setImageUrls('');
      loadAlbumImages();
    } catch (error) {
      toast.error('Failed to add images');
    }
  };

  const onDeleteImage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    try {
      await apiPost({
        action: 'deleteImage',
        id
      });
      toast.success('Image deleted successfully');
      loadAlbumImages();
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Copied to clipboard');
  };


  // View All Handlers
  const handleViewAllContacts = () => {
    setViewAllMode('contacts');
  };

  const handleViewAllReviews = () => {
    setViewAllMode('reviews');
  };

  const handleBackToDashboard = () => {
    setViewAllMode(null);
    setSelectedContact(null);
    setSelectedReview(null);
  };

  const handleViewContactDetails = (contact) => {
    setSelectedContact(contact);
  };

  const handleViewReviewDetails = (review) => {
    setSelectedReview(review);
  };

  const handleBackToList = () => {
    setSelectedContact(null);
    setSelectedReview(null);
  };

  // Render View All Contacts
  const renderAllContacts = () => {
    if (selectedContact) {
      return (
        <div className="admin-detail-view">
          <button onClick={handleBackToList} className="admin-back-btn">
            <FaArrowLeft /> Back to Contacts
          </button>
          <div className="admin-detail-card">
            <h3>Contact Details</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <FaUser className="detail-icon" />
                <div>
                  <label>Name</label>
                  <p>{selectedContact.name}</p>
                </div>
              </div>
              <div className="detail-item">
                <FaEnvelope className="detail-icon" />
                <div>
                  <label>Email</label>
                  <p>
                    <a href={`mailto:${selectedContact.email}`}>{selectedContact.email}</a>
                  </p>
                </div>
              </div>
              {selectedContact.phone && (
                <div className="detail-item">
                  <FaPhone className="detail-icon" />
                  <div>
                    <label>Phone</label>
                    <p>
                      <a href={`tel:${selectedContact.phone}`}>{selectedContact.phone}</a>
                    </p>
                  </div>
                </div>
              )}
              <div className="detail-item">
                <FaCalendarAlt className="detail-icon" />
                <div>
                  <label>Date</label>
                  <p>{new Date(selectedContact.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="detail-item full-width">
                <FaComment className="detail-icon" />
                <div>
                  <label>Message</label>
                  <p className="detail-message">{selectedContact.message}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="admin-view-all">
        <div className="admin-view-header">
          <button onClick={handleBackToDashboard} className="admin-back-btn">
            <FaArrowLeft /> Back to Dashboard
          </button>
          <h2>All Contact Messages ({contacts.length})</h2>
        </div>
        <div className="admin-table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Package</th>
                <th>Message</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id}>
                  <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                  <td><strong>{contact.name}</strong></td>
                  <td>
                    <a href={`mailto:${contact.email}`} className="admin-link">
                      {contact.email}
                    </a>
                  </td>
                  <td>
                    {contact.phone && (
                      <a href={`tel:${contact.phone}`} className="admin-link">
                        {contact.phone}
                      </a>
                    )}
                  </td>
                  <td>
                    <span className="admin-badge">{contact.package || 'N/A'}</span>
                  </td>
                  <td className="admin-message-preview">
                    {contact.message?.substring(0, 50)}...
                  </td>
                  <td>
                    <button 
                      onClick={() => handleViewContactDetails(contact)}
                      className="admin-action-btn view"
                    >
                      <FaEye /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Render View All Reviews
  const renderAllReviews = () => {
    if (selectedReview) {
      return (
        <div className="admin-detail-view">
          <button onClick={handleBackToList} className="admin-back-btn">
            <FaArrowLeft /> Back to Reviews
          </button>
          <div className="admin-detail-card">
            <h3>Review Details</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <FaUser className="detail-icon" />
                <div>
                  <label>Name</label>
                  <p>{selectedReview.name}</p>
                </div>
              </div>
              <div className="detail-item">
                <FaEnvelope className="detail-icon" />
                <div>
                  <label>Email</label>
                  <p>{selectedReview.email}</p>
                </div>
              </div>
              <div className="detail-item">
                <FaStar className="detail-icon" />
                <div>
                  <label>Rating</label>
                  <p>
                    <div className="admin-rating large">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < selectedReview.rating ? 'star filled' : 'star'}>
                          ★
                        </span>
                      ))}
                    </div>
                  </p>
                </div>
              </div>
              <div className="detail-item">
                <FaCalendarAlt className="detail-icon" />
                <div>
                  <label>Date</label>
                  <p>{new Date(selectedReview.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="detail-item full-width">
                <FaComment className="detail-icon" />
                <div>
                  <label>Review</label>
                  <p className="detail-message">{selectedReview.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="admin-view-all">
        <div className="admin-view-header">
          <button onClick={handleBackToDashboard} className="admin-back-btn">
            <FaArrowLeft /> Back to Dashboard
          </button>
          <h2>All Reviews ({reviews.length})</h2>
        </div>
        <div className="admin-table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review, index) => (
                <tr key={index}>
                  <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                  <td><strong>{review.name}</strong></td>
                  <td>{review.email}</td>
                  <td>
                    <div className="admin-rating">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < review.rating ? 'star filled' : 'star'}>
                          ★
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="admin-message-preview">
                    {review.description.substring(0, 60)}...
                  </td>
                  <td>
                    <button 
                      onClick={() => handleViewReviewDetails(review)}
                      className="admin-action-btn view"
                    >
                      <FaEye /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (!loggedIn) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-container">
          <div className="admin-login-card">
            <div className="admin-login-header">
              <h1 className="admin-login-title">Admin Login</h1>
              <p className="admin-login-subtitle">Welcome back! Please login to continue</p>
            </div>

            <form onSubmit={handleLoginSubmit(onLogin)} className="admin-login-form">
              <div className="admin-form-group">
                <label className="admin-form-label">Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  className={`admin-form-input ${loginErrors.username ? 'error' : ''}`}
                  {...registerLogin('username', { required: 'Username is required' })}
                />
                {loginErrors.username && (
                  <span className="admin-error-message">{loginErrors.username.message}</span>
                )}
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className={`admin-form-input ${loginErrors.password ? 'error' : ''}`}
                  {...registerLogin('password', { required: 'Password is required' })}
                />
                {loginErrors.password && (
                  <span className="admin-error-message">{loginErrors.password.message}</span>
                )}
              </div>

              <button type="submit" className="admin-login-button">
                Login to Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Remove this line if you don't need the stats
  // const stats = getDashboardStats();

  // If in view all mode, render the appropriate view
  if (viewAllMode === 'contacts') {
    return (
      <div className="admin-dashboard">
        <header className="admin-header">
          <div className="admin-header-left">
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">Viewing all contact messages</p>
          </div>
          <div className="admin-header-right">
            <button onClick={onLogout} className="admin-logout-btn">
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </header>
        <div className="admin-content">
          {renderAllContacts()}
        </div>
      </div>
    );
  }

  if (viewAllMode === 'reviews') {
    return (
      <div className="admin-dashboard">
        <header className="admin-header">
          <div className="admin-header-left">
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">Viewing all reviews</p>
          </div>
          <div className="admin-header-right">
            <button onClick={onLogout} className="admin-logout-btn">
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </header>
        <div className="admin-content">
          {renderAllReviews()}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-left">
          <h1 className="admin-title">Admin Dashboard</h1>
          <p className="admin-subtitle">Welcome back, Admin</p>
        </div>
        <div className="admin-header-right">
          <button onClick={onLogout} className="admin-logout-btn">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`admin-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => setActiveTab('albums')}
          className={`admin-tab ${activeTab === 'albums' ? 'active' : ''}`}
        >
          <FaImages />
          <span>Albums</span>
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`admin-tab ${activeTab === 'gallery' ? 'active' : ''}`}
        >
          <FaPhotoVideo />
          <span>Gallery</span>
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`admin-tab ${activeTab === 'password' ? 'active' : ''}`}
        >
          <FaKey />
          <span>Security</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="admin-content">
        {loading && (
          <div className="admin-loading">
            <div className="admin-spinner"></div>
            <p>Loading data...</p>
          </div>
        )}

        {!loading && activeTab === 'dashboard' && (
          <div className="admin-dashboard-content">

            {/* Recent Contacts */}
            <div className="admin-section">
              <div className="admin-section-header">
                <h2 className="admin-section-title">Recent Contact Messages</h2>
                <button onClick={handleViewAllContacts} className="admin-view-all">
                  View All ({contacts.length})
                </button>
              </div>
              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Package</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.slice(0, 5).map((contact) => (
                      <tr key={contact.id}>
                        <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                        <td><strong>{contact.name}</strong></td>
                        <td>
                          <a href={`mailto:${contact.email}`} className="admin-link">
                            {contact.email}
                          </a>
                        </td>
                        <td>
                          {contact.phone && (
                            <a href={`tel:${contact.phone}`} className="admin-link">
                              {contact.phone}
                            </a>
                          )}
                        </td>
                        <td>
                          <span className="admin-badge">{contact.package || 'N/A'}</span>
                        </td>
                        <td className="admin-message-preview">
                          {contact.message?.substring(0, 50)}...
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="admin-section">
              <div className="admin-section-header">
                <h2 className="admin-section-title">Recent Reviews</h2>
                <button onClick={handleViewAllReviews} className="admin-view-all">
                  View All ({reviews.length})
                </button>
              </div>
              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Name</th>
                      <th>Rating</th>
                      <th>Review</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.slice(0, 5).map((review, index) => (
                      <tr key={index}>
                        <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                        <td><strong>{review.name}</strong></td>
                        <td>
                          <div className="admin-rating">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < review.rating ? 'star filled' : 'star'}>
                                ★
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="admin-message-preview">
                          {review.description.substring(0, 60)}...
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {!loading && activeTab === 'albums' && (
          <div className="admin-albums-content">
            {/* Create Album Form */}
            <div className="admin-create-card">
              <h3 className="admin-card-title">
                <FaPlus className="card-icon" />
                Create New Album
              </h3>
              <form onSubmit={handleAlbumSubmit(onCreateAlbum)} className="admin-form">
                <div className="admin-form-group">
                  <label className="admin-form-label">Couple Name *</label>
                  <input
                    type="text"
                    placeholder="Enter couple's name"
                    className={`admin-form-input ${albumErrors.coupleName ? 'error' : ''}`}
                    {...registerAlbum('coupleName', { required: 'Couple name is required' })}
                  />
                  {albumErrors.coupleName && (
                    <span className="admin-error-message">{albumErrors.coupleName.message}</span>
                  )}
                </div>
                <button type="submit" className="admin-create-btn">
                  Create Album
                </button>
              </form>
            </div>

            {/* Existing Albums */}
            <div className="admin-albums-list">
              <h3 className="admin-card-title">Existing Albums</h3>
              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Couple Name</th>
                      <th>Created</th>
                      <th>Album ID</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {albums.map((album) => (
                      <tr key={album.albumId}>
                        <td><strong>{album.coupleName}</strong></td>
                        <td>{new Date(album.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="admin-id-cell">
                            <code className="admin-id">{album.albumId.substring(0, 8)}...</code>
                            <button
                              onClick={() => copyToClipboard(album.albumId, album.albumId)}
                              className="admin-copy-btn"
                            >
                              {copiedId === album.albumId ? <FaCheck /> : <FaCopy />}
                            </button>
                          </div>
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              setSelectedAlbum(album.albumId);
                              setActiveTab('gallery');
                            }}
                            className="admin-action-btn view"
                          >
                            <FaEye />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {!loading && activeTab === 'gallery' && (
          <div className="admin-gallery-content">
            <h3 className="admin-card-title">Manage Gallery</h3>
            
            {/* Album Selector */}
            <div className="admin-selector">
              <select
                value={selectedAlbum}
                onChange={(e) => setSelectedAlbum(e.target.value)}
                className="admin-select"
              >
                <option value="">Select an Album</option>
                {albums.map((album) => (
                  <option key={album.albumId} value={album.albumId}>
                    {album.coupleName} ({new Date(album.createdAt).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>

            {selectedAlbum && (
              <>
                {/* Add Images Section */}
                <div className="admin-add-images">
                  <h4 className="admin-subtitle">Add Images</h4>
                  <p className="admin-hint">Enter image URLs (one per line)</p>
                  <textarea
                    rows="5"
                    value={imageUrls}
                    onChange={(e) => setImageUrls(e.target.value)}
                    className="admin-textarea"
                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                  />
                  <button onClick={onAddImages} className="admin-upload-btn">
                    <FaPlus />
                    Upload Images
                  </button>
                </div>

                {/* Images Grid */}
                <div className="admin-images-section">
                  <h4 className="admin-subtitle">
                    Album Images ({images.length})
                  </h4>
                  {images.length === 0 ? (
                    <div className="admin-empty-state">
                      <p>No images in this album yet</p>
                    </div>
                  ) : (
                    <div className="admin-images-grid">
                      {images.map((image) => (
                        <div key={image.id} className="admin-image-card">
                          <img 
                            src={image.imageUrl} 
                            alt=""
                            className="admin-image"
                          />
                          <div className="admin-image-overlay">
                            <button
                              onClick={() => copyToClipboard(image.imageUrl, image.id)}
                              className="admin-image-btn copy"
                            >
                              {copiedId === image.id ? <FaCheck /> : <FaCopy />}
                            </button>
                            <button
                              onClick={() => onDeleteImage(image.id)}
                              className="admin-image-btn delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {!loading && activeTab === 'password' && (
          <div className="admin-password-content">
            <div className="admin-password-card">
              <h3 className="admin-card-title">
                <FaKey className="card-icon" />
                Change Password
              </h3>
              
              <form onSubmit={handlePasswordSubmit(onChangePassword)} className="admin-form">
                <div className="admin-form-group">
                  <label className="admin-form-label">Current Password *</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className={`admin-form-input ${passwordErrors.oldPassword ? 'error' : ''}`}
                    {...registerPassword('oldPassword', { required: 'Current password is required' })}
                  />
                  {passwordErrors.oldPassword && (
                    <span className="admin-error-message">{passwordErrors.oldPassword.message}</span>
                  )}
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">New Password *</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className={`admin-form-input ${passwordErrors.newPassword ? 'error' : ''}`}
                    {...registerPassword('newPassword', { 
                      required: 'New password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                  />
                  {passwordErrors.newPassword && (
                    <span className="admin-error-message">{passwordErrors.newPassword.message}</span>
                  )}
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Confirm New Password *</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className={`admin-form-input ${passwordErrors.confirmPassword ? 'error' : ''}`}
                    {...registerPassword('confirmPassword', { required: 'Please confirm your password' })}
                  />
                  {passwordErrors.confirmPassword && (
                    <span className="admin-error-message">{passwordErrors.confirmPassword.message}</span>
                  )}
                </div>

                <button type="submit" className="admin-update-btn">
                  Update Password
                </button>
              </form>

              <div className="admin-password-note">
                <p>Password must be at least 6 characters long</p>
                <p>Use a mix of letters, numbers, and symbols for better security</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;