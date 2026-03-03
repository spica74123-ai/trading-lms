"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Trophy, Medal, Target, TrendingUp, Crown } from "lucide-react";

export default function Leaderboard() {
    interface Ranking {
        id: string;
        user_id: string;
        display_name: string;
        avatar_url: string | null;
        total_profit_percent: number;
        win_rate: number;
    }
    const [rankings, setRankings] = useState<Ranking[]>([]);
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

    useEffect(() => {
        const fetchRankings = async () => {
            const { data } = await supabase
                .from('monthly_rankings')
                .select('*')
                .order('total_profit_percent', { ascending: false })
                .limit(10);
            setRankings(data || []);
        };
        fetchRankings();
    }, []);

    return (
        <div className="min-h-screen bg-[#020617] text-white p-8">
            <div className="max-w-5xl mx-auto">
                <header className="text-center mb-16">
                    <h1 className="text-4xl font-black mb-2 flex items-center justify-center gap-3">
                        <Trophy className="text-yellow-500" /> TRADER OF THE MONTH
                    </h1>
                    <p className="text-gray-500 text-sm">ทำเนียบสุดยอดนักเทรดประจำเดือนของ Creative Investment Space</p>
                </header>

                {/* Top 3 Featured */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 items-end">
                    {rankings.slice(0, 3).map((trader, index) => (
                        <div key={trader.id} className={`bg-gray-900 border border-gray-800 p-8 rounded-[2.5rem] text-center relative transition-all hover:-translate-y-2 ${index === 0 ? 'h-80 border-yellow-500/50 shadow-[0_0_50px_rgba(234,179,8,0.1)] order-2' : 'h-64 order-1'}`}>
                            {index === 0 && <Crown className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-500" size={48} />}
                            <div className="w-20 h-20 rounded-full bg-blue-600 mx-auto mb-4 flex items-center justify-center text-2xl font-black overflow-hidden border-4 border-gray-800">
                                {trader.avatar_url ? <img src={trader.avatar_url} /> : trader.display_name.charAt(0)}
                            </div>
                            <h3 className="font-bold text-lg mb-1">{trader.display_name}</h3>
                            <div className="text-2xl font-black text-green-500">+{trader.total_profit_percent}%</div>
                            <div className="text-[10px] text-gray-500 uppercase font-bold mt-2">Win Rate: {trader.win_rate}%</div>
                        </div>
                    ))}
                </div>

                {/* Ranking List */}
                <div className="space-y-3">
                    {rankings.slice(3).map((trader, index) => (
                        <div key={trader.id} className="bg-gray-900/50 border border-gray-800 p-5 rounded-2xl flex items-center justify-between group hover:bg-gray-900 transition-all">
                            <div className="flex items-center gap-6">
                                <span className="text-gray-600 font-bold w-6">{index + 4}</span>
                                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center font-bold text-xs">
                                    {trader.display_name.charAt(0)}
                                </div>
                                <span className="font-bold">{trader.display_name}</span>
                            </div>
                            <div className="flex gap-10">
                                <div className="text-right">
                                    <div className="text-[10px] text-gray-500 uppercase font-bold">Profit</div>
                                    <div className="text-green-500 font-black">+{trader.total_profit_percent}%</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] text-gray-500 uppercase font-bold">Win Rate</div>
                                    <div className="font-bold text-sm">{trader.win_rate}%</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}