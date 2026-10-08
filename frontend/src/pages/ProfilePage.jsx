import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { postApi } from '../api/postApi';
import { authApi } from '../api/authApi';
import { useToast } from '../hooks/useToast';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { Input, TextArea } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { Skeleton } from '../components/common/Skeleton';
import { Badge } from '../components/common/Badge';
import { formatDate } from '../utils/date';
import { User, Edit3, PenSquare, Trash2, Calendar, Mail, AlertTriangle } from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
];

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { success, error: toastError } = useToast();

  const [myPosts, setMyPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit Profile modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Delete post modal state
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeletingPost, setIsDeletingPost] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchMyPosts = async () => {
      if (!user?._id) return;
      try {
        setIsLoading(true);
        const res = await postApi.getPosts({ author: user._id, limit: 50 });
        if (isMounted) {
          setMyPosts(res.data || []);
        }
      } catch (err) {
        if (isMounted) toastError(err.message || 'Failed to load your stories');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchMyPosts();

    return () => {
      isMounted = false;
    };
  }, [user, toastError]);

  const handleOpenEditModal = () => {
    setName(user?.name || '');
    setAvatar(user?.avatar || '');
    setBio(user?.bio || '');
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSavingProfile(true);
      const res = await authApi.updateProfile({
        name: name.trim(),
        avatar: avatar.trim(),
        bio: bio.trim(),
      });

      updateUser(res.data.user);
      success('Profile updated successfully');
      setIsEditModalOpen(false);
    } catch (err) {
      toastError(err.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleDeletePost = async () => {
    if (!postToDelete) return;
    try {
      setIsDeletingPost(true);
      await postApi.deletePost(postToDelete._id);
      setMyPosts((prev) => prev.filter((p) => p._id !== postToDelete._id));
      success('Story deleted');
    } catch (err) {
      toastError(err.message || 'Could not delete story');
    } finally {
      setIsDeletingPost(false);
      setPostToDelete(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-left space-y-10 py-4">
      {/* Profile Card */}
      <section className="bg-paper-50 border border-paper-300 rounded-2xl p-6 sm:p-8 shadow-tactile-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <Avatar name={user?.name} src={user?.avatar} size="xl" />
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-serif font-medium text-ink-950">
                {user?.name}
              </h1>
              <p className="text-xs text-ink-600 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>{user?.email}</span>
              </p>
              {user?.bio ? (
                <p className="text-sm text-ink-700 pt-2 leading-relaxed max-w-xl">
                  {user?.bio}
                </p>
              ) : (
                <p className="text-xs text-ink-400 italic pt-1">
                  No bio added yet. Tell readers about yourself!
                </p>
              )}
            </div>
          </div>

          <Button variant="secondary" size="sm" onClick={handleOpenEditModal} className="shrink-0">
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </Button>
        </div>
      </section>

      {/* User's Posts Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-paper-300">
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-serif font-normal text-ink-950">My Published Stories</h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-paper-200 text-ink-700">
              {myPosts.length}
            </span>
          </div>

          <Link to="/posts/new">
            <Button variant="primary" size="sm">
              <PenSquare className="w-4 h-4" />
              <span>Write Story</span>
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-5 bg-paper-50 border border-paper-300 rounded-xl space-y-3">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : myPosts.length === 0 ? (
          <div className="p-12 text-center bg-paper-50 border border-dashed border-paper-300 rounded-xl space-y-3">
            <User className="w-8 h-8 text-ink-400 mx-auto" />
            <h3 className="text-lg font-serif font-medium text-ink-900">No stories published yet</h3>
            <p className="text-xs text-ink-600 max-w-sm mx-auto">
              You haven't written any stories yet. Start sharing your ideas with the world!
            </p>
            <div className="pt-2">
              <Link to="/posts/new">
                <Button variant="primary" size="sm">
                  Write your first story
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-paper-200 border border-paper-300 rounded-xl bg-paper-50 overflow-hidden">
            {myPosts.map((post) => (
              <div
                key={post._id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-paper-100/50 transition-colors"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="accent">{post.category || 'General'}</Badge>
                    <span className="text-xs text-ink-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(post.createdAt)}</span>
                    </span>
                  </div>
                  <Link
                    to={`/posts/${post._id}`}
                    className="block text-lg font-serif font-medium text-ink-950 hover:text-accent transition-colors truncate"
                  >
                    {post.title}
                  </Link>
                  <p className="text-xs text-ink-600 line-clamp-1">{post.excerpt}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link to={`/posts/${post._id}/edit`}>
                    <Button variant="secondary" size="sm">
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setPostToDelete(post)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <Input
            label="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-ink-700 tracking-wide uppercase">
              Profile Picture URL
            </label>
            <Input
              placeholder="https://example.com/avatar.jpg"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              helperText="Paste an image URL or choose a preset below"
            />

            {/* Quick avatar presets */}
            <div className="pt-2">
              <span className="text-[11px] text-ink-500 font-medium block mb-1.5">Preset Avatars:</span>
              <div className="flex items-center gap-2">
                {PRESET_AVATARS.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAvatar(url)}
                    className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-transform hover:scale-105 ${
                      avatar === url ? 'border-accent ring-2 ring-accent/30' : 'border-paper-300'
                    }`}
                  >
                    <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <TextArea
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A short introduction about yourself and your background..."
            rows={3}
            maxLength={250}
            helperText={`${bio.length}/250 characters`}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-paper-300">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isSavingProfile}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSavingProfile}
              disabled={isSavingProfile || !name.trim()}
            >
              Save Profile
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Post Modal */}
      <Modal
        isOpen={!!postToDelete}
        onClose={() => setPostToDelete(null)}
        title="Delete Story"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 text-xs">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>
              Are you sure you want to delete <strong className="font-semibold">"{postToDelete?.title}"</strong>? This cannot be undone.
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPostToDelete(null)}
              disabled={isDeletingPost}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isDeletingPost}
              onClick={handleDeletePost}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
