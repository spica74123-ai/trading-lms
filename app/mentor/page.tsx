"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { CheckCircle, XCircle, MessageSquare, Image as ImageIcon, Clock } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export default function MentorDashboard() {
    interface Assignment {
        id: string;
        user_id: string;
        course_id: string;
        image_url: string;
        description: string;
        status: string;
        feedback: string;
        created_at: string;
        profiles: {
            full_name: string;
            avatar_url: string;
        } | null;
    }
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

    async function fetchPendingAssignments() {
        // ดึงการบ้านพร้อมข้อมูลชื่อนักเรียนจากตาราง profiles
        const { data } = await supabase
            .from('assignments')
            .select(`
                *,
                profiles:user_id (full_name, avatar_url)
            `)
            .eq('status', 'pending')
            .order('created_at', { ascending: true });

        setAssignments(data || []);
        // Assuming setLoading(false) was intended to be here, but it's not defined.
        // If setLoading was defined, it would be setLoading(false);
    }

    useEffect(() => {
        fetchPendingAssignments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function updateStatus(id: string, status: string, feedback: string) {
        const { error } = await supabase
            .from('assignments')
            .update({ status, feedback })
            .eq('id', id);

        if (!error) {
            toast.success(`อัปเดตสถานะเป็น ${status} เรียบร้อย!`);
            fetchPendingAssignments();
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8">
            <Toaster position="top-right" />
            <div className="max-w-7xl mx-auto">
                <header className="mb-10 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Mentor Dashboard</h1>
                        <p className="text-gray-500 text-sm mt-2">จัดการการบ้านและติดตามความคืบหน้านักเรียน CIS</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl flex items-center gap-3">
                            <Clock className="text-yellow-500" />
                            <div>
                                <p className="text-[10px] uppercase text-gray-500 font-bold">Pending</p>
                                <p className="text-xl font-bold">{assignments.length}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* รายการการบ้านรอตรวจ */}
                <div className="grid grid-cols-1 gap-6">
                    {assignments.length === 0 ? (
                        <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-20 text-center text-gray-500">
                            ไม่มีการบ้านค้างตรวจในขณะนี้ ✨
                        </div>
                    ) : (
                        assignments.map((item) => (
                            <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-xl">
                                <div className="flex flex-col md:flex-row h-full">
                                    {/* รูปกราฟที่นักเรียนส่งมา */}
                                    <div className="md:w-1/3 relative group cursor-pointer bg-black flex-shrink-0">
                                        <div className="aspect-video md:aspect-auto md:h-full relative overflow-hidden">
                                            <img src={item.image_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Assignment Graph" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                                                <a href={item.image_url} target="_blank" rel="noopener noreferrer" className="bg-white text-black px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors">
                                                    <ImageIcon size={18} /> ดูภาพขยาย
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* รายละเอียดและการให้คะแนน */}
                                    <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-lg shadow-lg">
                                                        {item.profiles?.full_name?.charAt(0) || "U"}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white text-lg">{item.profiles?.full_name || "Unknown Student"}</p>
                                                        <p className="text-xs text-gray-500 mt-0.5">คอร์ส ID: {item.course_id} • ส่งเมื่อ {new Date(item.created_at).toLocaleDateString('th-TH')}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <img src="/logo.jpg" alt="Creative Investment Logo" className="w-20 mx-auto mb-6 rounded-2xl shadow-xl" />
                                            <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 mb-6">
                                                <p className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">คำอธิบายแผนการเทรด</p>
                                                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                                    {item.description || "ไม่ได้ระบุคำอธิบาย"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-4 mt-auto">
                                            <div className="relative">
                                                <MessageSquare className="absolute left-4 top-4 text-gray-500 w-5 h-5" />
                                                <textarea
                                                    id={`feedback-${item.id}`}
                                                    placeholder="เขียนข้อเสนอแนะให้ความรู้เพิ่มเติม (Feedback)..."
                                                    className="w-full bg-black border border-gray-800 rounded-xl py-3 pr-4 pl-12 text-sm focus:border-blue-500 focus:outline-none min-h-[100px] resize-y"
                                                ></textarea>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => {
                                                        const fb = (document.getElementById(`feedback-${item.id}`) as HTMLTextAreaElement).value;
                                                        updateStatus(item.id, 'approved', fb);
                                                    }}
                                                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
                                                >
                                                    <CheckCircle size={18} /> อนุมัติผ่าน (Approve)
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const fb = (document.getElementById(`feedback-${item.id}`) as HTMLTextAreaElement).value;
                                                        if (!fb.trim()) {
                                                            toast.error("กรุณาระบุข้อเสนอแนะเพื่อให้นักเรียนแก้ไข");
                                                            return;
                                                        }
                                                        updateStatus(item.id, 'needs_fix', fb);
                                                    }}
                                                    className="flex-1 bg-red-600/10 border border-red-500/20 text-red-500 hover:bg-red-600/20 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                                                >
                                                    <XCircle size={18} /> ส่งกลับไปแก้ไข (Need Fix)
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
