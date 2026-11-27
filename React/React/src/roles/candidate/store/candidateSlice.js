// Redux Flow (roles/candidate/store/candidateSlice.js):
// 1. Backend API -> Thunks (createAsyncThunk, createSlice, fetchAnnouncements, createApplication, fetchMyApplications, withdrawApplication, fetchMyAssessments, fetchNotifications) call apiFetch([local/UI state (no direct API call)]).
// 2. extraReducers/reducers update this slice in the Redux store.
// 3. UI components read state via useSelector(selectWorkspaceAnnouncements, selectMyApplications, selectMyAssessments, selectSession, selectInboxNotifications, selectWorkspaceOpportunities, selectMyReferrals, selectMySavedDrives, selectOpportunityResume, selectCandidateToast, selectCandidateSignOutOpen, selectTrackerFilter, selectReferralsTab, selectApplicationsUi, selectOpportunitiesUi, selectCandidateProfileUi, selectCandidateProfile, selectCandidateNotifications, selectCandidateStore, selectCandidateWorkspace, selectCandidateUI, selectCandidateProfileSync, selectUnreadCandidateNotifications) and update via dispatch(action).
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { errorMessage } from '../../../services/api.js';
import { buildProfile, buildStore, profilePayload } from './candidateSnapshot.js';
import { fetchAnnouncements, selectWorkspaceAnnouncements } from '../../../store/slices/announcementsSlice.js';
import {
  createApplication,
  fetchMyApplications,
  selectMyApplications,
  withdrawApplication,
} from '../../../store/slices/applicationsSlice.js';
import { fetchMyAssessments, selectMyAssessments } from '../../../store/slices/assessmentsSlice.js';
import { selectSession } from '../../../store/slices/authSlice.js';
import { fetchNotifications, selectInboxNotifications } from '../../../store/slices/notificationsSlice.js';
import { fetchOpportunities, selectWorkspaceOpportunities } from '../../../store/slices/opportunitiesSlice.js';
import { createReferral, fetchMyReferrals, selectMyReferrals } from '../../../store/slices/referralsSlice.js';
import { fetchSavedDrives, selectMySavedDrives } from '../../../store/slices/savedDrivesSlice.js';
import { fetchUserById, updateUser } from '../../../store/slices/usersSlice.js';

const emptyUI = {
  notifOpen: false,
  askQueryOpen: false,
  queryMessage: '',
  successModal: { open: false, title: 'Success!', message: 'Operation completed.' },
};

export const loadCandidateSnapshot = createAsyncThunk(
  'candidate/loadSnapshot',
  async ({ silent = false } = {}, { dispatch, getState, rejectWithValue }) => {
    const id = selectSession(getState())?.id;
    if (!id) {
      dispatch(applyCandidateSnapshot({ snapshot: null, silent }));
      return null;
    }

    try {
      const [userResult] = await Promise.all([
        dispatch(fetchUserById(id)).unwrap(),
        dispatch(fetchOpportunities()).unwrap(),
        dispatch(fetchMyApplications()).unwrap(),
        dispatch(fetchNotifications()).unwrap(),
        dispatch(fetchSavedDrives()).unwrap(),
        dispatch(fetchMyAssessments()).unwrap(),
        dispatch(fetchMyReferrals()).unwrap(),
        dispatch(fetchAnnouncements()).unwrap(),
      ]);
      const snapshot = userResult ? buildProfile(userResult) : null;
      dispatch(applyCandidateSnapshot({ snapshot, silent }));
      return snapshot;
    } catch (error) {
      const msg = errorMessage(error, 'Could not load your data.');
      if (!silent) dispatch(setCandidateLoadError(msg));
      return rejectWithValue(msg);
    }
  },
);

export const saveCandidateProfile = createAsyncThunk(
  'candidate/saveProfile',
  async ({ id, payload }, { dispatch }) => {
    await dispatch(updateUser({ id, data: payload })).unwrap();
    const saved = JSON.stringify(payload);
    dispatch(setCandidateLastSaved(saved));
    return saved;
  },
);

export const applyToJob = createAsyncThunk(
  'candidate/applyToJob',
  async ({ job, resumeFile, resumeUrl }, { dispatch }) => {
    if (!resumeUrl) throw new Error('Select an uploaded resume before applying.');
    await dispatch(createApplication({
      opportunityId: job.id,
      resumeFile: resumeFile || undefined,
      resumeUrl,
    })).unwrap();
    await dispatch(loadCandidateSnapshot({ silent: true })).unwrap().catch(() => {
      dispatch(setCandidateRefreshWarning('Changes were saved, but some data could not be refreshed.'));
    });
  },
);

export const withdrawCandidateApplication = createAsyncThunk(
  'candidate/withdrawApplication',
  async (applicationId, { dispatch }) => {
    await dispatch(withdrawApplication(applicationId)).unwrap();
    await dispatch(loadCandidateSnapshot({ silent: true })).unwrap().catch(() => {
      dispatch(setCandidateRefreshWarning('Changes were saved, but some data could not be refreshed.'));
    });
  },
);

export const requestCandidateReferral = createAsyncThunk(
  'candidate/requestReferral',
  async ({ applicationId, opportunityId, alumniId, message }, { dispatch }) => {
    await dispatch(createReferral({
      opportunityId,
      applicationId,
      alumniId,
      userMessage: message,
    })).unwrap();
    await dispatch(loadCandidateSnapshot({ silent: true })).unwrap().catch(() => {
      dispatch(setCandidateRefreshWarning('Changes were saved, but some data could not be refreshed.'));
    });
  },
);

const initialState = {
  profileDraft: buildProfile(),
  eligibility: {},
  notices: [],
  loading: true,
  loadError: '',
  refreshWarning: '',
  ui: emptyUI,
  toast: { show: false, message: '' },
  signOutOpen: false,
  trackerFilter: 'All',
  referralsTab: 'all',
  applicationsUi: {
    filter: 'All',
    search: '',
    expandedId: null,
    referralAppId: null,
    notice: { type: '', text: '' },
    referralModal: {
      loaded: false,
      selectedId: null,
      message: 'Hi! I have applied for this role and would appreciate a referral if you think my profile is a good fit.',
      sending: false,
      error: '',
    },
  },
  opportunitiesUi: {
    activeJobId: null,
    typeFilter: 'All',
    query: '',
    showAdvanced: false,
    advanced: { location: '', branch: 'Any', minLpa: '', sort: 'latest' },
    applyError: '',
    eligibilityInfo: null,
    termsOpen: false,
    termsChecked: false,
    successOpen: false,
    pendingApplyJobId: null,
    applyStep: 1,
    selectedResume: null,
    selectedResumeUrl: null,
    contactPhone: '',
    contactLinkedin: '',
    workEligibility: 'yes',
    experience: '0',
    coverLetter: '',
  },
  profileUi: {
    modal: null,
    recordType: null,
    imageOptionsTarget: null,
    confirmDelete: null,
    introForm: {
      name: '', email: '', headline: '', university: '', batch: '',
      location: '', phone: '', github: '', linkedin: '', portfolio: '',
    },
    aboutText: '',
    skillInput: '',
    langForm: { name: '', level: 'Native' },
    codingForm: { platform: '', url: '', handle: '' },
    recordForm: { title: '', subtitle: '', start: '', end: '', link: '', desc: '', imageBase64: '' },
  },
  profileSync: { hydrated: false, lastSaved: '' },
};

const candidateSlice = createSlice({
  name: 'candidate',
  initialState,
  reducers: {
    finishCandidateLoad(state) {
      state.loading = false;
    },
    setCandidateRefreshWarning(state, action) {
      state.refreshWarning = action.payload;
    },
    markLocalNotificationsRead(state) {
      state.notices.forEach((notification) => {
        notification.isRead = true;
      });
    },
    markJobEligibilityChecked(state, action) {
      state.eligibility[action.payload] = true;
    },
    addUploadedResume(state, action) {
      const resume = state.profileDraft.profileResumeData;
      resume.uploadedResume = action.payload;
      resume.resumeHistory = [action.payload, ...(resume.resumeHistory || [])];
    },
    saveProfileIntro(state, action) {
      const { github, linkedin, portfolio, ...intro } = action.payload;
      const user = state.profileDraft.currentUser;
      Object.assign(user, intro, { socialLinks: { github, linkedin, portfolio } });
      const parts = user.name.split(' ');
      user.avatar = parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
    },
    saveProfileAbout(state, action) {
      state.profileDraft.currentUser.about = action.payload;
    },
    addResumeRecord(state, action) {
      const { section, record } = action.payload;
      (state.profileDraft.profileResumeData[section] ||= []).push(record);
    },
    removeResumeRecord(state, action) {
      const { type, index } = action.payload;
      const records = state.profileDraft.profileResumeData[type];
      if (records) records.splice(index, 1);
      state.notices.unshift({ title: 'Record Deleted', message: 'Item removed successfully from your profile.', isRead: false });
    },
    removeProfileImage(state, action) {
      state.profileDraft.currentUser[action.payload] = '';
      state.notices.unshift({ title: 'Image Deleted', message: 'Media successfully removed from your profile.', isRead: false });
    },
    uploadProfileImage(state, action) {
      const { target, image } = action.payload;
      if (target === 'banner') state.profileDraft.currentUser.bannerImage = image;
      if (target === 'avatar') state.profileDraft.currentUser.avatarImage = image;
    },
    addCandidateDocument(state, action) {
      const document = action.payload;
      (state.profileDraft.profileResumeData.additionalDocs ||= []).push(document);
      state.notices.unshift({
        title: 'Document Uploaded',
        message: `Successfully uploaded ${document.name}.`,
        isRead: false,
      });
    },
    toggleCandidateNotifications(state) {
      state.ui.notifOpen = !state.ui.notifOpen;
    },
    closeCandidateNotifications(state) {
      state.ui.notifOpen = false;
    },
    openQueryModal(state) {
      state.ui.queryMessage = '';
      state.ui.askQueryOpen = true;
    },
    closeQueryModal(state) {
      state.ui.askQueryOpen = false;
    },
    setQueryMessage(state, action) {
      state.ui.queryMessage = action.payload;
    },
    submitCandidateQuery(state) {
      state.ui.askQueryOpen = false;
      state.ui.queryMessage = '';
      state.ui.successModal = {
        open: true,
        title: 'Query Sent',
        message: 'Your query was sent successfully. We will get back to you shortly.',
      };
    },
    openSuccessModal(state, action) {
      const { title, message } = action.payload;
      state.ui.successModal = { open: true, title, message };
    },
    closeSuccessModal(state) {
      state.ui.successModal.open = false;
    },
    showCandidateToast(state, action) {
      state.toast = { show: true, message: action.payload };
    },
    hideCandidateToast(state) {
      state.toast.show = false;
    },
    openCandidateSignOut(state) {
      state.signOutOpen = true;
    },
    closeCandidateSignOut(state) {
      state.signOutOpen = false;
    },
    setTrackerFilter(state, action) {
      state.trackerFilter = action.payload;
    },
    setReferralsTab(state, action) {
      state.referralsTab = action.payload;
    },
    setApplicationsFilter(state, action) {
      state.applicationsUi.filter = action.payload;
    },
    setApplicationsSearch(state, action) {
      state.applicationsUi.search = action.payload;
    },
    setApplicationsExpandedId(state, action) {
      state.applicationsUi.expandedId = action.payload;
    },
    openApplicationReferralModal(state, action) {
      state.applicationsUi.referralAppId = action.payload;
      state.applicationsUi.referralModal = {
        loaded: false,
        selectedId: null,
        message: 'Hi! I have applied for this role and would appreciate a referral if you think my profile is a good fit.',
        sending: false,
        error: '',
      };
    },
    closeApplicationReferralModal(state) {
      state.applicationsUi.referralAppId = null;
    },
    setApplicationsNotice(state, action) {
      state.applicationsUi.notice = action.payload;
    },
    setReferralModalLoaded(state, action) {
      state.applicationsUi.referralModal.loaded = Boolean(action.payload);
    },
    setReferralModalSelectedId(state, action) {
      state.applicationsUi.referralModal.selectedId = action.payload;
    },
    setReferralModalMessage(state, action) {
      state.applicationsUi.referralModal.message = action.payload;
    },
    setReferralModalSending(state, action) {
      state.applicationsUi.referralModal.sending = Boolean(action.payload);
    },
    setReferralModalError(state, action) {
      state.applicationsUi.referralModal.error = action.payload;
    },
    setActiveOpportunityId(state, action) {
      state.opportunitiesUi.activeJobId = action.payload;
    },
    setOpportunityTypeFilter(state, action) {
      state.opportunitiesUi.typeFilter = action.payload;
    },
    setOpportunityQuery(state, action) {
      state.opportunitiesUi.query = action.payload;
    },
    toggleOpportunityAdvanced(state) {
      state.opportunitiesUi.showAdvanced = !state.opportunitiesUi.showAdvanced;
    },
    setOpportunityAdvancedField(state, action) {
      const { field, value } = action.payload;
      state.opportunitiesUi.advanced[field] = value;
    },
    resetOpportunityAdvanced(state) {
      state.opportunitiesUi.advanced = { location: '', branch: 'Any', minLpa: '', sort: 'latest' };
    },
    setOpportunityApplyError(state, action) {
      state.opportunitiesUi.applyError = action.payload;
    },
    setOpportunityEligibilityInfo(state, action) {
      state.opportunitiesUi.eligibilityInfo = action.payload;
    },
    openOpportunityApplyModal(state, action) {
      const { jobId, selectedResume, selectedResumeUrl } = action.payload;
      state.opportunitiesUi.eligibilityInfo = null;
      state.opportunitiesUi.termsChecked = false;
      state.opportunitiesUi.applyStep = 1;
      state.opportunitiesUi.selectedResume = selectedResume;
      state.opportunitiesUi.selectedResumeUrl = selectedResumeUrl;
      state.opportunitiesUi.pendingApplyJobId = jobId;
      state.opportunitiesUi.termsOpen = true;
    },
    closeOpportunityApplyModal(state) {
      state.opportunitiesUi.termsOpen = false;
    },
    setOpportunityTermsChecked(state, action) {
      state.opportunitiesUi.termsChecked = Boolean(action.payload);
    },
    openOpportunitySuccessModal(state) {
      state.opportunitiesUi.successOpen = true;
    },
    closeOpportunitySuccessModal(state) {
      state.opportunitiesUi.successOpen = false;
    },
    setOpportunityApplyStep(state, action) {
      state.opportunitiesUi.applyStep = action.payload;
    },
    selectOpportunityResume(state, action) {
      state.opportunitiesUi.selectedResume = action.payload.name;
      state.opportunitiesUi.selectedResumeUrl = action.payload.resumeUrl;
    },
    initOpportunityContactStep(state, action) {
      state.opportunitiesUi.contactPhone = action.payload?.phone ?? '';
      state.opportunitiesUi.contactLinkedin = action.payload?.linkedin ?? '';
    },
    setOpportunityContactField(state, action) {
      const { field, value } = action.payload;
      state.opportunitiesUi[field] = value;
    },
    setOpportunityQuestionField(state, action) {
      const { field, value } = action.payload;
      state.opportunitiesUi[field] = value;
    },
    openProfileIntroModal(state, action) {
      state.profileUi.introForm = action.payload;
      state.profileUi.modal = 'intro';
    },
    openProfileAboutModal(state, action) {
      state.profileUi.aboutText = action.payload || '';
      state.profileUi.modal = 'about';
    },
    openProfileSkillsModal(state) {
      state.profileUi.skillInput = '';
      state.profileUi.modal = 'skills';
    },
    openProfileLanguagesModal(state) {
      state.profileUi.langForm = { name: '', level: 'Native' };
      state.profileUi.modal = 'languages';
    },
    openProfileCodingModal(state) {
      state.profileUi.codingForm = { platform: '', url: '', handle: '' };
      state.profileUi.modal = 'codingProfiles';
    },
    openProfileRecordModal(state, action) {
      state.profileUi.recordType = action.payload;
      state.profileUi.recordForm = { title: '', subtitle: '', start: '', end: '', link: '', desc: '', imageBase64: '' };
      state.profileUi.modal = 'record';
    },
    closeProfileModal(state) {
      state.profileUi.modal = null;
    },
    setProfileIntroField(state, action) {
      const { field, value } = action.payload;
      state.profileUi.introForm[field] = value;
    },
    setProfileAboutText(state, action) {
      state.profileUi.aboutText = action.payload;
    },
    setProfileSkillInput(state, action) {
      state.profileUi.skillInput = action.payload;
    },
    setProfileLangField(state, action) {
      const { field, value } = action.payload;
      state.profileUi.langForm[field] = value;
    },
    setProfileCodingField(state, action) {
      const { field, value } = action.payload;
      state.profileUi.codingForm[field] = value;
    },
    setProfileRecordField(state, action) {
      const { field, value } = action.payload;
      state.profileUi.recordForm[field] = value;
    },
    setProfileImageOptionsTarget(state, action) {
      state.profileUi.imageOptionsTarget = action.payload;
    },
    setProfileConfirmDelete(state, action) {
      state.profileUi.confirmDelete = action.payload;
    },
    applyCandidateSnapshot(state, action) {
      const { snapshot, silent } = action.payload || {};
      if (!snapshot) {
        state.loading = false;
        return;
      }
      // A background refresh must preserve profile edits in progress.
      if (!state.profileSync.hydrated || !silent) {
        state.profileDraft = snapshot;
        state.profileSync.lastSaved = JSON.stringify(profilePayload(snapshot));
      }
      state.profileSync.hydrated = true;
      state.loadError = '';
      state.refreshWarning = '';
    },
    setCandidateLoadError(state, action) {
      state.loadError = action.payload || '';
    },
    setCandidateLastSaved(state, action) {
      state.profileSync.lastSaved = action.payload;
    },
  },
});

export const {
  applyCandidateSnapshot,
  setCandidateLoadError,
  setCandidateLastSaved,
  finishCandidateLoad,
  setCandidateRefreshWarning,
  markLocalNotificationsRead,
  markJobEligibilityChecked,
  addUploadedResume,
  saveProfileIntro,
  saveProfileAbout,
  addResumeRecord,
  removeResumeRecord,
  removeProfileImage,
  uploadProfileImage,
  addCandidateDocument,
  toggleCandidateNotifications,
  closeCandidateNotifications,
  openQueryModal,
  closeQueryModal,
  setQueryMessage,
  submitCandidateQuery,
  openSuccessModal,
  closeSuccessModal,
  showCandidateToast,
  hideCandidateToast,
  openCandidateSignOut,
  closeCandidateSignOut,
  setTrackerFilter,
  setReferralsTab,
  setApplicationsFilter,
  setApplicationsSearch,
  setApplicationsExpandedId,
  openApplicationReferralModal,
  closeApplicationReferralModal,
  setApplicationsNotice,
  setReferralModalLoaded,
  setReferralModalSelectedId,
  setReferralModalMessage,
  setReferralModalSending,
  setReferralModalError,
  setActiveOpportunityId,
  setOpportunityTypeFilter,
  setOpportunityQuery,
  toggleOpportunityAdvanced,
  setOpportunityAdvancedField,
  resetOpportunityAdvanced,
  setOpportunityApplyError,
  setOpportunityEligibilityInfo,
  openOpportunityApplyModal,
  closeOpportunityApplyModal,
  setOpportunityTermsChecked,
  openOpportunitySuccessModal,
  closeOpportunitySuccessModal,
  setOpportunityApplyStep,
  selectOpportunityResume,
  initOpportunityContactStep,
  setOpportunityContactField,
  setOpportunityQuestionField,
  openProfileIntroModal,
  openProfileAboutModal,
  openProfileSkillsModal,
  openProfileLanguagesModal,
  openProfileCodingModal,
  openProfileRecordModal,
  closeProfileModal,
  setProfileIntroField,
  setProfileAboutText,
  setProfileSkillInput,
  setProfileLangField,
  setProfileCodingField,
  setProfileRecordField,
  setProfileImageOptionsTarget,
  setProfileConfirmDelete,
} = candidateSlice.actions;

export const selectCandidateToast = (state) => state.candidate.toast;
export const selectCandidateSignOutOpen = (state) => state.candidate.signOutOpen;
export const selectTrackerFilter = (state) => state.candidate.trackerFilter;
export const selectReferralsTab = (state) => state.candidate.referralsTab;
export const selectApplicationsUi = (state) => state.candidate.applicationsUi;
export const selectOpportunitiesUi = (state) => state.candidate.opportunitiesUi;
export const selectCandidateProfileUi = (state) => state.candidate.profileUi;

export const selectCandidateProfile = (state) => state.candidate.profileDraft;
export const selectCandidateNotifications = (state) => [
  ...state.candidate.notices,
  ...selectInboxNotifications(state),
];
// Plain selector: builds the candidate dashboard/workspace view from Redux slices.
export const selectCandidateStore = (state) =>
  buildStore({
    profile: selectCandidateProfile(state),
    eligibility: state.candidate.eligibility,
    jobs: selectWorkspaceOpportunities(state),
    applications: selectMyApplications(state),
    notifications: selectCandidateNotifications(state),
    savedIds: selectMySavedDrives(state).map((drive) => drive.id),
    schedule: selectMyAssessments(state),
    referrals: selectMyReferrals(state),
    announcements: selectWorkspaceAnnouncements(state),
  });
export const selectCandidateWorkspace = (state) => {
  const { loading, loadError, refreshWarning } = state.candidate;
  return { store: selectCandidateStore(state), loading, loadError, refreshWarning };
};
export const selectCandidateUI = (state) => state.candidate.ui;
export const selectCandidateProfileSync = (state) => state.candidate.profileSync;
// Company suffixes are not useful for referral eligibility. This permits an
// alumnus at "TechCorp Solutions" to be discovered for a "TechCorp" drive,
// while still requiring the same underlying company name.
const COMPANY_SUFFIXES = new Set([
  'and', 'co', 'company', 'corp', 'corporation', 'inc', 'incorporated',
  'limited', 'llc', 'llp', 'private', 'pvt', 'service', 'services',
  'solution', 'solutions', 'technologies', 'technology', 'ltd',
]);

export function referralCompanyKey(company) {
  return String(company || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter((word) => word && !COMPANY_SUFFIXES.has(word))
    .join(' ');
}

export const selectUnreadCandidateNotifications = (state) =>
  selectCandidateNotifications(state).filter((notification) => !notification.isRead).length;

export default candidateSlice.reducer;
