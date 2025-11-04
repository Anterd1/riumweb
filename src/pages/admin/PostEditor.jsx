import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Save, ArrowLeft, Eye } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import SEO from '@/components/SEO'

const PostEditor = () => {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: 'Equipo rium',
    category: 'Diseño UI/UX',
    image: '',
    tags: '',
    read_time: '5 min',
    published: false,
  })

  useEffect(() => {
    if (isEdit && user) {
      fetchPost()
    }
  }, [id, user])

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      // Verificar que el usuario es el propietario del artículo
      if (data.user_id && user && data.user_id !== user.id) {
        toast({
          title: 'Acceso denegado',
          description: 'Solo puedes editar tus propios artículos',
          variant: 'destructive',
        })
        navigate('/admin')
        return
      }

      setFormData({
        title: data.title || '',
        excerpt: data.excerpt || '',
        content: data.content || '',
        author: data.author || 'Equipo rium',
        category: data.category || 'Diseño UI/UX',
        image: data.image || '',
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
        read_time: data.read_time || '5 min',
        published: data.published || false,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!user) {
      toast({
        title: 'Error',
        description: 'Debes estar autenticado para crear artículos',
        variant: 'destructive',
      })
      setLoading(false)
      return
    }

    try {
      // Parse tags
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const postData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        author: formData.author,
        category: formData.category,
        image: formData.image,
        tags: tagsArray,
        read_time: formData.read_time,
        published: formData.published,
        user_id: user.id, // Asignar automáticamente al usuario actual
      }

      let error
      if (isEdit) {
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id)
        error = updateError
      } else {
        const { error: insertError } = await supabase
          .from('blog_posts')
          .insert([postData])
        error = insertError
      }

      if (error) throw error

      toast({
        title: isEdit ? 'Artículo actualizado' : 'Artículo creado',
        description: `El artículo ha sido ${isEdit ? 'actualizado' : 'creado'} correctamente`,
      })

      navigate('/admin')
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

  const categories = [
    'Diseño UI/UX',
    'Auditorías UX',
    'Arquitectura de Información',
    'Pruebas de Usabilidad',
    'Diseño Responsivo',
    'User Personas',
    'Investigación de Mercado',
  ]

  return (
    <div className="admin-page min-h-screen bg-[#0C0D0D] text-white pt-24 pb-20">
      <SEO
        title={isEdit ? 'Editar Artículo - Admin' : 'Nuevo Artículo - Admin'}
        description="Editor de artículos del blog"
        url={`https://rium.com.mx/admin/posts/${id || 'new'}`}
      />

      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate('/admin')}
              className="mb-4 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Dashboard
            </Button>
            <h1 className="text-4xl font-bold">
              {isEdit ? 'Editar' : 'Nuevo'} <span className="text-accent-purple">Artículo</span>
            </h1>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[#1E1E2A] rounded-xl p-6 border border-white/10 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Título *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej: 10 Principios de Diseño UI/UX..."
                required
                className="bg-[#0C0D0D] border-white/10 text-white"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Resumen (Excerpt) *
              </label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Breve descripción del artículo..."
                required
                rows={3}
                className="bg-[#0C0D0D] border-white/10 text-white"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contenido
              </label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Contenido completo del artículo..."
                rows={10}
                className="bg-[#0C0D0D] border-white/10 text-white"
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Autor
              </label>
              <Input
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Equipo rium"
                className="bg-[#0C0D0D] border-white/10 text-white"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Categoría *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full px-4 py-2 bg-[#0C0D0D] border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-accent-purple"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL de Imagen
              </label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="bg-[#0C0D0D] border-white/10 text-white"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags (separados por comas)
              </label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="UI/UX, Diseño, Mejores Prácticas"
                className="bg-[#0C0D0D] border-white/10 text-white"
              />
            </div>

            {/* Read Time */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tiempo de Lectura
              </label>
              <Input
                value={formData.read_time}
                onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                placeholder="5 min"
                className="bg-[#0C0D0D] border-white/10 text-white"
              />
            </div>

            {/* Published */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 text-accent-purple bg-[#0C0D0D] border-white/10 rounded focus:ring-accent-purple"
              />
              <label htmlFor="published" className="text-sm font-medium text-gray-300">
                Publicar artículo
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-accent-purple hover:bg-accent-purple/90 text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Guardando...' : isEdit ? 'Actualizar Artículo' : 'Crear Artículo'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin')}
              className="border-white/10"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PostEditor

