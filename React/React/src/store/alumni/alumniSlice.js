import { createSelector, createSlice } from '@reduxjs/toolkit';
import { addViewReducers } from '../viewState.js';
import { readSavedPage } from '../../shared/utils/navigationState.js';
import { entityListSelector } from '../entities.js';
import { selectCurrentUser } from '../operations.js';

export const initialsOf = (name = '') => name.split(' ').filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

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

const ALUMNI_PAGES = ['dashboard', 'directory', 'profile', 'referrals'];
export const ALUMNI_PAGE_KEY = 'cn_active_alumni_page';

const alumniSlice = createSlice({
  name: 'alumni',
  initialState: () => ({
    views: {},
    activePage: readSavedPage(ALUMNI_PAGE_KEY, 'dashboard', ALUMNI_PAGES),
    pageProps: {},
    loadError: '',
  }),
  reducers: {
    pageChanged(state, { payload }) {
      state.activePage = payload.page;
      state.pageProps = payload.props;
    },
    loadErrorChanged(state, { payload }) {
      state.loadError = payload;
    },
  },
  extraReducers: (builder) => {
    addViewReducers(builder, 'alumni');
  },
});

export const alumniActions = alumniSlice.actions;
const selectAlumniReferrals = createSelector(
  [entityListSelector('referrals', 'received')],
  (referrals) => referrals.map(toReferral),
);
export const selectAlumni = createSelector(
  [
    (state) => state.alumni.activePage,
    (state) => state.alumni.pageProps,
    (state) => state.alumni.loadError,
    selectCurrentUser,
    selectAlumniReferrals,
  ],
  (activePage, pageProps, loadError, user, referrals) => {
    user ??= {};
    const personalInfo = {
      name: user.name || '', email: user.email || '', company: user.company || '',
      batch: String(user.batch || ''), role: user.headline || '', location: user.location || '',
      linkedin: user.socialLinks?.linkedin || '', github: user.socialLinks?.github || '',
      portfolio: user.socialLinks?.portfolio || '',
    };
    const alumniData = {
      initials: user.avatar || initialsOf(user.name),
      name: personalInfo.name, email: personalInfo.email, company: personalInfo.company,
      batch: user.batch || '', role: 'Alumni', totalReferrals: referrals.length,
      approved: referrals.filter((item) => item.status === 'approved').length,
    };
    return { activePage, pageProps, alumniData, referrals, loadError, personalInfo, skillsList: user.skills || [] };
  },
);
export default alumniSlice.reducer;
