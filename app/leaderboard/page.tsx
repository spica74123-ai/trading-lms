"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { Trophy, ArrowLeft, TrendingUp, Medal } from "lucide-react";

export default function LeaderboardPage() {
    const [leaders, setLeaders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        setLoading(true);
        // ดึงข้อมูลจาก View ที่เราสร้างไว้ใน SQL Editor
        const { data, error } = await supabase
            .from("leaderboards")
            .select("*")
            .limit(10);

        if (data) setLeaders(data);
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <Link href="/dashboard" className="flex items-center text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/20">
                        <Trophy className="w-5 h-5 text-amber-500 mr-2" />
                        <span className="text-amber-500 font-bold">Top Traders</span>
                    </div>
                </div>

                <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500">
                    Trader Leaderboard
                </h1>
                <p className="text-gray-400 mb-10">ทำเนียบนักเรียนที่สร้างกำไรสูงสุดในคลาสเรียน</p>

                {/* Leaderboard Table */}
                <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
                    <table className="w-full text-left">
                        <thead className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Rank</th>
                                <th className="px-6 py-4">Trader</th>
                                <th className="px-6 py-4">Total Profit</th>
                                <th className="px-6 py-4 text-right">Trades</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500">กำลังดึงข้อมูลอันดับ...</td>
                                </tr>
                            ) : leaders.map((trader, index) => {
                                const isTop3 = index < 3;
                                const medalColors = ["text-amber-400", "text-gray-300", "text-amber-700"];

                                return (
                                    <tr key={index} className={`hover:bg-gray-800/30 transition-colors ${index === 0 ? 'bg-amber-500/5' : ''}`}>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center">
                                                {isTop3 ? (
                                                    <Medal className={`w-6 h-6 ${medalColors[index]}`} />
                                                ) : (
                                                    <span className="text-gray-500 font-mono w-6 text-center">#{index + 1}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 font-medium">
                                            {/* เราจะใช้ UUID ตัวแรกๆ แทนชื่อเพื่อความปลอดภัย หรือดึง Email มาโชว์บางส่วน */}
                                            Student_{trader.user_id.substring(0, 5)}
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center text-emerald-400 font-bold text-lg">
                                                <TrendingUp className="w-4 h-4 mr-2" />
                                                +{parseFloat(trader.total_profit).toFixed(2)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-right text-gray-400">
                                            {trader.trade_count}
                                        </td>
                                    </tr>
                                );
                            })}
                            {!loading && leaders.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500">ยังไม่มีข้อมูลการเทรดในระบบ</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}