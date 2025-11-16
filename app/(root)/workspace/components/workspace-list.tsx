"use client";
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { CreateWorkSpace } from "../../components/create-workspace";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import Workspace from "./workspace";
export function WorkspaceList() {
    const { data: workspaces, isLoading } = useQuery(orpc.workspace.list.queryOptions());
    if (isLoading) return <>loading....</>
    if (!workspaces || workspaces.length === 0) {
        return (
            <div className='p-4'>
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <Logo width={32} height={32} />
                        </EmptyMedia>
                        <EmptyTitle className="text-secondary font-semibold">No Workspaces Yet</EmptyTitle>
                        <EmptyDescription>
                            You haven&apos;t created any workspaces yet. Get started by creating
                            your first workspace.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <CreateWorkSpace trigger={<Button >Create Workspace</Button>} />
                    </EmptyContent>
                </Empty>
            </div>
        )
    }
    return (
        <div className=" px-6 py-8 w-full">
            <p className="text-lg font-semibold mb-4">Your Workspaces:</p>
            <div className="flex items-center justify-center">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full">
                    {workspaces?.map((workspace) => (
                        <Workspace key={workspace.id} workspace={workspace} />
                    ))}
                </div>
            </div>
        </div>
    )
}
