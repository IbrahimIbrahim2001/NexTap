import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import WorkspaceAvatar from "../../components/workspace-avatar";
import { Organization, organizationSchema } from "better-auth/plugins";
import Link from "next/link";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function Workspace({ workspace }: { workspace: Organization }) {
    async function setActiveWorkspace(workspace: z.infer<typeof organizationSchema>) {
        if (workspace) {
            return await authClient.organization.setActive({
                organizationId: workspace.id,
                organizationSlug: workspace.slug,
            });
        }
    }
    return (
        <Card className="p-0 gap-0">
            <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                    <div className=" flex items-center justify-center">
                        <div className=" inset-0 flex items-center justify-center">
                            <WorkspaceAvatar workspace={workspace} height="h-10" width="w-10" />
                        </div>
                    </div>
                    <div>
                        <div className="text-base font-medium text-foreground">
                            {workspace.name}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {workspace.slug}
                        </p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-end border-t border-border p-0!">
                <Button variant="link" asChild onClick={() => setActiveWorkspace(workspace)}>
                    <Link
                        prefetch={true}
                        href={`workspace/${workspace.id}/project`}
                        className="text-sm text-primary font-medium px-4 py-3 flex items-center underline-offset-4 hover:underline"
                    >
                        View projects <ArrowRight className="size-4 ml-2" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
