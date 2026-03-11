import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { apiGet } from '../utils/api';
import toast from 'react-hot-toast';

function Gallery() {
  const { albumId } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const loadImages = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiGet('albumImages', { albumId });
      setImages(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  }, [albumId]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const openLightbox = (index) => {
    setPhotoIndex(index);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div>
      <section className="section">
        <div className="container">
          <h1 className="section-title">Gallery</h1>

          {images.length === 0 ? (
            <p style={{ textAlign: 'center' }}>No images in this album</p>
          ) : (
            <div className="picture-grid">
              {images.map((image, index) => (
                <div 
                  key={image.id} 
                  className="picture-item"
                  onClick={() => openLightbox(index)}
                  style={{ cursor: 'pointer' }}
                >
                  <img 
                    src={image.imageUrl} 
                    alt={`Wedding moment ${index + 1}`} 
                  />
                </div>
              ))}
            </div>
          )}

          {lightboxOpen && (
            <Lightbox
              mainSrc={images[photoIndex]?.imageUrl || ''}
              nextSrc={images[(photoIndex + 1) % images.length]?.imageUrl || ''}
              prevSrc={images[(photoIndex + images.length - 1) % images.length]?.imageUrl || ''}
              onCloseRequest={() => setLightboxOpen(false)}
              onMovePrevRequest={() => setPhotoIndex((photoIndex + images.length - 1) % images.length)}
              onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length)}
            />
          )}
        </div>
      </section>
    </div>
  );
}

export default Gallery;