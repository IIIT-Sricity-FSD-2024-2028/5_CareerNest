// Redux Flow (store/slices/referralsSlice.js):
// 1. Backend API -> Thunks (fetchReferrals, fetchMyReferrals, createReferral, respondToReferral, fetchReferralResume) call /referrals endpoints.
// 2. Thunks dispatch clear reducers (setReceivedReferrals, setMyReferrals, addMyReferral, updateReferralInLists).
// 3. UI components read state via useSelector(selectReceivedReferrals, selectMyReferrals).
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api, { errorMessage, serializeApiError } from '../../services/api.js';

// Initial Redux state: referral arrays passed to Alumni & Candidate UI via useSelector.
const initialState = {
  receivedReferrals: [],
  myReferrals: [],
  loading: false,
  error: '',
};

const referralsSlice = createSlice({
  name: 'referrals',
  initialState,
  reducers: {
    setReferralsLoading(state, action) {
      state.loading = Boolean(action.payload);
      if (action.payload) state.error = '';
    },
    setReferralsError(state, action) {
      state.loading = false;
      state.error = action.payload || '';
    },
    setReceivedReferrals(state, action) {
      state.loading = false;
      state.receivedReferrals = action.payload;
    },
    setMyReferrals(state, action) {
      state.loading = false;
      state.myReferrals = action.payload;
    },
    addMyReferral(state, action) {
      const referral = action.payload;
      if (referral?.id == null) return;
      state.myReferrals.push(referral);
    },
    updateReferralInLists(state, action) {
      const updated = action.payload;
      if (updated?.id == null) return;
      const id = String(updated.id);
      state.receivedReferrals = state.receivedReferrals.map((item) =>
        String(item.id) === id ? { ...item, ...updated } : item,
      );
      state.myReferrals = state.myReferrals.map((item) =>
        String(item.id) === id ? { ...item, ...updated } : item,
      );
    },
  },
});

export const {
  setReferralsLoading,
  setReferralsError,
  setReceivedReferrals,
  setMyReferrals,
  addMyReferral,
  updateReferralInLists,
} = referralsSlice.actions;

// Thunks call /referrals endpoints and dispatch reducers above.
export const fetchReferrals = createAsyncThunk(
  'referrals/fetchReferrals',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setReferralsLoading(true));
    try {
      const { data } = await api.get('/referrals');
      const list = Array.isArray(data) ? data : [];
      dispatch(setReceivedReferrals(list));
      return list;
    } catch (error) {
      const err = serializeApiError(error);
      dispatch(setReferralsError(errorMessage(err)));
      return rejectWithValue(err);
    }
  },
);

export const fetchMyReferrals = createAsyncThunk(
  'referrals/fetchMyReferrals',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setReferralsLoading(true));
    try {
      const { data } = await api.get('/referrals/my');
      const list = Array.isArray(data) ? data : [];
      dispatch(setMyReferrals(list));
      return list;
    } catch (error) {
      const err = serializeApiError(error);
      dispatch(setReferralsError(errorMessage(err)));
      return rejectWithValue(err);
    }
  },
);

export const createReferral = createAsyncThunk(
  'referrals/createReferral',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.post('/referrals', payload);
      dispatch(addMyReferral(data));
      return data;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const respondToReferral = createAsyncThunk(
  'referrals/respondToReferral',
  async ({ id, data: payload }, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/referrals/${id}`, payload);
      dispatch(updateReferralInLists(data));
      return data;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const fetchReferralResume = createAsyncThunk(
  'referrals/fetchReferralResume',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/applications/referrals/${id}/resume`, { responseType: 'blob' });
      return data;
    } catch (error) {
      let parsedMessage = null;
      if (error?.response?.data instanceof Blob) {
        try {
          const body = JSON.parse(await error.response.data.text());
          parsedMessage = Array.isArray(body.message) ? body.message.join(', ') : body.message;
        } catch {
          // Keep standard error fallback.
        }
      }
      if (parsedMessage) {
        return rejectWithValue({
          message: parsedMessage,
          response: { status: error.response?.status, data: { message: parsedMessage } },
        });
      }
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const selectReceivedReferrals = (state) => state.referrals.receivedReferrals;
export const selectMyReferrals = (state) => state.referrals.myReferrals;

export default referralsSlice.reducer;
