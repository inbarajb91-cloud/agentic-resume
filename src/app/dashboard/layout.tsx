import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { Briefcase, FileText, LayoutDashboard, LogOut, Settings, Upload, Sparkles, Menu } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const navItems = [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/vault', label: 'Career Vault', icon: Briefcase },
        { href: '/dashboard/tailor', label: 'Tailor Resume', icon: Sparkles },
        // { href: '/dashboard/resumes', label: 'My Resumes', icon: FileText },
        { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    ]

    return (
        <div className="flex min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
            {/* Sidebar (Desktop) */}
            <aside className="hidden w-64 border-r bg-background lg:block">
                <div className="flex h-14 items-center border-b px-4 font-serif font-bold text-lg">
                    Agentic Resume
                </div>
                <div className="flex flex-col gap-2 p-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-primary"
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </div>
                <div className="mt-auto p-4 border-t">
                    <UserProfile user={user} />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <div className="lg:hidden flex h-14 items-center gap-4 border-b bg-background px-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                            <div className="flex h-14 items-center border-b px-4 font-serif font-bold text-lg">
                                Agentic Resume
                            </div>
                            <nav className="grid gap-2 text-lg font-medium p-4">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                            <div className="mt-auto p-4 border-t">
                                <UserProfile user={user} />
                            </div>
                        </SheetContent>
                    </Sheet>
                    <div className="font-serif font-bold text-lg">Agentic Resume</div>
                </div>

                <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}

function UserProfile({ user }: { user: any }) {
    return (
        <>
            <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {user.email?.[0].toUpperCase()}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{user.email}</p>
                </div>
            </div>
            <form action="/auth/signout" method="post">
                <Button variant="outline" className="w-full justify-start gap-2" type="submit">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </Button>
            </form>
        </>
    )
}
