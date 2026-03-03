"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Settings, Plus, Trash2, Edit } from "lucide-react";

export default function AdminMenuPage() {
    interface MenuItem {
        id: string;
        label: string;
        path: string;
        required_role_id: number;
        sort_order: number;
    }
    const [menus, setMenus] = useState<MenuItem[]>([]);
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

    async function fetchMenus() {
        const { data } = await supabase.from('menu_items').select('*').order('sort_order', { ascending: true });
        setMenus(data || []);
    }

    useEffect(() => {
        fetchMenus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Settings className="text-red-600" /> จัดการเมนูหลังบ้าน
                    </h1>
                    <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl flex items-center gap-2 transition-all">
                        <Plus size={20} /> เพิ่มเมนูใหม่
                    </button>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-800/50 text-gray-400 text-sm uppercase">
                            <tr>
                                <th className="p-4">Label</th>
                                <th className="p-4">Path</th>
                                <th className="p-4">Role Required</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {menus.map((menu) => (
                                <tr key={menu.id} className="hover:bg-gray-800/30 transition-colors">
                                    <td className="p-4 font-bold">{menu.label}</td>
                                    <td className="p-4 text-gray-400 font-mono text-xs">{menu.path}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${menu.required_role_id === 1 ? 'bg-red-900/30 text-red-500' : 'bg-blue-900/30 text-blue-500'
                                            }`}>
                                            {menu.required_role_id === 1 ? 'Admin Only' : 'All Students'}
                                        </span>
                                    </td>
                                    <td className="p-4 flex justify-center gap-3">
                                        <button className="text-gray-400 hover:text-white"><Edit size={18} /></button>
                                        <button className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
