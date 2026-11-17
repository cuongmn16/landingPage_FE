import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api, auth } from '../services/api';
import { generateQrMatrix } from '../utils/qrCode';
import '../styles/wishes.css';

// Luồng thẻ chúc bay lên ở hai bên cánh (trái: 3% - 25%, phải: 63% - 80%),
// chừa toàn bộ khoảng giữa (26% - 62%) cho Mã QR để điện thoại quét 100% không bao giờ bị che khuất!
const LANES = [3, 10, 18, 25, 63, 70, 77];

export default function WishesLivePage() {
  const [totalCount, setTotalCount] = useState(0);
  const [floatingCards, setFloatingCards] = useState([]);
  const [latestWish, setLatestWish] = useState(null);
  const [isZoomQr, setIsZoomQr] = useState(false);

  // Admin Moderation State (Chỉ xem và thao tác được khi đăng nhập tài khoản Admin)
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [adminWishes, setAdminWishes] = useState([]);
  const [loadingAdminWishes, setLoadingAdminWishes] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');
  const [adminUnitFilter, setAdminUnitFilter] = useState('all');
  const [adminStatusFilter, setAdminStatusFilter] = useState('all');

  const wishesPoolRef = useRef([]);
  const seenIdsRef = useRef(new Set());
  const poolCursorRef = useRef(0);
  const laneCursorRef = useRef(0);
  const cardKeyCounterRef = useRef(1);

  const isAdmin = auth.isAdmin();

  // Đường dẫn mở form gửi lời chúc cho mã QR:
  // 1. Tự động nhận diện domain triển khai chính thức (window.location.origin)
  // 2. Hỗ trợ biến môi trường (VITE_MOBILE_FORM_URL / VITE_PUBLIC_URL)
  // 3. Hỗ trợ chỉ định domain qua URL (?url=https://sukien.ctin.vn) nếu cần thiết
  const mobileFormUrl = useMemo(() => {
    if (typeof window !== 'undefined') {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const paramUrl = searchParams.get('url') || searchParams.get('target');
        if (paramUrl) {
          const clean = paramUrl.trim();
          return clean.endsWith('/gui-loi-chuc') ? clean : `${clean.replace(/\/$/, '')}/gui-loi-chuc`;
        }
      } catch {
        // ignore
      }
    }

    const envUrl = import.meta.env?.VITE_MOBILE_FORM_URL || import.meta.env?.VITE_PUBLIC_URL;
    if (envUrl) {
      return envUrl.endsWith('/gui-loi-chuc') ? envUrl : `${envUrl.replace(/\/$/, '')}/gui-loi-chuc`;
    }

    if (typeof window !== 'undefined' && window.location?.origin && window.location.origin !== 'null') {
      return `${window.location.origin}/gui-loi-chuc`;
    }

    return 'https://ctin.vn/gui-loi-chuc';
  }, []);

  const qrMatrix = useMemo(() => generateQrMatrix(mobileFormUrl), [mobileFormUrl]);

  const spawnFloatingCard = useCallback((wish) => {
    if (!wish) return;
    const keyId = `fc-${cardKeyCounterRef.current++}-${wish.id || Date.now()}`;
    const laneIdx = laneCursorRef.current % LANES.length;
    laneCursorRef.current += 1;

    const baseLeft = LANES[laneIdx];
    const jitter = (Math.random() * 5 - 2.5);
    const leftPercent = Math.min(73, Math.max(3, baseLeft + jitter));
    const duration = (12.5 + Math.random() * 3.5).toFixed(2);
    const rotStart = (Math.random() * 5 - 2.5).toFixed(2);
    const rotEnd = (Math.random() * 5 - 2.5).toFixed(2);
    const driftX = `${Math.round(Math.random() * 28 - 14)}px`;
    const themeIdx = (Number(wish.id) || cardKeyCounterRef.current) % 4;

    const newCard = {
      keyId,
      wish,
      leftPercent,
      duration,
      rotStart,
      rotEnd,
      driftX,
      themeIdx
    };

    setFloatingCards((prev) => {
      const next = [...prev, newCard];
      return next.length > 28 ? next.slice(next.length - 28) : next;
    });
  }, []);

  const removeFloatingCard = useCallback((keyId) => {
    setFloatingCards((prev) => prev.filter((c) => c.keyId !== keyId));
  }, []);

  const fetchWishes = useCallback(async () => {
    const res = await api.getLiveWishes();
    const list = Array.isArray(res.wishes) ? res.wishes : [];
    setTotalCount(Number(res.totalCount || list.length));
    wishesPoolRef.current = list;

    if (list.length > 0) {
      setLatestWish(list[0]);
    }

    // Phát hiện lời chúc mới vừa gửi để ưu tiên bay lên ngay lập tức
    const newlyArrived = [];
    for (const item of list) {
      if (item.id && !seenIdsRef.current.has(item.id)) {
        seenIdsRef.current.add(item.id);
        newlyArrived.push(item);
      }
    }

    if (newlyArrived.length > 0) {
      setLatestWish(newlyArrived[0]);
    }

    // Nếu lần đầu tải trang có nhiều lời chúc, chỉ tung trước 3 thẻ đầu để mượt
    const toSpawnNow = newlyArrived.slice(0, 3);
    toSpawnNow.forEach((w, idx) => {
      setTimeout(() => spawnFloatingCard(w), idx * 500);
    });
  }, [spawnFloatingCard]);

  useEffect(() => {
    const initialTimer = setTimeout(fetchWishes, 0);
    const pollTimer = setInterval(fetchWishes, 1500);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(pollTimer);
    };
  }, [fetchWishes]);

  // Vòng lặp duy trì luồng lời chúc bay lên đều đặn từ danh sách đã gửi
  useEffect(() => {
    const streamTimer = setInterval(() => {
      const pool = wishesPoolRef.current;
      if (!pool || pool.length === 0) return;
      const idx = poolCursorRef.current % pool.length;
      poolCursorRef.current += 1;
      spawnFloatingCard(pool[idx]);
    }, 2300);

    return () => clearInterval(streamTimer);
  }, [spawnFloatingCard]);

  // Tải toàn bộ lời chúc cho Admin kiểm duyệt
  const loadAdminWishes = useCallback(async () => {
    if (!isAdmin) return;
    setLoadingAdminWishes(true);
    try {
      const data = await api.getAllWishesAdmin();
      setAdminWishes(Array.isArray(data) ? data : []);
    } catch {
      // ignore
    } finally {
      setLoadingAdminWishes(false);
    }
  }, [isAdmin]);

  const handleAdminToggleHide = async (wishId, currentHidden) => {
    try {
      await api.toggleHideWish(wishId, !currentHidden);
      if (!currentHidden) {
        wishesPoolRef.current = wishesPoolRef.current.filter((w) => w.id !== wishId);
        setFloatingCards((prev) => prev.filter((c) => c.wish.id !== wishId));
        setTotalCount((prev) => Math.max(0, prev - 1));
      } else {
        setTotalCount((prev) => prev + 1);
      }
      setAdminWishes((prev) =>
        prev.map((w) => (w.id === wishId ? { ...w, isHidden: !currentHidden } : w))
      );
      fetchWishes();
    } catch {
      // ignore
    }
  };

  const handleAdminDelete = async (wishId) => {
    if (!window.confirm('Bạn có chắc chắn muốn XÓA VĨNH VIỄN lời chúc này khỏi hệ thống?')) return;
    try {
      await api.deleteWish(wishId);
      wishesPoolRef.current = wishesPoolRef.current.filter((w) => w.id !== wishId);
      setFloatingCards((prev) => prev.filter((c) => c.wish.id !== wishId));
      setAdminWishes((prev) => prev.filter((w) => w.id !== wishId));
      setTotalCount((prev) => Math.max(0, prev - 1));
      fetchWishes();
    } catch {
      // ignore
    }
  };

  const handleAdminReset = async () => {
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
      wishesPoolRef.current = [];
      setFloatingCards([]);
      setAdminWishes([]);
      setTotalCount(0);
      setLatestWish(null);
      alert('Đã reset toàn bộ bức tường lời chúc thành công!');
    } catch {
      alert('Không thể reset bức tường lời chúc lúc này.');
    }
  };

  const adminUnitsList = useMemo(() => {
    const set = new Set();
    adminWishes.forEach((w) => {
      if (w.unitName && w.unitName.trim()) set.add(w.unitName.trim());
    });
    return Array.from(set).sort();
  }, [adminWishes]);

  const adminFilteredWishes = useMemo(() => {
    return adminWishes.filter((w) => {
      if (adminStatusFilter === 'visible' && w.isHidden) return false;
      if (adminStatusFilter === 'hidden' && !w.isHidden) return false;
      if (adminUnitFilter !== 'all' && (w.unitName || '').trim() !== adminUnitFilter) return false;
      if (adminSearch.trim()) {
        const q = adminSearch.toLowerCase();
        const matchName = (w.senderName || '').toLowerCase().includes(q);
        const matchContent = (w.content || '').toLowerCase().includes(q);
        const matchUnit = (w.unitName || '').toLowerCase().includes(q);
        if (!matchName && !matchContent && !matchUnit) return false;
      }
      return true;
    });
  }, [adminWishes, adminStatusFilter, adminUnitFilter, adminSearch]);

  const qrSize = qrMatrix.length;
  const quietZone = 4;
  const viewBoxSize = qrSize + quietZone * 2;

  return (
    <div className="ww-stage">
      <div className="ww-stage__vignette" />

      {/* TOP BAR */}
      <header className="ww-header">
        <div className="ww-header__brand">
          <Link to="/" className="ww-header__logo-box" title="Quay về Trang chủ">
            <img src="/assets/ctin-logo.png" alt="CTIN Logo" className="ww-header__logo-img" />
          </Link>
          <div>
            <span className="ww-header__kicker">2001 – 2026 · HƯỚNG TỚI CHƯƠNG 26</span>
            <h1 className="ww-header__title">CTIN 25 NĂM · BỨC TƯỜNG LỜI CHÚC</h1>
          </div>
        </div>

        <div className="ww-header__right">
          <div className="ww-live-pill">
            <span className="ww-live-dot" />
            <span className="ww-live-label">Trực tiếp:</span>
            <span className="ww-live-count">{totalCount}</span>
            <span className="ww-live-label">lời chúc</span>
          </div>
          {isAdmin && (
            <button
              type="button"
              className="ww-admin-panel-btn"
              onClick={() => {
                setIsAdminPanelOpen(true);
                loadAdminWishes();
              }}
              title="Mở Bảng Điều Khiển Quản Trị Lời Chúc (Chỉ Admin xem được)"
            >
              🛡️ Quản trị ({adminWishes.length || totalCount})
            </button>
          )}
          <button
            type="button"
            className="ww-zoom-btn"
            onClick={() => setIsZoomQr(true)}
            title="Phóng to mã QR để quét dễ hơn"
          >
            🔍 Phóng to QR
          </button>
          <Link to="/" className="ww-back-link">
            ← Trang chủ
          </Link>
        </div>
      </header>

      {/* MÃ QR ĐẶT GÓC PHẢI DƯỚI CÙNG - KHÔNG CHE KHUẤT KEY VISUAL 25 NĂM Ở TRUNG TÂM */}
      <div className="ww-qr-wrap">
        <div className="ww-qr-card">
          <div className="ww-qr-header-brand">
            <div className="ww-qr-logo-badge">
              <img src="/assets/ctin-logo.png" alt="CTIN" />
            </div>
            <span className="ww-qr-badge">CTIN 25 NĂM</span>
          </div>
          <h2 className="ww-qr-heading">QUÉT MÃ GỬI LỜI CHÚC</h2>

          {/* Hộp mã QR chuẩn ISO với quietZone 4 modules */}
          <div
            className="ww-qr-box"
            onClick={() => setIsZoomQr(true)}
            title="Bấm để phóng to toàn màn hình"
            role="button"
            tabIndex={0}
          >
            <svg
              className="ww-qr-svg"
              viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
              shapeRendering="crispEdges"
              aria-label="Mã QR gửi lời chúc CTIN 25 năm"
            >
              <rect width={viewBoxSize} height={viewBoxSize} fill="#ffffff" />
              {qrMatrix.map((row, rIdx) =>
                Array.from(row).map((cell, cIdx) =>
                  cell ? (
                    <rect
                      key={`${rIdx}-${cIdx}`}
                      x={cIdx + quietZone}
                      y={rIdx + quietZone}
                      width={1}
                      height={1}
                      fill="#000000"
                    />
                  ) : null
                )
              )}
            </svg>
            <span className="ww-qr-tap-hint">🔍 Nhấn để phóng to</span>
          </div>

          <p className="ww-qr-hint">Dùng Camera điện thoại hoặc Zalo quét mã</p>
          <span className="ww-qr-subhint">✨ Không cần đăng nhập · Hiển thị tức thì</span>
        </div>
      </div>

      {/* MODAL PHÓNG TO MÃ QR KHỔ LỚN DÀNH CHO CẢ KHÁN PHÒNG / ĐIỆN THOẠI QUÉT XA */}
      {isZoomQr && (
        <div className="ww-modal-backdrop" onClick={() => setIsZoomQr(false)}>
          <div className="ww-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="ww-modal-close"
              onClick={() => setIsZoomQr(false)}
              aria-label="Đóng"
            >
              ✕
            </button>

            <div className="ww-modal-header">
              <div className="ww-qr-logo-badge">
                <img src="/assets/ctin-logo.png" alt="CTIN" />
              </div>
              <h3>QUÉT MÃ GỬI LỜI CHÚC CTIN 25 NĂM</h3>
              <p>Mã QR kích thước lớn siêu nét · Tương thích mọi loại điện thoại (Camera, Zalo, QR Scanner)</p>
            </div>

            <div className="ww-modal-qr-box">
              <svg
                className="ww-modal-qr-svg"
                viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
                shapeRendering="crispEdges"
              >
                <rect width={viewBoxSize} height={viewBoxSize} fill="#ffffff" />
                {qrMatrix.map((row, rIdx) =>
                  Array.from(row).map((cell, cIdx) =>
                    cell ? (
                      <rect
                        key={`m-${rIdx}-${cIdx}`}
                        x={cIdx + quietZone}
                        y={rIdx + quietZone}
                        width={1}
                        height={1}
                        fill="#000000"
                      />
                    ) : null
                  )
                )}
              </svg>
            </div>

            <div className="ww-modal-footer">
              <p className="ww-modal-hint">Hướng camera điện thoại hoặc ứng dụng Zalo về phía màn hình để quét mã</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL QUẢN TRỊ LỜI CHÚC DÀNH RIÊNG CHO TÀI KHOẢN ADMIN */}
      {isAdmin && isAdminPanelOpen && (
        <div className="ww-modal-backdrop" onClick={() => setIsAdminPanelOpen(false)}>
          <div className="ww-admin-panel-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="ww-modal-close"
              onClick={() => setIsAdminPanelOpen(false)}
              aria-label="Đóng"
            >
              ✕
            </button>

            <div className="ww-admin-panel__header">
              <div className="ww-admin-panel__title-box">
                <span className="ww-admin-panel__badge">BẢNG ĐIỀU KHIỂN BAN TỔ CHỨC</span>
                <h2 className="ww-admin-panel__title">🛡️ Quản Trị Lời Chúc Màn Hình Sự Kiện</h2>
              </div>
              <div className="ww-admin-panel__header-actions">
                <Link to="/admin?tab=wishes" className="ww-admin-dash-link">
                  Mở trên Admin Dashboard ↗
                </Link>
                <button
                  type="button"
                  className="ww-admin-reset-btn"
                  onClick={handleAdminReset}
                  title="Xóa toàn bộ lời chúc để sẵn sàng trước giờ G"
                >
                  ⚠️ Reset Bức Tường (Xóa tất cả)
                </button>
              </div>
            </div>

            {/* BỘ LỌC TÌM KIẾM CHO ADMIN */}
            <div className="ww-admin-panel__filter-bar">
              <input
                type="text"
                className="ww-admin-input"
                placeholder="🔍 Tìm theo họ tên, nội dung lời chúc..."
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
              />
              <select
                className="ww-admin-select"
                value={adminUnitFilter}
                onChange={(e) => setAdminUnitFilter(e.target.value)}
              >
                <option value="all">Tất cả phòng ban ({adminUnitsList.length})</option>
                {adminUnitsList.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
              <select
                className="ww-admin-select"
                value={adminStatusFilter}
                onChange={(e) => setAdminStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="visible">🟢 Đang chiếu ({adminWishes.filter((w) => !w.isHidden).length})</option>
                <option value="hidden">⚪ Đã ẩn ({adminWishes.filter((w) => w.isHidden).length})</option>
              </select>
              <button
                type="button"
                className="ww-admin-refresh-btn"
                onClick={loadAdminWishes}
                disabled={loadingAdminWishes}
              >
                {loadingAdminWishes ? 'Đang tải...' : '🔄 Làm mới'}
              </button>
            </div>

            {/* DANH SÁCH LỜI CHÚC TRONG MODAL */}
            <div className="ww-admin-panel__list">
              {loadingAdminWishes ? (
                <div className="ww-admin-loading">Đang tải danh sách lời chúc...</div>
              ) : adminFilteredWishes.length === 0 ? (
                <div className="ww-admin-empty">
                  {adminWishes.length === 0
                    ? 'Bức tường hiện đang trống. Chưa có lời chúc nào.'
                    : 'Không có lời chúc nào khớp với bộ lọc tìm kiếm.'}
                </div>
              ) : (
                adminFilteredWishes.map((w, index) => (
                  <div key={w.id || index} className={`ww-admin-item ${w.isHidden ? 'is-hidden' : ''}`}>
                    <div className="ww-admin-item__top">
                      <div className="ww-admin-item__meta">
                        <strong className="ww-admin-item__name">{w.senderName}</strong>
                        <span className="ww-admin-item__unit">🏛️ {w.unitName}</span>
                      </div>
                      <div className="ww-admin-item__status">
                        <span className={`ww-admin-status-pill ${w.isHidden ? 'hidden' : 'visible'}`}>
                          {w.isHidden ? '⚪ Đã ẩn' : '🟢 Đang hiển thị'}
                        </span>
                        <span className="ww-admin-item__time">
                          {new Date(w.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <p className="ww-admin-item__content">“{w.content}”</p>
                    <div className="ww-admin-item__actions">
                      <button
                        type="button"
                        className={`ww-admin-toggle-btn ${w.isHidden ? 'show' : 'hide'}`}
                        onClick={() => handleAdminToggleHide(w.id, w.isHidden)}
                      >
                        {w.isHidden ? '👁️ Cho hiển thị lại' : '🙈 Ẩn khỏi màn hình'}
                      </button>
                      <button
                        type="button"
                        className="ww-admin-delete-btn"
                        onClick={() => handleAdminDelete(w.id)}
                      >
                        🗑️ Xóa vĩnh viễn
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* LUỒNG THẺ LỜI CHÚC BAY LÊN Ở 2 BÊN CÁNH */}
      <div className="ww-stream">
        {floatingCards.map((item) => {
          const { keyId, wish, leftPercent, duration, rotStart, rotEnd, driftX, themeIdx } = item;
          const initial = (wish.senderName || 'C').trim().charAt(0).toUpperCase();

          return (
            <div
              key={keyId}
              className={`ww-card ww-card--theme-${themeIdx}`}
              style={{
                left: `${leftPercent}%`,
                '--ww-duration': `${duration}s`,
                '--ww-rot-start': `${rotStart}deg`,
                '--ww-rot-end': `${rotEnd}deg`,
                '--ww-drift-x': driftX
              }}
              onAnimationEnd={() => removeFloatingCard(keyId)}
            >
              <div className="ww-card__top">
                <div className="ww-card__author">
                  <div className="ww-card__avatar">{initial}</div>
                  <span className="ww-card__name">{wish.senderName}</span>
                </div>
                <span className="ww-card__unit">{wish.unitName}</span>
              </div>

              <p className="ww-card__content">“{wish.content}”</p>

              <div className="ww-card__footer">
                <span>✨ CTIN 25 NĂM</span>
                {isAdmin ? (
                  <div className="ww-card__admin-actions">
                    <button
                      type="button"
                      className="ww-card__hide-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAdminToggleHide(wish.id, wish.isHidden || false);
                      }}
                      title="Ẩn lời chúc này khỏi màn hình"
                    >
                      Ẩn
                    </button>
                    <button
                      type="button"
                      className="ww-card__del-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAdminDelete(wish.id);
                      }}
                      title="Xóa vĩnh viễn"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <span>Trực tiếp</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* THANH HIGHLIGHT LỜI CHÚC MỚI NHẤT Ở ĐÁY MÀN HÌNH */}
      {latestWish && (
        <div className="ww-highlight">
          <span className="ww-highlight__badge">Lời chúc mới nhất</span>
          <span className="ww-highlight__text">
            <strong>{latestWish.senderName}</strong> ({latestWish.unitName}): “{latestWish.content}”
          </span>
        </div>
      )}
    </div>
  );
}
