import { Button } from '@/components/ui/button'
import { Plus, Upload } from 'lucide-react'
import { Suspense } from 'react'
import { getExperience } from './actions'
import ExperienceList from '@/components/vault/experience-list'
import { AddExperienceDialog } from '@/components/vault/add-experience-dialog'
import { ResumeUploadDialog } from '@/components/vault/resume-upload-dialog'

export default async function VaultPage() {
    const experiences = await getExperience()

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight">Career Vault</h1>
                    <p className="text-muted-foreground">
                        Manage your master record of experience. The AI uses this to tailor your resumes.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <ResumeUploadDialog />
                    <AddExperienceDialog />
                </div>
            </div>

            <div className="border rounded-lg p-6 bg-card">
                <Suspense fallback={<div>Loading vault...</div>}>
                    <ExperienceList initialData={experiences} />
                </Suspense>
            </div>
        </div>
    )
}
