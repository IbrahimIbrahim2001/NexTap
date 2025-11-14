import { ReactNode } from 'react'
import AuthHeader from './components/header'
import ParticlesTheme from './components/particles-theme'

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <AuthHeader />
            <ParticlesTheme />
            {children}
        </div>
    )
}
