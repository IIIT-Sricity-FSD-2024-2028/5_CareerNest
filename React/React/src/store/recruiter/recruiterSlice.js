import { createSelector, createSlice } from '@reduxjs/toolkit';
import { addViewReducers } from '../viewState.js';
import { readSavedPage } from '../../shared/utils/navigationState.js';
import { entityListSelector } from '../entities.js';
import { selectCurrentUser } from '../operations.js';
import { toOpportunity, toApplication } from '../../roles/recruiter/data/api.js';
import { loadRecruiterWorkspace } from './recruiterRequests.js';

export const initialsOf = (name = '') => name.split(' ').filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'RC';

function recruiterFromSession(session = {}) {
  return {
    name: session.name || '',
    role: session.headline || 'Recruiter',
    email: session.email || '',
    avatar: session.avatar || initialsOf(session.name),
    company: session.company || '',
    department: session.department || '',
    phone: session.phone || '',
    location: session.location || '',
    joinedDate: session.joinedDate || '',
  };
}

export const RECRUITER_TABS = ['dashboard', 'post', 'opportunities', 'applications', 'assessments', 'candidates', 'reports', 'profile'];
export const RECRUITER_TAB_KEY = 'cn_active_recruiter_tab';

const recruiterSlice = createSlice({
  name: 'recruiter',
  initialState: () => ({
    views: {},
    activeTab: readSavedPage(RECRUITER_TAB_KEY, 'dashboard', RECRUITER_TABS),
    selectedRoleFilter: 'All Roles',
    scheduleFor: null,
    workspaceRequest: { id: null, status: 'idle', error: null },
  }),
  reducers: {
    tabChanged(state, { payload }) {
      state.activeTab = payload;
    },
    roleFilterChanged(state, { payload }) {
      state.selectedRoleFilter = payload;
    },
    scheduleSelectionChanged(state, { payload }) {
      state.scheduleFor = payload;
    },
  },
  extraReducers: (builder) => {
    addViewReducers(builder, 'recruiter');
    builder
      .addCase(loadRecruiterWorkspace.pending, (state, { meta }) => {
        state.workspaceRequest = { id: meta.requestId, status: 'pending', error: null };
      })
      .addCase(loadRecruiterWorkspace.fulfilled, (state, { meta }) => {
        if (state.workspaceRequest.id !== meta.requestId) return;
        state.workspaceRequest.status = 'fulfilled';
      })
      .addCase(loadRecruiterWorkspace.rejected, (state, { error, meta }) => {
        if (state.workspaceRequest.id !== meta.requestId) return;
        state.workspaceRequest.status = 'rejected';
        state.workspaceRequest.error = error;
      });
  },
});

export const recruiterActions = recruiterSlice.actions;
const selectRecruiterProfile = createSelector(
  [selectCurrentUser],
  (user) => recruiterFromSession(user ?? {}),
);
const selectOpportunities = createSelector(
  [entityListSelector('opportunities', 'workspace')],
  (items) => items.map(toOpportunity),
);
const selectApplications = createSelector(
  [entityListSelector('applications', 'workspace')],
  (items) => items.map(toApplication),
);
export const selectRecruiter = createSelector(
  [
    (state) => state.recruiter.activeTab,
    (state) => state.recruiter.selectedRoleFilter,
    (state) => state.recruiter.scheduleFor,
    selectRecruiterProfile,
    selectOpportunities,
    selectApplications,
    entityListSelector('assessments', 'workspace'),
    entityListSelector('notifications', 'inbox'),
  ],
  (activeTab, selectedRoleFilter, scheduleFor, recruiter, opportunities, applications, assessments, notifications) => ({
    activeTab, selectedRoleFilter, scheduleFor, recruiter, opportunities, applications, assessments, notifications,
  }),
);
export const selectOpportunitiesWithCount = createSelector(
  [selectOpportunities, selectApplications],
  (opportunities, applications) => opportunities.map((opportunity) => ({
    ...opportunity,
    applications: applications.filter((application) => application.opportunityId === opportunity.id).length,
  })),
);
export default recruiterSlice.reducer;
