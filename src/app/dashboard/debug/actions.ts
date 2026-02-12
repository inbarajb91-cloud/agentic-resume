'use server'

import { createClient } from '@/lib/supabase/server'

export async function runDiagnostics() {
    const supabase = await createClient()
    const logs: string[] = []

    // 1. Check Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { success: false, logs: ['[Error] Not Authenticated or Auth Error: ' + authError?.message] }
    }
    logs.push(`[Success] Authenticated as User ID: ${user.id}`)
    logs.push(`[Info] Email: ${user.email}`)

    // 2. Check Profile Existence
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (profileError) {
        logs.push(`[Error] Could not fetch profile: ${profileError.message} (Code: ${profileError.code})`)
    } else if (!profile) {
        logs.push(`[Critical] Profile NOT FOUND for User ID: ${user.id}`)
    } else {
        logs.push(`[Success] Profile Found. Full Name: ${profile.full_name}`)
    }

    // 3. Test Profile Write (Upsert)
    const { error: upsertError } = await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email!,
        updated_at: new Date().toISOString(),
        full_name: profile?.full_name || 'Debug Test'
    })

    if (upsertError) {
        logs.push(`[Error] Profile Write FAILED: ${upsertError.message} (Code: ${upsertError.code})`)
        logs.push(`[Hint] If code is 42501, it is an RLS (Policy) permission error.`)
    } else {
        logs.push(`[Success] Profile Write (Upsert) Successful`)
    }

    // 4. Test Experience Vault Write
    if (profile) {
        const { error: vaultError } = await supabase.from('experience_vault').insert({
            user_id: user.id,
            type: 'skill',
            title: 'Debug Skill',
            description_raw: 'Temporary debug entry'
        })

        if (vaultError) {
            logs.push(`[Error] Vault Write FAILED: ${vaultError.message} (Code: ${vaultError.code})`)
        } else {
            logs.push(`[Success] Vault Write Successful`)
        }
    } else {
        logs.push(`[Skip] Skipping Vault Write Test because Profile is missing (Foreign Key would fail)`)
    }

    return { success: true, logs }
}
