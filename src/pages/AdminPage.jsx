import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api, auth, getAdminUnitsApi, createUnitApi, updateUnitApi, deleteUnitApi } from '../services/api';
import { getSubmissionStatus, fmtDate, fmtDateTime } from '../data/appData';
import { M1_CONFIG } from '../data/mission1Data';

function getFileIcon(fileName = '', fileUrl = '') {
  const str = (fileName + fileUrl).toLowerCase();
  if (/\.(jpg|jpeg|png|gif|webp|svg)/.test(str)) return '🖼️';
  if (/\.pdf/.test(str)) return '📕';
  if (/\.(doc|docx)/.test(str)) return '📄';
  if (/\.(xls|xlsx|csv)/.test(str)) return '📊';
  if (/\.(ppt|pptx)/.test(str)) return '📙';
  if (/\.(zip|rar|7z)/.test(str)) return '📦';
  return '📁';
}

function formatFileSize(bytes) {
  if (!bytes || isNaN(bytes)) return null;
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const initialView = ['submissions', 'units'].includes(tabParam) ? tabParam : 'pending';

  const [activeView, setActiveView] = useState(initialView);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [loadingPending, setLoadingPending] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  const [toastMsg, setToastMsg] = useState({ text: '', type: '' });

  // Modal State
  const [selectedSub, setSelectedSub] = useState(null);
  const [scoreInput, setScoreInput] = useState('');
  const [statusInput, setStatusInput] = useState('pending');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Phòng ban / đơn vị
  const emptyUnitForm = { id: null, code: '', name: '', totalPersonnel: '', sortOrder: '' };
  const [units, setUnits] = useState([]);
  const [loadingUnits, setLoadingUnits] = useState(true);
  const [unitForm, setUnitForm] = useState(emptyUnitForm);
  const [savingUnit, setSavingUnit] = useState(false);

  const showToast = (text, type = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg({ text: '', type: '' }), 3000);
  };

  const loadPending = async () => {
    setLoadingPending(true);
    try {
      const data = await api.getPendingUsers();
      setPendingUsers(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoadingPending(false);
    }
  };

  const loadSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const data = await api.getAllSubmissions();
      setSubmissions(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const loadUnits = async () => {
    setLoadingUnits(true);
    try {
      setUnits(await getAdminUnitsApi());
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoadingUnits(false);
    }
  };

  useEffect(() => {
    async function checkAdmin() {
      const u = await auth.load();
      if (!u || u.role !== 'admin') {
        navigate('/login');
        return;
      }
      loadPending();
      loadSubmissions();
      loadUnits();
    }
    checkAdmin();
  }, [navigate]);

  const handleEditUnit = (u) => {
    setUnitForm({
      id: u.id,
      code: u.code,
      name: u.name,
      totalPersonnel: String(u.totalPersonnel ?? ''),
      sortOrder: u.sortOrder != null ? String(u.sortOrder) : ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveUnit = async (e) => {
    e.preventDefault();
    const total = Number(unitForm.totalPersonnel);
    if (!unitForm.code.trim() || !unitForm.name.trim()) {
      showToast('Vui lòng nhập mã và tên đơn vị.', 'error');
      return;
    }
    if (!Number.isInteger(total) || total < 1) {
      showToast('Số lượng nhân sự phải là số nguyên ≥ 1.', 'error');
      return;
    }
    const payload = { code: unitForm.code.trim(), name: unitForm.name.trim(), totalPersonnel: total };
    if (unitForm.sortOrder !== '') {
      const order = Number(unitForm.sortOrder);
      if (!Number.isInteger(order)) {
        showToast('Thứ tự phải là số nguyên.', 'error');
        return;
      }
      payload.sortOrder = order;
    }
    setSavingUnit(true);
    try {
      if (unitForm.id) {
        await updateUnitApi(unitForm.id, payload);
        showToast('Đã cập nhật đơn vị.', 'success');
      } else {
        await createUnitApi(payload);
        showToast('Đã thêm đơn vị.', 'success');
      }
      setUnitForm(emptyUnitForm);
      loadUnits();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSavingUnit(false);
    }
  };

  const handleDeleteUnit = async (u) => {
    if (!window.confirm(`Xóa đơn vị "${u.name}" (${u.code})?`)) return;
    try {
      await deleteUnitApi(u.id);
      showToast('Đã xóa đơn vị.', 'success');
      if (unitForm.id === u.id) setUnitForm(emptyUnitForm);
      loadUnits();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Duyệt tài khoản này và tạo mật khẩu tạm?')) return;
    try {
      const res = await api.approveUser(id);
      showToast(res.message || 'Đã duyệt tài khoản.', 'success');
      loadPending();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Lý do từ chối:');
    if (reason == null) return;
    try {
      await api.rejectUser(id, { reason });
      showToast('Đã từ chối tài khoản.', 'success');
      loadPending();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleOpenSubmissionModal = (sub) => {
    setSelectedSub(sub);
    setScoreInput(sub.score != null ? String(sub.score) : '');
    setStatusInput(sub.status || 'pending');
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseSubmissionModal = () => {
    setIsModalOpen(false);
    setSelectedSub(null);
    document.body.style.overflow = '';
  };

  const handleSaveScore = async () => {
    if (!selectedSub) return;
    const payload = {};
    if (scoreInput !== '') {
      const val = Number(scoreInput);
      if (isNaN(val) || val < 0 || val > 100) {
        showToast('Điểm không hợp lệ (0–100).', 'error');
        return;
      }
      payload.score = val;
    }
    if (statusInput) {
      payload.status = statusInput;
    }

    if (!Object.keys(payload).length) {
      showToast('Chưa có thay đổi nào để lưu.', 'error');
      return;
    }

    try {
      await api.scoreSubmission(selectedSub.id, payload);
      showToast('Đã cập nhật bài nộp.', 'success');
      handleCloseSubmissionModal();
      loadSubmissions();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const filteredSubmissions = currentFilter === 'all'
    ? submissions
    : submissions.filter(s => Number(s.mission_id) === Number(currentFilter));

  const statusOptions = [
    { v: 'pending',          l: 'Chờ chấm' },
    { v: 'valid',            l: 'Hợp lệ' },
    { v: 'needs_supplement', l: 'Cần bổ sung' },
    { v: 'invalid',          l: 'Không hợp lệ' }
  ];

  const isMission1Sub = !!selectedSub && Number(selectedSub.mission_id) === M1_CONFIG.id;

  const modalFiles = selectedSub
    ? (selectedSub.attachments && selectedSub.attachments.length > 0)
      ? selectedSub.attachments
      : (selectedSub.file_url ? [{ id: 1, fileName: selectedSub.file_url.split('/').pop() || 'Tệp_đính_kèm', fileUrl: selectedSub.file_url }] : [])
    : [];

  return (
    <main className="admin-page">
      <div className="container">
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <button
            className={`btn ${activeView === 'pending' ? 'btn--gold' : 'btn--outline'}`}
            onClick={() => setActiveView('pending')}
          >
            Danh sách Nhân sự ({pendingUsers.length})
          </button>
          <button
            className={`btn ${activeView === 'submissions' ? 'btn--gold' : 'btn--outline'}`}
            onClick={() => setActiveView('submissions')}
          >
            Bài nộp ({submissions.length})
          </button>
          <button
            className={`btn ${activeView === 'units' ? 'btn--gold' : 'btn--outline'}`}
            onClick={() => setActiveView('units')}
          >
            Phòng ban ({units.length})
          </button>
        </div>

        {/* VIEW 3: QUẢN LÝ PHÒNG BAN / QUÂN SỐ */}
        {activeView === 'units' && (
          <section className="admin-view">
            <h1 className="admin-title">Quản lý Phòng ban &amp; Quân số</h1>
            {!loadingUnits && units.length > 0 && (() => {
              const list = units.filter(u => u.code !== 'PB_BTC');
              const joined = list.reduce((s, u) => s + (u.participantCount || 0), 0);
              const total = list.reduce((s, u) => s + (u.totalPersonnel || 0), 0);
              return (
                <p style={{ marginBottom: '16px', fontWeight: 600 }}>
                  Toàn công ty: {joined} / {total} CBNV tham gia ({total ? ((joined * 100) / total).toFixed(1) : 0}%)
                </p>
              );
            })()}

            <form onSubmit={handleSaveUnit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '20px', padding: '16px', background: '#fff', border: '1px solid var(--clr-line)', borderRadius: '10px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="unitCode">Mã đơn vị</label>
                <input id="unitCode" value={unitForm.code} placeholder="VD: PB_IT"
                  onChange={(e) => setUnitForm(f => ({ ...f, code: e.target.value }))} />
              </div>
              <div className="form-group" style={{ margin: 0, flex: '1 1 220px' }}>
                <label htmlFor="unitName">Tên đơn vị</label>
                <input id="unitName" value={unitForm.name} placeholder="VD: Phòng Kỹ thuật & CNTT"
                  onChange={(e) => setUnitForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="unitTotal">Quân số</label>
                <input id="unitTotal" type="number" min="1" value={unitForm.totalPersonnel} placeholder="VD: 50"
                  onChange={(e) => setUnitForm(f => ({ ...f, totalPersonnel: e.target.value }))} />
              </div>
              <div className="form-group" style={{ margin: 0, width: '90px' }}>
                <label htmlFor="unitOrder">Thứ tự</label>
                <input id="unitOrder" type="number" value={unitForm.sortOrder} placeholder="Tự động"
                  onChange={(e) => setUnitForm(f => ({ ...f, sortOrder: e.target.value }))} />
              </div>
              <button type="submit" className="btn btn--gold" disabled={savingUnit}>
                {savingUnit ? 'Đang lưu…' : unitForm.id ? 'Lưu thay đổi' : '+ Thêm đơn vị'}
              </button>
              {unitForm.id && (
                <button type="button" className="btn btn--outline" onClick={() => setUnitForm(emptyUnitForm)}>Hủy sửa</button>
              )}
            </form>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'center' }}>#</th>
                    <th>Mã</th>
                    <th>Tên phòng ban</th>
                    <th style={{ textAlign: 'center' }}>Tham gia / Quân số</th>
                    <th style={{ textAlign: 'center' }}>Chờ duyệt</th>
                    <th style={{ textAlign: 'center' }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingUnits ? (
                    <tr><td colSpan="6" style={{ textAlign: 'center' }}>Đang tải…</td></tr>
                  ) : units.length === 0 ? (
                    <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--clr-ink-3)' }}>Chưa có phòng ban nào.</td></tr>
                  ) : (
                    units.map(u => (
                      <tr key={u.id} style={unitForm.id === u.id ? { background: 'var(--clr-blue-pale)' } : undefined}>
                        <td style={{ textAlign: 'center' }}>{u.sortOrder ?? '—'}</td>
                        <td><code>{u.code}</code></td>
                        <td><strong>{u.name}</strong></td>
                        <td style={{ textAlign: 'center', minWidth: '150px' }}>
                          <strong>{u.participantCount ?? 0}</strong> / {u.totalPersonnel}
                          <span style={{ color: 'var(--clr-ink-3)' }}> ({u.participationRate ?? 0}%)</span>
                          <div style={{ height: '6px', background: '#eee', borderRadius: '3px', marginTop: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${Math.min(u.participationRate || 0, 100)}%`, height: '100%', background: 'var(--clr-blue)' }}></div>
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>{u.pendingCount ?? 0}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button className="btn-sm btn-approve" onClick={() => handleEditUnit(u)} style={{ marginRight: '6px' }} title="Sửa" aria-label={`Sửa ${u.name}`}>✎</button>
                          <button className="btn-sm btn-reject" onClick={() => handleDeleteUnit(u)} title="Xóa" aria-label={`Xóa ${u.name}`}>🗑</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* VIEW 1: QUẢN LÝ NHÂN SỰ */}
        {activeView === 'pending' && (
          <section id="view-pending" className="admin-view">
            <h1 className="admin-title">
              Quản lý Nhân sự Đăng ký <span className="badge" id="pendingCount">{pendingUsers.length}</span>
            </h1>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Mã NV</th>
                    <th>Đơn vị</th>
                    <th>Ngày ĐK</th>
                    <th>Trạng thái</th>
                    <th style={{ textAlign: 'center' }}>Hành động Admin</th>
                  </tr>
                </thead>
                <tbody id="pendingTable">
                  {loadingPending ? (
                    <tr><td colSpan="7" style={{ textAlign: 'center' }}>Đang tải…</td></tr>
                  ) : pendingUsers.length === 0 ? (
                    <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--clr-ink-3)' }}>Không có nhân sự nào trong hệ thống.</td></tr>
                  ) : (
                    pendingUsers.map(u => {
                      const st = String(u.approvalStatus || u.status || '').toUpperCase();
                      const isAccepted = st === 'ACCEPTED' || st === 'APPROVED';
                      const isRejected = st === 'REJECTED';

                      return (
                        <tr key={u.id}>
                          <td><strong>{u.full_name}</strong></td>
                          <td>{u.email}</td>
                          <td><code>{u.employee_id}</code></td>
                          <td>{u.unit}</td>
                          <td>{fmtDate(u.created_at)}</td>
                          <td>
                            <span style={{
                              padding: '3px 10px',
                              borderRadius: '12px',
                              background: isAccepted ? '#d4edda' : isRejected ? '#f8d7da' : '#fff3cd',
                              color: isAccepted ? '#155724' : isRejected ? '#721c24' : '#856404',
                              fontSize: '0.8rem',
                              fontWeight: 'bold',
                              display: 'inline-block'
                            }}>
                              {isAccepted ? '✓ Đã duyệt' : isRejected ? '✕ Từ chối' : '⏳ Chờ duyệt'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            {!isAccepted && (
                              <>
                                <button className="btn-sm btn-approve" onClick={() => handleApprove(u.id)} style={{ marginRight: '6px' }}>
                                  ✓ Duyệt &amp; Gửi Mail Pass
                                </button>
                                {!isRejected && (
                                  <button className="btn-sm btn-reject" onClick={() => handleReject(u.id)}>
                                    Từ chối
                                  </button>
                                )}
                              </>
                            )}
                            {isAccepted && (
                              <span style={{ fontSize: '0.82rem', color: '#28a745', fontWeight: 'bold' }}>
                                ✓ Đã duyệt &amp; Gửi Mail Pass
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* VIEW 2: BÀI NỘP */}
        {activeView === 'submissions' && (
          <section id="view-submissions" className="admin-view">
            <h1 className="admin-title">Bài nộp của người dùng</h1>

            <div className="admin-tabs" id="missionTabs">
              <button
                className={`admin-tab ${currentFilter === 'all' ? 'is-active' : ''}`}
                onClick={() => setCurrentFilter('all')}
              >
                Tất cả
              </button>
              <button
                className={`admin-tab ${currentFilter === '1' ? 'is-active' : ''}`}
                onClick={() => setCurrentFilter('1')}
              >
                Mission 1
              </button>
              <button
                className={`admin-tab ${currentFilter === '2' ? 'is-active' : ''}`}
                onClick={() => setCurrentFilter('2')}
              >
                Mission 2
              </button>
              <button
                className={`admin-tab ${currentFilter === '3' ? 'is-active' : ''}`}
                onClick={() => setCurrentFilter('3')}
              >
                Mission 3
              </button>
              <button
                className={`admin-tab ${currentFilter === '4' ? 'is-active' : ''}`}
                onClick={() => setCurrentFilter('4')}
              >
                Mission 4
              </button>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>USER</th>
                    <th>ĐƠN VỊ</th>
                    <th>MISSION</th>
                    <th>FILE</th>
                    <th>NGÀY NỘP</th>
                    <th>ĐIỂM</th>
                    <th>TRẠNG THÁI</th>
                    <th>HÀNH ĐỘNG</th>
                  </tr>
                </thead>
                <tbody id="subsTable">
                  {loadingSubmissions ? (
                    <tr><td colSpan="8" style={{ textAlign: 'center' }}>Đang tải…</td></tr>
                  ) : filteredSubmissions.length === 0 ? (
                    <tr><td colSpan="8" style={{ textAlign: 'center', color: 'var(--clr-ink-3)' }}>Không có bài nộp nào.</td></tr>
                  ) : (
                    filteredSubmissions.map(s => {
                      const st = getSubmissionStatus(s);
                      const subFiles = (s.attachments && s.attachments.length > 0)
                        ? s.attachments
                        : (s.file_url ? [{ id: 1, fileName: s.file_url.split('/').pop() || 'Tệp_đính_kèm', fileUrl: s.file_url }] : []);

                      return (
                        <tr key={s.id}>
                          <td><strong>{s.user_name || '—'}</strong></td>
                          <td>{s.user_unit || '—'}</td>
                          <td><strong>Mission {s.mission_id}</strong></td>
                          <td>
                            {subFiles.length === 0 ? (
                              <span style={{ color: 'var(--clr-ink-3)', fontSize: '0.85rem' }}>—</span>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {subFiles.map((att, idx) => (
                                  <a
                                    key={idx}
                                    href={att.fileUrl ? (att.fileUrl.includes('?') ? `${att.fileUrl}&download=true` : `${att.fileUrl}?download=true`) : '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download={att.fileName || true}
                                    title={`Tải file: ${att.fileName}`}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      padding: '4px 10px',
                                      borderRadius: '6px',
                                      background: '#e8f0fe',
                                      color: '#1a73e8',
                                      fontSize: '0.82rem',
                                      fontWeight: '600',
                                      textDecoration: 'none',
                                      border: '1px solid #d2e3fc',
                                      maxWidth: '200px',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap'
                                    }}
                                  >
                                    <span>{getFileIcon(att.fileName, att.fileUrl)}</span>
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{att.fileName}</span>
                                    <span style={{ fontSize: '0.75rem', opacity: 0.85 }}>📥</span>
                                  </a>
                                ))}
                              </div>
                            )}
                          </td>
                          <td>{fmtDateTime(s.submitted_at)}</td>
                          <td>{s.score != null ? <strong>{s.score}</strong> : <em style={{ color: 'var(--clr-ink-3)' }}>—</em>}</td>
                          <td><span className={`status-badge ${st.cls} status-badge--sm`}>{st.label}</span></td>
                          <td>
                            <button className="btn-sm btn-view" onClick={() => handleOpenSubmissionModal(s)}>
                              Xem bài
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      {/* MODAL XEM BÀI & CHẤM ĐIỂM GOOGLE DRIVE STYLE */}
      {isModalOpen && selectedSub && (
        <div className="modal is-open" aria-hidden="false" role="dialog">
          <div className="modal__backdrop" onClick={handleCloseSubmissionModal}></div>
          <div className="modal__panel modal__panel--large" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <button className="modal__close" onClick={handleCloseSubmissionModal} aria-label="Đóng">&times;</button>
            <div className="submission-detail">
              <div className="submission-detail__header" style={{ borderBottom: '1px solid #eee', pb: '16px', mb: '16px' }}>
                <p className="submission-detail__team" style={{ color: '#1a73e8', fontWeight: 600 }}>
                  👤 {selectedSub.user_name} · {selectedSub.user_unit}
                </p>
                <h2 className="submission-detail__title">Bài nộp Mission {selectedSub.mission_id}</h2>
                <p className="submission-detail__mission">Nộp lúc: {fmtDateTime(selectedSub.submitted_at)}</p>
                <div className="submission-detail__badges" style={{ marginTop: '10px' }}>
                  <span className={`status-badge ${getSubmissionStatus(selectedSub).cls}`}>
                    {getSubmissionStatus(selectedSub).label}
                  </span>
                </div>
              </div>

              {/* GOOGLE DRIVE ATTACHMENTS GRID */}
              <div className="drive-attachments-wrap" style={{ margin: '16px 0', padding: '16px', background: '#f8f9fa', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: '#202124', fontSize: '0.98rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>📁</span>
                    <span>Tệp đính kèm trên hệ thống ({modalFiles.length} tệp)</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', background: '#e8f0fe', color: '#1a73e8', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                    Google Drive View
                  </span>
                </div>

                {modalFiles.length === 0 ? (
                  <p style={{ color: '#70757a', fontSize: '0.9rem', margin: 0 }}>Thí sinh không đính kèm tệp nào.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '14px' }}>
                    {modalFiles.map((att, idx) => {
                      const isImg = /\.(jpg|jpeg|png|gif|webp)$/i.test(att.fileUrl || att.fileName);
                      const icon = getFileIcon(att.fileName, att.fileUrl);
                      const sizeStr = formatFileSize(att.fileSize);

                      return (
                        <div key={idx} style={{
                          background: '#ffffff',
                          border: '1px solid #dadce0',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                        }}>
                          {/* Preview Area */}
                          <div style={{
                            height: '110px',
                            background: '#f1f3f4',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                          }}>
                            {isImg ? (
                              <img src={att.fileUrl} alt={att.fileName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ fontSize: '2.8rem' }}>{icon}</div>
                            )}
                          </div>

                          {/* File Details */}
                          <div style={{ padding: '10px 12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                              <div style={{ fontWeight: '600', fontSize: '0.85rem', color: '#202124', wordBreak: 'break-word', marginBottom: '4px', lineHeight: '1.3' }}>
                                {att.fileName}
                              </div>
                              {sizeStr && (
                                <div style={{ fontSize: '0.75rem', color: '#5f6368' }}>{sizeStr}</div>
                              )}
                            </div>

                            {/* Download / Open buttons */}
                            <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                              <a
                                href={att.fileUrl ? (att.fileUrl.includes('?') ? `${att.fileUrl}&download=true` : `${att.fileUrl}?download=true`) : '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                download={att.fileName || true}
                                style={{
                                  flex: 1,
                                  textAlign: 'center',
                                  padding: '6px 8px',
                                  borderRadius: '4px',
                                  background: '#1a73e8',
                                  color: '#fff',
                                  fontSize: '0.78rem',
                                  fontWeight: '600',
                                  textDecoration: 'none'
                                }}
                              >
                                📥 Tải về
                              </a>
                              <a
                                href={att.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  padding: '6px 8px',
                                  borderRadius: '4px',
                                  border: '1px solid #dadce0',
                                  color: '#3c4043',
                                  fontSize: '0.78rem',
                                  fontWeight: '500',
                                  textDecoration: 'none',
                                  background: '#fff'
                                }}
                              >
                                👁️ Xem
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {selectedSub.note && (
                <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #eee', marginBottom: '16px' }}>
                  <strong style={{ color: '#333' }}>📝 Ghi chú / Trả lời:</strong>
                  <p style={{ color: '#555', fontSize: '0.92rem', lineHeight: 1.6, marginTop: '6px', whiteSpace: 'pre-wrap' }}>
                    {selectedSub.note}
                  </p>
                </div>
              )}

              <div className="score-form" style={{ marginTop: '16px' }}>
                <label htmlFor="scoreInput"><strong>Chấm điểm (0–100):</strong></label>
                <input
                  type="number"
                  id="scoreInput"
                  min="0"
                  max="100"
                  value={scoreInput}
                  onChange={(e) => setScoreInput(e.target.value)}
                  placeholder="Nhập điểm"
                />
                {isMission1Sub && (
                  <p style={{ color: 'var(--clr-ink-3)', fontSize: '0.85rem', marginTop: '6px' }}>
                    Mission 01: hoàn thành hợp lệ = {M1_CONFIG.points} điểm (tự điền khi chọn "Hợp lệ").
                  </p>
                )}
              </div>

              <div className="status-form">
                <label><strong>Trạng thái bài nộp:</strong></label>
                <div className="status-options" role="radiogroup">
                  {statusOptions.map(o => (
                    <label key={o.v} className="status-option">
                      <input
                        type="radio"
                        name="subStatus"
                        value={o.v}
                        checked={statusInput === o.v}
                        onChange={() => {
                          setStatusInput(o.v);
                          // Mission 01: hoàn thành hợp lệ = 1 điểm
                          if (o.v === 'valid' && isMission1Sub && scoreInput === '') setScoreInput(String(M1_CONFIG.points));
                        }}
                      />
                      <span>{o.l}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap', marginTop: '20px' }}>
                <button className="btn btn--outline" type="button" onClick={handleCloseSubmissionModal}>Đóng</button>
                <button className="btn btn--gold" type="button" onClick={handleSaveScore}>Lưu thay đổi</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMsg.text && (
        <div id="toast" className={`toast is-visible ${toastMsg.type ? 'toast--' + toastMsg.type : ''}`} role="status">
          {toastMsg.text}
        </div>
      )}
    </main>
  );
}
