'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ExperienceItem = {
    id: string
    type: 'work' | 'education' | 'project' | 'skill'
    title: string
    organization: string | null
    start_date: string | null
    end_date: string | null
    description_raw: string | null
}

export async function getExperience() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('experience_vault')
        .select('*')
        .order('start_date', { ascending: false })

    if (error) throw new Error(error.message)
    return data as ExperienceItem[]
}

export async function deleteExperience(id: string) {
    const supabase = await createClient()
    await supabase.from('experience_vault').delete().eq('id', id)
    revalidatePath('/dashboard/vault')
}

export async function createExperience(data: Omit<ExperienceItem, 'id'>) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase.from('experience_vault').insert({
        ...data,
        user_id: user.id,
    })

    if (error) throw new Error(error.message)
    revalidatePath('/dashboard/vault')
}
