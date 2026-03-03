"use client";

import { useEffect, useState } from "react";
import { getUserRole } from "@/lib/roles"; // ใช้ไฟล์ที่เราสร้างไว้
import { LayoutDashboard, BookOpen, ShieldCheck, Megaphone, CheckSquare, Settings, Crown, Trophy, TrendingUp, Send, Users } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
    const [role, setRole] = useState("student");

    useEffect(() => {
        async function checkRole() {
            const userRole = await getUserRole();
            setRole(userRole);
        }
        checkRole();
    }, []);

    return (
        <aside className="w-64 bg-gray-950 border-r border-gray-800 flex flex-col h-screen">
            {/* Logo Area */}
            <div className="p-6 border-b border-gray-800">
                <img src="/logo.jpg" alt="Creative Investment" className="w-32" />
            </div>

            <nav className="flex-1 p-4 space-y-8 overflow-y-auto">
                {/* เมนูสำหรับนักเรียน (ทุกคนเห็น) */}
                <div>
                    <p className="text-[10px] uppercase text-gray-500 font-bold mb-4 px-2">Main Menu - Student</p>
                    <div className="space-y-1">
                        <Link href="/dashboard" className="flex items-center gap-3 p-3 bg-blue-600/10 text-blue-500 rounded-xl font-medium transition-all">
                            <LayoutDashboard size={20} /> Dashboard
                        </Link>
                        <Link href="/courses" className="flex items-center gap-3 p-3 text-gray-400 hover:text-white rounded-xl transition-all">
                            <BookOpen size={20} /> SMC Mastery
                        </Link>

                        {/* แสดงปุ่มอัปเกรด VIP ถ้ายูสเซอร์ไม่ใช่ vip หรือ admin */}
                        {role !== 'vip' && role !== 'admin' && (
                            <Link href="/subscription" className="flex items-center gap-3 p-3 mt-4 bg-gradient-to-r from-yellow-600/20 to-red-600/20 border border-yellow-500/30 text-yellow-500 rounded-xl font-bold animate-pulse hover:animate-none transition-all">
                                <Crown size={20} /> Upgrade to VIP
                            </Link>
                        )}
                    </div>
                </div>

                {/* Community & Success */}
                <div>
                    <p className="text-[10px] uppercase text-gray-500 font-bold mb-4 px-2 pt-4">Community & Success</p>
                    <div className="space-y-1">
                        <Link href="/leaderboard" className="flex items-center gap-3 p-3 text-gray-400 hover:text-white hover:bg-gray-900 rounded-xl transition-all">
                            <Trophy size={20} /> Trader of the Month
                        </Link>
                        <Link href="/proof" className="flex items-center gap-3 p-3 text-gray-400 hover:text-white hover:bg-gray-900 rounded-xl transition-all">
                            <TrendingUp size={20} /> Success Stories
                        </Link>
                        <Link href="/submit-review" className="flex items-center gap-3 p-3 text-gray-400 hover:text-white hover:bg-gray-900 rounded-xl transition-all">
                            <Send size={20} /> Share Success
                        </Link>
                        <Link href="/partner" className="flex items-center gap-3 p-3 text-gray-400 hover:text-white hover:bg-gray-900 rounded-xl transition-all">
                            <Users size={20} /> Partner Program
                        </Link>
                    </div>
                </div>

                {/* เมนูสำหรับ Admin/Mentor (แสดงเฉพาะเมื่อมีสิทธิ์) */}
                {(role === "admin" || role === "mentor") && (
                    <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                        <p className="text-[10px] uppercase text-red-500 font-bold mb-4 px-2 flex items-center gap-2">
                            <ShieldCheck size={12} /> Management - Mentor
                        </p>
                        <div className="space-y-1">
                            <Link href="/admin/courses" className="flex items-center gap-3 p-3 text-gray-400 hover:text-white hover:bg-gray-900 rounded-xl transition-all">
                                <BookOpen size={20} /> จัดการบทเรียน
                            </Link>
                            <Link href="/mentor" className="flex items-center gap-3 p-3 text-gray-400 hover:text-white hover:bg-gray-900 rounded-xl transition-all">
                                <CheckSquare size={20} /> ตรวจการบ้าน
                            </Link>
                            <Link href="/admin/announcements" className="flex items-center gap-3 p-3 text-gray-400 hover:text-white hover:bg-gray-900 rounded-xl transition-all">
                                <Megaphone size={20} /> ลงประกาศข่าวสาร
                            </Link>
                            <Link href="/admin/menus" className="flex items-center gap-3 p-3 text-gray-400 hover:text-white hover:bg-gray-900 rounded-xl transition-all">
                                <Settings size={20} /> จัดการเมนูระบบ
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* ส่วนโปรไฟล์และปุ่ม Settings */}
            <div className="p-4 border-t border-gray-800">
                <Link href="/settings" className="flex items-center gap-3 p-2 hover:bg-gray-900 rounded-xl transition-all group">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                        {/* ดึงตัวอักษรแรกของชื่อมาแสดง */}
                        S
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">ตั้งค่าโปรไฟล์</span>
                        <span className="text-[10px] text-gray-500 uppercase">{role}</span>
                    </div>
                </Link>
            </div>
        </aside>
    );
}