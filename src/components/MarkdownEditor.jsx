import React, { useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { 
  Bold, 
  Italic, 
  Heading, 
  List, 
  ListOrdered, 
  Link, 
  Image,
  Code,
  Quote,
  Eye,
  EyeOff
} from 'lucide-react'

const MarkdownEditor = ({ value, onChange, placeholder = 'Escribe tu contenido...' }) => {
  const [showPreview, setShowPreview] = useState(false)
  const textareaRef = useRef(null)

  const insertMarkdown = (before, after = '', placeholder = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const textToInsert = selectedText || placeholder

    const newText = value.substring(0, start) + before + textToInsert + after + value.substring(end)
    onChange({ target: { value: newText } })

    // Restaurar el foco y selección
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + textToInsert.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const toolbarButtons = [
    {
      icon: Bold,
      label: 'Negrita',
      action: () => insertMarkdown('**', '**', 'texto en negrita'),
    },
    {
      icon: Italic,
      label: 'Cursiva',
      action: () => insertMarkdown('*', '*', 'texto en cursiva'),
    },
    {
      icon: Heading,
      label: 'Título',
      action: () => insertMarkdown('## ', '', 'Título'),
    },
    {
      icon: List,
      label: 'Lista',
      action: () => insertMarkdown('- ', '', 'Elemento de lista'),
    },
    {
      icon: ListOrdered,
      label: 'Lista numerada',
      action: () => insertMarkdown('1. ', '', 'Elemento numerado'),
    },
    {
      icon: Link,
      label: 'Enlace',
      action: () => insertMarkdown('[', '](https://ejemplo.com)', 'texto del enlace'),
    },
    {
      icon: Image,
      label: 'Imagen',
      action: () => insertMarkdown('![', '](https://ejemplo.com/imagen.jpg)', 'descripción'),
    },
    {
      icon: Code,
      label: 'Código',
      action: () => insertMarkdown('`', '`', 'código'),
    },
    {
      icon: Quote,
      label: 'Cita',
      action: () => insertMarkdown('> ', '', 'Cita'),
    },
  ]

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-[#0C0D0D] border border-white/10 rounded-t-lg flex-wrap">
        {toolbarButtons.map((button, idx) => (
          <button
            key={idx}
            type="button"
            onClick={button.action}
            title={button.label}
            className="p-2 hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white"
          >
            <button.icon size={18} />
          </button>
        ))}
        
        <div className="ml-auto">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-3 py-2 bg-accent-purple/20 hover:bg-accent-purple/30 rounded text-accent-purple transition-colors"
          >
            {showPreview ? (
              <>
                <EyeOff size={18} />
                <span className="text-sm">Ocultar Vista Previa</span>
              </>
            ) : (
              <>
                <Eye size={18} />
                <span className="text-sm">Mostrar Vista Previa</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor y Vista Previa */}
      <div className="grid gap-4" style={{ gridTemplateColumns: showPreview ? '1fr 1fr' : '1fr' }}>
        {/* Editor */}
        <div>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={15}
            className="w-full px-4 py-3 bg-[#0C0D0D] border border-white/10 rounded-b-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-purple font-mono text-sm"
          />
          
          {/* Ayuda rápida */}
          <div className="mt-2 p-3 bg-[#0C0D0D] border border-white/10 rounded-lg text-xs text-gray-400 space-y-1">
            <p className="font-semibold text-gray-300 mb-2">💡 Guía rápida de Markdown:</p>
            <p><code className="bg-white/10 px-1 rounded">**negrita**</code> → <strong>negrita</strong></p>
            <p><code className="bg-white/10 px-1 rounded">*cursiva*</code> → <em>cursiva</em></p>
            <p><code className="bg-white/10 px-1 rounded">## Título</code> → Título de nivel 2</p>
            <p><code className="bg-white/10 px-1 rounded">- lista</code> → Lista con viñetas</p>
            <p><code className="bg-white/10 px-1 rounded">[texto](url)</code> → Enlace</p>
          </div>
        </div>

        {/* Vista Previa */}
        {showPreview && (
          <div className="p-4 bg-[#1E1E2A] border border-white/10 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <Eye size={16} />
              Vista Previa
            </h3>
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4 text-white" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mb-3 text-white" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-xl font-bold mb-2 text-white" {...props} />,
                  p: ({ node, ...props }) => <p className="mb-3 text-gray-300 leading-relaxed" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-3 text-gray-300" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-3 text-gray-300" {...props} />,
                  li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                  a: ({ node, ...props }) => <a className="text-accent-purple hover:underline" {...props} />,
                  code: ({ node, inline, ...props }) => 
                    inline ? 
                      <code className="bg-white/10 px-1 py-0.5 rounded text-accent-purple text-sm" {...props} /> :
                      <code className="block bg-[#0C0D0D] p-3 rounded-lg text-sm overflow-x-auto" {...props} />,
                  blockquote: ({ node, ...props }) => 
                    <blockquote className="border-l-4 border-accent-purple pl-4 italic text-gray-400 my-3" {...props} />,
                  img: ({ node, ...props }) => <img className="rounded-lg my-3" {...props} />,
                  strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
                  em: ({ node, ...props }) => <em className="italic" {...props} />,
                }}
              >
                {value || '*No hay contenido para mostrar*'}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MarkdownEditor

