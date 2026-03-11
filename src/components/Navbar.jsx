import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaInstagram, FaWhatsapp, FaBars, FaTimes } from 'react-icons/fa';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Shift+A to open admin
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        window.location.href = '/admin';
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      // Auto-close mobile menu when resizing to desktop
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Format phone number for WhatsApp (remove non-digits, add country code if needed)
  const formatWhatsAppNumber = (phone) => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // Ensure it has country code (assuming Canada/US number, add +1 if missing)
    return cleaned.startsWith('1') ? cleaned : `1${cleaned}`;
  };

  const whatsappNumber = '7986337325'; // Your phone number without formatting
  const whatsappLink = `https://wa.me/${formatWhatsAppNumber(whatsappNumber)}?text=Hi%20theRareFold%2C%20I%27d%20like%20to%20know%20more%20about%20your%20collection.`;

  return (
    <>
      {/* Mobile Header */}
      {isMobile && (
        <div className="mobile-header">
          <div className="mobile-logo">
            <Link to="/" onClick={closeMobileMenu}>
              <img 
                src="https://i.postimg.cc/Gm9dqB1T/Whats-App-Image-2026-03-11-at-11-12-08.jpg" 
                alt="RARE_FOLD"
                style={{ maxWidth: '150px', maxHeight: '50px' }}
              />
            </Link>
          </div>
          <button 
            className="hamburger-button" 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      )}

      {/* Sidebar - transforms for mobile */}
      <aside className={`sidebar ${isMobile ? 'mobile-sidebar' : ''} ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="logo">
          <Link to="/" onClick={closeMobileMenu}>
            <img 
              src="https://i.postimg.cc/Gm9dqB1T/Whats-App-Image-2026-03-11-at-11-12-08.jpg" 
              alt="RARE_FOLD"
              style={{ maxWidth: '221px', maxHeight: '95px' }}
            />
          </Link>
        </div>

        {/* Close button for mobile */}
        {isMobile && isMobileMenuOpen && (
          <button 
            className="mobile-close-btn"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        )}

        <ul className="menu-list">
          <li className="menu-item">
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={closeMobileMenu}
            >
              Main
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink 
              to="/about"
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={closeMobileMenu}
            >
              About
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink 
              to="/portfolio" 
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={closeMobileMenu}
            >
              Portfolio
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink 
              to="/reviews" 
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={closeMobileMenu}
            >
              Clients Love
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink 
              to="/contact" 
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={closeMobileMenu}
            >
              Contact
            </NavLink>
          </li>
        </ul>

        <footer className="sidebar-footer">
          <div className="social-links">
            <a 
              href="https://www.instagram.com/rarefold_/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="item"
              onClick={closeMobileMenu}
            >
              <FaInstagram />
            </a>
            <a 
              href={whatsappLink}
              target="_blank" 
              rel="noopener noreferrer" 
              className="item"
              onClick={closeMobileMenu}
              title="Chat with us on WhatsApp"
            >
              <FaWhatsapp />
            </a>
          </div>
          <div className="footer-content">
            <p>Grace in every frame, love in every story. © 2025 Rare_Fold. With gratitude.</p>
          </div>
          <div className="branding">
            Site by <a href="https://purvakj.github.io/purvak/" target="_blank" rel="noopener noreferrer">SSIT</a>
          </div>
        </footer>
      </aside>

      {/* Overlay for mobile menu */}
      {isMobile && isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={closeMobileMenu} />
      )}

      <style jsx>{`
        .mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 70px;
          background: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          z-index: 1000;
          padding: 0 20px;
          align-items: center;
          justify-content: space-between;
        }

        .hamburger-button {
          background: none;
          border: none;
          font-size: 24px;
          color: #333;
          cursor: pointer;
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.3s ease;
        }

        .hamburger-button:hover {
          color: #25D366; /* WhatsApp green on hover */
        }

        .mobile-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          font-size: 24px;
          color: #333;
          cursor: pointer;
          padding: 10px;
          z-index: 1002;
          display: none;
          color: white;
        }

        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 998;
          backdrop-filter: blur(3px);
        }

        /* Active link styles - updated to brown */
        .menu-item a.active {
          color: var(--color-link, #aa8d74) !important;
          text-decoration: underline;
        }

        .menu-item a:hover {
          color: var(--color-link, #aa8d74);
        }

        /* Social links hover effects */
        .social-links {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          font-size: 22px;
        }
        
        .social-links .item {
          color: var(--color-text, #1e1e1e);
          transition: all 0.3s ease;
        }
        
        .social-links .item:hover {
          transform: translateY(-3px);
        }
        
        .social-links .item:first-child:hover {
          color: #E1306C; /* Instagram gradient color approximation */
        }
        
        .social-links .item:last-child:hover {
          color: #25D366; /* WhatsApp green */
        }

        @media (max-width: 768px) {
          .mobile-header {
            display: flex;
          }

          .sidebar.mobile-sidebar {
            position: fixed;
            top: 30px;
            left: -100%;
            width: 280px;
            height: 100vh;
            background: white;
            z-index: 999;
            transition: left 0.3s ease;
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
            overflow-y: auto;
            padding-top: 80px;
          }

          .sidebar.mobile-sidebar.open {
            left: 0;
          }

          .sidebar.mobile-sidebar .logo {
            padding: 20px;
            margin-top: -60px;
          }

          .sidebar.mobile-sidebar .logo img {
            max-width: 180px;
          }

          .mobile-close-btn {
            display: block;
          }

          .sidebar.mobile-sidebar .menu-list {
            padding: 20px;
          }

          .sidebar.mobile-sidebar .menu-item {
            margin-bottom: 15px;
          }

          .sidebar.mobile-sidebar .menu-item a {
            font-size: 18px;
            padding: 10px 15px;
            display: block;
            border-radius: 8px;
            transition: all 0.3s ease;
          }

          .sidebar.mobile-sidebar .menu-item a:hover,
          .sidebar.mobile-sidebar .menu-item a.active {
            background: #f8f9fa;
            color: var(--color-link, #aa8d74) !important;
          }

          .sidebar.mobile-sidebar .sidebar-footer {
            padding: 20px;
            text-align: center;
          }

          .sidebar.mobile-sidebar .social-links {
            justify-content: center;
            margin-bottom: 15px;
          }

          .sidebar.mobile-sidebar .social-links .item {
            margin: 0 10px;
            font-size: 20px;
          }

          .sidebar.mobile-sidebar .footer-content p {
            font-size: 12px;
          }

          .sidebar.mobile-sidebar .branding {
            font-size: 12px;
          }

          /* Hide desktop sidebar by default on mobile */
          .sidebar:not(.mobile-sidebar) {
            display: none;
          }
        }
      `}</style>
    </>
  );
}

export default Navbar;