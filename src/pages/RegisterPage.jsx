import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sendOtpApi, verifyOtpApi, registerEmployeeApi, getRegisterUnitsApi } from '../services/api';

export default function RegisterPage() {
  const [step, setStep] = useState(1); // 1: Form Info + Password, 2: OTP Verification, 3: Success Screen
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [unit, setUnit] = useState(''); // mã phòng ban (unit code)
  const [units, setUnits] = useState([]);
  const [unitsError, setUnitsError] = useState('');

  // Danh sách phòng ban do admin quản lý
  useEffect(() => {
    let cancelled = false;
    getRegisterUnitsApi()
      .then(list => { if (!cancelled) setUnits(list); })
      .catch(err => { if (!cancelled) setUnitsError(err.message || 'Không tải được danh sách phòng ban.'); });
    return () => { cancelled = true; };
  }, []);

  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [cooldown, setCooldown] = useState(0); // 60-second Rate Limiting Cooldown
  const [error, setError] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // Live 60-second countdown timer effect
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Step 1: Validate info (@ctin.vn + password) & Request OTP from backend
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setStatusMsg('');

    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.endsWith('@ctin.vn')) {
      setError('Email đăng ký bắt buộc phải có đuôi @ctin.vn (VD: nhanvien@ctin.vn).');
      return;
    }

    if (!password || password.trim().length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (cooldown > 0) {
      setError(`Vui lòng đợi ${cooldown}s trước khi yêu cầu gửi lại mã OTP.`);
      return;
    }

    setSendingOtp(true);

    try {
      const res = await sendOtpApi(cleanEmail);
      setStatusMsg(res?.message || `Mã OTP 6 số đã được gửi tới email ${cleanEmail}. Vui lòng kiểm tra hộp thư!`);
      setOtpVerified(false);
      setStep(2);
      setCooldown(60); // Activate 60s cooldown limit
    } catch (err) {
      setError(err.message || 'Không thể gửi mã OTP. Vui lòng kiểm tra lại Email.');
    } finally {
      setSendingOtp(false);
    }
  };

  // Step 2: Verify OTP code & Register user account
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setError('');
    setStatusMsg('');

    if (!otpCode || otpCode.trim().length !== 6) {
      setError('Vui lòng nhập đầy đủ 6 chữ số OTP.');
      return;
    }

    setVerifyingOtp(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      // 1. Verify OTP via backend API (/api/auth/verify-otp) — only once; the code is single-use
      if (!otpVerified) {
        await verifyOtpApi(cleanEmail, otpCode.trim());
        setOtpVerified(true);
      }

      // 2. Call backend register API (/api/employees/register) with user-chosen password
      await registerEmployeeApi({
        fullName: fullName.trim(),
        email: cleanEmail,
        employeeCode: employeeId.trim(),
        unitCode: unit,
        password: password.trim()
      });

      // 3. Move to Step 3: Success Screen
      setSuccess(true);
      setStep(3);
    } catch (err) {
      setError(err.message || 'Xác thực OTP hoặc đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <div className="auth-body">
      <div className="auth-container" style={{ maxWidth: '440px' }}>
        <Link to="/" className="auth-logo">
          <img src="/assets/ctin-logo.png" alt="CTIN" />
        </Link>
        <h2>Đăng ký tài khoản</h2>
        <p className="auth-sub">
          Sử dụng email công ty (@ctin.vn), tự tạo mật khẩu và xác thực mã OTP gửi về email để kích hoạt tài khoản ngay.
        </p>

        {/* Status / Notice Alert Banner */}
        {statusMsg && (
          <div style={{ background: '#e3f2fd', color: '#0d47a1', padding: '12px', borderRadius: '6px', fontSize: '0.88rem', marginBottom: '16px', lineHeight: '1.4' }}>
            📩 {statusMsg}
          </div>
        )}

        {/* Error Alert Banner */}
        {error && (
          <div className="form-error" role="alert" style={{ marginBottom: '16px' }}>
            ⚠️ {error}
          </div>
        )}

        {/* STEP 3: SUCCESS SCREEN */}
        {step === 3 || success ? (
          <div style={{ background: '#E6F4EA', color: '#137333', padding: '20px 16px', borderRadius: '8px', textAlign: 'center', margin: '20px 0', border: '1px solid #CEEAD6' }}>
            <p style={{ fontWeight: 'bold', fontSize: '1.05rem', margin: 0, color: '#137333' }}>
              ✅ Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay.
            </p>
            <div style={{ marginTop: '18px' }}>
              <Link to="/login" className="btn btn--gold" style={{ display: 'inline-block', width: '100%', padding: '12px 20px', fontSize: '0.95rem', fontWeight: 'bold' }}>
                Chuyển đến trang Đăng nhập →
              </Link>
            </div>
          </div>
        ) : step === 1 ? (
          /* STEP 1: Enter User Information, Password & Request OTP */
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label htmlFor="fullName">Họ và tên</label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="VD: Nguyễn Văn A"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email công ty (@ctin.vn)</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="VD: nhanvien@ctin.vn"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mật khẩu tự tạo (tối thiểu 6 ký tự)</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Nhập mật khẩu..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Nhập lại mật khẩu..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="employeeId">Mã nhân viên (không bắt buộc)</label>
              <input
                type="text"
                id="employeeId"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="VD: CT001"
              />
            </div>

            <div className="form-group">
              <label htmlFor="unit">Phòng ban</label>
              <select
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                required
              >
                <option value="">{units.length ? '— Chọn phòng ban —' : 'Đang tải danh sách phòng ban…'}</option>
                {units.map(u => (
                  <option key={u.code} value={u.code}>{u.name}</option>
                ))}
              </select>
              {unitsError && <p className="form-error" style={{ marginTop: '6px' }}>{unitsError}</p>}
            </div>

            <button type="submit" className="auth-btn" disabled={sendingOtp || cooldown > 0} style={{ marginTop: '8px' }}>
              {sendingOtp ? 'Đang gửi mã OTP...' : cooldown > 0 ? `⏳ Đợi ${cooldown}s` : '📩 Gửi mã OTP xác thực Email →'}
            </button>
          </form>
        ) : (
          /* STEP 2: Enter 6-digit OTP Code (ô nhập OTP) */
          <form onSubmit={handleVerifyAndRegister}>
            <div className="form-group" style={{ textAlign: 'center' }}>
              <label htmlFor="otpCode" style={{ display: 'block', fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '8px' }}>
                🔑 Ô NHẬP MÃ OTP 6 SỐ
              </label>
              <p style={{ fontSize: '0.82rem', color: '#666', marginBottom: '12px' }}>
                Mã OTP đã được gửi đến email <strong style={{ color: '#000' }}>{email}</strong>
              </p>
              <input
                type="text"
                id="otpCode"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                required
                placeholder="------"
                autoFocus
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '6px',
                  border: '2px solid var(--clr-gold)',
                  fontSize: '1.6rem',
                  letterSpacing: '10px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: '#111',
                  backgroundColor: '#fff'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '0.8rem', color: '#666' }}>
                <span>Mã OTP có hiệu lực trong 5 phút</span>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={sendingOtp || cooldown > 0}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: cooldown > 0 ? '#aaa' : '#0056b3',
                    cursor: cooldown > 0 ? 'not-allowed' : 'pointer',
                    textDecoration: cooldown > 0 ? 'none' : 'underline',
                    padding: 0
                  }}
                >
                  {cooldown > 0 ? `⏳ Gửi lại mã sau ${cooldown}s` : '🔄 Gửi lại mã OTP'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button
                type="button"
                className="btn"
                onClick={() => { setStep(1); setError(''); setStatusMsg(''); }}
                style={{ background: '#eee', color: '#333', padding: '10px 16px' }}
              >
                ← Sửa thông tin
              </button>
              <button
                type="submit"
                className="auth-btn"
                disabled={verifyingOtp}
                style={{ flex: 1, margin: 0 }}
              >
                {verifyingOtp ? 'Đang xác thực & Đăng ký...' : '✅ Xác nhận OTP & Đăng ký'}
              </button>
            </div>
          </form>
        )}

        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          <Link to="/login" className="auth-link">Đã có tài khoản? Đăng nhập</Link>
          <Link to="/" className="auth-link auth-link--muted">← Về trang chủ</Link>
        </div>
      </div>
    </div>
  );
}
