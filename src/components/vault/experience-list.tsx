'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Trash2 } from 'lucide-react'
import { deleteExperience, type ExperienceItem } from '@/app/dashboard/vault/actions'
import { toast } from 'sonner'

export default function ExperienceList({ initialData }: { initialData: ExperienceItem[] }) {
    const handleDelete = async (id: string) => {
        try {
            await deleteExperience(id)
            toast.success("Entry deleted")
        } catch (e) {
            toast.error("Failed to delete")
        }
    }

    if (initialData.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Your vault is empty.</p>
                <p className="text-sm text-muted-foreground">Import a resume to get started quickly.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {initialData.map((item) => (
                <Card key={item.id} className="group relative overflow-hidden transition-all hover:shadow-md">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-lg">{item.title}</h3>
                                    <Badge variant="secondary" className="uppercase text-[10px]">{item.type}</Badge>
                                </div>
                                <p className="text-sm font-medium text-muted-foreground">{item.organization}</p>
                                <div className="text-xs text-muted-foreground mt-1">
                                    {item.start_date} - {item.end_date || 'Present'}
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleDelete(item.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        {item.description_raw && (
                            <p className="mt-4 text-sm whitespace-pre-line line-clamp-3 text-muted-foreground">
                                {item.description_raw}
                            </p>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
