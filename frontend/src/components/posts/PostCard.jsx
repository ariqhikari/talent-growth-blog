import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { formatDate } from '../../utils/date';
import { Clock, ArrowUpRight } from 'lucide-react';

export function PostCard({ post }) {
  const authorName = post?.author?.name || 'Anonymous';
  const authorAvatar = post?.author?.avatar;

  return (
    <article className="group bg-paper-50 border border-paper-300 rounded-xl p-6 shadow-tactile-sm hover:shadow-tactile hover:border-ink-400 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Category & Read Time */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="accent">{post.category || 'General'}</Badge>
          <div className="flex items-center gap-1 text-xs text-ink-500 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.readTime || 1} min read</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-serif font-normal text-ink-950 group-hover:text-accent transition-colors leading-snug mb-2.5">
          <Link to={`/posts/${post._id}`} className="inline-flex items-baseline gap-1 focus:outline-none">
            <span>{post.title}</span>
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="text-sm text-ink-700 line-clamp-3 leading-relaxed mb-6 font-normal">
          {post.excerpt || 'Read the full story to explore the ideas and context in detail.'}
        </p>
      </div>

      {/* Footer / Author & Read More */}
      <div className="pt-4 border-t border-paper-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Avatar name={authorName} src={authorAvatar} size="sm" />
          <div className="text-left">
            <p className="text-xs font-semibold text-ink-900 leading-tight">{authorName}</p>
            <p className="text-[11px] text-ink-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        <Link
          to={`/posts/${post._id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-hover group-hover:translate-x-0.5 transition-all"
          aria-label={`Read more about ${post.title}`}
        >
          <span>Read more</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}
