import { createSelector } from '@reduxjs/toolkit';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toOversightUser } from '../../../shared/utils/accountDirectory.js';
import { entityListSelector } from '../../../store/entities.js';
import { loadOfficerData } from '../../../store/placement-officer/officerCommands.js';
import { selectOfficerRequest } from '../../../store/placement-officer/placementOfficerSlice.js';
import { selectResource } from '../../../store/resourcesSlice.js';
import { selectWorkspaceVersion } from '../../../store/sessionSlice.js';

// Placement officer screens consume a shared live snapshot built from backend APIs.

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

function build({ opps, apps, users, recruiters, placement, assessments, announcements, inbox }) {
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
    // Real messages delivered to this officer (college announcements, platform notices)
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
    // A recruiter can schedule an interview for one applicant or everyone on
    // an opportunity. Drive-wide schedules do not change every application's
    // status, so the dashboard must use the assessment/interview records—not
    // application status—as its source of truth.
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

function normaliseOpportunityStatus(status) {
  return String(status || '').toLowerCase();
}

const selectOfficerData = createSelector(
  [
    entityListSelector('opportunities', 'workspace'),
    entityListSelector('applications', 'workspace'),
    entityListSelector('users', 'oversight'),
    entityListSelector('recruiterRegistrations', 'workspace'),
    (state) => selectResource(state, 'officerPlacement'),
    entityListSelector('assessments', 'workspace'),
    entityListSelector('announcements', 'workspace'),
    entityListSelector('notifications', 'inbox'),
  ],
  (opps, apps, users, recruiters, placement, assessments, announcements, inbox) =>
    build({ opps, apps, users, recruiters, placement: placement ?? {}, assessments, announcements, inbox }),
);

export function useOfficerData() {
  const dispatch = useDispatch();
  const workspaceVersion = useSelector(selectWorkspaceVersion);
  const data = useSelector(selectOfficerData);
  const { ready, error } = useSelector(selectOfficerRequest);
  const load = useCallback(() => dispatch(loadOfficerData({ workspaceVersion })), [dispatch, workspaceVersion]);
  const refresh = useCallback(
    () => dispatch(loadOfficerData({ workspaceVersion, force: true })).unwrap().then(() => true, () => false),
    [dispatch, workspaceVersion],
  );

  useEffect(() => {
    window.addEventListener('focus', load);
    load();
    return () => window.removeEventListener('focus', load);
  }, [load]);

  return { data, ready, error, refresh };
}
