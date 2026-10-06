/* ============================================================
   MOCK API SERVICE — localStorage backed mock backend
   ============================================================ */

const LS = {
  users:       'mock_users',
  submissions: 'mock_submissions',
  missions:    'mock_missions',
  session:     'mock_session'
};

const read  = (k, d = []) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const delay = (ms = 200) => new Promise(r => setTimeout(r, ms));

export function seedMockData() {
  if (!localStorage.getItem(LS.users)) {
    write(LS.users, [
      { id: 1, full_name: 'Admin BTC', email: 'admin@ctin.vn', employee_id: 'ADMIN01', unit: 'Ban Tổ chức',
        password: 'admin123', role: 'admin', status: 'approved', created_at: new Date().toISOString() },
      { id: 2, full_name: 'Nguyễn Văn A', email: 'a@ctin.vn', employee_id: 'CT001', unit: 'Phòng Kỹ thuật',
        password: 'user123', role: 'user', status: 'approved', created_at: new Date().toISOString() },
      { id: 3, full_name: 'Trần Thị B', email: 'b@ctin.vn', employee_id: 'CT002', unit: 'Phòng Kinh doanh',
        password: 'user123', role: 'user', status: 'approved', created_at: new Date().toISOString() },
      { id: 4, full_name: 'Lê Văn C', email: 'c@ctin.vn', employee_id: 'CT003', unit: 'Phòng Nhân sự',
        password: null, role: 'user', status: 'pending', created_at: new Date().toISOString() },
      { id: 5, full_name: 'Phạm Thị D', email: 'd@ctin.vn', employee_id: 'CT004', unit: 'Phòng CNTT',
        password: null, role: 'user', status: 'pending', created_at: new Date().toISOString() }
    ]);
  }
  if (!localStorage.getItem(LS.missions)) {
    write(LS.missions, [
      { id: 1, title: 'JOURNEY MAP',          description: 'Ghép thời gian, bước ngoặt, vật chứng và tiếng nói nhân chứng.', status: 'available', open_at: '2026-10-16T08:00:00+07:00', close_at: '2026-11-19T23:59:59+07:00' },
      { id: 2, title: 'LEGACY STORIES',       description: 'Kể, xác nhận hoặc bổ sung một câu chuyện phía sau lịch sử chính thức.', status: 'locked', open_at: '2026-10-23T08:00:00+07:00', close_at: '2026-10-29T23:59:59+07:00' },
      { id: 3, title: 'LEADERSHIP LEGACIES',  description: 'Khám phá quyết định, phẩm chất và di sản lãnh đạo.', status: 'locked', open_at: '2026-10-30T08:00:00+07:00', close_at: '2026-11-05T23:59:59+07:00' },
      { id: 4, title: 'CTIN DNA',             description: 'Xác định điều cần gìn giữ, điều cần phát triển và Future Promise.', status: 'locked', open_at: '2026-11-06T08:00:00+07:00', close_at: '2026-11-12T23:59:59+07:00' }
    ]);
  }
  if (!localStorage.getItem(LS.submissions)) {
    write(LS.submissions, [
      { id: 1, user_id: 2, mission_id: 1, file_url: 'https://example.com/journeymap-a.pdf', note: 'Bài nộp của Nguyễn Văn A', submitted_at: new Date().toISOString(), score: 85,  status: 'valid' },
      { id: 2, user_id: 3, mission_id: 1, file_url: 'https://example.com/journeymap-b.pdf', note: 'Bài nộp của Trần Thị B', submitted_at: new Date().toISOString(), score: 100, status: 'valid' }
    ]);
  }
}

seedMockData();

export const mockApi = {
  async sendOtp(email) {
    await delay(300);
    localStorage.setItem('mock_otp_' + email.trim().toLowerCase(), '123456');
    return { status: 200, message: `Mã OTP 6 số đã được gửi tới email ${email}. (Mã OTP thử nghiệm: 123456 - Bật backend server để gửi email Gmail thực tế)` };
  },

  async verifyOtp(email, otpCode) {
    await delay(300);
    const mockOtp = localStorage.getItem('mock_otp_' + email.trim().toLowerCase()) || '123456';
    if (otpCode.trim() !== mockOtp && otpCode.trim() !== '123456') {
      throw new Error('Mã OTP không chính xác. Vui lòng kiểm tra lại.');
    }
    return { status: 200, message: 'Xác thực OTP thành công!', data: true };
  },

  async register(payload) {
    await delay();
    const users = read(LS.users);
    if (users.some(u => u.email === payload.email)) {
      throw new Error('Email đã tồn tại');
    }
    const newUser = {
      id: Math.max(...users.map(u => u.id), 0) + 1,
      full_name: payload.full_name || payload.fullName,
      email: payload.email,
      employee_id: payload.employee_id || payload.employeeId || payload.employeeCode,
      unit: payload.unit || payload.unitCode || 'Phòng CNTT',
      password: null,
      role: 'user',
      status: 'pending',
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    write(LS.users, users);
    return { message: 'Đăng ký thành công, chờ admin duyệt', email: payload.email };
  },

  async login(email, password) {
    await delay();
    const users = read(LS.users);
    const u = users.find(x => (x.email === email || x.employee_id === email) && x.password === password);
    if (!u) throw new Error('Email hoặc mật khẩu không đúng');
    if (u.status !== 'approved') throw new Error('Tài khoản chưa được duyệt');
    const token = 'mock-token-' + u.id;
    return { token, user: u };
  },

  async me(token) {
    await delay(100);
    if (!token) throw new Error('Chưa đăng nhập');
    const users = read(LS.users);
    const u = users.find(x => 'mock-token-' + x.id === token);
    if (!u) throw new Error('Token không hợp lệ');
    return u;
  },

  async getMissions() {
    await delay(100);
    return read(LS.missions);
  },

  async getMission(id) {
    await delay(100);
    const m = read(LS.missions).find(x => Number(x.id) === Number(id));
    if (!m) throw new Error('Không tìm thấy Mission');
    return m;
  },

  async getUserSubmissions(userId) {
    await delay(150);
    const users = read(LS.users);
    const targetUser = users.find(u => u.id === Number(userId));
    if (targetUser && targetUser.role === 'admin') return [];
    const submissions = read(LS.submissions);
    return submissions.filter(s => s.user_id === Number(userId));
  },

  async submitMission(missionId, userId, { file, note }) {
    await delay(300);
    const submissions = read(LS.submissions);
    const existing = submissions.find(s => s.user_id === userId && Number(s.mission_id) === Number(missionId));
    let file_url = 'https://example.com/mock-upload.pdf';
    if (file && file.name) {
      file_url = `https://example.com/mock-${file.name}`;
    }
    if (existing) {
      existing.file_url = file_url;
      existing.note = note || '';
      existing.submitted_at = new Date().toISOString();
      existing.score = null;
      existing.status = 'pending';
      existing.graded_at = null;
    } else {
      submissions.push({
        id: Math.max(...submissions.map(s => s.id), 0) + 1,
        user_id: userId,
        mission_id: Number(missionId),
        file_url,
        note: note || '',
        submitted_at: new Date().toISOString(),
        score: null,
        status: 'pending'
      });
    }
    write(LS.submissions, submissions);
    return { message: 'Nộp bài thành công' };
  },

  async getPendingUsers() {
    await delay(150);
    const users = read(LS.users);
    return users.filter(u => u.role !== 'admin');
  },

  async approveUser(id) {
    await delay(200);
    const users = read(LS.users);
    const u = users.find(x => x.id === Number(id));
    if (!u) throw new Error('Không tìm thấy user');
    u.status = 'approved';
    u.password = 'ctin' + Math.floor(1000 + Math.random() * 9000);
    u.approved_at = new Date().toISOString();
    write(LS.users, users);
    return { message: `Đã duyệt ${u.email}. Mật khẩu tạm: ${u.password}`, password: u.password };
  },

  async rejectUser(id, reason) {
    await delay(200);
    const users = read(LS.users);
    const u = users.find(x => x.id === Number(id));
    if (!u) throw new Error('Không tìm thấy user');
    u.status = 'rejected';
    u.reject_reason = reason;
    write(LS.users, users);
    return { message: 'Đã từ chối' };
  },

  async getAllSubmissions() {
    await delay(200);
    const users = read(LS.users);
    const missions = read(LS.missions);
    const submissions = read(LS.submissions);
    return submissions.map(s => {
      const u = users.find(x => x.id === s.user_id);
      const m = missions.find(x => x.id === s.mission_id);
      return {
        ...s,
        status: s.status || 'pending',
        user_name: u?.full_name || '—',
        user_unit: u?.unit || '—',
        user_email: u?.email || '—',
        mission_title: m?.title || `Mission ${s.mission_id}`
      };
    });
  },

  async scoreSubmission(id, { score, status }) {
    await delay(200);
    const submissions = read(LS.submissions);
    const s = submissions.find(x => x.id === Number(id));
    if (!s) throw new Error('Không tìm thấy bài nộp');
    if (score !== undefined && score !== null && score !== '') {
      const val = Number(score);
      if (isNaN(val) || val < 0 || val > 100) throw new Error('Điểm không hợp lệ (0–100)');
      s.score = val;
    }
    if (status) {
      s.status = status;
    }
    s.graded_at = new Date().toISOString();
    write(LS.submissions, submissions);
    return { message: 'Đã cập nhật bài nộp' };
  },

  // Same shape as api.getLeaderboard(): units ranked by valid-participant rate
  async getLeaderboard() {
    await delay(200);
    const users = read(LS.users).filter(u => u.role !== 'admin');
    const submissions = read(LS.submissions);
    const byUnit = {};

    users.forEach(u => {
      const key = u.unit || '—';
      if (!byUnit[key]) {
        byUnit[key] = { unit_id: key, unit_code: key, unit_name: key, valid_count: 0, total_personnel: 0, rate: 0, last_updated_at: null };
      }
      byUnit[key].total_personnel += 1;
      const hasValid = submissions.some(s => s.user_id === u.id && ['valid', 'pending'].includes(s.status || 'pending'));
      if (hasValid) byUnit[key].valid_count += 1;
    });

    return Object.values(byUnit)
      .map(r => ({ ...r, rate: r.total_personnel ? Math.round((r.valid_count / r.total_personnel) * 10000) / 100 : 0 }))
      .sort((a, b) => b.rate - a.rate || b.valid_count - a.valid_count);
  }
};
