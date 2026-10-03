/* ============================================================
   API SERVICE FOR SPRING BOOT BACKEND & MOCK FALLBACK
   ============================================================ */

import { mockApi } from './mockApi';
import { CONFIG } from '../data/appData';

const API_BASE = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE || '/api').replace(/\/$/, '');

/**
 * Helper to get Auth Header
 */
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  }
  return {};
}

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
 * Normalizes submission item from backend SubmissionResponse
 */
function normalizeSubmission(s) {
  if (!s) return null;
  const rawStatus = (s.status || 'PENDING').toLowerCase();
  let mappedStatus = rawStatus;
  if (rawStatus === 'valid') mappedStatus = 'valid';
  else if (rawStatus === 'invalid') mappedStatus = 'invalid';
  else if (rawStatus === 'needs_supplement') mappedStatus = 'needs_supplement';
  else mappedStatus = 'pending';

  const attachments = Array.isArray(s.attachments) && s.attachments.length > 0
    ? s.attachments.map(att => ({
        id: att.id,
        fileName: att.originalFileName || att.fileName || 'Tệp_đính_kèm',
        fileUrl: att.fileUrl || att.url,
        fileSize: att.fileSizeBytes || att.size
      }))
    : (s.fileUrls && s.fileUrls.length > 0)
      ? s.fileUrls.map((url, idx) => ({ id: idx, fileName: `Attachment_${idx + 1}`, fileUrl: url }))
      : (s.file_url ? [{ id: 1, fileName: 'Attachment_1', fileUrl: s.file_url }] : []);

  const fileUrl = attachments.length > 0 ? attachments[0].fileUrl : (s.file_url || null);

  return {
    id: s.id,
    user_id: s.employeeId || s.user_id,
    mission_id: Number(s.missionId || s.mission_id),
    user_name: s.employeeFullName || s.user_name || s.fullName || '—',
    user_unit: s.unitName || s.user_unit || s.unitCode || '—',
    user_email: s.employeeEmail || s.user_email || s.email || '—',
    file_url: fileUrl,
    attachments: attachments,
    note: s.longTextAnswer || s.evidenceSource || s.note || '',
    submitted_at: s.createdAt || s.submissionTime || s.submitted_at || new Date().toISOString(),
    score: s.score != null ? s.score : null,
    status: mappedStatus
  };
}

export const auth = {
  user: null,

  async load() {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!token) return null;

    if (savedUser) {
      try {
        this.user = JSON.parse(savedUser);
        return this.user;
      } catch (e) {}
    }

    try {
      this.user = await api.me();
      return this.user;
    } catch {
      this.clear();
      return null;
    }
  },

  setSession(token, user) {
    const normalized = normalizeUser(user, token);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(normalized));
    this.user = normalized;
  },

  clear() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.user = null;
  },

  isLoggedIn() { return !!this.user; },
  isAdmin() { return this.user && this.user.role === 'admin'; },

  logout() {
    this.clear();
  }
};

/**
 * Gửi mã OTP xác thực email (POST /api/auth/send-otp?email=...)
 */
export async function sendOtpApi(email) {
  if (CONFIG.USE_MOCK) return mockApi.sendOtp(email);

  try {
    const res = await fetch(`${API_BASE}/auth/send-otp?email=${encodeURIComponent(email)}`, {
      method: 'POST'
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Không thể gửi mã OTP. Vui lòng kiểm tra lại địa chỉ email.');
    return json;
  } catch (err) {
    console.warn('[API] Real backend send OTP failed, using mock fallback:', err.message);
    return mockApi.sendOtp(email);
  }
}

/**
 * Xác thực mã OTP (POST /api/auth/verify-otp?email=...&otpCode=...)
 */
export async function verifyOtpApi(email, otpCode) {
  if (CONFIG.USE_MOCK) return mockApi.verifyOtp(email, otpCode);

  try {
    const res = await fetch(`${API_BASE}/auth/verify-otp?email=${encodeURIComponent(email)}&otpCode=${encodeURIComponent(otpCode)}`, {
      method: 'POST'
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Mã OTP không chính xác hoặc đã hết hạn.');
    return json;
  } catch (err) {
    console.warn('[API] Real backend verify OTP failed, using mock fallback:', err.message);
    return mockApi.verifyOtp(email, otpCode);
  }
}

/**
 * Đăng ký tài khoản nhân viên (POST /api/employees/register)
 */
export async function registerEmployeeApi(payload) {
  const unitMap = {
    'Phòng CNTT': 'PB_IT',
    'Phòng Kỹ thuật': 'PB_IT',
    'Phòng Nhân sự': 'PB_HR',
    'Phòng Kinh doanh': 'PB_KD',
    'Phòng Tài chính – Kế toán': 'PB_KT',
    'Ban Giám đốc': 'PB_BTC',
    'Ban Tổ chức': 'PB_BTC'
  };

  const rawUnit = payload.unitCode || payload.unit || 'PB_IT';
  const unitCode = unitMap[rawUnit] || rawUnit;

  if (CONFIG.USE_MOCK) return mockApi.register({ ...payload, unitCode });

  try {
    const res = await fetch(`${API_BASE}/employees/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: payload.fullName || payload.full_name,
        email: payload.email,
        employeeCode: payload.employeeCode || payload.employee_id,
        unitCode: unitCode,
        emailVerified: payload.emailVerified !== undefined ? payload.emailVerified : true
      })
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Lỗi khi đăng ký tài khoản');
    return json.data || { email: payload.email, message: json.message || 'Đăng ký thành công, chờ admin duyệt' };
  } catch (err) {
    console.warn('[API] Real backend register failed, using mock fallback:', err.message);
    return mockApi.register({ ...payload, unitCode });
  }
}

/**
 * Nộp bài Mission chi tiết với đa tệp
 */
export async function submitMissionResponseApi(payload, files = []) {
  if (CONFIG.USE_MOCK) {
    const user = auth.user;
    return mockApi.submitMission(payload.missionId, user ? user.id : 1, {
      note: payload.longTextAnswer || payload.evidenceSource || '',
      file: files.length > 0 ? files[0] : null
    });
  }

  try {
    const formData = new FormData();
    formData.append('submission', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    if (files && files.length > 0) {
      files.forEach(f => formData.append('files', f));
    }

    const res = await fetch(`${API_BASE}/submissions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Lỗi nộp bài');
    return json.data || { message: 'Nộp bài thành công!' };
  } catch (err) {
    console.warn('[API] submitMissionResponseApi failed, using mock:', err.message);
    const user = auth.user;
    return mockApi.submitMission(payload.missionId, user ? user.id : 1, {
      note: payload.longTextAnswer || payload.evidenceSource || '',
      file: files.length > 0 ? files[0] : null
    });
  }
}

export async function fetchAllSubmissionsApi() {
  return api.getAllSubmissions();
}

export async function fetchAllEmployeesApi() {
  if (CONFIG.USE_MOCK) return mockApi.getPendingUsers();
  try {
    const res = await fetch(`${API_BASE}/employees`, { headers: getAuthHeaders() });
    const json = await res.json();
    if (res.ok && Array.isArray(json.data)) return json.data;
    return mockApi.getPendingUsers();
  } catch (err) {
    return mockApi.getPendingUsers();
  }
}

export async function fetchRuleConfigApi() {
  if (CONFIG.USE_MOCK) return { ruleType: 'MIN_COMPLETED_MISSIONS', configValue: '1' };
  try {
    const res = await fetch(`${API_BASE}/rule-config/valid-participant`, { headers: getAuthHeaders() });
    const json = await res.json();
    if (res.ok && json.data) return json.data;
    return { ruleType: 'MIN_COMPLETED_MISSIONS', configValue: '1' };
  } catch (err) {
    return { ruleType: 'MIN_COMPLETED_MISSIONS', configValue: '1' };
  }
}

export async function updateRuleConfigApi(data) {
  if (CONFIG.USE_MOCK) return data;
  try {
    const res = await fetch(`${API_BASE}/rule-config/valid-participant`, {
      method: 'PUT',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Lỗi khi cập nhật quy tắc');
    return json.data;
  } catch (err) {
    console.warn('[API] Real backend update rule failed:', err.message);
    return data;
  }
}

export async function updateSubmissionStatusApi(subId, newStatus) {
  return api.scoreSubmission(subId, { status: newStatus.toLowerCase() });
}

export async function reopenSubmissionApi(subId) {
  if (CONFIG.USE_MOCK) return mockApi.scoreSubmission(subId, { status: 'reopened' });
  try {
    const res = await fetch(`${API_BASE}/submissions/${subId}/reopen`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Lỗi mở lại bài nộp');
    return json.data;
  } catch (err) {
    return mockApi.scoreSubmission(subId, { status: 'reopened' });
  }
}

export async function forgotPasswordApi(email) {
  if (CONFIG.USE_MOCK) return { message: `Mật khẩu mới đã được gửi về email ${email}` };
  try {
    const res = await fetch(`${API_BASE}/auth/forgot-password?email=${encodeURIComponent(email)}`, {
      method: 'POST'
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Không thể đặt lại mật khẩu.');
    return json;
  } catch (err) {
    console.warn('[API] Real backend forgot password failed:', err.message);
    throw err;
  }
}

export async function getUnitsApi() {
  if (CONFIG.USE_MOCK) return CONFIG.UNITS;
  try {
    const res = await fetch(`${API_BASE}/employees/units`);
    const json = await res.json();
    if (res.ok && Array.isArray(json.data)) return json.data;
    return CONFIG.UNITS;
  } catch (err) {
    return CONFIG.UNITS;
  }
}

export async function toggleMissionStatusApi(id, isOpen) {
  if (CONFIG.USE_MOCK) return { id, isOpen };
  try {
    const res = await fetch(`${API_BASE}/missions/${id}/toggle?isOpen=${isOpen}`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Lỗi cập nhật trạng thái Mission');
    return json.data;
  } catch (err) {
    return { id, isOpen };
  }
}

export const api = {
  /**
   * Đăng ký nhân sự mới
   */
  async register(payload) {
    return registerEmployeeApi(payload);
  },

  /**
   * Đăng nhập (Spring Boot POST /api/auth/login)
   */
  async login(emailOrCode, password) {
    if (CONFIG.USE_MOCK) return mockApi.login(emailOrCode, password);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usernameOrEmail: emailOrCode,
          password: password
        })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Email/Mã NV hoặc mật khẩu không đúng');

      const authData = json.data;
      const user = normalizeUser(authData, authData.accessToken || authData.token);
      return { token: user.token, user };
    } catch (err) {
      console.warn('[API] Real backend login failed, trying mock fallback:', err.message);
      return mockApi.login(emailOrCode, password);
    }
  },

  /**
   * Lấy thông tin user hiện tại
   */
  async me() {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (!token) throw new Error('Chưa đăng nhập');

    if (CONFIG.USE_MOCK) return mockApi.me(token);

    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {}
    }
    return mockApi.me(token);
  },

  /**
   * Lấy danh sách Mission (Spring Boot GET /api/missions)
   */
  async getMissions() {
    if (CONFIG.USE_MOCK) return mockApi.getMissions();

    try {
      const res = await fetch(`${API_BASE}/missions`, {
        headers: getAuthHeaders()
      });
      const json = await res.json();
      if (res.ok && Array.isArray(json.data) && json.data.length > 0) {
        return json.data.map(m => ({
          id: m.id,
          title: m.title || `Mission ${m.id}`,
          description: m.description || '',
          status: m.isOpen ? 'available' : 'locked',
          open_at: m.openAt,
          close_at: m.dueAt
        }));
      }
      return mockApi.getMissions();
    } catch (err) {
      console.warn('[API] Real backend fetch missions failed, using mock:', err.message);
      return mockApi.getMissions();
    }
  },

  /**
   * Lấy chi tiết Mission theo ID
   */
  async getMission(id) {
    if (CONFIG.USE_MOCK) return mockApi.getMission(id);

    try {
      const res = await fetch(`${API_BASE}/missions/${id}`, {
        headers: getAuthHeaders()
      });
      const json = await res.json();
      if (res.ok && json.data) {
        const m = json.data;
        return {
          id: m.id,
          title: m.title,
          description: m.description,
          status: m.isOpen ? 'available' : 'locked',
          open_at: m.openAt,
          close_at: m.dueAt
        };
      }
      return mockApi.getMission(id);
    } catch (err) {
      return mockApi.getMission(id);
    }
  },

  /**
   * Lấy danh sách bài nộp của user hiện tại (GET /api/submissions?employeeId=X)
   */
  async getUserSubmissions() {
    const user = auth.user;
    if (!user) return [];

    if (CONFIG.USE_MOCK) return mockApi.getUserSubmissions(user.id);

    try {
      const res = await fetch(`${API_BASE}/submissions?employeeId=${user.id}`, {
        headers: getAuthHeaders()
      });
      const json = await res.json();
      if (res.ok && Array.isArray(json.data)) {
        return json.data.map(normalizeSubmission);
      }
      return mockApi.getUserSubmissions(user.id);
    } catch (err) {
      console.warn('[API] Real backend fetch user submissions failed, using mock:', err.message);
      return mockApi.getUserSubmissions(user.id);
    }
  },

  /**
   * Nộp bài Mission (Spring Boot POST /api/submissions Multipart)
   */
  async submitMission(missionId, formDataOrPayload) {
    const user = auth.user;
    if (!user) throw new Error('Chưa đăng nhập');

    if (CONFIG.USE_MOCK) {
      let file = null;
      let note = '';
      if (formDataOrPayload instanceof FormData) {
        file = formDataOrPayload.get('file');
        note = formDataOrPayload.get('note') || '';
      } else {
        note = formDataOrPayload.note || '';
      }
      return mockApi.submitMission(missionId, user.id, { file, note });
    }

    try {
      let note = '';
      let fileList = [];

      if (formDataOrPayload instanceof FormData) {
        note = formDataOrPayload.get('note') || '';
        const f = formDataOrPayload.get('file');
        if (f) fileList.push(f);
      } else {
        note = formDataOrPayload.note || '';
      }

      const submissionPayload = {
        employeeId: user.id,
        missionId: Number(missionId),
        longTextAnswer: note,
        evidenceSource: note,
        witnessName: ''
      };

      const formData = new FormData();
      formData.append('submission', new Blob([JSON.stringify(submissionPayload)], { type: 'application/json' }));
      if (fileList.length > 0) {
        fileList.forEach(file => formData.append('files', file));
      }

      const res = await fetch(`${API_BASE}/submissions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Lỗi nộp bài');
      return { message: 'Nộp bài thành công!' };
    } catch (err) {
      console.warn('[API] Real backend submission failed, using mock fallback:', err.message);
      let file = null;
      let note = '';
      if (formDataOrPayload instanceof FormData) {
        file = formDataOrPayload.get('file');
        note = formDataOrPayload.get('note') || '';
      } else {
        note = formDataOrPayload.note || '';
      }
      return mockApi.submitMission(missionId, user.id, { file, note });
    }
  },

  /**
   * Admin: Lấy danh sách nhân sự chờ duyệt (GET /api/employees status=PENDING)
   */
  async getPendingUsers() {
    if (CONFIG.USE_MOCK) return mockApi.getPendingUsers();

    try {
      const res = await fetch(`${API_BASE}/employees`, {
        headers: getAuthHeaders()
      });
      const json = await res.json();
      if (res.ok && Array.isArray(json.data)) {
        return json.data.map(e => ({
          id: e.id,
          full_name: e.fullName || e.full_name,
          email: e.email,
          employee_id: e.employeeCode || e.employee_id,
          unit: e.unit ? (e.unit.name || e.unit.code) : (e.unitName || e.unitCode || '—'),
          approvalStatus: String(e.approvalStatus || e.status || 'PENDING').toUpperCase(),
          status: (e.approvalStatus || e.status || 'PENDING').toLowerCase(),
          created_at: e.createdAt || new Date().toISOString()
        }));
      }
      return mockApi.getPendingUsers();
    } catch (err) {
      console.warn('[API] Real backend get pending users failed, using mock:', err.message);
      return mockApi.getPendingUsers();
    }
  },

  /**
   * Admin: Duyệt nhân sự (PUT /api/employees/{id}/approve)
   */
  async approveUser(id) {
    if (CONFIG.USE_MOCK) return mockApi.approveUser(id);

    try {
      const res = await fetch(`${API_BASE}/employees/${id}/approve`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Lỗi phê duyệt');
      return { message: json.message || 'Phê duyệt tài khoản thành công!' };
    } catch (err) {
      return mockApi.approveUser(id);
    }
  },

  /**
   * Admin: Từ chối nhân sự (DELETE /api/employees/{id}/reject)
   */
  async rejectUser(id, payload = {}) {
    if (CONFIG.USE_MOCK) return mockApi.rejectUser(id, payload.reason);

    try {
      const res = await fetch(`${API_BASE}/employees/${id}/reject`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Lỗi từ chối');
      return { message: 'Đã từ chối tài khoản thành công.' };
    } catch (err) {
      return mockApi.rejectUser(id, payload.reason);
    }
  },

  /**
   * Admin: Lấy tất cả bài nộp (GET /api/submissions/all)
   */
  async getAllSubmissions() {
    if (CONFIG.USE_MOCK) return mockApi.getAllSubmissions();

    try {
      const res = await fetch(`${API_BASE}/submissions/all`, {
        headers: getAuthHeaders()
      });
      const json = await res.json();
      if (res.ok && Array.isArray(json.data)) {
        return json.data.map(normalizeSubmission);
      }
      return mockApi.getAllSubmissions();
    } catch (err) {
      console.warn('[API] Real backend get all submissions failed, using mock:', err.message);
      return mockApi.getAllSubmissions();
    }
  },

  /**
   * Admin: Chấm điểm & Đổi trạng thái bài nộp (PUT /api/submissions/{id}/status?status=VALID)
   */
  async scoreSubmission(id, payload) {
    if (CONFIG.USE_MOCK) return mockApi.scoreSubmission(id, payload);

    try {
      let statusParam = 'VALID';
      if (payload.status === 'invalid') statusParam = 'INVALID';
      else if (payload.status === 'needs_supplement') statusParam = 'NEEDS_SUPPLEMENT';
      else if (payload.status === 'pending') statusParam = 'PENDING';

      let queryStr = `status=${statusParam}`;
      if (payload.score != null && payload.score !== '') {
        queryStr += `&score=${encodeURIComponent(payload.score)}`;
      }

      const res = await fetch(`${API_BASE}/submissions/${id}/status?${queryStr}`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Lỗi cập nhật bài nộp');
      return { message: 'Đã cập nhật bài nộp' };
    } catch (err) {
      return mockApi.scoreSubmission(id, payload);
    }
  },

  /**
   * Lấy Bảng xếp hạng (GET /api/leaderboard/units & GET /api/leaderboard)
   */
  async getLeaderboard() {
    if (CONFIG.USE_MOCK) return mockApi.getLeaderboard();

    try {
      const res = await fetch(`${API_BASE}/leaderboard/units`);
      const json = await res.json();
      if (res.ok && Array.isArray(json.data) && json.data.length > 0) {
        return json.data.map((item, idx) => ({
          user_id: idx + 1,
          full_name: item.unitName || item.unitCode || '—',
          unit: item.unitName || '—',
          count: item.validParticipants || 0,
          total_score: Math.round((item.participationRate || 0) * 10),
          avg_score: item.participationRate != null ? Number(item.participationRate.toFixed(1)) : 0
        }));
      }
      return mockApi.getLeaderboard();
    } catch (err) {
      console.warn('[API] Real backend get leaderboard failed, using mock:', err.message);
      return mockApi.getLeaderboard();
    }
  }
};
