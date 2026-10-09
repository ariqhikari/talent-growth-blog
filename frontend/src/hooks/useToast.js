import { useContext, useCallback } from 'react';
import { ToastContext } from '../context/ToastContext';

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const toast = useCallback(
    (msg, type, duration) => context.addToast(msg, type, duration),
    [context.addToast]
  );
  const success = useCallback(
    (msg, duration) => context.addToast(msg, 'success', duration),
    [context.addToast]
  );
  const error = useCallback(
    (msg, duration) => context.addToast(msg, 'error', duration),
    [context.addToast]
  );
  const info = useCallback(
    (msg, duration) => context.addToast(msg, 'info', duration),
    [context.addToast]
  );

  return { toast, success, error };
}

