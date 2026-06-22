import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const supabase = await createClient()

    // Check if a user's logged in
    const { data: claimsData } = await supabase.auth.getClaims()

    // invalidate session token
    if (claimsData?.claims) {
        await supabase.auth.signOut()
    }

    revalidatePath('/', 'layout') // flush layout cache
    
    // redirect
    return NextResponse.redirect(new URL('/login', req.url), {
        status: 302,
    })
}