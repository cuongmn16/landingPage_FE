import React, { useState } from 'react';
import { api, forgotPasswordApi } from '../../services/api';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  // Login states
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

  // Forgot password states
  const [forgotEmail, setForgotEmail] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const authData = await api.login(usernameOrEmail.trim(), password);
      localStorage.setItem('ctin_user', JSON.stringify(authData));
      window.dispatchEvent(new Event('storage'));
      if (onLoginSuccess) onLoginSuccess(authData);
      onClose();
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage(err.message || 'Tên đăng nhập hoặc mật khẩu không chính xác.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      setErrorMessage('Vui lòng nhập địa chỉ Email hợp lệ.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const resMsg = await forgotPasswordApi(forgotEmail.trim());
      setStatusMessage(`✅ ${resMsg || `Mật khẩu truy cập và thông tin tài khoản đã được gửi tới email ${forgotEmail}. Vui lòng kiểm tra hộp thư!`}`);
    } catch (err) {
      console.error('Forgot password error:', err);
      setErrorMessage(err.message || 'Không tìm thấy tài khoản tương ứng với Email đã nhập.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSwitchToForgot = () => {
    setIsForgotPassword(true);
    setErrorMessage(null);
    setStatusMessage(null);
    if (usernameOrEmail.includes('@')) {
      setForgotEmail(usernameOrEmail);
    }
  };

  const handleSwitchToLogin = () => {
    setIsForgotPassword(false);
    setErrorMessage(null);
    setStatusMessage(null);
  };

  return (
    <div className={`modal modal--submission ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen} role="dialog">
      <div className="modal__backdrop" onClick={onClose}></div>
      <div className="modal__panel">
        <button className="modal__close" onClick={onClose} aria-label="Đóng">&times;</button>

        <div style={{ padding: '12px 4px' }}>
          {!isForgotPassword ? (
            /* MODE 1: LOGIN FORM */
            <>
              <div style={{ marginBottom: '20px' }}>
                <span className="mono" style={{ color: 'var(--clr-gold)', fontSize: '0.85rem' }}>MEMBER LOGIN</span>
                <h2 style={{ fontSize: '1.5rem', marginTop: '4px' }}>Đăng nhập Hệ thống</h2>
                <p style={{ color: 'var(--clr-ink-2)', fontSize: '0.85rem' }}>
                  Đăng nhập bằng Email công ty và Mật khẩu được cấp.
                </p>
              </div>

              {errorMessage && (
                <div style={{ padding: '10px 14px', background: '#f8d7da', color: '#721c24', borderRadius: '6px', marginBottom: '14px', fontSize: '0.85rem' }}>
                  ⚠️ {errorMessage}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px' }}>
                    Email hoặc Mã Nhân Viên:
                  </label>
                  <input
                    type="text"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    required
                    placeholder="VD: nhanvien@ctin.vn hoặc NV001"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                      Mật khẩu:
                    </label>
                    <button
                      type="button"
                      onClick={handleSwitchToForgot}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#0056b3',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        textDecoration: 'underline'
                      }}
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Nhập mật khẩu..."
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button type="button" className="btn" onClick={onClose} style={{ background: '#eee', color: '#333' }}>
                    Hủy
                  </button>
                  <button type="submit" className="btn btn--gold" disabled={submitting}>
                    {submitting ? 'Đang xác thực...' : 'Đăng nhập →'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* MODE 2: FORGOT PASSWORD FORM */
            <>
              <div style={{ marginBottom: '20px' }}>
                <span className="mono" style={{ color: 'var(--clr-gold)', fontSize: '0.85rem' }}>FORGOT PASSWORD</span>
                <h2 style={{ fontSize: '1.5rem', marginTop: '4px' }}>Khôi phục Mật khẩu</h2>
                <p style={{ color: 'var(--clr-ink-2)', fontSize: '0.85rem' }}>
                  Nhập địa chỉ Email của bạn. Hệ thống sẽ kiểm tra và gửi thông tin mật khẩu đăng nhập trực tiếp về Email.
                </p>
              </div>

              {statusMessage && (
                <div style={{ padding: '12px', background: '#d4edda', color: '#155724', borderRadius: '6px', marginBottom: '14px', fontSize: '0.88rem', lineHeight: '1.4' }}>
                  {statusMessage}
                </div>
              )}

              {errorMessage && (
                <div style={{ padding: '10px 14px', background: '#f8d7da', color: '#721c24', borderRadius: '6px', marginBottom: '14px', fontSize: '0.85rem' }}>
                  ⚠️ {errorMessage}
                </div>
              )}

              <form onSubmit={handleForgotPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px' }}>
                    📧 Email công ty đã đăng ký:
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    placeholder="VD: nhanvien@ctin.vn"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '10px' }}>
                  <button type="button" className="btn" onClick={handleSwitchToLogin} style={{ background: '#eee', color: '#333' }}>
                    ← Quay lại Đăng nhập
                  </button>
                  <button type="submit" className="btn btn--gold" disabled={submitting}>
                    {submitting ? 'Đang gửi Email...' : '📩 Gửi mật khẩu qua Email →'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
