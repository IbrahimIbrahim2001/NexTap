"use client";

import { MemberWithUser } from "@/app/router/workspace";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";
import { useState } from "react";
import { getBadgeColor, Role } from "../utils/get-role-badge-color";

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import CreateTask from "./create-task";

interface MemberProps {
    member: MemberWithUser
}

export function Member({ member }: MemberProps) {
    const userId = authClient.useSession().data?.user.id;
    const [role, setRole] = useState<Role>(member.role as Role);
    async function updateMemberRole(role: string) {
        const { data, error } = await authClient.organization.updateMemberRole({
            role: role,
            memberId: member.id,
            organizationId: member.organizationId,
        });
        if (data) {
            setRole(role as Role);
            toast.success("updated user role")
        }
        if (error) {
            toast.error(error.message)
        }
    }

    async function leaveOrganization() {
        const { data, error } = await authClient.organization.removeMember({
            memberIdOrEmail: member.id,
            organizationId: member.organizationId,
        });
        if (data) {
            toast.success("removed from organization");
            redirect("/workspace")
        }
        if (error) {
            toast.error(error.message)
        }
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <div className={cn("flex justify-between items-center my-2 p-2 rounded", userId === member.user.id && "bg-accent/50", "group hover:bg-muted")}>
                    <div className="flex items-center gap-x-2">
                        <Avatar className="size-8 rounded-lg">
                            <AvatarImage src={member.user.image ?? undefined} alt={`${member.user.name} image`} />
                            <AvatarFallback className="rounded-lg group-hover:bg-secondary/50 transition-all delay-75">{member.user.name.charAt(0).toLocaleUpperCase()}</AvatarFallback>
                        </Avatar>
                        <p>{member.user.name}</p>
                    </div>
                    <Badge className={`${getBadgeColor(role as Role)}`}>
                        {role}
                    </Badge>
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={() => updateMemberRole("admin")}>Set to admin</ContextMenuItem>
                <ContextMenuItem onClick={() => updateMemberRole("member")}>Set to member</ContextMenuItem>
                <ContextMenuItem onClick={leaveOrganization}>Remove from workspace</ContextMenuItem>
                <CreateTask member={member} trigger={
                    <Button variant="ghost" className="w-full h-8 justify-start px-2 hover:bg-accent! mb-1">
                        Add Task
                    </Button>
                } />
            </ContextMenuContent>
        </ContextMenu>
    )
}
