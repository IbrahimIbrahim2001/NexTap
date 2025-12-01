"use client";

import { MemberWithUser } from "@/app/router/workspace";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/lib/orpc";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Organization } from "better-auth/plugins";
import { Users } from "lucide-react";
import { redirect, useParams } from "next/navigation";
import { Activity, useState } from "react";
import { getBadgeColor, Role } from "../utils/get-role-badge-color";
import { Loader } from "./loader";
import InviteMember from "./invite-member";
import { Skeleton } from "@/components/ui/skeleton";

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { toast } from "sonner";

interface MembersListProps {
    isPending: boolean
    workspace: Organization | null
}

export default function MembersList({ workspace, isPending }: MembersListProps) {
    const [open, setOpen] = useState(false);
    const { workspace_id } = useParams<{ workspace_id: string }>()
    const { data: members, isLoading, error } = useQuery(orpc.workspace.members.list.queryOptions({ input: { workspace_id } }));
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost">
                    <Users className="size-4" />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{
                        isPending ? <Skeleton className="w-26 h-4" /> :
                            <>
                                {workspace?.name}&apos;s Members:
                            </>
                    }
                    </SheetTitle>
                </SheetHeader>
                <div className="h-full px-4 overflow-y-scroll hide-scrollbar">
                    {!workspace || !workspace_id || error &&
                        <div className="flex justify-center">
                            <Badge variant="destructive">Error loading workspace info</Badge>
                        </div>
                    }
                    <Activity mode={isLoading ? "visible" : "hidden"}>
                        <Loader />
                    </Activity>
                    {members?.map(member => (
                        <Member key={member.id} member={member} />
                    ))}
                </div>
                <SheetFooter>
                    <InviteMember />
                    <SheetClose asChild>
                        <Button variant="outline">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

interface MemberProps {
    member: MemberWithUser
}

function Member({ member }: MemberProps) {
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
            <ContextMenuTrigger>
                <div className={cn("flex justify-between items-center p-2", userId === member.user.id && "bg-accent/50 rounded", "group hover:bg-muted")}>
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
                <ContextMenuItem disabled>Notify</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}

