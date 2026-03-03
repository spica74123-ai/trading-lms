"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Crown, Zap, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";

export default function SubscriptionPage() {
    const [loading, setLoading] = useState(false);
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    async function handleUpgrade() {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        // อัปเดต Role เป็น VIP (Role ID 2 ตามที่คุณวางโครงสร้างไว้)
        const { error } = await supabase
            .from('user_roles')
            .update({ role_id: 2 })
            .eq('user_id', user?.id);

        if (!error) {
            // ส่งอีเมลต้อนรับ
            try {
                await fetch('/api/welcome-vip', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: user?.email,
                        name: user?.user_metadata?.full_name || 'VIP Member'
                    }),
                });
            } catch (err) {
                console.error('Failed to send email:', err);
            }

            toast.success("อัปเกรดเป็น VIP และส่งอีเมลต้อนรับเรียบร้อย! ✨");
            setTimeout(() => window.location.href = "/dashboard", 2000);
        } else {
            toast.error("การสมัครสมาชิกล้มเหลว กรุณาลองใหม่");
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white p-8 flex flex-col items-center justify-center">
            <Toaster position="top-center" />
            <div className="max-w-4xl w-full">
                <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white mb-10 transition-colors">
                    <ArrowLeft size={20} /> กลับไปหน้าแรก
                </Link>

                <div className="text-center mb-16">
                    <h1 className="text-4xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-red-500">
                        Creative Investment VIP
                    </h1>
                    <p className="text-gray-400 font-light">ปลดล็อกขีดจำกัดการเทรดด้วยแผนสมาชิกที่ทรงพลังที่สุด</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Free Plan */}
                    <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-[2.5rem]">
                        <h3 className="text-xl font-bold mb-2">Student</h3>
                        <p className="text-3xl font-black mb-6">฿0</p>
                        <ul className="space-y-4 mb-10">
                            <li className="flex items-center gap-3 text-sm text-gray-400"><Check size={18} className="text-blue-500" /> เข้าถึงบทเรียนพื้นฐาน</li>
                            <li className="flex items-center gap-3 text-sm text-gray-400"><Check size={18} className="text-blue-500" /> ระบบ Dashboard ส่วนตัว</li>
                        </ul>
                        <button disabled className="w-full bg-gray-800 py-4 rounded-2xl font-bold opacity-50 cursor-not-allowed">แผนปัจจุบัน</button>
                    </div>

                    {/* VIP Plan */}
                    <div className="bg-gray-900 border-2 border-red-500/30 p-8 rounded-[2.5rem] relative shadow-[0_0_50px_rgba(239,68,68,0.1)]">
                        <div className="absolute top-4 right-6 bg-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Recommended</div>
                        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">VIP <Crown size={18} className="text-yellow-500" /></h3>
                        <p className="text-3xl font-black mb-6">฿2,990 <span className="text-sm text-gray-500 font-normal">/ ปี</span></p>
                        <ul className="space-y-4 mb-10">
                            <li className="flex items-center gap-3 text-sm"><Zap size={18} className="text-red-500" /> ปลดล็อก SMC & ICT Mastery</li>
                            <li className="flex items-center gap-3 text-sm"><Zap size={18} className="text-red-500" /> ระบบตรวจการบ้านโดย Mentor</li>
                            <li className="flex items-center gap-3 text-sm"><Zap size={18} className="text-red-500" /> Exclusive Trading Journal</li>
                        </ul>
                        <button
                            onClick={handleUpgrade}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-700 to-red-600 py-4 rounded-2xl font-black hover:opacity-90 transition-all shadow-lg shadow-red-500/20"
                        >
                            {loading ? "กำลังอัปเกรด..." : "อัปเกรดเป็น VIP ทันที"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
