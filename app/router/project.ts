import { db } from "@/db/drizzle";
import { member, project, ProjectSchema } from "@/db/schema";
import { createProjectSchema } from "@/schemas/create-project-schema";
import { generateId } from "better-auth";
import { and, eq } from "drizzle-orm";
import z from "zod";
import { requiredAuthMiddleware } from "../middleware/auth-middleware";
import { base } from "../middleware/base";
import { updateProjectContentSchema } from "@/schemas/update-project-content-schema";

export const createProject = base
    .route({
        method: "POST",
        path: "/create",
    })
    .use(requiredAuthMiddleware)
    .input(createProjectSchema)
    .output(z.object({
        success: z.boolean(),
        message: z.string(),
        projectId: z.string().optional()
    }))
    .handler(async ({ context, input }) => {
        const { name, icon, workspaceId } = input;
        const userId = context.user.id;

        const memberUser = await db.query.member.findFirst({
            where: and(
                eq(member.userId, userId),
                eq(member.organizationId, workspaceId)
            ),
        });

        if (!memberUser) {
            throw new Error("User is not a member of this workspace");
        }

        const findProject = await db.query.project.findFirst({
            where: and(
                eq(project.name, name),
                eq(project.organizationId, workspaceId)
            ),
        })

        if (findProject) throw new Error("Project already exists in this workspace");

        const projectId = generateId();
        const newProject = {
            id: projectId,
            name,
            icon,
            organizationId: workspaceId,
            content: `welcome to ${name} project ${icon}`,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await db.insert(project).values(newProject);

        return {
            success: true,
            message: `Created new Project "${name}" Successfully`,
            projectId
        };
    })


export const projectList = base
    .route({
        method: "GET",
        path: "/list",
    })
    .use(requiredAuthMiddleware)
    .input(z.object({ workspace_id: z.string() }))
    .output(z.array(z.custom<ProjectSchema>()))
    .handler(async ({ context, input }) => {
        const userId = context.user.id;
        const { workspace_id } = input;
        const memberUser = await db.query.member.findFirst({
            where: eq(member.userId, userId),
        });

        if (!memberUser) {
            throw new Error("User is not a member of this workspace");
        }

        const projects = await db.query.project.findMany({
            where: eq(project.organizationId, workspace_id)
        })
        return projects;
    })


export const getProject = base
    .use(requiredAuthMiddleware)
    .route({
        method: "GET",
        path: "/get-project/:project_id"
    })
    .input(z.object({ workspace_id: z.string(), project_id: z.string() }))
    .output(z.custom<ProjectSchema>().nullish())
    .handler(async ({ context, input }) => {
        const { workspace_id, project_id } = input;
        const userId = context.user.id;

        const memberUser = await db.query.member.findFirst({
            where: and(
                eq(member.userId, userId),
                eq(member.organizationId, workspace_id)
            ),
        });

        if (!memberUser) {
            throw new Error("User is not a member of this workspace");
        }
        const findProject = await db.query.project.findFirst({
            where: and(
                eq(project.organizationId, workspace_id),
                eq(project.id, project_id)
            )
        })
        return findProject;
    })

export const updateProjectContent = base
    .use(requiredAuthMiddleware)
    .route({
        method: "POST",
        path: "/update-project"
    })
    .input(updateProjectContentSchema)
    .output(z.object({
        success: z.boolean(),
        project: z.custom<ProjectSchema>()
    }))
    .handler(async ({ context, input }) => {
        const { workspace_id, project_id, newContent } = input;
        const userId = context.user.id;
        console.log("----------------------------------------------------------------------------", newContent);
        const memberUser = await db.query.member.findFirst({
            where: and(
                eq(member.userId, userId),
                eq(member.organizationId, workspace_id)
            ),
        });

        if (!memberUser) {
            throw new Error("User is not a member of this workspace");
        }
        const [updatedProject] = await db.update(project)
            .set({
                content: newContent,
                updatedAt: new Date()
            })
            .where(and(
                eq(project.organizationId, workspace_id),
                eq(project.id, project_id)
            ))
            .returning();

        if (!updatedProject) {
            throw new Error("Project not found or update failed");
        }

        return {
            success: true,
            project: updatedProject
        };
    })