import { db } from "@/db/drizzle";
import { requiredAuthMiddleware } from "../middleware/auth-middleware";
import { base } from "../middleware/base";
import { z } from "zod";
import { eq, inArray } from "drizzle-orm";
import { member, organization } from "@/db/schema";
import { Organization } from "better-auth/plugins";


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