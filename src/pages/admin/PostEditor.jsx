import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Save, ArrowLeft, Eye, Upload, X, Loader2 } from 'lucide-react'
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
  const fileInputRef = useRef(null)
  
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
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
      // Establecer preview si hay imagen
      if (data.image) {
        setImagePreview(data.image)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Por favor selecciona un archivo de imagen válido',
        variant: 'destructive',
      })
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'La imagen es demasiado grande. Máximo 5MB',
        variant: 'destructive',
      })
      return
    }

    if (!user) {
      toast({
        title: 'Error',
        description: 'Debes estar autenticado para subir imágenes',
        variant: 'destructive',
      })
      return
    }

    setUploadingImage(true)

    try {
      // Crear nombre único para el archivo
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      
      // Subir imagen a Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Obtener URL pública de la imagen
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName)

      // Actualizar estado del formulario con la nueva URL
      setFormData({ ...formData, image: publicUrl })
      setImagePreview(publicUrl)

      toast({
        title: 'Imagen subida',
        description: 'La imagen se ha subido correctamente',
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: 'Error al subir imagen',
        description: error.message || 'No se pudo subir la imagen',
        variant: 'destructive',
      })
    } finally {
      setUploadingImage(false)
      // Limpiar el input file
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: '' })
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
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

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Imagen del Artículo
              </label>
              
              {/* Preview de imagen */}
              {imagePreview && (
                <div className="relative mb-4 rounded-lg overflow-hidden border border-white/10">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Input para subir archivo */}
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={uploadingImage}
                />
                <label
                  htmlFor="image-upload"
                  className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    uploadingImage
                      ? 'border-gray-500 cursor-not-allowed'
                      : 'border-white/20 hover:border-accent-purple/50'
                  }`}
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin text-accent-purple" />
                      <span className="text-gray-400">Subiendo imagen...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-400">
                        {imagePreview ? 'Cambiar imagen' : 'Subir imagen desde tu dispositivo'}
                      </span>
                    </>
                  )}
                </label>
              </div>

              {/* Input para URL manual (opcional) */}
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">O ingresa una URL manualmente:</p>
                <Input
                  value={formData.image}
                  onChange={(e) => {
                    setFormData({ ...formData, image: e.target.value })
                    setImagePreview(e.target.value || null)
                  }}
                  placeholder="https://images.unsplash.com/..."
                  className="bg-[#0C0D0D] border-white/10 text-white"
                />
              </div>
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

