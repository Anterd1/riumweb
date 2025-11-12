import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { 
  Bold, 
  Italic, 
  Heading1,
  Heading2,
  Heading3,
  List, 
  ListOrdered, 
  Link as LinkIcon,
  Image as ImageIcon,
  Quote,
  Undo,
  Redo,
  Code
} from 'lucide-react'

const WysiwygEditor = ({ value, onChange, placeholder = 'Escribe tu contenido aquí...' }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-accent-purple hover:text-accent-purple/80 underline transition-colors',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-lg max-w-none focus:outline-none min-h-[400px] px-4 py-3',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange({ target: { value: html } })
    },
  })

  // Actualizar el contenido del editor cuando value cambie
  useEffect(() => {
    if (!editor) return
    
    if (value === undefined || value === null) {
      return
    }

    const currentContent = editor.getHTML()
    const normalizedValue = value.trim()
    const normalizedCurrent = currentContent.trim()
    
    // Solo actualizar si el contenido es diferente y value no está vacío
    if (normalizedValue && normalizedValue !== normalizedCurrent) {
      // Si el contenido parece ser Markdown (contiene sintaxis markdown pero no tags HTML)
      const isMarkdown = normalizedValue.includes('**') || 
                         normalizedValue.includes('##') || 
                         normalizedValue.includes('[') ||
                         (normalizedValue.includes('\n') && !normalizedValue.includes('<'))
      
      if (isMarkdown && !normalizedValue.includes('<')) {
        // Convertir Markdown básico a HTML
        let html = normalizedValue
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/## (.*?)$/gm, '<h2>$1</h2>')
          .replace(/### (.*?)$/gm, '<h3>$1</h3>')
          .replace(/^\- (.*?)$/gm, '<li>$1</li>')
          .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
          .replace(/\n/g, '<br>')
        
        editor.commands.setContent(html)
      } else {
        editor.commands.setContent(normalizedValue)
      }
    } else if (!normalizedValue && normalizedCurrent) {
      // Si value está vacío pero el editor tiene contenido, limpiar
      editor.commands.setContent('')
    }
  }, [editor, value])

  if (!editor) {
    return null
  }

  const addImage = () => {
    const url = window.prompt('Ingresa la URL de la imagen:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('Ingresa la URL:', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const toolbarButtons = [
    {
      icon: Bold,
      label: 'Negrita',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
    },
    {
      icon: Italic,
      label: 'Cursiva',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
    },
    {
      icon: Heading1,
      label: 'Título 1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
    },
    {
      icon: Heading2,
      label: 'Título 2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
    },
    {
      icon: Heading3,
      label: 'Título 3',
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive('heading', { level: 3 }),
    },
    {
      icon: List,
      label: 'Lista con viñetas',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
    },
    {
      icon: ListOrdered,
      label: 'Lista numerada',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
    },
    {
      icon: Quote,
      label: 'Cita',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
    },
    {
      icon: Code,
      label: 'Código',
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive('code'),
    },
    {
      icon: LinkIcon,
      label: 'Enlace',
      action: addLink,
      isActive: editor.isActive('link'),
    },
    {
      icon: ImageIcon,
      label: 'Imagen',
      action: addImage,
    },
    {
      icon: Undo,
      label: 'Deshacer',
      action: () => editor.chain().focus().undo().run(),
      disabled: !editor.can().undo(),
    },
    {
      icon: Redo,
      label: 'Rehacer',
      action: () => editor.chain().focus().redo().run(),
      disabled: !editor.can().redo(),
    },
  ]

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-[#0C0D0D] border border-white/10 rounded-t-lg flex-wrap">
        {toolbarButtons.map((button, idx) => {
          const ButtonIcon = button.icon
          return (
            <button
              key={idx}
              type="button"
              onClick={button.action}
              disabled={button.disabled}
              title={button.label}
              className={`p-2 rounded transition-colors ${
                button.isActive
                  ? 'bg-accent-purple/30 text-accent-purple'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              } ${button.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ButtonIcon size={18} />
            </button>
          )
        })}
      </div>

      {/* Editor - Con los mismos estilos que la página publicada */}
      <div className="bg-[#0C0D0D] border border-white/10 rounded-b-lg overflow-hidden">
        <div className="prose prose-invert prose-lg max-w-none">
          <style>{`
            .ProseMirror {
              min-height: 400px;
              padding: 1.5rem;
              color: #d1d5db;
              line-height: 1.75;
            }
            
            .ProseMirror h1 {
              font-size: 2.25rem;
              font-weight: 700;
              margin-bottom: 1.5rem;
              margin-top: 0;
              color: #ffffff;
            }
            
            .ProseMirror h2 {
              font-size: 1.875rem;
              font-weight: 700;
              margin-bottom: 1.25rem;
              margin-top: 2rem;
              color: #ffffff;
            }
            
            .ProseMirror h3 {
              font-size: 1.5rem;
              font-weight: 700;
              margin-bottom: 1rem;
              margin-top: 1.5rem;
              color: #ffffff;
            }
            
            .ProseMirror p {
              margin-bottom: 1rem;
              color: #d1d5db;
              line-height: 1.75;
              font-size: 1.125rem;
            }
            
            .ProseMirror ul, .ProseMirror ol {
              margin-bottom: 1rem;
              padding-left: 1.5rem;
              color: #d1d5db;
            }
            
            .ProseMirror ul {
              list-style-type: disc;
            }
            
            .ProseMirror ol {
              list-style-type: decimal;
            }
            
            .ProseMirror li {
              margin-bottom: 0.5rem;
              line-height: 1.75;
            }
            
            .ProseMirror a {
              color: #a855f7;
              text-decoration: underline;
              transition: color 0.2s;
            }
            
            .ProseMirror a:hover {
              color: rgba(168, 85, 247, 0.8);
            }
            
            .ProseMirror blockquote {
              border-left: 4px solid #a855f7;
              padding-left: 1.5rem;
              padding-top: 0.5rem;
              padding-bottom: 0.5rem;
              font-style: italic;
              color: #9ca3af;
              margin: 1.5rem 0;
              background-color: rgba(255, 255, 255, 0.05);
              border-radius: 0 0.5rem 0.5rem 0;
            }
            
            .ProseMirror img {
              border-radius: 0.5rem;
              margin: 1.5rem 0;
              width: 100%;
              height: auto;
            }
            
            .ProseMirror code {
              background-color: rgba(255, 255, 255, 0.1);
              padding: 0.25rem 0.5rem;
              border-radius: 0.25rem;
              color: #a855f7;
              font-size: 1rem;
            }
            
            .ProseMirror pre {
              background-color: #0C0D0D;
              padding: 1rem;
              border-radius: 0.5rem;
              overflow-x: auto;
              margin: 1rem 0;
              border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .ProseMirror pre code {
              background-color: transparent;
              padding: 0;
              color: inherit;
            }
            
            .ProseMirror strong {
              font-weight: 700;
              color: #ffffff;
            }
            
            .ProseMirror em {
              font-style: italic;
              color: #e5e7eb;
            }
            
            .ProseMirror hr {
              margin: 2rem 0;
              border-color: rgba(255, 255, 255, 0.2);
            }
            
            .ProseMirror table {
              width: 100%;
              margin: 1.5rem 0;
              border-collapse: collapse;
            }
            
            .ProseMirror th {
              border: 1px solid rgba(255, 255, 255, 0.2);
              padding: 0.5rem 1rem;
              background-color: rgba(255, 255, 255, 0.05);
              text-align: left;
            }
            
            .ProseMirror td {
              border: 1px solid rgba(255, 255, 255, 0.2);
              padding: 0.5rem 1rem;
            }
            
            .ProseMirror p.is-editor-empty:first-child::before {
              content: attr(data-placeholder);
              float: left;
              color: #6b7280;
              pointer-events: none;
              height: 0;
            }
          `}</style>
          <EditorContent editor={editor} />
        </div>
      </div>
      
      {/* Info */}
      <div className="text-xs text-gray-500 p-2">
        💡 El contenido se guarda en HTML y se mostrará exactamente como lo ves aquí en la página publicada
      </div>
    </div>
  )
}

export default WysiwygEditor

