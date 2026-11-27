// Redux Flow (store/slices/notificationDeliveriesSlice.js):
// 1. Backend API -> Thunks (fetchSentNotifications, sendBulkNotification) call /features/officer/notifications endpoints.
// 2. Thunks dispatch reducers (setSentNotifications, addSentNotification, setNotificationDeliveriesLoading, setNotificationDeliveriesError).
// 3. UI components read state via useSelector(selectSentNotifications).
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api, { errorMessage, serializeApiError } from '../../services/api.js';

// Initial Redux state: sentNotifications array read in BulkNotify UI via useSelector.
const initialState = {
  sentNotifications: [],
  loading: false,
  error: '',
};

const notificationDeliveriesSlice = createSlice({
  name: 'notificationDeliveries',
  initialState,
  reducers: {
    setNotificationDeliveriesLoading(state, action) {
      state.loading = Boolean(action.payload);
      if (action.payload) state.error = '';
    },
    setNotificationDeliveriesError(state, action) {
      state.loading = false;
      state.error = action.payload || '';
    },
    setSentNotifications(state, action) {
      state.loading = false;
      state.sentNotifications = action.payload;
    },
    addSentNotification(state, action) {
      const notification = action.payload;
      if (notification?.id == null) return;
      state.sentNotifications.push(notification);
    },
  },
});

export const {
  setNotificationDeliveriesLoading,
  setNotificationDeliveriesError,
  setSentNotifications,
  addSentNotification,
} = notificationDeliveriesSlice.actions;

// Thunks call bulk notification endpoints and dispatch reducers above.
export const fetchSentNotifications = createAsyncThunk(
  'notificationDeliveries/fetchSentNotifications',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setNotificationDeliveriesLoading(true));
    try {
      const { data } = await api.get('/features/officer/notifications');
      const list = Array.isArray(data) ? data : [];
      dispatch(setSentNotifications(list));
      return list;
    } catch (error) {
      const err = serializeApiError(error);
      dispatch(setNotificationDeliveriesError(errorMessage(err)));
      return rejectWithValue(err);
    }
  },
);

export const sendBulkNotification = createAsyncThunk(
  'notificationDeliveries/sendBulkNotification',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.post('/features/officer/notifications/bulk', payload);
      dispatch(addSentNotification(data));
      return data;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const selectSentNotifications = (state) => state.notificationDeliveries.sentNotifications;

export default notificationDeliveriesSlice.reducer;
