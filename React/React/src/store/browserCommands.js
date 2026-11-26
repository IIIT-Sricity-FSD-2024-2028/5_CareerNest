import { createAction } from '@reduxjs/toolkit';

export const navigationRequested = createAction('browser/navigationRequested');
export const scrollRequested = createAction('browser/scrollRequested');
export const downloadRequested = createAction('browser/downloadRequested');
export const filePickerRequested = createAction('browser/filePickerRequested');
export const clipboardCopyRequested = createAction('browser/clipboardCopyRequested');

export const browserCommands = {
  navigate: (navigate, to, options) => (dispatch) => {
    dispatch(navigationRequested(to));
    return navigate(to, options);
  },
  visit: (to, { replace = false } = {}) => (dispatch) => {
    dispatch(navigationRequested(to));
    if (replace) window.location.replace(to);
    else window.location.assign(to);
  },
  scrollTo: (id) => (dispatch) => {
    dispatch(scrollRequested(id));
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  },
  download: (filename, contents, type) => (dispatch) => {
    dispatch(downloadRequested(filename));
    const url = URL.createObjectURL(new Blob([contents], { type }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },
  chooseFile: (input, purpose) => (dispatch) => {
    dispatch(filePickerRequested(purpose));
    input?.click();
  },
  copyText: (text) => (dispatch) => {
    dispatch(clipboardCopyRequested());
    return navigator.clipboard?.writeText(text);
  },
};
