// Redux Flow (store/slices/assessmentsSlice.js):
// 1. Backend API -> Thunks (fetchAssessments, fetchMyAssessments, createAssessment, deleteAssessment) call /assessments endpoints.
// 2. Thunks dispatch reducers (setAssessments, setMyAssessments, addAssessment, removeAssessment).
// 3. UI components read state via useSelector(selectWorkspaceAssessments, selectMyAssessments).
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api, { errorMessage, serializeApiError } from '../../services/api.js';

// Initial Redux state: assessments arrays passed to Recruiter, Officer, and Candidate UI via useSelector.
const initialState = {
  assessments: [],
  myAssessments: [],
  loading: false,
  error: '',
};

const assessmentsSlice = createSlice({
  name: 'assessments',
  initialState,
  reducers: {
    setAssessmentsLoading(state, action) {
      state.loading = Boolean(action.payload);
      if (action.payload) state.error = '';
    },
    setAssessmentsError(state, action) {
      state.loading = false;
      state.error = action.payload || '';
    },
    setAssessments(state, action) {
      state.loading = false;
      state.assessments = action.payload;
    },
    setMyAssessments(state, action) {
      state.loading = false;
      state.myAssessments = action.payload;
    },
    addAssessment(state, action) {
      const assessment = action.payload;
      if (assessment?.id == null) return;
      state.assessments.push(assessment);
    },
    removeAssessment(state, action) {
      const id = String(action.payload);
      state.assessments = state.assessments.filter((item) => String(item.id) !== id);
      state.myAssessments = state.myAssessments.filter((item) => String(item.id) !== id);
    },
  },
});

export const {
  setAssessmentsLoading,
  setAssessmentsError,
  setAssessments,
  setMyAssessments,
  addAssessment,
  removeAssessment,
} = assessmentsSlice.actions;

// Thunks call /assessments API and dispatch reducers above.
export const fetchAssessments = createAsyncThunk(
  'assessments/fetchAssessments',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setAssessmentsLoading(true));
    try {
      const { data } = await api.get('/assessments');
      const list = Array.isArray(data) ? data : [];
      dispatch(setAssessments(list));
      return list;
    } catch (error) {
      const err = serializeApiError(error);
      dispatch(setAssessmentsError(errorMessage(err)));
      return rejectWithValue(err);
    }
  },
);

export const fetchMyAssessments = createAsyncThunk(
  'assessments/fetchMyAssessments',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setAssessmentsLoading(true));
    try {
      const { data } = await api.get('/assessments/my');
      const list = Array.isArray(data) ? data : [];
      dispatch(setMyAssessments(list));
      return list;
    } catch (error) {
      const err = serializeApiError(error);
      dispatch(setAssessmentsError(errorMessage(err)));
      return rejectWithValue(err);
    }
  },
);

export const createAssessment = createAsyncThunk(
  'assessments/createAssessment',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.post('/assessments', payload);
      dispatch(addAssessment(data));
      return data;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const deleteAssessment = createAsyncThunk(
  'assessments/deleteAssessment',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/assessments/${id}`);
      dispatch(removeAssessment(id));
      return id;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const selectWorkspaceAssessments = (state) => state.assessments.assessments;
export const selectMyAssessments = (state) => state.assessments.myAssessments;

export default assessmentsSlice.reducer;
