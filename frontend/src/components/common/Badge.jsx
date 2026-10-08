import React from 'react';

export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-paper-200 text-ink-700 border-paper-300',
    accent: 'bg-accent-subtle text-accent border-accent-border',
    dark: 'bg-ink-900 text-paper-50 border-ink-950',
    outline: 'bg-transparent text-ink-600 border-paper-300',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
