"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { orpc } from "@/lib/orpc";
import { useQuery } from "@tanstack/react-query";
import { Organization } from "better-auth/plugins";
import { Search, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { Activity, useState } from "react";
import InviteMember from "./invite-member";
import { Loader } from "./loader";
import { Member } from "./member";

interface MembersListProps {
    isPending: boolean
    workspace: Organization | null
}

export default function MembersList({ workspace, isPending }: MembersListProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState<string>("");
    const { workspace_id } = useParams<{ workspace_id: string }>()
    const { data: members, isLoading, error } = useQuery(orpc.workspace.members.list.queryOptions({
        input: { workspace_id },
        refetchOnWindowFocus: true,
    }));

    const query = search?.trim().toLocaleLowerCase();

    const filteredMembers = query ? members?.filter((member) => {
        const name = member.user.name.toLocaleLowerCase();
        const email = member.user.email.toLocaleLowerCase();
        const role = member.role.toLocaleLowerCase();
        return name.includes(query) || email.includes(query) || role.includes(query);
    })
        : members;

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <SheetTrigger asChild>
                        <Button variant="ghost">
                            <Users className="size-4" />
                        </Button>
                    </SheetTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    member list
                </TooltipContent>
            </Tooltip>
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
                    <div className="mb-4 mt-2 pb-4 border-b">
                        <InputGroup>
                            <InputGroupInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search member by name or email or role..." className="pl-9 rounded" />
                            <InputGroupAddon>
                                <Search />
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                    <Activity mode={isLoading ? "visible" : "hidden"}>
                        <Loader />
                    </Activity>
                    {filteredMembers?.map(member => (
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


