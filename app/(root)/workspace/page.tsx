import { getQueryClient, HydrateClient } from "@/lib/query/hydration"
import { orpc } from "@/lib/orpc"
import { WorkspaceList } from "./components/workspace-list";
export default async function WorksSpacePage() {
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(orpc.workspace.list.queryOptions());
    return (
        <HydrateClient client={queryClient}>
            <WorkspaceList />
        </HydrateClient>
    )
}
