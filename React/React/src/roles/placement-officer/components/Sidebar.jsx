// Data Flow (roles/placement-officer/components/Sidebar.jsx):
// Backend API -> Redux Thunks/Slices (authSlice, placementOfficerSlice) -> useSelector(selectPlacementPage, selectPlacementSignOutOpen) -> UI render
// User Actions -> dispatch(logoutUser) -> Slice reducers/thunks -> Redux state update
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../../store/slices/authSlice.js';
import {
  
  closePlacementSignOut,
  openPlacementSignOut,
  selectPlacementPage,
  selectPlacementSignOutOpen,
  setPlacementPage,
} from '../store/placementOfficerSlice.js';
import { BarChart3, Bell, BriefcaseBusiness, ClipboardList, LayoutDashboard, LogOut, UserCog, UsersRound } from 'lucide-react';
import SignOutModal from './SignOutModal';

const navItems = [
  { label: 'Dashboard',            href: 'p1.html',               page: 'p1',               icon: LayoutDashboard },
  { label: 'Review Opportunities', href: 'p2.html',               page: 'p2',               icon: BriefcaseBusiness },
  { label: 'Statistics',           href: 'p3.html',               page: 'p3',               icon: BarChart3 },
  { label: 'Recruiters',           href: 'p4.html',               page: 'p4',               icon: UsersRound },
  { label: 'User Oversight',       href: 'p5.html',               page: 'p5',               icon: UserCog },
  { label: 'App Tracking',         href: 'p6.html',               page: 'p6',               icon: ClipboardList },
  { label: 'Bulk Notifications',   href: 'bulk-notify.html',      page: 'bulk-notify',      icon: Bell },
];

export default function Sidebar({ activePage: activePageProp }) {
  const dispatch = useDispatch();
  const currentPage = useSelector(selectPlacementPage);
  const activePage = activePageProp || currentPage || 'p1';
  const confirmSignOut = () => dispatch(logoutUser());
  const isSignOutOpen = useSelector(selectPlacementSignOutOpen);
  const handleClick = (item) => {
    dispatch(setPlacementPage(item.page));
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <nav className="sidebar" id="sidebar">
      <div className="sidebar-brand">
        <h2>CareerNest</h2>
        <span>Placement Officer</span>
      </div>

      <ul className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return <li
            key={item.page}
            className={`nav-item${activePage === item.page ? ' active' : ''}`}
            onClick={() => handleClick(item)}
            style={{ cursor: 'pointer' }}
          >
            <span className="placement-nav-label"><Icon size={18} strokeWidth={2} aria-hidden="true" />{item.label}</span>
          </li>
        })}
      </ul>

      <div className="sidebar-signout">
        <button
          type="button"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}
          onClick={() => dispatch(openPlacementSignOut())}
        >
          <span className="placement-nav-label"><LogOut size={18} strokeWidth={2} aria-hidden="true" />Sign Out</span>
        </button>
      </div>
      <SignOutModal
        isOpen={isSignOutOpen}
        onClose={() => dispatch(closePlacementSignOut())}
        onConfirm={confirmSignOut}
      />
    </nav>
  );
}

