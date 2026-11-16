import React from 'react';
import { Link } from 'react-router-dom';
import { CONFIG } from '../../data/appData';
import { auth } from '../../services/api';
import '../../styles/wishes.css';

export default function RegisterSection() {
  const isLoggedIn = auth.isLoggedIn();

  return (
    <section className="section section--cta" id="register">
      <div className="container cta__inner">
        <img src="/assets/ctin-logo.png" alt="CTIN" className="cta__logo reveal is-visible" />
        <h2 className="cta__title reveal is-visible" id="ctaTitle">
          Sẵn sàng khám phá một mảnh di sản CTIN?
        </h2>
        <div
          className="reveal is-visible"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {isLoggedIn ? (
            <Link to="/dashboard" className="btn btn--gold btn--large">
              Tiếp tục Mission
            </Link>
          ) : (
            <Link to="/login" className="btn btn--gold btn--large">
              Đăng nhập để tham gia
            </Link>
          )}
          <Link to="/wishes" className="btn btn--wishes btn--large">
            ✨ Lời chúc CTIN
          </Link>
        </div>
        <p className="cta__contact reveal is-visible">
          Liên hệ BTC: <strong>{CONFIG.contact.name}</strong> —{' '}
          <a href={`tel:${CONFIG.contact.phone}`}>{CONFIG.contact.phone}</a> —{' '}
          <a href={`mailto:${CONFIG.contact.email}`}>{CONFIG.contact.email}</a>
        </p>
      </div>
    </section>
  );
}
