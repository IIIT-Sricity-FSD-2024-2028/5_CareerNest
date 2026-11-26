import { createSelector, createSlice } from '@reduxjs/toolkit';

const entityNames = [
  'opportunities', 'applications', 'assessments', 'referrals', 'notifications',
  'announcements', 'users', 'recruiterRegistrations', 'colleges', 'savedDrives',
  'messages', 'activityEntries', 'notificationDeliveries',
];
const emptyList = [];

function createEntitySlice(name) {
  return createSlice({
    name,
    initialState: { records: {}, lists: {}, reads: {}, lastRead: {}, writeRevision: 0 },
    reducers: {
      readStarted(state, { payload: { key, requestId } }) {
        state.reads[key] = { requestId, status: 'loading', error: '' };
      },
      readFinished(state, { payload: { key, requestId, writeRevision, records } }) {
        const read = state.reads[key];
        if (read?.requestId !== requestId) return;
        read.status = 'ready';
        if (writeRevision !== state.writeRevision) return;
        const ids = [];
        for (const record of records) {
          if (record?.id == null) continue;
          const id = String(record.id);
          if ((state.lastRead[id] ?? 0) <= requestId) {
            state.records[id] = { ...state.records[id], ...record };
            state.lastRead[id] = requestId;
          } else {
            state.records[id] = { ...record, ...state.records[id] };
          }
          ids.push(id);
        }
        state.lists[key] = ids;
      },
      readFailed(state, { payload: { key, requestId, error } }) {
        const read = state.reads[key];
        if (read?.requestId === requestId) Object.assign(read, { status: 'error', error });
      },
      written(state, { payload: { records, addTo = [] } }) {
        state.writeRevision += 1;
        for (const record of records) {
          const id = String(record.id);
          state.records[id] = { ...state.records[id], ...record };
          for (const key of addTo) {
            const ids = state.lists[key] ||= [];
            if (!ids.includes(id)) ids.unshift(id);
          }
        }
      },
      removed(state, { payload: recordId }) {
        const id = String(recordId);
        state.writeRevision += 1;
        delete state.records[id];
        delete state.lastRead[id];
        for (const key of Object.keys(state.lists)) {
          state.lists[key] = state.lists[key].filter((item) => item !== id);
        }
      },
    },
  });
}

const slices = Object.fromEntries(entityNames.map((name) => [name, createEntitySlice(name)]));

export const entityReducers = Object.fromEntries(entityNames.map((name) => [name, slices[name].reducer]));
export const entityActions = Object.fromEntries(entityNames.map((name) => [name, slices[name].actions]));
export const selectEntity = (state, name, id) => state[name].records[String(id)];
export const selectEntityRead = (state, name, key) => state[name].reads[key];
export const entityListSelector = (name, key) => createSelector(
  [(state) => state[name].lists[key] ?? emptyList, (state) => state[name].records],
  (ids, records) => ids.map((id) => records[id]).filter(Boolean),
);
