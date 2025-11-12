import { base } from "./base"
import { User } from "better-auth"
import { authClient } from "@/lib/auth-client"
import { redirect } from "next/navigation"

export const requiredAuthMiddleware = base
    .$context<{ session?: { user?: User } }>()
    .middleware(async ({ context, next }) => {
        const session = context.session ?? ((await authClient.getSession()).data);
        if (!session?.user) {
            redirect('../login')
        }
        return next({
            context: { user: session.user }
        })
    })
