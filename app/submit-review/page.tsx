"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Upload, DollarSign, MessageSquare, Send, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";

export default function SubmitReview() {
    const [amount, setAmount] = useState("");
    const [comment, setComment] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    async function handleSubmit() {
        if (!amount || !comment || !image) return toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            // 1. อัปโหลดรูปลง Storage
            const fileExt = image.name.split('.').pop();
            const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage.from('profit-screenshots').upload(fileName, image);
            if (uploadError) throw uploadError;

            const { data: publicUrl } = supabase.storage.from('profit-screenshots').getPublicUrl(fileName);

            // 2. บันทึกข้อมูลลงฐานข้อมูล
            const { error: dbError } = await supabase.from('profit_reviews').insert({
                user_id: user?.id,
                display_name: user?.user_metadata?.full_name || 'VIP Member',
                amount: `$${amount}`,
                comment,
                screenshot_url: publicUrl.publicUrl
            });

            if (dbError) throw dbError;

            toast.success("ส่งรีวิวสำเร็จ! ขอบคุณที่ร่วมแชร์ความสำเร็จครับ ✨");
            window.location.href = "/proof"; // เปลี่ยนจาก /reviews เป็น /proof ตามหน้า Proof of Success
        } catch (error: unknown) {
            toast.error("เกิดข้อผิดพลาด: " + (error instanceof Error ? error.message : "Error"));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white p-8">
            <Toaster position="top-right" />
            <div className="max-w-2xl mx-auto">
                <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white mb-10 transition-colors">
                    <ArrowLeft size={20} /> กลับไปหน้า Dashboard
                </Link>

                <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] p-10 shadow-2xl">
                    <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
                        <Send className="text-blue-500" /> Share Your Success
                    </h1>
                    <p className="text-gray-500 text-sm mb-10 font-light">แบ่งปันผลกำไรของคุณเพื่อเป็นแรงบันดาลใจให้เพื่อนนักเทรดในสถาบัน</p>

                    <div className="space-y-6">
                        {/* ส่วนอัปโหลดรูป */}
                        <div className="aspect-video bg-black border-2 border-dashed border-gray-800 rounded-3xl flex items-center justify-center relative overflow-hidden group">
                            {preview ? (
                                <img src={preview} className="w-full h-full object-cover" />
                            ) : (
                                <label className="cursor-pointer flex flex-col items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-gray-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <Upload size={24} />
                                    </div>
                                    <span className="text-xs text-gray-500">อัปโหลดรูปกราฟหรือหลักฐานการถอนเงิน</span>
                                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                </label>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">จำนวนเงิน (USD)</label>
                                <div className="flex items-center gap-3 bg-black border border-gray-800 p-4 rounded-2xl focus-within:border-blue-500 transition-all">
                                    <DollarSign size={18} className="text-green-500" />
                                    <input value={amount} onChange={e => setAmount(e.target.value)} type="number" placeholder="เช่น 1500" className="bg-transparent outline-none flex-1" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">ชื่อที่ใช้แสดง</label>
                                <div className="flex items-center gap-3 bg-black border border-gray-800 p-4 rounded-2xl">
                                    <input disabled value="VIP Member" className="bg-transparent outline-none flex-1 text-gray-500" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">ความประทับใจ</label>
                            <div className="flex items-start gap-3 bg-black border border-gray-800 p-4 rounded-2xl focus-within:border-red-500 transition-all">
                                <MessageSquare size={18} className="text-red-500 mt-1" />
                                <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="แชร์เทคนิคสั้นๆ หรือความประทับใจ..." className="bg-transparent outline-none flex-1 h-24 resize-none" />
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-700 to-red-600 py-5 rounded-2xl font-black text-lg shadow-lg shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />} บันทึกและแชร์ผลกำไร
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
