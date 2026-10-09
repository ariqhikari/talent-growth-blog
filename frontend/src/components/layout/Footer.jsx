import React from 'react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-paper-300 bg-paper-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-serif text-lg font-medium text-ink-950">Talent Growth</span>
          <span className="text-xs text-ink-500">· Full-Stack Blog Platform</span>
        </div>
        
        <p className="text-xs text-ink-500 text-center sm:text-right">
          Crafted with Clean Architecture · React, Tailwind CSS, Express & MongoDB Atlas.
        </p>
      </div>
    </footer>
  );
}

export function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-paper-100 selection:bg-accent-subtle selection:text-accent">
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}

