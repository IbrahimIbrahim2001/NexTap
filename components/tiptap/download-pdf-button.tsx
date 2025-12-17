"use client"

import { useParams } from "next/navigation"
import type { Editor } from "@tiptap/react"
import { useQuery } from "@tanstack/react-query"
import { orpc } from "@/lib/orpc"
import { useState } from "react"
import { generatePdf } from "@/lib/pdf-generator"
import { Button } from "../ui/button"

export default function DownloadPdfButton({ editor }: { editor: Editor }) {
    const { workspace_id, project_id } = useParams<{ workspace_id: string; project_id: string }>()
    const [isGenerating, setIsGenerating] = useState(false)

    const { data: project } = useQuery(
        orpc.project.get.queryOptions({
            input: { workspace_id, project_id },
        }),
    )

    const handleDownloadPdf = async () => {
        if (!editor || !project) {
            console.error("Editor or project not available")
            return
        }

        setIsGenerating(true)
        try {
            await generatePdf(editor, project.name)
        } catch (error) {
            console.error("Failed to generate PDF:", error)
            // You might want to show a toast notification here
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="flex-1 grid justify-items-end">
            <Button
                variant="outline"
                onClick={handleDownloadPdf}
                disabled={isGenerating || !editor || !project}
                className="flex items-center gap-2 bg-transparent"
            >
                {isGenerating ? (
                    <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        {"Generating PDF..."}
                    </>
                ) : (
                    <>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        Download PDF
                    </>
                )}
            </Button>
        </div>
    )
}
