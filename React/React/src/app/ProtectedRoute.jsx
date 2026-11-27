// Data Flow (app/ProtectedRoute.jsx):
// Backend API -> Redux Thunks/Slices (authSlice) -> useSelector(selectSession) -> UI render
// User Actions -> dispatch(slice actions) -> Slice reducers/thunks -> Redux state update
import { Fragment } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectSession } from '../store/slices/authSlice.js';

export default function ProtectedRoute({ allowedRole, children }) {
  const user = useSelector(selectSession);
  const role = user?.role;
  if (!user?.accessToken || !role || (allowedRole && role !== allowedRole)) return <Navigate to="/login" replace />;
  return <Fragment key={`${user.id}:${role}`}>{children}</Fragment>;
}
