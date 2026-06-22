import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    // create server client on every request
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
        cookies: {
            getAll() {
            return request.cookies.getAll()
            },
            setAll(cookiesToSet, headers) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
                request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
                supabaseResponse.cookies.set(name, value, options)
            )
            Object.entries(headers).forEach(([key, value]) =>
                supabaseResponse.headers.set(key, value)
            )
            },
        },
        }
    )

    // fetch claims to verify identity
    const { data } = await supabase.auth.getClaims()
    const user = data?.claims

    const url = request.nextUrl.clone()
    const path = url.pathname

    // define route groups
    const isAuthPage = path === '/login' || path === '/signup'
    const isProtectedPage = path === '/account' || path === '/dashboard' || path.startsWith('/editor')
    const isHomePage = path === '/'

    // if authenticated user tries to access homepage or auth page --> redirect to dashboard
    if (user) {
        if (isAuthPage || isHomePage) {
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
        }
    }

    // if unauthenticated user tries to access protected page --> redirect to login
    if (!user) {
        if (isProtectedPage) {
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }
    }

    // return standard response otherwise
    return supabaseResponse
}