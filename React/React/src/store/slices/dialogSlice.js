// Redux Flow (store/slices/dialogSlice.js):
// 1. Backend API -> Thunks (createSlice) call apiFetch([local/UI state (no direct API call)]).
// 2. extraReducers/reducers update this slice in the Redux store.
// 3. UI components read state via useSelector(selectActiveDialog) and update via dispatch(action).
import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const dialogSlice = createSlice({
  name: 'dialogs',
  initialState,
  reducers: {
    openDialog(state, action) {
      state.push(action.payload);
    },
    dismissDialog(state, action) {
      if (state[0]?.id === action.payload) state.shift();
    },
  },
});

export const { openDialog, dismissDialog } = dialogSlice.actions;
export const selectActiveDialog = (state) => state.dialogs[0];
export default dialogSlice.reducer;
