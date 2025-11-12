import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Eye, FileText, Filter } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getSupabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'

const Dashboard = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showOnlyMine, setShowOnlyMine] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    fetchPosts()
  }, [showOnlyMine, user])

  const fetchPosts = async () => {
    try {
      const supabase = await getSupabase()
      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })

      // Filtrar solo los artículos del usuario actual si está activado el filtro
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
        description: 'Solo puedes eliminar tus propios artículos',
        variant: 'destructive',
      })
      return
    }

    if (!confirm('¿Estás seguro de que quieres eliminar este artículo?')) return

    try {
      const supabase = await getSupabase()
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: 'Artículo eliminado',
        description: 'El artículo ha sido eliminado correctamente',
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

  return (
    <div className="space-y-6">
      <Toaster />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            <span className="text-accent-purple">Artículos</span>
          </h1>
          <p className="text-sm md:text-base text-gray-400">Gestiona los artículos de tu blog</p>
          {user && (
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Conectado como: <span className="text-accent-purple">{user.email}</span>
            </p>
          )}
        </div>
        <Button
          onClick={() => navigate('/admin/posts/new')}
          className="bg-accent-purple hover:bg-accent-purple/90 w-full md:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Artículo
        </Button>
      </div>

      {/* Filtro */}
      <div className="flex items-center gap-4">
          <Button
            variant={showOnlyMine ? "default" : "outline"}
            onClick={() => setShowOnlyMine(!showOnlyMine)}
            className={showOnlyMine ? "bg-accent-purple hover:bg-accent-purple/90" : "border-white/10"}
          >
            <Filter className="mr-2 h-4 w-4" />
            {showOnlyMine ? 'Mostrar todos' : 'Solo mis artículos'}
          </Button>
          {showOnlyMine && (
            <span className="text-sm text-gray-400">
              Mostrando {posts.length} artículo{posts.length !== 1 ? 's' : ''} tuyo{posts.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-[#1E1E2A] rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Artículos</p>
                <p className="text-3xl font-bold">{posts.length}</p>
              </div>
              <FileText className="h-8 w-8 text-accent-purple" />
            </div>
          </div>
          <div className="bg-[#1E1E2A] rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Publicados</p>
                <p className="text-3xl font-bold">
                  {posts.filter(p => p.published).length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-[#1E1E2A] rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Borradores</p>
                <p className="text-3xl font-bold">
                  {posts.filter(p => !p.published).length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Posts Table */}
        {loading ? (
          <div className="text-center py-16">
            <p className="text-gray-400">Cargando artículos...</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-[#1E1E2A] rounded-xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#0C0D0D] border-b border-white/10">
                    <tr>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-300 w-[200px] max-w-[200px]">Título</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-300 w-[140px]">Categoría</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-300 w-[140px]">Autor</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-300 w-[110px]">Estado</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-300 w-[120px]">Fecha</th>
                      <th className="px-4 py-4 text-right text-sm font-semibold text-gray-300 w-[100px]">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                          {showOnlyMine ? 'No tienes artículos aún. Crea tu primer artículo.' : 'No hay artículos aún. Crea tu primer artículo.'}
                        </td>
                      </tr>
                    ) : (
                      posts.map((post) => {
                        const isOwner = user && post.user_id === user.id
                        return (
                          <tr key={post.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="px-4 py-4 w-[200px] max-w-[200px]">
                              <p className="font-medium text-white line-clamp-2 text-sm">{post.title}</p>
                              <p className="text-xs text-gray-400 line-clamp-1 mt-1">{post.excerpt}</p>
                            </td>
                            <td className="px-4 py-4 w-[140px]">
                              <span className="px-3 py-1 bg-accent-purple/20 text-accent-purple rounded-full text-xs font-medium">
                                {post.category}
                              </span>
                            </td>
                            <td className="px-4 py-4 w-[140px]">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm text-gray-300">{post.author || 'Equipo rium'}</span>
                                {isOwner && (
                                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">
                                    Tuyo
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4 w-[110px]">
                              {post.published ? (
                                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                                  Publicado
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                                  Borrador
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-4 text-gray-400 text-sm w-[120px]">
                              {formatDate(post.created_at)}
                            </td>
                            <td className="px-4 py-4 w-[100px]">
                              <div className="flex justify-end gap-2">
                                {post.published && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => window.open(`/blog/${post.id}`, '_blank')}
                                    className="text-blue-400 hover:text-blue-400 hover:bg-blue-500/10"
                                    title="Ver artículo publicado"
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
                                      title="Editar artículo"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDelete(post.id)}
                                      className="text-red-400 hover:text-red-400 hover:bg-red-500/10"
                                      title="Eliminar artículo"
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
            <div className="md:hidden space-y-4">
              {posts.length === 0 ? (
                <div className="bg-[#1E1E2A] rounded-xl p-8 text-center border border-white/10">
                  <p className="text-gray-400">
                    {showOnlyMine ? 'No tienes artículos aún. Crea tu primer artículo.' : 'No hay artículos aún. Crea tu primer artículo.'}
                  </p>
                </div>
              ) : (
                posts.map((post) => {
                  const isOwner = user && post.user_id === user.id
                  return (
                    <div
                      key={post.id}
                      className="bg-[#1E1E2A] rounded-xl p-4 border border-white/10 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2">{post.title}</h3>
                          <p className="text-xs text-gray-400 line-clamp-2 mb-2">{post.excerpt}</p>
                        </div>
                        {post.published && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/blog/${post.id}`, '_blank')}
                            className="text-blue-400 hover:text-blue-400 hover:bg-blue-500/10 flex-shrink-0"
                            title="Ver artículo"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-1 bg-accent-purple/20 text-accent-purple rounded-full text-xs font-medium">
                          {post.category}
                        </span>
                        {post.published ? (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                            Publicado
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                            Borrador
                          </span>
                        )}
                        {isOwner && (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                            Tuyo
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-xs text-gray-500">{formatDate(post.created_at)}</span>
                        {isOwner && (
                          <div className="flex gap-2">
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
                          </div>
                        )}
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

export default Dashboard

