// Redux Flow (store/slices/recruitersSlice.js):
// 1. Backend API -> Thunks (fetchRecruiterRegistrations, submitRecruiterContact, approveRecruiter, declineRecruiter, deleteRecruiter) call /recruiters & /contact/recruiter.
// 2. Thunks dispatch clear reducers (setRecruiters, updateRecruiterInList, removeRecruiter).
// 3. UI components read state via useSelector(selectRecruiterRegistrations).
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api, { errorMessage, serializeApiError } from '../../services/api.js';
import { setContactStatus } from '../../public-pages/store/publicSlice.js';
import { selectSession } from './authSlice.js';
import { fetchUsers } from './usersSlice.js';

// Initial Redux state: recruiters array passed to Placement Officer & College Admin UI via useSelector.
const initialState = {
  recruiters: [],
  loading: false,
  error: '',
};

const recruitersSlice = createSlice({
  name: 'recruiterRegistrations',
  initialState,
  reducers: {
    setRecruitersLoading(state, action) {
      state.loading = Boolean(action.payload);
      if (action.payload) state.error = '';
    },
    setRecruitersError(state, action) {
      state.loading = false;
      state.error = action.payload || '';
    },
    setRecruiters(state, action) {
      state.loading = false;
      state.recruiters = action.payload;
    },
    updateRecruiterInList(state, action) {
      const updated = action.payload;
      if (updated?.id == null) return;
      const id = String(updated.id);
      state.recruiters = state.recruiters.map((item) =>
        String(item.id) === id ? { ...item, ...updated } : item,
      );
    },
    removeRecruiter(state, action) {
      const id = String(action.payload);
      state.recruiters = state.recruiters.filter((item) => String(item.id) !== id);
    },
  },
});

export const {
  setRecruitersLoading,
  setRecruitersError,
  setRecruiters,
  updateRecruiterInList,
  removeRecruiter,
} = recruitersSlice.actions;

// Thunks call /recruiters & /contact/recruiter endpoints and dispatch reducers above.
export const fetchRecruiterRegistrations = createAsyncThunk(
  'recruiterRegistrations/fetchRecruiterRegistrations',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setRecruitersLoading(true));
    try {
      const { data } = await api.get('/recruiters');
      const list = Array.isArray(data) ? data : [];
      dispatch(setRecruiters(list));
      return list;
    } catch (error) {
      const err = serializeApiError(error);
      dispatch(setRecruitersError(errorMessage(err)));
      return rejectWithValue(err);
    }
  },
);

export const submitRecruiterContact = createAsyncThunk(
  'recruiterRegistrations/submitRecruiterContact',
  async (payload, { dispatch, rejectWithValue }) => {
    dispatch(setContactStatus({ sending: true, error: '', sent: false }));
    try {
      const { data } = await api.post('/contact/recruiter', payload);
      dispatch(setContactStatus({ sending: false, error: '', sent: true }));
      return data;
    } catch (error) {
      const err = serializeApiError(error);
      dispatch(setContactStatus({
        sending: false,
        sent: false,
        error: errorMessage(err, 'Could not submit your request. Please try again.'),
      }));
      return rejectWithValue(err);
    }
  },
);

export const approveRecruiter = createAsyncThunk(
  'recruiterRegistrations/approveRecruiter',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/recruiters/${id}/approve`);
      dispatch(updateRecruiterInList(data));
      return data;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const declineRecruiter = createAsyncThunk(
  'recruiterRegistrations/declineRecruiter',
  async ({ id, remark }, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/recruiters/${id}/decline`, { remark });
      dispatch(updateRecruiterInList(data));
      return data;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const deleteRecruiter = createAsyncThunk(
  'recruiterRegistrations/deleteRecruiter',
  async (id, { dispatch, getState, rejectWithValue }) => {
    try {
      await api.delete(`/recruiters/${id}`);
      dispatch(removeRecruiter(id));
      if (selectSession(getState())?.role === 'college_admin') {
        dispatch(fetchUsers()).catch(() => {});
      }
      return id;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const selectRecruiterRegistrations = (state) => state.recruiterRegistrations.recruiters;

export default recruitersSlice.reducer;
