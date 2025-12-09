"use client";
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
import { ListTodo, Search } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Todo } from "./todo";
interface TodoListProps {
    isPending: boolean
    workspace: Organization | null
}

export default function TodoList({ workspace, isPending }: TodoListProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState<string>("");
    const { workspace_id } = useParams<{ workspace_id: string }>()
    const { data: tasks } = useQuery(orpc.workspace.tasks.list.queryOptions({ input: { workspace_id } }));

    const query = search.trim().toLocaleLowerCase();
    const filteredTasks = query ? tasks?.filter((task => {
        const memberName = task.member?.name.toLocaleLowerCase();
        const memberEmail = task.member?.email.toLocaleLowerCase();
        const status = task.status?.toLocaleLowerCase();
        const content = task.content.toLocaleLowerCase();
        return memberName?.includes(query) || memberEmail?.includes(query) || status?.includes(query) || content.includes(query);
    })) : tasks;
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <SheetTrigger asChild>
                        <Button variant="ghost">
                            <ListTodo className="size-4" />
                        </Button>
                    </SheetTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    workspace tasks
                </TooltipContent>
            </Tooltip>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{
                        isPending ? <Skeleton className="w-26 h-4" /> :
                            <>
                                {workspace?.name}&apos;s Todo list:
                            </>
                    }
                    </SheetTitle>
                </SheetHeader>
                {/* list of todos */}
                <div className="space-y-3 px-4 h-full overflow-y-scroll hide-scrollbar">
                    <div className="mb-4 mt-2 pb-4 border-b">
                        <InputGroup>
                            <InputGroupInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search task..." className="pl-9 rounded" />
                            <InputGroupAddon>
                                <Search />
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                    {filteredTasks?.map((task) => (
                        <Todo key={task.id} task={task} />
                    ))}
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant="outline">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}