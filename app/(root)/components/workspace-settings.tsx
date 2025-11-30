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

import { Skeleton } from "@/components/ui/skeleton";
import { Organization } from "better-auth/plugins";
import { Settings } from "lucide-react";

import { useParams } from "next/navigation";
import { useState } from "react";

interface WorkspaceSettingsProps {
    isPending: boolean
    workspace: Organization | null
}
export default function WorkspaceSettings({ workspace, isPending }: WorkspaceSettingsProps) {
    const [open, setOpen] = useState(false);
    const { workspace_id } = useParams<{ workspace_id: string }>()
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost">
                    <Settings className="size-4" />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{
                        isPending ? <Skeleton className="w-26 h-4" /> :
                            <>
                                {workspace?.name}&apos;s Settings:
                            </>
                    }
                    </SheetTitle>
                </SheetHeader>
                <div className="h-full px-4">
                    {!workspace || !workspace_id &&
                        <div className="flex justify-center">
                            <Badge variant="destructive">Error loading workspace info</Badge>
                        </div>
                    }
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
