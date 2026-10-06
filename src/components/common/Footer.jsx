import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <img src="/assets/ctin-logo.png" alt="CTIN" className="footer__logo-img" />
          <span className="footer__tag">CTIN Treasure Hunt · Discover the Legacy. Create the Next Chapter.</span>
          <span className="footer__copy">© CTIN 25 năm · 2001 – 2026</span>
        </div>
      </div>
    </footer>
  );
}
