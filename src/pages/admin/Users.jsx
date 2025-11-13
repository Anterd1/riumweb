import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Mail, User, Shield, Eye, EyeOff, Loader2 } from 'lucide-react'
import { getSupabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    name: '',
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const supabase = await getSupabase()
      
      // Obtener usuarios usando la función admin de Supabase
      // Nota: Esto requiere el service_role_key, que debería estar en el backend
      // Por ahora, obtenemos usuarios desde la tabla auth.users mediante una función edge
      // o usando el admin API directamente
      
      // Intentar obtener usuarios desde una función edge o usar el admin client
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      if (!currentUser) {
        throw new Error('No autenticado')
      }

      // Para obtener la lista de usuarios, necesitamos usar el admin API
      // Esto normalmente se haría desde un backend, pero podemos usar una función edge
      // Por ahora, mostraremos un mensaje indicando que se necesita configuración
      
      // Alternativa: usar fetch directo al admin API de Supabase
      const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
      
      if (!serviceRoleKey) {
        console.warn('SERVICE_ROLE_KEY no configurado. No se pueden listar usuarios.')
        setUsers([])
        setLoading(false)
        return
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/admin/users`,
        {
          headers: {
            'apikey': serviceRoleKey,
            'Authorization': `Bearer ${serviceRoleKey}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Error al obtener usuarios')
      }

      const usersData = await response.json()
      setUsers(usersData.users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los usuarios. Verifica la configuración.',
        variant: 'destructive',
      })
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    
    if (!newUser.email || !newUser.password) {
      toast({
        title: 'Error de validación',
        description: 'Email y contraseña son obligatorios',
        variant: 'destructive',
      })
      return
    }

    if (newUser.password.length < 6) {
      toast({
        title: 'Error de validación',
        description: 'La contraseña debe tener al menos 6 caracteres',
        variant: 'destructive',
      })
      return
    }

    setCreating(true)

    try {
      const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
      
      if (!serviceRoleKey) {
        throw new Error('SERVICE_ROLE_KEY no configurado')
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/admin/users`,
        {
          method: 'POST',
          headers: {
            'apikey': serviceRoleKey,
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: newUser.email,
            password: newUser.password,
            email_confirm: true,
            user_metadata: {
              name: newUser.name || 'Usuario',
              role: 'editor',
            },
          }),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error al crear usuario')
      }

      const userData = await response.json()

      toast({
        title: '✅ Usuario creado',
        description: `El usuario ${newUser.email} ha sido creado correctamente`,
      })

      // Limpiar formulario
      setNewUser({ email: '', password: '', name: '' })
      setShowCreateForm(false)
      
      // Recargar lista de usuarios
      fetchUsers()
    } catch (error) {
      console.error('Error creating user:', error)
      toast({
        title: 'Error al crear usuario',
        description: error.message || 'No se pudo crear el usuario',
        variant: 'destructive',
      })
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteUser = async (userId, userEmail) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar al usuario ${userEmail}?`)) {
      return
    }

    try {
      const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
      
      if (!serviceRoleKey) {
        throw new Error('SERVICE_ROLE_KEY no configurado')
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/admin/users/${userId}`,
        {
          method: 'DELETE',
          headers: {
            'apikey': serviceRoleKey,
            'Authorization': `Bearer ${serviceRoleKey}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Error al eliminar usuario')
      }

      toast({
        title: 'Usuario eliminado',
        description: `El usuario ${userEmail} ha sido eliminado`,
      })

      fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      toast({
        title: 'Error',
        description: error.message || 'No se pudo eliminar el usuario',
        variant: 'destructive',
      })
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <Toaster />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-4 mb-4 md:mb-6">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            <span className="text-accent-purple">Usuarios</span>
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
            Gestiona los usuarios que pueden publicar artículos y noticias
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-accent-purple hover:bg-accent-purple/90 w-full md:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Formulario de creación */}
      {showCreateForm && (
        <div className="bg-white dark:bg-[#1E1E2A] rounded-xl p-6 border border-gray-200 dark:border-white/10">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Crear Nuevo Usuario</h2>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <Input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="usuario@ejemplo.com"
                required
                className="bg-gray-50 dark:bg-[#0C0D0D] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contraseña * (mínimo 6 caracteres)
              </label>
              <Input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="••••••••"
                required
                minLength={6}
                className="bg-gray-50 dark:bg-[#0C0D0D] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre (opcional)
              </label>
              <Input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Nombre del usuario"
                className="bg-gray-50 dark:bg-[#0C0D0D] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={creating}
                className="bg-accent-purple hover:bg-accent-purple/90"
              >
                {creating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Usuario
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false)
                  setNewUser({ email: '', password: '', name: '' })
                }}
                className="border-gray-200 dark:border-white/10 bg-white dark:bg-transparent text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de usuarios */}
      {loading ? (
        <div className="text-center py-16">
          <Loader2 className="h-12 w-12 animate-spin text-accent-purple mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Cargando usuarios...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white dark:bg-[#1E1E2A] rounded-xl p-8 text-center border border-gray-200 dark:border-white/10">
          <User className="h-12 w-12 text-gray-500 dark:text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            {import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
              ? 'No hay usuarios registrados aún.'
              : 'SERVICE_ROLE_KEY no configurado. Agrega VITE_SUPABASE_SERVICE_ROLE_KEY a tu .env'}
          </p>
          {!import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Obtén el SERVICE_ROLE_KEY desde Supabase Dashboard > Settings > API
            </p>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white dark:bg-[#1E1E2A] rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-[#0C0D0D] border-b border-gray-200 dark:border-white/10">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Email</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Nombre</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Rol</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Creado</th>
                    <th className="px-4 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-900 dark:text-white">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                        {user.user_metadata?.name || 'N/A'}
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                          {user.user_metadata?.role || 'editor'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-500 dark:text-gray-400 text-sm">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id, user.email)}
                            className="text-red-400 hover:text-red-400 hover:bg-red-500/10"
                            title="Eliminar usuario"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white dark:bg-[#1E1E2A] rounded-xl p-4 border border-gray-200 dark:border-white/10 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail size={16} className="text-gray-500 dark:text-gray-400" />
                      <span className="font-semibold text-gray-900 dark:text-white">{user.email}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.user_metadata?.name || 'Sin nombre'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                      {user.user_metadata?.role || 'editor'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(user.created_at)}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id, user.email)}
                    className="text-red-400 hover:text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Users



