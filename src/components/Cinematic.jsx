import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { apiGet } from '../utils/api';
import toast from 'react-hot-toast';
import { FaPlay, FaVideo } from 'react-icons/fa';

// Static video data outside component
// Static video data outside component
const cinematicVideos = [
  {
    id: 'v1',
    thumbnail: 'https://i.postimg.cc/wBCXZBsb/YZz_29.jpg',
    title: 'Pre wedding shoot in Jaipur/Harshatla & ...',
    duration: '3:45',
    videoId: 'u3aYyM_pdkY',
    videoUrl: 'https://youtu.be/u3aYyM_pdkY'
  },
  {
    id: 'v2',
    thumbnail: 'https://i.postimg.cc/RhcXXHs8/YZz_6.jpg',
    title: 'Love Story Film',
    duration: '4:20',
    videoId: '_riYATvZjU8',
    videoUrl: 'https://youtu.be/_riYATvZjU8'
  },
  {
    id: 'v3',
    thumbnail: 'https://images.unsplash.com/photo-1507504031003-b417219a0fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    title: 'Cinematic Wedding Film',
    duration: '5:10',
    videoId: 'GXIXwO3cWtc',
    videoUrl: 'https://youtu.be/GXIXwO3cWtc'
  },
  {
    id: 'v4',
    thumbnail: 'https://i.postimg.cc/T1d66gyt/YZ_85.jpg',
    title: 'New Pre Wedding 2025 | Manpreet & Charanpreet',
    duration: '4:50',
    videoId: 'x07OMrRuTR0',
    videoUrl: 'https://youtu.be/x07OMrRuTR0'
  }
];

// Cinematic stock images for fallback/example
const cinematicStockImages = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    title: 'Cinematic Wedding Moment',
    category: 'wedding'
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1537635181335-6cdfc4f8b4b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    title: 'Dramatic Ceremony',
    category: 'ceremony'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    title: 'Bridal Portrait',
    category: 'portrait'
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    title: 'Reception Cinematic',
    category: 'reception'
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1507504031003-b417219a0fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    title: 'First Dance',
    category: 'reception'
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    title: 'Detail Shot',
    category: 'details'
  },
  {
    id: '7',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
    title: 'Outdoor Cinematic',
    category: 'outdoor'
  },
  {
    id: '8',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    title: 'Golden Hour',
    category: 'outdoor'
  },
  {
    id: '9',
    url: 'https://images.unsplash.com/photo-1537635181335-6cdfc4f8b4b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    title: 'Candid Moment',
    category: 'candid'
  }
];

function Cinematic() {
  const [cinematicAlbums, setCinematicAlbums] = useState([]);
  const [cinematicImages, setCinematicImages] = useState([]);
  const [albumCovers, setAlbumCovers] = useState({});
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [playingVideo, setPlayingVideo] = useState(null);
  const iframeRefs = useRef({});

  // Helper function to get displayable image URL
  const getDisplayImageUrl = (url) => {
    if (!url) return '';
    
    if (url.includes('drive.google.com/uc?export=view')) {
      return url;
    }
    
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
    }
    
    const openIdMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (openIdMatch && openIdMatch[1] && url.includes('drive.google.com')) {
      return `https://drive.google.com/uc?export=view&id=${openIdMatch[1]}`;
    }
    
    return url;
  };

  const loadAlbumCovers = useCallback(async (albumsArray) => {
    const covers = {};
    
    for (const album of albumsArray) {
      try {
        const images = await apiGet('albumImages', { albumId: album.albumId });
        if (Array.isArray(images) && images.length > 0) {
          // Use the first image as cover
          covers[album.albumId] = images[0].imageUrl;
        } else {
          // Use fallback image
          const hash = album.albumId ? 
            album.albumId.charCodeAt(0) + (album.albumId.charCodeAt(album.albumId.length - 1) || 0) : 
            Math.random();
          covers[album.albumId] = cinematicStockImages[hash % cinematicStockImages.length].url;
        }
      } catch (error) {
        console.error(`Error loading cover for album ${album.albumId}:`, error);
        const hash = album.albumId ? 
          album.albumId.charCodeAt(0) + (album.albumId.charCodeAt(album.albumId.length - 1) || 0) : 
          Math.random();
        covers[album.albumId] = cinematicStockImages[hash % cinematicStockImages.length].url;
      }
    }
    
    setAlbumCovers(covers);
  }, []);

  const loadLatestImages = useCallback(async (albumsArray) => {
    try {
      let allImages = [];
      
      // Fetch images from all albums
      for (const album of albumsArray) {
        try {
          const images = await apiGet('albumImages', { albumId: album.albumId });
          if (Array.isArray(images)) {
            // Add album info to each image
            const imagesWithAlbum = images.map(img => ({
              ...img,
              albumName: album.coupleName,
              albumId: album.albumId,
              category: 'wedding' // Default category
            }));
            allImages = [...allImages, ...imagesWithAlbum];
          }
        } catch (error) {
          console.error(`Error loading images for album ${album.albumId}:`, error);
        }
      }
      
      // Sort by createdAt date (newest first) and take first 30
      const sortedImages = allImages
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 30);
      
      if (sortedImages.length > 0) {
        setCinematicImages(sortedImages);
      } else {
        // Fallback to stock images
        setCinematicImages(cinematicStockImages.slice(0, 30));
      }
    } catch (error) {
      console.error('Error loading latest images:', error);
      setCinematicImages(cinematicStockImages.slice(0, 30));
    }
  }, []);

  const loadCinematicContent = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load all albums
      const albumsData = await apiGet('albums');
      const albumsArray = Array.isArray(albumsData) ? albumsData : [];
      setCinematicAlbums(albumsArray);
      
      // Load album covers
      await loadAlbumCovers(albumsArray);
      
      // Load latest 30 images from all albums
      await loadLatestImages(albumsArray);
      
    } catch (error) {
      toast.error('Failed to load cinematic content');
      setCinematicImages(cinematicStockImages.slice(0, 30));
    } finally {
      setLoading(false);
    }
  }, [loadAlbumCovers, loadLatestImages]);

  useEffect(() => {
    loadCinematicContent();
  }, [loadCinematicContent]);

  const handleVideoPlay = (videoId) => {
    setPlayingVideo(videoId);
  };

  const handleVideoClose = (videoId) => {
    setPlayingVideo(null);
    // Fix: Use a different method to stop the video
    if (iframeRefs.current[videoId]) {
      const iframe = iframeRefs.current[videoId];
      // Instead of self-assignment, set src to empty then back to original
      const originalSrc = iframe.src;
      iframe.src = '';
      setTimeout(() => {
        iframe.src = originalSrc;
      }, 100);
    }
  };

  const openLightbox = (index) => {
    setPhotoIndex(index);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="cinematic-page">
      {/* Hero Section */}
      <section className="cinematic-hero" style={{ 
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        color: 'white',
        padding: '80px 0',
        marginBottom: '40px'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ 
            color: 'white', 
            fontSize: '3.5rem',
            marginBottom: '20px'
          }}>
            Cinematic Storytelling
          </h1>
          <p style={{ 
            color: 'rgba(255,255,255,0.8)', 
            fontSize: '1.2rem',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.8'
          }}>
            Experience wedding films and photographs crafted with cinematic vision, 
            where every frame tells a story and every moment becomes art.
          </p>
        </div>
      </section>

      {/* Video Showcase Section */}
      <section className="cinematic-videos" style={{ padding: '40px 0' }}>
        <div className="container">
          <h2 className="section-title" style={{ 
            fontSize: '2.5rem', 
            marginBottom: '40px'
          }}>
            CINEMA
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '30px',
            marginBottom: '60px'
          }}>
            {cinematicVideos.map((video) => (
              <div
                key={video.id}
                className="cinematic-video-card"
                style={{
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                  transition: 'transform 0.3s ease',
                  aspectRatio: '16/9',
                  width: '100%',
                  maxWidth: '100%',
                  backgroundColor: '#000'
                }}
                onMouseEnter={(e) => {
                  if (playingVideo !== video.id) {
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {playingVideo === video.id ? (
                  <>
                    <iframe
                      ref={el => iframeRefs.current[video.id] = el}
                      src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&controls=1&disablekb=1&fs=0&iv_load_policy=3&modestbranding=1&rel=0&showinfo=0&playsinline=1&enablejsapi=1`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen={false}
                      style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        pointerEvents: 'auto'
                      }}
                    />
                    {/* Close button to exit video */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVideoClose(video.id);
                      }}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        fontSize: '18px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        transition: 'background 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,0,0,0.8)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(0,0,0,0.7)';
                      }}
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <>
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                      onClick={() => handleVideoPlay(video.id)}
                    />
                    <div 
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(0,0,0,0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(0,0,0,0.3)';
                      }}
                      onClick={() => handleVideoPlay(video.id)}
                    >
                      <div style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(5px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid white'
                      }}>
                        <FaPlay style={{ color: 'white', fontSize: '24px', marginLeft: '5px' }} />
                      </div>
                    </div>
                    <div style={{
                      position: 'absolute',
                      bottom: '20px',
                      left: '20px',
                      color: 'white',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                      right: '20px'
                    }}>
                      <h3 style={{ 
                        color: 'white', 
                        marginBottom: '5px', 
                        fontSize: '1.3rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {video.title}
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.9rem' }}>
                        <FaVideo style={{ marginRight: '5px' }} /> {video.duration}
                      </p>
                    </div>
                    
                    {/* Action buttons */}
                    <div style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      display: 'flex',
                      gap: '10px',
                      zIndex: 5
                    }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add watch later functionality
                          console.log('Watch later:', video.title);
                        }}
                        style={{
                          background: 'rgba(0,0,0,0.6)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '20px',
                          padding: '5px 12px',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          backdropFilter: 'blur(5px)',
                          transition: 'background 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(0,0,0,0.8)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(0,0,0,0.6)';
                        }}
                      >
                        Watch Later
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add share functionality
                          console.log('Share:', video.title);
                        }}
                        style={{
                          background: 'rgba(0,0,0,0.6)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '20px',
                          padding: '5px 12px',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          backdropFilter: 'blur(5px)',
                          transition: 'background 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(0,0,0,0.8)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(0,0,0,0.6)';
                        }}
                      >
                        Share
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest 30 Cinematic Images Section */}
      <section className="cinematic-gallery" style={{ padding: '0 0 80px 0' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <h2 className="section-title" style={{ fontSize: '2.5rem', margin: 0 }}>
              Latest Cinematic Moments
            </h2>
            <span style={{
              background: '#007bff',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '0.9rem'
            }}>
              Latest 30 Images
            </span>
          </div>
          
          {cinematicImages.length === 0 ? (
            <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#666' }}>
              No cinematic moments available yet.
            </p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '25px'
            }}>
              {cinematicImages.map((image, index) => (
                <div
                  key={image.id || index}
                  onClick={() => openLightbox(index)}
                  className="cinematic-image-card"
                  style={{
                    position: 'relative',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    aspectRatio: '16/9'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                  }}
                >
                  <img 
                    src={getDisplayImageUrl(image.url || image.imageUrl)} 
                    alt={image.title || 'Cinematic moment'}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = cinematicStockImages[index % cinematicStockImages.length].url;
                    }}
                  />
                  
                  {/* Album badge */}
                  {image.albumName && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      backdropFilter: 'blur(5px)'
                    }}>
                      {image.albumName}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cinematic Albums Section with Cover Images */}
      {cinematicAlbums.length > 0 && (
        <section className="cinematic-albums" style={{ 
          padding: '80px 0',
          background: '#f8f9fa'
        }}>
          <div className="container">
            <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '40px' }}>
              Cinematic Albums
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px'
            }}>
              {cinematicAlbums.map((album) => (
                <Link 
                  to={`/gallery/${album.albumId}`} 
                  key={album.albumId}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="cinematic-album-card" style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: 'white',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  >
                    <div style={{ 
                      height: '250px', 
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <img 
                        src={getDisplayImageUrl(albumCovers[album.albumId])}
                        alt={album.coupleName}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.5s ease'
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = cinematicStockImages[0].url;
                        }}
                      />
                      
                      {/* Overlay with album info */}
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '50px 20px 20px',
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                        color: 'white'
                      }}>
                        <h3 style={{ 
                          color: 'white', 
                          marginBottom: '5px',
                          fontSize: '1.3rem'
                        }}>
                          {album.coupleName}
                        </h3>
                        <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>
                          {new Date(album.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div style={{ padding: '20px' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{
                          color: '#007bff',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          View Gallery
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" fill="none" />
                          </svg>
                        </span>
                        
                        {album.isNew && (
                          <span style={{
                            background: '#28a745',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.8rem'
                          }}>
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox for fullscreen viewing */}
      {lightboxOpen && (
        <Lightbox
          mainSrc={getDisplayImageUrl(cinematicImages[photoIndex]?.url || cinematicImages[photoIndex]?.imageUrl || '')}
          nextSrc={getDisplayImageUrl(
            cinematicImages[(photoIndex + 1) % cinematicImages.length]?.url || 
            cinematicImages[(photoIndex + 1) % cinematicImages.length]?.imageUrl || ''
          )}
          prevSrc={getDisplayImageUrl(
            cinematicImages[(photoIndex + cinematicImages.length - 1) % cinematicImages.length]?.url || 
            cinematicImages[(photoIndex + cinematicImages.length - 1) % cinematicImages.length]?.imageUrl || ''
          )}
          onCloseRequest={() => setLightboxOpen(false)}
          onMovePrevRequest={() => setPhotoIndex((photoIndex + cinematicImages.length - 1) % cinematicImages.length)}
          onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % cinematicImages.length)}
          imageTitle={cinematicImages[photoIndex]?.title || cinematicImages[photoIndex]?.albumName}
          imageCaption={cinematicImages[photoIndex]?.createdAt ? 
            new Date(cinematicImages[photoIndex].createdAt).toLocaleDateString() : 
            cinematicImages[photoIndex]?.category}
        />
      )}

      {/* Add responsive styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .cinematic-hero h1 {
            font-size: 2.5rem !important;
          }
          
          .cinematic-hero p {
            font-size: 1rem !important;
            padding: 0 20px !important;
          }
          
          .cinematic-videos .section-title {
            font-size: 2rem !important;
            text-align: center !important;
            padding: 0 20px !important;
          }
          
          .cinematic-videos > div > div {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
            padding: 0 20px !important;
          }
          
          .cinematic-video-card {
            aspect-ratio: 16/9 !important;
            margin: 0 auto !important;
            width: 100% !important;
          }
          
          .cinematic-video-card iframe {
            width: 100% !important;
            height: 100% !important;
          }
          
          .cinematic-video-card .play-button {
            width: 50px !important;
            height: 50px !important;
          }
          
          .cinematic-video-card .play-button svg {
            font-size: 18px !important;
          }
          
          .cinematic-video-card h3 {
            font-size: 1rem !important;
          }
          
          .cinematic-video-card p {
            font-size: 0.8rem !important;
          }
          
          .cinematic-video-card button {
            padding: 4px 8px !important;
            font-size: 0.7rem !important;
          }
          
          .cinematic-gallery > div > div:first-child {
            flex-direction: column !important;
            text-align: center !important;
            padding: 0 20px !important;
          }
          
          .cinematic-gallery h2 {
            font-size: 2rem !important;
          }
          
          .cinematic-gallery > div > div:last-child {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
            padding: 0 20px !important;
          }
          
          .cinematic-image-card {
            aspect-ratio: 16/9 !important;
            width: 100% !important;
          }
          
          .cinematic-image-card .album-badge {
            font-size: 0.7rem !important;
            padding: 3px 8px !important;
          }
          
          .cinematic-albums h2 {
            font-size: 2rem !important;
            text-align: center !important;
            padding: 0 20px !important;
          }
          
          .cinematic-albums > div > div {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
            padding: 0 20px !important;
          }
          
          .cinematic-album-card > div:first-child {
            height: 200px !important;
          }
          
          .cinematic-album-card h3 {
            font-size: 1.1rem !important;
          }
          
          .cinematic-album-card p {
            font-size: 0.8rem !important;
          }
          
          .cinematic-album-card .view-gallery {
            font-size: 0.9rem !important;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .cinematic-videos > div > div {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 25px !important;
          }
          
          .cinematic-gallery > div > div:last-child {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 20px !important;
          }
          
          .cinematic-albums > div > div {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 25px !important;
          }
        }

        /* Ensure videos are responsive */
        iframe {
          max-width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
}

export default Cinematic;