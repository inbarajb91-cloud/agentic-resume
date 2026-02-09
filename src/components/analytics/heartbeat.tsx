'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useRef } from 'react'

export function AnalyticsHeartbeat({ resumeId }: { resumeId: string }) {
    const startTime = useRef(Date.now())

    useEffect(() => {
        const interval = setInterval(async () => {
            const duration = Math.floor((Date.now() - startTime.current) / 1000)

            // Only ping every 10 seconds to save DB writes
            if (duration > 0 && duration % 10 === 0) {
                const supabase = createClient()
                await supabase.from('analytics').insert({
                    resume_id: resumeId,
                    event_type: 'heartbeat',
                    duration_seconds: 10 // logs a 10s increment
                })
            }
        }, 10000)

        // Log initial view
        const logInitialView = async () => {
            const supabase = createClient()
            await supabase.from('analytics').insert({
                resume_id: resumeId,
                event_type: 'view',
                duration_seconds: 0
            })
        }
        logInitialView()

        return () => clearInterval(interval)
    }, [resumeId])

    return null
}
