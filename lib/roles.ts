import { createBrowserClient } from "@supabase/ssr";

export async function getUserRole() {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return "student";
    const { data } = await supabase.from('user_roles').select('roles(role_name)').eq('user_id', user.id).single();
    return (data as any)?.roles?.role_name || "student";
}