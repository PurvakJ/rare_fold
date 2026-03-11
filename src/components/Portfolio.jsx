import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../utils/api';
import toast from 'react-hot-toast';
import './Portfolio.css';

function Portfolio() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [albumCovers, setAlbumCovers] = useState({});

  // Fallback images - memoized to prevent recreation on every render
  const fallbackImages = useMemo(() => [
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
    'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1537635181335-6cdfc4f8b4b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  ], []); // Empty dependency array since this never needs to change

  const loadAlbumCovers = useCallback(async (albumsArray) => {
    const covers = {};
    
    for (const album of albumsArray) {
      try {
        const images = await apiGet('albumImages', { albumId: album.albumId });
        if (Array.isArray(images) && images.length > 0) {
          // Use the first image as cover
          covers[album.albumId] = images[0].imageUrl;
        } else {
          // Use fallback image based on album id for consistency
          const hash = album.albumId ? 
            album.albumId.charCodeAt(0) + (album.albumId.charCodeAt(album.albumId.length - 1) || 0) : 
            Math.random();
          covers[album.albumId] = fallbackImages[hash % fallbackImages.length];
        }
      } catch (error) {
        console.error(`Error loading cover for album ${album.albumId}:`, error);
        // Use fallback on error
        const hash = album.albumId ? 
          album.albumId.charCodeAt(0) + (album.albumId.charCodeAt(album.albumId.length - 1) || 0) : 
          Math.random();
        covers[album.albumId] = fallbackImages[hash % fallbackImages.length];
      }
    }
    
    setAlbumCovers(covers);
  }, [fallbackImages]); // Now fallbackImages is stable due to useMemo

  const loadAlbums = useCallback(async () => {
    try {
      setLoading(true);
      const albumsData = await apiGet('albums');
      const albumsArray = Array.isArray(albumsData) ? albumsData : [];
      setAlbums(albumsArray);
      
      // Load cover image for each album
      await loadAlbumCovers(albumsArray);
    } catch (error) {
      console.error('Error loading albums:', error);
      toast.error('Failed to load albums');
    } finally {
      setLoading(false);
    }
  }, [loadAlbumCovers]);

  useEffect(() => {
    loadAlbums();
  }, [loadAlbums]);

  const getFilteredAlbums = () => {
    if (filter === 'all') return albums;
    if (filter === 'recent') {
      return [...albums].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      ).slice(0, 6);
    }
    if (filter === 'featured') {
      return albums.slice(0, 4); // You can implement featured logic here
    }
    return albums;
  };

  const filteredAlbums = getFilteredAlbums();

  if (loading) {
    return (
      <div className="portfolio-loading">
        <div className="spinner" />
        <p>Loading beautiful albums...</p>
      </div>
    );
  }

  return (
    <div className="portfolio-page">
      {/* Hero Section */}
      <section className="portfolio-hero">
        <div className="container">
          <h1>Our Portfolio</h1>
          <p>
          Explore our curated collections, each piece thoughtfully designed to 
          elevate your personal style. From everyday essentials to statement 
          looks, every garment is crafted to help you express your unique identity.
          </p>
        </div>
      </section>

      {/* Filters and Controls - Hidden on mobile */}
      <section className="portfolio-controls desktop-only">
        <div className="container">
          <div className="controls-wrapper">
            <div className="filter-tabs">
              <button 
                className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All Albums ({albums.length})
              </button>
              <button 
                className={`filter-tab ${filter === 'recent' ? 'active' : ''}`}
                onClick={() => setFilter('recent')}
              >
                Recent
              </button>
              <button 
                className={`filter-tab ${filter === 'featured' ? 'active' : ''}`}
                onClick={() => setFilter('featured')}
              >
                Featured
              </button>
            </div>
            
            <div className="view-controls">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <rect x="3" y="3" width="4" height="4" />
                  <rect x="13" y="3" width="4" height="4" />
                  <rect x="3" y="13" width="4" height="4" />
                  <rect x="13" y="13" width="4" height="4" />
                </svg>
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <rect x="3" y="3" width="14" height="2" />
                  <rect x="3" y="9" width="14" height="2" />
                  <rect x="3" y="15" width="14" height="2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Albums Grid/List */}
      <section className="portfolio-content">
        <div className="container">
          {filteredAlbums.length === 0 ? (
            <div className="no-albums">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="2" y="2" width="20" height="20" rx="2" />
                <path d="M8 2v20M16 2v20M2 8h20M2 16h20" />
              </svg>
              <h3>No Albums Found</h3>
              <p>Check back soon for our latest wedding stories</p>
            </div>
          ) : (
            <div className={`albums-container ${viewMode}`}>
              {filteredAlbums.map((album, index) => (
                <Link 
                  to={`/gallery/${album.albumId}`} 
                  key={album.albumId} 
                  className={`album-item ${viewMode}`}
                >
                  <div className="album-image-wrapper">
                    <img 
                      src={albumCovers[album.albumId] || fallbackImages[index % fallbackImages.length]}
                      alt={album.coupleName || 'Wedding album'}
                      className="album-image"
                      loading="lazy"
                    />
                    {index === 0 && <span className="album-badge">Latest</span>}
                    
                    {/* Image count overlay */}
                    <div className="image-count">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <rect x="2" y="2" width="12" height="12" rx="1" />
                        <circle cx="5" cy="5" r="1.5" />
                        <path d="M14 10l-3-3-4 4-2-2-3 3" stroke="currentColor" strokeWidth="1" fill="none" />
                      </svg>
                      <span>View Gallery</span>
                    </div>
                  </div>
                  
                  <div className="album-details">
                    <h3 className="album-title">
                      {album.coupleName || 'Untitled Album'}
                    </h3>
                    
                    <div className="album-meta">
                      {album.createdAt && (
                        <span className="album-date">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <rect x="3" y="4" width="2" height="2" />
                            <rect x="7" y="4" width="2" height="2" />
                            <rect x="11" y="4" width="2" height="2" />
                            <path d="M2 6h12v6H2z" />
                            <path d="M4 2v2M12 2v2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                          </svg>
                          {new Date(album.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      )}
                    </div>
                    
                    <span className="view-album-link">
                      View Gallery 
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" fill="none" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="portfolio-cta">
        <div className="container">
          <h2>Ready to Capture Your Story?</h2>
          <p>Let's create beautiful memories together. Contact us to discuss your vision.</p>
          <Link to="/contact" className="button">
            Inquire Now
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Portfolio;