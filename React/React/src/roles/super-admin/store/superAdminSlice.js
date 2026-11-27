// Redux Flow (roles/super-admin/store/superAdminSlice.js):
// 1. Backend API -> Thunks (createAsyncThunk, createSlice, fetchPlatformColleges, fetchPlatformStats, fetchUsers, refreshSuperAdminData, assignTargetId) call apiFetch([local/UI state (no direct API call)]).
// 2. extraReducers/reducers update this slice in the Redux store.
// 3. UI components read state via useSelector(selectSession, selectPlatformColleges, selectResource, selectCollegeOfficers, selectAdminCollege, selectSuperAdmin, selectSuperAdminSignOutOpen, selectSuperAdminTopbarUi, selectSuperAdminActivityLogUi, selectSuperAdminCollegeAdminsUi, selectSuperAdminCollegesUi, selectSuperAdminMessagesUi, selectSuperAdminProfileUi, selectSuperAdminPlatform) and update via dispatch(action).
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { selectSession } from '../../../store/slices/authSlice.js';
import { fetchPlatformColleges, selectPlatformColleges } from '../../../store/slices/collegesSlice.js';
import { fetchPlatformStats, selectResource } from '../../../store/slices/resourcesSlice.js';
import { fetchUsers, selectCollegeOfficers } from '../../../store/slices/usersSlice.js';

export const SUPER_ADMIN_TABS = ['dashboard', 'colleges', 'college-admins', 'activity', 'messages', 'profile'];

function byCollege(records) {
  const groups = {};
  for (const record of records) (groups[record.collegeId] ||= []).push(record);
  return groups;
}

export const refreshSuperAdminData = createAsyncThunk(
  'superAdmin/refreshSuperAdminData',
  async ({ silentAfterMutation = false } = {}, { dispatch, getState }) => {
    const { role } = selectSession(getState()) ?? {};
    if (role !== 'super_admin') return null;

    dispatch(setSuperAdminPlatformLoading());
    try {
      await Promise.all([
        dispatch(fetchPlatformColleges()).unwrap(),
        dispatch(fetchPlatformStats()).unwrap(),
        dispatch(fetchUsers('placement_officer')).unwrap().catch(() => {}),
      ]);
      dispatch(setSuperAdminPlatformSuccess(''));
      return null;
    } catch (error) {
      if (silentAfterMutation) {
        const warning = 'Changes were saved, but some data could not be refreshed.';
        dispatch(setSuperAdminPlatformSuccess(warning));
        return { warning };
      }
      dispatch(setSuperAdminPlatformError('Could not load data from the server.'));
      throw error;
    }
  },
);

const initialState = {
  activeTab: 'dashboard',
  adminCollegeId: null,
  platform: { loading: false, error: '' },
  signOutOpen: false,
  topbarUi: { dropdownOpen: false },
  activityLogUi: { loading: true, err: '', filter: 'all' },
  collegeAdminsUi: { form: { name: '', email: '', password: '' }, error: '', assignTargetId: null },
  collegesUi: { form: { name: '', code: '', email: '', phone: '', address: '', website: '' }, touched: {}, error: '', saving: false, showAdd: false, statusTarget: null },
  messagesUi: { toType: 'one', toId: '', subject: '', body: '', sending: false, formErr: '', loading: true, err: '', toast: null },
  profileUi: { loading: true, isEditing: false, fields: { name: '', email: '', phone: '', location: '', bio: '' }, saving: false, isChangePasswordOpen: false },
};

const superAdminSlice = createSlice({
  name: 'superAdmin',
  initialState,
  reducers: {
    setSuperAdminTab(state, action) {
      state.activeTab = action.payload;
      if (action.payload !== 'college-admins') state.adminCollegeId = null;
    },
    selectAdminCollege(state, action) {
      state.adminCollegeId = action.payload;
    },
    openSuperAdminSignOut(state) {
      state.signOutOpen = true;
    },
    closeSuperAdminSignOut(state) {
      state.signOutOpen = false;
    },
    setSuperAdminTopbarUi(state, action) {
      Object.assign(state.topbarUi, action.payload);
    },
    setSuperAdminActivityLogUi(state, action) {
      Object.assign(state.activityLogUi, action.payload);
    },
    setSuperAdminCollegeAdminsUi(state, action) {
      Object.assign(state.collegeAdminsUi, action.payload);
    },
    setSuperAdminCollegesUi(state, action) {
      Object.assign(state.collegesUi, action.payload);
    },
    setSuperAdminMessagesUi(state, action) {
      Object.assign(state.messagesUi, action.payload);
    },
    setSuperAdminProfileUi(state, action) {
      Object.assign(state.profileUi, action.payload);
    },
    setSuperAdminPlatformLoading(state) {
      state.platform.loading = true;
      state.platform.error = '';
    },
    setSuperAdminPlatformSuccess(state, action) {
      state.platform.loading = false;
      if (action.payload) state.platform.error = action.payload;
    },
    setSuperAdminPlatformError(state, action) {
      state.platform.loading = false;
      state.platform.error = action.payload || 'Could not load data from the server.';
    },
  },
});

export const {
  setSuperAdminTab,
  selectAdminCollege,
  openSuperAdminSignOut,
  closeSuperAdminSignOut,
  setSuperAdminTopbarUi,
  setSuperAdminActivityLogUi,
  setSuperAdminCollegeAdminsUi,
  setSuperAdminCollegesUi,
  setSuperAdminMessagesUi,
  setSuperAdminProfileUi,
  setSuperAdminPlatformLoading,
  setSuperAdminPlatformSuccess,
  setSuperAdminPlatformError,
} = superAdminSlice.actions;

export const selectSuperAdmin = (state) => state.superAdmin;
export const selectSuperAdminSignOutOpen = (state) => state.superAdmin.signOutOpen;
export const selectSuperAdminTopbarUi = (state) => state.superAdmin.topbarUi;
export const selectSuperAdminActivityLogUi = (state) => state.superAdmin.activityLogUi;
export const selectSuperAdminCollegeAdminsUi = (state) => state.superAdmin.collegeAdminsUi;
export const selectSuperAdminCollegesUi = (state) => state.superAdmin.collegesUi;
export const selectSuperAdminMessagesUi = (state) => state.superAdmin.messagesUi;
export const selectSuperAdminProfileUi = (state) => state.superAdmin.profileUi;

// Plain selector: combines collegesSlice, usersSlice, and resourcesSlice for SuperAdminApp.
export const selectSuperAdminPlatform = (state) => {
  const colleges = selectPlatformColleges(state);
  const officers = selectCollegeOfficers(state);
  const users = state.users.usersById;
  const stats = selectResource(state, 'platformStats');
  const request = state.superAdmin.platform;
  return {
    loading: request.loading,
    error: request.error,
    data: {
      colleges: colleges.map((college) => ({ ...college, admin: users[college.adminId] })),
      officersByCollege: byCollege(officers),
      studentsByCollege: {},
      alumniByCollege: {},
      recruitersByCollege: {},
      applicationsByCollege: {},
    },
    stats: stats ?? null,
  };
};

export default superAdminSlice.reducer;
