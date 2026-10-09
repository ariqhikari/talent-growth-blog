import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 select-none focus-visible:outline-2 focus-visible:outline-offset-2';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-accent text-white hover:bg-accent-hover active:translate-y-[1px] focus-visible:outline-accent disabled:bg-ink-400 disabled:opacity-60 shadow-tactile-sm',
    secondary: 'bg-paper-50 text-ink-800 border border-paper-300 hover:bg-paper-200 hover:border-ink-400 active:translate-y-[1px] focus-visible:outline-accent disabled:opacity-50 shadow-tactile-sm',
    ghost: 'bg-transparent text-ink-700 hover:bg-paper-200 hover:text-ink-950 active:translate-y-[1px] focus-visible:outline-accent disabled:opacity-50',
    danger: 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 hover:border-red-300 active:translate-y-[1px] focus-visible:outline-red-600 disabled:opacity-50',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
        disabled || isLoading ? 'cursor-not-allowed pointer-events-none' : ''
      } ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {children}
    </button>
  );
}

