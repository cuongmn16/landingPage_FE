import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api, auth, getAdminUnitsApi, createUnitApi, updateUnitApi, deleteUnitApi, gratitudeLetterApi } from '../services/api';
import GratitudeLetterModal from '../components/common/GratitudeLetterModal';
import { getSubmissionStatus, fmtDate, fmtDateTime } from '../data/appData';
import { M1_CONFIG } from '../data/mission1Data';
import { M2_CONFIG } from '../data/mission2Data';
import { M3_CONFIG } from '../data/mission3Data';
import { M4_CONFIG } from '../data/mission4Data';
import '../styles/wishes.css';

// Điểm khi hoàn thành hợp lệ, tự điền khi admin chọn "Hợp lệ"
const MISSION_POINTS = {
  [M1_CONFIG.id]: M1_CONFIG.points,
  [M2_CONFIG.missionId]: M2_CONFIG.points,
  [M3_CONFIG.missionId]: M3_CONFIG.points,
  [M4_CONFIG.missionId]: M4_CONFIG.points
};

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
  const initialView = ['submissions', 'units', 'wishes', 'letters'].includes(tabParam) ? tabParam : 'pending';

  const [activeView, setActiveView] = useState(initialView);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('2');
  const [loadingPending, setLoadingPending] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  const [toastMsg, setToastMsg] = useState({ text: '', type: '' });

  // Tìm kiếm & lọc danh sách nhân sự
  const [userSearch, setUserSearch] = useState('');
  const [userUnitFilter, setUserUnitFilter] = useState('all');

  // Chỉnh sửa thông tin nhân sự (Tên & Đơn vị)
  const [editingUser, setEditingUser] = useState(null);
  const [editUserForm, setEditUserForm] = useState({
    fullName: '',
    unitCode: ''
  });
  const [savingUser, setSavingUser] = useState(false);

  // Quản lý Bức tường Lời chúc sự kiện
  const [wishes, setWishes] = useState([]);
  const [loadingWishes, setLoadingWishes] = useState(false);
  const [wishSearch, setWishSearch] = useState('');
  const [wishUnitFilter, setWishUnitFilter] = useState('all');
  const [wishStatusFilter, setWishStatusFilter] = useState('all');

  // Quản lý & Phát hành Thư Tri Ân CTIN 25 Năm
  const [lettersData, setLettersData] = useState({ isPublished: false, total: 298, openedCount: 0, letters: [] });
  const [loadingLetters, setLoadingLetters] = useState(false);
  const [letterSearch, setLetterSearch] = useState('');
  const [letterUnitFilter, setLetterUnitFilter] = useState('all');
  const [previewingLetter, setPreviewingLetter] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

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

  const loadWishes = async () => {
    setLoadingWishes(true);
    try {
      const data = await api.getAllWishesAdmin();
      setWishes(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast(err.message || 'Không thể tải danh sách lời chúc', 'error');
    } finally {
      setLoadingWishes(false);
    }
  };

  const handleToggleHideWish = async (id, currentHidden) => {
    try {
      await api.toggleHideWish(id, !currentHidden);
      showToast(!currentHidden ? 'Đã ẩn lời chúc khỏi màn hình sự kiện' : 'Đã hiển thị lại lời chúc lên màn hình');
      setWishes(prev => prev.map(w => w.id === id ? { ...w, isHidden: !currentHidden } : w));
    } catch (err) {
      showToast(err.message || 'Không thể cập nhật trạng thái', 'error');
    }
  };

  const handleDeleteWish = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn XÓA VĨNH VIỄN lời chúc này?')) return;
    try {
      await api.deleteWish(id);
      showToast('Đã xóa lời chúc thành công');
      setWishes(prev => prev.filter(w => w.id !== id));
    } catch (err) {
      showToast(err.message || 'Không thể xóa lời chúc', 'error');
    }
  };

  const handleResetWishes = async () => {
    const confirmText = window.prompt(
      '⚠️ CẢNH BÁO QUAN TRỌNG TỪ BAN TỔ CHỨC:\n\n' +
      'Bạn đang chuẩn bị XÓA SẠCH TOÀN BỘ lời chúc trên bức tường sự kiện.\n' +
      'Hành động này thường dùng để dọn sạch dữ liệu test trước giờ G sự kiện.\n\n' +
      'Nhập chữ "RESET" (viết hoa) để xác nhận xóa toàn bộ:'
    );
    if (confirmText !== 'RESET') {
      if (confirmText !== null) {
        alert('Mã xác nhận không đúng. Đã hủy thao tác reset.');
      }
      return;
    }
    try {
      await api.resetAllWishes();
      showToast('Đã reset toàn bộ bức tường lời chúc thành công');
      setWishes([]);
    } catch (err) {
      showToast(err.message || 'Không thể reset lời chúc', 'error');
    }
  };

  const wishUnitsList = useMemo(() => {
    const set = new Set();
    wishes.forEach(w => {
      if (w.unitName && w.unitName.trim()) set.add(w.unitName.trim());
    });
    return Array.from(set).sort();
  }, [wishes]);

  const filteredWishes = useMemo(() => {
    return wishes.filter(w => {
      if (wishStatusFilter === 'visible' && w.isHidden) return false;
      if (wishStatusFilter === 'hidden' && !w.isHidden) return false;
      if (wishUnitFilter !== 'all' && (w.unitName || '').trim() !== wishUnitFilter) return false;
      if (wishSearch.trim()) {
        const q = wishSearch.toLowerCase();
        const matchName = (w.senderName || '').toLowerCase().includes(q);
        const matchContent = (w.content || '').toLowerCase().includes(q);
        const matchUnit = (w.unitName || '').toLowerCase().includes(q);
        if (!matchName && !matchContent && !matchUnit) return false;
      }
      return true;
    });
  }, [wishes, wishStatusFilter, wishUnitFilter, wishSearch]);

  const loadLetters = async () => {
    setLoadingLetters(true);
    try {
      const data = await gratitudeLetterApi.getAdminList();
      if (data) {
        setLettersData(data);
      }
    } catch (err) {
      console.error('Lỗi tải danh sách thư tri ân:', err);
      showToast('Không thể tải danh sách thư tri ân', 'error');
    } finally {
      setLoadingLetters(false);
    }
  };

  const handleTogglePublish = async () => {
    const nextState = !lettersData.isPublished;
    const confirmMsg = nextState
      ? 'Bạn có chắc chắn muốn PHÁT HÀNH Thư Tri Ân tới toàn bộ 298 nhân sự? Tất cả cán bộ nhân viên sẽ xem được thư khi đăng nhập.'
      : 'Bạn có chắc chắn muốn TẠM KHÓA phát hành Thư Tri Ân?';
    if (!window.confirm(confirmMsg)) return;

    setIsPublishing(true);
    try {
      await gratitudeLetterApi.setPublished(nextState);
      showToast(nextState ? 'Đã phát hành Thư Tri Ân thành công!' : 'Đã tạm khóa phát hành Thư Tri Ân.', 'success');
      loadLetters();
    } catch (err) {
      showToast(err.message || 'Cập nhật trạng thái phát hành thất bại', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleChangePublishMode = async (mode) => {
    let confirmMsg = '';
    if (mode === 'MANUAL_PUBLISHED') {
      confirmMsg = 'Bạn có chắc chắn muốn PHÁT HÀNH CHỦ ĐỘNG ngay lập tức cho toàn bộ 298 nhân sự?';
    } else if (mode === 'AUTO_20H') {
      confirmMsg = 'Bạn có muốn chuyển sang chế độ TỰ ĐỘNG PHÁT HÀNH LÚC 20:00 NGÀY 20/11/2026? Hiện tại thư sẽ ẩn với CBNV cho đến đúng 20h ngày 20/11.';
    } else {
      confirmMsg = 'Bạn có chắc chắn muốn TẠM KHÓA NIÊM PHONG Thư Tri Ân?';
    }
    if (!window.confirm(confirmMsg)) return;

    setIsPublishing(true);
    try {
      await gratitudeLetterApi.setPublishMode(mode);
      showToast('Đã cập nhật chế độ phát hành thành công!', 'success');
      loadLetters();
    } catch (err) {
      showToast(err.message || 'Cập nhật chế độ phát hành thất bại', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleToggleIndividualPublish = async (letter, e) => {
    if (e) e.stopPropagation();
    const nextState = !letter.isPublished;
    const confirmMsg = nextState
      ? `Bạn có chắc chắn muốn PHÁT HÀNH RIÊNG Thư Tri Ân cho nhân sự "${letter.fullName}" (${letter.employeeCode})? Người này sẽ mở được thư ngay lập tức.`
      : `Bạn có chắc chắn muốn TẠM KHÓA RIÊNG Thư Tri Ân của "${letter.fullName}"?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      await gratitudeLetterApi.setIndividualPublished(letter.id, nextState);
      showToast(nextState ? `Đã phát hành riêng cho ${letter.fullName}!` : `Đã tạm khóa thư của ${letter.fullName}.`, 'success');
      loadLetters();
    } catch (err) {
      showToast(err.message || 'Cập nhật trạng thái thất bại', 'error');
    }
  };

  const filteredLetters = useMemo(() => {
    const list = lettersData.letters || [];
    return list.filter(l => {
      if (letterUnitFilter !== 'all' && (l.unitName || '').trim() !== letterUnitFilter) return false;
      if (letterSearch.trim()) {
        const q = letterSearch.toLowerCase();
        const matchName = (l.fullName || '').toLowerCase().includes(q);
        const matchCode = (l.employeeCode || '').toLowerCase().includes(q);
        const matchEmail = (l.email || '').toLowerCase().includes(q);
        const matchUnit = (l.unitName || '').toLowerCase().includes(q);
        return matchName || matchCode || matchEmail || matchUnit;
      }
      return true;
    });
  }, [lettersData.letters, letterSearch, letterUnitFilter]);

  const handleOpenEditUser = (u) => {
    const matchedUnit = units.find(
      unit => unit.code === u.unitCode || unit.name === u.unit || unit.id === u.unitId
    );
    setEditingUser(u);
    setEditUserForm({
      fullName: u.full_name || '',
      unitCode: u.unitCode || matchedUnit?.code || ''
    });
  };

  const handleSaveEditUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    if (!editUserForm.fullName.trim()) {
      showToast('Vui lòng nhập họ và tên người tham gia.', 'error');
      return;
    }
    if (!editUserForm.unitCode.trim()) {
      showToast('Vui lòng chọn đơn vị / phòng ban.', 'error');
      return;
    }
    setSavingUser(true);
    try {
      await api.updateEmployee(editingUser.id, {
        fullName: editUserForm.fullName.trim(),
        unitCode: editUserForm.unitCode.trim()
      });
      showToast('Đã cập nhật tên và đơn vị của nhân sự thành công!', 'success');
      setEditingUser(null);
      loadPending();
      loadSubmissions();
      loadUnits();
    } catch (err) {
      showToast(err.message || 'Không thể cập nhật thông tin nhân sự.', 'error');
    } finally {
      setSavingUser(false);
    }
  };

  const filteredPendingUsers = useMemo(() => {
    return pendingUsers.filter(u => {
      if (userUnitFilter !== 'all' && u.unit !== userUnitFilter && u.unitCode !== userUnitFilter) {
        return false;
      }
      if (userSearch.trim()) {
        const q = userSearch.toLowerCase();
        const matchName = (u.full_name || '').toLowerCase().includes(q);
        const matchEmail = (u.email || '').toLowerCase().includes(q);
        const matchCode = (u.employee_id || '').toLowerCase().includes(q);
        const matchUnit = (u.unit || '').toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchCode && !matchUnit) return false;
      }
      return true;
    });
  }, [pendingUsers, userUnitFilter, userSearch]);

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
      loadWishes();
      loadLetters();
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

  const m2PendingCount = submissions.filter(s => Number(s.mission_id) === 2 && (
    s.status === 'pending' || s.status === 'submitted' || s.status === 'SUBMITTED' || s.score == null
  )).length;

  const statusOptions = [
    { v: 'pending',          l: 'Chờ chấm' },
    { v: 'valid',            l: 'Hợp lệ' },
    { v: 'needs_supplement', l: 'Cần bổ sung' },
    { v: 'invalid',          l: 'Không hợp lệ' }
  ];

  const subPoints = selectedSub ? MISSION_POINTS[Number(selectedSub.mission_id)] : undefined;

  const modalFiles = selectedSub
    ? (selectedSub.attachments && selectedSub.attachments.length > 0)
      ? selectedSub.attachments
      : (selectedSub.file_url ? [{ id: 1, fileName: selectedSub.file_url.split('/').pop() || 'Tệp_đính_kèm', fileUrl: selectedSub.file_url }] : [])
    : [];

  return (
    <main className="admin-page">
      <div className="container">
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
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
          <button
            className={`btn ${activeView === 'wishes' ? 'btn--gold' : 'btn--outline'}`}
            onClick={() => {
              setActiveView('wishes');
              loadWishes();
            }}
          >
            Bức tường Lời chúc ({wishes.length})
          </button>
          <button
            className={`btn ${activeView === 'letters' ? 'btn--gold' : 'btn--outline'}`}
            onClick={() => {
              setActiveView('letters');
              loadLetters();
            }}
          >
            ✉️ Thư Tri Ân ({lettersData.total || 298})
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
              Quản lý Nhân sự Đăng ký <span className="badge" id="pendingCount">{filteredPendingUsers.length}</span>
            </h1>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px', alignItems: 'center' }}>
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Tìm theo họ tên, email, mã nhân viên..."
                style={{
                  flex: '1 1 260px',
                  padding: '9px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--clr-line)'
                }}
              />
              <select
                value={userUnitFilter}
                onChange={(e) => setUserUnitFilter(e.target.value)}
                style={{
                  padding: '9px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--clr-line)',
                  minWidth: '220px'
                }}
              >
                <option value="all">Tất cả đơn vị ({pendingUsers.length})</option>
                {units.map(unit => (
                  <option key={unit.id || unit.code} value={unit.name}>
                    {unit.name} ({unit.code})
                  </option>
                ))}
              </select>
            </div>

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
                  ) : filteredPendingUsers.length === 0 ? (
                    <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--clr-ink-3)' }}>Không có nhân sự nào phù hợp.</td></tr>
                  ) : (
                    filteredPendingUsers.map(u => {
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
                              {isAccepted ? 'Đã duyệt' : isRejected ? 'Từ chối' : 'Chờ duyệt'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                              {!isAccepted && (
                                <>
                                  <button className="btn-sm btn-approve" onClick={() => handleApprove(u.id)}>
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
                              <button
                                type="button"
                                className="btn-sm btn-score"
                                onClick={() => handleOpenEditUser(u)}
                                title="Chỉnh sửa họ tên và đơn vị"
                              >
                                Sửa
                              </button>
                            </div>
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
                className={`admin-tab ${currentFilter === '2' ? 'is-active' : ''}`}
                onClick={() => setCurrentFilter('2')}
              >
                Mission 2 (Chấm thủ công)
                {m2PendingCount > 0 && (
                  <span style={{
                    marginLeft: '8px',
                    background: '#d93025',
                    color: '#fff',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.78rem',
                    fontWeight: 'bold'
                  }}>
                    {m2PendingCount} chờ chấm
                  </span>
                )}
              </button>
              <button
                className={`admin-tab ${currentFilter === '1' ? 'is-active' : ''}`}
                onClick={() => setCurrentFilter('1')}
              >
                Mission 1 (Tự động)
              </button>
              <button
                className={`admin-tab ${currentFilter === '3' ? 'is-active' : ''}`}
                onClick={() => setCurrentFilter('3')}
              >
                Mission 3 (Tự động)
              </button>
              <button
                className={`admin-tab ${currentFilter === '4' ? 'is-active' : ''}`}
                onClick={() => setCurrentFilter('4')}
              >
                Mission 4 (Tự động)
              </button>
              <button
                className={`admin-tab ${currentFilter === 'all' ? 'is-active' : ''}`}
                onClick={() => setCurrentFilter('all')}
              >
                Tất cả bài nộp
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

        {/* VIEW 4: QUẢN LÝ BỨC TƯỜNG LỜI CHÚC SỰ KIỆN */}
        {activeView === 'wishes' && (
          <section id="view-wishes" className="admin-view">
            <div className="aw-container">
              {/* HEADER TOOLBAR SANG TRỌNG */}
              <div className="aw-header">
                <div className="aw-header__info">
                  <span className="aw-header__badge">
                    SỰ KIỆN KỶ NIỆM 25 NĂM CTIN (2001 – 2026)
                  </span>
                  <h1 className="aw-header__title">
                    Bức Tường Lời Chúc Sự Kiện
                    <span className="aw-header__count-badge">{wishes.length}</span>
                  </h1>
                  <p className="aw-header__subtitle">
                    Kiểm duyệt trực tiếp, ẩn/hiện, xóa và điều phối luồng lời chúc trên màn hình sân khấu lớn
                  </p>
                </div>

                <div className="aw-header__actions">
                  <Link
                    to="/wishes"
                    target="_blank"
                    className="aw-btn-stage"
                    title="Mở tab mới xem màn hình sân khấu trực tiếp"
                  >
                    <span className="live-dot" />
                    <span>Mở Màn hình Sân khấu ↗</span>
                  </Link>
                  <button
                    type="button"
                    className="aw-btn-refresh"
                    onClick={loadWishes}
                    disabled={loadingWishes}
                  >
                    {loadingWishes ? 'Đang tải...' : 'Tải lại danh sách'}
                  </button>
                  <button
                    type="button"
                    className="aw-btn-reset"
                    onClick={handleResetWishes}
                    title="Xóa toàn bộ lời chúc để bắt đầu sự kiện"
                  >
                    Xóa tất cả (Reset)
                  </button>
                </div>
              </div>

              {/* BỘ 3 THẺ THỐNG KÊ (EXECUTIVE STAT CARDS) */}
              <div className="aw-stats-grid">
                <div className="aw-stat-card aw-stat-card--total">
                  <div className="aw-stat-card__body">
                    <span className="aw-stat-card__label">Tổng số lời chúc</span>
                    <div className="aw-stat-card__number">{wishes.length}</div>
                    <span className="aw-stat-card__sub">Gửi từ điện thoại khán phòng</span>
                  </div>
                </div>

                <div className="aw-stat-card aw-stat-card--visible">
                  <div className="aw-stat-card__body">
                    <span className="aw-stat-card__label">Đang chiếu trên LED</span>
                    <div className="aw-stat-card__number">{wishes.filter(w => !w.isHidden).length}</div>
                    <span className="aw-stat-card__sub">
                      Chiếm {wishes.length > 0 ? Math.round((wishes.filter(w => !w.isHidden).length / wishes.length) * 100) : 100}% tổng số lời chúc
                    </span>
                  </div>
                </div>

                <div className="aw-stat-card aw-stat-card--hidden">
                  <div className="aw-stat-card__body">
                    <span className="aw-stat-card__label">Tạm ẩn kiểm duyệt</span>
                    <div className="aw-stat-card__number">{wishes.filter(w => w.isHidden).length}</div>
                    <span className="aw-stat-card__sub">Không xuất hiện trên sân khấu</span>
                  </div>
                </div>
              </div>

              {/* BỘ LỌC TÌM KIẾM LIỀN MẠCH (UNIFIED FILTER BAR) */}
              <div className="aw-filter-bar">
                <div className="aw-search-box">
                  <input
                    type="text"
                    className="aw-search-input"
                    placeholder="Tìm theo họ tên người gửi hoặc từ khóa lời chúc..."
                    value={wishSearch}
                    onChange={(e) => setWishSearch(e.target.value)}
                  />
                </div>

                <div className="aw-select-box">
                  <select
                    className="aw-select"
                    value={wishUnitFilter}
                    onChange={(e) => setWishUnitFilter(e.target.value)}
                  >
                    <option value="all">Tất cả phòng ban ({wishUnitsList.length})</option>
                    {wishUnitsList.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                <div className="aw-select-box">
                  <select
                    className="aw-select"
                    value={wishStatusFilter}
                    onChange={(e) => setWishStatusFilter(e.target.value)}
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="visible">Đang hiển thị ({wishes.filter(w => !w.isHidden).length})</option>
                    <option value="hidden">Tạm ẩn ({wishes.filter(w => w.isHidden).length})</option>
                  </select>
                </div>

                {(wishSearch || wishUnitFilter !== 'all' || wishStatusFilter !== 'all') && (
                  <button
                    type="button"
                    className="aw-clear-filters-btn"
                    onClick={() => {
                      setWishSearch('');
                      setWishUnitFilter('all');
                      setWishStatusFilter('all');
                    }}
                  >
                    Xóa bộ lọc
                  </button>
                )}
              </div>

              {/* BẢNG DỮ LIỆU LỜI CHÚC CAO CẤP */}
              <div className="aw-table-container">
                <table className="aw-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px', textAlign: 'center' }}>#</th>
                      <th style={{ width: '220px' }}>Người gửi</th>
                      <th style={{ width: '180px' }}>Đơn vị / Phòng ban</th>
                      <th>Nội dung lời chúc</th>
                      <th style={{ width: '150px' }}>Thời gian</th>
                      <th style={{ width: '140px', textAlign: 'center' }}>Trạng thái</th>
                      <th style={{ width: '160px', textAlign: 'center' }}>Thao tác Admin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingWishes ? (
                      <tr>
                        <td colSpan="7">
                          <div className="aw-empty-state">
                            <h3 className="aw-empty-title">Đang tải danh sách lời chúc...</h3>
                            <p className="aw-empty-desc">Hệ thống đang đồng bộ với cơ sở dữ liệu thời gian thực.</p>
                          </div>
                        </td>
                      </tr>
                    ) : filteredWishes.length === 0 ? (
                      <tr>
                        <td colSpan="7">
                          <div className="aw-empty-state">
                            {wishes.length === 0 ? (
                              <>
                                <h3 className="aw-empty-title">Bức tường đang sẵn sàng đón nhận lời chúc!</h3>
                                <p className="aw-empty-desc">
                                  Khi nhân viên hoặc khách mời quét mã QR trên điện thoại gửi lời chúc, toàn bộ dữ liệu sẽ tự động xuất hiện tại đây theo thời gian thực.
                                </p>
                              </>
                            ) : (
                              <>
                                <h3 className="aw-empty-title">Không tìm thấy lời chúc phù hợp</h3>
                                <p className="aw-empty-desc">
                                  Không có lời chúc nào khớp với từ khóa tìm kiếm hoặc bộ lọc hiện tại. Thử xóa bộ lọc để xem toàn bộ danh sách.
                                </p>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredWishes.map((w, idx) => {
                        const initial = (w.senderName || 'C').trim().charAt(0).toUpperCase();
                        return (
                          <tr key={w.id || idx} className={w.isHidden ? 'is-hidden' : ''}>
                            <td style={{ textAlign: 'center', color: '#64748b', fontWeight: 700 }}>
                              {idx + 1}
                            </td>
                            <td>
                              <div className="aw-sender-cell">
                                <div className="aw-sender-avatar">{initial}</div>
                                <span className="aw-sender-name">{w.senderName}</span>
                              </div>
                            </td>
                            <td>
                              <span className="aw-unit-pill">{w.unitName}</span>
                            </td>
                            <td>
                              <div className="aw-wish-content">
                                “{w.content}”
                              </div>
                            </td>
                            <td>
                              <span className="aw-time-cell">
                                {fmtDateTime(w.createdAt)}
                              </span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <span className={`aw-status-pill ${w.isHidden ? 'hidden' : 'visible'}`}>
                                {w.isHidden ? 'Đã ẩn' : 'Đang chiếu'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <div className="aw-actions-cell">
                                <button
                                  type="button"
                                  className={`aw-action-toggle ${w.isHidden ? 'show' : 'hide'}`}
                                  onClick={() => handleToggleHideWish(w.id, w.isHidden)}
                                  title={w.isHidden ? 'Cho phép hiển thị lại lời chúc lên sân khấu' : 'Ẩn lời chúc này khỏi màn hình lớn'}
                                >
                                  {w.isHidden ? 'Cho hiện' : 'Ẩn đi'}
                                </button>
                                <button
                                  type="button"
                                  className="aw-action-delete"
                                  onClick={() => handleDeleteWish(w.id)}
                                  title="Xóa vĩnh viễn lời chúc này khỏi hệ thống"
                                >
                                  Xóa
                                </button>
                              </div>
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
        )}

        {/* VIEW 5: QUẢN LÝ & PHÁT HÀNH THƯ TRI ÂN CTIN 25 NĂM */}
        {activeView === 'letters' && (
          <section id="view-letters" className="admin-view">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <h1 className="admin-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>✉️ Quản lý &amp; Phát hành Thư Tri Ân</span>
                  <span style={{ fontSize: '13px', padding: '3px 10px', borderRadius: '12px', background: '#e0f2fe', color: '#0369a1', fontWeight: 600 }}>
                    CTIN 25 Năm
                  </span>
                </h1>
                <p style={{ margin: '6px 0 0', color: 'var(--clr-ink-3)', fontSize: '13.5px' }}>
                  Hệ thống 298 bức thư phong bì hoàng gia được gửi riêng tới từng cán bộ nhân viên theo ngày cống hiến.
                </p>
              </div>

              {/* KHU VỰC ĐIỀU KHIỂN PHÁT HÀNH TOÀN CÔNG TY (CHỦ ĐỘNG & TỰ ĐỘNG LÚC 20:00) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#fff', padding: '12px 18px', borderRadius: '12px', border: '1.5px solid var(--clr-line)', boxShadow: 'var(--shadow-sm)', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '11.5px', color: 'var(--clr-ink-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Chế độ phát hành
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                    <span style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: lettersData.isPublished ? '#16a34a' : '#d97706',
                      display: 'inline-block'
                    }}></span>
                    <strong style={{ fontSize: '13.5px', color: lettersData.isPublished ? '#16a34a' : '#d97706' }}>
                      {lettersData.publishMode === 'MANUAL_PUBLISHED'
                        ? 'ĐÃ PHÁT HÀNH CHỦ ĐỘNG (ĐANG MỞ TOÀN BỘ)'
                        : lettersData.publishMode === 'MANUAL_LOCKED'
                          ? 'ĐANG TẠM KHÓA NIÊM PHONG (ẨN VỚI USER)'
                          : `TỰ ĐỘNG 20H NGÀY 20/11 (${lettersData.isPublished ? 'ĐÃ ĐẾN GIỜ MỞ' : 'HIỆN ĐANG ẨN VỚI USER'})`}
                    </strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {/* Nút 1: Phát hành ngay */}
                  <button
                    type="button"
                    onClick={() => handleChangePublishMode('MANUAL_PUBLISHED')}
                    disabled={isPublishing || (lettersData.publishMode === 'MANUAL_PUBLISHED')}
                    title="Chủ động mở thư ngay lập tức cho toàn bộ 298 nhân sự"
                    style={{
                      padding: '7px 14px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '12.5px',
                      border: 'none',
                      cursor: isPublishing ? 'not-allowed' : 'pointer',
                      background: lettersData.publishMode === 'MANUAL_PUBLISHED' ? '#dcfce7' : '#16a34a',
                      color: lettersData.publishMode === 'MANUAL_PUBLISHED' ? '#15803d' : '#ffffff',
                      boxShadow: lettersData.publishMode === 'MANUAL_PUBLISHED' ? 'none' : '0 2px 6px rgba(22,163,74,0.3)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    🚀 Phát hành ngay
                  </button>

                  {/* Nút 2: Tự động lúc 20:00 ngày 20/11 */}
                  <button
                    type="button"
                    onClick={() => handleChangePublishMode('AUTO_20H')}
                    disabled={isPublishing || (lettersData.publishMode === 'AUTO_20H' || !lettersData.publishMode)}
                    title="Hệ thống tự động phát hành đúng 20:00 ngày 20/11/2026"
                    style={{
                      padding: '7px 14px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '12.5px',
                      border: '1px solid #d97706',
                      cursor: isPublishing ? 'not-allowed' : 'pointer',
                      background: (lettersData.publishMode === 'AUTO_20H' || !lettersData.publishMode) ? '#fef3c7' : '#ffffff',
                      color: '#b45309',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    ⏰ Tự động 20h ngày 20/11
                  </button>

                  {/* Nút 3: Tạm khóa niêm phong */}
                  <button
                    type="button"
                    onClick={() => handleChangePublishMode('MANUAL_LOCKED')}
                    disabled={isPublishing || (lettersData.publishMode === 'MANUAL_LOCKED')}
                    title="Tạm khóa niêm phong không cho nhân sự mở thư"
                    style={{
                      padding: '7px 14px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '12.5px',
                      border: '1px solid #dc2626',
                      cursor: isPublishing ? 'not-allowed' : 'pointer',
                      background: lettersData.publishMode === 'MANUAL_LOCKED' ? '#fee2e2' : '#ffffff',
                      color: '#dc2626',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    🔒 Tạm khóa
                  </button>
                </div>
              </div>
            </div>

            {/* THỐNG KÊ LETTER STAT CARDS */}
            <div className="aw-stats-grid" style={{ marginBottom: '20px' }}>
              <div className="aw-stat-card aw-stat-card--total">
                <div className="aw-stat-card__body">
                  <span className="aw-stat-card__label">Tổng số nhân sự</span>
                  <div className="aw-stat-card__number">{lettersData.total || 298}</div>
                  <span className="aw-stat-card__sub">CBNV nhận thư tri ân cá nhân hóa</span>
                </div>
              </div>

              <div className="aw-stat-card aw-stat-card--visible">
                <div className="aw-stat-card__body">
                  <span className="aw-stat-card__label">Đã mở xem thư</span>
                  <div className="aw-stat-card__number">{lettersData.openedCount || 0}</div>
                  <span className="aw-stat-card__sub">
                    Chiếm {lettersData.total > 0 ? Math.round(((lettersData.openedCount || 0) / lettersData.total) * 100) : 0}% tổng nhân sự
                  </span>
                </div>
              </div>

              <div className="aw-stat-card aw-stat-card--hidden">
                <div className="aw-stat-card__body">
                  <span className="aw-stat-card__label">Chưa mở thư</span>
                  <div className="aw-stat-card__number">{Math.max(0, (lettersData.total || 298) - (lettersData.openedCount || 0))}</div>
                  <span className="aw-stat-card__sub">Nhân sự chưa đăng nhập bấm mở sáp</span>
                </div>
              </div>
            </div>

            {/* BỘ LỌC TÌM KIẾM */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <div style={{ flex: '1 1 260px' }}>
                <input
                  type="text"
                  placeholder="Tìm theo Tên nhân sự, Mã NV, Email hoặc Đơn vị..."
                  value={letterSearch}
                  onChange={(e) => setLetterSearch(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--clr-line)', fontSize: '13.5px' }}
                />
              </div>

              <select
                value={letterUnitFilter}
                onChange={(e) => setLetterUnitFilter(e.target.value)}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--clr-line)', fontSize: '13.5px', background: '#fff', minWidth: '220px' }}
              >
                <option value="all">Tất cả phòng ban / Đơn vị</option>
                {Array.from(new Set(lettersData.letters?.map(l => l.unitName).filter(Boolean))).map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            {/* BẢNG DANH SÁCH 298 THƯ */}
            <div className="table-responsive" style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--clr-line)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                <thead>
                  <tr style={{ background: 'var(--clr-bg-alt)', borderBottom: '2px solid var(--clr-line)' }}>
                    <th style={{ padding: '12px 14px', width: '50px' }}>STT</th>
                    <th style={{ padding: '12px 14px' }}>Mã NV</th>
                    <th style={{ padding: '12px 14px' }}>Họ và tên</th>
                    <th style={{ padding: '12px 14px' }}>Danh xưng</th>
                    <th style={{ padding: '12px 14px' }}>Email</th>
                    <th style={{ padding: '12px 14px' }}>Đơn vị / Phòng ban</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>Ngày cống hiến</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center' }}>Trạng thái</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center' }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLetters.map((l, idx) => (
                    <tr key={l.id || idx} style={{ borderBottom: '1px solid var(--clr-line)' }}>
                      <td style={{ padding: '10px 14px', color: 'var(--clr-ink-3)', fontWeight: 600 }}>{idx + 1}</td>
                      <td style={{ padding: '10px 14px', fontFamily: 'var(--ff-mono)', fontWeight: 700 }}>{l.employeeCode}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--clr-ink)' }}>{l.fullName}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', background: '#fef3c7', color: '#b45309', fontWeight: 700, fontSize: '12px' }}>
                          {l.salutation || 'Anh/Chị'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--clr-ink-2)' }}>{l.email || '—'}</td>
                      <td style={{ padding: '10px 14px' }}>{l.unitName || '—'}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'var(--ff-mono)', fontWeight: 700 }}>
                        {Number(l.daysOfService || 0).toLocaleString('vi-VN')} ngày
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          {l.isOpened ? (
                            <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '12px' }}>✓ Đã mở thư</span>
                          ) : (
                            <span style={{ color: 'var(--clr-ink-3)', fontSize: '12px' }}>Chưa mở</span>
                          )}
                          {l.isPublished ? (
                            <span style={{ padding: '1px 6px', borderRadius: '4px', background: '#dcfce7', color: '#15803d', fontWeight: 600, fontSize: '11px' }}>
                              ✓ Đã phát hành
                            </span>
                          ) : (
                            <span style={{ padding: '1px 6px', borderRadius: '4px', background: '#fef3c7', color: '#b45309', fontSize: '11px' }}>
                              Chờ 20h 20/11
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => setPreviewingLetter(l)}
                            title={`Xem trước bức thư của ${l.fullName}`}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              background: '#0e6cb0',
                              color: '#ffffff',
                              border: 'none',
                              fontSize: '11.5px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            👁️ Xem thư
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleToggleIndividualPublish(l, e)}
                            title={l.isPublished ? 'Tạm khóa phát hành riêng' : 'Phát hành riêng ngay lập tức'}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              background: l.isPublished ? '#fee2e2' : '#16a34a',
                              color: l.isPublished ? '#dc2626' : '#ffffff',
                              border: 'none',
                              fontSize: '11.5px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}
                          >
                            {l.isPublished ? '🔒 Khóa' : '🚀 Phát hành'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredLetters.length === 0 && (
                    <tr>
                      <td colSpan={9} style={{ padding: '36px', textAlign: 'center', color: 'var(--clr-ink-3)' }}>
                        Không tìm thấy nhân sự nào khớp với từ khóa tìm kiếm.
                      </td>
                    </tr>
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

              {Number(selectedSub.mission_id) === 2 ? (
                <div style={{ background: '#fef7e0', color: '#b06000', padding: '12px 16px', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '16px', border: '1px solid #f9df9b' }}>
                  ✍️ <strong>Mission 02 — Chấm điểm thủ công:</strong> Đọc câu chuyện ký ức và xem tệp đính kèm để đánh giá chất lượng (thang điểm 0–100). Điểm số này là căn cứ chính để xếp hạng giải cá nhân.
                </div>
              ) : (
                <div style={{ background: '#e8f0fe', color: '#1a73e8', padding: '12px 16px', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '16px', border: '1px solid #d2e3fc' }}>
                  ⚡ <strong>Nhiệm vụ tự động:</strong> Mission 0{selectedSub.mission_id} đã được hệ thống tự động kiểm tra đáp án và xác nhận hợp lệ (1 điểm) ngay khi người chơi nộp bài.
                </div>
              )}

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
                {subPoints != null && (
                  <p style={{ color: 'var(--clr-ink-3)', fontSize: '0.85rem', marginTop: '6px' }}>
                    Mission {String(selectedSub.mission_id).padStart(2, '0')}: hoàn thành hợp lệ = {subPoints} điểm (tự điền khi chọn "Hợp lệ").
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
                          // Mission 01/02/04: hoàn thành hợp lệ = điểm cấu hình sẵn
                          if (o.v === 'valid' && subPoints != null && scoreInput === '') setScoreInput(String(subPoints));
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

      {/* MODAL CHỈNH SỬA HỌ TÊN & ĐƠN VỊ NGƯỜI THAM GIA */}
      {editingUser && (
        <div className="modal is-open" aria-hidden="false" role="dialog">
          <div className="modal__backdrop" onClick={() => setEditingUser(null)}></div>
          <div className="modal__panel" style={{ maxWidth: '500px', width: '100%' }}>
            <button className="modal__close" onClick={() => setEditingUser(null)} aria-label="Đóng">&times;</button>
            <h2 style={{ margin: '0 0 6px 0', fontSize: '1.25rem', color: 'var(--clr-ink-1)' }}>
              Chỉnh sửa tên và đơn vị người tham gia
            </h2>
            <p style={{ margin: '0 0 18px 0', fontSize: '0.88rem', color: 'var(--clr-ink-3)' }}>
              Email: <strong>{editingUser.email}</strong> · Mã NV: <code>{editingUser.employee_id}</code>
            </p>

            <form onSubmit={handleSaveEditUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="editFullName">Họ và tên người tham gia *</label>
                <input
                  id="editFullName"
                  type="text"
                  required
                  value={editUserForm.fullName}
                  onChange={(e) => setEditUserForm(f => ({ ...f, fullName: e.target.value }))}
                  placeholder="Nhập họ và tên đầy đủ"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="editUnitCode">Đơn vị / Phòng ban *</label>
                <select
                  id="editUnitCode"
                  required
                  value={editUserForm.unitCode}
                  onChange={(e) => setEditUserForm(f => ({ ...f, unitCode: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--clr-line)',
                    fontSize: '0.95rem'
                  }}
                >
                  <option value="">-- Chọn đơn vị / phòng ban --</option>
                  {units.map(unit => (
                    <option key={unit.id || unit.code} value={unit.code}>
                      {unit.name} ({unit.code})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={() => setEditingUser(null)}
                  disabled={savingUser}
                >
                  Hủy
                </button>
                <button type="submit" className="btn btn--gold" disabled={savingUser}>
                  {savingUser ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PREVIEW THƯ TRI ÂN CHO ADMIN */}
      {previewingLetter && (
        <GratitudeLetterModal
          isOpen={true}
          onClose={() => setPreviewingLetter(null)}
          currentUser={previewingLetter}
          previewData={previewingLetter}
        />
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
