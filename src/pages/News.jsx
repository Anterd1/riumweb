import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Tag, Loader2, TrendingUp } from 'lucide-react';
import SEO from '@/components/SEO';
import SectionAnimator from '@/components/SectionAnimator';
import { Button } from '@/components/ui/button';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import NewsletterSubscription from '@/components/NewsletterSubscription';
import { Toaster } from '@/components/ui/toaster';
import OptimizedImage from '@/components/OptimizedImage';

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const { posts, loading, error } = useBlogPosts(
    selectedCategory === 'Todos' ? null : selectedCategory,
    'news' // Solo noticias tech
  );
  
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(posts.map(post => post.category))];
    return ['Todos', ...uniqueCategories];
  }, [posts]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Parse tags si vienen como string JSON o array
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
    <div className="bg-[#0C0D0D] text-white min-h-screen pt-24">
      <SEO
        title="Noticias Tech - rium"
        description="Últimas noticias sobre diseño, desarrollo, tecnología, herramientas y tendencias en el mundo tech."
        keywords="noticias tech, noticias diseño, noticias desarrollo, tecnología, herramientas desarrollo, frameworks, tendencias tech, noticias programación"
        url="https://rium.com.mx/noticias"
      />

      <main>
        {/* Header Section */}
        <SectionAnimator>
          <header className="pt-32 pb-16 text-center">
            <div className="container mx-auto px-6 max-w-4xl">
              <div className="inline-block px-4 py-1.5 border border-white/20 rounded-full text-sm mb-4 uppercase flex items-center gap-2 justify-center">
                <TrendingUp size={14} />
                Noticias Tech
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 uppercase">
                Noticias <span className="text-accent-purple">Tech</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Mantente al día con las últimas noticias sobre diseño, desarrollo, tecnología, herramientas y tendencias en el mundo tech.
              </p>
            </div>
          </header>
        </SectionAnimator>

        {/* Category Filters */}
        <SectionAnimator>
          <div className="container mx-auto px-6 mb-12">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all uppercase tracking-wider ${
                    selectedCategory === category
                      ? 'bg-accent-purple text-white'
                      : 'bg-[#1E1E2A] text-gray-400 hover:text-white border border-white/10'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </SectionAnimator>

        {/* Loading State */}
        {loading && (
          <div className="container mx-auto px-6 pb-24 flex justify-center items-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-accent-purple" />
              <p className="text-gray-400">Cargando noticias...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="container mx-auto px-6 pb-24">
            <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-8 text-center">
              <p className="text-red-400 mb-4">Error al cargar las noticias</p>
              <p className="text-gray-400 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* News Posts Grid */}
        {!loading && !error && (
          <SectionAnimator>
            <div className="container mx-auto px-6 pb-24">
              {posts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-400 text-xl">No hay noticias disponibles aún.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post, index) => {
                    const postTags = parseTags(post.tags);
                    return (
                      <Link
                        key={post.id}
                        to={`/noticias/${post.slug || post.id}`}
                        className="block"
                      >
                        <motion.article
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="bg-[#1E1E2A] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-accent-purple/10 transition-all duration-300 group cursor-pointer h-full"
                        >
                          {/* Image */}
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
                            <div className="absolute top-4 right-4">
                              <span className="px-3 py-1 bg-blue-500/90 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                                <TrendingUp size={12} />
                                Noticia
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-6">
                            {/* Tags */}
                            {postTags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {postTags.map((tag, tagIndex) => (
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
                            <h2 className="text-xl font-bold mb-3 text-white group-hover:text-accent-purple transition-colors line-clamp-2">
                              {post.title}
                            </h2>

                            {/* Excerpt */}
                            <p className="text-gray-400 mb-4 line-clamp-3">
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
            </div>
          </SectionAnimator>
        )}

        {/* CTA Section */}
        <SectionAnimator>
          <div className="container mx-auto px-6 pb-24">
            <NewsletterSubscription
              title="¿Quieres Más Noticias?"
              description="Suscríbete a nuestro newsletter para recibir las últimas noticias tech directamente en tu correo."
              source="news"
              key="news-newsletter"
            />
          </div>
        </SectionAnimator>
        
        <Toaster />
      </main>
    </div>
  );
};

export default News;

