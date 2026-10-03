import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { CONFIG } from '../../data/appData';

export default function LeaderboardPreviewSection() {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getLeaderboard();
        setTopUsers(data.slice(0, CONFIG.leaderboardTop || 10));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <section class="section section--light" id="leaderboard-preview">
      <div class="container">
        <p class="section__label mono reveal is-visible">RANKING — BẢNG XẾP HẠNG</p>
        <h2 class="section__title reveal is-visible">Top 10 cá nhân</h2>
        <p class="section__desc reveal is-visible">
          Xếp hạng theo tổng điểm đã được BTC chấm. Cập nhật tự động sau mỗi lần chấm.
        </p>

        <div class="lb-preview reveal is-visible">
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--clr-ink-3)', padding: '24px' }}>
              Đang tải bảng xếp hạng…
            </p>
          ) : error ? (
            <p style={{ textAlign: 'center', color: '#C25B5B', padding: '24px' }}>
              Không tải được BXH: {error}
            </p>
          ) : topUsers.length === 0 ? (
            <div class="empty-state">
              <div class="empty-state__icon">🏆</div>
              <h3 class="empty-state__title">Chưa có dữ liệu xếp hạng</h3>
              <p class="empty-state__desc">Bảng xếp hạng sẽ cập nhật sau khi BTC chấm điểm.</p>
            </div>
          ) : (
            <div class="lb-preview__table">
              <div class="lb-preview__header">
                <span>Hạng</span><span>Họ tên</span><span>Đơn vị</span><span>Tổng điểm</span>
              </div>
              {topUsers.map((u, i) => {
                const rank = i + 1;
                const medal = medals[i] || '';
                const cls = rank === 1 ? 'is-top1' : rank === 2 ? 'is-top2' : rank === 3 ? 'is-top3' : '';
                return (
                  <div key={i} class={`lb-preview__row ${cls}`}>
                    <span class="lb-preview__rank">{medal} {rank}</span>
                    <span class="lb-preview__name">{u.full_name}</span>
                    <span class="lb-preview__unit">{u.unit}</span>
                    <span class="lb-preview__score">{u.total_score}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div class="lb-preview__cta reveal is-visible">
          <Link to="/leaderboard" class="btn btn--outline">Xem bảng xếp hạng đầy đủ →</Link>
        </div>
      </div>
    </section>
  );
}
