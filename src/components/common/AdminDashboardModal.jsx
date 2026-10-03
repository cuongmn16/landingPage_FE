import React, { useState, useEffect } from 'react';
import { 
  fetchAllSubmissionsApi,
  fetchAllEmployeesApi, 
  fetchRuleConfigApi, 
  updateRuleConfigApi, 
  updateSubmissionStatusApi, 
  reopenSubmissionApi 
} from '../../services/api';

export default function AdminDashboardModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('submissions'); // 'submissions', 'employees', 'rule'
  
  // Submissions state
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [missionFilter, setMissionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchSubText, setSearchSubText] = useState('');
  const [previewSub, setPreviewSub] = useState(null);

  // Employees state
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  // Rule Config state
  const [ruleConfig, setRuleConfig] = useState(null);
  const [minMissionsInput, setMinMissionsInput] = useState('1');
  const [ruleSaving, setRuleSaving] = useState(false);

  const [message, setMessage] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadSubmissions();
      loadEmployees();
      loadRuleConfig();
    }
  }, [isOpen]);

  const loadSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const data = await fetchAllSubmissionsApi();
      setSubmissions(data || []);
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const loadEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const data = await fetchAllEmployeesApi();
      setEmployees(data || []);
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const loadRuleConfig = async () => {
    try {
      const data = await fetchRuleConfigApi();
      if (data) {
        setRuleConfig(data);
        setMinMissionsInput(data.configValue || '1');
      }
    } catch (err) {
      console.error('Error fetching rule config:', err);
    }
  };

  const handleUpdateStatus = async (subId, newStatus) => {
    setUpdatingId(subId);
    setMessage('');
    try {
      await updateSubmissionStatusApi(subId, newStatus);
      setMessage(`✓ Đã cập nhật trạng thái bài nộp #${subId} thành ${newStatus}`);
      await loadSubmissions();
    } catch (err) {
      console.error('Error updating status:', err);
      setMessage(`⚠️ Lỗi khi cập nhật trạng thái: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReopen = async (subId) => {
    setUpdatingId(subId);
    setMessage('');
    try {
      await reopenSubmissionApi(subId);
      setMessage(`✓ Đã mở lại bài nộp #${subId} cho nhân sự sửa câu trả lời.`);
      await loadSubmissions();
    } catch (err) {
      console.error('Error reopening submission:', err);
      setMessage(`⚠️ Lỗi khi mở lại bài nộp: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveRule = async (e) => {
    e.preventDefault();
    setRuleSaving(true);
    setMessage('');
    try {
      const updated = await updateRuleConfigApi({
        ruleType: 'MIN_COMPLETED_MISSIONS',
        configValue: minMissionsInput,
        description: `BTC quy định nhân sự cần nộp tối thiểu ${minMissionsInput} Mission để được tính hợp lệ.`
      });
      setRuleConfig(updated);
      setMessage('✓ Đã cập nhật Quy tắc BTC thành công! Bảng xếp hạng Tỷ lệ tham gia sẽ tự động tính lại.');
    } catch (err) {
      console.error('Error saving rule config:', err);
      setMessage('⚠️ Lỗi khi cập nhật quy tắc.');
    } finally {
      setRuleSaving(false);
    }
  };

  // Filter submissions
  const filteredSubmissions = submissions.filter(sub => {
    if (missionFilter !== 'all' && String(sub.missionId) !== missionFilter) return false;
    if (statusFilter !== 'all' && sub.status !== statusFilter) return false;
    if (searchSubText.trim()) {
      const q = searchSubText.toLowerCase().trim();
      const name = (sub.fullName || '').toLowerCase();
      const code = (sub.employeeCode || '').toLowerCase();
      const unit = (sub.unitName || sub.unitCode || '').toLowerCase();
      const email = (sub.email || '').toLowerCase();
      if (!name.includes(q) && !code.includes(q) && !unit.includes(q) && !email.includes(q)) return false;
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'VALID':
        return <span style={{ padding: '3px 8px', borderRadius: '12px', background: '#d4edda', color: '#155724', fontWeight: 'bold', fontSize: '0.78rem' }}>✓ Hợp lệ</span>;
      case 'INVALID':
        return <span style={{ padding: '3px 8px', borderRadius: '12px', background: '#f8d7da', color: '#721c24', fontWeight: 'bold', fontSize: '0.78rem' }}>✕ Không hợp lệ</span>;
      case 'REOPENED':
        return <span style={{ padding: '3px 8px', borderRadius: '12px', background: '#cce5ff', color: '#004085', fontWeight: 'bold', fontSize: '0.78rem' }}>🔄 Cho phép sửa</span>;
      default:
        return <span style={{ padding: '3px 8px', borderRadius: '12px', background: '#fff3cd', color: '#856404', fontWeight: 'bold', fontSize: '0.78rem' }}>⏳ Đã nộp</span>;
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`modal modal--submission ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen} role="dialog">
      <div className="modal__backdrop" onClick={onClose}></div>
      <div className="modal__panel modal__panel--large" style={{ maxHeight: '92vh', overflowY: 'auto', width: '95%', maxWidth: '1200px' }}>
        <button className="modal__close" onClick={onClose} aria-label="Đóng">&times;</button>

        <div style={{ padding: '8px' }}>
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <span className="mono" style={{ color: 'var(--clr-gold)', fontSize: '0.85rem' }}>ADMIN DASHBOARD — BAN TỔ CHỨC CTIN</span>
              <h2 style={{ fontSize: '1.6rem', marginTop: '4px' }}>Hệ Thống Quản Trị Bài Thi &amp; Nhân Sự Central DB</h2>
            </div>
            <button 
              onClick={() => { loadSubmissions(); loadEmployees(); loadRuleConfig(); }} 
              className="btn" 
              style={{ fontSize: '0.8rem', padding: '6px 14px', background: '#0A4E82', color: '#fff' }}
            >
              🔄 Tải lại dữ liệu
            </button>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #eee', marginBottom: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('submissions')}
              style={{
                padding: '10px 18px',
                fontWeight: 600,
                border: 'none',
                background: activeTab === 'submissions' ? 'var(--clr-gold)' : 'transparent',
                color: activeTab === 'submissions' ? '#000' : '#555',
                borderRadius: '6px 6px 0 0',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              📝 Bài thi Nhân viên ({submissions.length})
            </button>

            <button
              onClick={() => setActiveTab('employees')}
              style={{
                padding: '10px 18px',
                fontWeight: 600,
                border: 'none',
                background: activeTab === 'employees' ? 'var(--clr-gold)' : 'transparent',
                color: activeTab === 'employees' ? '#000' : '#555',
                borderRadius: '6px 6px 0 0',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              👥 Nhân sự Đăng ký ({employees.length})
            </button>

            <button
              onClick={() => setActiveTab('rule')}
              style={{
                padding: '10px 18px',
                fontWeight: 600,
                border: 'none',
                background: activeTab === 'rule' ? 'var(--clr-gold)' : 'transparent',
                color: activeTab === 'rule' ? '#000' : '#555',
                borderRadius: '6px 6px 0 0',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              ⚙️ Cấu hình Quy tắc BTC
            </button>
          </div>

          {message && (
            <div style={{ padding: '10px 14px', background: '#e2f0d9', color: '#385723', borderRadius: '6px', marginBottom: '14px', fontSize: '0.9rem' }}>
              {message}
            </div>
          )}

          {/* TAB 1: ALL SUBMISSIONS */}
          {activeTab === 'submissions' && (
            <div>
              {/* Filters */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', flexWrap: 'wrap', alignItems: 'center', background: '#fafafa', padding: '12px', borderRadius: '8px', border: '1px solid #eee' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '2px' }}>Mission:</label>
                  <select
                    value={missionFilter}
                    onChange={(e) => setMissionFilter(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.85rem' }}
                  >
                    <option value="all">Tất cả Missions</option>
                    <option value="1">Mission 01 — JOURNEY MAP</option>
                    <option value="2">Mission 02 — LEGACY STORIES</option>
                    <option value="3">Mission 03 — LEADERSHIP LEGACIES</option>
                    <option value="4">Mission 04 — CTIN DNA MAP</option>
                    <option value="5">Mission 05 — LEGACY COLLECTION</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '2px' }}>Trạng thái:</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.85rem' }}
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="SUBMITTED">⏳ Đã nộp</option>
                    <option value="VALID">✓ Hợp lệ</option>
                    <option value="INVALID">✕ Không hợp lệ</option>
                    <option value="REOPENED">🔄 Cho phép sửa</option>
                  </select>
                </div>

                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '2px' }}>Tìm kiếm Nhân viên:</label>
                  <input
                    type="text"
                    value={searchSubText}
                    onChange={(e) => setSearchSubText(e.target.value)}
                    placeholder="Họ tên, mã NV, email hoặc đơn vị..."
                    style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ overflowX: 'auto', border: '1px solid #eee', borderRadius: '6px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead style={{ background: '#f5f5f5' }}>
                    <tr>
                      <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>ID</th>
                      <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Nhân sự Nộp bài</th>
                      <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Đơn vị</th>
                      <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Mission</th>
                      <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>File đính kèm</th>
                      <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Thời gian nộp</th>
                      <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Trạng thái</th>
                      <th style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>Thao tác Admin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingSubmissions ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '24px' }}>Đang tải tất cả bài nộp từ Server...</td>
                      </tr>
                    ) : filteredSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '24px', color: '#888' }}>
                          {submissions.length === 0 ? 'Chưa có bài nộp nào trên hệ thống DB.' : 'Không tìm thấy bài nộp phù hợp bộ lọc.'}
                        </td>
                      </tr>
                    ) : (
                      filteredSubmissions.map((sub) => (
                        <tr key={sub.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '10px', fontWeight: 'bold' }}>#{sub.id}</td>
                          <td style={{ padding: '10px' }}>
                            <div style={{ fontWeight: 'bold' }}>{sub.fullName || 'Chưa cập nhật'}</div>
                            <div style={{ fontSize: '0.78rem', color: '#555' }}>
                              <code>{sub.employeeCode || `NV#${sub.employeeId}`}</code> | {sub.email}
                            </div>
                          </td>
                          <td style={{ padding: '10px' }}>{sub.unitName || sub.unitCode || '-'}</td>
                          <td style={{ padding: '10px' }}>
                            <span style={{ fontWeight: 600, color: 'var(--clr-gold-dark)' }}>{sub.missionCode || `Mission ${sub.missionId}`}</span>
                            <div style={{ fontSize: '0.78rem', color: '#666' }}>{sub.missionTitle}</div>
                          </td>
                          <td style={{ padding: '10px' }}>
                            {sub.attachments && sub.attachments.length > 0 ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                {sub.attachments.map(att => (
                                  <a 
                                    key={att.id} 
                                    href={att.fileUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    style={{ color: '#0056b3', textDecoration: 'underline', fontSize: '0.78rem' }}
                                  >
                                    📄 {att.originalFileName}
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <span style={{ color: '#aaa', fontSize: '0.8rem' }}>Không có tệp</span>
                            )}
                          </td>
                          <td style={{ padding: '10px', fontSize: '0.78rem', color: '#555' }}>
                            {sub.lastUpdatedAt ? new Date(sub.lastUpdatedAt).toLocaleString('vi-VN') : (sub.submissionTime ? new Date(sub.submissionTime).toLocaleString('vi-VN') : '-')}
                          </td>
                          <td style={{ padding: '10px' }}>
                            {getStatusBadge(sub.status)}
                          </td>
                          <td style={{ padding: '10px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap' }}>
                              <button
                                onClick={() => setPreviewSub(sub)}
                                style={{ padding: '4px 8px', fontSize: '0.75rem', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                              >
                                👁️ Xem
                              </button>
                              
                              <button
                                onClick={() => handleUpdateStatus(sub.id, 'VALID')}
                                disabled={updatingId === sub.id}
                                style={{ padding: '4px 8px', fontSize: '0.75rem', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                              >
                                ✓ Duyệt
                              </button>

                              <button
                                onClick={() => handleUpdateStatus(sub.id, 'INVALID')}
                                disabled={updatingId === sub.id}
                                style={{ padding: '4px 8px', fontSize: '0.75rem', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                              >
                                ✕ Loại
                              </button>

                              <button
                                onClick={() => handleReopen(sub.id)}
                                disabled={updatingId === sub.id}
                                style={{ padding: '4px 8px', fontSize: '0.75rem', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
               {/* TAB 2: REGISTERED EMPLOYEES */}
          {activeTab === 'employees' && (
            <div>
              <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '10px' }}>
                Danh sách nhân sự đã gửi đăng ký/xác thực email về Dashboard Quản trị PostgreSQL Backend.
              </p>
              
              <div style={{ overflowX: 'auto', border: '1px solid #eee', borderRadius: '6px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead style={{ background: '#f5f5f5' }}>
                    <tr>
                      <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>ID</th>
                      <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Mã NV</th>
                      <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Họ và Tên</th>
                      <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Email Công ty</th>
                      <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Đơn vị</th>
                      <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Trạng thái</th>
                      <th style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>Thao tác Admin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingEmployees ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Đang tải danh sách nhân sự...</td>
                      </tr>
                    ) : employees.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                          Chưa có nhân sự nào đăng ký trên hệ thống DB.
                        </td>
                      </tr>
                    ) : (
                      employees.map((emp) => {
                        const isAccepted = emp.approvalStatus === 'ACCEPTED' || emp.status === 'APPROVED' || emp.status === 'approved';
                        const isRejected = emp.approvalStatus === 'REJECTED' || emp.status === 'rejected';

                        return (
                          <tr key={emp.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px', fontWeight: 'bold' }}>{emp.id}</td>
                            <td style={{ padding: '10px' }}><code>{emp.employeeCode || emp.employee_id}</code></td>
                            <td style={{ padding: '10px', fontWeight: 600 }}>{emp.fullName || emp.full_name}</td>
                            <td style={{ padding: '10px' }}>{emp.email}</td>
                            <td style={{ padding: '10px' }}>{emp.unit ? (emp.unit.name || emp.unit.code) : (emp.unitName || emp.unitCode || emp.unit)}</td>
                            <td style={{ padding: '10px' }}>
                              <span style={{
                                padding: '2px 8px',
                                borderRadius: '12px',
                                background: isAccepted ? '#d4edda' : isRejected ? '#f8d7da' : '#fff3cd',
                                color: isAccepted ? '#155724' : isRejected ? '#721c24' : '#856404',
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                              }}>
                                {isAccepted ? '✓ Đã duyệt' : isRejected ? '✕ Từ chối' : '⏳ Chờ Admin duyệt'}
                              </span>
                            </td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>
                              {!isAccepted && (
                                <button
                                  onClick={async () => {
                                    if (!window.confirm(`Duyệt tài khoản cho ${emp.fullName || emp.email} và gửi mật khẩu qua email?`)) return;
                                    try {
                                      const res = await api.approveUser(emp.id);
                                      setMessage(`✓ ${res.message || 'Đã duyệt tài khoản và gửi email mật khẩu!'}`);
                                      loadEmployees();
                                    } catch (err) {
                                      setMessage(`⚠️ Lỗi khi duyệt: ${err.message}`);
                                    }
                                  }}
                                  style={{ padding: '4px 10px', fontSize: '0.78rem', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                  ✓ Duyệt &amp; Gửi Mail Pass
                                </button>
                              )}
                              {isAccepted && (
                                <span style={{ fontSize: '0.78rem', color: '#28a745' }}>✓ Đã gửi mail MK</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: RULE CONFIG */}
          {activeTab === 'rule' && (
            <div style={{ maxWidth: '600px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Cấu hình Quy tắc Xác định Người Tham Gia Hợp Lệ</h3>
              <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: '16px' }}>
                Ban Tổ chức có thể chọn số lượng Mission tối thiểu mà nhân sự cần hoàn thành để được tính vào Tỷ lệ Tham Gia Đơn Vị (mà không cần sửa code).
              </p>

              <form onSubmit={handleSaveRule} style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#fafafa', padding: '16px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>
                    Số Mission tối thiểu cần hoàn thành hợp lệ:
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="minRule"
                        value="1"
                        checked={minMissionsInput === '1'}
                        onChange={(e) => setMinMissionsInput(e.target.value)}
                      />
                      Hoàn thành ít nhất 1/4 Mission (1 Mission)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="minRule"
                        value="3"
                        checked={minMissionsInput === '3'}
                        onChange={(e) => setMinMissionsInput(e.target.value)}
                      />
                      Hoàn thành ít nhất 3/4 Mission (3 Mission)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="minRule"
                        value="4"
                        checked={minMissionsInput === '4'}
                        onChange={(e) => setMinMissionsInput(e.target.value)}
                      />
                      Hoàn thành đủ 4/4 Mission (Tất cả 4 Mission)
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button type="submit" className="btn btn--gold" disabled={ruleSaving}>
                    {ruleSaving ? 'Đang cập nhật quy tắc...' : 'Lưu quy tắc BTC mới →'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* DETAILED SUBMISSION PREVIEW MODAL */}
      {previewSub && (
        <div className="modal is-open" style={{ zIndex: 1100 }}>
          <div className="modal__backdrop" onClick={() => setPreviewSub(null)}></div>
          <div className="modal__panel" style={{ maxWidth: '650px', maxHeight: '85vh', overflowY: 'auto' }}>
            <button className="modal__close" onClick={() => setPreviewSub(null)}>&times;</button>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>
              📄 Chi tiết Bài Nộp #{previewSub.id} — {previewSub.missionCode || `Mission ${previewSub.missionId}`}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <div><strong>Tác giả:</strong> {previewSub.fullName} ({previewSub.employeeCode}) - {previewSub.email}</div>
              <div><strong>Đơn vị:</strong> {previewSub.unitName || previewSub.unitCode}</div>
              <div><strong>Trạng thái hiện tại:</strong> {getStatusBadge(previewSub.status)}</div>
              
              <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '8px 0' }} />

              <div>
                <strong>1. Câu trả lời tự luận dài:</strong>
                <p style={{ background: '#f8f9fa', padding: '10px', borderRadius: '6px', whiteSpace: 'pre-wrap', marginTop: '4px' }}>
                  {previewSub.longTextAnswer || '(Trống)'}
                </p>
              </div>

              <div>
                <strong>2. Các phương án lựa chọn:</strong>
                <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '6px', marginTop: '4px' }}>
                  {previewSub.selectedOptionsJson ? previewSub.selectedOptionsJson : '(Chưa chọn)'}
                </div>
              </div>

              <div>
                <strong>3. Dữ liệu ghép nối / sắp xếp:</strong>
                <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '6px', marginTop: '4px' }}>
                  {previewSub.orderedDataJson || '(Trống)'}
                </div>
              </div>

              <div>
                <strong>4. Nguồn chứng cứ / tư liệu:</strong>
                <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '6px', marginTop: '4px' }}>
                  {previewSub.evidenceSource || '(Trống)'}
                </div>
              </div>

              <div>
                <strong>5. Tên người xác nhận:</strong>
                <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '6px', marginTop: '4px' }}>
                  {previewSub.witnessName || '(Trống)'}
                </div>
              </div>

              <div>
                <strong>📎 Tệp đính kèm MinIO Storage:</strong>
                {previewSub.attachments && previewSub.attachments.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, marginTop: '4px' }}>
                    {previewSub.attachments.map(att => (
                      <li key={att.id} style={{ marginBottom: '4px' }}>
                        <a href={att.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0056b3', textDecoration: 'underline' }}>
                          📄 {att.originalFileName} ({(att.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB)
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: '#777', marginTop: '4px' }}>Không có tệp đính kèm.</p>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button className="btn" onClick={() => setPreviewSub(null)} style={{ background: '#eee' }}>Đóng</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
