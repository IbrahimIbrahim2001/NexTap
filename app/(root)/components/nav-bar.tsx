"use client";
import { ModeToggle } from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/lib/orpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Activity, lazy, useState } from "react";
import { getBadgeBorderColor, getBadgeTextColor, getProjectStatusBadgeColor, Role } from "../utils/get-role-badge-color";
import { InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { useQueryState } from 'nuqs'
import { ProjectSchema } from "@/db/schema";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
const LazyMemberList = lazy(() => import('./members-list'));
const LazyWorkspaceSettings = lazy(() => import('./workspace-settings'));
const LazyTodoList = lazy(() => import('./todo-list'));

export function Navbar() {
    const params = useParams<{ workspace_id: string, project_id: string }>()
    const [searchWorkspace, setSearchWorkspace] = useQueryState('workspace');
    const [searchProject, setSearchProject] = useQueryState('project');
    const { data: workspace, isPending } = authClient.useActiveOrganization();
    const { data: memberRole, isLoading: isLoadingMemberRole } = useQuery({
        queryKey: ["member-role", params.project_id],
        queryFn: async () => {
            const { data } = await authClient.organization.getActiveMemberRole();
            if (data?.role) return data.role;
        }
    })
    const { data: project, isLoading: isLoadingProject } = useQuery(orpc.project.get.queryOptions({ input: { workspace_id: params.workspace_id!, project_id: params.project_id! } }));
    return (
        <nav className="w-full px-2 h-12 flex justify-between items-center border-b border-border bg-background sticky top-0 left-0 z-50">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-4" />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                />
                {/* workspace breadcrumb   */}
                <Activity mode={params.workspace_id ? "visible" : "hidden"}>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <Link prefetch={true} href={`/workspace/${workspace?.id}/project`}>
                                    {workspace?.name ?
                                        <p>{workspace?.name}</p>
                                        : <Skeleton className="w-20 h-4" />
                                    }
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <Activity mode={(params.project_id && isLoadingProject) || project ? "visible" : "hidden"}>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>
                                        {isLoadingProject ?
                                            <Skeleton className="w-26 h-4" />
                                            : <p>{project?.name}</p>
                                        }
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </Activity>
                        </BreadcrumbList>
                    </Breadcrumb>
                </Activity>
            </div>
            {/* search workspace */}
            <Activity mode={!params.workspace_id && !params.project_id ? "visible" : "hidden"}>
                <div className="flex-1 flex items-center justify-center pe-5">
                    <div className="h-8 w-fit border rounded flex items-center justify-start">
                        <InputGroupAddon>
                            <InputGroupInput value={searchWorkspace ?? ""} onChange={(e) => setSearchWorkspace(e.target.value)} placeholder="Search workspace..." className="rounded" />
                            <InputGroupAddon>
                                <Search />
                            </InputGroupAddon>
                        </InputGroupAddon>
                    </div>
                </div>
            </Activity>
            {/* member role and project status badges */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
                <div className=" flex items-center justify-between gap-x-2">
                    <Activity mode={params.workspace_id ? "visible" : "hidden"}>
                        <Badge variant="outline" className={`${getBadgeBorderColor(memberRole as Role)} ${getBadgeTextColor(memberRole as Role)} hidden sm:block`}>
                            {isLoadingMemberRole ?
                                <Loader2 className="size-4 animate-spin" />
                                : memberRole
                            }
                        </Badge>
                        <Activity mode={(params.project_id && isLoadingProject) || project ? "visible" : "hidden"}>
                            <Separator
                                orientation="vertical"
                                className="data-[orientation=vertical]:h-4  hidden sm:block"
                            />
                            <ProjectStatusBadge status={project?.status} params={params} />
                        </Activity>
                    </Activity>
                </div>
            </div>
            {/* workspace sheets */}
            <div className="flex items-center gap-x-2 pe-4">
                {/* search project */}
                <Activity mode={params.workspace_id ? "visible" : "hidden"}>
                    <Activity mode={params.project_id ? "hidden" : "visible"}>
                        <div className="h-8 w-fit border rounded flex items-center justify-start">
                            <InputGroupAddon>
                                <InputGroupInput value={searchProject ?? ""} onChange={(e) => setSearchProject(e.target.value)} placeholder="Search project..." className="rounded" />
                                <InputGroupAddon>
                                    <Search />
                                </InputGroupAddon>
                            </InputGroupAddon>
                        </div>
                    </Activity>
                    <LazyMemberList workspace={workspace} isPending={isPending} />
                    <LazyWorkspaceSettings workspace={workspace} isPending={isPending} />
                    <LazyTodoList workspace={workspace} isPending={isPending} />
                </Activity>
                <ModeToggle />
            </div>
        </nav>
    )
}


function ProjectStatusBadge({ status, params }: { status: ProjectSchema["status"] | undefined, params: { workspace_id: string, project_id: string } }) {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();
    const activeMember = authClient.useActiveMemberRole();
    const mutate = useMutation(orpc.project.update_Status.mutationOptions({
        onSuccess: () => {
            const projectKey = orpc.project.get.queryKey({ input: { workspace_id: params.workspace_id, project_id: params.project_id } });
            queryClient.invalidateQueries({ queryKey: projectKey });
            setOpen(false);
        },
        onError: (error) => {
            toast.error(error.message);
        }
    }));
    const handleStatusChange = async (newStatus: ProjectSchema["status"]) => {
        if (activeMember.data?.role !== "admin" && activeMember.data?.role !== "owner") {
            toast.error("You don't have permission to update project status.");
            return;
        }
        await mutate.mutateAsync({
            workspace_id: params.workspace_id,
            project_id: params.project_id,
            newStatus
        });
    }
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                <Badge className={`${getProjectStatusBadgeColor(status)}`}>
                    {status}
                </Badge>
            </PopoverTrigger>
            <PopoverContent className="max-w-52">
                <div className="flex flex-col gap-2">
                    <Button variant="secondary" onClick={() => handleStatusChange("in progress")} className="bg-secondary/50">in progress</Button>
                    <Button onClick={() => handleStatusChange("finished")} className="bg-accent/50 hover:bg-accent/80">finished</Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
