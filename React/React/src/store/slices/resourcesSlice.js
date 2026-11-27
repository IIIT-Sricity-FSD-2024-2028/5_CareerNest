// Redux Flow (store/slices/resourcesSlice.js):
// 1. Backend API -> Thunks (fetchOversightPolicy, fetchOfficerPlacement, fetchPlatformStats) call /users/oversight-policy, /features/officer/placement-dashboard, /super-admin/stats.
// 2. Thunks dispatch reducers (setResourceLoading, setResourceReady, setResourceError).
// 3. UI components read state via useSelector(selectResource).
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api, { errorMessage, serializeApiError } from '../../services/api.js';

const initialState = {
  oversightPolicy: { data: undefined, status: 'idle', error: '' },
  officerPlacement: { data: undefined, status: 'idle', error: '' },
  platformStats: { data: undefined, status: 'idle', error: '' },
};

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    setResourceLoading(state, action) {
      const key = action.payload;
      state[key] = { data: state[key]?.data, status: 'loading', error: '' };
    },
    setResourceReady(state, action) {
      const { key, data } = action.payload;
      if (data == null) return;
      state[key] = { data, status: 'ready', error: '' };
    },
    setResourceError(state, action) {
      const { key, error } = action.payload;
      state[key] = { data: state[key]?.data, status: 'error', error: error || '' };
    },
  },
});

export const {
  setResourceLoading,
  setResourceReady,
  setResourceError,
} = resourcesSlice.actions;

export const fetchOversightPolicy = createAsyncThunk(
  'resources/fetchOversightPolicy',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setResourceLoading('oversightPolicy'));
    try {
      const { data } = await api.get('/users/oversight-policy');
      dispatch(setResourceReady({ key: 'oversightPolicy', data }));
      return data;
    } catch (error) {
      const err = serializeApiError(error);
      dispatch(setResourceError({ key: 'oversightPolicy', error: errorMessage(err) }));
      return rejectWithValue(err);
    }
  },
);

export const fetchOfficerPlacement = createAsyncThunk(
  'resources/fetchOfficerPlacement',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setResourceLoading('officerPlacement'));
    try {
      const { data } = await api.get('/features/officer/placement-dashboard');
      dispatch(setResourceReady({ key: 'officerPlacement', data }));
      return data;
    } catch (error) {
      const err = serializeApiError(error);
      dispatch(setResourceError({ key: 'officerPlacement', error: errorMessage(err) }));
      return rejectWithValue(err);
    }
  },
);

export const fetchPlatformStats = createAsyncThunk(
  'resources/fetchPlatformStats',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setResourceLoading('platformStats'));
    try {
      const { data } = await api.get('/super-admin/stats');
      dispatch(setResourceReady({ key: 'platformStats', data }));
      return data;
    } catch (error) {
      const err = serializeApiError(error);
      dispatch(setResourceError({ key: 'platformStats', error: errorMessage(err) }));
      return rejectWithValue(err);
    }
  },
);

export const selectResource = (state, key) => state.resources[key]?.data;

export default resourcesSlice.reducer;
