import React from 'react';
import { Link } from 'react-router-dom';
import { CONFIG } from '../../data/appData';
import { auth } from '../../services/api';

export default function RegisterSection() {
  const isLoggedIn = auth.isLoggedIn();

  return (
    <section className="section section--cta" id="register">
      <div className="container cta__inner">
        <img src="/assets/ctin-logo.png" alt="CTIN" className="cta__logo reveal is-visible" />
        <h2 className="cta__title reveal is-visible" id="ctaTitle">
          Sẵn sàng khám phá một mảnh di sản CTIN?
        </h2>
        {isLoggedIn ? (
          <Link to="/dashboard" className="btn btn--gold btn--large reveal is-visible">
            Tiếp tục Mission
          </Link>
        ) : (
          <Link to="/login" className="btn btn--gold btn--large reveal is-visible">
            Đăng nhập để tham gia
          </Link>
        )}
        <p className="cta__contact reveal is-visible">
          Liên hệ BTC: <strong>{CONFIG.contact.name}</strong> —{' '}
          <a href={`tel:${CONFIG.contact.phone}`}>{CONFIG.contact.phone}</a> —{' '}
          <a href={`mailto:${CONFIG.contact.email}`}>{CONFIG.contact.email}</a>
        </p>
      </div>
    </section>
  );
}
