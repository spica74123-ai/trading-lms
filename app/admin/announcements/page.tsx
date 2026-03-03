"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Megaphone, Trash2, Send } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export default function ManageAnnouncements() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [type, setType] = useState("info");
    interface Announcement {
        id: string;
        title: string;
        content: string;
        type: string;
        created_at: string;
        created_by: string;
    }

    const [list, setList] = useState<Announcement[]>([]);

    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

    async function fetchList() {
        const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
        setList(data || []);
    }

    useEffect(() => {
        fetchList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handlePost() {
        if (!title.trim() || !content.trim()) {
            toast.error("กรุณาระบุหัวข้อและเนื้อหาประกาศ");
            return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        const { error } = await supabase.from('announcements').insert({
            title, content, type, created_by: user?.id
        });

        if (!error) {
            toast.success("ประกาศข่าวสารเรียบร้อย!");
            setTitle(""); setContent("");
            fetchList();
        } else {
            toast.error("เกิดข้อผิดพลาดในการลงประกาศ");
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8">
            <Toaster position="top-right" />
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <Megaphone className="text-red-500" /> ระบบประกาศข่าวสาร
                </h1>

                {/* Form เขียนข่าว */}
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 mb-10 shadow-xl">
                    <div className="space-y-4">
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="หัวข้อประกาศ..."
                            className="w-full bg-black border border-gray-800 p-3 rounded-xl focus:border-blue-500 outline-none transition-colors"
                        />
                        <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder="รายละเอียดเนื้อหา..."
                            className="w-full bg-black border border-gray-800 p-3 rounded-xl h-32 focus:border-blue-500 outline-none resize-y transition-colors"
                        />
                        <div className="flex flex-col sm:flex-row gap-4">
                            <select
                                value={type}
                                onChange={e => setType(e.target.value)}
                                className="bg-gray-800 border-none p-4 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-1/3"
                            >
                                <option value="info">ทั่วไป (Blue)</option>
                                <option value="warning">คำเตือน (Yellow)</option>
                                <option value="urgent">เร่งด่วน (Red)</option>
                            </select>
                            <button
                                onClick={handlePost}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 font-bold rounded-xl flex items-center justify-center gap-2 p-4 transition-all shadow-lg shadow-blue-600/20"
                            >
                                <Send size={18} /> ลงประกาศ
                            </button>
                        </div>
                    </div>
                </div>

                {/* รายการประกาศเดิม */}
                <h3 className="text-xl font-bold mb-4 text-gray-300">ประกาศก่อนหน้า</h3>
                <div className="space-y-4">
                    {list.length === 0 ? (
                        <div className="text-center text-gray-500 py-10 bg-gray-900/30 rounded-2xl border border-gray-800 border-dashed">
                            ยังไม่มีประกาศข่าวสาร
                        </div>
                    ) : (
                        list.map(item => (
                            <div key={item.id} className="bg-gray-900/80 border border-gray-800 p-5 rounded-2xl flex justify-between items-center hover:border-gray-700 transition-colors">
                                <div className="flex items-start gap-3">
                                    <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${item.type === 'urgent' ? 'bg-red-500' :
                                        item.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                                        }`} />
                                    <div>
                                        <h4 className="font-bold text-white mb-1">{item.title}</h4>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">{new Date(item.created_at).toLocaleDateString('th-TH')} • {item.type}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={async () => {
                                        if (window.confirm("คุณแน่ใจหรือไม่ที่จะลบประกาศนี้?")) {
                                            await supabase.from('announcements').delete().eq('id', item.id);
                                            fetchList();
                                            toast.success("ลบประกาศเรียบร้อย");
                                        }
                                    }}
                                    className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
