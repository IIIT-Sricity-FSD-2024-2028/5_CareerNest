// Data Flow (roles/super-admin/components/Topbar.jsx):
// Backend API -> Redux Thunks/Slices (superAdminSlice) -> useSelector(selectSuperAdminTopbarUi) -> UI render
// User Actions -> dispatch(slice actions) -> Slice reducers/thunks -> Redux state update
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut, User } from 'lucide-react';
import { selectSuperAdminTopbarUi, setSuperAdminTopbarUi } from '../store/superAdminSlice.js';

export default function Topbar({ title, userName, avatarInitials, onProfileClick, onSignOutClick }) {
  const dispatch = useDispatch();
  const { dropdownOpen } = useSelector(selectSuperAdminTopbarUi);
  const setDropdownOpen = (updater) => {
    const next = typeof updater === 'function' ? updater(dropdownOpen) : updater;
    dispatch(setSuperAdminTopbarUi({ dropdownOpen: next }));
  };
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) dispatch(setSuperAdminTopbarUi({ dropdownOpen: false }));
    };
    if (dropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dispatch, dropdownOpen]);

  return (
    <header className="topbar">
      <span className="topbar-title">{title}</span>
      <div className="topbar-right">
        <span className="user-name">{userName}</span>
        <div className="sa-topbar-profile-wrapper" ref={dropdownRef}>
          <button
            type="button"
            className="avatar sa-avatar-button"
            onClick={() => setDropdownOpen((open) => !open)}
            aria-label="Open profile menu"
            aria-haspopup="menu"
            aria-expanded={dropdownOpen}
            title="Profile menu"
          >
            {avatarInitials}
          </button>
          {dropdownOpen && (
            <div className="sa-profile-dropdown" role="menu">
              <button type="button" className="sa-profile-dd-item" role="menuitem" onClick={() => { setDropdownOpen(false); onProfileClick?.(); }}>
                <User size={15} /> My Profile
              </button>
              <div className="sa-profile-dd-divider" />
              <button type="button" className="sa-profile-dd-item sa-profile-dd-signout" role="menuitem" onClick={() => { setDropdownOpen(false); onSignOutClick?.(); }}>
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

