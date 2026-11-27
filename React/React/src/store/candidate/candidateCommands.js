import { operations } from '../operations.js';
import { selectWorkspaceVersion } from '../sessionSlice.js';
import { candidateActions } from './candidateSlice.js';
import { loadCandidateSnapshot } from './candidateRequests.js';

// Company suffixes are not useful for referral eligibility. This permits an
// alumnus at "TechCorp Solutions" to be discovered for a "TechCorp" drive,
// while still requiring the same underlying company name.
const COMPANY_SUFFIXES = new Set([
    'and', 'co', 'company', 'corp', 'corporation', 'inc', 'incorporated',
    'limited', 'llc', 'llp', 'private', 'pvt', 'service', 'services',
    'solution', 'solutions', 'technologies', 'technology', 'ltd',
]);

export function referralCompanyKey(company) {
    return String(company || '')
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()
        .split(/\s+/)
        .filter((word) => word && !COMPANY_SUFFIXES.has(word))
        .join(' ');
}

const refreshWarning = 'Changes were saved, but some data could not be refreshed.';

async function refreshAfterWrite(dispatch, getState, workspaceVersion) {
    if (selectWorkspaceVersion(getState()) !== workspaceVersion) return;
    try {
        await dispatch(loadCandidateSnapshot({ workspaceVersion, silent: true })).unwrap();
    } catch {
        if (selectWorkspaceVersion(getState()) === workspaceVersion) {
            dispatch(candidateActions.refreshWarningChanged(refreshWarning));
        }
    }
}

export const candidateCommands = {
    reload: () => async (dispatch, getState) => {
        const workspaceVersion = selectWorkspaceVersion(getState());
        const result = await dispatch(loadCandidateSnapshot({ workspaceVersion, silent: true }));
        if (loadCandidateSnapshot.rejected.match(result) && selectWorkspaceVersion(getState()) === workspaceVersion) {
            dispatch(candidateActions.refreshWarningChanged('Could not refresh your data. Try again.'));
        }
    },
    applyToJob: (job, resumeFile, resumeUrl) => async (dispatch, getState) => {
        if (!resumeUrl) throw new Error('Select an uploaded resume before applying.');
        const workspaceVersion = selectWorkspaceVersion(getState());
        await dispatch(operations.createApplication({ opportunityId: job.id, resumeFile: resumeFile || undefined, resumeUrl }));
        await refreshAfterWrite(dispatch, getState, workspaceVersion);
    },

    withdrawApplication: (applicationId) => async (dispatch, getState) => {
        const workspaceVersion = selectWorkspaceVersion(getState());
        await dispatch(operations.withdrawApplication(applicationId));
        await refreshAfterWrite(dispatch, getState, workspaceVersion);
    },

    toggleSaved: (jobId, isSaved) => isSaved ? operations.unsaveDrive(jobId) : operations.saveDrive(jobId),

    markAllNotificationsRead: () => async (dispatch) => {
        dispatch(candidateActions.notificationsRead());
        await dispatch(operations.markAllNotificationsRead()).catch(() => {});
    },

    markNotificationRead: (notificationId) => async (dispatch) => {
        if (notificationId != null) await dispatch(operations.markNotificationRead(notificationId)).catch(() => {});
    },

    loadReferralAlumni: operations.listReferralAlumni,

    requestReferral: ({ applicationId, opportunityId, alumniId, message }) => async (dispatch, getState) => {
        const workspaceVersion = selectWorkspaceVersion(getState());
        await dispatch(operations.createReferral({ opportunityId, applicationId, alumniId, userMessage: message }));
        await refreshAfterWrite(dispatch, getState, workspaceVersion);
    },
};
