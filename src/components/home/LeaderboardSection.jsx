import React, { useState, useEffect } from 'react';
import { fetchUnitLeaderboardApi } from '../../services/api';
import { fmtDateTime } from '../../data/appData';

const medals = ['🥇', '🥈', '🥉'];

export default function LeaderboardSection() {
  const [unitLeaderboard, setUnitLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const loadLeaderboard = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const data = await fetchUnitLeaderboardApi();
      setUnitLeaderboard(data || []);
    } catch (err) {
      console.warn('[Leaderboard] Cannot fetch from backend API, using fallback data:', err);
      setApiError('Không thể kết nối Backend API. Vui lòng kiểm tra Docker Postgres/MinIO & Spring Boot server.');
      // Mock data for demo fallback if server is starting
      setUnitLeaderboard([
        { rank: 1, unitCode: 'PB_HR', unitName: 'Phòng Nhân sự', totalPersonnel: 10, validParticipantsCount: 10, participationRatePercent: 100.0, lastUpdatedAt: new Date().toISOString() },
        { rank: 2, unitCode: 'PB_IT', unitName: 'Phòng Kỹ thuật & CNTT', totalPersonnel: 50, validParticipantsCount: 42, participationRatePercent: 84.0, lastUpdatedAt: new Date().toISOString() },
        { rank: 3, unitCode: 'PB_KD', unitName: 'Phòng Kinh doanh', totalPersonnel: 30, validParticipantsCount: 21, participationRatePercent: 70.0, lastUpdatedAt: new Date().toISOString() },
        { rank: 4, unitCode: 'PB_KT', unitName: 'Phòng Tài chính Kế toán', totalPersonnel: 15, validParticipantsCount: 9, participationRatePercent: 60.0, lastUpdatedAt: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const top3 = unitLeaderboard.slice(0, 3);

  return (
    <section className="section section--light" id="leaderboard">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="section__label mono reveal">DEPARTMENT RANKING — RESTful API</p>
            <h2 className="section__title reveal">Bảng Xếp Hạng Tỷ Lệ Tham Gia Đơn Vị</h2>
          </div>
          <button onClick={loadLeaderboard} className="btn" style={{ fontSize: '0.85rem', padding: '6px 12px', background: '#eee' }}>
            🔄 Cập nhật API
          </button>
        </div>

        <p className="lb__note-full reveal" style={{ marginBottom: '24px' }}>
          💡 Giải đồng đội được tính theo <strong>Tỷ lệ nhân sự của đơn vị tham gia hợp lệ</strong>:
          <br />
          <code>Tỷ lệ tham gia (%) = (Số người tham gia hợp lệ / Tổng số nhân sự đơn vị) × 100%</code>
        </p>

        {top3.length > 0 && (
          <div className="podium reveal">
            {top3.map((r, i) => (
              <div key={r.unitId || r.unitCode} className={`podium__item podium__item--${i + 1}`}>
                <div className="podium__medal">{medals[i]}</div>
                <div className="podium__team">{r.unitName}</div>
                <div className="podium__total" style={{ color: 'var(--clr-gold)', fontWeight: 'bold' }}>
                  {r.participationRatePercent}%
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                  ({r.validParticipantsCount}/{r.totalPersonnel} NV)
                </div>
              </div>
            ))}
          </div>
        )}

        {apiError && (
          <div style={{ padding: '8px 12px', background: '#fff3cd', color: '#856404', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '16px' }}>
            ℹ️ {apiError}
          </div>
        )}

        <div className="lb__table-wrap reveal">
          <table className="lb__table">
            <thead>
              <tr>
                <th>Thứ hạng</th>
                <th>Mã Đơn vị</th>
                <th>Tên Đơn vị</th>
                <th>Số NV thuộc phạm vi</th>
                <th>Số người tham gia hợp lệ</th>
                <th>Tỷ lệ tham gia (%)</th>
                <th>Thời điểm cập nhật gần nhất</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--clr-ink-2)' }}>
                    Đang tải dữ liệu từ REST API PostgreSQL Server…
                  </td>
                </tr>
              ) : unitLeaderboard.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--clr-ink-2)' }}>
                    Chưa có dữ liệu bảng xếp hạng đơn vị.
                  </td>
                </tr>
              ) : (
                unitLeaderboard.map((r, i) => {
                  const rank = r.rank || i + 1;
                  const cls =
                    rank === 1 ? 'lb__row--top1' : rank === 2 ? 'lb__row--top2' : rank === 3 ? 'lb__row--top3' : '';

                  return (
                    <tr key={r.unitId || r.unitCode || i} className={cls}>
                      <td className="lb__rank">{rank}</td>
                      <td className="mono">{r.unitCode}</td>
                      <td className="lb__team-name">{r.unitName}</td>
                      <td style={{ textAlign: 'center' }}>{r.totalPersonnel}</td>
                      <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#28a745' }}>
                        {r.validParticipantsCount}
                      </td>
                      <td className="lb__total" style={{ textAlign: 'center' }}>
                        {r.participationRatePercent}%
                      </td>
                      <td className="mono" style={{ fontSize: '0.85rem' }}>
                        {fmtDateTime(r.lastUpdatedAt)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
