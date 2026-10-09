import React from 'react';

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-paper-300/70 rounded ${className}`} />;
}

