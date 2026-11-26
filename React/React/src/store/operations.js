import api, { errorMessage } from '../services/api.js';
import { entityActions, selectEntity, entityListSelector } from './entities.js';
import { resourceActions } from './resourcesSlice.js';
import { selectSession, selectWorkspaceVersion } from './sessionSlice.js';

let requestId = 0;
const get = (url, config) => () => api.get(url, config);
const post = (url, data, config) => () => api.post(url, data, config);
const put = (url, data) => () => api.put(url, data);
const patch = (url, data) => () => api.patch(url, data);
const remove = (url) => () => api.delete(url);
const record = (data) => data?.id == null ? [] : [data];
const records = (data) => Array.isArray(data) ? data : record(data);

function read(name, key, request, transform = records) {
  return async (dispatch, getState) => {
    const version = selectWorkspaceVersion(getState());
    const id = ++requestId;
    const writeRevision = getState()[name].writeRevision;
    const actions = entityActions[name];
    dispatch(actions.readStarted({ key, requestId: id }));
    try {
      const response = await request();
      if (selectWorkspaceVersion(getState()) === version) {
        dispatch(actions.readFinished({ key, requestId: id, writeRevision, records: transform(response.data) }));
      }
      return response;
    } catch (error) {
      if (selectWorkspaceVersion(getState()) === version) {
        dispatch(actions.readFailed({ key, requestId: id, error: errorMessage(error) }));
      }
      throw error;
    }
  };
}

function readResource(key, request) {
  return async (dispatch, getState) => {
    const version = selectWorkspaceVersion(getState());
    const id = ++requestId;
    dispatch(resourceActions.started({ key, requestId: id }));
    try {
      const response = await request();
      if (selectWorkspaceVersion(getState()) === version) {
        dispatch(resourceActions.finished({ key, requestId: id, data: response.data }));
      }
      return response;
    } catch (error) {
      if (selectWorkspaceVersion(getState()) === version) {
        dispatch(resourceActions.failed({ key, requestId: id, error: errorMessage(error) }));
      }
      throw error;
    }
  };
}

function write(name, request, { returned = records, addTo, deleteId, committed } = {}) {
  return async (dispatch, getState) => {
    const version = selectWorkspaceVersion(getState());
    const response = await request();
    if (selectWorkspaceVersion(getState()) !== version) return response;
    if (deleteId != null) dispatch(entityActions[name].removed(deleteId));
    else dispatch(entityActions[name].written({ records: returned(response.data, getState()), addTo }));
    committed?.(dispatch, getState(), response.data);
    return response;
  };
}

const approveRecruiter = (id) => write(
  'recruiterRegistrations', patch(`/recruiters/${id}/approve`), { returned: (data) => record(data.recruiter) },
);
const updateOpportunityStatus = (id, action, data) => write('opportunities', patch(`/opportunities/${id}/${action}`, data));
const notificationInbox = entityListSelector('notifications', 'inbox');
const savedDrive = (id) => ({ id: Number(id) });

const listPlatformColleges = () => (dispatch) => {
  const response = api.get('/super-admin/colleges');
  return Promise.all([
    dispatch(read('colleges', 'platform', () => response, (items) => items.map(({ admin, ...college }) => ({
      ...college, adminId: admin?.id ?? null,
    })))),
    dispatch(read('users', 'collegeAdmins', () => response, (items) => items.flatMap(({ admin }) => record(admin)))),
  ]).then(([colleges]) => colleges);
};

export const operations = {
  listOpportunities: () => read('opportunities', 'workspace', get('/opportunities')),
  listRecruiterOpportunities: (id) => read('opportunities', `recruiter:${id}`, get(`/recruiters/${id}/opportunities`)),
  createOpportunity: (data) => write('opportunities', post('/opportunities', data), { addTo: ['workspace'] }),
  updateOpportunity: (id, data) => write('opportunities', put(`/opportunities/${id}`, data)),
  deleteOpportunity: (id) => write('opportunities', remove(`/opportunities/${id}`), { deleteId: id }),
  approveOpportunity: (id) => updateOpportunityStatus(id, 'approve'),
  undoOpportunityApproval: (id) => updateOpportunityStatus(id, 'undo-approval'),
  publishOpportunity: (id) => updateOpportunityStatus(id, 'publish'),
  rejectOpportunity: (id, remark) => updateOpportunityStatus(id, 'reject', { remark }),

  listApplications: () => read('applications', 'workspace', get('/applications')),
  listMyApplications: () => read('applications', 'mine', get('/applications/my')),
  createApplication: (data) => write('applications', post('/applications', data), { addTo: ['mine'] }),
  updateApplicationStatus: (id, data) => write('applications', patch(`/applications/${id}/status`, data)),
  withdrawApplication: (id) => write('applications', patch(`/applications/${id}/withdraw`)),
  bulkUpdateApplications: (applicationIds, status) => write(
    'applications', post('/applications/bulk-status', { applicationIds, status }),
    { returned: (data) => records(data.updated ?? data).filter((item) => item?.id != null) },
  ),
  getApplicationResume: (id) => get(`/applications/${id}/resume`, { responseType: 'blob' }),
  getReferralResume: (id) => get(`/applications/referrals/${id}/resume`, { responseType: 'blob' }),

  listAssessments: () => read('assessments', 'workspace', get('/assessments')),
  listMyAssessments: () => read('assessments', 'mine', get('/assessments/my')),
  createAssessment: (data) => write('assessments', post('/assessments', data), { addTo: ['workspace'] }),
  deleteAssessment: (id) => write('assessments', remove(`/assessments/${id}`), { deleteId: id }),

  listReferrals: () => read('referrals', 'received', get('/referrals')),
  listMyReferrals: () => read('referrals', 'mine', get('/referrals/my')),
  createReferral: (data) => write('referrals', post('/referrals', data), { addTo: ['mine'] }),
  respondToReferral: (id, data) => write('referrals', patch(`/referrals/${id}`, data)),

  listNotifications: () => read('notifications', 'inbox', get('/notifications')),
  markNotificationRead: (id) => write('notifications', patch(`/notifications/${id}/read`)),
  markAllNotificationsRead: () => write('notifications', patch('/notifications/read-all'), {
    returned: (_, state) => notificationInbox(state).map(({ id }) => ({ id, isRead: true })),
  }),
  listSentNotifications: () => read('notificationDeliveries', 'sent', get('/features/officer/notifications')),
  sendBulkNotification: (data) => write(
    'notificationDeliveries', post('/features/officer/notifications/bulk', data), { addTo: ['sent'] },
  ),

  listAnnouncements: () => read('announcements', 'workspace', get('/announcements')),
  createAnnouncement: (data) => write('announcements', post('/announcements', data), { addTo: ['workspace'] }),
  deleteAnnouncement: (id) => write('announcements', remove(`/announcements/${id}`), { deleteId: id }),

  getUser: (id) => read('users', `user:${id}`, get(`/users/${id}`)),
  listUsers: (role) => read('users', role || 'directory', get('/users', role ? { params: { role } } : undefined)),
  listOversightUsers: () => read('users', 'oversight', get('/users/oversight')),
  listOfficerCandidates: () => read('users', 'candidateFilter', get('/features/officer/candidates/filter'),
    (items) => items.map(({ dept, rollNo, batch, status, ...user }) => ({
      ...user, role: 'candidate', department: dept, rollNumber: rollNo, batchLabel: batch,
      ...(status === 'Placed' ? { status: 'placed' } : {}),
    }))),
  listReferralAlumni: () => read('users', 'referralDirectory', get('/users/alumni-directory')),
  listAlumniDirectory: () => read('users', 'alumniDirectory', get('/features/alumni/directory'),
    (items) => items.map(({ role: headline, dept, linkedin, ...user }) => ({
      ...user, role: 'alumni', headline, department: dept,
      directoryLinkedIn: linkedin,
    }))),
  getOversightPolicy: () => readResource('oversightPolicy', get('/users/oversight-policy')),
  createUser: (data) => write('users', post('/users', data), { addTo: ['directory', data.role] }),
  updateUser: (id, data) => write('users', put(`/users/${id}`, data)),
  deleteUser: (id) => write('users', remove(`/users/${id}`), { deleteId: id }),
  uploadResume: (id, form) => post(`/users/${id}/resume`, form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  changePassword: (id, data) => post(`/users/${id}/password`, data),
  importUsers: (endpoint, data) => post(endpoint, data),

  listRecruiterRegistrations: () => read('recruiterRegistrations', 'workspace', get('/recruiters')),
  submitRecruiterContact: (data) => post('/contact/recruiter', data),
  approveRecruiter,
  declineRecruiter: (id, remark) => write('recruiterRegistrations', patch(`/recruiters/${id}/decline`, { remark })),
  deleteRecruiter: (id) => write('recruiterRegistrations', remove(`/recruiters/${id}`), {
    deleteId: id,
    committed: (dispatch, state) => {
      // The directory refresh also picks up the server-side deletion of any linked login.
      if (selectSession(state)?.role === 'college_admin') dispatch(operations.listUsers()).catch(() => {});
    },
  }),

  listPublicColleges: () => read('colleges', 'public', get('/contact/colleges')),
  listPlatformColleges,
  getCollege: (id) => read('colleges', `college:${id}`, get(`/colleges/${id}`)),
  createCollege: (data) => write('colleges', post('/super-admin/colleges', data), { addTo: ['platform'] }),
  updateCollegeStatus: (id, status) => write('colleges', patch(`/super-admin/colleges/${id}/status`, { status })),
  assignCollegeAdmin: (id, data) => write('users', post(`/super-admin/colleges/${id}/admin`, data), {
    returned: (admin, state) => {
      const previous = selectEntity(state, 'colleges', id)?.adminId;
      return previous == null ? [admin] : [{ id: previous, status: 'inactive' }, admin];
    },
    committed: (dispatch, _state, assigned) => {
      dispatch(entityActions.colleges.written({ records: [{ id, adminId: assigned.id }] }));
    },
  }),
  updateCollegeAdminStatus: (id, status) => write('users', patch(`/super-admin/colleges/${id}/admin/status`, { status })),

  listSentMessages: () => read('messages', 'sent', get('/super-admin/messages')),
  listInboxMessages: () => read('messages', 'inbox', get('/super-admin/inbox')),
  sendMessage: (data) => write('messages', post('/super-admin/messages', data), { addTo: ['sent'] }),
  listPlatformActivity: () => read('activityEntries', 'platform', get('/super-admin/activity')),
  listOfficerActivity: () => read('activityEntries', 'officers', get('/activity/placement-officers')),

  listSavedDrives: () => read('savedDrives', 'mine', get('/features/candidate/saved-drive-ids'), (ids) => ids.map(savedDrive)),
  saveDrive: (id) => write('savedDrives', post(`/features/candidate/drives/${id}/save`), {
    returned: () => [savedDrive(id)], addTo: ['mine'],
  }),
  unsaveDrive: (id) => write('savedDrives', remove(`/features/candidate/drives/${id}/save`), { deleteId: id }),

  getOfficerPlacement: () => readResource('officerPlacement', get('/features/officer/placement-dashboard')),
  getPlatformStats: () => readResource('platformStats', get('/super-admin/stats')),
};

export const selectCurrentUser = (state) => selectEntity(state, 'users', selectSession(state)?.id) ?? selectSession(state);
