import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postApi } from '../api/postApi';
import { commentApi } from '../api/commentApi';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Skeleton } from '../components/common/Skeleton';
import { MarkdownRenderer } from '../components/posts/MarkdownRenderer';
import { CommentSection } from '../components/comments/CommentSection';
import { formatDate } from '../utils/date';
import { ArrowLeft, Clock, Edit, Trash2, Calendar, AlertTriangle } from 'lucide-react';

export function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);

  const isAuthor = user && post && post.author && post.author._id === user._id;

  useEffect(() => {
    let isMounted = true;

    const fetchPostAndComments = async () => {
      try {
        setIsLoading(true);
        const [postRes, commentRes] = await Promise.all([
          postApi.getPostById(id),
          commentApi.getComments(id),
        ]);

        if (isMounted) {
          setPost(postRes.data.post);
          setComments(commentRes.data.comments || []);
        }
      } catch (err) {
        if (isMounted) {
          toastError(err.message || 'Failed to load post');
          navigate('/');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchPostAndComments();

    return () => {
      isMounted = false;
    };
  }, [id, navigate]); // toastError is stable via useCallback — omitted intentionally

  const handleDeletePost = async () => {
    try {
      setIsDeleting(true);
      await postApi.deletePost(id);
      success('Post deleted successfully');
      navigate('/');
    } catch (err) {
      toastError(err.message || 'Could not delete post');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleAddComment = async (content) => {
    try {
      setIsAddingComment(true);
      const res = await commentApi.addComment(id, { content });
      setComments((prev) => [...prev, res.data.comment]);
      success('Comment added');
    } catch (err) {
      toastError(err.message || 'Failed to add comment');
    } finally {
      setIsAddingComment(false);
    }
  };

  const handleUpdateComment = async (commentId, content) => {
    try {
      const res = await commentApi.updateComment(commentId, { content });
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? res.data.comment : c))
      );
      success('Comment updated');
    } catch (err) {
      toastError(err.message || 'Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentApi.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      success('Comment removed');
    } catch (err) {
      toastError(err.message || 'Failed to delete comment');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 text-left py-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-12 w-full" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!post) return null;

  return (
    <article className="max-w-3xl mx-auto text-left py-4">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-600 hover:text-ink-950 mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to all stories</span>
      </Link>

      {/* Post Header */}
      <header className="space-y-4 mb-8">
        <div className="flex items-center gap-3">
          <Badge variant="accent">{post.category || 'General'}</Badge>
          <div className="flex items-center gap-1 text-xs text-ink-500 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.readTime || 1} min read</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-ink-950 tracking-tight leading-[1.15]">
          {post.title}
        </h1>

        {/* Author metadata & Author Action buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-paper-300">
          <div className="flex items-center gap-3">
            <Avatar name={post.author?.name} src={post.author?.avatar} size="md" />
            <div>
              <p className="text-sm font-semibold text-ink-900 leading-tight">
                {post.author?.name}
              </p>
              <p className="text-xs text-ink-500 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3" />
                <span>Published on {formatDate(post.createdAt)}</span>
              </p>
            </div>
          </div>

          {isAuthor && (
            <div className="flex items-center gap-2">
              <Link to={`/posts/${post._id}/edit`}>
                <Button variant="secondary" size="sm">
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Story</span>
                </Button>
              </Link>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Post Content */}
      <section className="py-6 border-t border-paper-200">
        <MarkdownRenderer content={post.content} />
      </section>

      {/* Author Bio Box */}
      {post.author?.bio && (
        <div className="my-10 p-6 rounded-xl bg-paper-50 border border-paper-300 flex items-start gap-4">
          <Avatar name={post.author?.name} src={post.author?.avatar} size="lg" />
          <div>
            <h4 className="text-sm font-semibold text-ink-900 mb-1">About {post.author?.name}</h4>
            <p className="text-xs text-ink-700 leading-relaxed">{post.author?.bio}</p>
          </div>
        </div>
      )}

      {/* Comments Section */}
      <CommentSection
        comments={comments}
        currentUserId={user?._id}
        onAddComment={handleAddComment}
        onUpdateComment={handleUpdateComment}
        onDeleteComment={handleDeleteComment}
        isAdding={isAddingComment}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete this story?"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 text-xs leading-relaxed">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>
              This action cannot be undone. All responses to this story will also be permanently deleted.
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isDeleting}
              onClick={handleDeletePost}
            >
              Confirm Deletion
            </Button>
          </div>
        </div>
      </Modal>
    </article>
  );
}
