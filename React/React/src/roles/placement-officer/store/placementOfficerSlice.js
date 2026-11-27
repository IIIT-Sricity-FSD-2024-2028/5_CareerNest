// Redux Flow (roles/placement-officer/store/placementOfficerSlice.js):
// 1. Backend API -> Thunks (createAsyncThunk, createSlice, fetchAnnouncements, fetchApplications, fetchAssessments, fetchNotifications, fetchOpportunities, fetchRecruiterRegistrations) call apiFetch([local/UI state (no direct API call)]).
// 2. extraReducers/reducers update this slice in the Redux store.
// 3. UI components read state via useSelector(selectWorkspaceAnnouncements, selectWorkspaceApplications, selectWorkspaceAssessments, selectInboxNotifications, selectWorkspaceOpportunities, selectRecruiterRegistrations, selectResource, selectOversightUsers, selectPlacementPage, selectOfficerRequest, selectPlacementSignOutOpen, selectPlacementHeaderUi, selectAppTrackingUi, selectBulkNotifyUi, selectPlacementCandidatesFilterUi, selectPlacementProfileUi, selectPlacementRecruitersUi, selectPlacementReviewUi, selectPlacementStatsUi, selectOfficerData) and update via dispatch(action).
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toOversightUser } from '../../../shared/utils/accountDirectory.js';
import { fetchAnnouncements, selectWorkspaceAnnouncements } from '../../../store/slices/announcementsSlice.js';
import { fetchApplications, selectWorkspaceApplications } from '../../../store/slices/applicationsSlice.js';
import { fetchAssessments, selectWorkspaceAssessments } from '../../../store/slices/assessmentsSlice.js';
import { fetchNotifications, selectInboxNotifications } from '../../../store/slices/notificationsSlice.js';
import { fetchOpportunities, selectWorkspaceOpportunities } from '../../../store/slices/opportunitiesSlice.js';
import { fetchRecruiterRegistrations, selectRecruiterRegistrations } from '../../../store/slices/recruitersSlice.js';
import { fetchOfficerPlacement, selectResource } from '../../../store/slices/resourcesSlice.js';
import { fetchOversightUsers, selectOversightUsers } from '../../../store/slices/usersSlice.js';

const BRANCH_COLORS = [
  { color: '#00c950', colorClass: 'green' },
  { color: '#10b981', colorClass: 'teal' },
  { color: '#f0b100', colorClass: 'orange' },
  { color: '#ef4444', colorClass: 'red' },
  { color: '#f59e0b', colorClass: 'amber' },
  { color: '#6366f1', colorClass: 'indigo' },
];
const AVATAR_COLORS = ['#7C3AED', '#4f46e5', '#f59e0b', '#ec4899', '#10b981', '#3b82f6'];
const hash = (text = '') => [...text].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
const normaliseOpportunityStatus = (status) => String(status || '').toLowerCase();

function toSubmission(o, applicantCount) {
  return {
    id: o.id,
    jobId: o.jobId,
    changedAfterApproval: o.changedAfterApproval,
    changedAfterApprovalAt: o.changedAfterApprovalAt,
    changedAfterApprovalFields: o.changedAfterApprovalFields,
    title: o.title,
    company: o.company,
    status: o.status === 'Published' ? 'published' : o.status,
    avatar: (o.company || '?')[0].toUpperCase(),
    avatarBg: AVATAR_COLORS[hash(o.company) % AVATAR_COLORS.length],
    type: o.type === 'Internship' ? 'internship' : 'placement',
    location: o.location,
    pkg: o.salary,
    openings: o.openings,
    duration: o.duration || '',
    submitter: o.submittedBy || 'Recruiter',
    submitted: o.createdAt
      ? new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      : '',
    deadline: o.deadline,
    desc: o.description || '',
    cgpa: o.cgpa,
    branches: (o.branches || []).join(', '),
    backlogs: o.backlogs || 'Not specified',
    skills: o.tags || [],
    rounds: o.rounds || '',
    applied: applicantCount,
    rejectionRemark: o.rejectionRemark,
    createdAt: o.createdAt || '',
  };
}

function toTrackedApplication(a) {
  return {
    id: a.id,
    candidateId: a.candidateId,
    candidate: a.candidateName,
    role: a.title,
    company: a.company,
    date: a.appliedDate,
    status: a.status,
    branch: a.branch || '',
    email: a.email || '',
    cgpa: a.cgpa,
    interviewDate: a.interviewDate || '',
    remarks: a.remarks || '',
  };
}

function buildOfficerViewData({ opps, apps, users, recruiters, placement, assessments, announcements, inbox }) {
  const students = users.filter((u) => u.role === 'candidate');
  const alumni = users.filter((u) => u.role === 'alumni');
  const reviewable = opps.filter((o) => !o.isDemo && ['pending', 'approved', 'rejected', 'published'].includes(normaliseOpportunityStatus(o.status)));
  const published = reviewable.filter((o) => normaliseOpportunityStatus(o.status) === 'published');
  const countFor = (id) => apps.filter((a) => a.opportunityId === id).length;
  const pendingOpps = reviewable.filter((o) => normaliseOpportunityStatus(o.status) === 'pending');
  const pendingRecruiters = recruiters.filter((r) => r.status === 'pending');
  const notifications = [
    ...pendingOpps.map((o, i) => ({
      id: `opp-${o.id}`, type: 'warning', title: 'Opportunity Pending Review',
      message: `${o.title} by ${o.company} is awaiting your review.`, time: 'Pending', href: 'p2.html', read: false, order: i,
    })),
    ...pendingRecruiters.map((r) => ({
      id: `rec-${r.id}`, type: 'recruiter', title: 'Recruiter Pending Verification',
      message: `${r.name} from ${r.company} is awaiting approval.`, time: 'Pending', href: 'p4.html', read: false,
    })),
    ...inbox.map((n) => ({
      id: `inbox-${n.id}`, type: 'info', title: n.title, message: n.message,
      time: n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '',
      href: '#', read: !!n.isRead, order: 100,
    })),
  ];
  const oppById = new Map(opps.map((o) => [o.id, o]));

  return {
    topCompanies: placement.topCompanies ?? [],
    monthlyTrend: placement.monthlyTrend ?? [],
    stats: {
      totalCandidates: placement.totalStudents ?? 0,
      placementRate: placement.placementRate ?? 0,
      highestPkg: placement.highestPackage ?? 0,
      companiesVisited: placement.companiesVisited ?? 0,
      totalApps: placement.totalApplications ?? 0,
      avgPkg: placement.avgPackage ?? 0,
      studentsPlaced: placement.totalPlaced ?? 0,
      offersMade: placement.totalOffers ?? 0,
      internships: placement.internshipApplications ?? 0,
      pending: pendingOpps.length,
      published: published.length,
      totalOpps: reviewable.length,
      totalApplicants: placement.uniqueApplicants ?? 0,
    },
    stakeholders: {
      candidates: students.length,
      recruiters: recruiters.length,
      activeDrives: published.length,
      alumni: alumni.length,
    },
    branches: (placement.byDept ?? []).map((b, i) => ({ name: b.dept, total: b.total, placed: b.placed, ...BRANCH_COLORS[i % BRANCH_COLORS.length] })),
    trend: placement.applicationTrend ?? { labels: [], fullTime: [], internships: [] },
    submissions: reviewable
      .slice()
      .sort((a, b) => {
        const priority = { pending: 0, approved: 1, published: 2, rejected: 3 };
        const statusOrder = priority[normaliseOpportunityStatus(a.status)] - priority[normaliseOpportunityStatus(b.status)];
        return statusOrder || (Date.parse(b.createdAt || '') || 0) - (Date.parse(a.createdAt || '') || 0) || b.id - a.id;
      })
      .map((o) => ({ ...toSubmission(o, countFor(o.id)), status: normaliseOpportunityStatus(o.status) })),
    drives: published
      .slice()
      .sort((a, b) => Date.parse(b.createdAt || '') - Date.parse(a.createdAt || '') || b.id - a.id)
      .slice(0, 5)
      .map((o) => {
        const applicants = countFor(o.id);
        return {
          company: o.company,
          role: o.title,
          badge: applicants ? `${applicants} applicant${applicants === 1 ? '' : 's'}` : 'Open for applications',
          badgeClass: applicants ? 'blue' : 'green',
        };
      }),
    interviews: assessments
      .filter((a) => !a.isDraft && /interview/i.test(a.type || ''))
      .filter((a) => !a.date || a.date >= new Date().toISOString().slice(0, 10))
      .slice()
      .sort((a, b) => {
        const dateOrder = String(a.date || '').localeCompare(String(b.date || ''));
        if (dateOrder) return dateOrder;
        return String(a.time || '').localeCompare(String(b.time || ''));
      })
      .slice(0, 5)
      .map((a) => ({
        id: a.id,
        company: a.company || oppById.get(a.opportunityId)?.company || 'Company to be confirmed',
        round: `${a.type}${a.candidates ? ` - ${a.candidates} candidate${a.candidates === 1 ? '' : 's'}` : ''}`,
        time: [a.date, a.time].filter(Boolean).join(' - ') || 'To be scheduled',
      })),
    recruiters,
    announcements: announcements.map((a) => ({
      id: a.id, title: a.title, message: a.message, type: a.type, author: a.author,
      date: new Date(a.postedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    })),
    users: users.filter((u) => ['candidate', 'alumni', 'recruiter'].includes(u.role)).map(toOversightUser),
    applications: apps.map(toTrackedApplication),
    notifications,
  };
}

export const loadOfficerData = createAsyncThunk(
  'placementOfficer/loadData',
  async (_, { dispatch, requestId }) => {
    dispatch(setOfficerRequestPending(requestId));
    try {
      await Promise.all([
        dispatch(fetchOpportunities()).unwrap(),
        dispatch(fetchApplications()).unwrap(),
        dispatch(fetchOversightUsers()).unwrap(),
        dispatch(fetchRecruiterRegistrations()).unwrap(),
        dispatch(fetchAssessments()).unwrap(),
        dispatch(fetchOfficerPlacement()).unwrap(),
        dispatch(fetchAnnouncements()).unwrap().catch(() => {}),
        dispatch(fetchNotifications()).unwrap().catch(() => {}),
      ]);
      dispatch(setOfficerRequestFulfilled(requestId));
    } catch (error) {
      dispatch(setOfficerRequestRejected(requestId));
      throw error;
    }
  },
  {
    condition: ({ force } = {}, { getState }) => force || getState().placementOfficer.request.id == null,
  },
);

export const PLACEMENT_PAGES = [
  'p1',
  'dashboard',
  'p2',
  'review',
  'p3',
  'statistics',
  'placement-dashboard',
  'dept-report',
  'p4',
  'recruiters',
  'p5',
  'oversight',
  'p6',
  'tracking',
  'bulk-notify',
  'profile',
];

const initialState = {
  currentPage: 'p1',
  request: { id: null, ready: false, error: '' },
  signOutOpen: false,
  headerUi: { profileOpen: false, notifOpen: false, searchQuery: '', searchResultsOpen: false, readIds: [] },
  appTrackingUi: { filter: 'all', search: '' },
  bulkNotifyUi: { title: '', message: '', targetGroup: 'students', sending: false, successInfo: '', sendError: '', formErrors: { title: '', message: '' } },
  candidatesFilterUi: { loadError: '', dept: '', minCgpa: '', maxBacklogs: '' },
  profileUi: { editingSection: null, draft: {}, isChangePasswordOpen: false },
  recruitersUi: {
    selectedRecruiterId: null, searchQuery: '', openProfileIdx: null, openVerifyIdx: null,
    openDeclineIdx: null, declineRemarks: '', declineError: false, credentials: null, copied: false,
  },
  reviewOpportunitiesUi: {
    activeStatus: 'all', typeFilter: 'all', openCards: {}, rejectModalOpen: false,
    rejectTarget: null, rejectRemarks: '', rejectError: false,
  },
  statisticsUi: { showFullTime: true, showInternships: true, activeTab: 'overview' },
};

const placementOfficerSlice = createSlice({
  name: 'placementOfficer',
  initialState,
  reducers: {
    setPlacementPage(state, action) {
      state.currentPage = action.payload;
    },
    openPlacementSignOut(state) {
      state.signOutOpen = true;
    },
    closePlacementSignOut(state) {
      state.signOutOpen = false;
    },
    setPlacementHeaderUi(state, action) {
      Object.assign(state.headerUi, action.payload);
    },
    setAppTrackingUi(state, action) {
      Object.assign(state.appTrackingUi, action.payload);
    },
    setBulkNotifyUi(state, action) {
      Object.assign(state.bulkNotifyUi, action.payload);
    },
    setPlacementCandidatesFilterUi(state, action) {
      Object.assign(state.candidatesFilterUi, action.payload);
    },
    setPlacementProfileUi(state, action) {
      Object.assign(state.profileUi, action.payload);
    },
    setPlacementRecruitersUi(state, action) {
      Object.assign(state.recruitersUi, action.payload);
    },
    setPlacementReviewUi(state, action) {
      Object.assign(state.reviewOpportunitiesUi, action.payload);
    },
    togglePlacementReviewCard(state, action) {
      const id = action.payload;
      state.reviewOpportunitiesUi.openCards[id] = !state.reviewOpportunitiesUi.openCards[id];
    },
    setPlacementStatsUi(state, action) {
      Object.assign(state.statisticsUi, action.payload);
    },
    setOfficerRequestPending(state, action) {
      state.request.id = action.payload;
    },
    setOfficerRequestFulfilled(state, action) {
      if (state.request.id === action.payload) state.request = { id: null, ready: true, error: '' };
    },
    setOfficerRequestRejected(state, action) {
      if (state.request.id !== action.payload) return;
      state.request.id = null;
      state.request.error = 'Could not load data from the server.';
    },
  },
});

export const {
  setPlacementPage,
  openPlacementSignOut,
  closePlacementSignOut,
  setPlacementHeaderUi,
  setAppTrackingUi,
  setBulkNotifyUi,
  setPlacementCandidatesFilterUi,
  setPlacementProfileUi,
  setPlacementRecruitersUi,
  setPlacementReviewUi,
  togglePlacementReviewCard,
  setPlacementStatsUi,
  setOfficerRequestPending,
  setOfficerRequestFulfilled,
  setOfficerRequestRejected,
} = placementOfficerSlice.actions;
export const selectPlacementPage = (state) => state.placementOfficer.currentPage;
export const selectOfficerRequest = (state) => state.placementOfficer.request;
export const selectPlacementSignOutOpen = (state) => state.placementOfficer.signOutOpen;
export const selectPlacementHeaderUi = (state) => state.placementOfficer.headerUi;
export const selectAppTrackingUi = (state) => state.placementOfficer.appTrackingUi;
export const selectBulkNotifyUi = (state) => state.placementOfficer.bulkNotifyUi;
export const selectPlacementCandidatesFilterUi = (state) => state.placementOfficer.candidatesFilterUi;
export const selectPlacementProfileUi = (state) => state.placementOfficer.profileUi;
export const selectPlacementRecruitersUi = (state) => state.placementOfficer.recruitersUi;
export const selectPlacementReviewUi = (state) => state.placementOfficer.reviewOpportunitiesUi;
export const selectPlacementStatsUi = (state) => state.placementOfficer.statisticsUi;
// Plain selector: builds placement officer dashboard/review/stats data from Redux slices.
export const selectOfficerData = (state) =>
  buildOfficerViewData({
    opps: selectWorkspaceOpportunities(state),
    apps: selectWorkspaceApplications(state),
    users: selectOversightUsers(state),
    recruiters: selectRecruiterRegistrations(state),
    placement: selectResource(state, 'officerPlacement') ?? {},
    assessments: selectWorkspaceAssessments(state),
    announcements: selectWorkspaceAnnouncements(state),
    inbox: selectInboxNotifications(state),
  });

export default placementOfficerSlice.reducer;
