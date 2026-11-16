import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api, auth } from '../services/api';
import '../styles/wishes.css';

const DEFAULT_CTIN_UNITS = [
  'Ban Lãnh đạo',
  'Ban Kế hoạch tổng hợp',
  'Ban Kinh doanh',
  'Ban Tài chính',
  'Ban Nhân lực',
  'Trung tâm Triển khai',
  'Trung tâm Tư vấn giải pháp',
  'Ban Quản lý dự án',
  'Văn phòng Hà Nội',
  'Văn phòng Đà Nẵng',
  'Văn phòng Hồ Chí Minh',
  'BU Vietlott',
  'Khách quý / Đối tác'
];

const QUICK_EMOJIS = ['🎉', '🎂', '🚀', '❤️', '🏆', '🌟', '🥂', '🔥'];

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'CT';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatWishTime(isoString) {
  if (!isoString) return 'Vừa xong';
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffSec = Math.max(0, Math.floor(diffMs / 1000));
    if (diffSec < 45) return 'Vừa xong';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} phút trước`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} giờ trước`;
    return new Date(isoString).toLocaleDateString('vi-VN');
  } catch {
    return 'Vừa xong';
  }
}

export default function SendWishPage() {
  const currentUser = auth.user;

  const [activeTab, setActiveTab] = useState('form'); // 'form' | 'stream'
  const [units, setUnits] = useState(DEFAULT_CTIN_UNITS);
  const [senderName, setSenderName] = useState(currentUser?.full_name || '');
  const [unitName, setUnitName] = useState(currentUser?.unit || DEFAULT_CTIN_UNITS[0]);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedWish, setSubmittedWish] = useState(null);

  const [wishesList, setWishesList] = useState([]);
  const [loadingWishes, setLoadingWishes] = useState(false);

  // Tải danh sách đơn vị nếu API có sẵn
  useEffect(() => {
    let active = true;
    try {
      if (typeof api?.getUnits === 'function') {
        api.getUnits()
          .then((list) => {
            if (!active || !Array.isArray(list) || list.length === 0) return;
            const names = list.map((u) => u?.name || u?.unitName || u).filter(Boolean);
            if (!names.includes('Khách quý / Đối tác')) {
              names.push('Khách quý / Đối tác');
            }
            setUnits(names);
            if (!currentUser?.unit && names.length > 0) {
              setUnitName(names[0]);
            }
          })
          .catch(() => {});
      }
    } catch {
      // Bỏ qua lỗi và giữ nguyên DEFAULT_CTIN_UNITS
    }
    return () => {
      active = false;
    };
  }, [currentUser]);

  // Tải danh sách lời chúc thực tế từ hệ thống
  const fetchWishes = useCallback(async (showLoading = false) => {
    if (showLoading) setLoadingWishes(true);
    try {
      const res = await api.getLiveWishes();
      const list = Array.isArray(res?.wishes) ? res.wishes : [];
      setWishesList(list);
    } catch {
      // fallback
    } finally {
      if (showLoading) setLoadingWishes(false);
    }
  }, []);

  useEffect(() => {
    fetchWishes(true);
    const interval = setInterval(() => {
      fetchWishes(false);
    }, 4000);
    return () => clearInterval(interval);
  }, [fetchWishes]);

  const handleInsertEmoji = (emoji) => {
    setContent((prev) => {
      if ((prev + emoji).length > 300) return prev;
      return prev + emoji;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanName = senderName.trim();
    const cleanUnit = unitName.trim();
    const cleanContent = content.trim();

    if (!cleanName) {
      setError('Vui lòng nhập họ và tên của bạn.');
      return;
    }
    if (!cleanUnit) {
      setError('Vui lòng chọn đơn vị / phòng ban.');
      return;
    }
    if (!cleanContent) {
      setError('Vui lòng nhập lời chúc gửi tới CTIN 25 năm.');
      return;
    }

    setSubmitting(true);
    try {
      const saved = await api.createWish({
        senderName: cleanName,
        unitName: cleanUnit,
        content: cleanContent
      });
      const newWish = saved || {
        id: Date.now(),
        senderName: cleanName,
        unitName: cleanUnit,
        content: cleanContent,
        createdAt: new Date().toISOString()
      };
      setSubmittedWish(newWish);
      setContent('');
      // Cập nhật ngay danh sách để thẻ mới hiển thị đầu tiên
      setWishesList((prev) => [newWish, ...prev.filter((w) => w.id !== newWish.id)]);
    } catch (err) {
      setError(err?.message || 'Không thể gửi lời chúc lúc này. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sw-page">
      <div className="sw-card">
        {/* Header thương hiệu CTIN 25 Năm */}
        <div className="sw-card__header">
          <div className="sw-card__header-top">
            <div className="sw-card__logo-pill">
              <img src="/assets/ctin-logo.png" alt="CTIN" />
            </div>
            <span className="sw-card__tag">2001 – 2026 · 25 Năm</span>
          </div>
          <h1 className="sw-card__title">Gửi Lời Chúc Tới CTIN</h1>
          <p className="sw-card__subtitle">
            Lời chúc của bạn sẽ bay lên trực tiếp trên màn hình sân khấu sự kiện!
          </p>
        </div>

        {/* Thanh chuyển tab trên mobile */}
        <div className="sw-tabs">
          <button
            type="button"
            className={`sw-tab-btn ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => setActiveTab('form')}
          >
            ✍️ Viết lời chúc
          </button>
          <button
            type="button"
            className={`sw-tab-btn ${activeTab === 'stream' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('stream');
              fetchWishes(true);
            }}
          >
            💬 Lời chúc trên sân khấu ({wishesList.length})
          </button>
        </div>

        {/* TAB 1: FORM GỬI HOẶC XEM THẺ VỪA GỬI */}
        {activeTab === 'form' && (
          <div className="sw-tab-content">
            {submittedWish ? (
              <div className="sw-success-view">
                <div className="sw-success-banner">
                  <div className="sw-success-banner__icon">🎉</div>
                  <div className="sw-success-banner__info">
                    <h3 className="sw-success-banner__title">Đã Gửi Thành Công Lên Màn Hình!</h3>
                    <p className="sw-success-banner__desc">
                      Hãy ngước mắt lên màn hình sân khấu để đón xem lời chúc tỏa sáng ✨
                    </p>
                  </div>
                </div>

                {/* THẺ PREVIEW MÔ PHỎNG CHÂN THỰC TRÊN SÂN KHẤU */}
                <div className="sw-preview-card">
                  <div className="sw-preview-card__badge">
                    <span className="sw-preview-card__badge-icon">✨</span>
                    <span>Thẻ mô phỏng hiển thị trên màn hình lớn</span>
                  </div>

                  <div className="sw-preview-card__header">
                    <div className="sw-preview-card__avatar">
                      {getInitials(submittedWish.senderName)}
                    </div>
                    <div className="sw-preview-card__sender-info">
                      <div className="sw-preview-card__name">{submittedWish.senderName}</div>
                      <span className="sw-preview-card__unit">🏛️ {submittedWish.unitName}</span>
                    </div>
                  </div>

                  <div className="sw-preview-card__body">
                    <span className="sw-preview-card__quote-start">“</span>
                    <p className="sw-preview-card__text">{submittedWish.content}</p>
                    <span className="sw-preview-card__quote-end">”</span>
                  </div>

                  <div className="sw-preview-card__footer">
                    <div className="sw-preview-card__status">
                      <span className="sw-pulse-dot" />
                      <span>Đang bay trên sân khấu</span>
                    </div>
                    <span className="sw-preview-card__time">
                      {formatWishTime(submittedWish.createdAt)}
                    </span>
                  </div>
                </div>

                {/* CÁC NÚT HÀNH ĐỘNG */}
                <div className="sw-success-actions">
                  <button
                    type="button"
                    className="sw-submit-btn"
                    onClick={() => {
                      setSubmittedWish(null);
                      setContent('');
                    }}
                  >
                    ✍️ Gửi thêm lời chúc khác
                  </button>
                  <button
                    type="button"
                    className="sw-secondary-btn"
                    onClick={() => setActiveTab('stream')}
                  >
                    💬 Xem tất cả lời chúc ({wishesList.length})
                  </button>
                  <Link to="/wishes" className="sw-link-btn">
                    📺 Mở bức tường sân khấu trực tiếp
                  </Link>
                </div>

                {/* LUỒNG CÁC LỜI CHÚC ĐÃ GỬI KHÁC NGAY DƯỚI */}
                {wishesList.length > 1 && (
                  <div className="sw-recent-feed">
                    <div className="sw-recent-feed__header">
                      <span className="sw-recent-feed__title">✨ Lời chúc khác từ đồng nghiệp</span>
                      <button
                        type="button"
                        className="sw-recent-feed__view-all"
                        onClick={() => setActiveTab('stream')}
                      >
                        Xem tất cả ({wishesList.length}) →
                      </button>
                    </div>
                    <div className="sw-recent-feed__list">
                      {wishesList
                        .filter((w) => w.id !== submittedWish.id)
                        .slice(0, 3)
                        .map((w) => (
                          <div key={w.id} className="sw-mini-card">
                            <div className="sw-mini-card__top">
                              <span className="sw-mini-card__name">{w.senderName}</span>
                              <span className="sw-mini-card__unit">{w.unitName}</span>
                            </div>
                            <p className="sw-mini-card__text">"{w.content}"</p>
                            <span className="sw-mini-card__time">{formatWishTime(w.createdAt)}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <form className="sw-form" onSubmit={handleSubmit}>
                {error && <div className="sw-error">{error}</div>}

                <div className="sw-field">
                  <label htmlFor="swSender">Họ và tên của bạn *</label>
                  <input
                    id="swSender"
                    type="text"
                    className="sw-input"
                    placeholder="VD: Nguyễn Văn An"
                    maxLength={100}
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    required
                  />
                </div>

                <div className="sw-field">
                  <label htmlFor="swUnit">Đơn vị / Phòng ban *</label>
                  <select
                    id="swUnit"
                    className="sw-select"
                    value={unitName}
                    onChange={(e) => setUnitName(e.target.value)}
                    required
                  >
                    {units.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sw-field">
                  <label htmlFor="swContent">Lời chúc gửi tới CTIN 25 năm *</label>
                  <textarea
                    id="swContent"
                    className="sw-textarea"
                    placeholder="Viết lời chúc tâm huyết của bạn gửi tới đại gia đình CTIN..."
                    maxLength={300}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                  <div className="sw-char-row">
                    <div className="sw-emojis">
                      {QUICK_EMOJIS.map((em) => (
                        <button
                          key={em}
                          type="button"
                          className="sw-emoji-btn"
                          onClick={() => handleInsertEmoji(em)}
                          title={`Thêm ${em}`}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                    <span className="sw-char-count">{content.length}/300</span>
                  </div>
                </div>

                <button type="submit" className="sw-submit-btn" disabled={submitting}>
                  {submitting ? 'Đang gửi lên màn hình...' : '🚀 Gửi Lên Màn Hình Lớn'}
                </button>

                {wishesList.length > 0 && (
                  <div className="sw-form-footer-hint">
                    <button
                      type="button"
                      className="sw-link-text-btn"
                      onClick={() => setActiveTab('stream')}
                    >
                      💬 Đã có {wishesList.length} lời chúc được gửi lên màn hình · <u>Xem ngay</u>
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        )}

        {/* TAB 2: STREAM TOÀN BỘ LỜI CHÚC TRÊN SÂN KHẤU */}
        {activeTab === 'stream' && (
          <div className="sw-stream-tab">
            <div className="sw-stream-header">
              <div className="sw-stream-count">
                <span>💬 Tổng số:</span>
                <strong>{wishesList.length} lời chúc</strong>
              </div>
              <div className="sw-stream-header-actions">
                <button
                  type="button"
                  className="sw-refresh-btn"
                  onClick={() => fetchWishes(true)}
                  disabled={loadingWishes}
                >
                  {loadingWishes ? 'Đang tải...' : '🔄 Làm mới'}
                </button>
                <button
                  type="button"
                  className="sw-tab-switch-btn"
                  onClick={() => {
                    setSubmittedWish(null);
                    setActiveTab('form');
                  }}
                >
                  ✍️ Gửi lời chúc
                </button>
              </div>
            </div>

            {wishesList.length === 0 ? (
              <div className="sw-stream-empty">
                <div className="sw-stream-empty__icon">✨</div>
                <h4>Chưa có lời chúc nào</h4>
                <p>Hãy là người đầu tiên gửi lời chúc ý nghĩa tới đại gia đình CTIN 25 năm!</p>
                <button
                  type="button"
                  className="sw-submit-btn"
                  onClick={() => setActiveTab('form')}
                  style={{ maxWidth: '240px', margin: '0 auto' }}
                >
                  ✍️ Gửi lời chúc ngay
                </button>
              </div>
            ) : (
              <div className="sw-stream-list">
                {wishesList.map((item, index) => (
                  <div key={item.id || index} className="sw-stream-card">
                    <div className="sw-stream-card__top">
                      <div className="sw-stream-card__avatar">
                        {getInitials(item.senderName)}
                      </div>
                      <div className="sw-stream-card__meta">
                        <span className="sw-stream-card__name">{item.senderName}</span>
                        <span className="sw-stream-card__unit">🏛️ {item.unitName}</span>
                      </div>
                      <span className="sw-stream-card__time">
                        {formatWishTime(item.createdAt)}
                      </span>
                    </div>
                    <p className="sw-stream-card__content">“{item.content}”</p>
                    <div className="sw-stream-card__bottom">
                      <span className="sw-pulse-dot-sm" />
                      <span className="sw-stream-card__live-tag">Trực tiếp trên sân khấu</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
