import { bindActionCreators } from '@reduxjs/toolkit';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { browserCommands } from './browserCommands.js';

export function useBrowserCommands() {
  const dispatch = useDispatch();
  return useMemo(() => bindActionCreators(browserCommands, dispatch), [dispatch]);
}

export function useReduxNavigate() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return useCallback((to, options) => dispatch(browserCommands.navigate(navigate, to, options)), [dispatch, navigate]);
}
