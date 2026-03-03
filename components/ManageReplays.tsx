"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { PlayCircle, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ManageReplays() {
    const [sessions, setSessions] = useState<any[]>([]);
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => { fetchSessions(); }, []);

    async function fetchSessions() {
        const { data } = await supabase
            .from('live_sessions')
            .select('*')
            .order('scheduled_at', { ascending: false });
        setSessions(data || []);
    }

    async function handleUpdateReplay(id: string, replayUrl: string) {
        const { error } = await supabase.from('live_sessions')
            .update({
                replay_url: replayUrl,
                status: 'finished'
            })
            .eq('id', id);

        if (!error) {
            toast.success("อัปเดตวิดีโอย้อนหลังเรียบร้อย!");
            fetchSessions();
        } else {
            toast.error("เกิดข้อผิดพลาดในการอัปเดต");
        }
    }

    return (
        <div className="text-white mt-12 bg-gray-900 border border-gray-800 p-8 rounded-[2.5rem]">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-500">
                <PlayCircle size={20} /> จัดการวิดีโอย้อนหลัง (Live Replays)
            </h2>
            <div className="space-y-4">
                {sessions.map(session => (
                    <div key={session.id} className="bg-black border border-gray-800 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex-1">
                            <h3 className="font-bold">{session.title}</h3>
                            <p className="text-xs text-gray-500">{new Date(session.scheduled_at).toLocaleString('th-TH')}</p>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <input
                                placeholder="วางลิงก์วิดีโอย้อนหลังที่นี่..."
                                className="flex-1 w-full md:w-64 bg-gray-900 border border-gray-800 p-3 rounded-xl text-sm outline-none focus:border-blue-500"
                                defaultValue={session.replay_url}
                                onBlur={(e) => handleUpdateReplay(session.id, e.target.value)}
                            />
                            <div className={`p-3 rounded-xl flex items-center justify-center ${session.status === 'finished' ? 'bg-green-600/20 text-green-500' : 'bg-yellow-600/20 text-yellow-500'}`}>
                                {session.status === 'finished' ? <CheckCircle size={20} /> : <PlayCircle size={20} />}
                            </div>
                        </div>
                    </div>
                ))}
                {sessions.length === 0 && (
                    <div className="text-center text-gray-500 py-8">ยังไม่มีประวัติการนัดหมาย Live Session</div>
                )}
            </div>
        </div>
    );
}
