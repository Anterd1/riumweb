import React from 'react'
import { Button } from '@/components/ui/button'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorCount: 0 }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo)
    
    // Incrementar contador de errores
    this.setState(prevState => ({
      errorCount: prevState.errorCount + 1
    }))
  }

  resetError = () => {
    this.setState({ hasError: false, error: null })
    // Detectar idioma desde localStorage o URL
    const savedLang = localStorage.getItem('i18nextLng') || 'es';
    const lang = savedLang.startsWith('en') ? 'en' : 'es';
    window.location.href = `/${lang}`
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0C0D0D] text-white flex items-center justify-center p-6">
          <div className="max-w-md text-center">
            <h1 className="text-4xl font-bold mb-4 text-red-400">Oops! Algo salió mal</h1>
            <p className="text-gray-400 mb-6">
              Ha ocurrido un error inesperado. Por favor, recarga la página.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                <summary className="cursor-pointer text-red-400 mb-2">Detalles del error (solo en desarrollo)</summary>
                <pre className="text-xs text-gray-400 overflow-auto max-h-96">
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            <Button
              onClick={this.resetError}
              className="bg-accent-purple hover:bg-accent-purple/90"
            >
              Volver al inicio
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

