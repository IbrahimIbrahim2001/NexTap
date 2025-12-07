"use client";
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
import { Skeleton } from "@/components/ui/skeleton";
import { orpc } from "@/lib/orpc";
import { useQuery } from "@tanstack/react-query";
import { Organization } from "better-auth/plugins";
import { ListTodo } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { getTaskStatusBadgeBorderColor } from "../utils/get-role-badge-color";
interface TodoListProps {
    isPending: boolean
    workspace: Organization | null
}

export default function TodoList({ workspace, isPending }: TodoListProps) {
    const [open, setOpen] = useState(false);
    const { workspace_id } = useParams<{ workspace_id: string }>()
    const { data: tasks } = useQuery(orpc.workspace.tasks.list.queryOptions({ input: { workspace_id } }));
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
                    {tasks?.map((task) => (
                        <div
                            key={task.id}
                            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-sm  font-semibold text-left wrap-break-word whitespace-normal">
                                    {task.content}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Assigned to: {task.member?.name}
                                </p>
                            </div>
                            <Badge className={`${getTaskStatusBadgeBorderColor(task.status)}`}>
                                {task.status}
                            </Badge>
                        </div>
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