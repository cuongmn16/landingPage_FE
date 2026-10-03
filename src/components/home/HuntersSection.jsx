import React, { useState } from 'react';
import { TEAMS, CONFIG } from '../../data/appData';

export default function HuntersSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const teams = Array.isArray(TEAMS) ? TEAMS : [];

  const filteredTeams = teams.filter(t => {
    const q = searchTerm.trim().toLowerCase();
    const okQ = !q || (t.name + ' ' + (t.unit || '') + ' ' + (t.leader || '')).toLowerCase().includes(q);
    const okF = !statusFilter || t.status === statusFilter;
    return okQ && okF;
  });

  return (
    <section className="section" id="hunters">
      <div className="container">
        <p className="section__label mono reveal">TEAMS — MEET THE HUNTERS</p>
        <h2 className="section__title reveal">Meet the Hunters</h2>

        <div className="hunters__controls reveal">
          <input
            type="text"
            placeholder="Tìm tên đội..."
            aria-label="Tìm kiếm đội"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            aria-label="Lọc theo trạng thái"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="alliance">Liên minh</option>
          </select>
        </div>

        <div className="hunters__grid">
          {!teams.length ? (
            <div className="empty-state">
              <div className="empty-state__icon">🗺️</div>
              <h3 className="empty-state__title">Các Hunter đang tập hợp…</h3>
              <p className="empty-state__desc">Danh sách đội sẽ được công bố sau 30/09/2026.</p>
              <a href={CONFIG.REGISTER_URL} className="btn btn--gold" target="_blank" rel="noopener noreferrer">
                Đăng ký đội ngay
              </a>
            </div>
          ) : !filteredTeams.length ? (
            <div className="empty-state">
              <p className="empty-state__desc">Không tìm thấy đội nào.</p>
            </div>
          ) : (
            filteredTeams.map((t, idx) => {
              const initial = (t.name || '?').trim().charAt(0).toUpperCase();
              const statusLabel = t.status === 'alliance' ? 'Liên minh' : 'Đã xác nhận';
              const color = t.color || ['#0E6CB0', '#F0A422', '#4A9BD4', '#C97E10', '#0A4E82', '#F5BA55'][idx % 6];
              return (
                <article key={t.id || idx} className="hunter-card reveal">
                  <div className="hunter-card__head">
                    <div className="hunter-card__avatar" style={{ background: color, color: '#0F2942' }}>
                      {initial}
                    </div>
                    <div>
                      <h3 className="hunter-card__name">{t.name}</h3>
                      <p className="hunter-card__unit">{t.unit || ''}</p>
                    </div>
                  </div>
                  {t.slogan && <p className="hunter-card__slogan">"{t.slogan}"</p>}
                  <div className="hunter-card__info">
                    {t.leader && <span>👤 Đội trưởng: {t.leader}</span>}
                    {t.members && <span>👥 {t.members} thành viên nòng cốt</span>}
                  </div>
                  <span className={`hunter-card__status hunter-card__status--${t.status}`}>
                    {statusLabel}
                  </span>
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
