// Redux Flow (store/slices/announcementsSlice.js):
// 1. Backend API -> Thunks (fetchAnnouncements, createAnnouncement, deleteAnnouncement) call /announcements.
// 2. Thunks dispatch reducers (setAnnouncements, addAnnouncement, removeAnnouncement, setAnnouncementsLoading, setAnnouncementsError).
// 3. UI components read state via useSelector(selectWorkspaceAnnouncements).
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api, { errorMessage, serializeApiError } from '../../services/api.js';

// Initial Redux state: announcements array read in UI via useSelector(selectWorkspaceAnnouncements).
const initialState = {
  announcements: [],
  loading: false,
  error: '',
};

const announcementsSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {
    setAnnouncementsLoading(state, action) {
      state.loading = Boolean(action.payload);
      if (action.payload) state.error = '';
    },
    setAnnouncementsError(state, action) {
      state.loading = false;
      state.error = action.payload || '';
    },
    setAnnouncements(state, action) {
      state.loading = false;
      state.announcements = action.payload;
    },
    addAnnouncement(state, action) {
      const announcement = action.payload;
      if (announcement?.id == null) return;
      state.announcements.push(announcement);
    },
    removeAnnouncement(state, action) {
      const id = String(action.payload);
      state.announcements = state.announcements.filter((item) => String(item.id) !== id);
    },
  },
});

export const {
  setAnnouncementsLoading,
  setAnnouncementsError,
  setAnnouncements,
  addAnnouncement,
  removeAnnouncement,
} = announcementsSlice.actions;

// Thunks call the backend API and dispatch reducers above.
export const fetchAnnouncements = createAsyncThunk(
  'announcements/fetchAnnouncements',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setAnnouncementsLoading(true));
    try {
      const { data } = await api.get('/announcements');
      const list = Array.isArray(data) ? data : [];
      dispatch(setAnnouncements(list));
      return list;
    } catch (error) {
      const err = serializeApiError(error);
      dispatch(setAnnouncementsError(errorMessage(err)));
      return rejectWithValue(err);
    }
  },
);

export const createAnnouncement = createAsyncThunk(
  'announcements/createAnnouncement',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.post('/announcements', payload);
      dispatch(addAnnouncement(data));
      return data;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const deleteAnnouncement = createAsyncThunk(
  'announcements/deleteAnnouncement',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/announcements/${id}`);
      dispatch(removeAnnouncement(id));
      return id;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

// Selector used by Candidate & College Admin UI to render announcements from Redux.
export const selectWorkspaceAnnouncements = (state) => state.announcements.announcements;

export default announcementsSlice.reducer;
