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
import { CreateWorkSpace } from "../components/create-workspace"
import { authClient } from "@/lib/auth-client";
export default function WorksSpacePage() {
    const { data: workspaces } = authClient.useListOrganizations();
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
        <>
            {workspaces.map((workspace) => (
                <p key={workspace.id}>{workspace.name}</p>
            ))}
        </>
    )
}
