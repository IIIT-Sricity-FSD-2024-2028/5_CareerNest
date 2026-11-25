import { createAsyncThunk } from '@reduxjs/toolkit';
import { operations } from '../operations.js';
import { selectWorkspaceVersion } from '../sessionSlice.js';

export const loadOfficerData = createAsyncThunk(
  'placementOfficer/loadData',
  async (_, { dispatch }) => {
    await Promise.all([
      dispatch(operations.listOpportunities()),
      dispatch(operations.listApplications()),
      dispatch(operations.listOversightUsers()),
      dispatch(operations.listRecruiterRegistrations()),
      dispatch(operations.listAssessments()),
      dispatch(operations.getOfficerPlacement()),
      dispatch(operations.listAnnouncements()).catch(() => {}),
      dispatch(operations.listNotifications()).catch(() => {}),
    ]);
  },
  {
    condition: ({ workspaceVersion, force }, { getState }) => {
      const state = getState();
      return selectWorkspaceVersion(state) === workspaceVersion && (force || state.placementOfficer.request.id == null);
    },
  },
);
