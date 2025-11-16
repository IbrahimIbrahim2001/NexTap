"use client"
import { ChevronsUpDown, Plus } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"
import { CreateWorkSpace } from "./create-workspace"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { organizationSchema } from "better-auth/plugins"
import z from "zod"
import { useState } from "react"

export function WorkspaceSwitcher() {
    const { isMobile } = useSidebar();
    const [open, setOpen] = useState(false)
    const { data: activeWorkspace } = authClient.useActiveOrganization()
    const { data: workspaces } = authClient.useListOrganizations();
    async function setActiveWorkspace(workspace: z.infer<typeof organizationSchema>) {
        if (workspace) {
            return await authClient.organization.setActive({
                organizationId: workspace.id,
                organizationSlug: workspace.slug,
            });
        }
    }
    if (!activeWorkspace) {
        return null
    }
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu open={open} onOpenChange={setOpen}>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            tooltip={activeWorkspace?.name}
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={activeWorkspace.logo ?? undefined} alt={activeWorkspace.name} />
                                    <AvatarFallback className="rounded-lg">{activeWorkspace.name.charAt(0).toLocaleUpperCase()}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{activeWorkspace.name}</span>
                                <span className="truncate text-xs">{activeWorkspace.slug}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-muted-foreground text-xs">
                            <Link href="../workspace" className="hover:underline hover:text-foreground">
                                Workspaces
                            </Link>
                        </DropdownMenuLabel>
                        {workspaces?.map((workspace, index) => (
                            <Link href={`/workspace/${workspace.id}`} key={workspace.id}>
                                <DropdownMenuItem
                                    onClick={() => setActiveWorkspace(workspace)}
                                    className="gap-2 p-2"
                                >
                                    <div className="flex size-6 items-center justify-center rounded-md border">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage src={workspace.logo ?? undefined} alt={workspace.name} />
                                            <AvatarFallback className="rounded-lg">{workspace.name.charAt(0).toLocaleUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    {workspace.name}
                                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </Link>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild onSelect={e => e.preventDefault()}>
                            <CreateWorkSpace trigger={
                                <div className="hover:bg-accent flex cursor-default items-center gap-2 rounded-sm px-2 py-1">
                                    <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                                        <Plus className="size-4" />
                                    </div>
                                    <div className="text-muted-foreground group-hover:text-white font-medium text-sm">Create workspace</div>
                                </div>
                            } />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu >
    )
}
