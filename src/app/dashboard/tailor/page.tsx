'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Sparkles } from 'lucide-react'
import { useFormState, useFormStatus } from 'react-dom'
import { createTailoredResume } from './actions'
import { toast } from 'sonner'
import { useEffect } from 'react'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing & Tailoring...
                </>
            ) : (
                <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Tailored Resume
                </>
            )}
        </Button>
    )
}

const initialState = {
    error: '',
}

export default function TailorPage() {
    // @ts-ignore
    const [state, formAction] = useFormState(createTailoredResume, initialState)

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error)
        }
    }, [state])

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-serif font-bold">New Application</h1>
                <p className="text-muted-foreground">
                    Paste the Job Description below. Gemini will analyze it against your vault and create a perfect resume.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Job Details</CardTitle>
                    <CardDescription>Target role information</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="jobTitle">Job Title</Label>
                            <Input
                                id="jobTitle"
                                name="jobTitle"
                                placeholder="e.g. Senior Product Manager"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="jobDescription">Job Description (JD)</Label>
                            <Textarea
                                id="jobDescription"
                                name="jobDescription"
                                placeholder="Paste the full job description here..."
                                className="min-h-[300px] font-mono text-sm leading-relaxed"
                                required
                            />
                        </div>
                        <SubmitButton />
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
