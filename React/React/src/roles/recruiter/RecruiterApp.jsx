// Data Flow (roles/recruiter/RecruiterApp.jsx):
// Backend API -> Redux Thunks/Slices (authSlice, recruiterSlice, usersSlice) -> useSelector(selectSession, selectRecruiter, selectRecruiterSignOutOpen) -> UI render
// User Actions -> dispatch(logoutUser, loadRecruiterWorkspace, fetchUserById) -> Slice reducers/thunks -> Redux state update
import { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { errorMessage } from '../../services/api.js';
import { infoDialog } from '../../shared/components/AppDialog.jsx';
import { logoutUser, selectSession } from '../../store/slices/authSlice.js';
import {
  closeRecruiterSignOut,
  loadRecruiterWorkspace,
  openRecruiterSignOut,
  selectRecruiter,
  selectRecruiterSignOutOpen,
} from './store/recruiterSlice.js';
import { fetchUserById } from '../../store/slices/usersSlice.js';
import Applications from './components/Applications';
import Assessments from './components/Assessments';
import CandidatesFilter from './components/CandidatesFilter';
import Dashboard from './components/Dashboard';
import HiringReport from './components/HiringReport';
import MyOpportunities from './components/MyOpportunities';
import Navbar from './components/Navbar';
import PostOpportunity from './components/PostOpportunity';
import Profile from './components/Profile';
import Sidebar from './components/Sidebar';
import SignOutModal from './components/SignOutModal';
import './styles/Recruiter.css';

function getPageTitle(activeTab) {
  switch (activeTab) {
    case 'dashboard': return 'Dashboard Overview';
    case 'post': return 'Post New Opportunity';
    case 'opportunities': return 'My Opportunities';
    case 'applications': return 'Applications & Pipeline';
    case 'assessments': return 'Assessments & Interviews';
    case 'candidates': return 'Candidate Filter';
    case 'reports': return 'Recruitment Reports';
    case 'profile': return 'My Recruiter Profile';
    default: return 'Recruiter Portal';
  }
}

export default function RecruiterApp() {
  // Redux data source: recruiterSlice (activeTab, signOut modal) and authSlice (session).
  // Workspace data is loaded on mount via loadRecruiterWorkspace() thunk -> opportunities, applications, assessments, notifications.
  const { activeTab } = useSelector(selectRecruiter, shallowEqual);
  const session = useSelector(selectSession);
  const dispatch = useDispatch();
  const confirmSignOut = () => dispatch(logoutUser());
  const isSignOutOpen = useSelector(selectRecruiterSignOutOpen);

  useEffect(() => {
    dispatch(loadRecruiterWorkspace())
      .unwrap()
      .catch((error) => infoDialog(errorMessage(error, 'Could not load your data.')));
    if (session?.id != null) dispatch(fetchUserById(session.id));
    // New applications and updates arrive while the recruiter is on the page.
    const timer = setInterval(() => {
      if (!document.hidden) dispatch(loadRecruiterWorkspace()).catch(() => {});
    }, 20000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="cn-recruiter" style={{ display: 'contents' }}>
    <div className="app-container">
      <Sidebar onSignOut={() => dispatch(openRecruiterSignOut())} />

      <main className="main-content">
        <Navbar
          title={getPageTitle(activeTab)}
          onSignOut={() => dispatch(openRecruiterSignOut())}
        />

        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'post' && <PostOpportunity />}
        {activeTab === 'opportunities' && <MyOpportunities />}
        {activeTab === 'applications' && <Applications />}
        {activeTab === 'assessments' && <Assessments />}
        {activeTab === 'candidates' && <CandidatesFilter />}
        {activeTab === 'reports' && <HiringReport />}
        {activeTab === 'profile' && <Profile />}
      </main>

      <SignOutModal isOpen={isSignOutOpen} onClose={() => dispatch(closeRecruiterSignOut())} onConfirm={confirmSignOut} />
    </div>
    </div>
  );
}
