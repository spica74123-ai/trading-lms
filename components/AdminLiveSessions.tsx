"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Video, Plus } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminLiveSessions() {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [url, setUrl] = useState("");
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

    async function handleAddLive() {
        if (!title || !date || !url) {
            toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง");
            return;
        }

        const { error } = await supabase.from('live_sessions').insert({
            title,
            scheduled_at: new Date(date).toISOString(),
            meeting_url: url,
            access_level: 'vip'
        });

        if (!error) {
            toast.success("เพิ่มตารางไลฟ์สดเรียบร้อย!");
            setTitle(""); setDate(""); setUrl("");
        } else {
            toast.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
        }
    }

    return (
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-[2.5rem] text-white">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-red-500">
                <Video size={20} /> นัดหมาย Live Trading ล่วงหน้า
            </h2>
            <div className="space-y-4">
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="หัวข้อ (เช่น เจาะลึก Non-Farm Payroll)" className="w-full bg-black border border-gray-800 p-4 rounded-2xl outline-none focus:border-blue-500" />
                <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-black border border-gray-800 p-4 rounded-2xl outline-none" />
                <input value={url} onChange={e => setUrl(e.target.value)} placeholder="ลิงก์ห้องประชุม (Zoom/Meet)" className="w-full bg-black border border-gray-800 p-4 rounded-2xl outline-none" />
                <button onClick={handleAddLive} className="w-full bg-blue-600 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                    <Plus size={18} /> ยืนยันการนัดหมาย
                </button>
            </div>
        </div>
    );
}
