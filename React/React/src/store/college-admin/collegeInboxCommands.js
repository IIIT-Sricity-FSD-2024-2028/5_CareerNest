import { collegeAdminActions } from './collegeAdminSlice.js';
import { selectSession } from '../sessionSlice.js';

const seenKey = (state) => `ca_messages_seen_${Number(selectSession(state)?.collegeId) || 1}`;

export const loadInboxSeenTime = () => (dispatch, getState) => {
  let seen = 0;
  try {
    seen = Number(localStorage.getItem(seenKey(getState()))) || 0;
  } catch {
    // The current session still tracks read state when storage is unavailable.
  }
  dispatch(collegeAdminActions.inboxSeenTimeChanged(seen));
};

export const markInboxSeen = () => (dispatch, getState) => {
  const seen = Date.now();
  dispatch(collegeAdminActions.inboxSeenTimeChanged(seen));
  try {
    localStorage.setItem(seenKey(getState()), String(seen));
  } catch {
    // Keep the Redux read state for this session.
  }
};
