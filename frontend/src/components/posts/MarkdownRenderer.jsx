import React, { useMemo } from 'react';
import { renderMarkdown } from '../../utils/sanitize';

export function MarkdownRenderer({ content, className = '' }) {
  const sanitizedHtml = useMemo(() => renderMarkdown(content), [content]);

  if (!content) {
    return <p className="text-ink-400 italic">No content to preview.</p>;
  }

  return (
    <div
      className={`markdown-body ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}

