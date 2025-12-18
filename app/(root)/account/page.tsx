import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Shield } from "lucide-react";
import { UserInfo } from "./components/user-info";
import { DeleteAccount } from "./components/delete-account";
import { UserAvatar } from "./components/user-avatar";


export default function AccountPage() {
    return (
        <div>
            <div className="mx-auto max-w-4xl p-6 md:p-8 lg:p-12">
                <div className="mb-8 hidden md:block">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile</h1>
                    <p className="mt-2 text-muted-foreground">Manage your account settings and preferences</p>
                </div>
                <div className="space-y-6">
                    <Card className="border-border">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <User className="h-5 w-5 text-muted-foreground" />
                                <CardTitle>Account</CardTitle>
                                <UserAvatar />
                            </div>
                            <CardDescription>Manage your account information and preferences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <UserInfo />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-muted-foreground" />
                                <CardTitle> Delete Account</CardTitle>
                            </div>
                            <CardDescription>permanently delete your account</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <DeleteAccount />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
