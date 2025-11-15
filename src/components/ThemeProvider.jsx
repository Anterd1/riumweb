import React, { useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

const ThemeProvider = ({ children }) => {
  const { theme } = useTheme();

  // Este componente solo inicializa el tema, el hook useTheme ya maneja todo
  // pero lo mantenemos para asegurar que el tema se aplique correctamente
  useEffect(() => {
    // El hook useTheme ya maneja la aplicación del tema
    // Este efecto solo asegura que se ejecute cuando el componente se monta
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider;

