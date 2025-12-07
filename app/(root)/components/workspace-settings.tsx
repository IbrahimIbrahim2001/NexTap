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
import { UpdateWorkspaceSlug } from "../workspace/components/update-workspace-slug";
import { DeleteWorkspace } from "../workspace/components/delete-workspace";
import { UploadWorkSpaceLogo } from "./upload-workspace-logo";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface WorkspaceSettingsProps {
    isPending: boolean
    workspace: Organization | null
}
export default function WorkspaceSettings({ workspace, isPending }: WorkspaceSettingsProps) {
    const [open, setOpen] = useState(false);
    const { workspace_id } = useParams<{ workspace_id: string }>()
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <SheetTrigger asChild>
                        <Button variant="ghost">
                            <Settings className="size-4" />
                        </Button>
                    </SheetTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    settings
                </TooltipContent>
            </Tooltip>
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
                <div className="h-full px-4 overflow-y-scroll hide-scrollbar space-y-4">
                    {!workspace || !workspace_id &&
                        <div className="flex justify-center">
                            <Badge variant="destructive">Error loading workspace info</Badge>
                        </div>
                    }
                    <div className="border-2 rounded-lg p-3 space-y-2">
                        <p className="mb-2">Update Workspace:</p>
                        <div className="border-2 border-dashed rounded-lg p-3 hover:border-accent transition-all delay-75">
                            <UpdateWorkspaceSlug workspaceSlug={workspace?.slug} />
                        </div>
                        <div className="border-2 border-dashed rounded-lg p-3 hover:border-secondary transition-all delay-75">
                            <p className="text-sm mb-2">upload workspace logo:</p>
                            <UploadWorkSpaceLogo workspaceLogo={workspace?.logo} />
                        </div>
                    </div>
                    <div className="border-2 border-destructive/50 rounded-lg p-3 space-y-2">
                        <p className="mb-2">Delete Workspace:</p>
                        <DeleteWorkspace handleOpen={() => setOpen(false)} />
                    </div>
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