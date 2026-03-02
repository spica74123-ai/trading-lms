"use client";

import { useState, useEffect, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TradingJournal() {
    const [trades, setTrades] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [chartFile, setChartFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        pair: "XAU/USD",
        side: "BUY",
        entry: "",
        exit: "",
        note: ""
    });

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        fetchTrades();
    }, []);

    const fetchTrades = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase
                .from("trading_journal")
                .select("*")
                .order("created_at", { ascending: false });
            setTrades(data || []);
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        const entry = parseFloat(formData.entry);
        const exit = parseFloat(formData.exit);
        const pnl = formData.side === "BUY" ? exit - entry : entry - exit;

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            let chartUrl = null;
            if (chartFile) {
                const fileExt = chartFile.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${user.id}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('journal-charts')
                    .upload(filePath, chartFile);

                if (!uploadError) {
                    const { data: publicUrlData } = supabase.storage
                        .from('journal-charts')
                        .getPublicUrl(filePath);
                    chartUrl = publicUrlData.publicUrl;
                } else {
                    console.error("Upload error:", uploadError);
                }
            }

            await supabase.from("trading_journal").insert([{
                user_id: user.id,
                pair: formData.pair,
                side: formData.side,
                entry_price: entry,
                exit_price: exit,
                pnl: pnl,
                note: formData.note,
                chart_url: chartUrl
            }]);

            setFormData({ ...formData, entry: "", exit: "", note: "" });
            setChartFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            fetchTrades();
        }
        setUploading(false);
    };

    const deleteTrade = async (id: string) => {
        await supabase.from("trading_journal").delete().eq("id", id);
        fetchTrades();
    };

    const totalTrades = trades.length;
    const netPnL = trades.reduce((acc, trade) => acc + parseFloat(trade.pnl), 0);
    const winTrades = trades.filter(trade => trade.pnl > 0).length;
    const winRate = totalTrades > 0 ? (winTrades / totalTrades) * 100 : 0;

    return (
        <div className="min-h-screen bg-gray-950 text-white p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <Link href="/dashboard" className="inline-flex items-center text-gray-400 hover:text-white transition-colors group">
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                </div>
                <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-red-500">
                    Trading Journal & Analytics
                </h1>

                {/* Summary Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                        <p className="text-gray-400 text-sm">Total Trades</p>
                        <p className="text-2xl font-bold">{totalTrades}</p>
                    </div>
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                        <p className="text-gray-400 text-sm">Win Rate</p>
                        <p className="text-2xl font-bold text-blue-400">{winRate.toFixed(1)}%</p>
                    </div>
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                        <p className="text-gray-400 text-sm">Net PnL</p>
                        {/* บรรทัดที่เคยมีปัญหา แก้ไขให้ถูกต้องแล้วครับ */}
                        <p className={`text-2xl font-bold ${netPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {netPnL >= 0 ? '+' : ''}{netPnL.toFixed(2)}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add New Trade Form - moved to order-1 on mobile, order-1 on desktop anyway */}
                    <div className="lg:col-span-1 bg-gray-900 p-6 rounded-xl border border-gray-800 h-fit order-1">
                        <h2 className="text-xl font-bold mb-4">Add New Trade</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Pair</label>
                                <input value={formData.pair} onChange={e => setFormData({ ...formData, pair: e.target.value })} className="w-full bg-gray-800 border-gray-700 rounded p-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Side</label>
                                <select value={formData.side} onChange={e => setFormData({ ...formData, side: e.target.value })} className="w-full bg-gray-800 border-gray-700 rounded p-2 text-sm">
                                    <option value="BUY">BUY</option>
                                    <option value="SELL">SELL</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Entry Price</label>
                                    <input type="number" step="any" value={formData.entry} onChange={e => setFormData({ ...formData, entry: e.target.value })} className="w-full bg-gray-800 border-gray-700 rounded p-2 text-sm" required />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Exit Price</label>
                                    <input type="number" step="any" value={formData.exit} onChange={e => setFormData({ ...formData, exit: e.target.value })} className="w-full bg-gray-800 border-gray-700 rounded p-2 text-sm" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Note</label>
                                <textarea value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} className="w-full bg-gray-800 border-gray-700 rounded p-2 text-sm h-20" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Chart Screenshot (Optional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={(e) => setChartFile(e.target.files?.[0] || null)}
                                    className="w-full bg-gray-800 border-gray-700 rounded p-2 text-sm text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20 border"
                                />
                            </div>
                            <button type="submit" disabled={uploading} className="w-full bg-blue-700 hover:bg-blue-600 py-2 rounded font-bold transition-colors disabled:opacity-50 shadow-lg shadow-blue-700/20">
                                {uploading ? "Saving..." : "Save Trade"}
                            </button>
                        </form>
                    </div>

                    {/* Trade History Table - order-2 so it appears under the form on mobile */}
                    <div className="lg:col-span-2 bg-gray-900 rounded-xl border border-gray-800 overflow-hidden order-2">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
                                    <tr>
                                        <th className="p-4">Pair</th>
                                        <th className="p-4">Side</th>
                                        <th className="p-4">PnL</th>
                                        <th className="p-4">Chart</th>
                                        <th className="p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {trades.map((trade) => (
                                        <tr key={trade.id} className="hover:bg-gray-800/50">
                                            <td className="p-4 font-bold">{trade.pair}</td>
                                            <td className={`p-4 font-bold ${trade.side === 'BUY' ? 'text-blue-400' : 'text-orange-400'}`}>{trade.side}</td>
                                            <td className={`p-4 font-bold ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {trade.pnl >= 0 ? '+' : ''}{parseFloat(trade.pnl).toFixed(2)}
                                            </td>
                                            <td className="p-4">
                                                {trade.chart_url ? (
                                                    <a href={trade.chart_url} target="_blank" rel="noopener noreferrer" className="block w-10 h-10 rounded overflow-hidden border border-gray-700 hover:border-blue-400 transition-colors">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={trade.chart_url} alt="Chart" className="w-full h-full object-cover" />
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-600 text-xs italic">No chart</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <button onClick={() => deleteTrade(trade.id)} className="text-gray-500 hover:text-red-400">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}