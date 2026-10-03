import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, auth, forgotPasswordApi } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password State
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSending, setForgotSending] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatusMsg('');
    setLoading(true);

    try {
      const data = await api.login(email.trim(), password.trim());
      auth.setSession(data.token, data.user);
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Lỗi đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatusMsg('');

    if (!forgotEmail || !forgotEmail.includes('@')) {
      setError('Vui lòng nhập địa chỉ Email công ty hợp lệ.');
      return;
    }

    setForgotSending(true);

    try {
      const res = await forgotPasswordApi(forgotEmail.trim());
      setStatusMsg(res?.message || `Mật khẩu mới đã được gửi tới email ${forgotEmail.trim()}. Vui lòng kiểm tra hộp thư!`);
      setError('');
    } catch (err) {
      setError(err.message || 'Không thể khôi phục mật khẩu. Vui lòng kiểm tra lại địa chỉ email.');
    } finally {
      setForgotSending(false);
    }
  };

  return (
    <div className="auth-body">
      <div className="auth-container">
        <Link to="/" className="auth-logo">
          <img src="/assets/ctin-logo.png" alt="CTIN" />
        </Link>

        {isForgotMode ? (
          /* ============================================================ */
          /* FORM KHÔI PHỤC MẬT KHẨU (FORGOT PASSWORD MODE)               */
          /* ============================================================ */
          <div>
            <h2>Khôi phục mật khẩu</h2>
            <p className="auth-sub">
              Nhập email công ty của bạn. Hệ thống sẽ tự động khởi tạo mật khẩu mới và gửi trực tiếp về hộp thư Gmail của bạn.
            </p>

            {statusMsg && (
              <div style={{ background: '#E6F4EA', color: '#137333', padding: '14px', borderRadius: '6px', fontSize: '0.9rem', marginBottom: '16px', lineHeight: '1.5', border: '1px solid #CEEAD6' }}>
                📩 {statusMsg}
              </div>
            )}

            {error && <div className="form-error" role="alert" style={{ marginBottom: '16px' }}>⚠️ {error}</div>}

            <form onSubmit={handleForgotSubmit}>
              <div className="form-group">
                <label htmlFor="forgotEmail">Email công ty của bạn</label>
                <input
                  type="email"
                  id="forgotEmail"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  placeholder="VD: nhanvien@ctin.vn"
                  autoFocus
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => { setIsForgotMode(false); setError(''); setStatusMsg(''); }}
                  style={{ background: '#eee', color: '#333', padding: '10px 16px' }}
                >
                  ← Quay lại
                </button>
                <button type="submit" className="auth-btn" disabled={forgotSending} style={{ flex: 1, margin: 0 }}>
                  {forgotSending ? 'Đang gửi...' : '🔑 Gửi mật khẩu mới →'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ============================================================ */
          /* FORM ĐĂNG NHẬP (NORMAL LOGIN MODE)                           */
          /* ============================================================ */
          <div>
            <h2>Đăng nhập</h2>
            <p className="auth-sub">Dành cho CBNV đã được admin duyệt tài khoản.</p>

            {statusMsg && (
              <div style={{ background: '#e3f2fd', color: '#0d47a1', padding: '12px', borderRadius: '6px', fontSize: '0.88rem', marginBottom: '16px' }}>
                📩 {statusMsg}
              </div>
            )}

            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email công ty</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="nhanvien@ctin.vn"
                />
              </div>
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label htmlFor="password">Mật khẩu</label>
                  <button
                    type="button"
                    onClick={() => { setIsForgotMode(true); setForgotEmail(email); setError(''); setStatusMsg(''); }}
                    style={{ background: 'none', border: 'none', color: 'var(--clr-gold-dark, #0056b3)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 'bold', textDecoration: 'underline' }}
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
              </div>

              {error && <div className="form-error" role="alert">{error}</div>}

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
              </button>
            </form>
          </div>
        )}

        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          <Link to="/register" className="auth-link">Chưa có tài khoản? Đăng ký</Link>
          <Link to="/" className="auth-link auth-link--muted">← Về trang chủ</Link>
        </div>
      </div>
    </div>
  );
}

