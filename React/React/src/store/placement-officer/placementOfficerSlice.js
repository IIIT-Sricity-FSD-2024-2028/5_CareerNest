import { createSlice } from '@reduxjs/toolkit';
import { loadOfficerData } from './officerCommands.js';
import { addViewReducers } from '../viewState.js';
import { readSavedPage } from '../../shared/utils/navigationState.js';

export const PLACEMENT_PAGES = ['p1', 'dashboard', 'p2', 'review', 'p3', 'statistics', 'placement-dashboard', 'dept-report', 'p4', 'recruiters', 'p5', 'oversight', 'p6', 'tracking', 'bulk-notify', 'profile'];
export const PLACEMENT_PAGE_KEY = 'cn_active_placement_page';

const placementOfficerSlice = createSlice({
  name: 'placementOfficer',
  initialState: () => ({ views: {}, currentPage: readSavedPage(PLACEMENT_PAGE_KEY, 'p1', PLACEMENT_PAGES), request: { id: null, ready: false, error: '' } }),
  reducers: {
    pageChanged(state, { payload }) {
      state.currentPage = payload;
    },
  },
  extraReducers: (builder) => {
    addViewReducers(builder, 'placementOfficer');
    builder
      .addCase(loadOfficerData.pending, (state, { meta }) => {
        state.request.id = meta.requestId;
      })
      .addCase(loadOfficerData.fulfilled, (state, { meta }) => {
        if (state.request.id === meta.requestId) state.request = { id: null, ready: true, error: '' };
      })
      .addCase(loadOfficerData.rejected, (state, { meta }) => {
        if (state.request.id !== meta.requestId) return;
        state.request.id = null;
        state.request.error = 'Could not load data from the server.';
      });
  },
});

export const placementOfficerActions = placementOfficerSlice.actions;
export const selectPlacementPage = (state) => state.placementOfficer.currentPage;
export const selectOfficerRequest = (state) => state.placementOfficer.request;
export default placementOfficerSlice.reducer;
