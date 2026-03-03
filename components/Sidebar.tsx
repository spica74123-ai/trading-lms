"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { getUserRole } from "@/lib/roles"; // ฟังก์ชันที่เราสร้างไว้ก่อนหน้านี้
import Link from "next/link";
import Image from "next/image";
import * as LucideIcons from "lucide-react"; // สำหรับดึงไอคอนตามชื่อใน DB

export default function Sidebar() {
    const [userRole, setUserRole] = useState("student");
    const [menus, setMenus] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const pathname = usePathname();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        async function loadSidebarData() {
            try {
                // 1. เช็คสิทธิ์ผู้ใช้งาน
                const role = await getUserRole();
                setUserRole(role || "student");

                // 2. ดึงข้อมูลเมนูจากตาราง menu_items
                const { data: menuData } = await supabase
                    .from('menu_items')
                    .select('*')
                    .eq('is_active', true)
                    .order('sort_order', { ascending: true });

                // 3. กรองเมนูตามสิทธิ์: นักเรียนจะไม่เห็นเมนูที่มี required_role_id = 1 (Admin)
                const filteredMenus = menuData?.filter(item => {
                    if (role === 'admin') return true; // Admin เห็นหมด
                    return item.required_role_id >= 3; // Student (3) เห็นเฉพาะเมนูทั่วไป
                });

                setMenus(filteredMenus || []);
            } catch (error) {
                console.error("Error loading sidebar:", error);
            } finally {
                setLoading(false);
            }
        }

        loadSidebarData();
    }, [supabase]);

    // ฟังก์ชันช่วยแสดงไอคอนตามชื่อที่เก็บใน Database
    const IconRenderer = ({ iconName }: { iconName: string }) => {
        const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Book;
        return <IconComponent size={20} />;
    };

    if (loading) return <div className="w-64 bg-gray-950 h-screen border-r border-gray-800 animate-pulse" />;

    return (
        <aside className="w-64 bg-gray-950 h-screen border-r border-gray-800 flex flex-col sticky top-0">
            {/* Logo Section */}
            <div className="p-6 border-b border-gray-800">
                <Link href="/dashboard" className="flex items-center gap-3 group">
                    <div className="bg-white p-1 rounded-lg">
                        <Image src="/logo.png" alt="CIS Logo" width={32} height={32} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-white leading-none uppercase">Creative</span>
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Investment</span>
                    </div>
                </Link>
            </div>

            {/* Navigation Menus */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-4">
                    Main Menu - {userRole}
                </p>

                {menus.map((item) => (
                    <Link
                        key={item.id}
                        href={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${pathname === item.path
                                ? "bg-blue-600/10 text-blue-400 border border-blue-600/20"
                                : "text-gray-400 hover:bg-gray-900 hover:text-white"
                            }`}
                    >
                        <IconRenderer iconName={item.icon} />
                        <span className="text-sm">{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* User Account / Logout Placeholder */}
            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={async () => {
                        await supabase.auth.signOut();
                        router.push("/login");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-400 transition-colors text-sm"
                >
                    <LucideIcons.LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}