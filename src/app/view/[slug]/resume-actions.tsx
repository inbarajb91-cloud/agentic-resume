'use client'

import { Button } from '@/components/ui/button'
import { Download, Share2 } from 'lucide-react'
import { PDFDownloadButton } from '@/components/pdf/pdf-download-button'

export function ResumeActions({ content, profile }: { content: any, profile: any }) {
    return (
        <div className="sticky top-4 z-50 flex justify-end gap-2 pointer-events-none print:hidden">
            <div className="pointer-events-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur shadow-lg rounded-full p-2 flex gap-2 border">
                <PDFDownloadButton content={content} profile={profile} />
                <Button size="sm" variant="ghost" className="rounded-full" onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    alert('Link copied to clipboard!')
                }}>
                    <Share2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
