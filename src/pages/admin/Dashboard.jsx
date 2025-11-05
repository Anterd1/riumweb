import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Eye, LogOut, FileText, Filter } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getSupabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import SEO from '@/components/SEO'

const Dashboard = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showOnlyMine, setShowOnlyMine] = useState(false)
  const { user, signOut } = useAuth()
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

  const handleLogout = async () => {
    await signOut()
    navigate('/admin/login')
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
    <div className="admin-page min-h-screen bg-[#0C0D0D] text-white pt-24 pb-20">
      <SEO
        title="Dashboard - Admin"
        description="Panel de administración del blog de rium"
        url="https://rium.com.mx/admin"
      />

      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Panel de <span className="text-accent-purple">Administración</span>
            </h1>
            <p className="text-gray-400">Gestiona los artículos de tu blog</p>
            {user && (
              <p className="text-sm text-gray-500 mt-1">
                Conectado como: <span className="text-accent-purple">{user.email}</span>
              </p>
            )}
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => navigate('/admin/posts/new')}
              className="bg-accent-purple hover:bg-accent-purple/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Artículo
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-white/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Salir
            </Button>
          </div>
        </div>

        {/* Filtro */}
        <div className="mb-6 flex items-center gap-4">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
          <div className="bg-[#1E1E2A] rounded-xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0C0D0D] border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Título</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Categoría</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Autor</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Estado</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Fecha</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Acciones</th>
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
                          <td className="px-6 py-4">
                            <p className="font-medium text-white">{post.title}</p>
                            <p className="text-sm text-gray-400 line-clamp-1">{post.excerpt}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-accent-purple/20 text-accent-purple rounded-full text-xs font-medium">
                              {post.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-300">{post.author || 'Equipo rium'}</span>
                              {isOwner && (
                                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">
                                  Tuyo
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
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
                          <td className="px-6 py-4 text-gray-400 text-sm">
                            {formatDate(post.created_at)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              {isOwner ? (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate(`/admin/posts/${post.id}`)}
                                    className="text-accent-purple hover:text-accent-purple hover:bg-accent-purple/10"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(post.id)}
                                    className="text-red-400 hover:text-red-400 hover:bg-red-500/10"
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
        )}
      </div>
    </div>
  )
}

export default Dashboard

