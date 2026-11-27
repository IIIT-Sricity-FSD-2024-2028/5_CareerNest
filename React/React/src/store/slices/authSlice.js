// Redux Flow (store/slices/authSlice.js):
// 1. Backend API -> Thunks (createAction, createAsyncThunk, createSlice, rejectWithValue, logoutUser, updateSessionUser, loginForm) call apiFetch([local/UI state (no direct API call)]).
// 2. extraReducers/reducers update this slice in the Redux store.
// 3. UI components read state via useSelector(selectSession, selectLoginForm, selectChangePasswordUi) and update via dispatch(action).
import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { clearSession } from '../../services/api.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const ROLE_REDIRECT = {
  candidate: '/candidate',
  alumni: '/alumni',
  recruiter: '/recruiter',
  placement_officer: '/placement',
  college_admin: '/college-admin',
  super_admin: '/super-admin',
};

export const resetWorkspace = createAction('auth/resetWorkspace');

export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    dispatch(setLoginPending());
    const cleanEmail = String(email || '').trim();
    const cleanPassword = String(password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      const msg = 'Please enter your email and password.';
      dispatch(setLoginRejected(msg));
      return rejectWithValue(msg);
    }

    try {
      const response = await fetch(`${BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
      });

      if (!response.ok) {
        let errorMsg = 'Invalid email or password.';
        try {
          const errorData = await response.json();
          if (Array.isArray(errorData.message)) {
            errorMsg = errorData.message.join(', ');
          } else if (errorData.message) {
            errorMsg = errorData.message;
          }
        } catch {
          // Keep fallback error message.
        }
        dispatch(setLoginRejected(errorMsg));
        return rejectWithValue(errorMsg);
      }

      const user = await response.json();
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userName', user.name || '');
      localStorage.setItem('userEmail', user.email || '');
      localStorage.setItem('userId', String(user.id));
      localStorage.setItem('collegeId', user.collegeId != null ? String(user.collegeId) : 'null');
      localStorage.setItem('accessToken', user.accessToken || '');

      if (user.role === 'recruiter') {
        localStorage.setItem('recruiterEmail', user.email);
        localStorage.setItem('recruiterName', user.name);
        localStorage.setItem('recruiterCompany', user.company || '');
      }

      const redirectUrl = ROLE_REDIRECT[user.role];
      if (!redirectUrl) {
        const msg = `Unknown role: ${user.role}`;
        dispatch(setLoginRejected(msg));
        return rejectWithValue(msg);
      }

      dispatch(setSession(user));
      dispatch(setLoginSuccess());
      return { user, redirectUrl };
    } catch (error) {
      console.error('[login] Network error:', error);
      const msg = 'Cannot reach login server. Make sure the backend is running on port 3000.';
      dispatch(setLoginRejected(msg));
      return rejectWithValue(msg);
    }
  },
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { dispatch }) => {
  clearSession();
  dispatch(setSession(null));
  window.location.replace('/login');
});

export const updateSessionUser = createAsyncThunk(
  'auth/updateSessionUser',
  async ({ user }, { dispatch }) => {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    dispatch(setSession(user));
    return true;
  },
);

// Initial Redux state for authentication and auth forms.
// Components read this via useSelector(selectSession) / useSelector(selectLoginForm)
// and update it via dispatch(signIn(...)), dispatch(logoutUser()), or dispatch(setSession(...)).
const initialState = {
  user: null,
  loginForm: {
    email: '',
    password: '',
    showPassword: false,
    message: '',
    messageColor: '',
    loading: false,
  },
  changePasswordUi: {
    form: { currentPassword: '', newPassword: '', confirmPassword: '' },
    showPasswords: false,
    error: '',
    success: false,
    saving: false,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession(state, action) {
      state.user = action.payload;
    },
    setLoginEmail(state, action) {
      state.loginForm.email = action.payload;
    },
    setLoginPassword(state, action) {
      state.loginForm.password = action.payload;
    },
    toggleLoginPasswordVisibility(state) {
      state.loginForm.showPassword = !state.loginForm.showPassword;
    },
    resetLoginForm(state) {
      state.loginForm = {
        email: '',
        password: '',
        showPassword: false,
        message: '',
        messageColor: '',
        loading: false,
      };
    },
    resetChangePasswordForm(state) {
      state.changePasswordUi = {
        form: { currentPassword: '', newPassword: '', confirmPassword: '' },
        showPasswords: false,
        error: '',
        success: false,
        saving: false,
      };
    },
    setChangePasswordField(state, action) {
      const { field, value } = action.payload;
      state.changePasswordUi.form[field] = value;
      if (state.changePasswordUi.error) state.changePasswordUi.error = '';
    },
    setShowChangePasswords(state, action) {
      state.changePasswordUi.showPasswords = Boolean(action.payload);
    },
    setChangePasswordError(state, action) {
      state.changePasswordUi.error = action.payload;
    },
    setChangePasswordSaving(state, action) {
      state.changePasswordUi.saving = Boolean(action.payload);
    },
    setChangePasswordSuccess(state) {
      state.changePasswordUi.success = true;
      state.changePasswordUi.form = { currentPassword: '', newPassword: '', confirmPassword: '' };
    },
    setLoginPending(state) {
      state.loginForm.message = '';
      state.loginForm.messageColor = '';
      state.loginForm.loading = true;
    },
    setLoginSuccess(state) {
      state.loginForm.message = 'Login successful! Redirecting…';
      state.loginForm.messageColor = 'green';
    },
    setLoginRejected(state, action) {
      state.loginForm.message =
        typeof action.payload === 'string' ? action.payload : 'Invalid email or password.';
      state.loginForm.messageColor = 'red';
      state.loginForm.loading = false;
    },
  },
});

export const {
  setSession,
  setLoginEmail,
  setLoginPassword,
  toggleLoginPasswordVisibility,
  resetLoginForm,
  resetChangePasswordForm,
  setChangePasswordField,
  setShowChangePasswords,
  setChangePasswordError,
  setChangePasswordSaving,
  setChangePasswordSuccess,
  setLoginPending,
  setLoginSuccess,
  setLoginRejected,
} = authSlice.actions;
export const selectSession = (state) => state.auth.user;
export const selectLoginForm = (state) => state.auth.loginForm;
export const selectChangePasswordUi = (state) => state.auth.changePasswordUi;
export default authSlice.reducer;
