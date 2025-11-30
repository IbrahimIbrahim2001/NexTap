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
import { useParams } from "next/navigation";
import { Activity, useState } from "react";
import { getBadgeColor, Role } from "../utils/get-role-badge-color";
import { Loader } from "./loader";
import AddMember from "./add-memeber";

interface MembersListProps {
    workspace: Organization | null
}

export default function MembersList({ workspace }: MembersListProps) {
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
                    <SheetTitle>{workspace?.name}&apos;s Members:</SheetTitle>
                </SheetHeader>
                <div className="h-full px-4">
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
                    <AddMember />
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
    const userId = authClient.useSession().data?.user.id
    return (
        <div className={cn("flex justify-between items-center p-2", userId === member.user.id && "bg-accent/50 rounded", "group hover:bg-muted")}>
            <div className="flex items-center gap-x-2">
                <Avatar className="size-8 rounded-lg">
                    <AvatarImage src={member.user.image ?? undefined} alt={`${member.user.name} image`} />
                    <AvatarFallback className="rounded-lg group-hover:bg-secondary/50 transition-all delay-75">{member.user.name.charAt(0).toLocaleUpperCase()}</AvatarFallback>
                </Avatar>
                <p>{member.user.name}</p>
            </div>
            <Badge className={`${getBadgeColor(member.role as Role)}`}>
                {member.role}
            </Badge>
        </div>
    )
}

