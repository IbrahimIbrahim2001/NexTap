'use client'

import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import MenuBar from './menu-bar'


const Tiptap = () => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    HTMLAttributes: {
                        class: "list-disc ml-4",
                    },
                },
                orderedList: {
                    HTMLAttributes: {
                        class: "list-decimal ml-4",
                    },
                },
                heading: {
                    levels: [1, 2, 3],
                    HTMLAttributes: {
                        class: "font-bold",
                    },
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'center', 'right', 'justify'],
            }),
            Highlight.configure({
                multicolor: false,
            }),
            Underline,
        ],
        content: "<p>Start typing here...</p>",
        editorProps: {
            attributes: {
                class: "min-h-[calc(100vh-190px)] border rounded-md py-2 px-3  prose prose-sm  focus:outline-none",
            },
        },
        autofocus: false,
    })


    return (
        <div className="border rounded-lg p-4">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}

export default Tiptap