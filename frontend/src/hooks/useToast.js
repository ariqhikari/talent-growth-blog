import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return {
    toast: context.addToast,
    success: (msg, duration) => context.addToast(msg, 'success', duration),
    error: (msg, duration) => context.addToast(msg, 'error', duration),
    info: (msg, duration) => context.addToast(msg, 'info', duration),
  };
}

