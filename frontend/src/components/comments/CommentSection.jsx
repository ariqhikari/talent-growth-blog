import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { useAuth } from '../../hooks/useAuth';
import { MessageSquare, Send } from 'lucide-react';

export function CommentForm({ onSubmit, isLoading = false }) {
  const { user, isAuthenticated } = useAuth();
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    await onSubmit(content.trim());
    setContent('');
  };

  if (!isAuthenticated) {
    return (
      <div className="p-5 rounded-xl border border-dashed border-paper-300 bg-paper-50 text-center space-y-2">
        <MessageSquare className="w-5 h-5 text-ink-400 mx-auto" />
        <p className="text-xs text-ink-600 font-medium">Join the discussion</p>
        <div className="flex items-center justify-center gap-2 pt-1">
          <Link to="/login">
            <Button variant="secondary" size="sm">
              Log in to comment
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-start gap-3">
        <Avatar name={user?.name} src={user?.avatar} size="sm" />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder="Share your thoughts or feedback..."
            className="w-full px-3.5 py-2.5 bg-paper-50 border border-paper-300 rounded-lg text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={isLoading}
          disabled={!content.trim()}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Publish Comment</span>
        </Button>
      </div>
    </form>
  );
}

export function CommentSection({
  comments = [],
  currentUserId,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  isAdding = false,
}) {
  return (
    <section className="mt-12 pt-8 border-t border-paper-300">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-xl font-serif font-medium text-ink-950">Responses</h3>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-paper-200 text-ink-700">
          {comments.length}
        </span>
      </div>

      {/* New Comment Input */}
      <div className="mb-8">
        <CommentForm onSubmit={onAddComment} isLoading={isAdding} />
      </div>

      {/* List of comments */}
      <div className="divide-y divide-paper-200">
        {comments.length === 0 ? (
          <p className="text-xs text-ink-500 py-6 text-center italic">
            No responses yet. Start the conversation!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUserId={currentUserId}
              onUpdate={onUpdateComment}
              onDelete={onDeleteComment}
            />
          ))
        )}
      </div>
    </section>
  );
}

