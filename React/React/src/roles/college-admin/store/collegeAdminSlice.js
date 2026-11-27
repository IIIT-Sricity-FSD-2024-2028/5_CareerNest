// Redux Flow (roles/college-admin/store/collegeAdminSlice.js):
// 1. Backend API -> Thunks (createAsyncThunk, createSlice, fetchApplications, fetchCollegeById, fetchUsers, loadCollegeInboxSeenTime, markCollegeInboxSeen, refreshCollegeAdminData) call apiFetch([local/UI state (no direct API call)]).
// 2. extraReducers/reducers update this slice in the Redux store.
// 3. UI components read state via useSelector(selectWorkspaceApplications, selectSession, selectCollegeById, selectInboxMessages, selectCollegeAlumni, selectCollegeOfficers, selectCollegeStudents, selectCollegeAdmin, selectCollegeAdminSignOutOpen, selectCollegeTopbarUi, selectCollegeActivityLogUi, selectCollegeAnnouncementsUi, selectCollegeMessagesUi, selectCollegeOfficersUi, selectCollegeProfileUi, selectCollegeRecruitersUi, selectCollegeAdminPlatform, selectUnreadCollegeMessages) and update via dispatch(action).
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchApplications, selectWorkspaceApplications } from '../../../store/slices/applicationsSlice.js';
import { selectSession } from '../../../store/slices/authSlice.js';
import { fetchCollegeById, selectCollegeById } from '../../../store/slices/collegesSlice.js';
import { selectInboxMessages } from '../../../store/slices/messagesSlice.js';
import {
  fetchUsers,
  selectCollegeAlumni,
  selectCollegeOfficers,
  selectCollegeStudents,
} from '../../../store/slices/usersSlice.js';

export const COLLEGE_ADMIN_TABS = [
  'dashboard',
  'officers',
  'students',
  'alumni',
  'recruiters',
  'activity',
  'announcements',
  'messages',
  'reports',
  'profile',
];

const seenKey = (state) => `ca_messages_seen_${Number(selectSession(state)?.collegeId) || 1}`;

export const loadCollegeInboxSeenTime = () => (dispatch, getState) => {
  let seen = 0;
  try {
    seen = Number(localStorage.getItem(seenKey(getState()))) || 0;
  } catch {
    // Keep in-memory state if storage is unavailable.
  }
  dispatch(setCollegeInboxSeenTime(seen));
};

export const markCollegeInboxSeen = () => (dispatch, getState) => {
  const seen = Date.now();
  dispatch(setCollegeInboxSeenTime(seen));
  try {
    localStorage.setItem(seenKey(getState()), String(seen));
  } catch {
    // Keep Redux read state for this session.
  }
};

export const refreshCollegeAdminData = createAsyncThunk(
  'collegeAdmin/refreshCollegeAdminData',
  async ({ silentAfterMutation = false } = {}, { dispatch, getState }) => {
    const { role, collegeId } = selectSession(getState()) ?? {};
    if (role !== 'college_admin' || collegeId == null) return null;

    dispatch(setCollegePlatformLoading());
    try {
      await Promise.all([
        dispatch(fetchCollegeById(collegeId)).unwrap(),
        dispatch(fetchUsers('placement_officer')).unwrap(),
        dispatch(fetchUsers('candidate')).unwrap(),
        dispatch(fetchUsers('alumni')).unwrap(),
        dispatch(fetchApplications()).unwrap(),
      ]);
      dispatch(setCollegePlatformSuccess(''));
      return null;
    } catch (error) {
      if (silentAfterMutation) {
        const warning = 'Changes were saved, but some data could not be refreshed.';
        dispatch(setCollegePlatformSuccess(warning));
        return { warning };
      }
      dispatch(setCollegePlatformError('Could not load data from the server.'));
      throw error;
    }
  },
);

const initialState = {
  activeTab: 'dashboard',
  inboxSeenAt: 0,
  platform: { loading: false, error: '' },
  signOutOpen: false,
  topbarUi: { dropdownOpen: false },
  activityLogUi: { loading: true, error: '', query: '' },
  announcementsUi: { form: { title: '', message: '', type: 'general' }, error: '', saving: false, loading: true, err: '', showAdd: false },
  messagesUi: { error: '', loaded: false },
  officersUi: { form: { name: '', email: '', department: '', phone: '' }, error: '', showAdd: false, filter: 'all' },
  profileUi: { loading: true, isEditing: false, editFields: { name: '', email: '', phone: '', location: '', bio: '' }, saving: false, isChangePasswordOpen: false },
  recruitersUi: { selectedId: null, error: '', loading: true, removingId: null },
};

const collegeAdminSlice = createSlice({
  name: 'collegeAdmin',
  initialState,
  reducers: {
    setCollegeAdminTab(state, action) {
      state.activeTab = action.payload;
    },
    setCollegeInboxSeenTime(state, action) {
      state.inboxSeenAt = action.payload;
    },
    openCollegeAdminSignOut(state) {
      state.signOutOpen = true;
    },
    closeCollegeAdminSignOut(state) {
      state.signOutOpen = false;
    },
    setCollegeTopbarUi(state, action) {
      Object.assign(state.topbarUi, action.payload);
    },
    setCollegeActivityLogUi(state, action) {
      Object.assign(state.activityLogUi, action.payload);
    },
    setCollegeAnnouncementsUi(state, action) {
      Object.assign(state.announcementsUi, action.payload);
    },
    setCollegeMessagesUi(state, action) {
      Object.assign(state.messagesUi, action.payload);
    },
    setCollegeOfficersUi(state, action) {
      Object.assign(state.officersUi, action.payload);
    },
    setCollegeProfileUi(state, action) {
      Object.assign(state.profileUi, action.payload);
    },
    setCollegeRecruitersUi(state, action) {
      Object.assign(state.recruitersUi, action.payload);
    },
    setCollegePlatformLoading(state) {
      state.platform.loading = true;
      state.platform.error = '';
    },
    setCollegePlatformSuccess(state, action) {
      state.platform.loading = false;
      if (action.payload) state.platform.error = action.payload;
    },
    setCollegePlatformError(state, action) {
      state.platform.loading = false;
      state.platform.error = action.payload || 'Could not load data from the server.';
    },
  },
});

export const {
  setCollegeAdminTab,
  setCollegeInboxSeenTime,
  openCollegeAdminSignOut,
  closeCollegeAdminSignOut,
  setCollegeTopbarUi,
  setCollegeActivityLogUi,
  setCollegeAnnouncementsUi,
  setCollegeMessagesUi,
  setCollegeOfficersUi,
  setCollegeProfileUi,
  setCollegeRecruitersUi,
  setCollegePlatformLoading,
  setCollegePlatformSuccess,
  setCollegePlatformError,
} = collegeAdminSlice.actions;

export const selectCollegeAdmin = (state) => state.collegeAdmin;
export const selectCollegeAdminSignOutOpen = (state) => state.collegeAdmin.signOutOpen;
export const selectCollegeTopbarUi = (state) => state.collegeAdmin.topbarUi;
export const selectCollegeActivityLogUi = (state) => state.collegeAdmin.activityLogUi;
export const selectCollegeAnnouncementsUi = (state) => state.collegeAdmin.announcementsUi;
export const selectCollegeMessagesUi = (state) => state.collegeAdmin.messagesUi;
export const selectCollegeOfficersUi = (state) => state.collegeAdmin.officersUi;
export const selectCollegeProfileUi = (state) => state.collegeAdmin.profileUi;
export const selectCollegeRecruitersUi = (state) => state.collegeAdmin.recruitersUi;

// Plain selectors: combine collegeAdmin UI state with collegesSlice, usersSlice, applicationsSlice, and messagesSlice.
export const selectCollegeAdminPlatform = (state) => {
  const collegeId = selectSession(state)?.collegeId;
  const college = selectCollegeById(state, collegeId);
  const request = state.collegeAdmin.platform;
  return {
    loading: request.loading,
    error: request.error,
    stats: null,
    data: {
      colleges: college ? [college] : [],
      officersByCollege: { [collegeId]: selectCollegeOfficers(state) },
      studentsByCollege: { [collegeId]: selectCollegeStudents(state) },
      alumniByCollege: { [collegeId]: selectCollegeAlumni(state) },
      recruitersByCollege: {},
      applicationsByCollege: { [collegeId]: selectWorkspaceApplications(state) },
    },
  };
};

export const selectUnreadCollegeMessages = (state) =>
  selectInboxMessages(state).filter((message) => Date.parse(message.sentAt) > state.collegeAdmin.inboxSeenAt).length;

export default collegeAdminSlice.reducer;
