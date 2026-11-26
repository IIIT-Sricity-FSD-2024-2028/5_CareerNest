import { createSelector, createSlice } from '@reduxjs/toolkit';
import { entityListSelector } from '../entities.js';
import { addViewReducers } from '../viewState.js';
import { readSavedPage } from '../../shared/utils/navigationState.js';

export const COLLEGE_ADMIN_TABS = ['dashboard', 'officers', 'students', 'alumni', 'recruiters', 'activity', 'announcements', 'messages', 'reports', 'profile'];
export const COLLEGE_ADMIN_TAB_KEY = 'cn_active_college_admin_tab';

const collegeAdminSlice = createSlice({
  name: 'collegeAdmin',
  initialState: () => ({
    views: {}, activeTab: readSavedPage(COLLEGE_ADMIN_TAB_KEY, 'dashboard', COLLEGE_ADMIN_TABS),
    inboxSeenAt: 0, platform: { loading: false, error: '' },
  }),
  reducers: {
    tabChanged(state, { payload }) {
      state.activeTab = payload;
    },
    inboxSeenTimeChanged(state, { payload }) {
      state.inboxSeenAt = payload;
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
    addViewReducers(builder, 'collegeAdmin');
  },
});

export const collegeAdminActions = collegeAdminSlice.actions;
export const selectCollegeAdmin = (state) => {
  const { views, ...workspace } = state.collegeAdmin;
  return workspace;
};
export const selectUnreadCollegeMessages = createSelector(
  [entityListSelector('messages', 'inbox'), (state) => state.collegeAdmin.inboxSeenAt],
  (messages, seenAt) => messages.filter((message) => Date.parse(message.sentAt) > seenAt).length,
);
export default collegeAdminSlice.reducer;
