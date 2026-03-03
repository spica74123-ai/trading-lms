"use client";

import { CheckSquare, MessageSquare } from "lucide-react";

export default function ReviewsPage() {
    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white">Profit Reviews</h1>
                    <p className="text-gray-500 mt-1">ตรวจสอบความถูกต้องของรีวิวผลกำไรจากสมาชิก</p>
                </div>
                <div className="bg-emerald-600/10 border border-emerald-600/30 px-4 py-2 rounded-xl flex items-center gap-2">
                    <MessageSquare size={16} className="text-emerald-500" />
                    <span className="text-sm font-bold text-emerald-500">Wait for Audit</span>
                </div>
            </header>

            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                    <CheckSquare size={40} className="text-gray-600" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Clean for now!</h2>
                <p className="text-gray-500 max-w-sm">ยังไม่มีรีวิวใหม่ที่รอการตรวจสอบ สมาชิกทุกคนส่งข้อมูลที่ถูกต้องแล้ว</p>
            </div>
        </div>
    );
}
