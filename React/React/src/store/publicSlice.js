import { createSlice } from '@reduxjs/toolkit';
import { addViewReducers } from './viewState.js';
import { landingContent } from '../public-pages/landing/data/landingContent.js';

export function readTheme() {
  const saved = localStorage.getItem('careernest-theme');
  return saved === 'light' || saved === 'dark' ? saved : 'dark';
}

const publicSlice = createSlice({
  name: 'publicPages',
  initialState: { views: {}, theme: 'dark', landingContent },
  reducers: {
    themeLoaded(state, { payload }) {
      state.theme = payload;
    },
    themeToggled(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
  },
  extraReducers: (builder) => {
    addViewReducers(builder, 'publicPages');
  },
});

export const { themeLoaded, themeToggled } = publicSlice.actions;
export const selectTheme = (state) => state.publicPages.theme;
export const selectLandingContent = (state) => state.publicPages.landingContent;
export default publicSlice.reducer;
