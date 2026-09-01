/**
 * CareerNest – Shared API Client with Error-Handling Middleware
 * Base URL: http://localhost:3000
 *
 * This file acts as the frontend-side "Error Handling Middleware":
 *   - Every API error (4xx, 5xx, network failure) is intercepted here.
 *   - Errors are categorized (VALIDATION_ERROR, SECURITY_AUDIT, NOT_FOUND_ERROR, etc.)
 *     based on the backend's AllExceptionsFilter response format.
 *   - A global toast notification system surfaces errors visually in the UI.
 *
 * Usage:
 *   import { OpportunitiesAPI } from '../../api.js';
 *   const jobs = await OpportunitiesAPI.getAll('candidate');
 */

const BASE_URL = 'http://localhost:3000';

// ─── Toast Notification System (Error Handling Middleware UI) ─────────────────
// Inject toast container once on first use
function ensureToastContainer() {
  if (document.getElementById('cn-toast-container')) return;
  const container = document.createElement('div');
  container.id = 'cn-toast-container';
  container.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 99999;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
    max-width: 380px;
  `;
  document.body.appendChild(container);

  // Inject styles
  if (!document.getElementById('cn-toast-styles')) {
    const style = document.createElement('style');
    style.id = 'cn-toast-styles';
    style.textContent = `
      .cn-toast {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 14px 18px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        font-family: inherit;
        font-size: 13.5px;
        pointer-events: all;
        animation: cn-slide-in 0.3s cubic-bezier(0.34,1.56,0.64,1);
        transition: opacity 0.3s, transform 0.3s;
        max-width: 380px;
        word-break: break-word;
      }
      .cn-toast.cn-toast-error   { background: #fff1f2; border-left: 4px solid #ef4444; color: #7f1d1d; }
      .cn-toast.cn-toast-warning { background: #fffbeb; border-left: 4px solid #f59e0b; color: #78350f; }
      .cn-toast.cn-toast-success { background: #f0fdf4; border-left: 4px solid #22c55e; color: #14532d; }
      .cn-toast.cn-toast-info    { background: #eff6ff; border-left: 4px solid #3b82f6; color: #1e3a8a; }
      .cn-toast-icon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }
      .cn-toast-body { flex: 1; }
      .cn-toast-title { font-weight: 700; margin-bottom: 2px; font-size: 14px; }
      .cn-toast-msg  { opacity: 0.85; font-size: 13px; line-height: 1.4; }
      .cn-toast-close {
        background: none; border: none; cursor: pointer; opacity: 0.5;
        font-size: 16px; padding: 0; line-height: 1; flex-shrink: 0;
        color: inherit;
      }
      .cn-toast-close:hover { opacity: 1; }
      .cn-toast.cn-fade-out { opacity: 0; transform: translateX(20px); }
      .cn-toast-category {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.5px;
        opacity: 0.6;
        margin-top: 4px;
        text-transform: uppercase;
      }
      @keyframes cn-slide-in {
        from { opacity: 0; transform: translateX(40px); }
        to   { opacity: 1; transform: translateX(0); }
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Show a toast notification — the frontend Error Handling Middleware display.
 * @param {string} type - 'error' | 'warning' | 'success' | 'info'
 * @param {string} title - Short title for the notification
 * @param {string} message - Detailed message
 * @param {string} [category] - Error category from backend (e.g. VALIDATION_ERROR)
 * @param {number} [duration=5000] - Auto-dismiss after ms (0 = no auto-dismiss)
 */
export function showToast(type = 'info', title = '', message = '', category = '', duration = 5000) {
  ensureToastContainer();
  const container = document.getElementById('cn-toast-container');

  const icons = {
    error:   '&#10060;',
    warning: '&#9888;&#65039;',
    success: '&#9989;',
    info:    'ℹ️',
  };

  const toast = document.createElement('div');
  toast.className = `cn-toast cn-toast-${type}`;
  toast.innerHTML = `
    <span class="cn-toast-icon">${icons[type] || icons.info}</span>
    <div class="cn-toast-body">
      <div class="cn-toast-title">${title}</div>
      <div class="cn-toast-msg">${message}</div>
      ${category ? `<div class="cn-toast-category">${category}</div>` : ''}
    </div>
    <button class="cn-toast-close" onclick="this.closest('.cn-toast').remove()">&times;</button>
  `;

  container.appendChild(toast);

  if (duration > 0) {
    setTimeout(() => {
      toast.classList.add('cn-fade-out');
      setTimeout(() => toast.remove(), 320);
    }, duration);
  }
}

/**
 * categorizeAndShow — Maps backend error responses to appropriate toast types.
 * This implements the "frontend error-handling middleware" logic:
 *   - Reads the `category` field from AllExceptionsFilter response
 *   - Maps it to a human-readable title and type
 *   - Surfaces it visually via showToast
 * @param {Response} res - The failed fetch Response
 * @param {string} [fallbackMsg] - Default message if backend body is unparseable
 */
async function categorizeAndShow(res, fallbackMsg = 'Something went wrong.') {
  let body = {};
  try { body = await res.json(); } catch (_) {}

  const category = body.category || '';
  const rawMessages = Array.isArray(body.message) ? body.message : [body.message || fallbackMsg];
  const messageStr = rawMessages.join(' | ');

  // Map backend middleware categories → UI presentation
  const categoryMap = {
    VALIDATION_ERROR: {
      type: 'warning',
      title: '⚠️ Validation Error',
      label: 'VALIDATION_ERROR',
    },
    SECURITY_AUDIT: {
      type: 'error',
      title: '🔒 Access Denied',
      label: 'SECURITY_AUDIT',
    },
    NOT_FOUND_ERROR: {
      type: 'warning',
      title: '🔍 Not Found',
      label: 'NOT_FOUND_ERROR',
    },
    CONFLICT_ERROR: {
      type: 'warning',
      title: '⚡ Conflict',
      label: 'CONFLICT_ERROR',
    },
    DATABASE_CONFLICT: {
      type: 'error',
      title: '💾 Database Conflict',
      label: 'DATABASE_CONFLICT',
    },
    SYSTEM_CRASH: {
      type: 'error',
      title: '💥 Server Error',
      label: 'SYSTEM_CRASH',
    },
    API_ERROR: {
      type: 'error',
      title: '❌ API Error',
      label: 'API_ERROR',
    },
    TYPE_ERROR: {
      type: 'error',
      title: '❌ Type Error',
      label: 'TYPE_ERROR',
    },
  };

  const mapped = categoryMap[category] || {
    type: 'error',
    title: `❌ Error ${res.status}`,
    label: category || `HTTP_${res.status}`,
  };

  showToast(mapped.type, mapped.title, messageStr, mapped.label);

  // Return a structured Error for callers to throw
  const err = new Error(messageStr);
  err.status = res.status;
  err.category = category;
  err.body = body;
  return err;
}

// ─── Core Fetch Wrapper ───────────────────────────────────────────────────────
/**
 * request() — central fetch middleware that:
 *   1. Attaches x-role, x-user-id, x-college-id headers from localStorage
 *   2. On non-OK responses, categorizes the error and shows a toast
 *   3. On network failure, shows a connectivity toast
 *
 * All API helpers below use this function. No raw fetch() calls in UI code.
 */
async function request(path, role, options = {}) {
  const userId    = localStorage.getItem('userId')    || '';
  const collegeId = localStorage.getItem('collegeId') || 'null';

  const headers = {
    'Content-Type': 'application/json',
    'x-role': role,
    'x-user-id': userId,
    'x-college-id': collegeId,
    ...(options.headers || {}),
  };

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  } catch (networkError) {
    // Network / CORS / server offline error
    showToast(
      'error',
      '🌐 Connection Error',
      'Cannot reach the backend server. Please make sure it is running on http://localhost:3000.',
      'NETWORK_ERROR',
      8000,
    );
    const err = new Error('Network error — backend unreachable.');
    err.category = 'NETWORK_ERROR';
    throw err;
  }

  if (!res.ok) {
    const err = await categorizeAndShow(res);
    throw err;
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  get:    (path, role)         => request(path, role, { method: 'GET' }),
  post:   (path, role, body)   => request(path, role, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (path, role, body)   => request(path, role, { method: 'PUT',    body: JSON.stringify(body) }),
  patch:  (path, role, body)   => request(path, role, { method: 'PATCH',  body: JSON.stringify(body ?? {}) }),
  delete: (path, role)         => request(path, role, { method: 'DELETE' }),
};

// ─── Multipart upload (bypasses JSON Content-Type for file uploads) ───────────
/**
 * uploadFile — wraps the FileUploadMiddleware endpoint.
 * Uses multipart/form-data so multer on the backend can process it.
 */
export async function uploadFile(userId, file) {
  const formData = new FormData();
  formData.append('file', file);

  const role      = localStorage.getItem('userRole') || 'candidate';
  const collegeId = localStorage.getItem('collegeId') || 'null';

  let res;
  try {
    res = await fetch(`${BASE_URL}/users/${userId}/profile-picture`, {
      method: 'POST',
      headers: {
        'x-role': role,
        'x-user-id': String(userId),
        'x-college-id': collegeId,
      },
      body: formData,
    });
  } catch (networkError) {
    showToast('error', '🌐 Connection Error', 'Cannot reach the backend server.', 'NETWORK_ERROR', 8000);
    throw new Error('Network error during file upload.');
  }

  if (!res.ok) {
    const err = await categorizeAndShow(res, 'File upload failed.');
    throw err;
  }

  return res.json();
}

// ─── Domain-specific API helpers ──────────────────────────────────────────────

// --- Opportunities ---
export const OpportunitiesAPI = {
  getAll:  (role = 'candidate')           => api.get('/opportunities', role),
  getOne:  (id, role = 'candidate')       => api.get(`/opportunities/${id}`, role),
  create:  (body, role = 'recruiter')     => api.post('/opportunities', role, body),
  update:  (id, body, role = 'recruiter') => api.put(`/opportunities/${id}`, role, body),
  approve: (id)                           => api.patch(`/opportunities/${id}/approve`, 'placement_officer'),
  publish: (id)                           => api.patch(`/opportunities/${id}/publish`, 'placement_officer'),
  reject:  (id, remark)                   => api.patch(`/opportunities/${id}/reject`, 'placement_officer', { remark }),
  delete:  (id, role = 'recruiter')       => api.delete(`/opportunities/${id}`, role),
};

// --- Applications ---
export const ApplicationsAPI = {
  getAll:       (role = 'recruiter', oppId)  => api.get(`/applications${oppId ? `?opportunityId=${oppId}` : ''}`, role),
  getMine:      (candidateId = 1)            => api.get(`/applications/my?candidateId=${candidateId}`, 'candidate'),
  getStats:     (candidateId = 1)            => api.get(`/applications/stats?candidateId=${candidateId}`, 'candidate'),
  getOne:       (id, role = 'candidate')     => api.get(`/applications/${id}`, role),
  apply:        (body)                       => api.post('/applications', 'candidate', body),
  updateStatus: (id, body)                   => api.patch(`/applications/${id}/status`, 'recruiter', body),
  withdraw:     (id)                         => api.patch(`/applications/${id}/withdraw`, 'candidate'),
  delete:       (id)                         => api.delete(`/applications/${id}`, 'placement_officer'),
};

// --- Referrals ---
export const ReferralsAPI = {
  getAll:   (alumniId)            => api.get(`/referrals${alumniId ? `?alumniId=${alumniId}` : ''}`, 'alumni'),
  getMine:  (candidateId = 1)     => api.get(`/referrals/my?candidateId=${candidateId}`, 'candidate'),
  getStats: (alumniId = 7)        => api.get(`/referrals/stats?alumniId=${alumniId}`, 'alumni'),
  getOne:   (id, role = 'alumni') => api.get(`/referrals/${id}`, role),
  create:   (body)                => api.post('/referrals', 'candidate', body),
  update:   (id, body)            => api.patch(`/referrals/${id}`, 'alumni', body),
  delete:   (id, role = 'candidate') => api.delete(`/referrals/${id}`, role),
};

// --- Users ---
export const UsersAPI = {
  getAll:  (role = 'placement_officer') => api.get('/users', role),
  getOne:  (id)       => api.get(`/users/${id}`, 'candidate'),
  create:  (body)     => api.post('/users', 'placement_officer', body),
  update:  (id, body) => api.put(`/users/${id}`, 'candidate', body),
  delete:  (id)       => api.delete(`/users/${id}`, 'placement_officer'),
  uploadProfilePicture: (id, file) => uploadFile(id, file),
};

// --- Assessments ---
export const AssessmentsAPI = {
  getAll:  ()           => api.get('/assessments', 'recruiter'),
  getOne:  (id)         => api.get(`/assessments/${id}`, 'recruiter'),
  create:  (body)       => api.post('/assessments', 'recruiter', body),
  update:  (id, body)   => api.put(`/assessments/${id}`, 'recruiter', body),
  delete:  (id)         => api.delete(`/assessments/${id}`, 'recruiter'),
};

// --- Notifications ---
export const NotificationsAPI = {
  getAll:      (candidateId = 1) => api.get(`/notifications?candidateId=${candidateId}`, 'candidate'),
  getUnread:   (candidateId = 1) => api.get(`/notifications/unread-count?candidateId=${candidateId}`, 'candidate'),
  markRead:    (id)              => api.patch(`/notifications/${id}/read`, 'candidate'),
  markAllRead: (candidateId = 1) => api.patch(`/notifications/read-all?candidateId=${candidateId}`, 'candidate'),
  delete:      (id)              => api.delete(`/notifications/${id}`, 'candidate'),
};

// --- Recruiters ---
export const RecruitersAPI = {
  getAll:   (status)   => api.get(`/recruiters${status ? `?status=${status}` : ''}`, 'placement_officer'),
  getOne:   (id)       => api.get(`/recruiters/${id}`, 'placement_officer'),
  getStats: ()         => api.get('/recruiters/stats', 'placement_officer'),
  create:   (body)     => api.post('/recruiters', 'recruiter', body),
  update:   (id, body) => api.put(`/recruiters/${id}`, 'placement_officer', body),
  approve:  (id)       => api.patch(`/recruiters/${id}/approve`, 'placement_officer'),
  decline:  (id)       => api.patch(`/recruiters/${id}/decline`, 'placement_officer'),
  delete:   (id)       => api.delete(`/recruiters/${id}`, 'placement_officer'),
};

// --- Colleges ---
export const CollegesAPI = {
  getAll:              ()              => api.get('/colleges', 'super_admin'),
  getOne:              (id, role)      => api.get(`/colleges/${id}`, role || 'super_admin'),
  getSubscription:     (id, role)      => api.get(`/colleges/${id}/subscription`, role || 'candidate'),
  create:              (body)          => api.post('/colleges', 'super_admin', body),
  update:              (id, body)      => api.put(`/colleges/${id}`, 'super_admin', body),
  updateStatus:        (id, status)    => api.patch(`/colleges/${id}/status`, 'super_admin', { status }),
  delete:              (id)            => api.delete(`/colleges/${id}`, 'super_admin'),
};

// --- Super Admin ---
export const SuperAdminAPI = {
  getStats:                 ()            => api.get('/super-admin/stats', 'super_admin'),
  getRevenue:               ()            => api.get('/super-admin/revenue', 'super_admin'),
  getAllColleges:            ()            => api.get('/super-admin/colleges', 'super_admin'),
  getCollege:               (id)          => api.get(`/super-admin/colleges/${id}`, 'super_admin'),
  createCollege:            (body)        => api.post('/super-admin/colleges', 'super_admin', body),
  updateCollege:            (id, body)    => api.put(`/super-admin/colleges/${id}`, 'super_admin', body),
  updateCollegeStatus:      (id, status)  => api.patch(`/super-admin/colleges/${id}/status`, 'super_admin', { status }),
  changeSubscriptionTier:   (id, tier)    => api.patch(`/super-admin/colleges/${id}/subscription`, 'super_admin', { tier }),
  deleteCollege:            (id)          => api.delete(`/super-admin/colleges/${id}`, 'super_admin'),
  getCollegeAdmin:          (id)          => api.get(`/super-admin/colleges/${id}/admin`, 'super_admin'),
  createCollegeAdmin:       (id, body)    => api.post(`/super-admin/colleges/${id}/admin`, 'super_admin', body),
  updateCollegeAdmin:       (id, body)    => api.put(`/super-admin/colleges/${id}/admin`, 'super_admin', body),
  toggleAdminStatus:        (id, status)  => api.patch(`/super-admin/colleges/${id}/admin/status`, 'super_admin', { status }),
  getCollegeUsers:          (id)          => api.get(`/super-admin/colleges/${id}/users`, 'super_admin'),
};

// ─── Features API (Tier-Gated) ─────────────────────────────────────────────
// All methods read role/userId/collegeId from localStorage automatically via the api object.
// The backend returns HTTP 403 if the college's plan does not meet the required tier.
export const FeaturesAPI = {

  // ── CANDIDATE (Standard) ──────────────────────────────────────────────────
  candidate: {
    searchDrives: (q, type, sort, minPackage) => {
      const params = new URLSearchParams();
      if (q)          params.set('q', q);
      if (type)       params.set('type', type);
      if (sort)       params.set('sort', sort);
      if (minPackage) params.set('minPackage', minPackage);
      return api.get(`/features/candidate/drives/search?${params}`, 'candidate');
    },
    getSavedDrives:     ()          => api.get('/features/candidate/saved-drives', 'candidate'),
    saveDrive:          (driveId)   => api.post(`/features/candidate/drives/${driveId}/save`, 'candidate', {}),
    unsaveDrive:        (driveId)   => api.delete(`/features/candidate/drives/${driveId}/save`, 'candidate'),
    getAppStats:        ()          => api.get('/features/candidate/application-stats', 'candidate'),
    // Premium
    getAppTimeline:     ()          => api.get('/features/candidate/applications/timeline', 'candidate'),
    getInterviews:      ()          => api.get('/features/candidate/interviews', 'candidate'),
  },

  // ── RECRUITER (Standard) ──────────────────────────────────────────────────
  recruiter: {
    filterCandidates: (dept, minCgpa, maxBacklogs) => {
      const params = new URLSearchParams();
      if (dept)                       params.set('dept', dept);
      if (minCgpa)                    params.set('minCgpa', minCgpa);
      if (maxBacklogs !== undefined)  params.set('maxBacklogs', maxBacklogs);
      return api.get(`/features/recruiter/candidates/filter?${params}`, 'recruiter');
    },
    bulkShortlist:      (body)       => api.post('/features/recruiter/drives/bulk-shortlist', 'recruiter', body),
    scheduleInterview:  (body)       => api.post('/features/recruiter/interviews/schedule', 'recruiter', body),
    getInterviews:      ()           => api.get('/features/recruiter/interviews', 'recruiter'),
    // Premium
    getReports:         ()           => api.get('/features/recruiter/reports', 'recruiter'),
    getDriveReport:     (driveId)    => api.get(`/features/recruiter/reports/${driveId}`, 'recruiter'),
  },

  // ── PLACEMENT OFFICER (Standard) ──────────────────────────────────────────
  officer: {
    getNotifications:   ()           => api.get('/features/officer/notifications', 'placement_officer'),
    sendNotification:   (body)       => api.post('/features/officer/notifications/bulk', 'placement_officer', body),
    filterCandidates: (dept, minCgpa, maxBacklogs) => {
      const params = new URLSearchParams();
      if (dept)                       params.set('dept', dept);
      if (minCgpa)                    params.set('minCgpa', minCgpa);
      if (maxBacklogs !== undefined)  params.set('maxBacklogs', maxBacklogs);
      return api.get(`/features/officer/candidates/filter?${params}`, 'placement_officer');
    },
    getDeptReport:      ()           => api.get('/features/officer/dept-report', 'placement_officer'),
    // Premium
    getPlacementDashboard: ()        => api.get('/features/officer/placement-dashboard', 'placement_officer'),
    getCustomReport: (dept, company) => {
      const params = new URLSearchParams();
      if (dept)    params.set('dept', dept);
      if (company) params.set('company', company);
      return api.get(`/features/officer/custom-report?${params}`, 'placement_officer');
    },
  },

  // ── ALUMNI (Standard) ─────────────────────────────────────────────────────
  alumni: {
    getMentorshipReceived: ()        => api.get('/features/alumni/mentorship/received', 'alumni'),
    requestMentorship:  (body)       => api.post('/features/alumni/mentorship/request', 'alumni', body),
    respondMentorship:  (id, status) => api.patch(`/features/alumni/mentorship/${id}/respond`, 'alumni', { status }),
    getEvents:          ()           => api.get('/features/alumni/events', 'alumni'),
    registerEvent:      (id)         => api.post(`/features/alumni/events/${id}/register`, 'alumni', {}),
    // Premium
    getDirectory: (company, batch, dept) => {
      const params = new URLSearchParams();
      if (company) params.set('company', company);
      if (batch)   params.set('batch', batch);
      if (dept)    params.set('dept', dept);
      return api.get(`/features/alumni/directory?${params}`, 'alumni');
    },
    getMentees:         ()           => api.get('/features/alumni/mentees', 'alumni'),
    getEngagementHistory: ()         => api.get('/features/alumni/engagement-history', 'alumni'),
  },
};
