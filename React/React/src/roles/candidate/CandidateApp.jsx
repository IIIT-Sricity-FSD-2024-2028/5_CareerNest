// Data Flow (roles/candidate/CandidateApp.jsx):
// Backend API -> Redux Thunks/Slices (authSlice, candidateSlice) -> useSelector(selectSession, selectCandidateProfile, selectCandidateProfileSync) -> UI render
// User Actions -> dispatch(loadCandidateSnapshot, saveCandidateProfile) -> Slice reducers/thunks -> Redux state update
import { useEffect } from 'react';
import { useDispatch, useSelector, useStore as useReduxStore } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { profilePayload } from './store/candidateSnapshot.js';
import { selectSession } from '../../store/slices/authSlice.js';
import {
    finishCandidateLoad,
    loadCandidateSnapshot,
    saveCandidateProfile,
    selectCandidateProfile,
    selectCandidateProfileSync,
} from './store/candidateSlice.js';
import GlobalModals from './components/GlobalModals.jsx';
import Layout from './components/Layout.jsx';
import Applications from './pages/Applications.jsx';
import ApplicationTracker from './pages/ApplicationTracker.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Opportunities from './pages/Opportunities.jsx';
import Profile from './pages/Profile.jsx';
import Referrals from './pages/Referrals.jsx';
import SavedDrives from './pages/SavedDrives.jsx';
import './styles/style.css';

// Mounted at /candidate/* by the top-level router (src/app/AppRouter.jsx),
// so every path below is relative to "/candidate".
export default function CandidateApp() {
    const dispatch = useDispatch();
    const redux = useReduxStore();
    // Redux data source: authSlice (session user id) and candidateSlice (candidate profile + workspace state).
    // Hydrated on mount via loadCandidateSnapshot() thunk -> GET /api/users/:id, /opportunities, /applications, /referrals, /assessments.
    const sessionId = useSelector(selectSession)?.id;
    const { currentUser, profileResumeData } = useSelector(selectCandidateProfile);

    useEffect(() => {
        let cancelled = false;
        dispatch(loadCandidateSnapshot()).then(() => {
            if (!cancelled) {
                dispatch(finishCandidateLoad());
            }
        });
        const timer = setInterval(() => {
            if (!document.hidden) dispatch(loadCandidateSnapshot({ silent: true }));
        }, 20000);
        return () => {
            cancelled = true;
            clearInterval(timer);
        };
    }, [dispatch]);

    // Check the last saved value when the profile changes. Save completions
    // alone do not restart the debounce or retry a failed request.
    useEffect(() => {
        const { hydrated, lastSaved } = selectCandidateProfileSync(redux.getState());
        if (!hydrated) return undefined;
        const payload = profilePayload({ currentUser, profileResumeData });
        if (JSON.stringify(payload) === lastSaved) return undefined;
        const timer = setTimeout(() => {
            dispatch(saveCandidateProfile({ id: sessionId, payload }));
        }, 700);
        return () => clearTimeout(timer);
    }, [currentUser, dispatch, profileResumeData, redux, sessionId]);

    return (
        <div className="cn-candidate" style={{ display: 'contents' }}>
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="opportunities" element={<Opportunities />} />
                    <Route path="saved-drives" element={<SavedDrives />} />
                    <Route path="applications" element={<Applications />} />
                    <Route path="application-tracking" element={<ApplicationTracker />} />
                    <Route path="referrals" element={<Referrals />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="*" element={<Navigate to="/candidate" replace />} />
                </Route>
            </Routes>
            <GlobalModals />
        </div>
    );
}
