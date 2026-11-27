// Redux Flow (roles/recruiter/store/recruiterSlice.js):
// 1. Backend API -> Thunks (createAsyncThunk, createSlice, fetchApplications, fetchAssessments, fetchNotifications, fetchOpportunities, loadRecruiterWorkspace, loadWorkspace) call apiFetch([local/UI state (no direct API call)]).
// 2. extraReducers/reducers update this slice in the Redux store.
// 3. UI components read state via useSelector(selectWorkspaceApplications, selectWorkspaceAssessments, selectInboxNotifications, selectWorkspaceOpportunities, selectCurrentUser, selectScheduleApplication, selectRecruiterSignOutOpen, selectRecruiterNavbarUi, selectRecruiterAppsUi, selectRecruiterAssessmentsUi, selectCandidateModalUi, selectCandidatesFilterUi, selectMyOpportunitiesUi, selectOpportunityEditorUi, selectOpportunityFieldsUi, selectPostOpportunityUi, selectRecruiterProfileUi, selectScheduleModalUi, selectRecruiterProfile, selectOpportunities, selectApplications, selectRecruiter, selectOpportunitiesWithCount) and update via dispatch(action).
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toApplication, toOpportunity } from '../data/api.js';
import { fetchApplications, selectWorkspaceApplications } from '../../../store/slices/applicationsSlice.js';
import { fetchAssessments, selectWorkspaceAssessments } from '../../../store/slices/assessmentsSlice.js';
import { fetchNotifications, selectInboxNotifications } from '../../../store/slices/notificationsSlice.js';
import { fetchOpportunities, selectWorkspaceOpportunities } from '../../../store/slices/opportunitiesSlice.js';
import { selectCurrentUser } from '../../../store/slices/usersSlice.js';

export const initialsOf = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'RC';

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

export const loadRecruiterWorkspace = createAsyncThunk(
  'recruiter/loadWorkspace',
  async (_, { dispatch, requestId }) => {
    dispatch(setRecruiterWorkspacePending(requestId));
    try {
      await Promise.all([
        dispatch(fetchOpportunities()).unwrap(),
        dispatch(fetchApplications()).unwrap(),
        dispatch(fetchAssessments()).unwrap(),
        dispatch(fetchNotifications()).unwrap().catch(() => {}),
      ]);
      dispatch(setRecruiterWorkspaceFulfilled(requestId));
    } catch (error) {
      dispatch(setRecruiterWorkspaceRejected({
        requestId,
        error: {
          message: error.message,
          response: error.response ? { data: error.response.data } : undefined,
        },
      }));
      throw error;
    }
  },
  {
    serializeError: (error) => ({
      message: error.message,
      response: error.response ? { data: error.response.data } : undefined,
    }),
  },
);

export const RECRUITER_TABS = [
  'dashboard',
  'post',
  'opportunities',
  'applications',
  'assessments',
  'candidates',
  'reports',
  'profile',
];

const initialState = {
  activeTab: 'dashboard',
  selectedRoleFilter: 'All Roles',
  scheduleFor: null,
  workspaceRequest: { id: null, status: 'idle', error: null },
  signOutOpen: false,
  navbarUi: { showNotifs: false, showProfileMenu: false },
  applicationsUi: { searchTerm: '', filterReferred: false, statusFilter: 'All', selectedCandidateId: null },
  assessmentsUi: { showScheduleModal: false },
  candidateModalUi: { showResumePreview: false, resumeBlob: '', resumeError: '', saving: false, feedback: '', rating: 5 },
  candidatesFilterUi: { role: 'All Roles', dept: [], minCgpa: '0', referredOnly: false, searchTerm: '', selectedIds: [], viewingCandidateId: null },
  myOpportunitiesUi: { editingId: null },
  opportunityEditorUi: { form: null, locations: [], amount: '', errors: {}, saving: false },
  opportunityFieldsUi: { locationCur: '', locationErr: '', skillCur: '', skillErr: '' },
  postOpportunityUi: {
    jobType: 'Full-Time',
    jobId: '', title: '', locations: [], ctcLpa: '', duration: '', compensation: '', cgpa: '', deadline: '', description: '',
    selectedBranches: [], skills: [], errors: {},
  },
  profileUi: { passwordOpen: false, saving: false, isEditing: false, formData: {}, errors: {} },
  scheduleModalUi: {
    title: '', jobId: '', selectedIds: [], search: '', saving: false,
    date: '', time: '10:00', duration: '60 min', platform: 'Google Meet',
    type: 'Technical Interview', link: '', errors: {},
  },
};

const recruiterSlice = createSlice({
  name: 'recruiter',
  initialState,
  reducers: {
    setRecruiterTab(state, action) {
      state.activeTab = action.payload;
    },
    setRecruiterRoleFilter(state, action) {
      state.selectedRoleFilter = action.payload;
    },
    selectScheduleApplication(state, action) {
      state.scheduleFor = action.payload;
    },
    openRecruiterSignOut(state) {
      state.signOutOpen = true;
    },
    closeRecruiterSignOut(state) {
      state.signOutOpen = false;
    },
    setRecruiterNavbarNotifs(state, action) {
      state.navbarUi.showNotifs = Boolean(action.payload);
    },
    setRecruiterNavbarProfileMenu(state, action) {
      state.navbarUi.showProfileMenu = Boolean(action.payload);
    },
    setRecruiterAppsSearch(state, action) {
      state.applicationsUi.searchTerm = action.payload;
    },
    setRecruiterAppsFilterReferred(state, action) {
      state.applicationsUi.filterReferred = Boolean(action.payload);
    },
    setRecruiterAppsStatusFilter(state, action) {
      state.applicationsUi.statusFilter = action.payload;
    },
    setRecruiterSelectedCandidateId(state, action) {
      state.applicationsUi.selectedCandidateId = action.payload;
    },
    setRecruiterShowScheduleModal(state, action) {
      state.assessmentsUi.showScheduleModal = Boolean(action.payload);
    },
    initCandidateModal(state, action) {
      const { showResumePreview = false, feedback = '', rating = 5 } = action.payload || {};
      state.candidateModalUi = {
        showResumePreview,
        resumeBlob: '',
        resumeError: '',
        saving: false,
        feedback,
        rating,
      };
    },
    setCandidateModalField(state, action) {
      const { field, value } = action.payload;
      state.candidateModalUi[field] = value;
    },
    setCandidatesFilterField(state, action) {
      const { field, value } = action.payload;
      state.candidatesFilterUi[field] = value;
    },
    toggleCandidatesFilterDept(state, action) {
      const d = action.payload;
      const list = state.candidatesFilterUi.dept;
      state.candidatesFilterUi.dept = list.includes(d) ? list.filter((x) => x !== d) : [...list, d];
    },
    toggleCandidatesFilterSelectedId(state, action) {
      const id = action.payload;
      const list = state.candidatesFilterUi.selectedIds;
      state.candidatesFilterUi.selectedIds = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
    },
    resetCandidatesFilter(state) {
      state.candidatesFilterUi = { role: 'All Roles', dept: [], minCgpa: '0', referredOnly: false, searchTerm: '', selectedIds: [], viewingCandidateId: null };
    },
    setMyOpportunitiesEditingId(state, action) {
      state.myOpportunitiesUi.editingId = action.payload;
    },
    initOpportunityEditor(state, action) {
      const { form, locations, amount } = action.payload;
      state.opportunityEditorUi = { form, locations, amount, errors: {}, saving: false };
    },
    setOpportunityEditorField(state, action) {
      const { field, value } = action.payload;
      if (state.opportunityEditorUi.form) {
        state.opportunityEditorUi.form[field] = value;
      }
    },
    setOpportunityEditorState(state, action) {
      Object.assign(state.opportunityEditorUi, action.payload);
    },
    setOpportunityFieldsUi(state, action) {
      Object.assign(state.opportunityFieldsUi, action.payload);
    },
    setPostOpportunityField(state, action) {
      const { field, value } = action.payload;
      state.postOpportunityUi[field] = value;
    },
    resetPostOpportunityForm(state, action) {
      state.postOpportunityUi = {
        jobType: action.payload || 'Full-Time',
        jobId: '', title: '', locations: [], ctcLpa: '', duration: '', compensation: '', cgpa: '', deadline: '', description: '',
        selectedBranches: [], skills: [], errors: {},
      };
    },
    initRecruiterProfileUi(state, action) {
      state.profileUi = { passwordOpen: false, saving: false, isEditing: false, formData: action.payload || {}, errors: {} };
    },
    setRecruiterProfileUi(state, action) {
      Object.assign(state.profileUi, action.payload);
    },
    setRecruiterProfileFormField(state, action) {
      const { field, value } = action.payload;
      state.profileUi.formData[field] = value;
    },
    initScheduleModalUi(state, action) {
      state.scheduleModalUi = {
        title: '', jobId: '', selectedIds: [], search: '', saving: false,
        date: '', time: '10:00', duration: '60 min', platform: 'Google Meet',
        type: 'Technical Interview', link: '', errors: {},
        ...(action.payload || {}),
      };
    },
    setScheduleModalField(state, action) {
      const { field, value } = action.payload;
      state.scheduleModalUi[field] = value;
    },
    setScheduleModalState(state, action) {
      Object.assign(state.scheduleModalUi, action.payload);
    },
    setRecruiterWorkspacePending(state, action) {
      state.workspaceRequest = { id: action.payload, status: 'pending', error: null };
    },
    setRecruiterWorkspaceFulfilled(state, action) {
      if (state.workspaceRequest.id !== action.payload) return;
      state.workspaceRequest.status = 'fulfilled';
    },
    setRecruiterWorkspaceRejected(state, action) {
      const { requestId, error } = action.payload;
      if (state.workspaceRequest.id !== requestId) return;
      state.workspaceRequest.status = 'rejected';
      state.workspaceRequest.error = error;
    },
  },
});

export const {
  setRecruiterTab,
  setRecruiterRoleFilter,
  selectScheduleApplication,
  openRecruiterSignOut,
  closeRecruiterSignOut,
  setRecruiterNavbarNotifs,
  setRecruiterNavbarProfileMenu,
  setRecruiterAppsSearch,
  setRecruiterAppsFilterReferred,
  setRecruiterAppsStatusFilter,
  setRecruiterSelectedCandidateId,
  setRecruiterShowScheduleModal,
  initCandidateModal,
  setCandidateModalField,
  setCandidatesFilterField,
  toggleCandidatesFilterDept,
  toggleCandidatesFilterSelectedId,
  resetCandidatesFilter,
  setMyOpportunitiesEditingId,
  initOpportunityEditor,
  setOpportunityEditorField,
  setOpportunityEditorState,
  setOpportunityFieldsUi,
  setPostOpportunityField,
  resetPostOpportunityForm,
  initRecruiterProfileUi,
  setRecruiterProfileUi,
  setRecruiterProfileFormField,
  initScheduleModalUi,
  setScheduleModalField,
  setScheduleModalState,
  setRecruiterWorkspacePending,
  setRecruiterWorkspaceFulfilled,
  setRecruiterWorkspaceRejected,
} = recruiterSlice.actions;

export const selectRecruiterSignOutOpen = (state) => state.recruiter.signOutOpen;
export const selectRecruiterNavbarUi = (state) => state.recruiter.navbarUi;
export const selectRecruiterAppsUi = (state) => state.recruiter.applicationsUi;
export const selectRecruiterAssessmentsUi = (state) => state.recruiter.assessmentsUi;
export const selectCandidateModalUi = (state) => state.recruiter.candidateModalUi;
export const selectCandidatesFilterUi = (state) => state.recruiter.candidatesFilterUi;
export const selectMyOpportunitiesUi = (state) => state.recruiter.myOpportunitiesUi;
export const selectOpportunityEditorUi = (state) => state.recruiter.opportunityEditorUi;
export const selectOpportunityFieldsUi = (state) => state.recruiter.opportunityFieldsUi;
export const selectPostOpportunityUi = (state) => state.recruiter.postOpportunityUi;
export const selectRecruiterProfileUi = (state) => state.recruiter.profileUi;
export const selectScheduleModalUi = (state) => state.recruiter.scheduleModalUi;

// Plain selectors: read recruiter UI state and combine with opportunitiesSlice, applicationsSlice, assessmentsSlice, notificationsSlice, and usersSlice.
const selectRecruiterProfile = (state) => recruiterFromSession(selectCurrentUser(state) ?? {});
const selectOpportunities = (state) => selectWorkspaceOpportunities(state).map(toOpportunity);
const selectApplications = (state) => selectWorkspaceApplications(state).map(toApplication);

export const selectRecruiter = (state) => ({
  activeTab: state.recruiter.activeTab,
  selectedRoleFilter: state.recruiter.selectedRoleFilter,
  scheduleFor: state.recruiter.scheduleFor,
  recruiter: selectRecruiterProfile(state),
  opportunities: selectOpportunities(state),
  applications: selectApplications(state),
  assessments: selectWorkspaceAssessments(state),
  notifications: selectInboxNotifications(state),
});

export const selectOpportunitiesWithCount = (state) => {
  const opportunities = selectOpportunities(state);
  const applications = selectApplications(state);
  return opportunities.map((opportunity) => ({
    ...opportunity,
    applications: applications.filter((application) => application.opportunityId === opportunity.id).length,
  }));
};

export default recruiterSlice.reducer;
