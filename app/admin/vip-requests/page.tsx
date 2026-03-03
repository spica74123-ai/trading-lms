"use client";

import { Users, Clock } from "lucide-react";

export default function VipRequestsPage() {
    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white">VIP Access Requests</h1>
                    <p className="text-gray-500 mt-1">ตรวจสอบและอนุมัติคำขอสิทธิ์ VIP จากสมาชิก</p>
                </div>
                <div className="bg-blue-600/10 border border-blue-600/30 px-4 py-2 rounded-xl flex items-center gap-2">
                    <Clock size={16} className="text-blue-500" />
                    <span className="text-sm font-bold text-blue-500">Pending Requests</span>
                </div>
            </header>

            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                    <Users size={40} className="text-gray-600" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">No Pending Requests</h2>
                <p className="text-gray-500 max-w-sm">ขณะนี้ยังไม่มีคำขอเข้าถึง VIP ใหม่จากสมาชิก ระบบจะแสดงรายการที่นี่เมื่อมีการส่งคำขอเข้ามา</p>
            </div>
        </div>
    );
}
