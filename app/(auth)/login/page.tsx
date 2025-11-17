import { LoginForm } from "@/app/(auth)/components/login-form"
import { Logo } from "@/components/logo"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const data = await auth.api.getSession({
    headers: await headers()
  });
  if (data?.session) {
    redirect("../workspace")
  }
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Link href="../" className="flex items-center gap-2 self-center font-medium">
        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
          <Logo width={16} height={16} />
        </div>
        NexTap.
      </Link>
      <LoginForm />
    </div>
  )
}
