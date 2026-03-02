"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function DashboardPage() {
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Initialize Supabase Client
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error || !user) {
                router.push("/login");
            } else {
                setUserEmail(user.email ?? "Trader");
                setLoading(false);
            }
        };

        checkUser();
    }, [router, supabase]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                <h2 className="text-white mt-6 text-xl font-medium animate-pulse">Loading Trading LMS...</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                            Welcome Back, {userEmail}
                        </h1>
                        <p className="text-gray-400 mt-2 text-lg">Here&apos;s an overview of your learning progress today.</p>
                    </div>
                </div>

                {/* Progress Section */}
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    {/* Decorative gradient overlay */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">🎯</span>
                                My Learning Progress
                            </h2>
                            <span className="text-emerald-400 font-bold text-xl">68%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-emerald-500 h-4 rounded-full relative" style={{ width: '68%' }}>
                                <div className="absolute top-0 right-0 bottom-0 w-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.15)_25%,rgba(255,255,255,.15)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.15)_75%,rgba(255,255,255,.15)_100%)] bg-[length:1rem_1rem]"></div>
                            </div>
                        </div>
                        <p className="text-gray-400 mt-5 font-medium">You&apos;re making great progress! Keep it up to unlock your first trading certificate.</p>
                    </div>
                </div>

                {/* Recommended Courses Grid */}
                <div>
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                        <span className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">⚡</span>
                        Recommended Courses
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Course 1 */}
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all cursor-pointer group">
                            <div className="h-48 bg-gray-800 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-gray-900 group-hover:scale-105 transition-transform duration-500"></div>
                                <div className="absolute bottom-4 left-4">
                                    <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md">Forex Basics</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">Fibonacci Mastery</h3>
                                <p className="text-gray-400 text-sm mb-6 line-clamp-2">Learn how to spot hidden support and resistance levels like a pro. Find exact entry and exit points.</p>
                                <div className="flex justify-between items-center text-sm font-medium pt-4 border-t border-gray-800">
                                    <span className="text-gray-500 flex items-center gap-2">⏱ 2h 15m</span>
                                    <span className="text-blue-500 group-hover:translate-x-1 transition-transform">Start Course &rarr;</span>
                                </div>
                            </div>
                        </div>

                        {/* Course 2 */}
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] transition-all cursor-pointer group">
                            <div className="h-48 bg-gray-800 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-gray-900 group-hover:scale-105 transition-transform duration-500"></div>
                                <div className="absolute bottom-4 left-4">
                                    <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md">Indicators</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">RSI Secrets</h3>
                                <p className="text-gray-400 text-sm mb-6 line-clamp-2">Master momentum trading with the Relative Strength Index. Understand overbought and oversold conditions.</p>
                                <div className="flex justify-between items-center text-sm font-medium pt-4 border-t border-gray-800">
                                    <span className="text-gray-500 flex items-center gap-2">⏱ 1h 45m</span>
                                    <span className="text-purple-500 group-hover:translate-x-1 transition-transform">Start Course &rarr;</span>
                                </div>
                            </div>
                        </div>

                        {/* Course 3 */}
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-all cursor-pointer group">
                            <div className="h-48 bg-gray-800 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-gray-900 group-hover:scale-105 transition-transform duration-500"></div>
                                <div className="absolute bottom-4 left-4">
                                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md">Advanced</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-400 transition-colors">Price Action Pro</h3>
                                <p className="text-gray-400 text-sm mb-6 line-clamp-2">Trade &quot;naked charts&quot; by reading candlestick patterns effectively and understanding market psychology.</p>
                                <div className="flex justify-between items-center text-sm font-medium pt-4 border-t border-gray-800">
                                    <span className="text-gray-500 flex items-center gap-2">⏱ 3h 30m</span>
                                    <span className="text-emerald-500 group-hover:translate-x-1 transition-transform">Start Course &rarr;</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
