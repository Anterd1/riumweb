import React, { useState, useEffect } from 'react'
import { getSupabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Mail, Check, Trash2, Eye, EyeOff, Calendar } from 'lucide-react'

const Requests = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchMessages()
    }
  }, [user])

  const fetchMessages = async () => {
    try {
      const supabase = await getSupabase()
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMessages(data || [])
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

  const handleMarkAsRead = async (id, currentReadStatus) => {
    try {
      const supabase = await getSupabase()
      const { error } = await supabase
        .from('contact_messages')
        .update({ read: !currentReadStatus })
        .eq('id', id)

      if (error) throw error

      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, read: !currentReadStatus } : msg
      ))

      toast({
        title: currentReadStatus ? 'Marcado como no leído' : 'Marcado como leído',
        description: 'El estado del mensaje ha sido actualizado',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este mensaje?')) return

    try {
      const supabase = await getSupabase()
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id)

      if (error) throw error

      setMessages(messages.filter(msg => msg.id !== id))
      if (selectedMessage?.id === id) {
        setSelectedMessage(null)
      }

      toast({
        title: 'Mensaje eliminado',
        description: 'El mensaje ha sido eliminado correctamente',
      })
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const unreadCount = messages.filter(msg => !msg.read).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Cargando solicitudes...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            Solicitudes de <span className="text-accent-purple">Contacto</span>
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
            {messages.length} mensaje{messages.length !== 1 ? 's' : ''} recibido{messages.length !== 1 ? 's' : ''}
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-accent-purple/20 text-accent-purple rounded-full text-xs md:text-sm">
                {unreadCount} no leído{unreadCount !== 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        {/* Lista de mensajes */}
        <div className={`lg:col-span-1 space-y-3 ${selectedMessage ? 'hidden lg:block' : ''}`}>
          {messages.length === 0 ? (
            <div className="bg-white dark:bg-[#1E1E2A] rounded-xl p-6 md:p-8 text-center border border-gray-200 dark:border-white/10">
              <Mail className="w-10 h-10 md:w-12 md:h-12 text-gray-500 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">No hay mensajes aún</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                onClick={() => setSelectedMessage(message)}
                className={`p-3 md:p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedMessage?.id === message.id
                    ? 'bg-accent-purple/20 border-accent-purple/50'
                    : message.read
                    ? 'bg-white dark:bg-[#1E1E2A] border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                    : 'bg-white dark:bg-[#1E1E2A] border-accent-purple/30 hover:border-accent-purple/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm md:text-base ${!message.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                      {message.name}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">{message.email}</p>
                  </div>
                  {!message.read && (
                    <div className="w-2 h-2 bg-accent-purple rounded-full ml-2 flex-shrink-0 mt-1" />
                  )}
                </div>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                  {message.message}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar size={12} />
                  <span className="truncate">{formatDate(message.created_at)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detalle del mensaje */}
        <div className={`lg:col-span-2 ${!selectedMessage ? 'hidden lg:block' : ''}`}>
          {selectedMessage ? (
            <>
              {/* Botón volver en móvil */}
              <button
                onClick={() => setSelectedMessage(null)}
                className="lg:hidden mb-4 text-accent-purple hover:text-accent-purple/80 flex items-center gap-2 text-sm"
              >
                ← Volver a la lista
              </button>
            <div className="bg-white dark:bg-[#1E1E2A] rounded-xl p-4 md:p-6 border border-gray-200 dark:border-white/10">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4 md:mb-6">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl md:text-2xl font-bold mb-2 break-words text-gray-900 dark:text-white">{selectedMessage.name}</h2>
                  <p className="text-sm md:text-base text-accent-purple break-all">{selectedMessage.email}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    <Calendar size={14} />
                    {formatDate(selectedMessage.created_at)}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkAsRead(selectedMessage.id, selectedMessage.read)}
                    className={selectedMessage.read ? 'text-yellow-400 hover:text-yellow-400' : 'text-green-400 hover:text-green-400'}
                    title={selectedMessage.read ? 'Marcar como no leído' : 'Marcar como leído'}
                  >
                    {selectedMessage.read ? <EyeOff className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="text-red-400 hover:text-red-400 hover:bg-red-500/10"
                    title="Eliminar mensaje"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Mensaje</h3>
                  <div className="bg-gray-50 dark:bg-[#0C0D0D] rounded-lg p-3 md:p-4 border border-gray-200 dark:border-white/10">
                    <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed break-words">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
                  <Button
                    onClick={() => window.open(`mailto:${selectedMessage.email}`, '_blank')}
                    className="bg-accent-purple hover:bg-accent-purple/90 w-full md:w-auto"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Responder por Email
                  </Button>
                </div>
              </div>
            </div>
            </>
          ) : (
            <div className="bg-white dark:bg-[#1E1E2A] rounded-xl p-8 md:p-12 text-center border border-gray-200 dark:border-white/10">
              <Mail className="w-12 h-12 md:w-16 md:h-16 text-gray-500 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">Selecciona un mensaje para ver los detalles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Requests

