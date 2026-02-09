'use client'

import { Button } from '@/components/ui/button'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { Download, Loader2 } from 'lucide-react'
import { ResumePDF } from './resume-pdf'
import { useEffect, useState } from 'react'

export function PDFDownloadButton({ content, profile }: { content: any, profile: any }) {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) return <Button size="sm" disabled><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...</Button>

    return (
        <PDFDownloadLink
            document={<ResumePDF content={content} profile={profile} />}
            fileName={`${profile.full_name || 'Resume'}.pdf`}
        >
            {/* @ts-ignore */}
            {({ blob, url, loading, error }) => (
                <Button size="sm" variant="default" className="rounded-full" disabled={loading}>
                    {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Download className="mr-2 h-4 w-4" />
                    )}
                    Download PDF
                </Button>
            )}
        </PDFDownloadLink>
    )
}
