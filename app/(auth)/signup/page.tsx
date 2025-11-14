import { Logo } from "@/components/logo";
import Link from "next/link";
import { SignupForm } from "../components/signup-form";

export default function SignUpPage() {
    return (
        <div className="flex w-full max-w-sm flex-col gap-6">
            <Link href="../" className="flex items-center gap-2 self-center font-medium">
                <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                    <Logo width={16} height={16} />
                </div>
                NexTap.
            </Link>
            <SignupForm />
        </div>
    )
}
