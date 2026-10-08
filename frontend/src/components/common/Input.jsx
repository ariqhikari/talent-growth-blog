import React from 'react';

export function Input({
  label,
  error,
  helperText,
  id,
  type = 'text',
  className = '',
  required = false,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-ink-700 tracking-wide uppercase">
          {label} {required && <span className="text-accent">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        required={required}
        className={`w-full px-3.5 py-2.5 bg-paper-50 border rounded-md text-ink-900 text-sm placeholder:text-ink-400 transition-all duration-150 focus:outline-none disabled:bg-paper-200 disabled:text-ink-500 disabled:cursor-not-allowed ${
          error
            ? 'border-red-400 focus:border-red-600 focus:ring-1 focus:ring-red-600 bg-red-50/20'
            : 'border-paper-300 hover:border-ink-400 focus:border-accent focus:ring-1 focus:ring-accent'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-ink-500">{helperText}</p>}
    </div>
  );
}

export function TextArea({
  label,
  error,
  helperText,
  id,
  rows = 4,
  className = '',
  required = false,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-ink-700 tracking-wide uppercase">
          {label} {required && <span className="text-accent">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        required={required}
        className={`w-full px-3.5 py-2.5 bg-paper-50 border rounded-md text-ink-900 text-sm placeholder:text-ink-400 transition-all duration-150 focus:outline-none disabled:bg-paper-200 disabled:text-ink-500 disabled:cursor-not-allowed ${
          error
            ? 'border-red-400 focus:border-red-600 focus:ring-1 focus:ring-red-600 bg-red-50/20'
            : 'border-paper-300 hover:border-ink-400 focus:border-accent focus:ring-1 focus:ring-accent'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-ink-500">{helperText}</p>}
    </div>
  );
}
