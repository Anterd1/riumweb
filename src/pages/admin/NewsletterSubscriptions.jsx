import React, { useState, useEffect } from 'react'
import { Mail, Trash2, Check, X, Calendar, Loader2 } from 'lucide-react'
import { getSupabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'

const NewsletterSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all', 'active', 'inactive'
  const { toast } = useToast()

  useEffect(() => {
    fetchSubscriptions()
  }, [filter])

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      const supabase = await getSupabase()
      
      let query = supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('subscribed_at', { ascending: false })

      if (filter === 'active') {
        query = query.eq('active', true)
      } else if (filter === 'inactive') {
        query = query.eq('active', false)
      }

      const { data, error } = await query

      if (error) throw error
      setSubscriptions(data || [])
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const supabase = await getSupabase()
      const newStatus = !currentStatus
      
      const updateData = {
        active: newStatus,
        updated_at: new Date().toISOString(),
      }

      if (newStatus) {
        updateData.subscribed_at = new Date().toISOString()
        updateData.unsubscribed_at = null
      } else {
        updateData.unsubscribed_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('newsletter_subscriptions')
        .update(updateData)
        .eq('id', id)

      if (error) throw error

      toast({
        title: 'Éxito',
        description: newStatus 
          ? 'Suscripción reactivada' 
          : 'Suscripción desactivada',
      })

      fetchSubscriptions()
    } catch (error) {
      console.error('Error updating subscription:', error)
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (id, email) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la suscripción de ${email}?`)) {
      return
    }

    try {
      const supabase = await getSupabase()
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: 'Éxito',
        description: 'Suscripción eliminada',
      })

      fetchSubscriptions()
    } catch (error) {
      console.error('Error deleting subscription:', error)
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const activeCount = subscriptions.filter(s => s.active).length
  const totalCount = subscriptions.length

  return (
    <div className="space-y-6">
      <Toaster />
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="text-accent-purple">Newsletter</span> Suscripciones
        </h1>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
          Gestiona las suscripciones al newsletter
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div className="bg-white dark:bg-[#1E1E2A] rounded-xl p-4 md:p-6 border border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-1">Total</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {totalCount}
              </p>
            </div>
            <Mail className="h-6 w-6 md:h-8 md:w-8 text-accent-purple" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E2A] rounded-xl p-4 md:p-6 border border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-1">Activas</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {activeCount}
              </p>
            </div>
            <Check className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E2A] rounded-xl p-4 md:p-6 border border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-1">Inactivas</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {totalCount - activeCount}
              </p>
            </div>
            <X className="h-6 w-6 md:h-8 md:w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-accent-purple hover:bg-accent-purple/90 text-white' : 'border-gray-200 dark:border-white/10 bg-white dark:bg-transparent text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}
        >
          Todos
        </Button>
        <Button
          variant={filter === 'active' ? 'default' : 'outline'}
          onClick={() => setFilter('active')}
          className={filter === 'active' ? 'bg-accent-purple hover:bg-accent-purple/90 text-white' : 'border-gray-200 dark:border-white/10 bg-white dark:bg-transparent text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}
        >
          Activas
        </Button>
        <Button
          variant={filter === 'inactive' ? 'default' : 'outline'}
          onClick={() => setFilter('inactive')}
          className={filter === 'inactive' ? 'bg-accent-purple hover:bg-accent-purple/90 text-white' : 'border-gray-200 dark:border-white/10 bg-white dark:bg-transparent text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}
        >
          Inactivas
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white dark:bg-[#1E1E2A] rounded-xl p-12 text-center border border-gray-200 dark:border-white/10">
          <Loader2 className="h-8 w-8 animate-spin text-accent-purple mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Cargando suscripciones...</p>
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="bg-white dark:bg-[#1E1E2A] rounded-xl p-12 text-center border border-gray-200 dark:border-white/10">
          <Mail className="w-12 h-12 md:w-16 md:h-16 text-gray-500 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No hay suscripciones {filter !== 'all' ? (filter === 'active' ? 'activas' : 'inactivas') : ''}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1E1E2A] rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#0C0D0D] border-b border-gray-200 dark:border-white/10">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Email</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Origen</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Estado</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Fecha Suscripción</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((subscription) => (
                  <tr 
                    key={subscription.id} 
                    className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{subscription.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs capitalize">
                        {subscription.source || 'home'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {subscription.active ? (
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                          Activa
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                          Inactiva
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-gray-500 dark:text-gray-400 text-sm">
                      {formatDate(subscription.subscribed_at)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(subscription.id, subscription.active)}
                          className={subscription.active 
                            ? 'text-yellow-400 hover:text-yellow-400 hover:bg-yellow-500/10' 
                            : 'text-green-400 hover:text-green-400 hover:bg-green-500/10'
                          }
                          title={subscription.active ? 'Desactivar' : 'Reactivar'}
                        >
                          {subscription.active ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(subscription.id, subscription.email)}
                          className="text-red-400 hover:text-red-400 hover:bg-red-500/10"
                          title="Eliminar"
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
      )}
    </div>
  )
}

export default NewsletterSubscriptions

