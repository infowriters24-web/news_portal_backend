import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { HeadingDropdownMenu } from './tiptap-ui/heading-dropdown-menu'
import {
  FaBold, FaItalic, FaStrikethrough, FaListUl, FaListOl,
  FaQuoteLeft, FaUndo, FaRedo, FaMinus
} from 'react-icons/fa'
import { useEffect } from 'react'

const ToolbarButton = ({ onClick, active, disabled, title, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 rounded text-sm transition-all duration-150
      ${ active
        ? 'bg-[#F7941D] text-white'
        : 'text-gray-600 hover:bg-gray-200'
      }
      disabled:opacity-30 disabled:cursor-not-allowed`}
  >
    {children}
  </button>
)

const Divider = () => <div className="w-px h-5 bg-gray-300 mx-1" />

const EditorProps = ({ onChange, initialContent = '' }) => {  // ✅ initialContent prop যোগ
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,  // ✅ initial content set
    onUpdate: ({ editor }) => {
      if (onChange) onChange(editor.getHTML())
    },
  })

  // ✅ initialContent পরে আসলে (API fetch এর পরে) editor update করো
  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent)
    }
  }, [initialContent, editor])

  if (!editor) return null

  return (
    <div className="border border-gray-300 rounded-lg focus-within:border-[#F7941D] focus-within:ring-2 focus-within:ring-[#F7941D]/20 transition-all duration-200">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        {/* Heading Dropdown */}
        <HeadingDropdownMenu
          editor={editor}
          levels={[1, 2, 3, 4, 5, 6]}
          hideWhenUnavailable={true}
        />

        <Divider />

        {/* Bold */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          title="Bold"
        >
          <FaBold />
        </ToolbarButton>

        {/* Italic */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <FaItalic />
        </ToolbarButton>

        {/* Strikethrough */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          title="Strikethrough"
        >
          <FaStrikethrough />
        </ToolbarButton>

        <Divider />

        {/* Bullet List */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <FaListUl />
        </ToolbarButton>

        {/* Ordered List */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Ordered List"
        >
          <FaListOl />
        </ToolbarButton>

        <Divider />

        {/* Blockquote */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Blockquote"
        >
          <FaQuoteLeft />
        </ToolbarButton>

        {/* Horizontal Rule */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <FaMinus />
        </ToolbarButton>

        <Divider />

        {/* Undo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          title="Undo"
        >
          <FaUndo />
        </ToolbarButton>

        {/* Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          title="Redo"
        >
          <FaRedo />
        </ToolbarButton>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="tiptap-editor-wrapper"
      />
    </div>
  )
}

export default EditorProps
