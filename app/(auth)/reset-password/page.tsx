import { Suspense } from "react";
import { ResetPasswordForm } from "../components/reset-password-form";

export default async function page() {
    return (
        <Suspense>
            <ResetPasswordForm />
        </Suspense>
    )
}
