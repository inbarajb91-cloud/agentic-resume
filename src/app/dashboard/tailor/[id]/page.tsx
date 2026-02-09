import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, Download, Eye, Share2 } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ResumeViewPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { data: resume } = await supabase
        .from('tailored_resumes')
        .select('*')
        .eq('id', params.id)
        .single()

    if (!resume) notFound()

    const content = resume.content as any
    const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/view/${resume.slug}`

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
                <Link href="/dashboard/tailor">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Applications
                    </Button>
                </Link>
                <div className="flex gap-2">
                    <Link href={publicUrl} target="_blank">
                        <Button variant="outline">
                            <Eye className="mr-2 h-4 w-4" />
                            Public View
                        </Button>
                    </Link>
                    <Button>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Resume Content */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="min-h-[800px] shadow-lg border-t-4 border-t-primary">
                        <CardHeader className="text-center space-y-4 pb-8 border-b">
                            <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100">
                                {content.name || 'Candidate Name'}
                            </h1>
                            <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                                <span>{content.email || 'email@example.com'}</span>
                                <span>•</span>
                                <span>{content.phone || '+1 234 567 890'}</span>
                                <span>•</span>
                                <span>{content.location || 'City, Country'}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-8 pt-8">
                            {/* Professional Summary */}
                            <section>
                                <h2 className="text-lg font-bold uppercase tracking-widest text-primary mb-3">Professional Summary</h2>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {content.summary}
                                </p>
                            </section>

                            {/* Experience */}
                            <section>
                                <h2 className="text-lg font-bold uppercase tracking-widest text-primary mb-4">Experience</h2>
                                <div className="space-y-6">
                                    {content.tailored_experiences?.map((exp: any, i: number) => (
                                        <div key={i}>
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-bold text-gray-900 dark:text-gray-100">{exp.title}</h3>
                                                <span className="text-sm text-gray-500 font-medium">{exp.start_date} - {exp.end_date || 'Present'}</span>
                                            </div>
                                            <div className="text-primary font-medium text-sm mb-2">{exp.organization}</div>
                                            <ul className="list-disc list-outside ml-4 space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                                                {exp.bullets.map((bullet: string, j: number) => (
                                                    <li key={j}>{bullet}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Match Score</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-center py-4">
                                <div className="relative flex items-center justify-center">
                                    <svg className="h-32 w-32 transform -rotate-90">
                                        <circle
                                            className="text-gray-200"
                                            strokeWidth="8"
                                            stroke="currentColor"
                                            fill="transparent"
                                            r="58"
                                            cx="64"
                                            cy="64"
                                        />
                                        <circle
                                            className="text-primary transition-all duration-1000 ease-out"
                                            strokeWidth="8"
                                            strokeDasharray={58 * 2 * Math.PI}
                                            strokeDashoffset={58 * 2 * Math.PI - (resume.match_score || 0) / 100 * 58 * 2 * Math.PI}
                                            strokeLinecap="round"
                                            stroke="currentColor"
                                            fill="transparent"
                                            r="58"
                                            cx="64"
                                            cy="64"
                                        />
                                    </svg>
                                    <span className="absolute text-4xl font-bold">{resume.match_score}%</span>
                                </div>
                            </div>
                            <div className="text-center text-sm text-muted-foreground">
                                Optimization for {resume.job_title_target}.
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Job Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Status</span>
                                <Badge variant="secondary">Active</Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Views</span>
                                <span className="font-mono font-bold">0</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
