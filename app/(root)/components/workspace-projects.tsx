"use client"

import {
    Folder,
    MoreHorizontal,
    Plus,
    Trash2
} from "lucide-react";
import { motion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/lib/orpc";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CreateProject } from "../workspace/[workspace_id]/project/component/create-project";
export function WorkspaceProjects() {
    const { isMobile } = useSidebar();
    const params = useParams<{ workspace_id: string, project_id: string }>();
    const router = useRouter();
    const { data: activeWorkspace } = authClient.useActiveOrganization();
    const { data: projects, isLoading, isError } = useQuery(
        orpc.project.list.queryOptions({
            input: { workspace_id: params.workspace_id ?? activeWorkspace?.id }
        }),
    );
    if (isError) return (
        <SidebarGroup>
            <SidebarMenu>
                <SidebarMenuItem >
                    <SidebarMenuButton asChild disabled>
                        <div className="flex items-center">
                            <div className="text-center group-data-[collapsible=icon]:hidden mb-4">
                                <Badge variant="destructive">Error</Badge>
                            </div>
                        </div>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    )
    if (isLoading) return (
        <>
            <SidebarGroup>
                <SidebarMenu>
                    <SidebarMenuItem >
                        <SidebarMenuButton asChild disabled>
                            <div className="flex items-center h-full">
                                <Spinner />
                                <span>Loading...</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
        </>
    )
    if (!projects || projects.length === 0) return (
        <SidebarGroup>
            <SidebarMenu>
                <CreateProject trigger={
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip={"create a new project"} className="text-sidebar-foreground/70 border-2 border-border border-dashed">
                            <Plus className="text-lg" />
                            <span>Add project</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>} />
                <div className="text-center group-data-[collapsible=icon]:hidden mb-4">
                    <Badge variant="secondary">no projects yet</Badge>
                </div>
            </SidebarMenu>
        </SidebarGroup>
    )
    return (
        <>
            <SidebarGroup>
                <SidebarGroupLabel>Projects</SidebarGroupLabel>
                <SidebarMenu>
                    {projects.map((project) => {
                        const isActive = project.id === params.project_id;
                        return (
                            <SidebarMenuItem key={project.name} className="hover:text-secondary transition-all duration-200">
                                <SidebarMenuButton asChild tooltip={project.name}
                                    className="font-semibold active:text-primary hover:text-accent transition-al duration-200"
                                >
                                    <Link key={project.id} href={`/workspace/${project.organizationId}/project/${project.id}`} className={cn(
                                        "relative",
                                        isActive && "text-primary bg-muted font-semibold"
                                    )}
                                    >
                                        <span>{project.icon}</span>
                                        <span>{project.name}</span>
                                        {isActive && (
                                            <motion.span
                                                layoutId="item"
                                                className="absolute left-0 top-0 bottom-0 w-0.5 my-2 me-2 bg-secondary rounded-md"
                                                transition={{ type: "spring", duration: 0.5 }}
                                            />
                                        )}
                                    </Link>
                                </SidebarMenuButton>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <SidebarMenuAction showOnHover>
                                            <MoreHorizontal />
                                            <span className="sr-only">More</span>
                                        </SidebarMenuAction>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-48 rounded-lg"
                                        side={isMobile ? "bottom" : "right"}
                                        align={isMobile ? "end" : "start"}
                                    >
                                        <DropdownMenuItem onClick={() => router.push("/workspace/" + project.organizationId + "/project/" + project.id)}>
                                            <Folder className="text-muted-foreground" />
                                            <span>View Project</span>
                                        </DropdownMenuItem>
                                        {/* <DropdownMenuItem>
                                            <Forward className="text-muted-foreground" />
                                            <span>Share Project</span>
                                        </DropdownMenuItem> */}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <Trash2 className="text-muted-foreground" />
                                            <span>Delete Project</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </SidebarMenuItem>
                        )
                    })}
                    <CreateProject trigger={
                        <SidebarMenuItem>
                            <SidebarMenuButton tooltip={"create a new project"} className="text-sidebar-foreground/70 border-2 border-border border-dashed">
                                <Plus className="text-lg" />
                                <span>Add project</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>} />
                </SidebarMenu>
            </SidebarGroup>
        </>
    )
}
