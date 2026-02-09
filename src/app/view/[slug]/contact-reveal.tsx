'use client'

import { Button } from '@/components/ui/button'
import { Mail, Phone } from 'lucide-react'
import { useState } from 'react'

interface ContactRevealProps {
    email: string
    phone?: string | null
    phoneMasked: boolean
}

export function ContactReveal({ email, phone, phoneMasked }: ContactRevealProps) {
    const [revealed, setRevealed] = useState(false)

    // Demo logic: In a real app, this would verify a captcha or log the reveal event
    const handleReveal = () => {
        setRevealed(true)
    }

    return (
        <div className="flex flex-wrap justify-center gap-6 pt-4 text-sm font-medium text-gray-400">
            <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{email}</span>
            </div>
            {phone && (
                <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {phoneMasked && !revealed ? (
                        <>
                            <span className="blur-sm select-none">0000000000</span>
                            <Button variant="secondary" size="sm" className="h-6 text-xs ml-2" onClick={handleReveal}>
                                Reveal
                            </Button>
                        </>
                    ) : (
                        <span>{phone}</span>
                    )}
                </div>
            )}
        </div>
    )
}
