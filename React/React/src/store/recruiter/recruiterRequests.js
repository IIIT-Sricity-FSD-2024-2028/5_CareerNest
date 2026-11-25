import { createAsyncThunk } from '@reduxjs/toolkit';
import { operations } from '../operations.js';
import { selectWorkspaceVersion } from '../sessionSlice.js';

export const loadRecruiterWorkspace = createAsyncThunk(
  'recruiter/loadWorkspace',
  async (_, { dispatch }) => {
    await Promise.all([
      dispatch(operations.listOpportunities()),
      dispatch(operations.listApplications()),
      dispatch(operations.listAssessments()),
      dispatch(operations.listNotifications()).catch(() => {}),
    ]);
  },
  {
    condition: ({ workspaceVersion }, { getState }) => selectWorkspaceVersion(getState()) === workspaceVersion,
    serializeError: (error) => ({
      message: error.message,
      response: error.response ? { data: error.response.data } : undefined,
    }),
  },
);
