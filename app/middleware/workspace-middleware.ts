// deprecated -----------------------------------------------------------------
//this is not working correctly because the better-auth does not offer a server side function to  getActiveOrganization
// ---------------------------------------------------------------------------
// import { base } from "./base"
// import { redirect } from "next/navigation"
// import { getActiveOrganization } from "@/server/organizations";
// import { Organization } from "better-auth/plugins";
// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
// export const requiredWorkspaceMiddleware = base
//     .$context<{ workspace?: Organization }>()
//     .middleware(async ({ context, next }) => {
//         const session = await auth.api.getSession({
//             headers: await headers()
//         });

//         if (!session) {
//             redirect('/login');
//         }

//         const workspace = context.workspace ?? await getActiveOrganization(session.user.id);
//         console.log(workspace);
//         if (!workspace) {
//             redirect('/login');
//         }

//         return next({
//             context: { workspace }
//         });
//     });
