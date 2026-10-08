import React, { useState } from 'react';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { formatRelativeTime } from '../../utils/date';
import { MoreHorizontal, Edit2, Trash2, Check, X } from 'lucide-react';

export function CommentItem({ comment, currentUserId, onUpdate, onDelete }) {
  const isAuthor = currentUserId && comment?.author?._id === currentUserId;
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async () => {
    if (!editContent.trim()) return;
    try {
      setIsUpdating(true);
      await onUpdate(comment._id, editContent.trim());
      setIsEditing(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      setIsDeleting(true);
      await onDelete(comment._id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-start gap-3.5 py-4 border-b border-paper-200 last:border-b-0 text-left">
      <Avatar name={comment?.author?.name} src={comment?.author?.avatar} size="sm" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-ink-950">{comment?.author?.name}</span>
            <span className="text-[11px] text-ink-500">{formatRelativeTime(comment.createdAt)}</span>
          </div>

          {isAuthor && !isEditing && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 rounded text-ink-400 hover:text-ink-900 hover:bg-paper-200 transition-colors"
                title="Edit comment"
                aria-label="Edit comment"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-1 rounded text-ink-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Delete comment"
                aria-label="Delete comment"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-2 mt-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm bg-paper-50 border border-paper-300 rounded-md focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-ink-900"
            />
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                isLoading={isUpdating}
                disabled={!editContent.trim()}
                onClick={handleSave}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={isUpdating}
                onClick={() => {
                  setEditContent(comment.content);
                  setIsEditing(false);
                }}
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-ink-800 leading-relaxed break-words font-normal">
            {comment.content}
          </p>
        )}
      </div>
    </div>
  );
}
