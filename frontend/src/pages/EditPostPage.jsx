import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postApi } from '../api/postApi';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { MarkdownEditor } from '../components/posts/MarkdownEditor';
import { Skeleton } from '../components/common/Skeleton';
import { ArrowLeft, Save } from 'lucide-react';

const CATEGORIES = ['General', 'Engineering', 'Design', 'Product', 'Career', 'Notes'];

export function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let isMounted = true;

    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const res = await postApi.getPostById(id);
        const post = res.data.post;

        // Author ownership check
        if (user && post.author && post.author._id !== user._id) {
          toastError('You are not authorized to edit this story');
          navigate(`/posts/${id}`);
          return;
        }

        if (isMounted) {
          setTitle(post.title || '');
          setContent(post.content || '');
          setCategory(post.category || 'General');
        }
      } catch (err) {
        if (isMounted) {
          toastError(err.message || 'Failed to fetch story details');
          navigate('/');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchPost();

    return () => {
      isMounted = false;
    };
  }, [id, user, navigate, toastError]);

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Title is required';
    else if (title.trim().length < 3) errs.title = 'Title must be at least 3 characters';

    if (!content.trim()) errs.content = 'Content is required';
    else if (content.trim().length < 10) errs.content = 'Content must be at least 10 characters';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await postApi.updatePost(id, {
        title: title.trim(),
        content: content.trim(),
        category,
      });
      success('Story updated successfully');
      navigate(`/posts/${id}`);
    } catch (err) {
      toastError(err.message || 'Failed to update story');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 text-left py-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto text-left py-4">
      {/* Back button */}
      <Link
        to={`/posts/${id}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-600 hover:text-ink-950 mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Cancel and return to story</span>
      </Link>

      <div className="mb-6 pb-4 border-b border-paper-300">
        <h1 className="text-3xl font-serif font-normal text-ink-950">Edit story</h1>
        <p className="text-xs text-ink-600 mt-1">Make modifications to your published story.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title input */}
        <Input
          label="Story Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          required
        />

        {/* Category selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-ink-700 tracking-wide uppercase">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-paper-50 border border-paper-300 rounded-md text-sm text-ink-900 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Markdown Content Editor */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-ink-700 tracking-wide uppercase">
            Story Content (Markdown supported) <span className="text-accent">*</span>
          </label>
          <MarkdownEditor value={content} onChange={setContent} />
          {errors.content && <p className="text-xs text-red-600 font-medium">{errors.content}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-paper-300">
          <Link to={`/posts/${id}`}>
            <Button variant="ghost" size="md">
              Discard Changes
            </Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

