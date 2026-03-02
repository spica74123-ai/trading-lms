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
        const { data: leaderData } = await supabase
            .from("leaderboards")
            .select("*");

        // ดึงข้อมูล quiz_score จาก user_progress
        const { data: progressData } = await supabase
            .from("user_progress")
            .select("user_id, quiz_score")
            .not("quiz_score", "is", null);

        if (leaderData) {
            // แมปข้อมูลเพื่อนำรวมกับ quiz_score และคำนวณ rank
            const mappedData = leaderData.map(trader => {
                const userProgress = progressData?.filter(p => p.user_id === trader.user_id) || [];
                // หารวมคะแนน quiz_score ทั้งหมด (เผื่อว่าเรียนหลายคอร์สที่มีแบบทดสอบ) หรือเอาคะแนนมากสุด
                const totalQuizScore = userProgress.reduce((sum, current) => sum + (current.quiz_score || 0), 0);

                const profit = parseFloat(trader.total_profit) || 0;
                // คำนวณ Trader Rank Score
                const traderRankScore = (profit * 0.7) + (totalQuizScore * 0.3);

                return {
                    ...trader,
                    totalQuizScore,
                    traderRankScore
                };
            });

            // เรียงลำดับตาม Trader Rank Score
            mappedData.sort((a, b) => b.traderRankScore - a.traderRankScore);

            // เก็บเฉพาะ top 10 หรือถ้าอยากแสดงหมดก็ได้
            setLeaders(mappedData.slice(0, 10));
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <Link href="/dashboard" className="flex items-center text-gray-400 hover:text-white transition-colors group">
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
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
                    <div className="overflow-x-auto">
                        <table className="w-full text-left whitespace-nowrap min-w-[500px] md:min-w-0">
                            <thead className="bg-gray-800/50 text-gray-400 text-[10px] md:text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-3 py-3 md:px-6 md:py-4">Rank</th>
                                    <th className="px-3 py-3 md:px-6 md:py-4">Trader</th>
                                    <th className="px-3 py-3 md:px-6 md:py-4">Total Profit</th>
                                    <th className="px-3 py-3 md:px-6 md:py-4">Quiz Score</th>
                                    <th className="px-3 py-3 md:px-6 md:py-4 text-right">Trades</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-3 py-6 md:px-6 md:py-10 text-center text-gray-500 text-sm md:text-base">กำลังดึงข้อมูลอันดับ...</td>
                                    </tr>
                                ) : leaders.map((trader, index) => {
                                    const isTop3 = index < 3;
                                    const medalColors = ["text-amber-400", "text-gray-300", "text-amber-700"];

                                    return (
                                        <tr key={index} className={`hover:bg-gray-800/30 transition-colors ${index === 0 ? 'bg-amber-500/5' : ''}`}>
                                            <td className="px-3 py-4 md:px-6 md:py-6">
                                                <div className="flex items-center">
                                                    {isTop3 ? (
                                                        <Medal className={`w-5 h-5 md:w-6 md:h-6 ${medalColors[index]}`} />
                                                    ) : (
                                                        <span className="text-gray-500 font-mono w-5 md:w-6 text-center text-sm md:text-base">#{index + 1}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 md:px-6 md:py-6 text-sm md:text-base">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">Student_{trader.user_id.substring(0, 5)}</span>
                                                    {trader.totalQuizScore === 5 && (
                                                        <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-[10px] md:text-xs font-bold bg-blue-600/20 text-blue-400 border border-blue-600/30 w-fit">
                                                            🌟 Certified Analyst
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 md:px-6 md:py-6">
                                                <div className="flex items-center text-emerald-400 font-bold text-base md:text-lg">
                                                    <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                                                    +{parseFloat(trader.total_profit).toFixed(2)}
                                                </div>
                                                <div className="text-gray-500 text-xs mt-1">
                                                    Rank Score: {trader.traderRankScore.toFixed(2)}
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 md:px-6 md:py-6 font-bold text-blue-400 text-sm md:text-base">
                                                {trader.totalQuizScore} <span className="text-gray-500 text-xs">pts</span>
                                            </td>
                                            <td className="px-3 py-4 md:px-6 md:py-6 text-right text-gray-400 text-sm md:text-base">
                                                {trader.trade_count}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {!loading && leaders.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-3 py-6 md:px-6 md:py-10 text-center text-gray-500 text-sm md:text-base">ยังไม่มีข้อมูลการเทรดในระบบ</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}