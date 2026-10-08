import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-paper-200 text-ink-600 flex items-center justify-center mx-auto">
        <FileQuestion className="w-6 h-6" />
      </div>

      <h1 className="text-3xl font-serif font-normal text-ink-950">Page not found</h1>
      <p className="text-xs text-ink-600 leading-relaxed">
        The story or page you're looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      <div className="pt-4">
        <Link to="/">
          <Button variant="primary" size="md">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
