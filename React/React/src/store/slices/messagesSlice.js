// Redux Flow (store/slices/messagesSlice.js):
// 1. Backend API -> Thunks (fetchSentMessages, fetchInboxMessages, sendAdminMessage) call /super-admin/messages and /super-admin/inbox.
// 2. Thunks dispatch reducers (setSentMessages, setInboxMessages, addSentMessage, setMessagesLoading, setMessagesError).
// 3. UI components read state via useSelector(selectSentMessages, selectInboxMessages).
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api, { errorMessage, serializeApiError } from '../../services/api.js';

// Initial Redux state: message arrays read in Super Admin & College Admin UI via useSelector.
const initialState = {
  sentMessages: [],
  inboxMessages: [],
  loading: false,
  error: '',
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessagesLoading(state, action) {
      state.loading = Boolean(action.payload);
      if (action.payload) state.error = '';
    },
    setMessagesError(state, action) {
      state.loading = false;
      state.error = action.payload || '';
    },
    setSentMessages(state, action) {
      state.loading = false;
      state.sentMessages = action.payload;
    },
    setInboxMessages(state, action) {
      state.loading = false;
      state.inboxMessages = action.payload;
    },
    addSentMessage(state, action) {
      const message = action.payload;
      if (message?.id == null) return;
      state.sentMessages.push(message);
    },
  },
});

export const {
  setMessagesLoading,
  setMessagesError,
  setSentMessages,
  setInboxMessages,
  addSentMessage,
} = messagesSlice.actions;

// Thunks fetch and send Super Admin <-> College Admin messages and dispatch reducers above.
export const fetchSentMessages = createAsyncThunk(
  'messages/fetchSentMessages',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setMessagesLoading(true));
    try {
      const { data } = await api.get('/super-admin/messages');
      const list = Array.isArray(data) ? data : [];
      dispatch(setSentMessages(list));
      return list;
    } catch (error) {
      const err = serializeApiError(error);
      dispatch(setMessagesError(errorMessage(err)));
      return rejectWithValue(err);
    }
  },
);

export const fetchInboxMessages = createAsyncThunk(
  'messages/fetchInboxMessages',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setMessagesLoading(true));
    try {
      const { data } = await api.get('/super-admin/inbox');
      const list = Array.isArray(data) ? data : [];
      dispatch(setInboxMessages(list));
      return list;
    } catch (error) {
      const err = serializeApiError(error);
      dispatch(setMessagesError(errorMessage(err)));
      return rejectWithValue(err);
    }
  },
);

export const sendAdminMessage = createAsyncThunk(
  'messages/sendAdminMessage',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.post('/super-admin/messages', payload);
      dispatch(addSentMessage(data));
      return data;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const selectSentMessages = (state) => state.messages.sentMessages;
export const selectInboxMessages = (state) => state.messages.inboxMessages;

export default messagesSlice.reducer;
