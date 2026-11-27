// Redux Flow (store/slices/applicationsSlice.js):
// 1. Backend API -> Thunks (fetchApplications, fetchMyApplications, createApplication, updateApplicationStatus, withdrawApplication, bulkUpdateApplications) call /applications endpoints.
// 2. Thunks dispatch reducers (setApplications, setMyApplications, addApplication, updateApplicationInLists).
// 3. UI components read state via useSelector(selectWorkspaceApplications, selectMyApplications).
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api, { errorMessage, serializeApiError } from '../../services/api.js';

function updateInList(list, updated) {
  if (updated?.id == null) return list;
  const id = String(updated.id);
  return list.map((item) => (String(item.id) === id ? { ...item, ...updated } : item));
}

// Initial Redux state: applications arrays read in Recruiter, Officer, and Candidate UI via useSelector.
const initialState = {
  applications: [],
  myApplications: [],
  loading: false,
  error: '',
};

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    setApplicationsLoading(state, action) {
      state.loading = Boolean(action.payload);
      if (action.payload) state.error = '';
    },
    setApplicationsError(state, action) {
      state.loading = false;
      state.error = action.payload || '';
    },
    setApplications(state, action) {
      state.loading = false;
      state.applications = action.payload;
    },
    setMyApplications(state, action) {
      state.loading = false;
      state.myApplications = action.payload;
    },
    addApplication(state, action) {
      const application = action.payload;
      if (application?.id == null) return;
      state.applications.push(application);
      state.myApplications.push(application);
    },
    updateApplicationInLists(state, action) {
      state.applications = updateInList(state.applications, action.payload);
      state.myApplications = updateInList(state.myApplications, action.payload);
    },
    bulkUpdateApplicationsInLists(state, action) {
      for (const updated of action.payload) {
        state.applications = updateInList(state.applications, updated);
        state.myApplications = updateInList(state.myApplications, updated);
      }
    },
  },
});

export const {
  setApplicationsLoading,
  setApplicationsError,
  setApplications,
  setMyApplications,
  addApplication,
  updateApplicationInLists,
  bulkUpdateApplicationsInLists,
} = applicationsSlice.actions;

// Thunks call the backend /applications API and dispatch reducers above.
export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setApplicationsLoading(true));
    try {
      const { data } = await api.get('/applications');
      const list = Array.isArray(data) ? data : [];
      dispatch(setApplications(list));
      return list;
    } catch (error) {
      const err = serializeApiError(error);
      dispatch(setApplicationsError(errorMessage(err)));
      return rejectWithValue(err);
    }
  },
);

export const fetchMyApplications = createAsyncThunk(
  'applications/fetchMyApplications',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setApplicationsLoading(true));
    try {
      const { data } = await api.get('/applications/my');
      const list = Array.isArray(data) ? data : [];
      dispatch(setMyApplications(list));
      return list;
    } catch (error) {
      const err = serializeApiError(error);
      dispatch(setApplicationsError(errorMessage(err)));
      return rejectWithValue(err);
    }
  },
);

export const createApplication = createAsyncThunk(
  'applications/createApplication',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.post('/applications', payload);
      dispatch(addApplication(data));
      return data;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const updateApplicationStatus = createAsyncThunk(
  'applications/updateApplicationStatus',
  async ({ id, data: payload }, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/applications/${id}/status`, payload);
      dispatch(updateApplicationInLists(data));
      return data;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const withdrawApplication = createAsyncThunk(
  'applications/withdrawApplication',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/applications/${id}/withdraw`);
      dispatch(updateApplicationInLists(data));
      return data;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const bulkUpdateApplications = createAsyncThunk(
  'applications/bulkUpdateApplications',
  async ({ applicationIds, status }, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.post('/applications/bulk-status', { applicationIds, status });
      const list = Array.isArray(data.updated ?? data) ? (data.updated ?? data) : [data.updated ?? data];
      const cleaned = list.filter((item) => item?.id != null);
      dispatch(bulkUpdateApplicationsInLists(cleaned));
      return cleaned;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const fetchApplicationResume = createAsyncThunk(
  'applications/fetchApplicationResume',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/applications/${id}/resume`, { responseType: 'blob' });
      return data;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

// Selectors read applications from Redux store into Recruiter, Officer, and Candidate components.
export const selectWorkspaceApplications = (state) => state.applications.applications;
export const selectMyApplications = (state) => state.applications.myApplications;

export default applicationsSlice.reducer;
