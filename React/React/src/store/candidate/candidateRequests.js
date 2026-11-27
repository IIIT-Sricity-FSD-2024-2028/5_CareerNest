import { createAsyncThunk } from '@reduxjs/toolkit';
import { errorMessage } from '../../services/api.js';
import { operations } from '../operations.js';
import { selectSession, selectWorkspaceVersion } from '../sessionSlice.js';
import { buildProfile } from './candidateSnapshot.js';

const currentWorkspace = {
    condition: ({ workspaceVersion }, { getState }) => selectWorkspaceVersion(getState()) === workspaceVersion,
};

export const loadCandidateSnapshot = createAsyncThunk(
    'candidate/loadSnapshot',
    async (_, { dispatch, getState, rejectWithValue }) => {
        const id = selectSession(getState())?.id;
        if (!id) return null;

        try {
            const [user] = await Promise.all([
                dispatch(operations.getUser(id)),
                dispatch(operations.listOpportunities()),
                dispatch(operations.listMyApplications()),
                dispatch(operations.listNotifications()),
                dispatch(operations.listSavedDrives()),
                dispatch(operations.listMyAssessments()),
                dispatch(operations.listMyReferrals()),
                dispatch(operations.listAnnouncements()),
            ]);
            return buildProfile(user.data);
        } catch (error) {
            return rejectWithValue(errorMessage(error, 'Could not load your data.'));
        }
    },
    currentWorkspace,
);

export const saveCandidateProfile = createAsyncThunk(
    'candidate/saveProfile',
    async ({ id, payload }, { dispatch }) => {
        await dispatch(operations.updateUser(id, payload));
        return JSON.stringify(payload);
    },
    currentWorkspace,
);
