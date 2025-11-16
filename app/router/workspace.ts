import { db } from "@/db/drizzle";
import { requiredAuthMiddleware } from "../middleware/auth-middleware";
import { base } from "../middleware/base";
import { z } from "zod";
import { Organization } from "better-auth/plugins";


export const workspaceList = base
    .use(requiredAuthMiddleware)
    .route({
        method: "GET",
        path: "/list",
    })
    .input(z.void())
    .output(z.array(z.custom<Organization>()))
    .handler(async () => {
        // const id = context.user.id
        return await db.query.organization.findMany();
    });