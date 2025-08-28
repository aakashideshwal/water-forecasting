import React, { useEffect } from 'react';
import './PageHeader.css';
import waterImage from './assets/water-landscape.jpg';

const PageHeader = ({ title, subtitle, children }) => {
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;
      const header = document.querySelector('.page-header');
      if (header) {
        const speed = 0.4; // Adjust parallax speed
        header.style.backgroundPosition = `center ${scrollPosition * speed}px`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="page-header" style={{ backgroundImage: `url(${waterImage})` }}>
      {children} {/* For elements like the logout button */}
      <div className="page-header-content">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </section>
  );
};

export default PageHeader;
