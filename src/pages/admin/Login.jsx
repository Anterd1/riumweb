import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import SEO from '@/components/SEO'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('📝 Formulario enviado:', { email })
    setLoading(true)

    try {
      console.log('🔐 Intentando login...')
      const { data, error } = await signIn(email, password)
      console.log('📥 Respuesta de signIn:', { data, error })

      if (error) {
        console.error('Error de login:', error)
        toast({
          title: 'Error de autenticación',
          description: error.message || 'No se pudo iniciar sesión. Verifica tus credenciales.',
          variant: 'destructive',
        })
        setLoading(false)
        return
      }

      // Si el login fue exitoso
      if (data && data.session) {
        toast({
          title: '¡Bienvenido!',
          description: 'Has iniciado sesión correctamente',
        })
        
        // Esperar un momento para que el estado se actualice
        setTimeout(() => {
          navigate('/admin', { replace: true })
        }, 300)
      } else {
        toast({
          title: 'Error',
          description: 'No se recibió respuesta del servidor',
          variant: 'destructive',
        })
        setLoading(false)
      }
    } catch (err) {
      console.error('Excepción en handleSubmit:', err)
      toast({
        title: 'Error inesperado',
        description: 'Ocurrió un error al intentar iniciar sesión',
        variant: 'destructive',
      })
      setLoading(false)
    }
  }

  return (
    <div className="admin-page min-h-screen bg-[#0C0D0D] flex items-center justify-center p-6">
      <SEO
        title="Iniciar Sesión - Admin"
        description="Panel de administración de rium"
        url="https://rium.com.mx/admin/login"
      />
      <Toaster />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#1E1E2A] rounded-2xl p-8 shadow-2xl border border-white/10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Panel de <span className="text-accent-purple">Administración</span>
            </h1>
            <p className="text-gray-400">Inicia sesión para gestionar el blog</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="bg-[#0C0D0D] border-white/10 text-white"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-[#0C0D0D] border-white/10 text-white"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-purple hover:bg-accent-purple/90 text-white"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default Login

