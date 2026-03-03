"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { ExternalLink, Crown } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export default function PartnerSubscribe() {
    const [accountId, setAccountId] = useState("");
    const [loading, setLoading] = useState(false);
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

    // คัดลอกลิงก์ IB จากหน้าพาร์ทเนอร์ของโบรกเกอร์มาวางตรงนี้ได้เลยครับ
    const BROKER_LINK = "https://ma.perpetual-liquidity.com/ib/?partner=sMeyIzMiI6dHJ1ZX0fP";

    async function handleSubmitRequest() {
        if (!accountId) return toast.error("กรุณาระบุเลขบัญชีเทรด");
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        const { error } = await supabase.from('vip_requests').insert({
            user_id: user?.id,
            broker_account_id: accountId,
        });

        if (!error) {
            toast.success("ส่งข้อมูลเรียบร้อย! Mentor จะตรวจสอบและปลดล็อก VIP ให้ภายใน 24 ชม.");
            setAccountId("");
        } else {
            toast.error("เกิดข้อผิดพลาดในการส่งข้อมูล: " + error.message);
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white p-8 flex flex-col items-center">
            <Toaster position="top-center" />
            <div className="max-w-2xl w-full text-center mt-10">
                <Crown className="mx-auto text-yellow-500 mb-6" size={60} />
                <h1 className="text-4xl font-black mb-4">ปลดล็อก VIP ด้วยการเป็นพาร์ทเนอร์</h1>
                <p className="text-gray-400 mb-12">เข้าถึงบทเรียน SMC & ICT Mastery ฟรีเพียงเทรดผ่านบัญชีพาร์ทเนอร์ของเรา</p>

                <div className="space-y-6 text-left">
                    {/* Step 1 */}
                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl flex gap-5 items-start">
                        <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">1</div>
                        <div>
                            <h3 className="font-bold mb-1">เปิดบัญชีเทรดใหม่</h3>
                            <p className="text-sm text-gray-500 mb-4">สมัครผ่านลิงก์พาร์ทเนอร์ของ Creative Investment Space</p>
                            <a href={BROKER_LINK} target="_blank" className="inline-flex items-center gap-2 bg-white text-black px-6 py-2 rounded-xl text-sm font-bold hover:bg-blue-500 hover:text-white transition-all">
                                ไปยังหน้าสมัครโบรกเกอร์ <ExternalLink size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl flex gap-5 items-start">
                        <div className="bg-red-600 w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">2</div>
                        <div className="flex-1">
                            <h3 className="font-bold mb-1">แจ้งหมายเลขบัญชีเทรด</h3>
                            <p className="text-sm text-gray-500 mb-4">ระบุเลขบัญชี MT4/MT5 ที่คุณสมัครเพื่อใช้ในการตรวจสอบ</p>
                            <input
                                value={accountId}
                                onChange={(e) => setAccountId(e.target.value)}
                                placeholder="เช่น 12345678"
                                className="w-full bg-black border border-gray-800 p-3 rounded-xl focus:border-red-500 outline-none mb-4"
                            />
                            <button
                                onClick={handleSubmitRequest}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-700 to-red-600 py-3 rounded-xl font-bold hover:opacity-90"
                            >
                                {loading ? "กำลังส่งข้อมูล..." : "ส่งเรื่องขอปลดล็อก VIP"}
                            </button>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl flex gap-5 items-start opacity-60">
                        <div className="bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">3</div>
                        <div>
                            <h3 className="font-bold mb-1">รอการอนุมัติ</h3>
                            <p className="text-sm text-gray-500">Mentor จะทำการตรวจสอบความถูกต้องของบัญชี และปลดล็อกเนื้อหา VIP ให้คุณโดยอัตโนมัติ</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
