import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"

export default function worksSpacePage() {
    return (
        <div className='p-4'>
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Logo width={32} height={32} />
                    </EmptyMedia>
                    <EmptyTitle className="text-secondary font-semibold">No Workspaces Yet</EmptyTitle>
                    <EmptyDescription>
                        You haven&apos;t created any workspaces yet. Get started by creating
                        your first workspace.
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button >Create Workspace</Button>
                </EmptyContent>
            </Empty>
        </div>
    )
}
