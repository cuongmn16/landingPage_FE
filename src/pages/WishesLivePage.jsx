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

  const handleAdminHide = async (e, wishId) => {
    e.stopPropagation();
    if (!wishId) return;
    try {
      await api.toggleHideWish(wishId, true);
      wishesPoolRef.current = wishesPoolRef.current.filter((w) => w.id !== wishId);
      setFloatingCards((prev) => prev.filter((c) => c.wish.id !== wishId));
      setTotalCount((prev) => Math.max(0, prev - 1));
    } catch {
      // ignore
    }
  };

  // Mã QR luôn giữ độ tương phản cao nhất (opacity 1.0) và kích thước lớn dễ quét,
  // chỉ co nhẹ khi có trên 50 lời chúc để nhường không gian sân khấu nhưng tối thiểu vẫn 88%
  const qrScale = Math.max(0.88, 1 - totalCount * 0.002);

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

      {/* TRUNG TÂM SÂN KHẤU: MÃ QR PHÁT SÁNG NẰM TRỌN Ở KHOẢNG GIỮA, KHÔNG BỊ THẺ CHE */}
      <div
        className="ww-qr-wrap"
        style={{
          transform: `translate(-50%, -50%) scale(${qrScale.toFixed(3)})`
        }}
      >
        <div className="ww-qr-card">
          <div className="ww-qr-header-brand">
            <div className="ww-qr-logo-badge">
              <img src="/assets/ctin-logo.png" alt="CTIN" />
            </div>
            <span className="ww-qr-badge">Sự kiện kỷ niệm 25 năm CTIN</span>
          </div>
          <h2 className="ww-qr-heading">QUÉT MÃ ĐỂ GỬI LỜI CHÚC</h2>

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
                  <button
                    type="button"
                    className="ww-card__hide-btn"
                    onClick={(e) => handleAdminHide(e, wish.id)}
                    title="Ẩn lời chúc này khỏi màn hình"
                  >
                    Ẩn
                  </button>
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
