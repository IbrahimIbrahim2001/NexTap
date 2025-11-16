import { base } from "./base"
import { User } from "better-auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
export const requiredAuthMiddleware = base
    .$context<{ session?: { user?: User } }>()
    .middleware(async ({ context, next }) => {
        const session = context.session ?? (await auth.api.getSession({
            headers: await headers()
        }))
        if (!session?.user) {
            redirect('../login')
        }
        return next({
            context: { user: session.user }
        })
    })
