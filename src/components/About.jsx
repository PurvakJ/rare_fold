import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

function About() {
  // High-quality fashion images for the about page
  const aboutImages = [
    {
      url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
      alt: 'Fashion designer at work',
      caption: 'Behind the scenes'
    },
    {
      url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      alt: 'Fashion collection showcase',
      caption: 'Collection preview'
    },
    {
      url: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      alt: 'Detailed craftsmanship',
      caption: 'Artisanal details'
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-overlay">
          <div className="container">
            <h1 className="hero-title">Where Style Becomes Identity</h1>
            <p className="hero-subtitle">
              We don't just create clothing. We craft expressions of individuality.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Introduction */}
      <section className="section founder-section">
        <div className="container">
          <div className="founder-grid">
            <div className="founder-content">
              <h2 className="section-title-small">Our Story</h2>
              <h3 className="founder-title">The Vision Behind theRareFold</h3>
              <div className="founder-quote">
                <p className="lead-text">
                  Welcome to theRareFold, where fashion meets authenticity. Born from a passion 
                  for self-expression and quality craftsmanship, we curate pieces that speak to 
                  the individual—not the crowd.
                </p>
              </div>
              <p>
                Every collection is thoughtfully designed, blending contemporary trends with 
                timeless elegance. From the bustling streets of Toronto to the global fashion 
                scene, we bring you styles that transcend seasons.
              </p>
              <p className="highlight-text">
                Our mission? To help you tell your story through what you wear.
              </p>
            </div>
            <div className="founder-image">
              <div className="image-frame">
                <img 
                  src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                  alt="theRareFold founder and creative team"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section - The Art of Fashion */}
      <section className="section philosophy-section accent-bg">
        <div className="container">
          <h2 className="section-title">The Art of Self-Expression</h2>
          <div className="philosophy-content">
            <blockquote className="large-quote">
              "At theRareFold, we don't follow trends. We set them."
            </blockquote>
            
            <div className="moments-grid">
              <div className="moment-item">
                <p>The confidence a perfectly fitted blazer gives you.</p>
              </div>
              <div className="moment-item">
                <p>The way a unique accessory completes your look.</p>
              </div>
              <div className="moment-item">
                <p>The feeling when your outfit truly represents who you are.</p>
              </div>
            </div>
            
            <p className="emphasis-text">
              These are not just clothes. They're extensions of your identity, crafted with intention.
            </p>
          </div>
        </div>
      </section>

      {/* Style Section - Our Design Philosophy */}
      <section className="section style-section">
        <div className="container">
          <h2 className="section-title">Our Design Philosophy</h2>
          <div className="style-grid">
            <div className="style-card">
              <span className="style-emoji">✨</span>
              <h3>Contemporary Elegance</h3>
            </div>
            <div className="style-card">
              <span className="style-emoji">📏</span>
              <h3>Precision Craftsmanship</h3>
            </div>
            <div className="style-card">
              <span className="style-emoji">👑</span>
              <h3>Luxury Materials</h3>
            </div>
            <div className="style-card">
              <span className="style-emoji">💫</span>
              <h3>Timeless Design</h3>
            </div>
          </div>
          <p className="style-footer">
            Every piece is created with attention to detail, from fabric selection to final stitch.
          </p>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="section gallery-section">
        <div className="container">
          <div className="about-gallery">
            {aboutImages.map((image, index) => (
              <div key={index} className="gallery-item">
                <img src={image.url} alt={image.alt} />
                <div className="gallery-caption">{image.caption}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality & Craftsmanship */}
      <section className="section craftsmanship-section accent-bg">
        <div className="container">
          <h2 className="section-title">Uncompromising Quality</h2>
          <div className="craftsmanship-content">
            <p className="lead-text">
              Luxury is in the details—the things you feel but don't always see.
            </p>
            <p>
              From our first sketch to the final product, we ensure every piece meets our 
              exacting standards. Premium fabrics, expert construction, and thoughtful design 
              come together to create clothing that lasts—both in style and durability.
            </p>
            <p>
              Whether it's a casual essential or a statement piece for a special occasion, 
              we approach every garment with the same commitment:
            </p>
            <p className="highlight-text">
              To create something extraordinary.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="section">
        <div className="container">
          <div className="philosophy-box">
            <h2 className="section-title">Our Philosophy</h2>
            <blockquote className="philosophy-quote">
              <p>Fashion is fleeting, but style is eternal. We create pieces that become part of your story—</p>
              <p>worn not just for a season, but for years to come. Because true style never goes out of fashion.</p>
            </blockquote>
            <p className="signature-text">That is the theRareFold promise.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-box">
            <h2>Discover Your Style</h2>
            <p>
              If you believe clothing is more than just fabric—<br />
              if you want pieces that express who you are, crafted with care and designed to last—
            </p>
            <p className="cta-final">Let's find your perfect fit.</p>
            <Link to="/collections" className="button button-large">
              Explore Collections
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;