// Redux Flow (store/slices/savedDrivesSlice.js):
// 1. Backend API -> Thunks (fetchSavedDrives, saveDrive, unsaveDrive) call /features/candidate/saved-drive-ids & /drives/:id/save.
// 2. Thunks dispatch reducers (setSavedDrives, addSavedDrive, removeSavedDrive).
// 3. UI components read state via useSelector(selectMySavedDrives).
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api, { errorMessage, serializeApiError } from '../../services/api.js';

// Initial Redux state: savedDrives array passed to Candidate UI via useSelector.
const initialState = {
  savedDrives: [],
  loading: false,
  error: '',
};

const savedDrivesSlice = createSlice({
  name: 'savedDrives',
  initialState,
  reducers: {
    setSavedDrivesLoading(state, action) {
      state.loading = Boolean(action.payload);
      if (action.payload) state.error = '';
    },
    setSavedDrivesError(state, action) {
      state.loading = false;
      state.error = action.payload || '';
    },
    setSavedDrives(state, action) {
      state.loading = false;
      state.savedDrives = action.payload;
    },
    addSavedDrive(state, action) {
      const drive = action.payload;
      if (!state.savedDrives.some((item) => item.id === drive.id)) {
        state.savedDrives.push(drive);
      }
    },
    removeSavedDrive(state, action) {
      const id = Number(action.payload);
      state.savedDrives = state.savedDrives.filter((item) => item.id !== id);
    },
  },
});

export const {
  setSavedDrivesLoading,
  setSavedDrivesError,
  setSavedDrives,
  addSavedDrive,
  removeSavedDrive,
} = savedDrivesSlice.actions;

// Thunks call saved-drives endpoints and dispatch reducers above.
export const fetchSavedDrives = createAsyncThunk(
  'savedDrives/fetchSavedDrives',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setSavedDrivesLoading(true));
    try {
      const { data } = await api.get('/features/candidate/saved-drive-ids');
      const list = Array.isArray(data) ? data.map((id) => ({ id: Number(id) })) : [];
      dispatch(setSavedDrives(list));
      return list;
    } catch (error) {
      const err = serializeApiError(error);
      dispatch(setSavedDrivesError(errorMessage(err)));
      return rejectWithValue(err);
    }
  },
);

export const saveDrive = createAsyncThunk(
  'savedDrives/saveDrive',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await api.post(`/features/candidate/drives/${id}/save`);
      const drive = { id: Number(id) };
      dispatch(addSavedDrive(drive));
      return drive;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const unsaveDrive = createAsyncThunk(
  'savedDrives/unsaveDrive',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/features/candidate/drives/${id}/save`);
      dispatch(removeSavedDrive(id));
      return id;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const selectMySavedDrives = (state) => state.savedDrives.savedDrives;

export default savedDrivesSlice.reducer;
