import z from "zod";

export const updateProjectContentSchema = z.object({
    workspace_id: z.string(),
    project_id: z.string(),
    newContent: z.json()
})