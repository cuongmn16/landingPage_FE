import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { CONFIG } from '../../data/appData';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardPreviewSection() {
  const [topPlayers, setTopPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const limit = CONFIG.leaderboardTop || 10;
        const data = await api.getIndividualLeaderboard(limit);
        setTopPlayers(data.slice(0, limit));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <section className="section section--light" id="leaderboard-preview">
      <div className="container">
        <p className="section__label mono reveal is-visible">RANKING — BẢNG XẾP HẠNG</p>
        <h2 className="section__title reveal is-visible">Top {CONFIG.leaderboardTop || 10} cá nhân</h2>
        <p className="section__desc reveal is-visible">
          Xếp hạng theo tổng điểm đã được BTC chấm. Cập nhật tự động sau mỗi lần chấm.
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
          ) : topPlayers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">🏆</div>
              <h3 className="empty-state__title">Chưa có dữ liệu xếp hạng</h3>
              <p className="empty-state__desc">Bảng xếp hạng sẽ cập nhật khi BTC bắt đầu chấm điểm bài nộp.</p>
            </div>
          ) : (
            <div className="lb-preview__table">
              <div className="lb-preview__header">
                <span>Hạng</span><span>Họ tên</span><span>Đơn vị</span><span>Tổng điểm</span>
              </div>
              {topPlayers.map((p, i) => {
                const medal = MEDALS[p.rank - 1] || '';
                const cls = medal ? `is-top${p.rank}` : '';
                return (
                  <div key={p.employee_id ?? i} className={`lb-preview__row ${cls}`}>
                    <span className="lb-preview__rank">{medal} {p.rank}</span>
                    <span className="lb-preview__name">{p.full_name}</span>
                    <span className="lb-preview__unit">{p.unit_name}</span>
                    <span className="lb-preview__score">{p.total_score}</span>
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
