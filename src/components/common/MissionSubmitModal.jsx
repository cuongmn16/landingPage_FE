import React, { useState, useEffect } from 'react';
import { submitMissionResponseApi, api, auth } from '../../services/api';
import { fmtDateTime, getSubmissionStatus } from '../../data/appData';

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

export default function MissionSubmitModal({ isOpen, onClose, onSuccess, onOpenLogin, initialMissionId = '1' }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [missionId, setMissionId] = useState(initialMissionId || '1');
  const [existingSub, setExistingSub] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [longTextAnswer, setLongTextAnswer] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [orderedData, setOrderedData] = useState('');
  const [evidenceSource, setEvidenceSource] = useState('');
  const [witnessName, setWitnessName] = useState('');

  const [files, setFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const loadSubmissionForMission = async (mId, u) => {
    if (!u) return;
    try {
      const subs = await api.getUserSubmissions();
      const match = subs.find(s => Number(s.mission_id) === Number(mId));
      setExistingSub(match || null);
      setIsEditing(false); // Reset edit mode when loading
      if (match) {
        setLongTextAnswer(match.note || '');
        if (match.evidenceSource) setEvidenceSource(match.evidenceSource);
        if (match.witnessName) setWitnessName(match.witnessName);
      } else {
        setLongTextAnswer('');
        setEvidenceSource('');
        setWitnessName('');
      }
    } catch (e) {
      console.warn('Failed to load user submission:', e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const activeMId = initialMissionId ? String(initialMissionId) : '1';
      setMissionId(activeMId);
      const u = auth.user || JSON.parse(localStorage.getItem('user') || 'null');
      setCurrentUser(u);
      loadSubmissionForMission(activeMId, u);
    }
  }, [isOpen, initialMissionId]);

  const handleMissionChange = (newMId) => {
    setMissionId(newMId);
    loadSubmissionForMission(newMId, currentUser);
  };

  if (!isOpen) return null;

  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.docx'];
  const maxSizeBytes = 50 * 1024 * 1024; // 50MB

  const handleFileChange = (e) => {
    setFileErrors('');
    const selectedFiles = Array.from(e.target.files);
    
    if (files.length + selectedFiles.length > 5) {
      setFileErrors('Tối đa 5 tệp/Mission.');
      return;
    }

    const validFiles = [];
    for (const f of selectedFiles) {
      const ext = '.' + f.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        setFileErrors(`Tệp "${f.name}" không hợp lệ. Chỉ chấp nhận JPG, PNG, PDF, DOCX.`);
        return;
      }
      if (f.size > maxSizeBytes) {
        setFileErrors(`Tệp "${f.name}" vượt quá dung lượng tối đa 50 MB.`);
        return;
      }
      validFiles.push(f);
    }

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleOptionToggle = (option) => {
    setSelectedOptions(prev => 
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setErrorMessage('Vui lòng đăng nhập trước khi nộp bài.');
      return;
    }

    setSubmitting(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const payload = {
        employeeId: currentUser.id || currentUser.employeeId || null,
        missionId: parseInt(missionId, 10),
        longTextAnswer,
        selectedOptionsJson: JSON.stringify(selectedOptions),
        orderedDataJson: orderedData,
        evidenceSource,
        witnessName
      };

      const result = await submitMissionResponseApi(payload, files);

      setStatusMessage(existingSub ? 'Đã cập nhật bài nộp thành công!' : 'Đã nộp bài Mission thành công!');
      if (onSuccess) onSuccess(result);

      // Reload submission status
      await loadSubmissionForMission(missionId, currentUser);

      setTimeout(() => {
        setIsEditing(false);
        setStatusMessage(null);
      }, 1200);

    } catch (err) {
      console.error('Submit error:', err);
      setErrorMessage(err.message || 'Có lỗi xảy ra khi nộp bài.');
    } finally {
      setSubmitting(false);
    }
  };

  const subStatus = existingSub ? getSubmissionStatus(existingSub) : null;
  const existingFiles = existingSub
    ? (existingSub.attachments && existingSub.attachments.length > 0)
      ? existingSub.attachments
      : (existingSub.file_url ? [{ id: 1, fileName: existingSub.file_url.split('/').pop() || 'Tệp_đính_kèm', fileUrl: existingSub.file_url }] : [])
    : [];

  return (
    <div className={`modal modal--submission ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen} role="dialog">
      <div className="modal__backdrop" onClick={onClose}></div>
      <div className="modal__panel modal__panel--large" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <button className="modal__close" onClick={onClose} aria-label="Đóng">&times;</button>

        <div className="submission-form-wrap" style={{ padding: '12px 4px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>
            Nộp bài Mission 0{missionId}
          </h2>

          {!currentUser && (
            <div style={{ padding: '10px 14px', background: '#fff3cd', color: '#856404', borderRadius: '6px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <span>⚠️ Vui lòng đăng nhập để nộp bài.</span>
              {onOpenLogin && (
                <button
                  type="button"
                  onClick={() => { onClose(); onOpenLogin(); }}
                  className="btn btn--gold"
                  style={{ fontSize: '0.8rem', padding: '4px 10px' }}
                >
                  Đăng nhập
                </button>
              )}
            </div>
          )}

          {/* MY SUBMISSION STATUS CARD */}
          {existingSub && (
            <div style={{ background: '#eef6ff', border: '1px solid #bce0fd', padding: '18px', borderRadius: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.2rem' }}>📌</span>
                  <strong style={{ color: '#0056b3', fontSize: '1.05rem' }}>Bài nộp hiện tại của bạn:</strong>
                  {subStatus && (
                    <span className={`status-badge ${subStatus.cls}`} style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>
                      {subStatus.label}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '0.85rem', color: '#666' }}>
                  Nộp lúc: {fmtDateTime(existingSub.submitted_at)}
                </span>
              </div>

              {existingSub.score != null && (
                <div style={{ color: '#28a745', fontWeight: 'bold', fontSize: '1.05rem', marginBottom: '10px' }}>
                  ⭐ Điểm số: {existingSub.score} / 100
                </div>
              )}

              {/* Attachments List */}
              {existingFiles.length > 0 && (
                <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: '600', color: '#333' }}>Tệp đã nộp ({existingFiles.length}):</span>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                    {existingFiles.map((att, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #d2e3fc', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem' }}>
                        <span>{getFileIcon(att.fileName, att.fileUrl)}</span>
                        <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>{att.fileName}</span>
                        <a
                          href={att.fileUrl ? (att.fileUrl.includes('?') ? `${att.fileUrl}&download=true` : `${att.fileUrl}?download=true`) : '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={att.fileName || true}
                          style={{ color: '#1a73e8', fontWeight: 'bold', marginLeft: '6px', textDecoration: 'none' }}
                          title="Tải tệp"
                        >
                          📥 Tải về
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {existingSub.note && (
                <div style={{ marginTop: '10px', background: '#fff', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
                  <strong style={{ fontSize: '0.88rem', color: '#555' }}>Ghi chú / Nội dung trình bày:</strong>
                  <p style={{ fontSize: '0.9rem', color: '#333', margin: '4px 0 0 0', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                    {existingSub.note}
                  </p>
                </div>
              )}

              {/* ACTION BUTTON TO TOGGLE EDIT FORM */}
              {!isEditing && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px', borderTop: '1px dashed #cce3f7', paddingTop: '12px' }}>
                  <button type="button" className="btn btn--outline" onClick={onClose}>
                    Đóng
                  </button>
                  <button
                    type="button"
                    className="btn btn--gold"
                    onClick={() => setIsEditing(true)}
                    style={{ fontWeight: 'bold' }}
                  >
                    ✏️ Cập nhật bài nộp →
                  </button>
                </div>
              )}
            </div>
          )}

          {statusMessage && (
            <div style={{ padding: '10px 14px', background: '#d4edda', color: '#155724', borderRadius: '6px', marginBottom: '16px', fontSize: '0.9rem' }}>
              ✓ {statusMessage}
            </div>
          )}

          {errorMessage && (
            <div style={{ padding: '10px 14px', background: '#f8d7da', color: '#721c24', borderRadius: '6px', marginBottom: '16px', fontSize: '0.9rem' }}>
              ⚠️ {errorMessage}
            </div>
          )}

          {/* EDIT FORM: ONLY SHOWN IF NEW SUBMISSION OR IS EDITING */}
          {(!existingSub || isEditing) && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: isEditing ? '#fff' : 'transparent', padding: isEditing ? '16px' : 0, borderRadius: '8px', border: isEditing ? '1px solid #e0e0e0' : 'none' }}>
              
              {isEditing && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', pb: '8px', mb: '4px' }}>
                  <strong style={{ fontSize: '1rem', color: '#0056b3' }}>📝 Cập nhật thông tin bài nộp:</strong>
                  <button
                    type="button"
                    className="btn-sm btn-reject"
                    onClick={() => setIsEditing(false)}
                    style={{ padding: '2px 8px', fontSize: '0.8rem' }}
                  >
                    ✕ Hủy cập nhật
                  </button>
                </div>
              )}

              {/* Mission Selector */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem' }}>
                  Chọn Mission:
                </label>
                <select
                  value={missionId}
                  onChange={(e) => handleMissionChange(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.95rem' }}
                >
                  <option value="1">Mission 01 — JOURNEY MAP</option>
                  <option value="2">Mission 02 — LEGACY STORIES</option>
                  <option value="3">Mission 03 — LEADERSHIP LEGACIES</option>
                  <option value="4">Mission 04 — CTIN DNA MAP</option>
                  <option value="5">Mission 05 — LEGACY COLLECTION</option>
                </select>
              </div>

              {/* 1. Long Text Answer */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
                  1. Nội dung câu trả lời / Bài trình bày:
                </label>
                <textarea
                  rows={4}
                  value={longTextAnswer}
                  onChange={(e) => setLongTextAnswer(e.target.value)}
                  placeholder="Nhập nội dung trình bày chi tiết..."
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', resize: 'vertical' }}
                />
              </div>

              {/* 2. Multiple Choice Options */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
                  2. Lựa chọn phương án:
                </label>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  {['Phương án A (Lịch sử)', 'Phương án B (Di sản)', 'Phương án C (Văn hóa)', 'Phương án D (Tương lai)'].map(opt => (
                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={selectedOptions.includes(opt)}
                        onChange={() => handleOptionToggle(opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              {/* 3. Ordering / Matching */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
                  3. Sắp xếp hoặc ghép nối dữ liệu:
                </label>
                <input
                  type="text"
                  value={orderedData}
                  onChange={(e) => setOrderedData(e.target.value)}
                  placeholder="Ví dụ: 2001-Thành lập -> 2010-Cổ phần hóa -> 2026-Kỷ niệm 25 năm"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>

              {/* 4. Evidence Source */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
                  4. Ghi nguồn chứng cứ / Tư liệu tham khảo:
                </label>
                <input
                  type="text"
                  value={evidenceSource}
                  onChange={(e) => setEvidenceSource(e.target.value)}
                  placeholder="Nguồn tài liệu, biên bản..."
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>

              {/* 5. Witness Name */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
                  5. Ghi tên người có thể xác nhận:
                </label>
                <input
                  type="text"
                  value={witnessName}
                  onChange={(e) => setWitnessName(e.target.value)}
                  placeholder="Họ tên người phỏng vấn / CBNV xác thực..."
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>

              {/* 6. File Attachments */}
              <div style={{ border: '1px dashed #bbb', padding: '14px', borderRadius: '8px', background: '#fafafa' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '4px' }}>
                  📎 Tải ảnh hoặc tài liệu đính kèm mới:
                </label>
                <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px' }}>
                  Tối đa 5 tệp (JPG, PNG, PDF, DOCX &le; 50MB/tệp).
                </p>

                <input
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf,.docx"
                  onChange={handleFileChange}
                  style={{ marginBottom: '8px' }}
                />

                {fileErrors && (
                  <p style={{ color: '#d9534f', fontSize: '0.85rem', marginTop: '4px' }}>{fileErrors}</p>
                )}

                {files.length > 0 && (
                  <ul style={{ listStyle: 'none', padding: 0, margin: '6px 0 0 0' }}>
                    {files.map((file, idx) => (
                      <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px', background: '#fff', borderRadius: '4px', marginBottom: '4px', border: '1px solid #eee' }}>
                        <span style={{ fontSize: '0.85rem' }}>📄 {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                        <button type="button" onClick={() => removeFile(idx)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>✕</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  className="btn"
                  onClick={isEditing ? () => setIsEditing(false) : onClose}
                  style={{ background: '#eee', color: '#333' }}
                >
                  {isEditing ? 'Hủy' : 'Đóng'}
                </button>
                <button type="submit" className="btn btn--gold" disabled={submitting || !currentUser}>
                  {submitting ? 'Đang gửi...' : existingSub ? 'Lưu cập nhật bài nộp →' : 'Nộp bài ngay →'}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}
