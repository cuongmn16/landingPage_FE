import React from 'react';
import { Link } from 'react-router-dom';
import { CONFIG } from '../../data/appData';
import { auth } from '../../services/api';

export default function RegisterSection() {
  const isLoggedIn = auth.isLoggedIn();

  return (
    <section class="section section--cta" id="register">
      <div class="container cta__inner">
        <img src="/assets/ctin-logo.png" alt="CTIN" class="cta__logo reveal is-visible" />
        <h2 class="cta__title reveal is-visible" id="ctaTitle">
          Sẵn sàng khám phá một mảnh di sản CTIN?
        </h2>
        {isLoggedIn ? (
          <Link to="/dashboard" class="btn btn--gold btn--large reveal is-visible">
            Tiếp tục Mission
          </Link>
        ) : (
          <Link to="/login" class="btn btn--gold btn--large reveal is-visible">
            Đăng nhập để tham gia
          </Link>
        )}
        <p class="cta__contact reveal is-visible">
          Liên hệ BTC: <strong>{CONFIG.contact.name}</strong> —{' '}
          <a href={`tel:${CONFIG.contact.phone}`}>{CONFIG.contact.phone}</a> —{' '}
          <a href={`mailto:${CONFIG.contact.email}`}>{CONFIG.contact.email}</a>
        </p>
      </div>
    </section>
  );
}
