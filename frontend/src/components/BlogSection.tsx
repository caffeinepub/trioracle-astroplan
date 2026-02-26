import React, { useState } from 'react';
import { Star, Plus, Loader2, BookOpen } from 'lucide-react';
import { useGetAllPosts, useCheckAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import BlogPostCard from './BlogPostCard';
import BlogPostEditor from './BlogPostEditor';
import type { Post } from '../backend';

export default function BlogSection() {
  const { data: posts, isLoading } = useGetAllPosts();
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useCheckAdmin();
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const isAuthenticated = !!identity;

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingPost(null);
  };

  return (
    <div className="py-20 px-4 bg-cream-bg">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="celestial-divider w-12" />
            <Star size={14} className="text-gold" fill="currentColor" />
            <div className="celestial-divider w-12" />
          </div>
          <h2 className="section-heading">Blog & Notice Board</h2>
          <p className="section-subheading max-w-2xl mx-auto">
            Insights, announcements, and wisdom from the world of astrology and numerology
          </p>
        </div>

        {/* Admin Controls */}
        {isAuthenticated && isAdmin && (
          <div className="flex justify-end mb-6">
            <button
              onClick={() => { setEditingPost(null); setShowEditor(true); }}
              className="btn-gold flex items-center gap-2 text-sm"
            >
              <Plus size={16} />
              New Post
            </button>
          </div>
        )}

        {/* Blog Post Editor Modal */}
        {showEditor && (
          <BlogPostEditor
            post={editingPost}
            onClose={handleCloseEditor}
          />
        )}

        {/* Posts */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={32} className="animate-spin text-gold/60" />
          </div>
        ) : !posts || posts.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen size={48} className="text-gold/30 mx-auto mb-4" />
            <p className="font-serif text-xl text-charcoal/40">No posts yet</p>
            <p className="text-sm text-charcoal/30 mt-1">Check back soon for updates and insights</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogPostCard
                key={post.id.toString()}
                post={post}
                isAdmin={!!isAdmin}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
