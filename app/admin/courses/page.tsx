"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Plus, Trash2, Upload, Video, BookOpen, Loader2 } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export default function ManageCourses() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [accessLevel, setAccessLevel] = useState("free");
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    interface Course {
        id: string;
        title: string;
        description: string;
        thumbnail_url: string;
        video_url: string;
        access_level: string;
        created_at: string;
    }
    const [courses, setCourses] = useState<Course[]>([]);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => { fetchCourses(); }, []);

    async function fetchCourses() {
        const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
        setCourses(data || []);
    }

    async function handleUploadThumbnail(e: React.ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true);
            const file = e.target.files?.[0];
            if (!file) return;
            const fileExt = file.name.split('.').pop();
            const filePath = `thumb-${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('course-thumbnails')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('course-thumbnails').getPublicUrl(filePath);
            setThumbnailUrl(data.publicUrl);
            toast.success("อัปโหลดหน้าปกสำเร็จ!");
        } catch (error: unknown) {
            toast.error("อัปโหลดพลาด: " + (error instanceof Error ? error.message : "Error"));
        } finally {
            setUploading(false);
        }
    }

    async function handleAddCourse() {
        if (!title || !videoUrl) return toast.error("กรุณาใส่ชื่อคอร์สและลิงก์วิดีโอ");
        setLoading(true);
        const { error } = await supabase.from('courses').insert({
            title,
            description,
            video_url: videoUrl,
            thumbnail_url: thumbnailUrl,
            access_level: accessLevel,
            content: description // ใช้คำอธิบายเป็นเนื้อหาเริ่มต้น
        });

        if (!error) {
            toast.success("เพิ่มบทเรียนใหม่เรียบร้อย! 🚀");
            setTitle(""); setDescription(""); setVideoUrl(""); setThumbnailUrl(""); setAccessLevel("free");
            fetchCourses();
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8">
            <Toaster position="top-right" />
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-10 flex items-center gap-3">
                    <BookOpen className="text-blue-500" /> ระบบจัดการบทเรียน (Courses Admin)
                </h1>

                {/* Form เพิ่มคอร์สใหม่ */}
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 mb-12 shadow-2xl">
                    <h2 className="text-xl font-bold mb-6 text-red-500">เพิ่มบทเรียนใหม่</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="ชื่อคอร์ส (เช่น Fibonacci Mastery)" className="w-full bg-black border border-gray-800 p-4 rounded-2xl focus:border-blue-500 outline-none" />
                            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="คำอธิบายคอร์สสั้นๆ..." className="w-full bg-black border border-gray-800 p-4 rounded-2xl h-32 focus:border-blue-500 outline-none" />
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">ระดับการเข้าถึงบทเรียน</label>
                                <select
                                    value={accessLevel}
                                    onChange={(e) => setAccessLevel(e.target.value)}
                                    className="w-full bg-black border border-gray-800 p-4 rounded-2xl focus:border-red-500 outline-none text-white"
                                >
                                    <option value="free">🔓 ทั่วไป (Free)</option>
                                    <option value="vip">💎 เฉพาะ VIP เท่านั้น</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 bg-black border border-gray-800 p-4 rounded-2xl">
                                <Video size={20} className="text-gray-500" />
                                <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="YouTube / Vimeo URL" className="flex-1 bg-transparent outline-none" />
                            </div>

                            {/* Thumbnail Upload Area */}
                            <div className="aspect-video bg-black border-2 border-dashed border-gray-800 rounded-2xl flex items-center justify-center relative overflow-hidden group">
                                {thumbnailUrl ? (
                                    <img src={thumbnailUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center gap-2">
                                        {uploading ? <Loader2 className="animate-spin text-blue-500" /> : <Upload className="text-gray-600" />}
                                        <span className="text-xs text-gray-500">อัปโหลดรูปหน้าปกคอร์ส</span>
                                        <input type="file" className="hidden" onChange={handleUploadThumbnail} accept="image/*" />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>
                    <button onClick={handleAddCourse} disabled={loading} className="w-full mt-8 bg-gradient-to-r from-blue-700 to-red-600 py-4 rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg">
                        <Plus size={20} /> {loading ? "กำลังบันทึก..." : "ยืนยันการเพิ่มบทเรียน"}
                    </button>
                </div>

                {/* รายการคอร์สที่มีอยู่ */}
                <h2 className="text-xl font-bold mb-6">บทเรียนทั้งหมด ({courses.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <div key={course.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden group">
                            <div className="aspect-video relative">
                                <img src={course.thumbnail_url || '/placeholder.png'} className="w-full h-full object-cover" />
                                <button onClick={async () => { if (confirm('ลบคอร์สนี้?')) { await supabase.from('courses').delete().eq('id', course.id); fetchCourses(); } }} className="absolute top-2 right-2 p-2 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="p-4">
                                <h4 className="font-bold truncate">{course.title}</h4>
                                <p className="text-xs text-gray-500 mt-1 truncate">{course.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
