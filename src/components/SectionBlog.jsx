import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import OptimizedImage from '@/components/OptimizedImage';
import { Button } from '@/components/ui/button';
import SectionAnimator from '@/components/SectionAnimator';

const SectionBlog = React.memo(() => {
  const { t, i18n } = useTranslation();
  const { posts, loading } = useBlogPosts(null, 'article'); // Solo artículos, no noticias
  
  // Obtener solo los últimos 3 artículos (memoizado)
  const latestPosts = useMemo(() => posts.slice(0, 3), [posts]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const parseTags = (tags) => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    try {
      return JSON.parse(tags);
    } catch {
      return typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : [];
    }
  };

  return (
    <SectionAnimator>
      <section className="bg-[#F2F0E9] py-24 text-[#101114] md:py-32">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="mb-16 grid gap-6 md:grid-cols-[1fr_.7fr] md:items-end">
            <div>
            <div className="rium-kicker mb-6 text-[#5B72FF]">
              <span className="h-2 w-2 rounded-full bg-[#5B72FF]" />
              {t('blog.section.badge')}
            </div>
            <h2 className="text-5xl font-semibold leading-[.95] tracking-[-.05em] md:text-7xl">
              {t('blog.section.title')} <span className="text-[#5B72FF]">{t('blog.section.titleHighlight')}</span>
            </h2>
            </div>
            <p className="max-w-xl text-lg leading-relaxed text-black/55">
              {t('blog.section.description')}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-purple"></div>
            </div>
          )}

          {/* Blog Posts Grid */}
          {!loading && latestPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {latestPosts.map((post, index) => {
                const postTags = parseTags(post.tags);
                return (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug || post.id}`}
                    className="block"
                  >
                    <motion.article
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group h-full cursor-pointer overflow-hidden rounded-[1.5rem] border border-black/10 bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                    >
                      {/* Image - Optimizado para móvil con aspect-ratio */}
                      <div className="relative aspect-video overflow-hidden">
                        <OptimizedImage
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-accent-purple/90 text-white text-xs font-semibold rounded-full uppercase">
                            {post.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        {/* Tags */}
                        {postTags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {postTags.slice(0, 2).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="flex items-center gap-1 text-xs text-gray-400"
                              >
                                <Tag size={12} />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Title */}
                        <h3 className="mb-3 line-clamp-2 text-xl font-bold text-[#101114] transition-colors group-hover:text-[#5B72FF]">
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="mb-4 line-clamp-3 text-sm text-black/55">
                          {post.excerpt}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-500 mb-4">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {formatDate(post.created_at || post.date)}
                            </span>
                            {post.read_time && (
                              <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {post.read_time}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Read More */}
                        <div className="w-full text-accent-purple hover:text-white hover:bg-accent-purple/10 rounded-full group/btn flex items-center justify-center py-2 px-4 transition-colors">
                          {t('blog.section.readMore')}
                          <ArrowRight 
                            size={16} 
                            className="ml-2 group-hover/btn:translate-x-1 transition-transform" 
                          />
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && latestPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-700 dark:text-gray-400 text-xl mb-6">{t('blog.section.empty')}</p>
              <Button
                asChild
                variant="outline"
                className="border-gray-300 dark:border-white/10 text-gray-900 dark:text-white"
              >
                <Link to="/blog">
                  {t('blog.section.viewBlog')}
                  <ArrowRight className="ml-2" size={18} />
                </Link>
              </Button>
            </div>
          )}

          {/* CTA Button */}
          {!loading && latestPosts.length > 0 && (
            <div className="text-center">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-[#101114] px-8 py-6 text-lg font-bold text-white hover:bg-[#5B72FF]"
              >
                <Link to="/blog">
                  {t('blog.section.viewAll')}
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </SectionAnimator>
  );
});

SectionBlog.displayName = 'SectionBlog';

export default SectionBlog;

