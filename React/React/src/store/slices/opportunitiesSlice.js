// Redux Flow (store/slices/opportunitiesSlice.js):
// 1. Backend API -> Thunks (fetchOpportunities, fetchRecruiterOpportunities, createOpportunity, updateOpportunity, deleteOpportunity, approveOpportunity, undoOpportunityApproval, publishOpportunity, rejectOpportunity) call /opportunities endpoints.
// 2. Thunks dispatch clear reducers (setOpportunities, setRecruiterOpportunities, addOpportunity, updateOpportunityInList, removeOpportunity).
// 3. UI components read state via useSelector(selectWorkspaceOpportunities, selectOpportunitiesRead, selectRecruiterOpportunities).
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api, { errorMessage, serializeApiError } from '../../services/api.js';

const EMPTY_LIST = [];

function updateOpportunityInState(state, updated) {
  if (updated?.id == null) return;
  const id = String(updated.id);
  state.opportunities = state.opportunities.map((item) =>
    String(item.id) === id ? { ...item, ...updated } : item,
  );
}

// Initial Redux state: opportunities array read in Candidate, Recruiter, and Officer UI via useSelector.
const initialState = {
  opportunities: [],
  opportunitiesByRecruiter: {},
  loading: false,
  error: '',
};

const opportunitiesSlice = createSlice({
  name: 'opportunities',
  initialState,
  reducers: {
    setOpportunitiesLoading(state, action) {
      state.loading = Boolean(action.payload);
      if (action.payload) state.error = '';
    },
    setOpportunitiesError(state, action) {
      state.loading = false;
      state.error = action.payload || '';
    },
    setOpportunities(state, action) {
      state.loading = false;
      state.opportunities = action.payload;
    },
    setRecruiterOpportunities(state, action) {
      state.loading = false;
      const { recruiterId, opportunities } = action.payload;
      state.opportunitiesByRecruiter[recruiterId] = opportunities;
    },
    addOpportunity(state, action) {
      const opp = action.payload;
      if (opp?.id == null) return;
      state.opportunities.push(opp);
    },
    updateOpportunityInList(state, action) {
      updateOpportunityInState(state, action.payload);
    },
    removeOpportunity(state, action) {
      const id = String(action.payload);
      state.opportunities = state.opportunities.filter((item) => String(item.id) !== id);
    },
  },
});

export const {
  setOpportunitiesLoading,
  setOpportunitiesError,
  setOpportunities,
  setRecruiterOpportunities,
  addOpportunity,
  updateOpportunityInList,
  removeOpportunity,
} = opportunitiesSlice.actions;

// Thunks call /opportunities endpoints and dispatch reducers above.
export const fetchOpportunities = createAsyncThunk(
  'opportunities/fetchOpportunities',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setOpportunitiesLoading(true));
    try {
      const { data } = await api.get('/opportunities');
      const list = Array.isArray(data) ? data : [];
      dispatch(setOpportunities(list));
      return list;
    } catch (error) {
      const err = serializeApiError(error);
      dispatch(setOpportunitiesError(errorMessage(err)));
      return rejectWithValue(err);
    }
  },
);

export const fetchRecruiterOpportunities = createAsyncThunk(
  'opportunities/fetchRecruiterOpportunities',
  async (recruiterId, { dispatch, rejectWithValue }) => {
    dispatch(setOpportunitiesLoading(true));
    try {
      const { data } = await api.get(`/recruiters/${recruiterId}/opportunities`);
      const payload = { recruiterId: String(recruiterId), opportunities: Array.isArray(data) ? data : [] };
      dispatch(setRecruiterOpportunities(payload));
      return payload;
    } catch (error) {
      const err = serializeApiError(error);
      dispatch(setOpportunitiesError(errorMessage(err)));
      return rejectWithValue(err);
    }
  },
);

export const createOpportunity = createAsyncThunk(
  'opportunities/createOpportunity',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.post('/opportunities', payload);
      dispatch(addOpportunity(data));
      return data;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const updateOpportunity = createAsyncThunk(
  'opportunities/updateOpportunity',
  async ({ id, data: payload }, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.put(`/opportunities/${id}`, payload);
      dispatch(updateOpportunityInList(data));
      return data;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const deleteOpportunity = createAsyncThunk(
  'opportunities/deleteOpportunity',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/opportunities/${id}`);
      dispatch(removeOpportunity(id));
      return id;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const approveOpportunity = createAsyncThunk(
  'opportunities/approveOpportunity',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/opportunities/${id}/approve`);
      dispatch(updateOpportunityInList(data));
      return data;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const undoOpportunityApproval = createAsyncThunk(
  'opportunities/undoOpportunityApproval',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/opportunities/${id}/undo-approval`);
      dispatch(updateOpportunityInList(data));
      return data;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const publishOpportunity = createAsyncThunk(
  'opportunities/publishOpportunity',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/opportunities/${id}/publish`);
      dispatch(updateOpportunityInList(data));
      return data;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const rejectOpportunity = createAsyncThunk(
  'opportunities/rejectOpportunity',
  async ({ id, remark }, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/opportunities/${id}/reject`, { remark });
      dispatch(updateOpportunityInList(data));
      return data;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const selectWorkspaceOpportunities = (state) => state.opportunities.opportunities;
export const selectOpportunitiesRead = (state) => ({
  status: state.opportunities.loading ? 'loading' : state.opportunities.error ? 'error' : 'ready',
  error: state.opportunities.error,
});
export const selectRecruiterOpportunities = (recruiterId) => (state) =>
  state.opportunities.opportunitiesByRecruiter[String(recruiterId)] ?? EMPTY_LIST;

export default opportunitiesSlice.reducer;
