import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function LeaderboardPage() {
  const [allRows, setAllRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('total');

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

  const total = allRows.length;
  const totalScore = allRows.reduce((s, r) => s + (r.total_score || 0), 0);
  const topScore = total ? allRows[0].total_score : 0;
  const avgScore = total ? (totalScore / total).toFixed(1) : '—';

  const filteredSortedRows = allRows
    .filter(r => {
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      return (
        (r.full_name || '').toLowerCase().includes(q) ||
        (r.unit || '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'total') return (b.total_score || 0) - (a.total_score || 0) || (b.count || 0) - (a.count || 0);
      if (sortBy === 'avg')   return (b.avg_score || 0) - (a.avg_score || 0);
      if (sortBy === 'count') return (b.count || 0) - (a.count || 0) || (b.total_score || 0) - (a.total_score || 0);
      return 0;
    });

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <main>
      <section class="section">
        <div class="container">
          <p class="section__label mono reveal is-visible">RANKING — BẢNG XẾP HẠNG</p>
          <h1 class="section__title reveal is-visible">Bảng xếp hạng cá nhân</h1>
          <p class="section__desc reveal is-visible">
            Xếp hạng theo tổng điểm đã được BTC chấm. Chỉ tính các bài đã chấm điểm.
          </p>

          <div class="lb-filters reveal is-visible">
            <input
              type="text"
              id="lbSearch"
              placeholder="🔍 Tìm theo tên hoặc đơn vị..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              id="lbSort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="total">Sắp xếp: Tổng điểm (cao → thấp)</option>
              <option value="avg">Sắp xếp: Điểm TB (cao → thấp)</option>
              <option value="count">Sắp xếp: Số bài đã chấm</option>
            </select>
            <button class="btn btn--outline" id="lbReload" type="button" onClick={loadData}>
              ↻ Tải lại
            </button>
          </div>

          <div class="lb-stats" id="lbStats">
            <div class="lb-stat"><span class="lb-stat__value">{total}</span><span class="lb-stat__label">Người có điểm</span></div>
            <div class="lb-stat"><span class="lb-stat__value">{topScore}</span><span class="lb-stat__label">Điểm cao nhất</span></div>
            <div class="lb-stat"><span class="lb-stat__value">{avgScore}</span><span class="lb-stat__label">Điểm TB / người</span></div>
            <div class="lb-stat"><span class="lb-stat__value">{totalScore}</span><span class="lb-stat__label">Tổng điểm cộng đồng</span></div>
          </div>

          <div class="lb__table-wrap reveal is-visible">
            <table class="lb__table">
              <thead>
                <tr>
                  <th>Hạng</th>
                  <th>Họ tên</th>
                  <th>Đơn vị</th>
                  <th>Số bài đã chấm</th>
                  <th>Tổng điểm</th>
                  <th>Điểm TB</th>
                </tr>
              </thead>
              <tbody id="lbBody">
                {loading ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--clr-ink-3)' }}>Đang tải…</td></tr>
                ) : error ? (
                  <tr><td colSpan="6" style={{ color: '#C25B5B', textAlign: 'center', padding: '32px' }}>Lỗi: {error}</td></tr>
                ) : filteredSortedRows.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--clr-ink-3)' }}>Không có dữ liệu.</td></tr>
                ) : (
                  filteredSortedRows.map((r, i) => {
                    const rank = i + 1;
                    const medal = medals[i] || '';
                    const cls = rank === 1 ? 'lb__row--top1' : rank === 2 ? 'lb__row--top2' : rank === 3 ? 'lb__row--top3' : '';
                    const avg = r.avg_score != null ? r.avg_score : (r.count > 0 ? (r.total_score / r.count).toFixed(1) : '—');
                    return (
                      <tr key={r.user_id || i} class={cls}>
                        <td class="lb__rank">{medal} {rank}</td>
                        <td class="lb__team-name">{r.full_name}</td>
                        <td>{r.unit}</td>
                        <td>{r.count}</td>
                        <td class="lb__total">{r.total_score}</td>
                        <td>{avg}</td>
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
