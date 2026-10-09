import React, { useState } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Bold, Italic, Heading2, Code, Quote, List, Eye, Edit3, Columns } from 'lucide-react';

export function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Write your story in Markdown...',
  minHeight = 'min-h-[360px]',
}) {
  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview' | 'split'

  const insertFormatting = (prefix, suffix = '') => {
    const textarea = document.getElementById('markdown-editor-area');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const before = value.substring(0, start);
    const after = value.substring(end);

    const replacement = `${prefix}${selected || 'text'}${suffix}`;
    const newValue = `${before}${replacement}${after}`;
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selected.length || 'text'.length)
      );
    }, 10);
  };

  return (
    <div className="w-full border border-paper-300 rounded-xl bg-paper-50 shadow-tactile-sm overflow-hidden flex flex-col">
      {/* Toolbar header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-paper-100/70 border-b border-paper-300">
        {/* Quick formatting tools */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => insertFormatting('**', '**')}
            className="p-1.5 rounded hover:bg-paper-200 text-ink-700 hover:text-ink-950 transition-colors"
            title="Bold (**text**)"
            aria-label="Insert bold text"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('*', '*')}
            className="p-1.5 rounded hover:bg-paper-200 text-ink-700 hover:text-ink-950 transition-colors"
            title="Italic (*text*)"
            aria-label="Insert italic text"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('## ')}
            className="p-1.5 rounded hover:bg-paper-200 text-ink-700 hover:text-ink-950 transition-colors"
            title="Heading 2 (## Heading)"
            aria-label="Insert heading"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('```javascript\n', '\n```')}
            className="p-1.5 rounded hover:bg-paper-200 text-ink-700 hover:text-ink-950 transition-colors"
            title="Code Block (```code```)"
            aria-label="Insert code block"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('> ')}
            className="p-1.5 rounded hover:bg-paper-200 text-ink-700 hover:text-ink-950 transition-colors"
            title="Blockquote (> Quote)"
            aria-label="Insert blockquote"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('- ')}
            className="p-1.5 rounded hover:bg-paper-200 text-ink-700 hover:text-ink-950 transition-colors"
            title="Bullet List (- item)"
            aria-label="Insert bullet list"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-paper-200 p-0.5 rounded-lg border border-paper-300">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
              activeTab === 'write'
                ? 'bg-paper-50 text-ink-950 shadow-sm'
                : 'text-ink-600 hover:text-ink-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
              activeTab === 'preview'
                ? 'bg-paper-50 text-ink-950 shadow-sm'
                : 'text-ink-600 hover:text-ink-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('split')}
            className={`hidden md:flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
              activeTab === 'split'
                ? 'bg-paper-50 text-ink-950 shadow-sm'
                : 'text-ink-600 hover:text-ink-900'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 min-h-0">
        {activeTab === 'write' && (
          <textarea
            id="markdown-editor-area"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full p-4 bg-paper-50 font-mono text-sm leading-relaxed text-ink-900 placeholder:text-ink-400 focus:outline-none resize-y ${minHeight}`}
          />
        )}

        {activeTab === 'preview' && (
          <div className={`p-6 bg-paper-50 overflow-y-auto ${minHeight}`}>
            <MarkdownRenderer content={value} />
          </div>
        )}

        {activeTab === 'split' && (
          <div className="grid grid-cols-2 divide-x divide-paper-300">
            <textarea
              id="markdown-editor-area"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className={`w-full p-4 bg-paper-50 font-mono text-sm leading-relaxed text-ink-900 placeholder:text-ink-400 focus:outline-none resize-none ${minHeight}`}
            />
            <div className={`p-4 bg-paper-50/50 overflow-y-auto ${minHeight}`}>
              <MarkdownRenderer content={value} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

