import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, Newspaper, Filter } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getSupabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'

const NewsDashboard = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showOnlyMine, setShowOnlyMine] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const nowRef = new Date()
  const getPublicationState = (post) => {
    const publishAt = post.publish_at ? new Date(post.publish_at) : null
    const isScheduled = post.published && publishAt && publishAt.getTime() > nowRef.getTime()
    const isPublished = post.published && (!publishAt || publishAt.getTime() <= nowRef.getTime())
    return { publishAt, isScheduled, isPublished }
  }

  useEffect(() => {
    fetchPosts()
  }, [showOnlyMine, user])

  const fetchPosts = async () => {
    try {
      const supabase = await getSupabase()
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('post_type', 'news') // Solo noticias
        .order('created_at', { ascending: false })

      // Filtrar solo las noticias del usuario actual si está activado el filtro
      if (showOnlyMine && user) {
        query = query.eq('user_id', user.id)
      }

      const { data, error } = await query

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    const post = posts.find(p => p.id === id)
    
    // Verificar que el usuario es el propietario
    if (post && post.user_id && user && post.user_id !== user.id) {
      toast({
        title: 'Acceso denegado',
        description: 'Solo puedes eliminar tus propias noticias',
        variant: 'destructive',
      })
      return
    }

    if (!confirm('¿Estás seguro de que quieres eliminar esta noticia?')) return

    try {
      const supabase = await getSupabase()
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: 'Noticia eliminada',
        description: 'La noticia ha sido eliminada correctamente',
      })
      fetchPosts()
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const publishedNowCount = posts.filter((post) => getPublicationState(post).isPublished).length
  const scheduledCount = posts.filter((post) => getPublicationState(post).isScheduled).length
  const draftCount = posts.filter((post) => !post.published).length

  return (
    <div className="space-y-4 md:space-y-6">
      <Toaster />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-4 mb-4 md:mb-6">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            <span className="text-accent-purple">Noticias</span> Tech
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">Gestiona las noticias tech de tu sitio</p>
            {user && (
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Conectado como: <span className="text-accent-purple">{user.email}</span>
            </p>
          )}
        </div>
        <Button
          onClick={() => {
            // Navegar al editor con tipo news por defecto
            navigate('/admin/posts/new?type=news')
          }}
          className="bg-accent-purple hover:bg-accent-purple/90 w-full md:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nueva Noticia
        </Button>
      </div>

      {/* Filtro */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <Button
          variant={showOnlyMine ? "default" : "outline"}
          onClick={() => setShowOnlyMine(!showOnlyMine)}
          className={`${showOnlyMine ? "bg-accent-purple hover:bg-accent-purple/90 text-white" : "border-gray-200 dark:border-white/10 bg-white dark:bg-transparent text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"} w-full sm:w-auto`}
        >
          <Filter className="mr-2 h-4 w-4" />
          {showOnlyMine ? 'Mostrar todas' : 'Solo mis noticias'}
        </Button>
        {showOnlyMine && (
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Mostrando {posts.length} noticia{posts.length !== 1 ? 's' : ''} tuya{posts.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-8">
        <div className="bg-white dark:bg-[#1E1E2A] rounded-xl p-4 md:p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-1">Total Noticias</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{posts.length}</p>
              </div>
              <Newspaper className="h-6 w-6 md:h-8 md:w-8 text-accent-purple" />
            </div>
          </div>
          <div className="bg-white dark:bg-[#1E1E2A] rounded-xl p-4 md:p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-1">Publicadas</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {publishedNowCount}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Programadas: {scheduledCount}
                  </p>
              </div>
              <Eye className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-[#1E1E2A] rounded-xl p-4 md:p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-1">Borradores</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {draftCount}
              </p>
            </div>
            <Newspaper className="h-6 w-6 md:h-8 md:w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Posts Table */}
      {loading ? (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400">Cargando noticias...</p>
        </div>
      ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white dark:bg-[#1E1E2A] rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-[#0C0D0D] border-b border-gray-200 dark:border-white/10">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 w-[200px] max-w-[200px]">Título</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 w-[140px]">Categoría</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 w-[140px]">Autor</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 w-[110px]">Estado</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 w-[120px]">Fecha</th>
                    <th className="px-4 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300 w-[100px]">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        {showOnlyMine ? 'No tienes noticias aún. Crea tu primera noticia.' : 'No hay noticias aún. Crea tu primera noticia.'}
                      </td>
                    </tr>
                  ) : (
                      posts.map((post) => {
                        const isOwner = user && post.user_id === user.id
                        const { isScheduled, isPublished } = getPublicationState(post)
                        return (
                        <tr key={post.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                          <td className="px-4 py-4 w-[200px] max-w-[200px]">
                            <p className="font-medium text-gray-900 dark:text-white line-clamp-2 text-sm">{post.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">{post.excerpt}</p>
                          </td>
                          <td className="px-4 py-4 w-[140px]">
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                              {post.category}
                            </span>
                          </td>
                          <td className="px-4 py-4 w-[140px]">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm text-gray-700 dark:text-gray-300">{post.author || 'Equipo rium'}</span>
                              {isOwner && (
                                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">
                                  Tuyo
                                </span>
                              )}
                            </div>
                          </td>
                            <td className="px-4 py-4 w-[110px]">
                              {!post.published ? (
                                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                                  Borrador
                                </span>
                              ) : isScheduled ? (
                                <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium">
                                  Programado
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                                  Publicado
                                </span>
                              )}
                          </td>
                            <td className="px-4 py-4 text-gray-500 dark:text-gray-400 text-sm w-[120px]">
                              {isScheduled ? (
                                <div>
                                  <p className="font-medium text-gray-800 dark:text-gray-200 text-xs">{formatDateTime(post.publish_at)}</p>
                                  <p className="text-xs text-orange-400">Programado</p>
                                </div>
                              ) : (
                                formatDate(post.publish_at || post.created_at)
                              )}
                          </td>
                          <td className="px-4 py-4 w-[100px]">
                            <div className="flex justify-end gap-2">
                                {isPublished && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(`/noticias/${post.id}`, '_blank')}
                                  className="text-blue-400 hover:text-blue-400 hover:bg-blue-500/10"
                                  title="Ver noticia publicada"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              )}
                              {isOwner ? (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate(`/admin/posts/${post.id}`)}
                                    className="text-accent-purple hover:text-accent-purple hover:bg-accent-purple/10"
                                    title="Editar noticia"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(post.id)}
                                    className="text-red-400 hover:text-red-400 hover:bg-red-500/10"
                                    title="Eliminar noticia"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </>
                              ) : (
                                <span className="text-xs text-gray-500">Solo lectura</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden space-y-3">
            {posts.length === 0 ? (
              <div className="bg-white dark:bg-[#1E1E2A] rounded-xl p-8 text-center border border-gray-200 dark:border-white/10">
                <p className="text-gray-500 dark:text-gray-400">
                  {showOnlyMine ? 'No tienes noticias aún. Crea tu primera noticia.' : 'No hay noticias aún. Crea tu primera noticia.'}
                </p>
              </div>
            ) : (
                      posts.map((post) => {
                  const isOwner = user && post.user_id === user.id
                  const { isScheduled, isPublished } = getPublicationState(post)
                  return (
                  <div
                    key={post.id}
                    className="bg-white dark:bg-[#1E1E2A] rounded-xl p-4 border border-gray-200 dark:border-white/10 space-y-3"
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2">{post.title}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">{post.excerpt}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                        {!post.published ? (
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                            Borrador
                          </span>
                        ) : isScheduled ? (
                          <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium">
                            Programado
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                            Publicado
                          </span>
                        )}
                      {isOwner && (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                          Tuyo
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-white/10">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {isScheduled ? `Programado: ${formatDateTime(post.publish_at)}` : formatDate(post.publish_at || post.created_at)}
                        </span>
                      <div className="flex gap-2">
                          {isPublished && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/noticias/${post.id}`, '_blank')}
                            className="text-blue-400 hover:text-blue-400 hover:bg-blue-500/10"
                            title="Ver noticia"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {isOwner && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/admin/posts/${post.id}`)}
                              className="text-accent-purple hover:text-accent-purple hover:bg-accent-purple/10"
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(post.id)}
                              className="text-red-400 hover:text-red-400 hover:bg-red-500/10"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default NewsDashboard

