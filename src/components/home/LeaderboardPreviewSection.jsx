import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { CONFIG } from '../../data/appData';

export default function LeaderboardPreviewSection() {
  const [topUnits, setTopUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getLeaderboard();
        setTopUnits(data.slice(0, CONFIG.leaderboardTop || 10));
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
    <section className="section section--light" id="leaderboard-preview">
      <div className="container">
        <p className="section__label mono reveal is-visible">RANKING — BẢNG XẾP HẠNG</p>
        <h2 className="section__title reveal is-visible">Top đơn vị dẫn đầu</h2>
        <p className="section__desc reveal is-visible">
          Xếp hạng theo tỷ lệ CBNV tham gia hợp lệ. Cập nhật tự động sau mỗi bài nộp được ghi nhận.
        </p>

        <div className="lb-preview reveal is-visible">
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--clr-ink-3)', padding: '24px' }}>
              Đang tải bảng xếp hạng…
            </p>
          ) : error ? (
            <p style={{ textAlign: 'center', color: '#C25B5B', padding: '24px' }}>
              Không tải được BXH: {error}
            </p>
          ) : topUnits.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">🏆</div>
              <h3 className="empty-state__title">Chưa có dữ liệu xếp hạng</h3>
              <p className="empty-state__desc">Bảng xếp hạng sẽ cập nhật khi CBNV bắt đầu nộp bài.</p>
            </div>
          ) : (
            <div className="lb-preview__table">
              <div className="lb-preview__header">
                <span>Hạng</span><span>Đơn vị</span><span>CBNV hợp lệ</span><span>Tỷ lệ</span>
              </div>
              {topUnits.map((u, i) => {
                const rank = i + 1;
                const medal = medals[i] || '';
                const cls = rank === 1 ? 'is-top1' : rank === 2 ? 'is-top2' : rank === 3 ? 'is-top3' : '';
                return (
                  <div key={u.unit_id ?? i} className={`lb-preview__row ${cls}`}>
                    <span className="lb-preview__rank">{medal} {rank}</span>
                    <span className="lb-preview__name">{u.unit_name}</span>
                    <span className="lb-preview__unit">{u.valid_count}/{u.total_personnel}</span>
                    <span className="lb-preview__score">{u.rate}%</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="lb-preview__cta reveal is-visible">
          <Link to="/leaderboard" className="btn btn--outline">Xem bảng xếp hạng đầy đủ →</Link>
        </div>
      </div>
    </section>
  );
}
