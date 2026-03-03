"use client";

import { useEffect, useState, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Check, X } from "lucide-react";
import { toast } from "react-hot-toast";

interface VIPProfile {
    full_name?: string;
}

interface VIPRequest {
    id: string;
    user_id: string;
    broker_account_id: string;
    created_at: string;
    profiles?: VIPProfile | VIPProfile[] | null;
}

export default function ManageVIP() {
    const [requests, setRequests] = useState<VIPRequest[]>([]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const fetchRequests = useCallback(async () => {
        const { data } = await supabase
            .from('vip_requests')
            .select('*, profiles(full_name)')
            .eq('status', 'pending');
        setRequests(data || []);
    }, [supabase]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    async function handleApprove(id: string, userId: string) {
        // 1. อนุมัติสิทธิ์ VIP
        await supabase.from('user_roles').update({ role_id: 2 }).eq('user_id', userId);
        // 2. อัปเดตสถานะคำขอ
        await supabase.from('vip_requests').update({ status: 'approved' }).eq('id', id);
        // 3. ส่งแจ้งเตือน
        await supabase.from('notifications').insert({
            user_id: userId,
            title: "สิทธิ์ VIP ของคุณได้รับการอนุมัติแล้ว!",
            message: "ตอนนี้คุณสามารถเข้าถึง SMC & ICT Mastery ได้ทันที"
        });

        toast.success("อนุมัติสำเร็จ!");
        fetchRequests();
    }

    async function handleReject(id: string, userId: string) {
        // อัปเดตสถานะคำขอ
        await supabase.from('vip_requests').update({ status: 'rejected' }).eq('id', id);
        // ส่งแจ้งเตือน
        await supabase.from('notifications').insert({
            user_id: userId,
            title: "คำขอสิทธิ์ VIP ถูกปฏิเสธ",
            message: "โปรดตรวจสอบข้อมูลหรือติดต่อแอดมิน"
        });

        toast.error("ปฏิเสธคำขอแล้ว");
        fetchRequests();
    }

    function getFullName(profiles: VIPProfile | VIPProfile[] | null | undefined): string {
        if (!profiles) return 'ไม่ระบุชื่อ';
        if (Array.isArray(profiles)) return profiles[0]?.full_name || 'ไม่ระบุชื่อ';
        return profiles.full_name || 'ไม่ระบุชื่อ';
    }

    return (
        <div className="text-white">
            <h1 className="text-2xl font-bold mb-8">รายการคำขอสิทธิ์ VIP ({requests.length})</h1>

            <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-800 text-gray-400 uppercase text-[10px] tracking-widest">
                        <tr>
                            <th className="p-5">นักเรียน</th>
                            <th className="p-5">เลขบัญชีโบรกเกอร์</th>
                            <th className="p-5">วันที่ส่งเรื่อง</th>
                            <th className="p-5 text-right">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {requests.map((req) => (
                            <tr key={req.id} className="hover:bg-gray-800/30 transition-colors">
                                <td className="p-5 font-bold">{getFullName(req.profiles)}</td>
                                <td className="p-5 text-blue-400 font-mono">{req.broker_account_id}</td>
                                <td className="p-5 text-gray-500">{new Date(req.created_at).toLocaleDateString()}</td>
                                <td className="p-5 flex justify-end gap-2">
                                    <button onClick={() => handleApprove(req.id, req.user_id)} className="p-2 bg-green-600/10 text-green-500 rounded-lg hover:bg-green-600 hover:text-white transition-all">
                                        <Check size={18} />
                                    </button>
                                    <button onClick={() => handleReject(req.id, req.user_id)} className="p-2 bg-red-600/10 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition-all">
                                        <X size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {requests.length === 0 && <div className="p-10 text-center text-gray-500">ไม่มีคำขอที่ค้างอยู่</div>}
            </div>
        </div>
    );
}
