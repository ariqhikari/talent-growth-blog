import React from 'react';

export function AppLayout({ children }) {
  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {children}
    </main>
  );
}
