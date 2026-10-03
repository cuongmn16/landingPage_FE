import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { M1_CONFIG } from '../../data/mission1Data';
import { fmtDateTime } from '../../data/appData';

export default function M1Hero() {
  const [status, setStatus] = useState('—');
  const [countdownText, setCountdownText] = useState('');
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    const openTime = new Date(M1_CONFIG.openAt).getTime();
    const dueTime = new Date(M1_CONFIG.dueAt).getTime();

    const updateTimer = () => {
      const now = Date.now();

      if (now < openTime) {
        setStatus('Sắp mở');
        setIsClosed(true);
        const diff = openTime - now;
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setCountdownText(`Mở sau: ${d}d ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
      } else if (now > dueTime) {
        setStatus('Đã kết thúc');
        setIsClosed(true);
        setCountdownText('Đã hết hạn nộp bài');
      } else {
        setStatus('Đang diễn ra');
        setIsClosed(false);
        const diff = dueTime - now;
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setCountdownText(`Còn lại để nộp bài: ${d}d ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="m1-hero" id="m1-hero">
      <div className="m1-hero__bg" aria-hidden="true">
        <div className="m1-hero__grid"></div>
        <div className="m1-hero__compass">
          <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.5">
            <circle cx="100" cy="100" r="90" />
            <circle cx="100" cy="100" r="70" strokeDasharray="2 4" />
            <circle cx="100" cy="100" r="45" strokeDasharray="1 3" opacity="0.6" />
            <line x1="100" y1="10" x2="100" y2="190" />
            <line x1="10" y1="100" x2="190" y2="100" />
            <polygon points="100,40 110,100 100,160 90,100" fill="currentColor" opacity="0.15" />
          </svg>
        </div>
      </div>

      <div className="container m1-hero__inner">
        <Link to="/#missions" className="m1-hero__back">← Quay lại danh sách Mission</Link>
        <p className="m1-hero__label mono">Mission 01 · {M1_CONFIG.title}</p>
        <h1 className="m1-hero__title">{M1_CONFIG.title}</h1>
        <p className="m1-hero__subtitle">{M1_CONFIG.subtitle}</p>
        <p className="m1-hero__desc">
          Từ 24 thẻ manh mối, các đội ghép nối và tái dựng hành trình phát triển của CTIN;
          xác định các chặng, bước ngoặt và sợi chỉ đỏ xuyên suốt.
        </p>

        <div className="m1-hero__meta">
          <div className="m1-hero__meta-item">
            <span className="m1-hero__meta-label">Trạng thái</span>
            <span className="m1-hero__meta-value">{status}</span>
          </div>
          <div className="m1-hero__meta-item">
            <span className="m1-hero__meta-label">Mở lúc</span>
            <span className="m1-hero__meta-value">{fmtDateTime(M1_CONFIG.openAt)}</span>
          </div>
          <div className="m1-hero__meta-item">
            <span className="m1-hero__meta-label">Hạn nộp</span>
            <span className="m1-hero__meta-value">{fmtDateTime(M1_CONFIG.dueAt)}</span>
          </div>
          <div className="m1-hero__meta-item">
            <span className="m1-hero__meta-label">Trọng số</span>
            <span className="m1-hero__meta-value">{M1_CONFIG.weight}%</span>
          </div>
        </div>

        <div className={`m1-hero__countdown ${isClosed ? 'is-closed' : ''}`}>
          <span>⏱ <strong>{countdownText}</strong></span>
        </div>
      </div>
    </section>
  );
}
