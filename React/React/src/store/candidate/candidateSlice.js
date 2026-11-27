import { createSelector, createSlice } from '@reduxjs/toolkit';
import { addViewReducers } from '../viewState.js';
import { workspaceChanged } from '../sessionSlice.js';
import { entityListSelector } from '../entities.js';
import { buildProfile, buildStore, profilePayload } from './candidateSnapshot.js';
import { loadCandidateSnapshot, saveCandidateProfile } from './candidateRequests.js';

const emptyUI = {
    notifOpen: false,
    askQueryOpen: false,
    queryMessage: '',
    successModal: { open: false, title: 'Success!', message: 'Operation completed.' },
};

function addResumeRecord(state, section, record) {
    const resume = state.profileDraft.profileResumeData;
    (resume[section] ||= []).push(record);
}

const candidateSlice = createSlice({
    name: 'candidate',
    initialState: {
        views: {}, profileDraft: buildProfile(), eligibility: {}, notices: [],
        loading: true, loadError: '', refreshWarning: '', ui: emptyUI,
        profileSync: { hydrated: false, lastSaved: '' },
    },
    reducers: {
        loadFinished(state) {
            state.loading = false;
        },
        refreshWarningChanged(state, { payload }) {
            state.refreshWarning = payload;
        },
        notificationsRead(state) {
            state.notices.forEach((notification) => { notification.isRead = true; });
        },
        eligibilityChecked(state, { payload: jobId }) {
            state.eligibility[jobId] = true;
        },
        resumeUploaded(state, { payload: entry }) {
            const resume = state.profileDraft.profileResumeData;
            resume.uploadedResume = entry;
            resume.resumeHistory = [entry, ...(resume.resumeHistory || [])];
        },
        introSaved(state, { payload: { github, linkedin, portfolio, ...intro } }) {
            const user = state.profileDraft.currentUser;
            Object.assign(user, intro, { socialLinks: { github, linkedin, portfolio } });
            const parts = user.name.split(' ');
            user.avatar = parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
        },
        aboutSaved(state, { payload }) {
            state.profileDraft.currentUser.about = payload;
        },
        resumeRecordAdded(state, { payload: { section, record } }) {
            addResumeRecord(state, section, record);
        },
        resumeRecordRemoved(state, { payload: { type, index } }) {
            const records = state.profileDraft.profileResumeData[type];
            if (records) records.splice(index, 1);
            state.notices.unshift({ title: 'Record Deleted', message: 'Item removed successfully from your profile.', isRead: false });
        },
        profileImageRemoved(state, { payload: target }) {
            state.profileDraft.currentUser[target] = '';
            state.notices.unshift({ title: 'Image Deleted', message: 'Media successfully removed from your profile.', isRead: false });
        },
        profileImageUploaded(state, { payload: { target, image } }) {
            if (target === 'banner') state.profileDraft.currentUser.bannerImage = image;
            if (target === 'avatar') state.profileDraft.currentUser.avatarImage = image;
        },
        documentUploaded(state, { payload: document }) {
            addResumeRecord(state, 'additionalDocs', document);
            state.notices.unshift({
                title: 'Document Uploaded', message: `Successfully uploaded ${document.name}.`, isRead: false,
            });
        },
        notificationsToggled(state) {
            state.ui.notifOpen = !state.ui.notifOpen;
        },
        notificationsClosed(state) {
            state.ui.notifOpen = false;
        },
        queryOpened(state) {
            state.ui.queryMessage = '';
            state.ui.askQueryOpen = true;
        },
        queryClosed(state) {
            state.ui.askQueryOpen = false;
        },
        queryMessageChanged(state, { payload }) {
            state.ui.queryMessage = payload;
        },
        querySubmitted(state) {
            state.ui.askQueryOpen = false;
            state.ui.queryMessage = '';
            state.ui.successModal = {
                open: true,
                title: 'Query Sent',
                message: 'Your query was sent successfully. We will get back to you shortly.',
            };
        },
        successOpened(state, { payload: { title, message } }) {
            state.ui.successModal = { open: true, title, message };
        },
        successClosed(state) {
            state.ui.successModal.open = false;
        },
    },
    extraReducers: (builder) => {
        addViewReducers(builder, 'candidate');
        builder
            .addCase(workspaceChanged, (state, { payload: session }) => {
                if (session?.role === 'candidate') state.profileDraft = buildProfile(session);
            })
            .addCase(loadCandidateSnapshot.fulfilled, (state, { payload: snapshot, meta }) => {
                if (!snapshot) {
                    state.loading = false;
                    return;
                }
                // A background refresh must preserve profile edits in progress.
                if (!state.profileSync.hydrated || !meta.arg.silent) {
                    state.profileDraft = snapshot;
                    state.profileSync.lastSaved = JSON.stringify(profilePayload(snapshot));
                }
                state.profileSync.hydrated = true;
                state.loadError = '';
                state.refreshWarning = '';
            })
            .addCase(loadCandidateSnapshot.rejected, (state, { payload, meta }) => {
                if (!meta.arg.silent) state.loadError = payload;
            })
            .addCase(saveCandidateProfile.fulfilled, (state, { payload }) => {
                state.profileSync.lastSaved = payload;
            });
    },
});

export const candidateActions = candidateSlice.actions;
export const selectCandidateProfile = (state) => state.candidate.profileDraft;
const selectInbox = entityListSelector('notifications', 'inbox');
export const selectCandidateNotifications = createSelector(
    [(state) => state.candidate.notices, selectInbox],
    (notices, inbox) => [...notices, ...inbox],
);
export const selectCandidateStore = createSelector(
    [
        selectCandidateProfile,
        (state) => state.candidate.eligibility,
        entityListSelector('opportunities', 'workspace'),
        entityListSelector('applications', 'mine'),
        selectCandidateNotifications,
        entityListSelector('savedDrives', 'mine'),
        entityListSelector('assessments', 'mine'),
        entityListSelector('referrals', 'mine'),
        entityListSelector('announcements', 'workspace'),
    ],
    (profile, eligibility, jobs, applications, notifications, saved, schedule, referrals, announcements) => buildStore({
        profile, eligibility, jobs, applications, notifications, savedIds: saved.map((drive) => drive.id),
        schedule, referrals, announcements,
    }),
);
export const selectCandidateWorkspace = (state) => {
    const { loading, loadError, refreshWarning } = state.candidate;
    return { store: selectCandidateStore(state), loading, loadError, refreshWarning };
};
export const selectCandidateUI = (state) => state.candidate.ui;
export const selectCandidateProfileSync = (state) => state.candidate.profileSync;
export const selectUnreadCandidateNotifications = createSelector(
    [selectCandidateNotifications],
    (notifications) => notifications.filter((notification) => !notification.isRead).length,
);
export default candidateSlice.reducer;
