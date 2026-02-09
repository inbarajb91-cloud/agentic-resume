import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { Eye, Clock, FileText, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return <div>Please login</div>

    // Fetch stats (mocking some aggregations or doing them in application layer for now)
    const { data: resumes } = await supabase
        .from('tailored_resumes')
        .select('id, job_title_target, slug, created_at, analytics(count), match_score')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    const { data: allAnalytics } = await supabase
        .from('analytics')
        .select('*')
    // Ideally filter by user's resumes, but RLS handles it if we select carefully
    // For summary stats, let's just use what we have in resumes join if possible, or separate query
    // Supabase join-count is 'analytics(count)' which gives number of rows.

    // Let's compute totals manually for this MVP
    // a more performant way is RPC or dedicated aggregation view

    let totalViews = 0
    let totalResumes = resumes?.length || 0
    let avgMatchScore = 0

    if (resumes?.length) {
        const totalScore = resumes.reduce((acc, curr) => acc + (curr.match_score || 0), 0)
        avgMatchScore = Math.floor(totalScore / totalResumes)

        // The (count) from select is slightly tricky in typed client without strict types, 
        // let's assume we map it or just rely on a separate query for total views if needed.
        // Actually, let's just list the resumes and their individual view counts if we can get them.
        // Since 'analytics(count)' is an aggregate, let's try to get raw analytics for accurate "Total Views"

        // Alternative: fetch all analytics for these resume IDs
        const resumeIds = resumes.map(r => r.id)
        if (resumeIds.length > 0) {
            const { count } = await supabase
                .from('analytics')
                .select('*', { count: 'exact', head: true })
                .in('resume_id', resumeIds)
                .eq('event_type', 'view')

            totalViews = count || 0
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold tracking-tight">Overview</h1>
                <p className="text-muted-foreground">Welcome back to your career command center.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalResumes}</div>
                        <p className="text-xs text-muted-foreground">Tailored resumes generated</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalViews}</div>
                        <p className="text-xs text-muted-foreground">Recruiter visits</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Match Score</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgMatchScore}%</div>
                        <p className="text-xs text-muted-foreground">Optimization Level</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Applications Table */}
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Recent Applications</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {resumes?.map((resume) => (
                            <div key={resume.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                <div className="space-y-1">
                                    <p className="font-medium leading-none">{resume.job_title_target}</p>
                                    <p className="text-sm text-muted-foreground">Created on {new Date(resume.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-sm font-medium text-right">
                                        <div className="text-green-600">{resume.match_score}% Match</div>
                                    </div>
                                    <Link href={`/dashboard/tailor/${resume.id}`}>
                                        <Button variant="ghost" size="sm">View</Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                        {(!resumes || resumes.length === 0) && (
                            <div className="text-center py-8 text-muted-foreground">
                                No applications yet. Start by adding to your vault!
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// Helper to fix missing Button import (likely to happen)
import { Button } from '@/components/ui/button'
