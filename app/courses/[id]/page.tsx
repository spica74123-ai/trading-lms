"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { ArrowLeft, PlayCircle, BookOpen, Save, CheckCircle } from "lucide-react";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";

export default function CourseDetailPage() {
    const { id } = useParams();
    interface Course {
        id: string;
        title: string;
        description: string;
        content: string;
        video_url: string;
        thumbnail_url: string;
    }
    const [course, setCourse] = useState<Course | null>(null);
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(true);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    async function fetchCourseAndNotes() {
        const { data: { user } } = await supabase.auth.getUser();

        // 1. ดึงรายละเอียดคอร์ส
        const { data: courseData } = await supabase
            .from('courses')
            .select('*')
            .eq('id', id)
            .single();

        setCourse(courseData);

        // 2. ดึง Note ของผู้ใช้
        const { data: noteData } = await supabase
            .from('study_notes')
            .select('note_content')
            .eq('user_id', user?.id)
            .eq('course_id', id)
            .single();

        if (noteData) setNote(noteData.note_content);
        setLoading(false);
    }

    useEffect(() => {
        fetchCourseAndNotes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    async function saveNote() {
        const { data: { user } } = await supabase.auth.getUser();
        const { error } = await supabase.from('user_notes').upsert({
            user_id: user?.id,
            course_id: id,
            note_content: note,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id, course_id' }); // ป้องกันโน้ตซ้ำ

        if (!error) toast.success("บันทึกโน้ตสำเร็จ! ✍️");
    }

    if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">กำลังโหลดบทเรียน...</div>;

    return (
        <div className="min-h-screen bg-gray-950 text-white pb-20">
            <Toaster position="bottom-right" />

            {/* Header Area */}
            <div className="bg-gray-900/50 border-b border-gray-800 p-6">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} /> กลับไป Dashboard
                    </Link>
                    <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-500">
                        {course?.title}
                    </h1>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* ด้านซ้าย: วิดีโอและเนื้อหาหลัก */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Video Player */}
                    <div className="aspect-video bg-black rounded-3xl border border-gray-800 overflow-hidden shadow-2xl relative">
                        {course?.video_url ? (
                            <iframe
                                className="w-full h-full"
                                src={course.video_url.replace("watch?v=", "embed/")}
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-600">
                                <PlayCircle size={64} className="mb-4" />
                                <p>ยังไม่มีวิดีโอสำหรับบทเรียนนี้</p>
                            </div>
                        )}
                    </div>

                    {/* Lesson Content */}
                    <div className="bg-gray-900/30 p-8 rounded-3xl border border-gray-800">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <BookOpen className="text-blue-500" /> เนื้อหาบทเรียน
                        </h2>
                        <div
                            className="prose prose-invert max-w-none text-gray-300 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: course?.content || "" }}
                        ></div>
                    </div>
                </div>

                {/* ด้านขวา: ระบบจดโน้ตส่วนตัว */}
                <div className="space-y-6">
                    <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800 sticky top-10 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-red-500">
                                <Save size={18} /> โน้ตส่วนตัว
                            </h3>
                            <button
                                onClick={saveNote}
                                className="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-all"
                            >
                                บันทึก
                            </button>
                        </div>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="จดเทคนิคสำคัญไว้ที่นี่..."
                            className="w-full h-64 bg-gray-950 border border-gray-800 rounded-2xl p-4 text-sm focus:border-red-500 focus:outline-none transition-all resize-none"
                        ></textarea>

                        <div className="mt-6 pt-6 border-t border-gray-800">
                            <button className="w-full bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-emerald-600/20 transition-all">
                                <CheckCircle size={20} /> เรียนจบแล้ว
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
