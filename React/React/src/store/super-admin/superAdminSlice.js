import { createSlice } from '@reduxjs/toolkit';
import { addViewReducers } from '../viewState.js';
import { readSavedPage } from '../../shared/utils/navigationState.js';

export const SUPER_ADMIN_TABS = ['dashboard', 'colleges', 'college-admins', 'activity', 'messages', 'profile'];
export const SUPER_ADMIN_TAB_KEY = 'cn_active_super_admin_tab';

const superAdminSlice = createSlice({
  name: 'superAdmin',
  initialState: () => ({ views: {}, activeTab: readSavedPage(SUPER_ADMIN_TAB_KEY, 'dashboard', SUPER_ADMIN_TABS), adminCollegeId: null, platform: { loading: false, error: '' } }),
  reducers: {
    tabChanged(state, { payload }) {
      state.activeTab = payload;
      if (payload !== 'college-admins') state.adminCollegeId = null;
    },
    adminCollegeChanged(state, { payload }) {
      state.adminCollegeId = payload;
    },
    platformLoadStarted(state) {
      state.platform.loading = true;
      state.platform.error = '';
    },
    platformLoadFailed(state, { payload }) {
      state.platform.error = payload;
    },
    platformLoadFinished(state) {
      state.platform.loading = false;
    },
  },
  extraReducers: (builder) => {
    addViewReducers(builder, 'superAdmin');
  },
});

export const superAdminActions = superAdminSlice.actions;
export const selectSuperAdmin = (state) => {
  const { views, ...workspace } = state.superAdmin;
  return workspace;
};
export default superAdminSlice.reducer;
