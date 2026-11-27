// Data Flow (roles/super-admin/components/Sidebar.jsx):
// Backend API -> Redux Thunks/Slices (superAdminSlice) -> useSelector(store state) -> UI render
// User Actions -> dispatch(slice actions) -> Slice reducers/thunks -> Redux state update
import { useDispatch } from 'react-redux';
import {
  LayoutDashboard, Building2, UserCog, Activity, Crown, LogOut, MessageSquare
} from 'lucide-react';
import {
  
  SUPER_ADMIN_TABS,
  setSuperAdminTab,
} from '../store/superAdminSlice.js';

const NAV_ITEMS = [
  { id: 'dashboard',      label: 'Dashboard',        icon: LayoutDashboard },
  { id: 'colleges',       label: 'Colleges',          icon: Building2 },
  { id: 'college-admins', label: 'College Admins',    icon: UserCog },
  { id: 'messages',       label: 'Messages',          icon: MessageSquare },
  { id: 'activity',       label: 'Activity Log',      icon: Activity },
];

export default function SuperAdminSidebar({ activeTab, onSignOut }) {
  const dispatch = useDispatch();
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2><Crown size={18} color="#a78bfa" /> CareerNest</h2>
        <p>Super Admin Portal</p>
      </div>

      <div className="sidebar-role-badge">
        <span>Super Administrator</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item ${activeTab === id ? 'active' : ''}`}
            onClick={() => {
              const nextTab = SUPER_ADMIN_TABS.includes(id) ? id : 'dashboard';
              dispatch(setSuperAdminTab(nextTab));
            }}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="btn-signout" onClick={onSignOut}>
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
