import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ResumeActions } from './resume-actions'
import { ContactReveal } from './contact-reveal'
import { AnalyticsHeartbeat } from '@/components/analytics/heartbeat'

async function logView(resumeId: string) {
    // console log to simulate analytics
    // In prod, this would use a proper analytics service or a non-blocking DB write
    console.log(`View logged for resume: ${resumeId}`)
}

export default async function PublicResumePage({ params }: { params: { slug: string } }) {
    const supabase = await createClient()
    const { data: resume } = await supabase
        .from('tailored_resumes')
        .select('*, profiles(full_name, email, phone, phone_masked)')
        .eq('slug', params.slug)
        .single()

    if (!resume || !resume.is_public) notFound()

    // Fire and forget analytics
    logView(resume.id)

    const content = resume.content as any
    const profile = resume.profiles as any

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 print:p-0 print:bg-white">
            <AnalyticsHeartbeat resumeId={resume.id} />
            <div className="max-w-4xl mx-auto space-y-8 print:space-y-0">
                <ResumeActions content={content} profile={profile} />

                <Card className="shadow-xl border-none overflow-hidden print:shadow-none print:border-none print:rounded-none">
                    {/* Elegant Header */}
                    <div className="bg-gray-900 text-white p-12 text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">
                            {profile.full_name || content.name}
                        </h1>
                        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                            {content.summary}
                        </p>

                        <ContactReveal
                            email={profile.email}
                            phone={profile.phone || content.phone}
                            phoneMasked={profile.phone_masked}
                        />
                    </div>

                    <CardContent className="p-8 md:p-12 space-y-12">
                        {/* Experience Section */}
                        <section>
                            <div className="flex items-center gap-4 mb-8">
                                <h2 className="text-xl font-bold uppercase tracking-widest text-primary">Experience</h2>
                                <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1" />
                            </div>

                            <div className="space-y-10">
                                {content.tailored_experiences?.map((exp: any, i: number) => (
                                    <div key={i} className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-800">
                                        <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-white dark:bg-gray-900 border-2 border-primary" />
                                        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{exp.title}</h3>
                                            <span className="text-sm font-mono text-gray-500">{exp.start_date} — {exp.end_date || 'Present'}</span>
                                        </div>
                                        <div className="text-primary font-medium mb-4">{exp.organization}</div>
                                        <ul className="space-y-2 text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {exp.bullets.map((bullet: string, j: number) => (
                                                <li key={j} className="flex gap-2">
                                                    <span className="text-primary mt-1.5">•</span>
                                                    <span>{bullet}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Skills Section (if generated) */}
                        {content.skills && (
                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <h2 className="text-xl font-bold uppercase tracking-widest text-primary">Skills</h2>
                                    <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1" />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {content.skills.map((skill: string, i: number) => (
                                        <Badge key={i} variant="secondary" className="px-3 py-1 text-sm">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </section>
                        )}
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center text-sm text-gray-400 pb-8">
                    <p>Generated by Agentic Resume</p>
                </div>
            </div>
        </div >
    )
}
