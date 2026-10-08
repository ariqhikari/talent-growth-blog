import React from 'react';

export function Avatar({ name = 'User', src = '', size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base font-semibold',
    xl: 'w-20 h-20 text-xl font-bold',
  };

  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeMap[size]} rounded-full object-cover border border-paper-300 shadow-tactile-sm bg-paper-200 ${className}`}
        onError={(e) => {
          // Fallback to initial on broken image URL
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  // Consistent hue generator from user name
  const colors = [
    'bg-amber-100 text-amber-900 border-amber-300',
    'bg-stone-200 text-stone-900 border-stone-300',
    'bg-orange-100 text-orange-900 border-orange-300',
    'bg-emerald-100 text-emerald-900 border-emerald-300',
    'bg-slate-200 text-slate-800 border-slate-300',
  ];
  const charCode = (name || 'U').charCodeAt(0);
  const colorClass = colors[charCode % colors.length];

  return (
    <div
      className={`${sizeMap[size]} rounded-full flex items-center justify-center font-medium border select-none shrink-0 ${colorClass} ${className}`}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}

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
