import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HERO, CONFIG, fmtDate } from '../../data/appData';
import { auth } from '../../services/api';

export default function HeroSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(auth.isLoggedIn());

  useEffect(() => {
    setIsLoggedIn(auth.isLoggedIn());
  }, []);

  return (
    <section className="hero" id="hero">
      <div className="hero__bg">
        <div className="hero__grid"></div>
        <div className="hero__compass">
          <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.5">
            <circle cx="100" cy="100" r="90" /><circle cx="100" cy="100" r="70" strokeDasharray="2 4" />
            <line x1="100" y1="10" x2="100" y2="190" /><line x1="10" y1="100" x2="190" y2="100" />
            <polygon points="100,40 110,100 100,160 90,100" fill="currentColor" opacity="0.15" />
          </svg>
        </div>
      </div>

      <div className="container hero__content">
        <p className="hero__tag mono" id="heroTag">{HERO.tag}</p>
        <h1 className="hero__title" id="heroTitle">{HERO.title}</h1>
        <p className="hero__subtitle" id="heroSubtitle">{HERO.subtitle}</p>
        <p className="hero__desc" id="heroDesc">{HERO.desc}</p>

        <div className="hero__actions">
          {isLoggedIn ? (
            <Link to="/dashboard" className="btn btn--gold">Tiếp tục hành trình</Link>
          ) : (
            <Link to="/login" className="btn btn--gold">Đăng nhập để tham gia</Link>
          )}
          <a href="#how-to-play" className="btn btn--outline">Xem cách chơi</a>
        </div>

        <div className="hero__stats">
          <div className="hero__stat"><span className="hero__stat-value">04</span><span className="hero__stat-label">Mission</span></div>
          <div className="hero__stat"><span className="hero__stat-value">Toàn thể</span><span className="hero__stat-label">CBNV</span></div>
          <div className="hero__stat"><span className="hero__stat-value">Tỷ lệ</span><span className="hero__stat-label">Đơn vị</span></div>
          <div className="hero__stat"><span className="hero__stat-value">{fmtDate(CONFIG.registerDeadline)}</span><span className="hero__stat-label">Hạn</span></div>
        </div>
      </div>
    </section>
  );
}
