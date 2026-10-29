import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { fmtDateTime } from '../data/appData';

const MEDALS = ['🥇', '🥈', '🥉'];

/* Xếp hạng đơn vị: mỗi mission một thành viên nộp hợp lệ = 1 điểm cho đơn vị.
   Tỷ lệ (%) = điểm đạt / (số nhân sự × số mission) — tiêu chí xếp hạng. */
function UnitRanking() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      setRows(await api.getUnitProgress());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalMissions = rows[0]?.total_missions || 4;
  const earned = rows.reduce((s, r) => s + r.earned_points, 0);
  const max = rows.reduce((s, r) => s + r.max_points, 0);
  const overall = max ? Math.round((earned / max) * 10000) / 100 : 0;
  const filtered = rows.filter(r => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return r.unit_name.toLowerCase().includes(q) || r.unit_code.toLowerCase().includes(q);
  });

  return (
    <>
      <p className="lb-formula">
        Mỗi mission một thành viên nộp hợp lệ = <strong>1 điểm</strong> cho đơn vị.
        Tổng điểm của đơn vị = số nhân sự × {totalMissions} mission (ví dụ 10 người → 40 điểm).
        <br />
        <strong>Tỷ lệ (%) = Điểm đạt được / Tổng điểm × 100</strong> — đơn vị có tỷ lệ cao hơn xếp trên.
      </p>

      <div className="lb-filters reveal is-visible">
        <input
          type="text"
          placeholder="🔍 Tìm theo tên hoặc mã đơn vị..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn--outline" type="button" onClick={loadData}>↻ Tải lại</button>
      </div>

      <div className="lb-stats">
        <div className="lb-stat"><span className="lb-stat__value">{rows.length}</span><span className="lb-stat__label">Đơn vị xếp hạng</span></div>
        <div className="lb-stat"><span className="lb-stat__value">{earned}</span><span className="lb-stat__label">Tổng điểm đạt</span></div>
        <div className="lb-stat"><span className="lb-stat__value">{max}</span><span className="lb-stat__label">Tổng điểm tối đa</span></div>
        <div className="lb-stat"><span className="lb-stat__value">{overall}%</span><span className="lb-stat__label">Tỷ lệ toàn công ty</span></div>
      </div>

      <div className="lb__table-wrap reveal is-visible">
        <table className="lb__table">
          <thead>
            <tr>
              <th>Hạng</th>
              <th>Đơn vị</th>
              <th>Nhân sự</th>
              <th>Điểm đạt / Tổng điểm</th>
              <th>Tỷ lệ</th>
              <th>Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--clr-ink-3)' }}>Đang tải…</td></tr>
            ) : error ? (
              <tr><td colSpan="6" style={{ color: '#C25B5B', textAlign: 'center', padding: '32px' }}>Lỗi: {error}</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--clr-ink-3)' }}>Không có dữ liệu.</td></tr>
            ) : (
              filtered.map((r) => {
                const medal = MEDALS[r.rank - 1] || '';
                const cls = medal ? `lb__row--top${r.rank}` : '';
                return (
                  <tr key={r.unit_id ?? r.unit_code} className={cls}>
                    <td className="lb__rank">{medal} {r.rank}</td>
                    <td className="lb__team-name">
                      {r.unit_name}
                      {r.unit_code && <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--clr-ink-3)' }}>{r.unit_code}</div>}
                    </td>
                    <td style={{ textAlign: 'center' }}>{r.total_personnel}</td>
                    <td style={{ textAlign: 'center' }}><strong>{r.earned_points}</strong> / {r.max_points}</td>
                    <td className="lb__total">
                      {r.score_percent}%
                      <div className="unit-progress" aria-hidden="true">
                        <div className="unit-progress__bar" style={{ width: `${Math.min(r.score_percent, 100)}%` }}></div>
                      </div>
                    </td>
                    <td className="mono" style={{ fontSize: '0.8rem' }}>{r.last_updated_at ? fmtDateTime(r.last_updated_at) : '—'}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function IndividualRanking() {
  const [allRows, setAllRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('score');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // No limit → every ranked player
      const data = await api.getIndividualLeaderboard();
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

  const totalPlayers = allRows.length;
  const totalUnits = new Set(allRows.map(r => r.unit_name)).size;
  const topScore = totalPlayers ? Math.max(...allRows.map(r => r.total_score || 0)) : 0;
  const avgScore = totalPlayers
    ? Math.round((allRows.reduce((s, r) => s + (r.total_score || 0), 0) / totalPlayers) * 10) / 10
    : 0;

  const filteredSortedRows = allRows
    .filter(r => {
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      return (r.full_name || '').toLowerCase().includes(q) || (r.unit_name || '').toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === 'score') return a.rank - b.rank;
      if (sortBy === 'name') return (a.full_name || '').localeCompare(b.full_name || '', 'vi');
      if (sortBy === 'unit') return (a.unit_name || '').localeCompare(b.unit_name || '', 'vi') || (a.rank - b.rank);
      return 0;
    });

  return (
    <>
      <div className="lb-filters reveal is-visible">
        <input
          type="text"
          id="lbSearch"
          placeholder="🔍 Tìm theo họ tên hoặc đơn vị..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          id="lbSort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="score">Sắp xếp: Tổng điểm (cao → thấp)</option>
          <option value="name">Sắp xếp: Họ tên</option>
          <option value="unit">Sắp xếp: Đơn vị</option>
        </select>
        <button className="btn btn--outline" id="lbReload" type="button" onClick={loadData}>
          ↻ Tải lại
        </button>
      </div>

      <div className="lb-stats" id="lbStats">
        <div className="lb-stat"><span className="lb-stat__value">{totalPlayers}</span><span className="lb-stat__label">Người chơi có điểm</span></div>
        <div className="lb-stat"><span className="lb-stat__value">{totalUnits}</span><span className="lb-stat__label">Đơn vị tham gia</span></div>
        <div className="lb-stat"><span className="lb-stat__value">{topScore}</span><span className="lb-stat__label">Điểm cao nhất</span></div>
        <div className="lb-stat"><span className="lb-stat__value">{avgScore}</span><span className="lb-stat__label">Điểm trung bình</span></div>
      </div>

      <div className="lb__table-wrap reveal is-visible">
        <table className="lb__table">
          <thead>
            <tr>
              <th>Hạng</th>
              <th>Họ tên</th>
              <th>Đơn vị</th>
              <th>Tổng điểm</th>
            </tr>
          </thead>
          <tbody id="lbBody">
            {loading ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: 'var(--clr-ink-3)' }}>Đang tải…</td></tr>
            ) : error ? (
              <tr><td colSpan="4" style={{ color: '#C25B5B', textAlign: 'center', padding: '32px' }}>Lỗi: {error}</td></tr>
            ) : filteredSortedRows.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: 'var(--clr-ink-3)' }}>Không có dữ liệu.</td></tr>
            ) : (
              filteredSortedRows.map((r) => {
                // Rank comes from the backend (by total score, ties share a rank)
                const medal = MEDALS[r.rank - 1] || '';
                const cls = medal ? `lb__row--top${r.rank}` : '';
                return (
                  <tr key={r.employee_id ?? r.full_name} className={cls}>
                    <td className="lb__rank">{medal} {r.rank}</td>
                    <td className="lb__team-name">{r.full_name}</td>
                    <td>{r.unit_name}</td>
                    <td className="lb__total">{r.total_score}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function LeaderboardPage() {
  const [view, setView] = useState('units');

  return (
    <main>
      <section className="section">
        <div className="container">
          <p className="section__label mono reveal is-visible">RANKING — BẢNG XẾP HẠNG</p>
          <h1 className="section__title reveal is-visible">Bảng xếp hạng</h1>
          <p className="section__desc reveal is-visible">
            {view === 'units'
              ? 'Xếp hạng phòng ban theo tỷ lệ điểm hoàn thành mission của toàn bộ nhân sự.'
              : 'Xếp hạng tất cả người chơi theo tổng điểm đã được BTC chấm.'}
          </p>

          <div className="lb-tabs" role="tablist">
            <button type="button" role="tab" aria-selected={view === 'units'}
              className={`admin-tab ${view === 'units' ? 'is-active' : ''}`} onClick={() => setView('units')}>
              Phòng ban
            </button>
            <button type="button" role="tab" aria-selected={view === 'individuals'}
              className={`admin-tab ${view === 'individuals' ? 'is-active' : ''}`} onClick={() => setView('individuals')}>
              Cá nhân
            </button>
          </div>

          {view === 'units' ? <UnitRanking /> : <IndividualRanking />}
        </div>
      </section>
    </main>
  );
}
