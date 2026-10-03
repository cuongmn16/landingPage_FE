import React, { useState, useEffect } from 'react';
import { registerEmployeeApi, sendOtpApi, verifyOtpApi } from '../../services/api';

export default function RegisterModal({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Enter OTP & Complete Register
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [unitCode, setUnitCode] = useState('PB_IT');
  const [otpCode, setOtpCode] = useState('');

  const [sendingOtp, setSendingOtp] = useState(false);
  const [cooldown, setCooldown] = useState(0); // 60s Rate Limiting Cooldown
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

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

  if (!isOpen) return null;

  // Step 1: Send OTP to user's email with Rate Limit Check
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Vui lòng nhập địa chỉ Email hợp lệ.');
      return;
    }

    if (cooldown > 0) {
      setErrorMessage(`Vui lòng đợi ${cooldown}s trước khi gửi lại mã OTP .`);
      return;
    }

    setSendingOtp(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      await sendOtpApi(email.trim());
      setStatusMessage(`📩 Mã OTP 6 số đã được gửi tới email ${email}. Vui lòng kiểm tra hộp thư!`);
      setStep(2);
      setCooldown(60); // Activate 60s cooldown limit
    } catch (err) {
      console.error('Send OTP error:', err);
      setErrorMessage(err.message || 'Không thể gửi mã OTP. Vui lòng kiểm tra lại địa chỉ Email.');
    } finally {
      setSendingOtp(false);
    }
  };

  // Step 2: Verify OTP and Register user
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      setErrorMessage('Vui lòng nhập đầy đủ 6 chữ số OTP.');
      return;
    }

    setSubmitting(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      // 1. Verify OTP with backend
      await verifyOtpApi(email.trim(), otpCode.trim());

      // 2. Build registration payload
      const emailPrefix = email.split('@')[0].toUpperCase();
      const derivedEmployeeCode = 'NV_' + emailPrefix.replace(/[^A-Z0-9]/g, '');

      const payload = {
        employeeCode: derivedEmployeeCode,
        email: email.trim(),
        fullName: fullName.trim() || emailPrefix,
        unitCode,
        emailVerified: true
      };

      // 3. Register user request
      const registeredEmployee = await registerEmployeeApi(payload);

      setStep(3);
      if (onSuccess) onSuccess(registeredEmployee);

    } catch (err) {
      console.error('Verify & Register error:', err);
      setErrorMessage(err.message || 'Xác thực OTP hoặc Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetModal = () => {
    setStep(1);
    setOtpCode('');
    setStatusMessage(null);
    setErrorMessage(null);
  };

  return (
    <div className={`modal modal--submission ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen} role="dialog">
      <div className="modal__backdrop" onClick={onClose}></div>
      <div className="modal__panel" style={{ maxWidth: '520px' }}>
        <button className="modal__close" onClick={onClose} aria-label="Đóng">&times;</button>

        <div style={{ padding: '12px 4px' }}>
          <div style={{ marginBottom: '16px' }}>
            <span className="mono" style={{ color: 'var(--clr-gold)', fontSize: '0.85rem' }}>
              EMAIL VERIFICATION (WITH RATE LIMITING)
            </span>
            <h2 style={{ fontSize: '1.4rem', marginTop: '4px' }}>Đăng ký tài khoản cá nhân</h2>
            <p style={{ color: 'var(--clr-ink-2)', fontSize: '0.85rem' }}>
              Xác minh địa chỉ Email thực tế qua mã OTP 6 số trước khi gửi yêu cầu tới Admin phê duyệt.
            </p>
          </div>

          {/* Stepper indicator */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <div style={{
              flex: 1, height: '4px', borderRadius: '2px',
              backgroundColor: step >= 1 ? 'var(--clr-gold)' : '#ddd'
            }} />
            <div style={{
              flex: 1, height: '4px', borderRadius: '2px',
              backgroundColor: step >= 2 ? 'var(--clr-gold)' : '#ddd'
            }} />
          </div>

          {statusMessage && (
            <div style={{ padding: '12px', background: '#d4edda', color: '#155724', borderRadius: '6px', marginBottom: '14px', fontSize: '0.88rem', lineHeight: '1.4' }}>
              {statusMessage}
            </div>
          )}

          {errorMessage && (
            <div style={{ padding: '12px', background: '#f8d7da', color: '#721c24', borderRadius: '6px', marginBottom: '14px', fontSize: '0.88rem' }}>
              ⚠️ {errorMessage}
            </div>
          )}

          {step === 3 ? (
            /* STEP 3: Success Screen (Matches user screenshot) */
            <div style={{ background: '#E6F4EA', color: '#137333', padding: '20px 16px', borderRadius: '8px', textAlign: 'center', margin: '16px 0', border: '1px solid #CEEAD6' }}>
              <p style={{ fontWeight: 'bold', fontSize: '1.05rem', margin: 0, color: '#137333' }}>
                Đăng ký thành công, chờ admin duyệt
              </p>
              <div style={{ marginTop: '18px' }}>
                <a href="/login" className="btn btn--gold" style={{ display: 'inline-block', width: '100%', padding: '12px 20px', fontSize: '0.95rem', fontWeight: 'bold', textDecoration: 'none' }}>
                  Chuyển đến trang Đăng nhập →
                </a>
              </div>
            </div>
          ) : step === 1 ? (
            /* STEP 1: Enter email info & Request OTP */
            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>
                  📧 Email công ty của bạn:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="VD: nhanvien@ctin.vn"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>
                  Họ và tên:
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="VD: Nguyễn Văn A"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>
                  Đơn vị / Phòng ban:
                </label>
                <select
                  value={unitCode}
                  onChange={(e) => setUnitCode(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                >
                  <option value="PB_IT">Phòng Kỹ thuật &amp; CNTT (PB_IT)</option>
                  <option value="PB_HR">Phòng Nhân sự (PB_HR)</option>
                  <option value="PB_KD">Phòng Kinh doanh (PB_KD)</option>
                  <option value="PB_KT">Phòng Tài chính Kế toán (PB_KT)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn" onClick={onClose} style={{ background: '#eee', color: '#333' }}>
                  Hủy
                </button>
                <button type="submit" className="btn btn--gold" disabled={sendingOtp || cooldown > 0}>
                  {sendingOtp ? 'Đang gửi mã OTP...' : cooldown > 0 ? `⏳ Vui lòng đợi ${cooldown}s` : '📩 Gửi mã OTP xác thực Email →'}
                </button>
              </div>
            </form>
          ) : (
            /* STEP 2: Enter 6-digit OTP code */
            <form onSubmit={handleVerifyAndRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>
                  🔑 Nhập mã OTP 6 số đã gửi tới <span style={{ color: 'var(--clr-gold)' }}>{email}</span>:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  required
                  placeholder="------"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '2px solid var(--clr-gold)',
                    fontSize: '1.4rem',
                    letterSpacing: '8px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: '#111'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.8rem', color: '#666' }}>
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
                      textDecoration: cooldown > 0 ? 'none' : 'underline'
                    }}
                  >
                    {cooldown > 0 ? `⏳ Gửi lại mã sau ${cooldown}s` : '🔄 Gửi lại mã OTP'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn" onClick={handleResetModal} style={{ background: '#eee', color: '#333' }}>
                  ← Quay lại
                </button>
                <button type="submit" className="btn btn--gold" disabled={submitting}>
                  {submitting ? 'Đang xác thực & đăng ký...' : '✅ Xác thực OTP & Gửi Đăng ký →'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
