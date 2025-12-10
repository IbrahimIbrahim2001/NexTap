"use client";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { authClient } from "@/lib/auth-client";
import { Plus } from "lucide-react";
import { CreateWorkSpace } from "../../components/create-workspace";
import { Loader } from "../../components/loader";
import Workspace from "./workspace";
import { useQueryState } from "nuqs";
export function WorkspaceList() {
    const { data: workspaces, isPending } = authClient.useListOrganizations();
    const [searchWorkspace] = useQueryState("workspace");
    const filteredWorkspaces = searchWorkspace ? workspaces?.filter((w) => {
        return w.name.toLowerCase().includes(searchWorkspace.toLowerCase()) || w.slug.toLocaleLowerCase().includes(searchWorkspace.toLowerCase());
    }) : workspaces;
    if (isPending) return <Loader />
    if (!filteredWorkspaces || filteredWorkspaces.length === 0) {
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
                    {filteredWorkspaces?.map((workspace) => (
                        <Workspace key={workspace.id} workspace={workspace} />
                    ))}
                    <CreateWorkSpace trigger={
                        <Card className="border-2 border-dashed w-full md:max-w-sm h-full min-h-28 p-0 shadow-none hover:scale-105">
                            <CardContent className="p-6 h-full flex items-center justify-center">
                                <Plus className='size-10 text-foreground/80' />
                            </CardContent>
                        </Card>
                    }
                    />
                </div>
            </div>
        </div>
    )
}
