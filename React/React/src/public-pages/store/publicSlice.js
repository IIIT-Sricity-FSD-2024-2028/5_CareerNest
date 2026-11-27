// Redux Flow (public-pages/store/publicSlice.js):
// 1. Backend API -> Thunks (createSlice, submitRecruiterContact, loadTheme) call apiFetch([local/UI state (no direct API call)]).
// 2. extraReducers/reducers update this slice in the Redux store.
// 3. UI components read state via useSelector(selectFeatureRole, selectTheme, selectLandingContent, selectNavScrolled, selectHeroImageIndex, selectActiveFeatureRole, selectActiveFaqIndex, selectStatsStarted, selectStatsValues, selectNewsletterEmail, selectNewsletterSubscribed, selectContactForm, selectContactTouched, selectContactStatus) and update via dispatch(action).
import { createSlice } from '@reduxjs/toolkit';
import { landingContent } from '../landing/data/landingContent.js';

export function readTheme() {
  const saved = localStorage.getItem('careernest-theme');
  return saved === 'light' || saved === 'dark' ? saved : 'dark';
}

const EMPTY_CONTACT_FORM = {
  name: '',
  company: '',
  role: '',
  email: '',
  phone: '',
  collegeId: '',
  message: '',
};

const initialState = {
  theme: 'dark',
  landingContent,
  navScrolled: false,
  heroImageIndex: 0,
  activeFeatureRole: 'candidate',
  activeFaqIndex: null,
  statsStarted: false,
  statsValues: landingContent.stats.map(() => 0),
  newsletterEmail: '',
  newsletterSubscribed: false,
  contactForm: EMPTY_CONTACT_FORM,
  contactTouched: {},
  contactStatus: { state: 'idle', text: '' },
};

const publicSlice = createSlice({
  name: 'publicPages',
  initialState,
  reducers: {
    loadTheme(state, action) {
      state.theme = action.payload;
    },
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    setNavScrolled(state, action) {
      state.navScrolled = Boolean(action.payload);
    },
    advanceHeroImage(state) {
      const count = state.landingContent.heroImages.length;
      if (count > 0) {
        state.heroImageIndex = (state.heroImageIndex + 1) % count;
      }
    },
    selectFeatureRole(state, action) {
      state.activeFeatureRole = action.payload;
    },
    toggleFaqItem(state, action) {
      const index = action.payload;
      state.activeFaqIndex = state.activeFaqIndex === index ? null : index;
    },
    startStatsAnimation(state) {
      state.statsStarted = true;
    },
    setStatsValues(state, action) {
      state.statsValues = action.payload;
    },
    setNewsletterEmail(state, action) {
      state.newsletterEmail = action.payload;
    },
    subscribeNewsletter(state) {
      state.newsletterSubscribed = true;
      state.newsletterEmail = '';
    },
    resetNewsletterSubscribed(state) {
      state.newsletterSubscribed = false;
    },
    setContactField(state, action) {
      const { field, value } = action.payload;
      state.contactForm[field] = value;
    },
    touchContactField(state, action) {
      state.contactTouched[action.payload] = true;
    },
    touchAllContactFields(state) {
      state.contactTouched = Object.fromEntries(Object.keys(EMPTY_CONTACT_FORM).map((k) => [k, true]));
    },
    resetContactStatus(state) {
      state.contactStatus = { state: 'idle', text: '' };
    },
    setContactStatus(state, action) {
      const { sending, sent, error } = action.payload || {};
      if (sending) {
        state.contactStatus = { state: 'sending', text: '' };
      } else if (sent) {
        state.contactStatus = { state: 'done', text: '' };
        state.contactForm = EMPTY_CONTACT_FORM;
        state.contactTouched = {};
      } else if (error) {
        state.contactStatus = { state: 'error', text: error };
      } else {
        state.contactStatus = { state: 'idle', text: '' };
      }
    },
  },
});

export const {
  loadTheme,
  toggleTheme,
  setNavScrolled,
  advanceHeroImage,
  selectFeatureRole,
  toggleFaqItem,
  startStatsAnimation,
  setStatsValues,
  setNewsletterEmail,
  subscribeNewsletter,
  resetNewsletterSubscribed,
  setContactField,
  touchContactField,
  touchAllContactFields,
  resetContactStatus,
  setContactStatus,
} = publicSlice.actions;

export const selectTheme = (state) => state.publicPages.theme;
export const selectLandingContent = (state) => state.publicPages.landingContent;
export const selectNavScrolled = (state) => state.publicPages.navScrolled;
export const selectHeroImageIndex = (state) => state.publicPages.heroImageIndex;
export const selectActiveFeatureRole = (state) => state.publicPages.activeFeatureRole;
export const selectActiveFaqIndex = (state) => state.publicPages.activeFaqIndex;
export const selectStatsStarted = (state) => state.publicPages.statsStarted;
export const selectStatsValues = (state) => state.publicPages.statsValues;
export const selectNewsletterEmail = (state) => state.publicPages.newsletterEmail;
export const selectNewsletterSubscribed = (state) => state.publicPages.newsletterSubscribed;
export const selectContactForm = (state) => state.publicPages.contactForm;
export const selectContactTouched = (state) => state.publicPages.contactTouched;
export const selectContactStatus = (state) => state.publicPages.contactStatus;

export default publicSlice.reducer;
