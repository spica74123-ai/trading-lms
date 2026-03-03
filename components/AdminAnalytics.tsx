"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Users, Crown, MousePointerClick, TrendingUp, BarChart3, Calendar } from "lucide-react";

export default function AdminAnalytics() {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalVips: 0,
        pendingVips: 0,
        conversionRate: 0
    });
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        async function fetchAnalytics() {
            // 1. ดึงจำนวนนักเรียนทั้งหมด
            const { count: studentCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

            // 2. ดึงจำนวน VIP ทั้งหมด
            const { count: vipCount } = await supabase.from('user_roles').select('*', { count: 'exact', head: true }).eq('role_id', 2);

            // 3. ดึงคำขอที่ค้างอยู่
            const { count: pendingCount } = await supabase.from('vip_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending');

            const convRate = studentCount ? (Number(vipCount) / Number(studentCount)) * 100 : 0;

            setStats({
                totalStudents: studentCount || 0,
                totalVips: vipCount || 0,
                pendingVips: pendingCount || 0,
                conversionRate: convRate
            });
        }
        fetchAnalytics();
    }, [supabase]);

    return (
        <div className="text-white">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
                        <BarChart3 className="text-red-500" /> Executive Analytics
                    </h1>
                    <p className="text-gray-500 text-sm font-light">ข้อมูลสรุปประสิทธิภาพและอัตราการเติบโตของสถาบัน</p>
                </div>
                <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-4 py-2 rounded-2xl text-xs text-gray-400">
                    <Calendar size={14} /> ข้อมูลประจำเดือน มีนาคม 2026
                </div>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-gray-900 border border-gray-800 p-8 rounded-[2rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users size={64} />
                    </div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">Total Students</p>
                    <h2 className="text-4xl font-black mb-1">{stats.totalStudents}</h2>
                    <p className="text-[10px] text-blue-500 font-bold flex items-center gap-1">
                        <TrendingUp size={12} /> +12% from last month
                    </p>
                </div>

                <div className="bg-gray-900 border border-gray-800 p-8 rounded-[2rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Crown size={64} className="text-yellow-500" />
                    </div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">VIP Members</p>
                    <h2 className="text-4xl font-black mb-1 text-yellow-500">{stats.totalVips}</h2>
                    <p className="text-[10px] text-gray-400 font-bold">Active VIP Access</p>
                </div>

                <div className="bg-gray-900 border border-gray-800 p-8 rounded-[2rem] relative overflow-hidden group border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.05)]">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">Pending VIP</p>
                    <h2 className="text-4xl font-black mb-1 text-red-500">{stats.pendingVips}</h2>
                    <p className="text-[10px] text-gray-400 font-bold">Waiting for Approval</p>
                </div>

                <div className="bg-gray-900 border border-gray-800 p-8 rounded-[2rem] relative overflow-hidden group">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">Conversion Rate</p>
                    <h2 className="text-4xl font-black mb-1 text-blue-500">{stats.conversionRate.toFixed(1)}%</h2>
                    <p className="text-[10px] text-gray-400 font-bold">Student to VIP Ratio</p>
                </div>
            </div>

            {/* Partner Growth Chart */}
            <div className="bg-gray-900 border border-gray-800 p-10 rounded-[3rem] h-80 flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center text-blue-500 mb-4">
                    <MousePointerClick size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Partner Link Performance</h3>
                <p className="text-sm text-gray-500 max-w-sm font-light">ระบบกำลังรวบรวมข้อมูล Click-through rate จากลิงก์พาร์ทเนอร์ของคุณ เพื่อประเมินความสนใจของนักเรียน</p>
            </div>
        </div>
    );
}
