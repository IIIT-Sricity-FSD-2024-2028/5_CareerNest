// Redux Flow (roles/alumni/store/alumniSlice.js):
// 1. Backend API -> Thunks (createSlice, loadError) call apiFetch([local/UI state (no direct API call)]).
// 2. extraReducers/reducers update this slice in the Redux store.
// 3. UI components read state via useSelector(selectReceivedReferrals, selectCurrentUser, selectAlumniSignOutOpen, selectAlumniNotificationsOpen, selectFadingCardId, selectDeclineModal, selectResumeModal, selectAlumniDirectoryUi, selectAlumniProfileUi, selectReferralsUi, selectAlumniReferrals, selectAlumni) and update via dispatch(action).
import { createSlice } from '@reduxjs/toolkit';
import { selectReceivedReferrals } from '../../../store/slices/referralsSlice.js';
import { selectCurrentUser } from '../../../store/slices/usersSlice.js';

export const initialsOf = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

const toReferral = (r) => {
  const raw = String(r.status || 'pending').toLowerCase();
  const status = raw === 'rejected' ? 'declined' : raw;
  return {
    id: r.id,
    initials: r.candidateInitials || r.initials || initialsOf(r.candidateName || r.name),
    name: r.candidateName || r.name,
    status,
    department: r.department || '',
    cgpa: r.cgpa ?? '',
    batch: r.batch || '',
    role: r.appliedRole || r.role,
    company: r.appliedCompany || r.company,
    salary: r.salary || '',
    location: r.location || '',
    skills: r.skills || [],
    message: r.userMessage || r.message,
    alumniNote: r.alumniResponse || r.alumniNote,
    updatedAt: r.requestedDate ? new Date(r.requestedDate).getTime() : Date.now(),
  };
};

const initialState = {
  activePage: 'dashboard',
  pageProps: {},
  loadError: '',
  signOutOpen: false,
  notificationsOpen: false,
  fadingCardId: null,
  declineModal: { reason: '', error: '' },
  resumeModal: { documentUrl: '', fileType: '', error: '', loading: false },
  directoryUi: { searchQuery: '', batch: '', dept: '', loading: false, errorMessage: '' },
  profileUi: {
    changePasswordOpen: false,
    isEditing: false,
    editFields: {},
    isEditingSocials: false,
    editSocials: {},
    newSkill: '',
    showAddSkill: false,
  },
  referralsUi: {
    currentFilter: 'all',
    searchQuery: '',
    openCards: {},
    replyMessages: {},
    resumeReferralId: null,
    declineReferralId: null,
  },
};

const alumniSlice = createSlice({
  name: 'alumni',
  initialState,
  reducers: {
    setAlumniPage(state, action) {
      state.activePage = action.payload.page;
      state.pageProps = action.payload.props;
    },
    setAlumniLoadError(state, action) {
      state.loadError = action.payload;
    },
    openAlumniSignOut(state) {
      state.signOutOpen = true;
    },
    closeAlumniSignOut(state) {
      state.signOutOpen = false;
    },
    toggleAlumniNotifications(state) {
      state.notificationsOpen = !state.notificationsOpen;
    },
    setFadingCardId(state, action) {
      state.fadingCardId = action.payload;
    },
    setDeclineReason(state, action) {
      state.declineModal.reason = action.payload;
      if (state.declineModal.error) state.declineModal.error = '';
    },
    setDeclineError(state, action) {
      state.declineModal.error = action.payload;
    },
    resetDeclineModal(state) {
      state.declineModal = { reason: '', error: '' };
    },
    resetResumeModal(state) {
      state.resumeModal = { documentUrl: '', fileType: '', error: '', loading: false };
    },
    setResumeLoading(state, action) {
      state.resumeModal.loading = Boolean(action.payload);
    },
    setResumeDocument(state, action) {
      state.resumeModal.documentUrl = action.payload.documentUrl;
      state.resumeModal.fileType = action.payload.fileType;
    },
    setResumeError(state, action) {
      state.resumeModal.error = action.payload;
    },
    setDirectorySearchQuery(state, action) {
      state.directoryUi.searchQuery = action.payload;
    },
    setDirectoryBatch(state, action) {
      state.directoryUi.batch = action.payload;
    },
    setDirectoryDept(state, action) {
      state.directoryUi.dept = action.payload;
    },
    clearDirectoryFilters(state) {
      state.directoryUi.searchQuery = '';
      state.directoryUi.batch = '';
      state.directoryUi.dept = '';
    },
    setDirectoryLoading(state, action) {
      state.directoryUi.loading = Boolean(action.payload);
    },
    setDirectoryError(state, action) {
      state.directoryUi.errorMessage = action.payload;
    },
    openAlumniChangePassword(state) {
      state.profileUi.changePasswordOpen = true;
    },
    closeAlumniChangePassword(state) {
      state.profileUi.changePasswordOpen = false;
    },
    startEditingAlumniProfile(state, action) {
      state.profileUi.editFields = action.payload;
      state.profileUi.isEditing = true;
    },
    setAlumniEditField(state, action) {
      const { field, value } = action.payload;
      state.profileUi.editFields[field] = value;
    },
    cancelEditingAlumniProfile(state) {
      state.profileUi.isEditing = false;
    },
    startEditingAlumniSocials(state, action) {
      state.profileUi.editSocials = action.payload;
      state.profileUi.isEditingSocials = true;
    },
    setAlumniSocialField(state, action) {
      const { field, value } = action.payload;
      state.profileUi.editSocials[field] = value;
    },
    cancelEditingAlumniSocials(state) {
      state.profileUi.isEditingSocials = false;
    },
    setAlumniNewSkill(state, action) {
      state.profileUi.newSkill = action.payload;
    },
    setShowAddAlumniSkill(state, action) {
      state.profileUi.showAddSkill = Boolean(action.payload);
    },
    initReferralsUi(state, action) {
      const { initialFilter = 'all', openCardId = null } = action.payload || {};
      state.referralsUi.currentFilter = initialFilter;
      state.referralsUi.openCards = openCardId ? { [openCardId]: true } : {};
    },
    setReferralsFilter(state, action) {
      state.referralsUi.currentFilter = action.payload;
    },
    setReferralsSearch(state, action) {
      state.referralsUi.searchQuery = action.payload;
    },
    toggleReferralCard(state, action) {
      const id = action.payload;
      state.referralsUi.openCards[id] = !state.referralsUi.openCards[id];
    },
    setReferralReplyMessage(state, action) {
      const { id, text } = action.payload;
      state.referralsUi.replyMessages[id] = text;
    },
    openResumeModal(state, action) {
      state.referralsUi.resumeReferralId = action.payload;
    },
    closeResumeModal(state) {
      state.referralsUi.resumeReferralId = null;
    },
    openDeclineModal(state, action) {
      state.referralsUi.declineReferralId = action.payload;
    },
    closeDeclineModal(state) {
      state.referralsUi.declineReferralId = null;
    },
  },
});

export const {
  setAlumniPage,
  setAlumniLoadError,
  openAlumniSignOut,
  closeAlumniSignOut,
  toggleAlumniNotifications,
  setFadingCardId,
  setDeclineReason,
  setDeclineError,
  resetDeclineModal,
  resetResumeModal,
  setResumeLoading,
  setResumeDocument,
  setResumeError,
  setDirectorySearchQuery,
  setDirectoryBatch,
  setDirectoryDept,
  clearDirectoryFilters,
  setDirectoryLoading,
  setDirectoryError,
  openAlumniChangePassword,
  closeAlumniChangePassword,
  startEditingAlumniProfile,
  setAlumniEditField,
  cancelEditingAlumniProfile,
  startEditingAlumniSocials,
  setAlumniSocialField,
  cancelEditingAlumniSocials,
  setAlumniNewSkill,
  setShowAddAlumniSkill,
  initReferralsUi,
  setReferralsFilter,
  setReferralsSearch,
  toggleReferralCard,
  setReferralReplyMessage,
  openResumeModal,
  closeResumeModal,
  openDeclineModal,
  closeDeclineModal,
} = alumniSlice.actions;

export const selectAlumniSignOutOpen = (state) => state.alumni.signOutOpen;
export const selectAlumniNotificationsOpen = (state) => state.alumni.notificationsOpen;
export const selectFadingCardId = (state) => state.alumni.fadingCardId;
export const selectDeclineModal = (state) => state.alumni.declineModal;
export const selectResumeModal = (state) => state.alumni.resumeModal;
export const selectAlumniDirectoryUi = (state) => state.alumni.directoryUi;
export const selectAlumniProfileUi = (state) => state.alumni.profileUi;
export const selectReferralsUi = (state) => state.alumni.referralsUi;

// Plain selectors: read alumni UI state and combine with usersSlice + referralsSlice data.
const selectAlumniReferrals = (state) => selectReceivedReferrals(state).map(toReferral);

export const selectAlumni = (state) => {
  const user = selectCurrentUser(state) ?? {};
  const referrals = selectAlumniReferrals(state);
  const personalInfo = {
    name: user.name || '',
    email: user.email || '',
    company: user.company || '',
    batch: String(user.batch || ''),
    role: user.headline || '',
    location: user.location || '',
    linkedin: user.socialLinks?.linkedin || '',
    github: user.socialLinks?.github || '',
    portfolio: user.socialLinks?.portfolio || '',
  };
  const alumniData = {
    initials: user.avatar || initialsOf(user.name),
    name: personalInfo.name,
    email: personalInfo.email,
    company: personalInfo.company,
    batch: user.batch || '',
    role: 'Alumni',
    totalReferrals: referrals.length,
    approved: referrals.filter((item) => item.status === 'approved').length,
  };
  return {
    activePage: state.alumni.activePage,
    pageProps: state.alumni.pageProps,
    alumniData,
    referrals,
    loadError: state.alumni.loadError,
    personalInfo,
    skillsList: user.skills || [],
  };
};

export default alumniSlice.reducer;
