"use client";

import { BarChart3, TrendingUp } from "lucide-react";

export default function RankingsPage() {
    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white">Ranking Management</h1>
                    <p className="text-gray-500 mt-1">จัดการลำดับและรางวัลสำหรับ Top Traders ประจำโปรแกรม</p>
                </div>
                <div className="bg-yellow-600/10 border border-yellow-600/30 px-4 py-2 rounded-xl flex items-center gap-2">
                    <TrendingUp size={16} className="text-yellow-500" />
                    <span className="text-sm font-bold text-yellow-500">Live Season</span>
                </div>
            </header>

            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                    <BarChart3 size={40} className="text-gray-600" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Rankings are Stable</h2>
                <p className="text-gray-500 max-w-sm">ข้อมูลอันดับสมาชิกกำลังถูกประมวลผลตามคะแนนและผลกำไรจริง</p>
            </div>
        </div>
    );
}
