import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HERO, CONFIG, fmtDate } from '../../data/appData';
import { auth } from '../../services/api';

export default function HeroSection() {
  const [timeLeft, setTimeLeft] = useState('');
  const [isClosed, setIsClosed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(auth.isLoggedIn());

  useEffect(() => {
    setIsLoggedIn(auth.isLoggedIn());
  }, []);

  useEffect(() => {
    const deadline = new Date(CONFIG.registerDeadline).getTime();
    function tick() {
      const diff = deadline - Date.now();
      if (diff <= 0) {
        setIsClosed(true);
        setTimeLeft('⏱ Đã đóng đăng ký');
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${d} ngày ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    }
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section class="hero" id="hero">
      <div class="hero__bg">
        <div class="hero__grid"></div>
        <div class="hero__compass">
          <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.5">
            <circle cx="100" cy="100" r="90" /><circle cx="100" cy="100" r="70" strokeDasharray="2 4" />
            <line x1="100" y1="10" x2="100" y2="190" /><line x1="10" y1="100" x2="190" y2="100" />
            <polygon points="100,40 110,100 100,160 90,100" fill="currentColor" opacity="0.15" />
          </svg>
        </div>
      </div>

      <div class="container hero__content">
        <p class="hero__tag mono" id="heroTag">{HERO.tag}</p>
        <h1 class="hero__title" id="heroTitle">{HERO.title}</h1>
        <p class="hero__subtitle" id="heroSubtitle">{HERO.subtitle}</p>
        <p class="hero__desc" id="heroDesc">{HERO.desc}</p>

        <div class="hero__actions">
          {isLoggedIn ? (
            <Link to="/dashboard" class="btn btn--gold">Tiếp tục hành trình</Link>
          ) : (
            <Link to="/login" class="btn btn--gold">Đăng nhập để tham gia</Link>
          )}
          <a href="#how-to-play" class="btn btn--outline">Xem cách chơi</a>
        </div>

        <div class="hero__stats">
          <div class="hero__stat"><span class="hero__stat-value">04</span><span class="hero__stat-label">Mission</span></div>
          <div class="hero__stat"><span class="hero__stat-value">Toàn thể</span><span class="hero__stat-label">CBNV</span></div>
          <div class="hero__stat"><span class="hero__stat-value">Tỷ lệ</span><span class="hero__stat-label">Đơn vị</span></div>
          <div class="hero__stat"><span class="hero__stat-value">{fmtDate(CONFIG.registerDeadline)}</span><span class="hero__stat-label">Hạn</span></div>
        </div>

        <div class={`hero__countdown ${isClosed ? 'is-closed' : ''}`} id="heroCountdown" aria-live="polite">
          {isClosed ? (
            '⏱ Đã đóng đăng ký'
          ) : (
            <>⏱ Còn lại: <strong>{timeLeft}</strong></>
          )}
        </div>
      </div>
    </section>
  );
}
