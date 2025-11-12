import React from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { FileText, Mail, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/toaster'
import SEO from '@/components/SEO'

const AdminLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { signOut } = useAuth()

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
      icon: Mail,
      label: 'Solicitudes',
      path: '/admin/requests',
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
      
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-[#1E1E2A] border-r border-white/10 flex flex-col">
          {/* Logo/Header */}
          <div className="p-6 border-b border-white/10">
            <h1 className="text-xl font-bold">
              <span className="text-accent-purple">rium</span> Admin
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path, item.exact)
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
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
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout

