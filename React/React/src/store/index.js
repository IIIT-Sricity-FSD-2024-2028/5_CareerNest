// Redux Flow: Central Redux Toolkit store combining all shared domain slices (src/store/slices/*)
// and role-specific slices (src/roles/*/store/*, src/public-pages/store/publicSlice.js).
// Hydrates initial auth session from localStorage and resets workspace slices on account change.
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { readSession } from '../services/api.js';
import activityEntries from './slices/activitySlice.js';
import alumni from '../roles/alumni/store/alumniSlice.js';
import announcements from './slices/announcementsSlice.js';
import applications from './slices/applicationsSlice.js';
import assessments from './slices/assessmentsSlice.js';
import auth, { resetWorkspace, setSession } from './slices/authSlice.js';
import candidate from '../roles/candidate/store/candidateSlice.js';
import collegeAdmin from '../roles/college-admin/store/collegeAdminSlice.js';
import colleges from './slices/collegesSlice.js';
import dialogs from './slices/dialogSlice.js';
import messages from './slices/messagesSlice.js';
import notificationDeliveries from './slices/notificationDeliveriesSlice.js';
import notifications from './slices/notificationsSlice.js';
import opportunities from './slices/opportunitiesSlice.js';
import placementOfficer from '../roles/placement-officer/store/placementOfficerSlice.js';
import publicPages from '../public-pages/store/publicSlice.js';
import recruiterRegistrations from './slices/recruitersSlice.js';
import recruiter from '../roles/recruiter/store/recruiterSlice.js';
import referrals from './slices/referralsSlice.js';
import resources from './slices/resourcesSlice.js';
import savedDrives from './slices/savedDrivesSlice.js';
import superAdmin from '../roles/super-admin/store/superAdminSlice.js';
import users from './slices/usersSlice.js';

const appReducer = combineReducers({
  auth,
  publicPages,
  candidate,
  alumni,
  recruiter,
  placementOfficer,
  collegeAdmin,
  superAdmin,
  dialogs,
  resources,
  opportunities,
  applications,
  assessments,
  referrals,
  notifications,
  notificationDeliveries,
  announcements,
  users,
  recruiterRegistrations,
  colleges,
  savedDrives,
  messages,
  activityEntries,
});

// Central Redux store: every page, card, modal, and filter reads from this store
// using useSelector(...) and triggers updates using dispatch(action()).
function rootReducer(state, action) {
  const next = appReducer(state, action);
  const prevUser = state?.auth?.user;
  const nextUser = next.auth.user;
  const accountChanged =
    prevUser?.id !== nextUser?.id ||
    prevUser?.role !== nextUser?.role ||
    prevUser?.collegeId !== nextUser?.collegeId ||
    Boolean(prevUser?.accessToken) !== Boolean(nextUser?.accessToken);
  if (state && accountChanged) {
    // Drop the previous account's data when signing in, signing out, or switching users.
    return appReducer({ auth: next.auth, publicPages: next.publicPages }, resetWorkspace(next.auth.user));
  }
  return next;
}

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'applications/fetchApplicationResume/fulfilled',
          'referrals/fetchReferralResume/fulfilled',
        ],
      },
    }),
  devTools: import.meta.env.DEV,
});

store.dispatch(setSession(readSession()));

export default store;
