import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import OptimizedImage from '@/components/OptimizedImage';
import { Button } from '@/components/ui/button';
import SectionAnimator from '@/components/SectionAnimator';
import { useLocalizedLink } from '@/hooks/useLocalizedLink';

const BlogCardsSkeleton = () => (
  <div
    className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
    role="status"
    aria-label="Cargando artículos"
  >
    {[0, 1, 2].map((item) => (
      <div
        key={item}
        className="animate-pulse overflow-hidden rounded-[1.5rem] border border-black/10 bg-white"
      >
        <div className="aspect-video bg-black/10" />
        <div className="space-y-4 p-6">
          <div className="h-3 w-24 rounded-full bg-black/10" />
          <div className="h-6 w-full rounded-lg bg-black/10" />
          <div className="h-6 w-3/4 rounded-lg bg-black/10" />
          <div className="h-4 w-full rounded-lg bg-black/10" />
          <div className="h-4 w-2/3 rounded-lg bg-black/10" />
        </div>
      </div>
    ))}
    <span className="sr-only">Cargando artículos...</span>
  </div>
);

const SectionBlog = React.memo(() => {
  const { t, i18n } = useTranslation();
  const { posts, loading } = useBlogPosts(null, 'article'); // Solo artículos, no noticias
  const getLocalizedLink = useLocalizedLink();
  const shouldReduceMotion = useReducedMotion();
  
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
      <section className="bg-[#F2F0E9] py-16 text-[#101114] sm:py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-10 grid gap-4 sm:mb-12 sm:gap-6 md:mb-16 md:grid-cols-[1fr_.7fr] md:items-end">
            <div>
            <div className="rium-kicker mb-6 text-[#5B72FF]">
              <span className="h-2 w-2 rounded-full bg-[#5B72FF]" />
              {t('blog.section.badge')}
            </div>
            <h2 className="text-[clamp(2.25rem,12vw,3rem)] font-semibold leading-[.95] tracking-[-.05em] md:text-7xl">
              {t('blog.section.title')} <span className="text-[#5B72FF]">{t('blog.section.titleHighlight')}</span>
            </h2>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-black/55 sm:text-lg">
              {t('blog.section.description')}
            </p>
          </div>

          {/* Loading State */}
          {loading && <BlogCardsSkeleton />}

          {/* Blog Posts Grid */}
          {!loading && latestPosts.length > 0 && (
            <div className="mb-10 grid grid-cols-1 gap-5 sm:gap-6 md:mb-12 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
              {latestPosts.map((post, index) => {
                const postTags = parseTags(post.tags);
                return (
                  <Link
                    key={post.id}
                    to={getLocalizedLink(`/blog/${post.slug || post.id}`)}
                    className="block"
                  >
                    <motion.article
                      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5, delay: index * 0.1 }}
                      className="group h-full cursor-pointer overflow-hidden rounded-[1.5rem] border border-black/10 bg-white transition-all duration-300 active:scale-[.99] motion-reduce:transition-none md:hover:-translate-y-2 md:hover:shadow-2xl"
                    >
                      {/* Image - Optimizado para móvil con aspect-ratio */}
                      <div className="relative aspect-video overflow-hidden">
                        <OptimizedImage
                          src={post.image}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-500 motion-reduce:transition-none md:group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-accent-purple/90 text-white text-xs font-semibold rounded-full uppercase">
                            {post.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-6">
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
                        <div className="mb-4 text-xs text-gray-700 dark:text-gray-500 sm:text-sm">
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
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
                <Link to={getLocalizedLink('/blog')}>
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
                <Link to={getLocalizedLink('/blog')}>
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

