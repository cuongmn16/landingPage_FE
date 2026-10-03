import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, auth } from '../services/api';
import { fmtDateTime, getSubmissionStatus } from '../data/appData';

export default function AllSubmissionsPage() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');

  const loadSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAllSubmissions();
      const m1Subs = data.filter(s => Number(s.mission_id) === 1);
      setSubmissions(m1Subs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function checkAdmin() {
      const u = await auth.load();
      if (!u || u.role !== 'admin') {
        navigate('/login');
        return;
      }
      loadSubmissions();
    }
    checkAdmin();
  }, [navigate]);

  const filteredSortedSubmissions = submissions
    .filter(s => {
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      return (
        (s.user_name || '').toLowerCase().includes(q) ||
        (s.user_unit || '').toLowerCase().includes(q) ||
        (s.user_email || '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sort === 'newest') return new Date(b.submitted_at) - new Date(a.submitted_at);
      if (sort === 'oldest') return new Date(a.submitted_at) - new Date(b.submitted_at);
      if (sort === 'score-desc') return (b.score || 0) - (a.score || 0);
      if (sort === 'score-asc') return (a.score || 0) - (b.score || 0);
      return 0;
    });

  return (
    <main>
      <section class="m1-section">
        <div class="container">
          <p class="m1-section__label mono">ADMIN — TOÀN BỘ BÀI DỰ THI</p>
          <h1 class="m1-section__title">Tất cả bài dự thi Mission 01</h1>
          <p class="m1-section__desc">Tìm kiếm theo tên, đơn vị hoặc email. Nhấn vào từng bài để mở file.</p>

          <div class="as-controls" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <input
              type="text"
              id="asSearch"
              placeholder="🔍 Tìm theo tên, đơn vị, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: '240px', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--clr-line)' }}
            />
            <select
              id="asSort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--clr-line)' }}
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="score-desc">Điểm cao → thấp</option>
              <option value="score-asc">Điểm thấp → cao</option>
            </select>
            <button class="btn btn--outline" onClick={loadSubmissions}>↻ Tải lại</button>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', padding: '40px', color: 'var(--clr-ink-3)' }}>Đang tải…</p>
          ) : error ? (
            <p style={{ textAlign: 'center', color: '#C25B5B', padding: '40px' }}>Lỗi: {error}</p>
          ) : filteredSortedSubmissions.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px', color: 'var(--clr-ink-3)' }}>Không có bài nộp nào phù hợp.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {filteredSortedSubmissions.map(s => {
                const st = getSubmissionStatus(s);
                return (
                  <div key={s.id} style={{ background: '#FFFFFF', border: '1px solid var(--clr-line)', borderRadius: '8px', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{s.user_name}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--clr-ink-3)' }}>{s.user_unit} · {s.user_email}</p>
                      </div>
                      <span class={`status-badge ${st.cls} status-badge--sm`}>{st.label}</span>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--clr-ink-2)', marginBottom: '12px' }}>
                      Nộp lúc: {fmtDateTime(s.submitted_at)}
                    </p>

                    {s.note && (
                      <p style={{ fontSize: '0.9rem', color: 'var(--clr-ink-2)', marginBottom: '12px', fontStyle: 'italic' }}>
                        "{s.note}"
                      </p>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--clr-line)' }}>
                      <div>
                        {s.score != null ? (
                          <strong style={{ color: 'var(--clr-orange-dark)' }}>Điểm: {s.score}</strong>
                        ) : (
                          <em style={{ color: 'var(--clr-ink-3)' }}>Chưa chấm</em>
                        )}
                      </div>
                      {s.file_url && (
                        <a href={s.file_url} target="_blank" rel="noopener noreferrer" class="btn btn--gold" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                          Mở file →
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
