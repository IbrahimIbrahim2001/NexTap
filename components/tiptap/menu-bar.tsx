/* eslint-disable react-hooks/static-components */
"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useEditorState, type Editor } from "@tiptap/react"
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    Bold,
    Code,
    Heading1,
    Heading2,
    Heading3,
    Highlighter,
    Italic,
    List,
    ListOrdered,
    Minus,
    Pilcrow,
    Redo,
    Strikethrough,
    Underline,
    Undo
} from "lucide-react"

export default function MenuBar({ editor }: { editor: Editor | null }) {
    const editorState = useEditorState({
        editor,
        selector: (ctx) => {
            if (!ctx.editor) {
                return {
                    isBold: false,
                    canBold: false,
                    isItalic: false,
                    canItalic: false,
                    isStrike: false,
                    canStrike: false,
                    isUnderline: false,
                    canUnderline: false,
                    isCode: false,
                    canCode: false,
                    isHighlight: false,
                    canHighlight: false,
                    isParagraph: false,
                    isHeading1: false,
                    isHeading2: false,
                    isHeading3: false,
                    isBulletList: false,
                    isOrderedList: false,
                    isBlockquote: false,
                    isAlignLeft: false,
                    isAlignCenter: false,
                    isAlignRight: false,
                    isAlignJustify: false,
                    canUndo: false,
                    canRedo: false,
                    canClearMarks: false,
                    canClearNodes: false,
                }
            }

            return {
                // Text formatting
                isBold: ctx.editor.isActive('bold'),
                canBold: ctx.editor.can().chain().focus().toggleBold().run(),
                isItalic: ctx.editor.isActive('italic'),
                canItalic: ctx.editor.can().chain().focus().toggleItalic().run(),
                isStrike: ctx.editor.isActive('strike'),
                canStrike: ctx.editor.can().chain().focus().toggleStrike().run(),
                isUnderline: ctx.editor.isActive('underline'),
                canUnderline: ctx.editor.can().chain().focus().toggleUnderline().run(),
                isCode: ctx.editor.isActive('code'),
                canCode: ctx.editor.can().chain().focus().toggleCode().run(),
                isHighlight: ctx.editor.isActive('highlight'),
                canHighlight: ctx.editor.can().chain().focus().toggleHighlight().run(),

                // Headings and paragraphs
                isParagraph: ctx.editor.isActive('paragraph'),
                isHeading1: ctx.editor.isActive('heading', { level: 1 }),
                isHeading2: ctx.editor.isActive('heading', { level: 2 }),
                isHeading3: ctx.editor.isActive('heading', { level: 3 }),

                // Lists
                isBulletList: ctx.editor.isActive('bulletList'),
                isOrderedList: ctx.editor.isActive('orderedList'),

                // Block elements
                isBlockquote: ctx.editor.isActive('blockquote'),

                // Text alignment
                isAlignLeft: ctx.editor.isActive({ textAlign: 'left' }),
                isAlignCenter: ctx.editor.isActive({ textAlign: 'center' }),
                isAlignRight: ctx.editor.isActive({ textAlign: 'right' }),
                isAlignJustify: ctx.editor.isActive({ textAlign: 'justify' }),

                // History
                canUndo: ctx.editor.can().chain().focus().undo().run(),
                canRedo: ctx.editor.can().chain().focus().redo().run(),

                // Clear formatting
                canClearMarks: ctx.editor.can().chain().focus().unsetAllMarks().run(),
                canClearNodes: ctx.editor.can().chain().focus().clearNodes().run(),
            }
        },
    })

    if (!editor) {
        return null
    }
    const HistoryButtons = () => (
        <div className="flex items-center gap-1">
            <Button
                variant="outline"
                size="sm"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editorState?.canUndo}
                title="Undo"
                className="h-8 w-8 p-0"
            >
                <Undo className="size-4" />
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editorState?.canRedo}
                title="Redo"
                className="h-8 w-8 p-0"
            >
                <Redo className="size-4" />
            </Button>
        </div>
    )
    const HeadingButtons = () => {
        const currentHeading =
            editorState?.isHeading1 ? 'heading1' :
                editorState?.isHeading2 ? 'heading2' :
                    editorState?.isHeading3 ? 'heading3' : 'paragraph'
        return (
            <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                value={currentHeading}
                onValueChange={(value) => {
                    if (!value) return;
                    if (value === 'paragraph') {
                        editor.chain().focus().setParagraph().run()
                    } else if (value === 'heading1') {
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    } else if (value === 'heading2') {
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    } else if (value === 'heading3') {
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                }}
            >
                <ToggleGroupItem
                    value="paragraph"
                    aria-label="Paragraph"
                    title="Paragraph"
                >
                    <Pilcrow className="size-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                    value="heading1"
                    aria-label="Heading 1"
                    title="Heading 1"
                >
                    <Heading1 className="size-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                    value="heading2"
                    aria-label="Heading 2"
                    title="Heading 2"
                >
                    <Heading2 className="size-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                    value="heading3"
                    aria-label="Heading 3"
                    title="Heading 3"
                >
                    <Heading3 className="size-4" />
                </ToggleGroupItem>
            </ToggleGroup>
        )
    }
    const TextFormatButtons = () => (
        <ToggleGroup type="multiple" variant="outline" size="sm">
            <ToggleGroupItem
                value="bold"
                aria-label="Bold"
                title="Bold"
                onClick={() => editor.chain().focus().toggleBold().run()}
                data-state={editorState?.isBold ? 'on' : 'off'}
                disabled={!editorState?.canBold}
            >
                <Bold className={`size-4 ${editorState?.isBold ? 'scale-110' : 'scale-100'}`} />
            </ToggleGroupItem>
            <ToggleGroupItem
                value="italic"
                aria-label="Italic"
                title="Italic"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                data-state={editorState?.isItalic ? 'on' : 'off'}
                disabled={!editorState?.canItalic}
            >
                <Italic className={`size-4 ${editorState?.isItalic ? 'scale-110' : 'scale-100'}`} />
            </ToggleGroupItem>
            <ToggleGroupItem
                value="underline"
                aria-label="Underline"
                title="Underline"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                data-state={editorState?.isUnderline ? 'on' : 'off'}
                disabled={!editorState?.canUnderline}
            >
                <Underline className={`size-4 ${editorState?.isUnderline ? 'scale-110' : 'scale-100'}`} />
            </ToggleGroupItem>
            <ToggleGroupItem
                value="strike"
                aria-label="Strikethrough"
                title="Strikethrough"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                data-state={editorState?.isStrike ? 'on' : 'off'}
                disabled={!editorState?.canStrike}
            >
                <Strikethrough className={`size-4 ${editorState?.isStrike ? 'scale-110' : 'scale-100'}`} />
            </ToggleGroupItem>
            <ToggleGroupItem
                value="code"
                aria-label="Inline Code"
                title="Inline Code"
                onClick={() => editor.chain().focus().toggleCode().run()}
                data-state={editorState?.isCode ? 'on' : 'off'}
                disabled={!editorState?.canCode}
            >
                <Code className={`size-4 ${editorState?.isCode ? 'scale-110' : 'scale-100'}`} />
            </ToggleGroupItem>
            <ToggleGroupItem
                value="highlight"
                aria-label="Highlight"
                title="Highlight"
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                data-state={editorState?.isHighlight ? 'on' : 'off'}
                disabled={!editorState?.canHighlight}
            >
                <Highlighter className={`size-4 ${editorState?.isHighlight ? 'scale-110' : 'scale-100'}`} />
            </ToggleGroupItem>
        </ToggleGroup>
    )
    const ListButtons = () => (
        <ToggleGroup type="multiple" variant="outline" size="sm">
            <ToggleGroupItem
                value="bullet-list"
                aria-label="Bullet List"
                title="Bullet List"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                data-state={editorState?.isBulletList ? 'on' : 'off'}
            >
                <List className={`size-4 ${editorState?.isBulletList ? 'scale-110' : 'scale-100'}`} />
            </ToggleGroupItem>
            <ToggleGroupItem
                value="ordered-list"
                aria-label="Ordered List"
                title="Ordered List"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                data-state={editorState?.isOrderedList ? 'on' : 'off'}
            >
                <ListOrdered className={`size-4 ${editorState?.isOrderedList ? 'scale-110' : 'scale-100'}`} />
            </ToggleGroupItem>
        </ToggleGroup>
    )
    const AlignButtons = () => {
        const currentAlign =
            editorState?.isAlignLeft ? 'left' :
                editorState?.isAlignCenter ? 'center' :
                    editorState?.isAlignRight ? 'right' :
                        editorState?.isAlignJustify ? 'justify' : 'left'

        return (
            <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                value={currentAlign}
                onValueChange={(value) => {
                    if (!value) return;

                    if (value === 'left') {
                        editor.chain().focus().setTextAlign('left').run()
                    } else if (value === 'center') {
                        editor.chain().focus().setTextAlign('center').run()
                    } else if (value === 'right') {
                        editor.chain().focus().setTextAlign('right').run()
                    } else if (value === 'justify') {
                        editor.chain().focus().setTextAlign('justify').run()
                    }
                }}
            >
                <ToggleGroupItem
                    value="left"
                    aria-label="Align Left"
                    title="Align Left"
                >
                    <AlignLeft className="size-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                    value="center"
                    aria-label="Align Center"
                    title="Align Center"
                >
                    <AlignCenter className="size-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                    value="right"
                    aria-label="Align Right"
                    title="Align Right"
                >
                    <AlignRight className="size-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                    value="justify"
                    aria-label="Justify"
                    title="Justify"
                >
                    <AlignJustify className="size-4" />
                </ToggleGroupItem>
            </ToggleGroup>
        )
    }
    const BlockButtons = () => (
        <div className="flex items-center gap-1">
            <Button
                variant="outline"
                size="sm"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                title="Horizontal Rule"
                className="h-8"
            >
                <Minus className="size-4" />
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => {
                    if (editorState?.canClearNodes) editor.chain().focus().clearNodes().run()
                    if (editorState?.canClearMarks) editor.chain().focus().unsetAllMarks().run()
                }}
                title="Clear Formatting"
                disabled={!editorState?.canClearMarks && !editorState?.canClearNodes}
                className="h-8"
            >
                Clear
            </Button>
        </div>
    )

    return (
        <div className="mb-4 flex flex-wrap items-center gap-2 p-3 border rounded-lg bg-muted/50 sticky top-18 left-0">
            {/* History */}
            <HistoryButtons />
            <Separator orientation="vertical" className="h-6" />

            {/* Headings */}
            <HeadingButtons />
            <Separator orientation="vertical" className="h-6" />

            {/* Text Formatting */}
            <TextFormatButtons />
            <Separator orientation="vertical" className="h-6" />

            {/* Lists */}
            <ListButtons />
            <Separator orientation="vertical" className="h-6" />

            {/* Text Align */}
            <AlignButtons />
            <Separator orientation="vertical" className="h-6" />

            {/* Block Elements */}
            <BlockButtons />
        </div>
    )
}