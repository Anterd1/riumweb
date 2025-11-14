import React, { useState, memo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, Loader2, Check } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { getSupabase } from '@/lib/supabase'

const NewsletterSubscription = memo(({ 
  title = "¿Quieres Más Contenido?",
  description = "Suscríbete a nuestro newsletter para recibir los últimos artículos directamente en tu correo.",
  source = "home",
  className = ""
}) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('🚀 Formulario enviado, email:', email)
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      console.log('❌ Email inválido')
      toast({
        title: 'Email inválido',
        description: 'Por favor ingresa un email válido',
        variant: 'destructive',
      })
      return
    }
    
    console.log('✅ Email válido, procediendo...')

    setLoading(true)

    try {
      console.log('📧 Intentando suscribir:', email)
      
      const supabase = await getSupabase()
      
      if (!supabase) {
        throw new Error('No se pudo conectar con el servidor')
      }

      console.log('✅ Supabase conectado, insertando suscripción...')

      // Intentar insertar la suscripción
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{
          email: email.trim().toLowerCase(),
          source: source,
          active: true,
        }])
        .select()

      console.log('📊 Resultado:', { data, error })

      if (error) {
        console.error('❌ Error al insertar:', error)
        
        // Si el error es por duplicado, mostrar mensaje apropiado
        if (error.code === '23505') { // Unique violation
          console.log('⚠️ Email duplicado')
          toast({
            title: 'Ya estás suscrito',
            description: 'Este email ya está registrado en nuestro newsletter',
          })
          setSubscribed(true)
          setEmail('')
          setLoading(false)
          setTimeout(() => {
            setSubscribed(false)
          }, 3000)
          return
        } else {
          // Para otros errores, mostrar mensaje específico
          console.error('Error desconocido:', error)
          const errorMessage = error.message || 'No se pudo completar la suscripción'
          
          // Si es un error de RLS, dar un mensaje más claro
          if (error.message?.includes('policy') || error.message?.includes('permission')) {
            throw new Error('Error de permisos. Por favor verifica la configuración de la base de datos.')
          }
          
          throw new Error(errorMessage)
        }
      } else {
        console.log('✅ Suscripción creada exitosamente:', data)
      }

      toast({
        title: '¡Gracias por suscribirte!',
        description: 'Te enviaremos los últimos artículos directamente a tu correo.',
      })
      
      setSubscribed(true)
      setEmail('')
      
      // Resetear estado después de 3 segundos
      setTimeout(() => {
        setSubscribed(false)
      }, 3000)

    } catch (error) {
      console.error('Error suscribiendo al newsletter:', error)
      toast({
        title: 'Error',
        description: error.message || 'No se pudo completar la suscripción. Por favor intenta nuevamente.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`bg-gradient-to-r from-accent-purple/20 to-accent-purple/10 rounded-3xl p-8 md:p-12 text-center border border-accent-purple/20 ${className}`}>
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 uppercase text-white">
        {title}
      </h2>
      <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
        {description}
      </p>
      
      {subscribed ? (
        <div className="flex items-center justify-center gap-2 text-green-400">
          <Check className="h-5 w-5" />
          <span className="text-lg font-semibold">¡Suscrito exitosamente!</span>
        </div>
      ) : (
        <form 
          onSubmit={handleSubmit} 
          className="max-w-md mx-auto"
          noValidate
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              disabled={loading}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
            />
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              onClick={(e) => {
                console.log('🔘 Botón clickeado')
                // El formulario manejará el submit, pero esto nos ayuda a debuggear
              }}
              className="bg-accent-purple hover:bg-accent-purple/90 text-white font-bold px-6 md:px-8 py-6 text-lg rounded-full whitespace-nowrap"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Suscribiendo...
                </>
              ) : (
                <>
                  Suscribirse
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
})

NewsletterSubscription.displayName = 'NewsletterSubscription'

export default NewsletterSubscription

