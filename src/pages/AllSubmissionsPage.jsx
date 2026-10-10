/* ============================================================
   ALL SUBMISSIONS — trang xem toàn bộ bài dự thi Mission 01 (admin)
   port từ src_demo/mission-1 (all-submissions.html + all-submissions.js)
   ============================================================ */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, auth } from '../services/api';
import { m1FmtDateTime as fmtDateTime } from '../data/mission1Data';

export default function AllSubmissionsPage() {
  const navigate = useNavigate();
  const [allSubs, setAllSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');

  async function loadAll() {
    setLoading(true);
    setError('');
    const user = await auth.load();
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    try {
      const data = await api.getAllSubmissions();
      setAllSubs(data.filter(s => Number(s.mission_id) === 1));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = allSubs.length;
  const scored = allSubs.filter(s => s.score != null).length;
  const avg = scored
    ? (allSubs.reduce((sum, s) => sum + (s.score || 0), 0) / scored).toFixed(1)
    : '—';

  const q = search.trim().toLowerCase();
  const list = allSubs.filter(s => {
    if (!q) return true;
    return (
      (s.user_name || '').toLowerCase().includes(q) ||
      (s.user_unit || '').toLowerCase().includes(q) ||
      (s.user_email || '').toLowerCase().includes(q)
    );
  });
  if (sort === 'newest')          list.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
  else if (sort === 'oldest')     list.sort((a, b) => new Date(a.submitted_at) - new Date(b.submitted_at));
  else if (sort === 'score-desc') list.sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
  else if (sort === 'score-asc')  list.sort((a, b) => (a.score ?? 999) - (b.score ?? 999));

  const openFile = (s) => { if (s.file_url) window.open(s.file_url, '_blank', 'noopener'); };

  function renderList() {
    if (loading) {
      return <p style={{ textAlign: 'center', padding: '40px', color: 'var(--clr-ink-3)' }}>Đang tải…</p>;
    }
    if (error) {
      return <p style={{ color: '#C25B5B', textAlign: 'center', padding: '40px' }}>Lỗi tải dữ liệu: {error}</p>;
    }
    if (!allSubs.length) {
      return (
        <div className="empty-state">
          <div className="empty-state__icon">📁</div>
          <h3 className="empty-state__title">Chưa có bài nộp nào</h3>
          <p className="empty-state__desc">Bài dự thi Mission 1 sẽ hiển thị khi người dùng nộp bài.</p>
        </div>
      );
    }
    if (!list.length) {
      return (
        <p style={{ textAlign: 'center', padding: '40px', color: 'var(--clr-ink-3)' }}>
          Không tìm thấy bài nào khớp "{search}"
        </p>
      );
    }

    return (
      <div className="as-grid">
        {list.map(s => {
          const fileUrl = s.file_url || '';
          const isImg = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl);
          const isPdf = /\.pdf$/i.test(fileUrl);
          return (
            <article
              key={s.id}
              className="as-card"
              tabIndex={0}
              role="button"
              onClick={() => openFile(s)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFile(s); }
              }}
            >
              <div className="as-card__thumb">
                {isImg
                  ? <img src={fileUrl} alt={s.user_name} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  : <div className="submission-card__thumb-placeholder">{isPdf ? '📄' : '📎'}</div>}
                {s.score != null
                  ? <span className="submission-card__score">{s.score} đ</span>
                  : <span className="submission-card__score submission-card__score--pending">Chưa chấm</span>}
              </div>
              <div className="as-card__body">
                <p className="as-card__name">{s.user_name || '—'}</p>
                <p className="as-card__unit">{s.user_unit || '—'}</p>
                {s.user_email && <p className="as-card__email">{s.user_email}</p>}
                <p className="as-card__date">Nộp lúc {fmtDateTime(s.submitted_at)}</p>
              </div>
            </article>
          );
        })}
      </div>
    );
  }

  return (
    <main>
      <section className="m1-section">
        <div className="container">
          <p className="m1-section__label mono">ADMIN — TOÀN BỘ BÀI DỰ THI</p>
          <h1 className="m1-section__title">Tất cả bài dự thi Mission 01</h1>
          <p className="m1-section__desc">Tìm kiếm theo tên, đơn vị hoặc email. Nhấn vào từng bài để mở file.</p>

          <div className="as-controls">
            <input
              type="text"
              placeholder="🔍 Tìm theo tên, đơn vị, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="score-desc">Điểm cao → thấp</option>
              <option value="score-asc">Điểm thấp → cao</option>
            </select>
            <button className="btn btn--outline" type="button" onClick={() => { setAllSubs([]); loadAll(); }}>
              ↻ Tải lại
            </button>
          </div>

          {!loading && !error && (
            <div className="as-stats">
              <div className="as-stat"><span className="as-stat__value">{total}</span><span className="as-stat__label">Tổng bài nộp</span></div>
              <div className="as-stat"><span className="as-stat__value">{scored}</span><span className="as-stat__label">Đã chấm</span></div>
              <div className="as-stat"><span className="as-stat__value">{total - scored}</span><span className="as-stat__label">Chưa chấm</span></div>
              <div className="as-stat"><span className="as-stat__value">{avg}</span><span className="as-stat__label">Điểm TB</span></div>
            </div>
          )}

          <div>{renderList()}</div>
        </div>
      </section>
    </main>
  );
}
