'use client'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Upload } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { parseAndSaveResume } from '@/app/dashboard/vault/parse-action'

export function ResumeUploadDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.currentTarget)

        try {
            const result = await parseAndSaveResume(formData)
            toast.success(`Successfully parsed ${result.count} items!`)
            setOpen(false)
        } catch (error) {
            // @ts-ignore
            toast.error("Upload failed", { description: error.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Import Resume
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Import Resume</DialogTitle>
                    <DialogDescription>
                        Upload your existing resume (PDF). AI will parse it and populate your vault.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpload} className="space-y-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="resume">Resume (PDF)</Label>
                        <Input id="resume" name="file" type="file" accept=".pdf" required />
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? 'Parsing...' : 'Upload & Parse'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
