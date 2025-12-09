import { db } from "@/db/drizzle";
import { member, organization, todos, TodoSchema, user, UserSchema } from "@/db/schema";
import { createTaskSchema } from "@/schemas/create-task-schema";
import { generateId } from "better-auth";
import { Member, Organization } from "better-auth/plugins";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { requiredAuthMiddleware } from "../middleware/auth-middleware";
import { base } from "../middleware/base";

export const workspaceList = base
    .use(requiredAuthMiddleware)
    .route({
        method: "GET",
        path: "/list",
    })
    .input(z.void())
    .output(z.array(z.custom<Organization>()))
    .handler(async ({ context }) => {
        const userId = context.user.id;
        const members = await db.query.member.findMany({
            where: eq(member.userId, userId),
        });
        const organizations = await db.query.organization.findMany({
            where: inArray(organization.id, members.map((member) => member.organizationId)),
        });
        return organizations;
    });

export type MemberWithUser = Member & {
    user: UserSchema
};


export const membersList = base
    .use(requiredAuthMiddleware)
    .route({
        method: "GET",
        path: "/:workspace_id/members/list",
    })
    .input(z.object({
        workspace_id: z.string()
    }))
    .output(z.array(z.custom<MemberWithUser>()))
    .handler(async ({ context, input }) => {
        const userId = context.user.id;
        const { workspace_id } = input;
        const userMembership = await db
            .select()
            .from(member)
            .where(
                and(
                    eq(member.userId, userId),
                    eq(member.organizationId, workspace_id)
                )
            )
            .limit(1);
        if (userMembership.length === 0) {
            throw new Error("User is not a member of this workspace");
        }
        const members = await db
            .select({
                id: member.id,
                organizationId: member.organizationId,
                userId: member.userId,
                role: member.role,
                createdAt: member.createdAt,
                user: {
                    ...user
                }
            })
            .from(member)
            .innerJoin(user, eq(member.userId, user.id))
            .where(eq(member.organizationId, workspace_id));
        return members;
    });


export const createTask = base
    .use(requiredAuthMiddleware)
    .route({
        method: "POST",
        path: "/:workspace_id/task/create"
    })
    .input(createTaskSchema)
    .output(z.object({
        success: z.boolean(),
        message: z.string(),
        taskId: z.string().optional()
    }))
    .handler(async ({ context, input }) => {
        const { workspace_id, content, assigned_to } = input;
        const user_id = context.user.id;
        const memberUser = await db.query.member.findFirst({
            where: and(
                eq(member.userId, user_id),
                eq(member.organizationId, workspace_id)
            ),
        });
        if (!memberUser) {
            throw new Error("User is not a member of this workspace");
        }
        const taskId = generateId();
        const res = await db.insert(todos).values({
            id: taskId,
            organizationId: workspace_id,
            content,
            assigned_to,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        console.log(res);
        return {
            success: true,
            message: `Created New Task Successfully`,
            taskId
        }
    })


export type TodoWithUser = TodoSchema & {
    member: UserSchema | null
};

export const todoList = base
    .use(requiredAuthMiddleware)
    .route({
        method: "GET",
        path: "/:workspace_id/task/list"
    })
    .input(z.object({
        workspace_id: z.string()
    }))
    .output(z.array(z.custom<TodoWithUser>()))
    .handler(async ({ context, input }) => {
        const { workspace_id } = input;
        const user_id = context.user.id;
        const memberUser = await db.query.member.findFirst({
            where: and(
                eq(member.userId, user_id),
                eq(member.organizationId, workspace_id)
            ),
        });
        if (!memberUser) {
            throw new Error("User is not a member of this workspace");
        }
        const todosWithUsers = await db
            .select({
                todos: todos,
                user: user
            })
            .from(todos)
            .leftJoin(user, eq(todos.assigned_to, user.id))
            .where(eq(todos.organizationId, workspace_id));
        return todosWithUsers.map(row => ({
            ...row.todos,
            member: row.user
        }));
    });


export const updateTodoStatus = base.
    use(requiredAuthMiddleware)
    .route({
        method: "PUT",
        path: "/:workspace_id/task/update"
    })
    .input(z.object({
        workspace_id: z.string(),
        task_id: z.string(),
        status: z.custom<TodoSchema["status"]>()
    }))
    .output(z.object({
        success: z.boolean()
    }))
    .handler(async ({ input, context, errors }) => {
        const { workspace_id, task_id, status } = input;
        const user_id = context.user.id;
        try {
            const memberUser = await db.query.member.findFirst({
                where: and(
                    eq(member.userId, user_id),
                    eq(member.organizationId, workspace_id)
                ),
            });
            if (!memberUser) {
                throw errors.FORBIDDEN()
            }

            const task = await db.query.todos.findFirst({
                where: and(
                    eq(todos.id, task_id),
                    eq(todos.organizationId, workspace_id)
                ),
            });

            if (!task) {
                throw errors.NOT_FOUND();
            }

            const result = await db.update(todos).set({
                status,
            }).where(and(
                eq(todos.id, task_id),
                eq(todos.organizationId, workspace_id)
            ))
            if (result.rowCount === 0) {
                throw errors.NOT_FOUND()
            }
            return { success: true };
        } catch {
            throw errors.INTERNAL_SERVER_ERROR()
        }
    })