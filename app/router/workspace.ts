import { db } from "@/db/drizzle";
import { member, organization, user, UserSchema } from "@/db/schema";
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


