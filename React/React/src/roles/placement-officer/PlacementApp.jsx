// Data Flow (roles/placement-officer/PlacementApp.jsx):
// Backend API -> Redux Thunks/Slices (placementOfficerSlice) -> useSelector(selectPlacementPage) -> UI render
// User Actions -> dispatch(loadOfficerData) -> Slice reducers/thunks -> Redux state update
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadOfficerData, selectPlacementPage } from './store/placementOfficerSlice.js';
import AppTracking from './components/AppTracking';
import BulkNotify from './components/BulkNotify';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Recruiters from './components/Recruiters';
import ReviewOpportunities from './components/ReviewOpportunities';
import Statistics from './components/Statistics';
import UserOversight from './components/UserOversight';
import './components/styles/layout-fixes.css';
import './components/styles/p1.css';

export default function PlacementApp() {
  const dispatch = useDispatch();
  // Redux data source: placementOfficerSlice (currentPage). Loads all officer workspace slices via loadOfficerData() on mount/focus.
  const currentPage = useSelector(selectPlacementPage);

  useEffect(() => {
    const load = () => dispatch(loadOfficerData());
    window.addEventListener('focus', load);
    load();
    return () => window.removeEventListener('focus', load);
  }, [dispatch]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'p1':
      case 'dashboard':
        return <Dashboard activePage="p1" />;
      case 'p2':
      case 'review':
        return <ReviewOpportunities activePage="p2" />;
      case 'p3':
      case 'statistics':
      // Formerly separate "Placement Drives" and "Department Report" pages are
      // now consolidated here under the unified Statistics page.
      case 'placement-dashboard':
      case 'dept-report':
        return <Statistics activePage="p3" />;
      case 'p4':
      case 'recruiters':
        return <Recruiters activePage="p4" />;
      case 'p5':
      case 'oversight':
        return <UserOversight activePage="p5" />;
      case 'p6':
      case 'tracking':
        return <AppTracking activePage="p6" />;
      case 'bulk-notify':
        return <BulkNotify activePage="bulk-notify" />;
      case 'profile':
        return <Profile activePage="profile" />;
      default:
        return <Dashboard activePage="p1" />;
    }
  };

  return (
    <div className="cn-placement" style={{ display: 'contents' }}>
      <div className="app-container">
        {renderCurrentPage()}
      </div>
    </div>
  );
}
