import { createSlice } from '@reduxjs/toolkit';

const resources = createSlice({
  name: 'resources',
  initialState: {},
  reducers: {
    started(state, { payload: { key, requestId } }) {
      state[key] = { data: state[key]?.data, requestId, status: 'loading', error: '' };
    },
    finished(state, { payload: { key, requestId, data } }) {
      if (state[key]?.requestId === requestId) Object.assign(state[key], { data, status: 'ready' });
    },
    failed(state, { payload: { key, requestId, error } }) {
      if (state[key]?.requestId === requestId) Object.assign(state[key], { status: 'error', error });
    },
  },
});

export const resourceActions = resources.actions;
export const selectResource = (state, key) => state.resources[key]?.data;
export default resources.reducer;
