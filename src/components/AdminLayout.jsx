import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { FileText, Mail, LogOut, Menu, X, Newspaper, Users } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/toaster'
import SEO from '@/components/SEO'

const AdminLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/admin/login')
  }

  const menuItems = [
    {
      icon: FileText,
      label: 'Artículos',
      path: '/admin',
      exact: true,
    },
    {
      icon: Newspaper,
      label: 'Noticias',
      path: '/admin/news',
    },
    {
      icon: Mail,
      label: 'Solicitudes',
      path: '/admin/requests',
    },
    {
      icon: Users,
      label: 'Usuarios',
      path: '/admin/users',
    },
  ]

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="admin-page min-h-screen bg-[#0C0D0D] text-white">
      <SEO
        title="Panel de Administración"
        description="Panel de administración del blog de rium"
        url="https://rium.com.mx/admin"
      />
      <Toaster />
      
      <div className="flex h-screen relative">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#1E1E2A] border-r border-white/10 flex flex-col transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          {/* Logo/Header */}
          <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between">
            <h1 className="text-lg md:text-xl font-bold">
              <span className="text-accent-purple">rium</span> Admin
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path, item.exact)
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? 'bg-accent-purple/20 text-accent-purple border border-accent-purple/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Salir
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto w-full">
          {/* Mobile Header */}
          <div className="md:hidden sticky top-0 z-30 bg-[#1E1E2A] border-b border-white/10 p-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-400 hover:text-white"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-bold">
              <span className="text-accent-purple">rium</span> Admin
            </h1>
            <div className="w-6" /> {/* Spacer para centrar */}
          </div>

          <div className="p-3 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout

