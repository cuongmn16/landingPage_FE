/* ============================================================
   API SERVICE FOR SPRING BOOT BACKEND
   ============================================================ */

const rawApiBase = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE || '/api').replace(/\/$/, '');
const API_BASE = rawApiBase.endsWith('/api') ? rawApiBase : `${rawApiBase}/api`;

const LS_TOKEN = 'token';
const LS_REFRESH = 'refreshToken';
const LS_USER = 'user';
const LS_DEMO_SUBMISSIONS = 'ctin_demo_submissions';

const BUILT_IN_ACCOUNTS = {
  'user@ctin.vn': {
    pass: 'User@123',
    token: 'demo-user-token',
    raw: {
      employeeId: 9001,
      employeeCode: 'USER001',
      fullName: 'Người Chơi Thử Nghiệm',
      email: 'user@ctin.vn',
      role: 'ROLE_USER',
      unitName: 'Khối Công nghệ & Giải pháp',
      status: 'APPROVED'
    }
  },
  'admin@ctin.vn': {
    pass: 'Admin@123',
    token: 'demo-admin-token',
    raw: {
      employeeId: 1,
      employeeCode: 'ADMIN001',
      fullName: 'Quản Trị Viên BTC',
      email: 'admin@ctin.vn',
      role: 'ROLE_ADMIN',
      unitName: 'Ban Tổ Chức (BTC)',
      status: 'APPROVED'
    }
  }
};

function isDemoToken() {
  const t = localStorage.getItem(LS_TOKEN);
  return typeof t === 'string' && t.startsWith('demo-');
}

const NETWORK_ERROR_MSG = 'Không thể kết nối tới máy chủ. Vui lòng kiểm tra mạng và thử lại.';
const SESSION_EXPIRED_MSG = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';

/**
 * Normalizes user data from backend AuthResponse or Employee entity
 */
function normalizeUser(raw, token) {
  if (!raw) return null;
  return {
    id: raw.employeeId || raw.id,
    employee_id: raw.employeeCode || raw.employee_id || raw.employeeId,
    full_name: raw.fullName || raw.full_name || raw.name,
    email: raw.email,
    role: (raw.role || 'user').toLowerCase().includes('admin') ? 'admin' : 'user',
    unit: raw.unitName || raw.unit || 'CTIN',
    status: (raw.status || 'APPROVED').toLowerCase(),
    token: token || raw.accessToken || raw.token
  };
}

/**
 * Resolve relative backend file download URLs to full API_BASE URLs
 */
function resolveFileUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/api/')) return `${API_BASE}${url.substring(4)}`;
  if (url.startsWith('/')) return `${API_BASE}${url}`;
  return `${API_BASE}/${url}`;
}

/**
 * Normalizes submission item from backend SubmissionResponse
 */
function normalizeSubmission(s) {
  if (!s) return null;
  const rawStatus = (s.status || 'PENDING').toLowerCase();
  const mappedStatus = ['valid', 'invalid', 'needs_supplement'].includes(rawStatus) ? rawStatus : 'pending';

  const attachments = Array.isArray(s.attachments) && s.attachments.length > 0
    ? s.attachments.map(att => ({
        id: att.id,
        fileName: att.originalFileName || att.fileName || 'Tệp_đính_kèm',
        fileUrl: resolveFileUrl(att.fileUrl || att.url),
        fileSize: att.fileSizeBytes || att.size
      }))
    : (s.file_url ? [{ id: 1, fileName: 'Attachment_1', fileUrl: resolveFileUrl(s.file_url) }] : []);

  return {
    id: s.id,
    user_id: s.employeeId || s.user_id,
    mission_id: Number(s.missionId || s.mission_id),
    user_name: s.fullName || s.user_name || '—',
    user_unit: s.unitName || s.user_unit || s.unitCode || '—',
    user_email: s.email || s.user_email || '—',
    file_url: attachments.length > 0 ? attachments[0].fileUrl : null,
    attachments,
    note: s.longTextAnswer || s.evidenceSource || s.note || '',
    evidenceSource: s.evidenceSource || '',
    witnessName: s.witnessName || '',
    submitted_at: s.lastUpdatedAt || s.submissionTime || s.submitted_at || null,
    score: s.score != null ? s.score : null,
    status: mappedStatus,
    reopened: rawStatus === 'reopened'
  };
}

const MISSION_LABELS_OVERRIDE = {
  1: { title: 'NHIỆM VỤ 01 – BẢN ĐỒ HÀNH TRÌNH', description: 'Giải mã hành trình phát triển CTIN' },
  2: { title: 'NHIỆM VỤ 02 – CÂU CHUYỆN PHÍA SAU LỊCH SỬ', description: 'Kể lại những ký ức và câu chuyện của người CTIN' },
  3: { title: 'NHIỆM VỤ 03 – DẤU ẤN NGƯỜI DẪN ĐƯỜNG', description: 'Khám phá những quyết định, dấu ấn và phẩm chất lãnh đạo' },
  4: { title: 'NHIỆM VỤ 04 – BẢN SẮC CTIN', description: 'Từ những giá trị được gìn giữ đến Chương 26' }
};

function normalizeMission(m) {
  const override = MISSION_LABELS_OVERRIDE[Number(m.id)];
  return {
    id: m.id,
    code: m.code,
    title: override ? override.title : (m.title || `Mission ${m.id}`),
    description: override ? override.description : (m.description || ''),
    status: m.isOpen ? 'available' : 'locked',
    open_at: m.startTime || null,
    close_at: m.endTime || null
  };
}

export const auth = {
  user: null,

  async load() {
    const token = localStorage.getItem(LS_TOKEN);
    if (!token) return null;

    const savedUser = localStorage.getItem(LS_USER);
    if (savedUser) {
      try {
        this.user = JSON.parse(savedUser);
        return this.user;
      } catch {
        // fall through
      }
    }

    try {
      this.user = await api.me();
      return this.user;
    } catch {
      this.clear();
      return null;
    }
  },

  setSession(token, user, refreshToken) {
    const normalized = normalizeUser(user, token);
    localStorage.setItem(LS_TOKEN, token);
    if (refreshToken) localStorage.setItem(LS_REFRESH, refreshToken);
    localStorage.setItem(LS_USER, JSON.stringify(normalized));
    this.user = normalized;
  },

  clear() {
    localStorage.removeItem(LS_TOKEN);
    localStorage.removeItem(LS_REFRESH);
    localStorage.removeItem(LS_USER);
    this.user = null;
  },

  isLoggedIn() { return !!this.user; },
  isAdmin() { return !!this.user && this.user.role === 'admin'; },

  async logout() {
    try {
      await logoutApi();
    } catch {
      // ignore: session is cleared locally anyway
    }
    this.clear();
  }
};

/* ------------------------------------------------------------
   HTTP helpers
   ------------------------------------------------------------ */

let refreshPromise = null;

/**
 * Exchange the stored refresh token for a new access token (single-flight).
 */
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem(LS_REFRESH);
  if (!refreshToken) return false;

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
        if (!res.ok) return false;
        const json = await res.json();
        const data = json.data;
        auth.setSession(data.accessToken || data.token, data, data.refreshToken);
        return true;
      } catch {
        return false;
      } finally {
        setTimeout(() => { refreshPromise = null; }, 0);
      }
    })();
  }
  return refreshPromise;
}

/**
 * fetch() with Authorization header and one automatic token refresh on 401.
 */
async function authFetch(path, options = {}, { retry = true } = {}) {
  const token = localStorage.getItem(LS_TOKEN);
  const demo = isDemoToken();
  const headers = { ...(options.headers || {}) };
  if (token && !demo) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch {
    const err = new Error(NETWORK_ERROR_MSG);
    err.isNetworkError = true;
    throw err;
  }

  if (res.status === 401 && token && !demo && retry) {
    if (await refreshAccessToken()) {
      return authFetch(path, options, { retry: false });
    }
    auth.clear();
    const err = new Error(SESSION_EXPIRED_MSG);
    err.status = 401;
    throw err;
  }
  return res;
}

/**
 * Parse JSON body and throw an Error carrying the backend message on non-2xx.
 */
async function parseBackendResponse(res) {
  let json = {};
  try {
    json = await res.json();
  } catch {
    // empty / non-JSON body
  }

  if (!res.ok) {
    const msg = json.message || json.error || `Yêu cầu thất bại (Mã lỗi ${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.isBackendError = true;
    throw err;
  }
  return json;
}

async function request(path, options = {}) {
  const res = await authFetch(path, options);
  return parseBackendResponse(res);
}

/* ------------------------------------------------------------
   Auth & registration
   ------------------------------------------------------------ */

/**
 * Đăng xuất tài khoản (POST /api/auth/logout)
 */
export async function logoutApi() {
  if (!localStorage.getItem(LS_TOKEN) || isDemoToken()) return { message: 'Đăng xuất thành công' };
  const res = await authFetch('/auth/logout', { method: 'POST' }, { retry: false });
  return parseBackendResponse(res);
}

/**
 * Gửi mã OTP xác thực email (POST /api/auth/send-otp?email=...)
 */
export async function sendOtpApi(email) {
  return request(`/auth/send-otp?email=${encodeURIComponent(email)}`, { method: 'POST' });
}

/**
 * Xác thực mã OTP (POST /api/auth/verify-otp?email=...&otpCode=...)
 */
export async function verifyOtpApi(email, otpCode) {
  return request(`/auth/verify-otp?email=${encodeURIComponent(email)}&otpCode=${encodeURIComponent(otpCode)}`, { method: 'POST' });
}

/**
 * Đăng ký tài khoản nhân viên (POST /api/employees/register).
 * Email phải được xác thực OTP (verifyOtpApi) ngay trước đó.
 */
export async function registerEmployeeApi(payload) {
  const unitCode = payload.unitCode || payload.unit;

  const json = await request('/employees/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: payload.fullName || payload.full_name,
      email: payload.email,
      employeeCode: payload.employeeCode || payload.employee_id || '',
      unitCode,
      password: payload.password
    })
  });
  return json.data || { email: payload.email, message: json.message };
}

/**
 * Quên mật khẩu: cần mã OTP đã gửi tới email (POST /api/auth/forgot-password)
 */
export async function forgotPasswordApi(email, otpCode) {
  return request(`/auth/forgot-password?email=${encodeURIComponent(email)}&otpCode=${encodeURIComponent(otpCode)}`, { method: 'POST' });
}

/* ------------------------------------------------------------
   Submissions
   ------------------------------------------------------------ */

/**
 * Nộp bài Mission chi tiết với đa tệp. Người nộp được xác định từ JWT phía backend.
 */
export async function submitMissionResponseApi(payload, files = []) {
  if (isDemoToken()) {
    const rawList = localStorage.getItem(LS_DEMO_SUBMISSIONS);
    const list = rawList ? JSON.parse(rawList) : [];
    const missionId = Number(payload.missionId);
    const filtered = list.filter(item => Number(item.mission_id) !== missionId);
    const user = auth.user || { id: 9001, full_name: 'Người Chơi Thử Nghiệm', unit: 'Khối Công nghệ & Giải pháp', email: 'user@ctin.vn' };
    filtered.push({
      id: Date.now(),
      user_id: user.id,
      mission_id: missionId,
      user_name: user.full_name,
      user_unit: user.unit,
      user_email: user.email,
      file_url: null,
      attachments: (files || []).map((f, idx) => ({ id: idx + 1, fileName: f.name || `Tệp_${idx + 1}`, fileUrl: '', fileSize: f.size || 0 })),
      note: payload.longTextAnswer || payload.evidenceSource || '',
      evidenceSource: payload.evidenceSource || '',
      witnessName: payload.witnessName || '',
      submitted_at: new Date().toISOString(),
      score: 100,
      status: 'valid',
      reopened: false
    });
    localStorage.setItem(LS_DEMO_SUBMISSIONS, JSON.stringify(filtered));
    return { message: 'Nộp bài thành công!' };
  }

  const formData = new FormData();
  formData.append('submission', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
  (files || []).forEach(f => formData.append('files', f));

  const json = await request('/submissions', { method: 'POST', body: formData });
  return json.data || { message: 'Nộp bài thành công!' };
}

export async function fetchAllSubmissionsApi() {
  return api.getAllSubmissions();
}

export async function updateSubmissionStatusApi(subId, newStatus) {
  return api.scoreSubmission(subId, { status: newStatus.toLowerCase() });
}

export async function reopenSubmissionApi(subId) {
  if (isDemoToken()) return { message: 'Đã mở lại' };
  const json = await request(`/submissions/${subId}/reopen`, { method: 'PUT' });
  return json.data;
}

/* ------------------------------------------------------------
   Admin helpers
   ------------------------------------------------------------ */

export async function fetchAllEmployeesApi() {
  return api.getPendingUsers();
}

export async function fetchRuleConfigApi() {
  if (isDemoToken()) {
    return { ruleType: 'MIN_COMPLETED_MISSIONS', configValue: '1' };
  }
  const json = await request('/rule-config/valid-participant');
  return json.data;
}

export async function updateRuleConfigApi(data) {
  if (isDemoToken()) return data;
  const json = await request('/rule-config/valid-participant', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return json.data;
}

export async function getUnitsApi() {
  try {
    const json = await request('/employees/units');
    return Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

/** Đơn vị của BTC (admin) — không cho người dùng chọn khi đăng ký */
export const ADMIN_UNIT_CODE = 'PB_BTC';

/** Danh sách phòng ban cho form đăng ký: [{ code, name }] theo thứ tự hiển thị */
export async function getRegisterUnitsApi() {
  const units = await getUnitsApi();
  return units
    .filter(u => u.code !== ADMIN_UNIT_CODE)
    .map(u => ({ code: u.code, name: u.name }));
}

/* ------------------------------------------------------------
   Mission progress (bản nháp tiến trình chơi, lưu trên server)
   ------------------------------------------------------------ */

/**
 * Lấy tiến trình đã lưu của user hiện tại (GET /api/missions/{id}/progress).
 * Trả về { state, updatedAt } hoặc null nếu chưa có.
 */
export async function getMissionProgressApi(missionId) {
  if (isDemoToken()) {
    try {
      const saved = localStorage.getItem(`ctin_demo_progress_${missionId}`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }
  const json = await request(`/missions/${missionId}/progress`);
  const data = json.data;
  if (!data || !data.progressJson) return null;
  try {
    return { state: JSON.parse(data.progressJson), updatedAt: data.updatedAt };
  } catch {
    return null;
  }
}

/**
 * Lưu tiến trình (PUT /api/missions/{id}/progress)
 */
export async function saveMissionProgressApi(missionId, state) {
  if (isDemoToken()) {
    const record = { state, updatedAt: new Date().toISOString() };
    localStorage.setItem(`ctin_demo_progress_${missionId}`, JSON.stringify(record));
    return record;
  }
  const json = await request(`/missions/${missionId}/progress`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ progressJson: JSON.stringify(state) })
  });
  return json.data;
}

/* ------------------------------------------------------------
   Admin: quản lý đơn vị / phòng ban và quân số
   ------------------------------------------------------------ */

export async function getAdminUnitsApi() {
  if (isDemoToken()) {
    return getUnitsApi();
  }
  const json = await request('/units');
  return Array.isArray(json.data) ? json.data : [];
}

export async function createUnitApi(payload) {
  if (isDemoToken()) return { id: Date.now(), ...payload };
  const json = await request('/units', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return json.data;
}

export async function updateUnitApi(id, payload) {
  if (isDemoToken()) return { id, ...payload };
  const json = await request(`/units/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return json.data;
}

export async function deleteUnitApi(id) {
  if (isDemoToken()) return;
  await request(`/units/${id}`, { method: 'DELETE' });
}

export async function toggleMissionStatusApi(id, isOpen) {
  if (isDemoToken()) return { id, isOpen };
  const json = await request(`/missions/${id}/toggle?isOpen=${isOpen}`, { method: 'PUT' });
  return json.data;
}

/* ------------------------------------------------------------
   Main API object used by pages
   ------------------------------------------------------------ */

export const api = {
  async register(payload) {
    return registerEmployeeApi(payload);
  },

  /**
   * Đăng nhập (POST /api/auth/login)
   */
  async login(emailOrCode, password) {
    const cleanInput = (emailOrCode || '').trim().toLowerCase();
    const fallbackEntry =
      BUILT_IN_ACCOUNTS[cleanInput] ||
      (cleanInput === 'user001' ? BUILT_IN_ACCOUNTS['user@ctin.vn'] : null) ||
      (cleanInput === 'admin001' ? BUILT_IN_ACCOUNTS['admin@ctin.vn'] : null);

    try {
      const json = await request('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail: emailOrCode, password })
      });
      const authData = json.data;
      const user = normalizeUser(authData, authData.accessToken || authData.token);
      return { token: user.token, refreshToken: authData.refreshToken, user };
    } catch (err) {
      if (fallbackEntry) {
        const user = normalizeUser(fallbackEntry.raw, fallbackEntry.token);
        return { token: fallbackEntry.token, refreshToken: null, user };
      }
      throw err;
    }
  },

  /**
   * Thông tin user hiện tại (lưu trong localStorage sau khi đăng nhập)
   */
  async me() {
    const token = localStorage.getItem(LS_TOKEN);
    if (!token) throw new Error('Chưa đăng nhập');
    const savedUser = localStorage.getItem(LS_USER);
    if (savedUser) return JSON.parse(savedUser);
    throw new Error('Chưa đăng nhập');
  },

  /**
   * Danh sách Mission (GET /api/missions)
   */
  async getMissions() {
    try {
      const json = await request('/missions');
      return Array.isArray(json.data) ? json.data.map(normalizeMission) : [];
    } catch {
      return [1, 2, 3, 4].map(id => normalizeMission({ id, code: `M${id}`, isOpen: true }));
    }
  },

  /**
   * Chi tiết Mission theo ID
   */
  async getMission(id) {
    try {
      const json = await request(`/missions/${id}`);
      return normalizeMission(json.data);
    } catch {
      return normalizeMission({ id: Number(id), code: `M${id}`, isOpen: true });
    }
  },

  /**
   * Bài nộp của user hiện tại (GET /api/submissions/me)
   */
  async getUserSubmissions() {
    const user = auth.user;
    if (!user || user.role === 'admin') return [];
    if (isDemoToken()) {
      try {
        const raw = localStorage.getItem(LS_DEMO_SUBMISSIONS);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }
    const json = await request('/submissions/me');
    return Array.isArray(json.data) ? json.data.map(normalizeSubmission) : [];
  },

  /**
   * Nộp bài Mission (POST /api/submissions, multipart)
   */
  async submitMission(missionId, formDataOrPayload) {
    const user = auth.user;
    if (!user) throw new Error('Chưa đăng nhập');

    let note = '';
    const fileList = [];
    if (formDataOrPayload instanceof FormData) {
      note = formDataOrPayload.get('note') || '';
      const f = formDataOrPayload.get('file');
      if (f) fileList.push(f);
    } else {
      note = formDataOrPayload.note || '';
    }

    await submitMissionResponseApi({
      missionId: Number(missionId),
      longTextAnswer: note,
      evidenceSource: note,
      witnessName: ''
    }, fileList);
    return { message: 'Nộp bài thành công!' };
  },

  /**
   * Admin: danh sách nhân sự (GET /api/employees)
   */
  async getPendingUsers() {
    if (isDemoToken()) return [];
    const json = await request('/employees');
    return (Array.isArray(json.data) ? json.data : []).map(e => ({
      id: e.id,
      full_name: e.fullName || e.full_name,
      email: e.email,
      employee_id: e.employeeCode || e.employee_id,
      unit: e.unit ? (e.unit.name || e.unit.code) : (e.unitName || e.unitCode || '—'),
      approvalStatus: String(e.approvalStatus || e.status || 'PENDING').toUpperCase(),
      status: String(e.approvalStatus || e.status || 'PENDING').toLowerCase(),
      created_at: e.createdAt || null
    }));
  },

  /**
   * Admin: duyệt nhân sự (PUT /api/employees/{id}/approve)
   */
  async approveUser(id) {
    if (isDemoToken()) return { message: 'Phê duyệt tài khoản thành công!' };
    const json = await request(`/employees/${id}/approve`, { method: 'PUT' });
    return { message: json.message || 'Phê duyệt tài khoản thành công!' };
  },

  /**
   * Admin: từ chối nhân sự (DELETE /api/employees/{id}/reject?reason=...)
   */
  async rejectUser(id, payload = {}) {
    if (isDemoToken()) return { message: 'Đã từ chối tài khoản thành công.' };
    const reason = payload.reason ? `?reason=${encodeURIComponent(payload.reason)}` : '';
    await request(`/employees/${id}/reject${reason}`, { method: 'DELETE' });
    return { message: 'Đã từ chối tài khoản thành công.' };
  },

  /**
   * Admin: tất cả bài nộp (GET /api/submissions/all)
   */
  async getAllSubmissions() {
    if (isDemoToken()) {
      try {
        const raw = localStorage.getItem(LS_DEMO_SUBMISSIONS);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }
    const json = await request('/submissions/all');
    return Array.isArray(json.data) ? json.data.map(normalizeSubmission) : [];
  },

  /**
   * Admin: chấm điểm & đổi trạng thái bài nộp (PUT /api/submissions/{id}/status)
   */
  async scoreSubmission(id, payload) {
    if (isDemoToken()) return { message: 'Đã cập nhật bài nộp' };
    const statusMap = {
      valid: 'VALID',
      invalid: 'INVALID',
      needs_supplement: 'NEEDS_SUPPLEMENT',
      pending: 'PENDING',
      reopened: 'REOPENED'
    };
    const params = new URLSearchParams();
    if (payload.status && statusMap[payload.status]) params.set('status', statusMap[payload.status]);
    if (payload.score != null && payload.score !== '') params.set('score', String(payload.score));

    await request(`/submissions/${id}/status?${params.toString()}`, { method: 'PUT' });
    return { message: 'Đã cập nhật bài nộp' };
  },

  /**
   * Xếp hạng đơn vị theo tỷ lệ điểm (GET /api/leaderboard/units).
   */
  async getUnitProgress() {
    try {
      const json = await request('/leaderboard/units');
      return (Array.isArray(json.data) ? json.data : []).map((item, idx) => ({
        rank: item.rank || idx + 1,
        unit_id: item.unitId,
        unit_code: item.unitCode || '',
        unit_name: item.unitName || item.unitCode || '—',
        participant_count: item.validParticipantsCount || 0,
        total_personnel: item.totalPersonnel || 0,
        total_missions: item.totalMissions || 0,
        earned_points: item.earnedPoints || 0,
        max_points: item.maxPoints || 0,
        score_percent: item.scorePercent != null ? Number(item.scorePercent) : 0,
        last_updated_at: item.lastUpdatedAt || null
      }));
    } catch {
      return [];
    }
  },

  /**
   * Danh sách CBNV tham gia hợp lệ của một đơn vị (GET /api/leaderboard/units/{id}/participants)
   */
  async getUnitParticipants(unitId) {
    try {
      const json = await request(`/leaderboard/units/${unitId}/participants`);
      return (Array.isArray(json.data) ? json.data : []).map(item => ({
        employee_id: item.employeeId,
        full_name: item.fullName || '—',
        valid_submissions: item.validSubmissions || 0
      }));
    } catch {
      return [];
    }
  },

  /**
   * Xếp hạng cá nhân theo tổng điểm BTC đã chấm (GET /api/leaderboard/individuals?limit=).
   */
  async getIndividualLeaderboard(limit) {
    try {
      const query = limit != null ? `?limit=${limit}` : '';
      const json = await request(`/leaderboard/individuals${query}`);
      return (Array.isArray(json.data) ? json.data : []).map((item, idx) => ({
        rank: item.rank || idx + 1,
        employee_id: item.employeeId,
        full_name: item.fullName || '—',
        unit_name: item.unitName || item.unitCode || '—',
        total_score: item.totalScore != null ? Number(item.totalScore) : 0
      }));
    } catch {
      return [];
    }
  }
};
