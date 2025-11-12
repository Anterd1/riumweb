import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { Button } from '@/components/ui/button';
import SectionAnimator from '@/components/SectionAnimator';

const SectionBlog = React.memo(() => {
  const { posts, loading } = useBlogPosts(null, 'article'); // Solo artículos, no noticias
  
  // Obtener solo los últimos 3 artículos (memoizado)
  const latestPosts = useMemo(() => posts.slice(0, 3), [posts]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
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
      <section className="py-24 bg-[#0C0D0D]">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 border border-white/20 rounded-full text-sm mb-4 uppercase">
              Blog
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 uppercase">
              Últimos <span className="text-accent-purple">Artículos</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Descubre nuestros artículos sobre diseño UI/UX, experiencia de usuario y mejores prácticas.
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
                    to={`/blog/${post.id}`}
                    className="block"
                  >
                    <motion.article
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-[#1E1E2A] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-accent-purple/10 transition-all duration-300 group cursor-pointer h-full"
                    >
                      {/* Image - Optimizado para móvil con aspect-ratio */}
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          loading="lazy"
                          decoding="async"
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
                        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-accent-purple transition-colors line-clamp-2">
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-gray-400 mb-4 line-clamp-3 text-sm">
                          {post.excerpt}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
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
                          Leer más
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
              <p className="text-gray-400 text-xl mb-6">No hay artículos disponibles aún.</p>
              <Button
                asChild
                variant="outline"
                className="border-white/10"
              >
                <Link to="/blog">
                  Ver Blog
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
                className="bg-accent-purple hover:bg-accent-purple/90 text-white font-bold px-8 py-6 text-lg rounded-full"
              >
                <Link to="/blog">
                  Ver todos los artículos
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

