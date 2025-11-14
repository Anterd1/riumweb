/**
 * Utilidades para generar slugs (URLs amigables) a partir de títulos
 */

/**
 * Genera un slug básico a partir de un título
 * @param {string} title - El título a convertir
 * @returns {string} - El slug generado
 */
export const generateSlug = (title) => {
  if (!title) return ''
  
  return title
    .toLowerCase()
    .normalize('NFD') // Normalizar caracteres especiales
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
    .trim()
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
    .replace(/^-+|-+$/g, '') // Remover guiones al inicio y final
    .substring(0, 100) // Limitar longitud
}

/**
 * Genera un slug único verificando que no exista en la base de datos
 * @param {string} title - El título a convertir
 * @param {string|null} currentId - El ID del post actual (para ediciones)
 * @param {object} supabase - Cliente de Supabase
 * @returns {Promise<string>} - El slug único generado
 */
export const generateUniqueSlug = async (title, currentId = null, supabase) => {
  if (!title || !supabase) return ''
  
  let baseSlug = generateSlug(title)
  if (!baseSlug) return ''
  
  let finalSlug = baseSlug
  let counter = 0
  
  while (true) {
    let query = supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', finalSlug)
      .limit(1)
    
    if (currentId) {
      query = query.neq('id', currentId)
    }
    
    const { data, error } = await query
    
    // Si hay error o no hay datos, el slug está disponible
    if (error || !data || data.length === 0) {
      break // Slug único encontrado
    }
    
    counter++
    finalSlug = `${baseSlug}-${counter}`
    
    // Prevenir loops infinitos
    if (counter > 1000) {
      console.warn('No se pudo generar slug único después de 1000 intentos')
      finalSlug = `${baseSlug}-${Date.now()}`
      break
    }
  }
  
  return finalSlug
}

