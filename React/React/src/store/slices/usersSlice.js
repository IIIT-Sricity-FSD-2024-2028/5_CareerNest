// Redux Flow (store/slices/usersSlice.js):
// 1. Backend API -> Thunks (createAsyncThunk, createSlice, fetchUserById, rejectWithValue, fetchUsers, fetchOversightUsers, fetchOfficerCandidates, fetchReferralAlumni) call apiFetch([/users, /users/oversight, /users/alumni-directory]).
// 2. extraReducers/reducers update this slice in the Redux store.
// 3. UI components read state via useSelector(selectSession, selectDirectoryUi, selectCsvImportUi, selectUserById, selectCurrentUser, selectUsersDirectory, selectOversightUsers, selectOfficerCandidates, selectReferralAlumni, selectAlumniDirectory, selectCollegeOfficers, selectCollegeStudents, selectCollegeAlumni) and update via dispatch(action).
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api, { errorMessage, serializeApiError } from '../../services/api.js';
import { selectSession } from './authSlice.js';

const EMPTY_DIRECTORY_FORM = {
  name: '',
  email: '',
  rollNumber: '',
  department: '',
  cgpa: '',
  backlogs: '0',
  company: '',
  batch: '',
  referrals: '0',
  headline: '',
  location: '',
};

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.get(`/users/${id}`);
      dispatch(upsertUserRecord(data));
      return data;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (role, { dispatch, rejectWithValue }) => {
    const key = role || 'directory';
    dispatch(setUsersLoading(true));
    try {
      const { data } = await api.get('/users', role ? { params: { role } } : undefined);
      const payload = { key, users: Array.isArray(data) ? data : [] };
      dispatch(setUsersByRole(payload));
      return payload;
    } catch (error) {
      const err = serializeApiError(error);
      dispatch(setUsersError(errorMessage(err)));
      return rejectWithValue(err);
    }
  },
);

export const fetchOversightUsers = createAsyncThunk(
  'users/fetchOversightUsers',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.get('/users/oversight');
      const list = Array.isArray(data) ? data : [];
      dispatch(setOversightUsers(list));
      return list;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const fetchOfficerCandidates = createAsyncThunk(
  'users/fetchOfficerCandidates',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.get('/features/officer/candidates/filter');
      const list = data.map(({ dept, rollNo, batch, status, ...user }) => ({
        ...user,
        role: 'candidate',
        department: dept,
        rollNumber: rollNo,
        batchLabel: batch,
        ...(status === 'Placed' ? { status: 'placed' } : {}),
      }));
      dispatch(setOfficerCandidates(list));
      return list;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const fetchReferralAlumni = createAsyncThunk(
  'users/fetchReferralAlumni',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.get('/users/alumni-directory');
      const list = Array.isArray(data) ? data : [];
      dispatch(setReferralAlumni(list));
      return list;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const fetchAlumniDirectory = createAsyncThunk(
  'users/fetchAlumniDirectory',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.get('/features/alumni/directory');
      const list = data.map(({ role: headline, dept, linkedin, ...user }) => ({
        ...user,
        role: 'alumni',
        headline,
        department: dept,
        directoryLinkedIn: linkedin,
      }));
      dispatch(setAlumniDirectory(list));
      return list;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.post('/users', payload);
      const result = { user: data, role: payload.role };
      dispatch(addCreatedUser(result));
      return result;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const createPlacementOfficer = createAsyncThunk(
  'users/createPlacementOfficer',
  async (payload, { dispatch, getState, rejectWithValue }) => {
    const session = selectSession(getState());
    try {
      const { data } = await api.post('/users', {
        ...payload,
        role: 'placement_officer',
        collegeId: Number(session?.collegeId),
      });
      dispatch(addPlacementOfficer(data));
      return data;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, data: payload }, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.put(`/users/${id}`, payload);
      dispatch(upsertUserRecord(data));
      return data;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const updatePlacementOfficerStatus = createAsyncThunk(
  'users/updatePlacementOfficerStatus',
  async ({ id, status }, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.put(`/users/${id}`, { status });
      dispatch(upsertUserRecord(data));
      return data;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/users/${id}`);
      dispatch(removeUserRecord(id));
      return id;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const assignCollegeAdmin = createAsyncThunk(
  'users/assignCollegeAdmin',
  async ({ collegeId, data: payload }, { dispatch, getState, rejectWithValue }) => {
    try {
      const previousAdminId = getState().colleges.collegesById[String(collegeId)]?.adminId;
      const { data: admin } = await api.post(`/super-admin/colleges/${collegeId}/admin`, payload);
      const records = previousAdminId == null
        ? [admin]
        : [{ id: previousAdminId, status: 'inactive' }, admin];
      dispatch(upsertUserRecords(records));
      return { collegeId, admin, records };
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const updateCollegeAdminStatus = createAsyncThunk(
  'users/updateCollegeAdminStatus',
  async ({ collegeId, status }, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/super-admin/colleges/${collegeId}/admin/status`, { status });
      dispatch(upsertUserRecord(data));
      return data;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const uploadResume = createAsyncThunk(
  'users/uploadResume',
  async ({ id, form }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/users/${id}/resume`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const changePassword = createAsyncThunk(
  'users/changePassword',
  async ({ id, data: payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/users/${id}/password`, payload);
      return data;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const importUsers = createAsyncThunk(
  'users/importUsers',
  async ({ endpoint, data: payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(endpoint, payload);
      return data;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

const USER_LIST_FIELDS = [
  'directoryUsers',
  'oversightUsers',
  'officerCandidates',
  'referralAlumni',
  'alumniDirectory',
  'collegeOfficers',
  'collegeStudents',
  'collegeAlumni',
  'collegeAdmins',
];

function cacheUsers(state, users) {
  for (const user of users) {
    if (user?.id != null) {
      state.usersById[String(user.id)] = { ...state.usersById[String(user.id)], ...user };
    }
  }
}

function updateUserAcrossLists(state, updated) {
  if (updated?.id == null) return;
  const id = String(updated.id);
  state.usersById[id] = { ...state.usersById[id], ...updated };
  for (const field of USER_LIST_FIELDS) {
    state[field] = state[field].map((item) => (String(item.id) === id ? { ...item, ...updated } : item));
  }
}

function removeUserAcrossLists(state, rawId) {
  if (rawId == null) return;
  const id = String(rawId);
  delete state.usersById[id];
  for (const field of USER_LIST_FIELDS) {
    state[field] = state[field].filter((item) => String(item.id) !== id);
  }
}

const initialState = {
  usersById: {},
  directoryUsers: [],
  oversightUsers: [],
  officerCandidates: [],
  referralAlumni: [],
  alumniDirectory: [],
  collegeOfficers: [],
  collegeStudents: [],
  collegeAlumni: [],
  collegeAdmins: [],
  loading: false,
  error: '',
  directoryUi: {
    loadError: '',
    loading: false,
    activeTab: 'candidates',
    search: '',
    branch: '',
    addOpen: false,
    csvOpen: false,
    form: EMPTY_DIRECTORY_FORM,
    saving: false,
    removingId: null,
    formError: '',
    fieldErrors: {},
    submitted: false,
  },
  csvImportUi: {
    csv: '',
    result: null,
    error: '',
    busy: false,
    filename: '',
  },
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    initDirectoryTab(state, action) {
      state.directoryUi.activeTab = action.payload;
      state.directoryUi.search = '';
      state.directoryUi.branch = '';
    },
    setDirectoryLoading(state, action) {
      state.directoryUi.loading = Boolean(action.payload);
    },
    setDirectoryLoadError(state, action) {
      state.directoryUi.loadError = action.payload;
    },
    setDirectoryTab(state, action) {
      state.directoryUi.activeTab = action.payload;
      state.directoryUi.search = '';
      state.directoryUi.branch = '';
    },
    setDirectorySearch(state, action) {
      state.directoryUi.search = action.payload;
    },
    setDirectoryBranch(state, action) {
      state.directoryUi.branch = action.payload;
    },
    openAddUserModal(state) {
      state.directoryUi.form = EMPTY_DIRECTORY_FORM;
      state.directoryUi.formError = '';
      state.directoryUi.fieldErrors = {};
      state.directoryUi.submitted = false;
      state.directoryUi.addOpen = true;
    },
    closeAddUserModal(state) {
      state.directoryUi.addOpen = false;
    },
    openCsvImportModal(state) {
      state.directoryUi.csvOpen = true;
    },
    closeCsvImportModal(state) {
      state.directoryUi.csvOpen = false;
    },
    setDirectoryFormField(state, action) {
      const { field, value } = action.payload;
      state.directoryUi.form[field] = value;
    },
    setDirectoryFieldErrors(state, action) {
      state.directoryUi.fieldErrors = action.payload;
    },
    setDirectoryFormError(state, action) {
      state.directoryUi.formError = action.payload;
    },
    setDirectorySubmitted(state, action) {
      state.directoryUi.submitted = Boolean(action.payload);
    },
    setDirectorySaving(state, action) {
      state.directoryUi.saving = Boolean(action.payload);
    },
    setDirectoryRemovingId(state, action) {
      state.directoryUi.removingId = action.payload;
    },
    resetCsvImport(state) {
      state.csvImportUi = { csv: '', result: null, error: '', busy: false, filename: '' };
    },
    startCsvImportFile(state, action) {
      state.csvImportUi.csv = '';
      state.csvImportUi.result = null;
      state.csvImportUi.error = '';
      state.csvImportUi.filename = action.payload || '';
    },
    setCsvImportBusy(state, action) {
      state.csvImportUi.busy = Boolean(action.payload);
    },
    setCsvImportPreview(state, action) {
      state.csvImportUi.csv = action.payload.csv;
      state.csvImportUi.result = action.payload.result;
    },
    setCsvImportResult(state, action) {
      state.csvImportUi.result = action.payload;
      if (action.payload?.imported) {
        state.csvImportUi.csv = '';
      }
    },
    setCsvImportError(state, action) {
      state.csvImportUi.error = action.payload;
    },
    setUsersLoading(state, action) {
      state.loading = Boolean(action.payload);
      if (action.payload) state.error = '';
    },
    setUsersError(state, action) {
      state.loading = false;
      state.error = action.payload || '';
    },
    setUsersByRole(state, action) {
      state.loading = false;
      const { key, users } = action.payload;
      cacheUsers(state, users);
      if (key === 'placement_officer') state.collegeOfficers = users;
      else if (key === 'candidate') state.collegeStudents = users;
      else if (key === 'alumni') state.collegeAlumni = users;
      else state.directoryUsers = users;
    },
    setOversightUsers(state, action) {
      cacheUsers(state, action.payload);
      state.oversightUsers = action.payload;
    },
    setOfficerCandidates(state, action) {
      cacheUsers(state, action.payload);
      state.officerCandidates = action.payload;
    },
    setReferralAlumni(state, action) {
      cacheUsers(state, action.payload);
      state.referralAlumni = action.payload;
    },
    setAlumniDirectory(state, action) {
      cacheUsers(state, action.payload);
      state.alumniDirectory = action.payload;
    },
    setCollegeAdmins(state, action) {
      cacheUsers(state, action.payload);
      state.collegeAdmins = action.payload;
    },
    addCreatedUser(state, action) {
      const { user, role } = action.payload || {};
      if (!user?.id) return;
      state.usersById[String(user.id)] = user;
      state.directoryUsers.push(user);
      if (role === 'candidate') state.collegeStudents.push(user);
      if (role === 'alumni') state.collegeAlumni.push(user);
      if (role === 'placement_officer') state.collegeOfficers.push(user);
    },
    addPlacementOfficer(state, action) {
      const officer = action.payload;
      if (officer?.id == null) return;
      state.usersById[String(officer.id)] = officer;
      state.collegeOfficers.push(officer);
    },
    upsertUserRecord(state, action) {
      updateUserAcrossLists(state, action.payload);
    },
    upsertUserRecords(state, action) {
      const records = action.payload;
      if (!Array.isArray(records)) return;
      for (const record of records) {
        updateUserAcrossLists(state, record);
      }
    },
    removeUserRecord(state, action) {
      removeUserAcrossLists(state, action.payload);
    },
  },
});

export const {
  initDirectoryTab,
  setDirectoryLoading,
  setDirectoryLoadError,
  setDirectoryTab,
  setDirectorySearch,
  setDirectoryBranch,
  openAddUserModal,
  closeAddUserModal,
  openCsvImportModal,
  closeCsvImportModal,
  setDirectoryFormField,
  setDirectoryFieldErrors,
  setDirectoryFormError,
  setDirectorySubmitted,
  setDirectorySaving,
  setDirectoryRemovingId,
  resetCsvImport,
  startCsvImportFile,
  setCsvImportBusy,
  setCsvImportPreview,
  setCsvImportResult,
  setCsvImportError,
  setUsersLoading,
  setUsersError,
  setUsersByRole,
  setOversightUsers,
  setOfficerCandidates,
  setReferralAlumni,
  setAlumniDirectory,
  setCollegeAdmins,
  addCreatedUser,
  addPlacementOfficer,
  upsertUserRecord,
  upsertUserRecords,
  removeUserRecord,
} = usersSlice.actions;

export const selectDirectoryUi = (state) => state.users.directoryUi;
export const selectCsvImportUi = (state) => state.users.csvImportUi;
export const selectUserById = (state, id) => state.users.usersById[String(id)];
export const selectCurrentUser = (state) => selectUserById(state, selectSession(state)?.id) ?? selectSession(state);
export const selectUsersDirectory = (state) => state.users.directoryUsers;
export const selectOversightUsers = (state) => state.users.oversightUsers;
export const selectOfficerCandidates = (state) => state.users.officerCandidates;
export const selectReferralAlumni = (state) => state.users.referralAlumni;
export const selectAlumniDirectory = (state) => state.users.alumniDirectory;
export const selectCollegeOfficers = (state) => state.users.collegeOfficers;
export const selectCollegeStudents = (state) => state.users.collegeStudents;
export const selectCollegeAlumni = (state) => state.users.collegeAlumni;

export default usersSlice.reducer;
