import z from "zod";

export const createTaskSchema = z.object({
    workspace_id: z.string(),
    content: z.string().min(2).max(50),
    assigned_to: z.string()
})

export type createTaskSchemaType = z.infer<typeof createTaskSchema>