"use client";

import { Loader } from "@/app/(root)/components/loader";
import Tiptap from "@/components/tiptap/tiptap";
import { orpc } from "@/lib/orpc";
import { useQuery } from "@tanstack/react-query";

interface ProjectDetails {
    workspace_id: string,
    project_id: string
}

export function ProjectDetails({ workspace_id, project_id }: ProjectDetails) {
    const { data: project, isError, isLoading } = useQuery(orpc.project.get.queryOptions({ input: { workspace_id, project_id } }))
    if (isError) return <>Error</>
    if (isLoading) return (
        <div className="h-[calc(100vh-4em)] grid place-content-center justify-center">
            <Loader />
        </div>
    )
    return (
        <>
            <Tiptap content={project?.content ?? ""} />
        </>
    )
}
