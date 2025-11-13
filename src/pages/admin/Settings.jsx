import React from 'react'
import { Settings as SettingsIcon, Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { Button } from '@/components/ui/button'

const Settings = () => {
  const { theme, changeTheme, THEMES } = useTheme()

  const themeOptions = [
    {
      value: THEMES.SYSTEM,
      label: 'Sistema',
      icon: Monitor,
      description: 'Usar la preferencia del sistema',
    },
    {
      value: THEMES.LIGHT,
      label: 'Claro',
      icon: Sun,
      description: 'Tema claro',
    },
    {
      value: THEMES.DARK,
      label: 'Oscuro',
      icon: Moon,
      description: 'Tema oscuro',
    },
  ]

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-4xl font-bold mb-2">
          <span className="text-accent-purple">Configuración</span>
        </h1>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
          Personaliza la apariencia del panel de administración
        </p>
      </div>

      {/* Theme Selection */}
      <div className="bg-white dark:bg-[#1E1E2A] rounded-xl p-6 border border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon className="h-5 w-5 text-accent-purple" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Tema
          </h2>
        </div>

        <div className="space-y-3">
          {themeOptions.map((option) => {
            const Icon = option.icon
            const isSelected = theme === option.value

            return (
              <button
                key={option.value}
                onClick={() => changeTheme(option.value)}
                className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-accent-purple bg-accent-purple/10 dark:bg-accent-purple/20'
                    : 'border-gray-200 dark:border-white/10 hover:border-accent-purple/50 bg-transparent hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    isSelected
                      ? 'bg-accent-purple text-white'
                      : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 text-left">
                  <div
                    className={`font-semibold ${
                      isSelected
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {option.label}
                  </div>
                  <div
                    className={`text-sm ${
                      isSelected
                        ? 'text-gray-500 dark:text-gray-400'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    {option.description}
                  </div>
                </div>
                {isSelected && (
                  <div className="h-3 w-3 rounded-full bg-accent-purple" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Settings

