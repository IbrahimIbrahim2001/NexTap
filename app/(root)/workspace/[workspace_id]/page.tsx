export default async function WorkspaceIdPage({ params }: { params: Promise<{ workspace_id: string }> }) {
    const { workspace_id } = await params;
    return (
        <div>
            {workspace_id}
        </div>
    )
}