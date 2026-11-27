// Redux Flow (store/slices/collegesSlice.js):
// 1. Backend API -> Thunks (fetchPublicColleges, fetchPlatformColleges, fetchCollegeById, createCollege, updateCollegeStatus) call /contact/colleges, /super-admin/colleges, /colleges/:id.
// 2. Thunks dispatch clear reducers (setColleges, addCollege, updateCollegeStatusInList, setPublicColleges, upsertCollege).
// 3. UI components read state via useSelector(selectPublicColleges, selectPlatformColleges, selectCollegeById).
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api, { errorMessage, serializeApiError } from '../../services/api.js';
import { setCollegeAdmins } from './usersSlice.js';

// Initial Redux state: clear arrays/maps for colleges passed to UI via useSelector.
const initialState = {
  colleges: [],
  publicColleges: [],
  collegesById: {},
  loading: false,
  error: '',
};

const collegesSlice = createSlice({
  name: 'colleges',
  initialState,
  reducers: {
    setCollegesLoading(state, action) {
      state.loading = Boolean(action.payload);
      if (action.payload) state.error = '';
    },
    setCollegesError(state, action) {
      state.loading = false;
      state.error = action.payload || '';
    },
    setPublicColleges(state, action) {
      state.loading = false;
      state.publicColleges = action.payload;
    },
    setColleges(state, action) {
      state.loading = false;
      state.colleges = action.payload;
      for (const college of action.payload) {
        if (college?.id != null) state.collegesById[String(college.id)] = college;
      }
    },
    upsertCollege(state, action) {
      const college = action.payload;
      if (college?.id == null) return;
      state.collegesById[String(college.id)] = college;
    },
    addCollege(state, action) {
      const college = action.payload;
      if (college?.id == null) return;
      state.colleges.push(college);
      state.collegesById[String(college.id)] = college;
    },
    updateCollegeStatusInList(state, action) {
      const college = action.payload;
      if (college?.id == null) return;
      const id = String(college.id);
      state.collegesById[id] = { ...state.collegesById[id], ...college };
      state.colleges = state.colleges.map((item) =>
        String(item.id) === id ? { ...item, ...college } : item,
      );
    },
  },
});

export const {
  setCollegesLoading,
  setCollegesError,
  setPublicColleges,
  setColleges,
  upsertCollege,
  addCollege,
  updateCollegeStatusInList,
} = collegesSlice.actions;

// Thunks call college endpoints and dispatch the reducers above.
export const fetchPublicColleges = createAsyncThunk(
  'colleges/fetchPublicColleges',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setCollegesLoading(true));
    try {
      const { data } = await api.get('/contact/colleges');
      const list = Array.isArray(data) ? data : [];
      dispatch(setPublicColleges(list));
      return list;
    } catch (error) {
      const err = serializeApiError(error);
      dispatch(setCollegesError(errorMessage(err)));
      return rejectWithValue(err);
    }
  },
);

export const fetchPlatformColleges = createAsyncThunk(
  'colleges/fetchPlatformColleges',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setCollegesLoading(true));
    try {
      const { data } = await api.get('/super-admin/colleges');
      const colleges = data.map(({ admin, ...college }) => ({
        ...college,
        adminId: admin?.id ?? null,
      }));
      const admins = data.flatMap(({ admin }) => (admin?.id != null ? [admin] : []));
      dispatch(setColleges(colleges));
      dispatch(setCollegeAdmins(admins));
      return { colleges, admins };
    } catch (error) {
      const err = serializeApiError(error);
      dispatch(setCollegesError(errorMessage(err)));
      return rejectWithValue(err);
    }
  },
);

export const fetchCollegeById = createAsyncThunk(
  'colleges/fetchCollegeById',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.get(`/colleges/${id}`);
      dispatch(upsertCollege(data));
      return data;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const createCollege = createAsyncThunk(
  'colleges/createCollege',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.post('/super-admin/colleges', payload);
      dispatch(addCollege(data));
      return data;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const updateCollegeStatus = createAsyncThunk(
  'colleges/updateCollegeStatus',
  async ({ id, status }, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/super-admin/colleges/${id}/status`, { status });
      dispatch(updateCollegeStatusInList(data));
      return data;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const selectPublicColleges = (state) => state.colleges.publicColleges;
export const selectPlatformColleges = (state) => state.colleges.colleges;
export const selectCollegeById = (state, id) => state.colleges.collegesById[String(id)];

export default collegesSlice.reducer;
