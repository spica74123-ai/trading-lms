"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Bell, X, Info, AlertTriangle } from "lucide-react";

export default function AnnouncementBanner() {
    interface Announcement {
        title: string;
        content: string;
        type: 'info' | 'warning' | 'urgent';
    }
    const [news, setNews] = useState<Announcement[]>([]);
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const fetchNews = async () => {
            // ดึงประกาศที่ is_active = true และเป็นตัวล่าสุด
            // หมายเหตุ: ตาม schema ปัจจุบัน อาจจะไม่มีฟิลด์ is_active ถ้ามี error ให้เอา .eq('is_active', true) ออก
            const { data } = await supabase
                .from('announcements')
                .select('*')
                // .eq('is_active', true) // ถ้าในระบบคุณมี column นี้ให้เปิดใช้
                .order('created_at', { ascending: false })
                .limit(1);

            setNews(data as Announcement[] || []);
        };
        fetchNews();
    }, [supabase]);

    if (news.length === 0) return null;

    const item = news[0];
    const colors: Record<string, string> = {
        info: "border-blue-500/20 bg-blue-500/5 text-blue-400",
        warning: "border-yellow-500/20 bg-yellow-500/5 text-yellow-400",
        urgent: "border-red-500/20 bg-red-500/5 text-red-400"
    };

    return (
        <div className={`mb-8 p-4 rounded-2xl border ${colors[item.type] || colors.info} flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500 shadow-lg`}>
            <div className="mt-1 flex-shrink-0">
                {item.type === 'urgent' ? <AlertTriangle size={20} className="animate-pulse" /> : <Info size={20} />}
            </div>
            <div className="flex-1">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                    <Bell size={14} /> {item.title}
                </h3>
                <p className="text-sm opacity-80 leading-relaxed">{item.content}</p>
            </div>
            <button
                onClick={() => setNews([])}
                className="opacity-50 hover:opacity-100 hover:bg-black/20 p-2 rounded-xl transition-all flex-shrink-0"
                aria-label="Close announcement"
            >
                <X size={18} />
            </button>
        </div>
    );
}
