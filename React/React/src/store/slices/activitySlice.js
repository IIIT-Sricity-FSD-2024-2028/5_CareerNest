// Redux Flow (store/slices/activitySlice.js):
// 1. Backend API -> Thunks (fetchPlatformActivity, fetchOfficerActivity) call /super-admin/activity and /activity/placement-officers.
// 2. Thunks dispatch reducers (setActivityLoading, setActivityError, setPlatformActivity, setOfficerActivity).
// 3. UI components read state via useSelector(selectPlatformActivity, selectOfficerActivity).
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api, { errorMessage, serializeApiError } from '../../services/api.js';

// Initial Redux state: arrays for activity logs read via useSelector.
const initialState = {
  platformActivity: [],
  officerActivity: [],
  loading: false,
  error: '',
};

const activitySlice = createSlice({
  name: 'activityEntries',
  initialState,
  reducers: {
    setActivityLoading(state, action) {
      state.loading = Boolean(action.payload);
      if (action.payload) state.error = '';
    },
    setActivityError(state, action) {
      state.loading = false;
      state.error = action.payload || '';
    },
    setPlatformActivity(state, action) {
      state.loading = false;
      state.platformActivity = action.payload;
    },
    setOfficerActivity(state, action) {
      state.loading = false;
      state.officerActivity = action.payload;
    },
  },
});

export const {
  setActivityLoading,
  setActivityError,
  setPlatformActivity,
  setOfficerActivity,
} = activitySlice.actions;

// Thunks fetch activity logs from the backend and dispatch reducers above.
export const fetchPlatformActivity = createAsyncThunk(
  'activityEntries/fetchPlatformActivity',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setActivityLoading(true));
    try {
      const { data } = await api.get('/super-admin/activity');
      const list = Array.isArray(data) ? data : [];
      dispatch(setPlatformActivity(list));
      return list;
    } catch (error) {
      const err = serializeApiError(error);
      dispatch(setActivityError(errorMessage(err)));
      return rejectWithValue(err);
    }
  },
);

export const fetchOfficerActivity = createAsyncThunk(
  'activityEntries/fetchOfficerActivity',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setActivityLoading(true));
    try {
      const { data } = await api.get('/activity/placement-officers');
      const list = Array.isArray(data) ? data : [];
      dispatch(setOfficerActivity(list));
      return list;
    } catch (error) {
      const err = serializeApiError(error);
      dispatch(setActivityError(errorMessage(err)));
      return rejectWithValue(err);
    }
  },
);

// Selectors pass Redux state directly into React components via useSelector(...).
export const selectPlatformActivity = (state) => state.activityEntries.platformActivity;
export const selectOfficerActivity = (state) => state.activityEntries.officerActivity;

export default activitySlice.reducer;
