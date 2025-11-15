import { useState, useEffect } from 'react'

const THEME_STORAGE_KEY = 'app-theme'
const THEMES = {
  SYSTEM: 'system',
  LIGHT: 'light',
  DARK: 'dark',
}

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    // Obtener tema guardado o usar 'system' por defecto
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
      return savedTheme || THEMES.SYSTEM
    }
    return THEMES.SYSTEM
  })

  const [resolvedTheme, setResolvedTheme] = useState(() => {
    // Determinar el tema real basado en la preferencia del sistema
    if (typeof window === 'undefined') return THEMES.LIGHT
    
    const currentTheme = localStorage.getItem(THEME_STORAGE_KEY) || THEMES.SYSTEM
    if (currentTheme === THEMES.SYSTEM) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? THEMES.DARK
        : THEMES.LIGHT
    }
    return currentTheme
  })

  useEffect(() => {
    // Actualizar el tema resuelto cuando cambia el tema seleccionado
    if (typeof window === 'undefined') return
    
    const root = document.documentElement
    
    if (theme === THEMES.SYSTEM) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e) => {
        const newResolved = e.matches ? THEMES.DARK : THEMES.LIGHT
        setResolvedTheme(newResolved)
        // Aplicar inmediatamente
        if (newResolved === THEMES.DARK) {
          root.classList.add('dark')
        } else {
          root.classList.remove('dark')
        }
      }
      
      // Establecer el tema inicial
      const initialResolved = mediaQuery.matches ? THEMES.DARK : THEMES.LIGHT
      setResolvedTheme(initialResolved)
      
      // Aplicar inmediatamente
      if (initialResolved === THEMES.DARK) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
      
      // Escuchar cambios en la preferencia del sistema
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      // Tema manual: aplicar inmediatamente
      setResolvedTheme(theme)
      if (theme === THEMES.DARK) {
        root.classList.add('dark')
      } else if (theme === THEMES.LIGHT) {
        root.classList.remove('dark')
      }
    }
  }, [theme])

  const changeTheme = (newTheme) => {
    console.log('🎨 Cambiando tema a:', newTheme)
    setTheme(newTheme)
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    
    // Aplicar inmediatamente sin esperar al useEffect
    const root = document.documentElement
    if (newTheme === THEMES.DARK) {
      console.log('➕ Agregando clase dark')
      root.classList.add('dark')
    } else if (newTheme === THEMES.LIGHT) {
      console.log('➖ Removiendo clase dark')
      root.classList.remove('dark')
    } else {
      // SYSTEM: detectar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
  }

  return {
    theme,
    resolvedTheme,
    changeTheme,
    THEMES,
  }
}

