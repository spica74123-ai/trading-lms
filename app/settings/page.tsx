"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { User, Camera, Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast"; // แนะนำให้ลงเพิ่ม: npm install react-hot-toast

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    interface Profile {
        id: string;
        full_name: string;
        phone: string;
        avatar_url: string;
    }
    const [profile, setProfile] = useState<Profile | null>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        getProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function getProfile() {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            setProfile(data);
        }
        setLoading(false);
    }

    // ฟังก์ชันอัปโหลดรูปภาพใหม่
    async function handleUploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true);
            const file = e.target.files?.[0];
            if (!file) return;

            const { data: { user } } = await supabase.auth.getUser();
            const fileExt = file.name.split('.').pop();
            const filePath = `${user?.id}/${Math.random()}.${fileExt}`;

            // 1. อัปโหลดไปยัง Bucket 'avatars'
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. ดึง Public URL มาเก็บไว้
            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            if (profile) setProfile({ ...profile, avatar_url: data.publicUrl });
            toast.success("อัปโหลดรูปสำเร็จ! อย่าลืมกดบันทึกข้อมูล");
        } catch (error: unknown) {
            toast.error("Error: " + (error instanceof Error ? error.message : "An unknown error occurred"));
        } finally {
            setUploading(false);
        }
    }

    async function handleSave() {
        if (!profile) return;
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        const { error } = await supabase.from('profiles').upsert({
            id: user?.id,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
            updated_at: new Date().toISOString(),
        });

        if (error) {
            console.error("Save error:", error);
            toast.error(`บันทึกไม่สำเร็จ: ${error.message}`);
        }
        else toast.success("อัปเดตโปรไฟล์เรียบร้อย! ✨");
        setLoading(false);
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8">
            <Toaster position="top-right" />
            <div className="max-w-2xl mx-auto">
                <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={20} /> กลับไปหน้า Dashboard
                </Link>

                <h1 className="text-3xl font-bold mb-10">ตั้งค่าโปรไฟล์ส่วนตัว</h1>

                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 space-y-8 shadow-2xl">
                    {/* ส่วนจัดการรูปภาพโปรไฟล์ */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-600/30 bg-gray-800 flex items-center justify-center">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={64} className="text-gray-600" />
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-red-600 p-2 rounded-full cursor-pointer hover:bg-red-700 transition-all shadow-lg border-2 border-gray-900">
                                {uploading ? <Loader2 className="animate-spin" size={20} /> : <Camera size={20} />}
                                <input type="file" className="hidden" onChange={handleUploadAvatar} disabled={uploading} accept="image/*" />
                            </label>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">ชื่อ - นามสกุล</label>
                            <input
                                type="text"
                                value={profile?.full_name || ""}
                                onChange={(e) => setProfile(profile ? { ...profile, full_name: e.target.value } : null)}
                                className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-all"
                                placeholder="ใส่ชื่อของคุณ..."
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={loading || uploading}
                        className="w-full bg-gradient-to-r from-blue-700 to-red-600 py-4 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                    >
                        <Save size={20} />
                        {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                    </button>
                </div>
            </div>
        </div>
    );
}