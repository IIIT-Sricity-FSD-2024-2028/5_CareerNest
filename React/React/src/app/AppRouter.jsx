// Data Flow (app/AppRouter.jsx):
// Backend API -> Redux Thunks/Slices (authSlice) -> useSelector(store state) -> UI render
// User Actions -> dispatch(slice actions) -> Slice reducers/thunks -> Redux state update
import { lazy, Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { readSession } from '../services/api.js';
import { setSession } from '../store/slices/authSlice.js';
import ProtectedRoute from './ProtectedRoute.jsx';
import LandingPage from '../public-pages/landing/LandingPage.jsx';
import LoginPage from '../public-pages/login/LoginPage.jsx';
const CandidateApp = lazy(() => import('../roles/candidate/CandidateApp.jsx'));
const AlumniApp = lazy(() => import('../roles/alumni/AlumniApp.jsx'));
const RecruiterApp = lazy(() => import('../roles/recruiter/RecruiterApp.jsx'));
const PlacementApp = lazy(() => import('../roles/placement-officer/PlacementApp.jsx'));
const CollegeAdminApp = lazy(() => import('../roles/college-admin/CollegeAdminApp.jsx'));
const SuperAdminApp = lazy(() => import('../roles/super-admin/SuperAdminApp.jsx'));

const PROTECTED_PATH_PREFIXES = ['/candidate', '/alumni', '/recruiter', '/placement', '/college-admin', '/super-admin'];

function isProtectedPath(pathname) {
  return PROTECTED_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

const secured = (role, App) => (
  <ProtectedRoute allowedRole={role}>
    <Suspense fallback={<main className="route-loading">Loading workspace…</main>}><App /></Suspense>
  </ProtectedRoute>
);

export default function AppRouter() {
  const dispatch = useDispatch();

  useEffect(() => {
    const syncSession = (event) => {
      if (event.key === 'loggedInUser' || event.key === null) dispatch(setSession(readSession()));
    };
    window.addEventListener('storage', syncSession);
    return () => window.removeEventListener('storage', syncSession);
  }, [dispatch]);

  useEffect(() => {
    const enforceAuthentication = () => {
      if (!readSession()?.accessToken && isProtectedPath(window.location.pathname)) {
        window.location.replace('/login');
      }
    };
    window.addEventListener('pageshow', enforceAuthentication);
    window.addEventListener('popstate', enforceAuthentication);
    return () => {
      window.removeEventListener('pageshow', enforceAuthentication);
      window.removeEventListener('popstate', enforceAuthentication);
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/candidate/*" element={secured('candidate', CandidateApp)} />
      <Route path="/alumni/*" element={secured('alumni', AlumniApp)} />
      <Route path="/recruiter/*" element={secured('recruiter', RecruiterApp)} />
      <Route path="/placement/*" element={secured('placement_officer', PlacementApp)} />
      <Route path="/college-admin/*" element={secured('college_admin', CollegeAdminApp)} />
      <Route path="/super-admin/*" element={secured('super_admin', SuperAdminApp)} />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}
