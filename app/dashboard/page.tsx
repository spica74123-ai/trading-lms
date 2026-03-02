"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { BookOpen, LineChart, Target, Trophy, ArrowRight, LayoutGrid } from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState<any[]>([]); // [เพิ่ม] เก็บรายชื่อคอร์ส
    const [totalCourses, setTotalCourses] = useState(0);
    const [completedCourses, setCompletedCourses] = useState(0);
    const [progressPercentage, setProgressPercentage] = useState(0);
    const [showCertificate, setShowCertificate] = useState(false);
    const certificateRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const checkUserAndFetchData = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error || !user) {
                router.push("/login");
                return;
            }

            setUserEmail(user.email ?? "Trader");

            try {
                // [แก้ไข] ดึงข้อมูลคอร์สจริง และความคืบหน้าพร้อมกัน
                const [coursesResponse, progressResponse] = await Promise.all([
                    supabase.from('courses').select('*').order('id', { ascending: true }),
                    supabase.from('user_progress').select('*').eq('user_id', user.id).eq('status', 'completed')
                ]);

                const allCourses = coursesResponse.data || [];
                const completed = progressResponse.data?.length || 0;

                setCourses(allCourses);
                setTotalCourses(allCourses.length);
                setCompletedCourses(completed);
                setProgressPercentage(allCourses.length > 0 ? Math.round((completed / allCourses.length) * 100) : 0);
            } catch (err) {
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };

        checkUserAndFetchData();
    }, [router, supabase]);

    const downloadCertificate = async () => {
        if (!certificateRef.current) return;

        try {
            // 1. แปลง HTML เป็นรูปภาพ
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2, // เพิ่มความชัด
                useCORS: true,
                backgroundColor: "#030712" // สี Gray-950 ตามธีม
            });

            const imgData = canvas.toDataURL('image/png');

            // 2. สร้าง PDF (ขนาด A4 แนวนอน)
            const pdf = new jsPDF('l', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Certificate-${userEmail?.split('@')[0]}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 border-4 border-blue-700/30 border-t-blue-700 rounded-full animate-spin"></div>
                <h2 className="text-white mt-6 text-xl font-medium animate-pulse">Loading Creative Investment Space...</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-red-500">
                            Welcome Back, {userEmail?.split('@')[0]}
                        </h1>
                        <p className="text-gray-400 mt-2">ยินดีต้อนรับเข้าสู่ระบบเรียนเทรดอัจฉริยะของคุณ</p>
                    </div>
                </div>

                {/* Progress Card */}
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Target className="text-red-500 w-5 h-5" /> Learning Status
                            </h2>
                            <span className="text-red-500 font-bold">{progressPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-blue-600 to-red-500 h-full transition-all duration-1000"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                        <p className="text-gray-500 mt-4 text-sm italic">
                            {completedCourses} จาก {totalCourses} บทเรียนสำเร็จแล้ว
                        </p>
                    </div>
                </div>

                {/* Course Grid - [จุดที่ดึงข้อมูลจาก DB มาวนลูป] */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <BookOpen className="text-blue-400 w-6 h-6" /> หลักสูตรของคุณ
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                onClick={() => router.push(`/courses/${course.id}`)}
                                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-blue-500/50 hover:bg-gray-800/50 transition-all cursor-pointer group flex flex-col h-full"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 group-hover:scale-110 transition-transform">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs font-mono text-gray-500">ID: {course.id}</span>
                                </div>
                                <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors">{course.title}</h3>
                                <p className="text-gray-400 text-sm mb-6 line-clamp-2">{course.description}</p>
                                <div className="mt-auto flex items-center text-blue-500 text-sm font-bold">
                                    เริ่มเรียนเลย <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Trader Utilities - ส่วนเสริมอื่นๆ */}
                <section className="pt-10 border-t border-gray-800">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">เครื่องมือเพิ่มเติม</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div onClick={() => router.push("/tools")} className="p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-cyan-500/50 cursor-pointer flex items-center gap-3 transition-all">
                            <LineChart className="text-cyan-400 w-5 h-5" />
                            <span className="font-medium text-sm">Trading Tools</span>
                        </div>
                        <div onClick={() => router.push("/journal")} className="p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-emerald-500/50 cursor-pointer flex items-center gap-3 transition-all">
                            <Target className="text-emerald-400 w-5 h-5" />
                            <span className="font-medium text-sm">Trading Journal</span>
                        </div>
                        <div onClick={() => router.push("/leaderboard")} className="p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-yellow-500/50 cursor-pointer flex items-center gap-3 transition-all">
                            <Trophy className="text-yellow-400 w-5 h-5" />
                            <span className="font-medium text-sm">Leaderboard</span>
                        </div>
                    </div>
                </section>

                {/* Certificate Modal - ยังเก็บไว้เหมือนเดิม */}
                {showCertificate && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/90 backdrop-blur-xl">
                        <div className="relative w-full max-w-4xl flex flex-col items-center">

                            {/* --- ส่วนของใบเกียรติบัตรที่ต้องการถ่ายรูป --- */}
                            <div ref={certificateRef} className="bg-gray-950 border-[12px] border-double border-blue-900/50 p-16 text-center relative overflow-hidden">

                                {/* โลโก้แบรนด์ด้านบน */}
                                <div className="flex justify-center mb-10">
                                    <div className="bg-white p-4 rounded-2xl shadow-2xl">
                                        <Image src="/logo.png" alt="CIS Logo" width={100} height={100} />
                                    </div>
                                </div>

                                <h2 className="text-4xl font-serif text-white mb-2 uppercase tracking-[0.3em]">Certificate of Completion</h2>
                                <div className="h-1 w-32 bg-gradient-to-r from-blue-600 to-red-600 mx-auto mb-8"></div>

                                <p className="text-gray-400 italic">This is to certify that</p>
                                <h3 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 my-6">
                                    {userEmail}
                                </h3>

                                <p className="text-gray-400 max-w-lg mx-auto">
                                    Has successfully completed the advanced training programs in **SMC, ICT, and Market Structure** under the supervision of **Creative Investment Space**.
                                </p>

                                {/* ลายเซ็นและวันที่ */}
                                <div className="mt-16 flex justify-between items-end px-10">
                                    <div className="text-left">
                                        <div className="text-white font-serif border-b border-gray-800 pb-1 px-4">Spike Trader</div>
                                        <div className="text-xs text-gray-500 mt-1">Head of Education</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-white border-b border-gray-800 pb-1 px-4">{new Date().toLocaleDateString()}</div>
                                        <div className="text-xs text-gray-500 mt-1">Issue Date</div>
                                    </div>
                                </div>
                            </div>

                            {/* --- ปุ่มควบคุมด้านนอก Ref --- */}
                            <div className="mt-8 flex gap-4">
                                <button
                                    onClick={downloadCertificate}
                                    className="px-8 py-3 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-700/20 transition-all hover:scale-105"
                                >
                                    💾 Download PDF
                                </button>
                                <button
                                    onClick={() => setShowCertificate(false)}
                                    className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}