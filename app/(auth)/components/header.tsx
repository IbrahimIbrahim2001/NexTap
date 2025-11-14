import { ThemeSwitcher } from '@/components/kibo-ui/theme-switcher';
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon } from 'lucide-react'
import Link from 'next/link'

export default function AuthHeader() {
    return (
        <div className='flex justify-between w-full px-4 md:px-20 absolute top-5'>
            <Button type='button' asChild variant="ghost">
                <Link href="../">
                    <ChevronLeftIcon />
                    Home
                </Link>
            </Button>
            <ThemeSwitcher />
        </div>
    )
}
