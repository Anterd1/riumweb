import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Save, ArrowLeft, Eye, Upload, X, Loader2 } from 'lucide-react'
import { getSupabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import SEO from '@/components/SEO'
import WysiwygEditor from '@/components/WysiwygEditor'
import { generateUniqueSlug } from '@/lib/slug'

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
    post_type: 'article', // 'article' o 'news'
    scheduled_at: null, // Fecha/hora programada para publicar
    slug: null, // Slug generado automáticamente
  })

  useEffect(() => {
    // Verificar si hay un parámetro type en la URL para establecer el tipo de post
    const urlParams = new URLSearchParams(window.location.search)
    const typeParam = urlParams.get('type')
    if (typeParam === 'news' && !isEdit) {
      setFormData(prev => ({ ...prev, post_type: 'news', category: 'Diseño' }))
    }

    if (isEdit && user) {
      fetchPost()
    }
  }, [id, user, isEdit])

  const fetchPost = async () => {
    try {
      const supabase = await getSupabase()
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
        post_type: data.post_type || 'article',
        scheduled_at: data.scheduled_at || null,
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
      const supabase = await getSupabase()
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
        title: 'Error de autenticación',
        description: 'Debes estar autenticado para crear artículos. Por favor, inicia sesión nuevamente.',
        variant: 'destructive',
      })
      setLoading(false)
      navigate('/admin/login')
      return
    }

    // Validaciones
    if (!formData.title || formData.title.trim().length === 0) {
      toast({
        title: 'Error de validación',
        description: 'El título es obligatorio',
        variant: 'destructive',
      })
      setLoading(false)
      return
    }

    if (!formData.excerpt || formData.excerpt.trim().length === 0) {
      toast({
        title: 'Error de validación',
        description: 'El resumen (excerpt) es obligatorio',
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

      // Determinar el estado de publicación
      let published = formData.published
      let scheduled_at = formData.scheduled_at || null
      
      // Si hay fecha programada y está en el futuro, no publicar inmediatamente
      if (scheduled_at) {
        const scheduledDate = new Date(scheduled_at)
        const now = new Date()
        if (scheduledDate > now) {
          // Programado para el futuro: mantener published=false hasta que llegue la fecha
          published = false
        } else {
          // Fecha programada ya pasó: publicar y limpiar scheduled_at
          published = true
          scheduled_at = null
        }
      }

      const supabase = await getSupabase()
      
      // Generar slug único si no existe (siempre para nuevos posts, solo si falta para ediciones)
      let slug = formData.slug
      if (!slug) {
        slug = await generateUniqueSlug(formData.title.trim(), isEdit ? id : null, supabase)
      }

      const postData = {
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content?.trim() || '',
        author: formData.author?.trim() || 'Equipo rium',
        category: formData.category,
        image: formData.image?.trim() || '',
        tags: tagsArray,
        read_time: formData.read_time?.trim() || '5 min',
        published: published,
        post_type: formData.post_type || 'article',
        scheduled_at: scheduled_at,
        slug: slug, // Slug generado automáticamente
        user_id: user.id, // Asignar automáticamente al usuario actual
      }

      console.log('Guardando artículo:', { ...postData, content: postData.content.substring(0, 50) + '...' })
      let result
      let error
      
      if (isEdit) {
        result = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id)
          .select()
        error = result.error
      } else {
        result = await supabase
          .from('blog_posts')
          .insert([postData])
          .select()
        error = result.error
      }

      if (error) {
        console.error('Error de Supabase:', error)
        // Mensajes de error más descriptivos
        let errorMessage = error.message || 'Error desconocido'
        
        if (error.code === '42501') {
          errorMessage = 'No tienes permisos para realizar esta acción. Verifica las políticas RLS en Supabase.'
        } else if (error.code === '23505') {
          errorMessage = 'Ya existe un artículo con estos datos. Intenta con un título diferente.'
        } else if (error.code === '23503') {
          errorMessage = 'Error de referencia. Verifica que el user_id sea válido.'
        } else if (error.message?.includes('RLS')) {
          errorMessage = 'Error de permisos (RLS). Verifica que las políticas estén configuradas correctamente en Supabase.'
        }
        
        throw new Error(errorMessage)
      }

      // Verificar que se guardó correctamente
      if (result.data && result.data.length > 0) {
        const savedPost = result.data[0]
        console.log('Artículo guardado exitosamente:', savedPost.id)
        
        toast({
          title: isEdit ? '✅ Artículo actualizado' : '✅ Artículo creado',
          description: `El artículo "${savedPost.title}" ha sido ${isEdit ? 'actualizado' : 'creado'} correctamente. ${savedPost.published ? 'Está publicado y visible en el blog.' : 'Está guardado como borrador.'}`,
        })

        // Pequeño delay para que el usuario vea el mensaje
        setTimeout(() => {
          navigate('/admin')
        }, 1500)
      } else {
        throw new Error('El artículo no se guardó correctamente. No se recibió confirmación de la base de datos.')
      }
    } catch (error) {
      console.error('Error completo:', error)
      toast({
        title: '❌ Error al guardar',
        description: error.message || 'Ocurrió un error inesperado al guardar el artículo. Por favor, intenta nuevamente.',
        variant: 'destructive',
      })
      setLoading(false)
    }
  }

  // Categorías según el tipo de post
  const articleCategories = [
    'Diseño UI/UX',
    'Auditorías UX',
    'Arquitectura de Información',
    'Pruebas de Usabilidad',
    'Diseño Responsivo',
    'User Personas',
    'Investigación de Mercado',
  ]

  const newsCategories = [
    'Diseño',
    'Desarrollo',
    'Tecnología',
    'Herramientas',
    'Tendencias',
    'Frameworks',
    'Librerías',
    'IA y Machine Learning',
    'Startups',
    'Eventos',
  ]

  const categories = formData.post_type === 'news' ? newsCategories : articleCategories

  return (
    <div className="admin-page min-h-screen bg-gray-50 dark:bg-[#0C0D0D] text-gray-900 dark:text-white pt-24 pb-20">
      <SEO
        title={isEdit ? 'Editar Artículo - Admin' : 'Nuevo Artículo - Admin'}
        description="Editor de artículos del blog"
        url={`https://rium.com.mx/admin/posts/${id || 'new'}`}
      />
      <Toaster />

      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate('/admin')}
              className="mb-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Dashboard
            </Button>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Editar' : 'Nuevo'} <span className="text-accent-purple">Artículo</span>
            </h1>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna Izquierda - Contenido Principal */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-[#1E1E2A] border-gray-200 dark:border-white/10 rounded-xl p-6 border space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Título *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej: 10 Principios de Diseño UI/UX..."
                required
                className="bg-gray-50 dark:bg-[#0C0D0D] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Resumen (Excerpt) *
              </label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Breve descripción del artículo..."
                required
                rows={3}
                className="bg-gray-50 dark:bg-[#0C0D0D] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Contenido
              </label>
              <WysiwygEditor
                key={id || 'new'} // Forzar recreación del editor cuando cambie el artículo
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Escribe el contenido del artículo. Se verá exactamente como en la página publicada..."
              />
            </div>
              </div>
            </div>

            {/* Columna Derecha - Configuración */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-[#1E1E2A] border-gray-200 dark:border-white/10 rounded-xl p-6 border space-y-6 sticky top-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Configuración</h2>
                
            {/* Author */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Autor
              </label>
              <Input
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Equipo rium"
                className="bg-gray-50 dark:bg-[#0C0D0D] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
              />
            </div>

            {/* Post Type */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Tipo de Contenido *
              </label>
              <select
                value={formData.post_type}
                onChange={(e) => {
                  const newType = e.target.value
                  // Resetear categoría cuando cambia el tipo
                  const defaultCategory = newType === 'news' ? 'Diseño' : 'Diseño UI/UX'
                  setFormData({ 
                    ...formData, 
                    post_type: newType,
                    category: defaultCategory
                  })
                }}
                required
                className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-purple bg-gray-50 dark:bg-[#0C0D0D] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white border"
              >
                <option value="article">Artículo del Blog</option>
                <option value="news">Noticia Tech</option>
              </select>
              <p className="text-xs mt-1 text-gray-400 dark:text-gray-500">
                {formData.post_type === 'article' 
                  ? 'Artículo sobre diseño UI/UX, experiencia de usuario, etc.'
                  : 'Noticia sobre tecnología, desarrollo, herramientas, etc.'}
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Categoría *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-purple bg-gray-50 dark:bg-[#0C0D0D] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white border"
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
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Imagen del Artículo
              </label>
              
              {/* Preview de imagen */}
              {imagePreview && (
                <div className="relative mb-4 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10">
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
                      : 'border-gray-300 dark:border-white/20 hover:border-accent-purple/50'
                  }`}
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin text-accent-purple" />
                      <span className="text-gray-500 dark:text-gray-400">
                        Subiendo imagen...
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-500 dark:text-gray-400">
                        {imagePreview ? 'Cambiar imagen' : 'Subir imagen desde tu dispositivo'}
                      </span>
                    </>
                  )}
                </label>
              </div>

              {/* Input para URL manual (opcional) */}
              <div className="mt-4">
                <p className="text-xs mb-2 text-gray-400 dark:text-gray-500">
                  O ingresa una URL manualmente:
                </p>
                <Input
                  value={formData.image}
                  onChange={(e) => {
                    setFormData({ ...formData, image: e.target.value })
                    setImagePreview(e.target.value || null)
                  }}
                  placeholder="https://images.unsplash.com/..."
                  className="bg-gray-50 dark:bg-[#0C0D0D] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Tags (separados por comas)
              </label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="UI/UX, Diseño, Mejores Prácticas"
                className="bg-gray-50 dark:bg-[#0C0D0D] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
              />
            </div>

            {/* Read Time */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Tiempo de Lectura
              </label>
              <Input
                value={formData.read_time}
                onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                placeholder="5 min"
                className="bg-gray-50 dark:bg-[#0C0D0D] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
              />
            </div>

            {/* Scheduled Publish */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="schedule"
                  checked={!!formData.scheduled_at}
                  onChange={(e) => {
                    if (e.target.checked) {
                      // Establecer fecha/hora por defecto: mañana a las 9 AM
                      const tomorrow = new Date()
                      tomorrow.setDate(tomorrow.getDate() + 1)
                      tomorrow.setHours(9, 0, 0, 0)
                      setFormData({ ...formData, scheduled_at: tomorrow.toISOString().slice(0, 16) })
                    } else {
                      setFormData({ ...formData, scheduled_at: null })
                    }
                  }}
                  className="w-4 h-4 text-accent-purple rounded focus:ring-accent-purple bg-gray-50 dark:bg-[#0C0D0D] border-gray-200 dark:border-white/10 border"
                />
                <label htmlFor="schedule" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Programar publicación
                </label>
              </div>
              
              {formData.scheduled_at && (
                <div>
                  <label htmlFor="scheduled_at" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Fecha y hora de publicación
                  </label>
                  <Input
                    id="scheduled_at"
                    type="datetime-local"
                    value={formData.scheduled_at ? new Date(formData.scheduled_at).toISOString().slice(0, 16) : ''}
                    onChange={(e) => {
                      const value = e.target.value
                      setFormData({ 
                        ...formData, 
                        scheduled_at: value ? new Date(value).toISOString() : null 
                      })
                    }}
                    min={new Date().toISOString().slice(0, 16)}
                    className="bg-gray-50 dark:bg-[#0C0D0D] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                  />
                  <p className="text-xs mt-1 text-gray-400 dark:text-gray-500">
                    El artículo se publicará automáticamente en la fecha y hora seleccionada
                  </p>
                </div>
              )}
            </div>

            {/* Published */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => {
                  const newPublished = e.target.checked
                  // Si se marca como publicado y hay fecha programada, limpiar la fecha programada
                  if (newPublished && formData.scheduled_at) {
                    setFormData({ ...formData, published: newPublished, scheduled_at: null })
                  } else {
                    setFormData({ ...formData, published: newPublished })
                  }
                }}
                className="w-4 h-4 text-accent-purple rounded focus:ring-accent-purple bg-gray-50 dark:bg-[#0C0D0D] border-gray-200 dark:border-white/10 border"
              />
              <label htmlFor="published" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Publicar ahora (inmediatamente)
              </label>
            </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-white/10">
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
              className="border-gray-200 dark:border-white/10 bg-white dark:bg-transparent text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
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

