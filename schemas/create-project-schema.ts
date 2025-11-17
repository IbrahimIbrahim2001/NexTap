import { z } from 'zod';

export const createProjectSchema = z.object({
    name: z.string().min(1, "Project name is required").max(50, "Project name too long"),
    icon: z.string().optional().default("🚀"),
    workspaceId: z.string()
});

export type createProjectSchemaType = z.infer<typeof createProjectSchema>;