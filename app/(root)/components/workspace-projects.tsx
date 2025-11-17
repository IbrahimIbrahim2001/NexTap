"use client"

import {
    Folder,
    Forward,
    MoreHorizontal,
    Trash2
} from "lucide-react";

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
import { orpc } from "@/lib/orpc";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { CreateProject } from "../workspace/[workspace_id]/project/component/create-project";
import { useParams } from "next/navigation";
export function WorkspaceProjects() {
    const { isMobile } = useSidebar();
    const params = useParams<{ workspace_id: string }>();
    const { data: projects } = useQuery(
        orpc.project.list.queryOptions({
            input: { workspace_id: params.workspace_id }
        }),
    );
    if (!projects || projects.length === 0) return (
        <SidebarGroup>
            <div className="text-center group-data-[collapsible=icon]:hidden mb-4">
                <Badge variant="secondary">no projects yet</Badge>
            </div>
            <CreateProject />
        </SidebarGroup>
    )
    return (
        <>
            <SidebarGroup>
                <SidebarGroupLabel>Projects</SidebarGroupLabel>
                <SidebarMenu>
                    {projects.map((project) => (
                        <SidebarMenuItem key={project.name}>
                            <SidebarMenuButton asChild tooltip={project.name} className="font-semibold active:text-primary hover:text-accent transition-al duration-200">
                                <Link href={`/workspace/${project.organizationId}/project/${project.id}`} className="w-full">
                                    <span>{project.icon}</span>
                                    <span>{project.name}</span>
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
                                    <DropdownMenuItem>
                                        <Folder className="text-muted-foreground" />
                                        <span>View Project</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Forward className="text-muted-foreground" />
                                        <span>Share Project</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Trash2 className="text-muted-foreground" />
                                        <span>Delete Project</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    ))}
                    <CreateProject />
                </SidebarMenu>
            </SidebarGroup>
        </>
    )
}
