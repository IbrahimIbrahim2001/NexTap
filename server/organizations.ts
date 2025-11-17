//this used for auth.ts file and workspace-middleware.ts

import { db } from "@/db/drizzle";
import { member, organization, user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, inArray } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


export const getCurrentUser = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    const currentUser = await db.query.user.findFirst({
        where: eq(user.id, session?.user.id),
    });

    if (!currentUser) {
        redirect("/login");
    }

    return {
        ...session,
        currentUser
    }
}

export async function getOrganizations() {
    const { currentUser } = await getCurrentUser();

    const members = await db.query.member.findMany({
        where: eq(member.userId, currentUser.id),
    });

    const organizations = await db.query.organization.findMany({
        where: inArray(organization.id, members.map((member) => member.organizationId)),
    });

    return organizations;
}

export async function getActiveOrganization(userId: string) {
    const memberUser = await db.query.member.findFirst({
        where: eq(member.userId, userId),
    });

    if (!memberUser) {
        return null;
    }

    const activeOrganization = await db.query.organization.findFirst({
        where: eq(organization.id, memberUser.organizationId),
    });

    return activeOrganization;
}