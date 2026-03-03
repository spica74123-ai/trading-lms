"use client";

import { useEffect, useState } from "react";
import { getUserRole } from "@/lib/roles";
import {
    ShieldAlert,
    Users,
    BookOpen,
    CheckSquare,
    BarChart3,
    ArrowLeft,
    Megaphone,
    LayoutGrid
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function check() {
            setLoading(true);
            const currentRole = await getUserRole();
            setRole(currentRole);
            setLoading(false);
        }
        check();
    }, []);

    if (loading) {
        return (
            <div className="h-screen bg-gray-950 flex flex-col items-center justify-center text-white">
                <div className="w-12 h-12 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (role !== "admin" && role !== "mentor") {
        return (
            <div className="h-screen bg-black flex flex-col items-center justify-center text-white p-6 text-center">
                <ShieldAlert size={64} className="text-red-500 mb-4 animate-bounce" />
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p className="text-gray-500 mt-2 max-w-md">พื้นที่ส่วนตัว: เฉพาะ Admin และ Mentor เท่านั้นที่มีสิทธิ์เข้าถึงหน้านี้</p>
                <Link href="/dashboard" className="mt-8 bg-red-600/10 border border-red-600/50 hover:bg-red-600 hover:text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all">
                    <ArrowLeft size={16} /> กลับสู่ Dashboard
                </Link>
            </div>
        );
    }

    const navLinks = [
        { href: "/admin/vip-requests", label: "อนุมัติสิทธิ์ VIP", icon: Users },
        { href: "/admin/courses", label: "จัดการบทเรียน", icon: BookOpen },
        { href: "/admin/reviews", label: "ตรวจรีวิวผลกำไร", icon: CheckSquare },
        { href: "/admin/rankings", label: "จัดการ Ranking", icon: BarChart3 },
        { href: "/admin/announcements", label: "จัดการประกาศ", icon: Megaphone },
        { href: "/admin/menus", label: "จัดการเมนู", icon: LayoutGrid },
    ];

    return (
        <div className="min-h-screen bg-[#020617] flex">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col fixed inset-y-0 left-0 z-50">
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-red-600/20 text-xl">A</div>
                    <div className="flex flex-col">
                        <span className="font-black text-white tracking-widest uppercase text-xs">Admin Panel</span>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Trading Mastery LMS</span>
                    </div>
                </div>

                <nav className="flex flex-col gap-1 text-sm">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="group p-3 hover:bg-red-600/5 rounded-xl flex items-center gap-3 text-gray-400 hover:text-white transition-all border border-transparent hover:border-red-600/20"
                            >
                                <Icon size={18} className="group-hover:text-red-500 transition-colors" />
                                <span className="font-medium">{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto flex flex-col gap-4 border-t border-gray-800 pt-6">
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Logged in as</p>
                        <p className="text-xs font-bold text-white uppercase">{role}</p>
                    </div>
                    <Link href="/dashboard" className="p-3 text-xs text-gray-500 hover:text-white flex items-center gap-2 group transition-all">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        ออกจากหน้าจัดการ
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 p-10 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
