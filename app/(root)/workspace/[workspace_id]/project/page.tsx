import { orpc } from "@/lib/orpc";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";
import { ProjectList } from "./component/project-list";


// export function getServerSideProps() {

// }
export default async function ProjectsPage({ params }: { params: Promise<{ workspace_id: string }> }) {
    const { workspace_id } = await params;
    const queryClient = getQueryClient()

    await queryClient.prefetchQuery(
        orpc.project.list.queryOptions({ input: { workspace_id } }),
    )
    return (
        <HydrateClient client={queryClient}>
            <ProjectList workspace_id={workspace_id} />
        </HydrateClient>
    )
}