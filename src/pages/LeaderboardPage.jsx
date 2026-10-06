import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function LeaderboardPage() {
  const [allRows, setAllRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('rate');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getLeaderboard();
      setAllRows(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalUnits = allRows.length;
  const totalValid = allRows.reduce((s, r) => s + (r.valid_count || 0), 0);
  const totalPersonnel = allRows.reduce((s, r) => s + (r.total_personnel || 0), 0);
  const topRate = totalUnits ? Math.max(...allRows.map(r => r.rate || 0)) : 0;
  const overallRate = totalPersonnel ? ((totalValid / totalPersonnel) * 100).toFixed(1) : '0';

  // Rank is always by participation rate (backend order), independent of display sorting
  const rankById = new Map(
    [...allRows]
      .sort((a, b) => (b.rate - a.rate) || (b.valid_count - a.valid_count))
      .map((r, i) => [r.unit_id, i + 1])
  );

  const filteredSortedRows = allRows
    .filter(r => {
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      return (r.unit_name || '').toLowerCase().includes(q) || (r.unit_code || '').toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === 'rate') return (b.rate - a.rate) || (b.valid_count - a.valid_count);
      if (sortBy === 'count') return (b.valid_count - a.valid_count) || (b.rate - a.rate);
      if (sortBy === 'name') return (a.unit_name || '').localeCompare(b.unit_name || '', 'vi');
      return 0;
    });

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <main>
      <section className="section">
        <div className="container">
          <p className="section__label mono reveal is-visible">RANKING — BẢNG XẾP HẠNG</p>
          <h1 className="section__title reveal is-visible">Bảng xếp hạng đơn vị</h1>
          <p className="section__desc reveal is-visible">
            Xếp hạng theo tỷ lệ CBNV tham gia hợp lệ trên tổng số nhân sự của đơn vị.
          </p>

          <div className="lb-filters reveal is-visible">
            <input
              type="text"
              id="lbSearch"
              placeholder="🔍 Tìm theo tên đơn vị..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              id="lbSort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="rate">Sắp xếp: Tỷ lệ tham gia (cao → thấp)</option>
              <option value="count">Sắp xếp: Số CBNV hợp lệ</option>
              <option value="name">Sắp xếp: Tên đơn vị</option>
            </select>
            <button className="btn btn--outline" id="lbReload" type="button" onClick={loadData}>
              ↻ Tải lại
            </button>
          </div>

          <div className="lb-stats" id="lbStats">
            <div className="lb-stat"><span className="lb-stat__value">{totalUnits}</span><span className="lb-stat__label">Đơn vị</span></div>
            <div className="lb-stat"><span className="lb-stat__value">{totalValid}</span><span className="lb-stat__label">CBNV tham gia hợp lệ</span></div>
            <div className="lb-stat"><span className="lb-stat__value">{topRate}%</span><span className="lb-stat__label">Tỷ lệ cao nhất</span></div>
            <div className="lb-stat"><span className="lb-stat__value">{overallRate}%</span><span className="lb-stat__label">Tỷ lệ toàn công ty</span></div>
          </div>

          <div className="lb__table-wrap reveal is-visible">
            <table className="lb__table">
              <thead>
                <tr>
                  <th>Hạng</th>
                  <th>Đơn vị</th>
                  <th>CBNV hợp lệ</th>
                  <th>Tổng nhân sự</th>
                  <th>Tỷ lệ tham gia</th>
                </tr>
              </thead>
              <tbody id="lbBody">
                {loading ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--clr-ink-3)' }}>Đang tải…</td></tr>
                ) : error ? (
                  <tr><td colSpan="5" style={{ color: '#C25B5B', textAlign: 'center', padding: '32px' }}>Lỗi: {error}</td></tr>
                ) : filteredSortedRows.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--clr-ink-3)' }}>Không có dữ liệu.</td></tr>
                ) : (
                  filteredSortedRows.map((r) => {
                    const rank = rankById.get(r.unit_id) || 0;
                    const medal = medals[rank - 1] || '';
                    const cls = rank === 1 ? 'lb__row--top1' : rank === 2 ? 'lb__row--top2' : rank === 3 ? 'lb__row--top3' : '';
                    return (
                      <tr key={r.unit_id ?? r.unit_name} className={cls}>
                        <td className="lb__rank">{medal} {rank}</td>
                        <td className="lb__team-name">{r.unit_name}</td>
                        <td>{r.valid_count}</td>
                        <td>{r.total_personnel}</td>
                        <td className="lb__total">{r.rate}%</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
