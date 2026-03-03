import { createServerClient, type NextRequest } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            response.cookies.set({ name, value, ...options })
                        );
                    } catch {
                        // The `setAll` method is called from middleware
                    }
                },
            }
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // ถ้าเข้าหน้า /admin แต่ไม่ใช่ Admin ให้ส่งกลับไป Dashboard
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const { data: roleData } = await supabase
            .from('user_roles')
            .select('roles(role_name)')
            .eq('user_id', user?.id)
            .single()

        const roleName = (roleData as any)?.roles?.role_name
        if (roleName !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
