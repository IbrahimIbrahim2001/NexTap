import { orpc } from "@/lib/orpc";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";
import { ProjectDetails } from "./components/project-details";

export default async function ProjectPage({ params }: { params: Promise<{ workspace_id: string, project_id: string }> }) {
    const { workspace_id, project_id } = await params;
    const queryClient = getQueryClient()
    await queryClient.prefetchQuery(
        orpc.project.get.queryOptions({ input: { workspace_id, project_id } }),
    )
    return (
        <HydrateClient client={queryClient}>
            <div className="py-2 px-3">
                <ProjectDetails workspace_id={workspace_id} project_id={project_id} />
            </div>
        </HydrateClient>
    )
}
