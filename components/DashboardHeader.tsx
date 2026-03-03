"use client";

import { useEffect, useState } from "react";
import { Crown, Medal, Award } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

interface DashboardHeaderProps {
    userName?: string;
}

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
    const [badge, setBadge] = useState<string | null>(null);
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        async function checkBadge() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from('top_traders_badges')
                .select('badge_type')
                .eq('user_id', user.id)
                .single();

            if (data) setBadge(data.badge_type);
        }
        checkBadge();
    }, [supabase]);

    return (
        <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
                <h1 className="text-4xl font-black text-white">
                    Welcome Back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-red-500">{userName || "Trader"}</span>
                </h1>

                <div className="flex gap-2">
                    {/* ระบบแสดง Badge อัตโนมัติ */}
                    {badge === 'gold' && (
                        <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/50 px-3 py-1 rounded-full animate-pulse h-fit">
                            <Crown size={14} className="text-yellow-500" />
                            <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">#1 Top Trader</span>
                        </div>
                    )}
                    {badge === 'silver' && (
                        <div className="flex items-center gap-1 bg-gray-400/10 border border-gray-400/50 px-3 py-1 rounded-full h-fit">
                            <Medal size={14} className="text-gray-400" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">#2 Silver Rank</span>
                        </div>
                    )}
                    {badge === 'bronze' && (
                        <div className="flex items-center gap-1 bg-orange-700/10 border border-orange-700/50 px-3 py-1 rounded-full h-fit">
                            <Award size={14} className="text-orange-700" />
                            <span className="text-[10px] font-black text-orange-700 uppercase tracking-widest">#3 Bronze Rank</span>
                        </div>
                    )}
                </div>
            </div>
            <p className="text-gray-400 mt-2">ยินดีต้อนรับเข้าสู่ระบบเรียนเทรดอัจฉริยะของคุณ</p>
        </div>
    );
}
