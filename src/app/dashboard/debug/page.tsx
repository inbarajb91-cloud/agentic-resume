'use client'

import { useState } from 'react'
import { runDiagnostics } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DebugPage() {
    const [logs, setLogs] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

    async function handleRun() {
        setLoading(true)
        setLogs(['Running diagnostics...'])
        try {
            const result = await runDiagnostics()
            setLogs(result.logs)
        } catch (e: any) {
            setLogs(prev => [...prev, `[Fatal Error] Action failed: ${e.message}`])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8 space-y-4">
            <h1 className="text-2xl font-bold">System Diagnostics</h1>
            <p className="text-muted-foreground">Run this to check database permissions and connectivity.</p>

            <Button onClick={handleRun} disabled={loading}>
                {loading ? 'Running...' : 'Run Diagnostics'}
            </Button>

            {logs.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Logs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-x-auto">
                            {logs.map((log, i) => (
                                <div key={i} className={log.includes('[Error]') || log.includes('[Critical]') ? 'text-red-400' : 'text-green-400'}>
                                    {log}
                                </div>
                            ))}
                        </pre>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
