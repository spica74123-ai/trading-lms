"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { BookOpen } from "lucide-react";

export default function DashboardPage() {
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [totalCourses, setTotalCourses] = useState(0);
    const [completedCourses, setCompletedCourses] = useState(0);
    const [progressPercentage, setProgressPercentage] = useState(0);
    const [showCertificate, setShowCertificate] = useState(false);
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

                try {
                    // Fetch total courses and completed courses in parallel
                    const [coursesResponse, progressResponse] = await Promise.all([
                        supabase.from('courses').select('*', { count: 'exact', head: true }),
                        supabase.from('user_progress').select('*', { count: 'exact', head: true })
                            .eq('user_id', user.id)
                            .eq('status', 'completed')
                    ]);

                    const total = coursesResponse.count || 0;
                    const completed = progressResponse.count || 0;

                    setTotalCourses(total);
                    setCompletedCourses(completed);
                    setProgressPercentage(total > 0 ? Math.round((completed / total) * 100) : 0);
                } catch (err) {
                    console.error("Error fetching learning progress:", err);
                } finally {
                    setLoading(false);
                }
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

                {/* Certificate Claim Banner */}
                {progressPercentage === 100 && (
                    <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-900/20 border border-yellow-500/50 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(234,179,8,0.15)] animate-[pulse_3s_ease-in-out_infinite] hover:animate-none transition-all">
                        <div className="flex items-center gap-5">
                            <div className="text-4xl sm:text-5xl drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">🏆</div>
                            <div>
                                <h3 className="text-xl sm:text-2xl font-bold text-yellow-500 drop-shadow-sm">Congratulations!</h3>
                                <p className="text-yellow-200/80 text-sm sm:text-base mt-1">You have completed all courses and earned your professional certificate.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowCertificate(true)}
                            className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-gray-950 font-extrabold rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all hover:scale-105 whitespace-nowrap active:scale-95"
                        >
                            Claim Your Certificate
                        </button>
                    </div>
                )}

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
                            <span className="text-emerald-400 font-bold text-xl">{progressPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-emerald-500 h-4 rounded-full relative transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }}>
                                <div className="absolute top-0 right-0 bottom-0 w-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.15)_25%,rgba(255,255,255,.15)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.15)_75%,rgba(255,255,255,.15)_100%)] bg-[length:1rem_1rem] animate-[progress_1s_linear_infinite]"></div>
                            </div>
                        </div>
                        <p className="text-gray-400 mt-5 font-medium">
                            {progressPercentage === 100
                                ? "Outstanding! You've completed all available courses."
                                : `You've completed ${completedCourses} out of ${totalCourses} course${totalCourses === 1 ? '' : 's'}. Keep it up to unlock your first trading certificate!`}
                        </p>
                    </div>
                </div>

                {/* Recommended Courses Grid */}
                <div>
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                        <span className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">⚡</span>
                        Recommended Resources
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
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
                                    <button onClick={() => router.push("/courses/1")} className="text-blue-500 group-hover:translate-x-1 transition-transform bg-transparent border-none cursor-pointer p-0 font-medium">Start Course &rarr;</button>
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
                                    <button onClick={() => router.push("/courses/2")} className="text-purple-500 group-hover:translate-x-1 transition-transform bg-transparent border-none cursor-pointer p-0 font-medium">Start Course &rarr;</button>
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
                                    <button onClick={() => router.push("/courses/3")} className="text-emerald-500 group-hover:translate-x-1 transition-transform bg-transparent border-none cursor-pointer p-0 font-medium">Start Course &rarr;</button>
                                </div>
                            </div>
                        </div>

                        {/* Trading Journal Card */}
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-yellow-500/50 hover:shadow-[0_0_30px_rgba(234,179,8,0.1)] transition-all cursor-pointer group">
                            <div className="h-48 bg-gray-800 flex items-center justify-center relative overflow-hidden group-hover:bg-gray-800/80 transition-colors">
                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 to-gray-900 group-hover:scale-105 transition-transform duration-500"></div>
                                <BookOpen className="w-20 h-20 text-yellow-500/40 group-hover:text-yellow-400/80 group-hover:scale-110 transition-all duration-500 z-10" />
                                <div className="absolute bottom-4 left-4 z-10">
                                    <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md">Tool</span>
                                </div>
                            </div>
                            <div className="p-6 h-[calc(100%-12rem)] flex flex-col">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-400 transition-colors">Trading Journal</h3>
                                <p className="text-gray-400 text-sm mb-6 line-clamp-3">บันทึกและวิเคราะห์ประวัติการเทรดเพื่อพัฒนาวินัย</p>
                                <div className="flex justify-between items-center text-sm font-medium pt-4 mt-auto border-t border-gray-800">
                                    <span className="text-gray-500 flex items-center gap-2">✍️ Analytics</span>
                                    <button onClick={() => router.push("/journal")} className="text-yellow-500 group-hover:translate-x-1 transition-transform bg-transparent border-none cursor-pointer p-0 font-medium">Open Journal &rarr;</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Certificate Modal Overlay */}
            {showCertificate && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-950/80 backdrop-blur-md transition-opacity"
                    onClick={() => setShowCertificate(false)}
                >
                    <div
                        className="relative w-full max-w-4xl bg-gray-900 border-[6px] border-double border-yellow-600 p-2 sm:p-3 rounded-sm shadow-[0_0_50px_rgba(234,179,8,0.2)] animate-in fade-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowCertificate(false)}
                            className="absolute top-6 right-6 z-10 text-gray-400 hover:text-white bg-gray-900/50 rounded-full p-2 transition-colors"
                            aria-label="Close certificate"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>

                        <div className="border border-yellow-500/30 p-8 sm:p-12 md:p-16 flex flex-col items-center text-center relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-gray-950">

                            {/* Decorative Corner Ornaments */}
                            <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-yellow-600/50 opacity-50 m-4 sm:m-6 pointer-events-none"></div>
                            <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-yellow-600/50 opacity-50 m-4 sm:m-6 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-yellow-600/50 opacity-50 m-4 sm:m-6 pointer-events-none"></div>
                            <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-yellow-600/50 opacity-50 m-4 sm:m-6 pointer-events-none"></div>

                            {/* Watermark Logo */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                                <svg className="w-96 h-96 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                            </div>

                            <div className="text-yellow-500 mb-6 drop-shadow-[0_0_10px_rgba(234,179,8,0.4)] relative z-10">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
                            </div>

                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-500 to-yellow-600 tracking-[0.2em] mb-3 uppercase drop-shadow-md relative z-10">
                                Certificate of Completion
                            </h2>

                            <p className="text-gray-400 font-serif italic mb-10 text-lg relative z-10">This is to certify that</p>

                            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6 border-b border-gray-700 pb-3 px-8 sm:px-16 inline-block relative z-10">
                                {userEmail}
                            </h3>

                            <p className="text-gray-400 font-serif italic mb-6 text-lg relative z-10">has successfully completed all automated requirements for the</p>

                            <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-500 mb-16 sm:mb-20 uppercase tracking-widest drop-shadow-md relative z-10">
                                Trading LMS Masterclass
                            </h4>

                            <div className="flex flex-col sm:flex-row justify-between items-end w-full max-w-3xl px-4 sm:px-8 mt-4 border-t border-gray-800 pt-8 relative z-10 gap-8 sm:gap-0">
                                <div className="text-center sm:text-left w-full sm:w-1/3 order-3 sm:order-1">
                                    <div className="text-gray-300 font-serif text-lg">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                    <div className="text-gray-500 text-sm border-t border-gray-700 mt-1 pt-1 mx-8 sm:mx-0">Date</div>
                                </div>

                                <div className="flex justify-center w-full sm:w-1/3 order-1 sm:order-2 -mt-4 sm:-mb-6">
                                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.4)] border-2 border-yellow-200 border-dashed transform hover:scale-105 transition-transform cursor-default">
                                        <div className="w-20 h-20 bg-gradient-to-br from-yellow-700 via-yellow-500 to-yellow-300 rounded-full flex items-center justify-center border border-yellow-400/50">
                                            <div className="text-center text-gray-950">
                                                <span className="font-extrabold text-[10px] leading-tight block uppercase tracking-widest">Verified</span>
                                                <span className="font-extrabold text-xs leading-tight block uppercase tracking-wide">Trader</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center sm:text-right w-full sm:w-1/3 order-2 sm:order-3">
                                    <div className="text-yellow-600 font-serif italic text-2xl pr-0 sm:pr-2">Trading LMS Org.</div>
                                    <div className="text-gray-500 text-sm border-t border-gray-700 mt-1 pt-1 mx-8 sm:mx-0">Authorized Signature</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
