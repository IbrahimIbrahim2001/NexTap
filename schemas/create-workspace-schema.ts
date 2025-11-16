import z from "zod";

export const createWorkspaceSchema = z.object({
    name: z.string().min(2).max(50),
    slug: z.string().min(2).max(10)
});

export type createWorkspaceSchemaType = z.infer<typeof createWorkspaceSchema>;