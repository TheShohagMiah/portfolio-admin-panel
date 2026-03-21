import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CharacterCount from "@tiptap/extension-character-count";
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiList,
  FiCode,
  FiLink,
  FiLink2,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiAlignJustify,
} from "react-icons/fi";
import {
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuListOrdered,
  LuSeparatorHorizontal,
  LuUndo2,
  LuRedo2,
  LuCornerDownLeft,
  LuStrikethrough,
  LuHighlighter,
  LuSubscript,
  LuSuperscript,
  LuListTodo,
  LuRemoveFormatting,
  LuQuote,
} from "react-icons/lu";

// ═══════════════════════════════════════════════════════════════
//  TOOLBAR BUTTON
// ═══════════════════════════════════════════════════════════════
const Btn = ({ onClick, active, title, children, danger }) => (
  <button
    type="button"
    onMouseDown={(e) => {
      e.preventDefault();
      onClick();
    }}
    title={title}
    className={`p-1.5 rounded-lg text-sm transition-all duration-150 shrink-0
      ${
        danger
          ? "text-destructive/60 hover:text-destructive hover:bg-destructive/10"
          : active
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
      }`}
  >
    {children}
  </button>
);

const Divider = () => (
  <div className="w-px h-4 bg-border self-center mx-0.5 shrink-0" />
);

// ── Color Swatches ──────────────────────────────────────────────
const COLOR_SWATCHES = [
  "#ffffff", "#a1a1aa", "#f87171", "#fb923c",
  "#facc15", "#4ade80", "#38bdf8", "#818cf8", "#e879f9",
];

// ═══════════════════════════════════════════════════════════════
//  TOOLBAR
// ═══════════════════════════════════════════════════════════════
const EditorToolbar = ({ editor }) => {
  if (!editor) return null;

  const setLink = () => {
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url, target: "_blank" }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-2 py-2 border-b border-border bg-secondary/40 rounded-t-2xl">
      {/* ── History ───────────────────────────── */}
      <Btn onClick={() => editor.chain().focus().undo().run()} active={false} title="Undo (Ctrl+Z)">
        <LuUndo2 size={13} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().redo().run()} active={false} title="Redo (Ctrl+Y)">
        <LuRedo2 size={13} />
      </Btn>

      <Divider />

      {/* ── Headings ──────────────────────────── */}
      <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Heading 1">
        <LuHeading1 size={15} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">
        <LuHeading2 size={15} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3">
        <LuHeading3 size={15} />
      </Btn>

      <Divider />

      {/* ── Text Formatting ───────────────────── */}
      <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold (Ctrl+B)">
        <FiBold size={13} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic (Ctrl+I)">
        <FiItalic size={13} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline (Ctrl+U)">
        <FiUnderline size={13} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
        <LuStrikethrough size={13} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive("highlight")} title="Highlight">
        <LuHighlighter size={13} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Inline Code">
        <FiCode size={13} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleSubscript().run()} active={editor.isActive("subscript")} title="Subscript">
        <LuSubscript size={13} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleSuperscript().run()} active={editor.isActive("superscript")} title="Superscript">
        <LuSuperscript size={13} />
      </Btn>

      <Divider />

      {/* ── Text Color ────────────────────────── */}
      <div className="flex items-center gap-0.5">
        {COLOR_SWATCHES.map((color) => (
          <button
            key={color}
            type="button"
            title={`Color: ${color}`}
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().setColor(color).run();
            }}
            className="w-4 h-4 rounded-full border border-border/50 hover:scale-125 transition-transform shrink-0"
            style={{ backgroundColor: color }}
          />
        ))}
        <Btn onClick={() => editor.chain().focus().unsetColor().run()} active={false} title="Reset Color" danger>
          <LuRemoveFormatting size={12} />
        </Btn>
      </div>

      <Divider />

      {/* ── Alignment ─────────────────────────── */}
      <Btn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align Left">
        <FiAlignLeft size={13} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align Center">
        <FiAlignCenter size={13} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align Right">
        <FiAlignRight size={13} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} title="Justify">
        <FiAlignJustify size={13} />
      </Btn>

      <Divider />

      {/* ── Lists ─────────────────────────────── */}
      <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List">
        <FiList size={13} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered List">
        <LuListOrdered size={13} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive("taskList")} title="Task List">
        <LuListTodo size={13} />
      </Btn>

      <Divider />

      {/* ── Blocks ────────────────────────────── */}
      <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote">
        <LuQuote size={13} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code Block">
        <FiCode size={13} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} active={false} title="Horizontal Divider">
        <LuSeparatorHorizontal size={13} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().setHardBreak().run()} active={false} title="Line Break (Shift+Enter)">
        <LuCornerDownLeft size={13} />
      </Btn>

      <Divider />

      {/* ── Link ──────────────────────────────── */}
      <Btn onClick={setLink} active={editor.isActive("link")} title="Insert Link">
        <FiLink size={13} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().unsetLink().run()} active={false} title="Remove Link" danger>
        <FiLink2 size={13} />
      </Btn>

      <Divider />

      {/* ── Clear Formatting ──────────────────── */}
      <Btn
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        active={false}
        title="Clear All Formatting"
        danger
      >
        <LuRemoveFormatting size={13} />
      </Btn>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
const RichTextEditor = ({
  value,
  onChange,
  hasError = false,
  placeholder = "Start writing here...",
  minHeight = "180px",
  maxChars,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Subscript,
      Superscript,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-primary underline cursor-pointer" },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      CharacterCount.configure({ limit: maxChars }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        // ✅ Removed prose/prose-sm/prose-invert — they were resetting
        //    the .ProseMirror spacing rules in index.css
        class: "focus:outline-none px-4 py-3",
        style: `min-height: ${minHeight}`,
      },
    },
  });

  // ✅ Sync content when fetched data arrives (edit mode)
  useEffect(() => {
    if (editor && value && editor.isEmpty) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const charCount = editor?.storage.characterCount.characters() ?? 0;
  const wordCount = editor?.storage.characterCount.words() ?? 0;
  const isOverLimit = maxChars && charCount >= maxChars;

  return (
    <div
      className={`rounded-2xl border overflow-hidden transition-all duration-200
        focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary
        ${hasError ? "border-destructive/50" : "border-border hover:border-primary/30"}`}
    >
      {/* Toolbar */}
      <EditorToolbar editor={editor} />

      {/* Editor area */}
      <div className="bg-secondary text-foreground text-sm">
        <EditorContent editor={editor} />
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-border bg-secondary/30 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[10px] text-muted-foreground/40 font-mono">
            <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[9px]">Enter</kbd>
            {" "}paragraph
          </span>
          <span className="text-muted-foreground/20 text-[10px]">·</span>
          <span className="text-[10px] text-muted-foreground/40 font-mono">
            <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[9px]">Shift+Enter</kbd>
            {" "}line break
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-muted-foreground/40">
            {wordCount} words
          </span>
          {maxChars && (
            <span className={`text-[10px] font-mono ${isOverLimit ? "text-destructive" : "text-muted-foreground/40"}`}>
              {charCount}/{maxChars}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
