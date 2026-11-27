// Redux Flow (store/slices/notificationsSlice.js):
// 1. Backend API -> Thunks (fetchNotifications, markNotificationRead, markAllNotificationsRead) call /notifications endpoints.
// 2. Thunks dispatch reducers (setNotifications, updateNotificationRead, markAllNotificationsReadInList).
// 3. UI components read state via useSelector(selectInboxNotifications).
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api, { errorMessage, serializeApiError } from '../../services/api.js';

// Initial Redux state: notifications array rendered in header/bell panels via useSelector.
const initialState = {
  notifications: [],
  loading: false,
  error: '',
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotificationsLoading(state, action) {
      state.loading = Boolean(action.payload);
      if (action.payload) state.error = '';
    },
    setNotificationsError(state, action) {
      state.loading = false;
      state.error = action.payload || '';
    },
    setNotifications(state, action) {
      state.loading = false;
      state.notifications = action.payload;
    },
    updateNotificationRead(state, action) {
      const updated = action.payload;
      if (updated?.id == null) return;
      const id = String(updated.id);
      state.notifications = state.notifications.map((item) =>
        String(item.id) === id ? { ...item, ...updated } : item,
      );
    },
    markAllNotificationsReadInList(state) {
      state.notifications = state.notifications.map((item) => ({ ...item, isRead: true }));
    },
  },
});

export const {
  setNotificationsLoading,
  setNotificationsError,
  setNotifications,
  updateNotificationRead,
  markAllNotificationsReadInList,
} = notificationsSlice.actions;

// Thunks fetch inbox notifications and dispatch reducers above.
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setNotificationsLoading(true));
    try {
      const { data } = await api.get('/notifications');
      const list = Array.isArray(data) ? data : [];
      dispatch(setNotifications(list));
      return list;
    } catch (error) {
      const err = serializeApiError(error);
      dispatch(setNotificationsError(errorMessage(err)));
      return rejectWithValue(err);
    }
  },
);

export const markNotificationRead = createAsyncThunk(
  'notifications/markNotificationRead',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/notifications/${id}/read`);
      dispatch(updateNotificationRead(data));
      return data;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const markAllNotificationsRead = createAsyncThunk(
  'notifications/markAllNotificationsRead',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await api.patch('/notifications/read-all');
      dispatch(markAllNotificationsReadInList());
      return true;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const selectInboxNotifications = (state) => state.notifications.notifications;

export default notificationsSlice.reducer;
