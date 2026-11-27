// Data Flow (roles/super-admin/SuperAdminApp.jsx):
// Backend API -> Redux Thunks/Slices (authSlice, superAdminSlice) -> useSelector(selectSession, selectSuperAdmin, selectSuperAdminPlatform, selectSuperAdminSignOutOpen) -> UI render
// User Actions -> dispatch(logoutUser, updateSessionUser, refreshSuperAdminData, updateSession) -> Slice reducers/thunks -> Redux state update
import { infoDialog } from '../../shared/components/AppDialog.jsx';
import { useCallback, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import SuperAdminSidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import SADashboard from './pages/Dashboard';
import Colleges from './pages/Colleges';
import CollegeAdmins from './pages/CollegeAdmins';
import ActivityLog from './pages/ActivityLog';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import SignOutModal from './components/SignOutModal';
import { logoutUser, selectSession, updateSessionUser } from '../../store/slices/authSlice.js';
import {
  
  SUPER_ADMIN_TABS,
  closeSuperAdminSignOut,
  openSuperAdminSignOut,
  refreshSuperAdminData,
  selectSuperAdmin,
  selectSuperAdminPlatform,
  selectSuperAdminSignOutOpen,
  setSuperAdminTab,
} from './store/superAdminSlice.js';
import './styles/SuperAdmin.css';

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'SA';
}

function getTitle(tab) {
  switch (tab) {
    case 'dashboard':      return 'Platform Dashboard';
    case 'colleges':       return 'Colleges';
    case 'college-admins': return 'College Admin Management';
    case 'activity':       return 'Activity Log';
    case 'messages':       return 'Messages';
    case 'profile':        return 'My Profile';
    default:               return 'Super Admin';
  }
}

export default function SuperAdminApp() {
  const dispatch = useDispatch();
  // Redux data source: superAdminSlice (colleges + platform stats) and authSlice (session user).
  // Hydrated on mount via refreshSuperAdminData() -> GET /api/colleges, /platform-stats, /users.
  const platform = useSelector(selectSuperAdminPlatform);
  const { data, stats } = platform;
  const user = useSelector(selectSession);
  const confirmSignOut = () => dispatch(logoutUser());
  const updateSession = (u) => dispatch(updateSessionUser({ user: u }));
  const workspace = useSelector(selectSuperAdmin, shallowEqual);
  const userName = user.name || 'Super Admin';

  const activeTab = workspace.activeTab;
  const { adminCollegeId } = workspace;
  const isSignOutOpen = useSelector(selectSuperAdminSignOutOpen);
  const setIsSignOutOpen = (v) => dispatch(v ? openSuperAdminSignOut() : closeSuperAdminSignOut());

  useEffect(() => {
    if (user.role === 'super_admin') {
      dispatch(refreshSuperAdminData()).catch(() => {});
    }
  }, [dispatch, user.role]);

  const showToast = useCallback((msg) => { infoDialog(msg); }, []);

  const handleSignOut = () => setIsSignOutOpen(true);

  const pageProps = {
    colleges: data.colleges,
    stats,
    platform,
    showToast,
    adminCollegeId,
  };

  return (
    <div className="cn-super-admin" style={{ display: 'contents' }}>
      <div className="app-container">
        {/* Sidebar */}
        <SuperAdminSidebar
          activeTab={activeTab}
          onSignOut={handleSignOut}
        />

        {/* Main */}
        <div className="main-content">
          <Topbar
            title={getTitle(activeTab)}
            userName={userName}
            avatarInitials={getInitials(userName)}
            onProfileClick={() => {
              const nextTab = SUPER_ADMIN_TABS.includes('profile') ? 'profile' : 'dashboard';
              dispatch(setSuperAdminTab(nextTab));
            }}
            onSignOutClick={handleSignOut}
          />

          <div className="page-content">
            {platform.error && (
              <div role="status">
                {platform.error}{' '}
                <button type="button" className="btn btn-outline btn-sm" onClick={() => dispatch(refreshSuperAdminData()).catch(() => {})}>
                  Retry refresh
                </button>
              </div>
            )}
            {activeTab === 'dashboard'      && <SADashboard {...pageProps} data={data} userName={userName} avatarInitials={getInitials(userName)} />}
            {activeTab === 'colleges'       && <Colleges     {...pageProps} />}
            {activeTab === 'college-admins' && <CollegeAdmins {...pageProps} />}
            {activeTab === 'activity'       && <ActivityLog />}
            {activeTab === 'messages'       && <Messages colleges={data.colleges} />}
            {activeTab === 'profile'        && <Profile showToast={showToast} onProfileUpdated={updateSession} />}
          </div>
        </div>

        {/* Toast */}

        <SignOutModal
          isOpen={isSignOutOpen}
          onClose={() => setIsSignOutOpen(false)}
          onConfirm={confirmSignOut}
        />
      </div>
    </div>
  );
}
