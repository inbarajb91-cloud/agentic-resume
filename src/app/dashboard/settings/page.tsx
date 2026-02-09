'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch' // You might need to install this if not available
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function SettingsPage() {
    const [loading, setLoading] = useState(false)
    const [initLoading, setInitLoading] = useState(true)
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        linkedin_url: '',
        portfolio_url: '',
        phone_masked: true
    })

    useEffect(() => {
        async function loadProfile() {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
                if (data) {
                    setFormData({
                        full_name: data.full_name || '',
                        email: user.email || '',
                        phone: data.phone || '',
                        linkedin_url: data.linkedin_url || '',
                        portfolio_url: data.portfolio_url || '',
                        phone_masked: data.phone_masked
                    })
                }
            }
            setInitLoading(false)
        }
        loadProfile()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        const { error } = await supabase.from('profiles').upsert({
            id: user.id,
            email: formData.email,
            full_name: formData.full_name,
            phone: formData.phone,
            linkedin_url: formData.linkedin_url,
            portfolio_url: formData.portfolio_url,
            phone_masked: formData.phone_masked,
            updated_at: new Date().toISOString(),
        })

        if (error) {
            toast.error('Failed to update profile')
        } else {
            toast.success('Profile updated')
        }
        setLoading(false)
    }

    if (initLoading) return <div>Loading settings...</div>

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-serif font-bold">Settings</h1>
                <p className="text-muted-foreground">Manage your master contact information.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>This information is displayed on your tailored resumes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input
                                value={formData.full_name}
                                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+1 234 567 890"
                            />
                        </div>
                        <div className="flex items-center justify-between border p-4 rounded-lg">
                            <div className="space-y-0.5">
                                <Label>Mask Phone Number</Label>
                                <p className="text-sm text-muted-foreground">Recruiters must click "Reveal" to see it.</p>
                            </div>
                            {/* Simple Checkbox as Switch replacement if Switch is not installed, or use Input type checkbox */}
                            <input
                                type="checkbox"
                                className="h-5 w-5"
                                checked={formData.phone_masked}
                                onChange={e => setFormData({ ...formData, phone_masked: e.target.checked })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>LinkedIn URL</Label>
                            <Input
                                value={formData.linkedin_url}
                                onChange={e => setFormData({ ...formData, linkedin_url: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Portfolio URL</Label>
                            <Input
                                value={formData.portfolio_url}
                                onChange={e => setFormData({ ...formData, portfolio_url: e.target.value })}
                            />
                        </div>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
