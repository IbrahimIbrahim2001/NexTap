"use client";

import { TodoWithUser } from "@/app/router/workspace";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { getTaskStatusBadgeBorderColor } from "../utils/get-role-badge-color";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";

export function Todo({ task }: { task: TodoWithUser }) {
    const queryClient = useQueryClient();
    const mutate = useMutation(orpc.workspace.tasks.update.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: orpc.workspace.tasks.list.queryKey({ input: { workspace_id: task.organizationId } }) })
        },
    }));
    const updateTaskStatus = async (status: TodoWithUser["status"]) => {
        await mutate.mutateAsync({
            workspace_id: task.organizationId,
            task_id: task.id,
            status
        });
    }
    return (
        <div
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
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Badge className={`${getTaskStatusBadgeBorderColor(task.status)}`}>
                        {task.status}
                    </Badge>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-8 w-40">
                    <DropdownMenuLabel className="text-muted-foreground text-xs">
                        update todo status
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => updateTaskStatus("to do")} className="hover:data-[variant=default]:bg-primary/90">
                        <p className="">To do</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateTaskStatus("in progress")} className="hover:data-[variant=default]:bg-secondary/90 ">
                        <p>in progress</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateTaskStatus("done")} className="hover:data-[variant=default]:bg-accent/90 ">
                        <p>done</p>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}