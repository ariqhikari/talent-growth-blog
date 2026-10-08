import React, { useState, useEffect } from 'react';
import { postApi } from '../api/postApi';
import { PostCard } from '../components/posts/PostCard';
import { PostSearchBar } from '../components/posts/PostSearchBar';
import { CategoryFilter } from '../components/posts/CategoryFilter';
import { Pagination } from '../components/common/Pagination';
import { Skeleton } from '../components/common/Skeleton';
import { useDebounce } from '../hooks/useDebounce';
import { useToast } from '../hooks/useToast';
import { BookOpen, Sparkles } from 'lucide-react';

const CATEGORIES = [
  { label: 'All Stories', value: '' },
  { label: 'Engineering', value: 'Engineering' },
  { label: 'Design', value: 'Design' },
  { label: 'Product', value: 'Product' },
  { label: 'Career', value: 'Career' },
  { label: 'Notes', value: 'Notes' },
];

export function HomePage() {
  const { error: toastError } = useToast();
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, hasNext: false, hasPrev: false });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const debouncedSearch = useDebounce(searchTerm, 350);

  // Reset to page 1 whenever search query or category filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategory]);

  useEffect(() => {
    let isMounted = true;
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const res = await postApi.getPosts({
          page: currentPage,
          limit: 6,
          search: debouncedSearch || undefined,
          category: selectedCategory || undefined,
        });

        if (isMounted) {
          setPosts(res.data || []);
          if (res.pagination) {
            setPagination(res.pagination);
          }
        }
      } catch (err) {
        if (isMounted) {
          toastError(err.message || 'Failed to load stories');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, [currentPage, debouncedSearch, selectedCategory, toastError]);

  return (
    <div className="space-y-10">
      {/* Editorial Lead Hero */}
      <section className="text-left pt-6 pb-2 border-b border-paper-300">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-subtle text-accent text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Engineering & Design Insights</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal text-ink-950 tracking-tight leading-[1.1] mb-4">
          Thoughts, technical notes & craft stories.
        </h1>
        <p className="text-base sm:text-lg text-ink-700 max-w-2xl leading-relaxed">
          A publication exploring software craftsmanship, product architecture, and team growth.
        </p>
      </section>

      {/* Filter and Search Bar */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="w-full sm:max-w-md">
            <PostSearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={() => setSearchTerm('')}
            />
          </div>
          <CategoryFilter
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      </section>

      {/* Post Grid or Skeleton Loading */}
      <section>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-6 bg-paper-50 border border-paper-300 rounded-xl space-y-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-16 w-full" />
                <div className="flex items-center gap-3 pt-4 border-t border-paper-200">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center bg-paper-50 border border-dashed border-paper-300 rounded-xl space-y-3">
            <BookOpen className="w-8 h-8 text-ink-400 mx-auto" />
            <h3 className="text-lg font-serif font-medium text-ink-900">No stories found</h3>
            <p className="text-xs text-ink-600 max-w-sm mx-auto">
              {searchTerm || selectedCategory
                ? 'Try adjusting your search criteria or switching categories.'
                : 'Be the first to publish a new story!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* Pagination */}
      {!isLoading && posts.length > 0 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={setCurrentPage}
          hasNext={pagination.hasNext}
          hasPrev={pagination.hasPrev}
          totalItems={pagination.total}
        />
      )}
    </div>
  );
}
