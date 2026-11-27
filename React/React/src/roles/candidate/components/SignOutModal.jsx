// Data Flow (roles/candidate/components/SignOutModal.jsx):
// Backend API -> Redux Thunks/Slices (authSlice) -> useSelector(store state) -> UI render
// User Actions -> dispatch(logoutUser) -> Slice reducers/thunks -> Redux state update
import { LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../../store/slices/authSlice.js';

export default function SignOutModal({ isOpen, onClose }) {
    const dispatch = useDispatch();
    if (!isOpen) return null;

    return (
        <div className="candidate-signout-overlay" onClick={(event) => event.target === event.currentTarget && onClose()}>
            <div className="candidate-signout-card" role="dialog" aria-modal="true" aria-labelledby="candidate-signout-title">
                <div className="candidate-signout-icon" aria-hidden="true"><LogOut size={27} /></div>
                <h2 id="candidate-signout-title">Sign Out</h2>
                <p>Are you sure you want to sign out of CareerNest?</p>
                <div className="candidate-signout-actions">
                    <button type="button" onClick={onClose}>Cancel</button>
                    <button type="button" className="candidate-signout-confirm" onClick={() => dispatch(logoutUser())}>Sign Out</button>
                </div>
            </div>
        </div>
    );
}
