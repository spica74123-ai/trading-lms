"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Upload, CheckCircle, Clock, MessageSquare, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AssignmentUpload({ courseId }: { courseId: string }) {
    const [uploading, setUploading] = useState(false);
    const [description, setDescription] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true);
            const file = e.target.files?.[0];
            if (!file) return;
            const { data: { user } } = await supabase.auth.getUser();
            const filePath = `${user?.id}/${Date.now()}-${file.name}`;

            // อัปโหลดไปที่ Bucket 'assignments'
            const { error: uploadError } = await supabase.storage
                .from('assignments')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('assignments').getPublicUrl(filePath);
            setPreviewUrl(data.publicUrl);
            toast.success("อัปโหลดรูปกราฟสำเร็จ!");
        } catch (error: unknown) {
            toast.error("อัปโหลดล้มเหลว: " + (error instanceof Error ? error.message : "Error"));
        } finally {
            setUploading(false);
        }
    }

    async function submitAssignment() {
        const { data: { user } } = await supabase.auth.getUser();
        const { error } = await supabase.from('assignments').insert({
            user_id: user?.id,
            course_id: courseId,
            image_url: previewUrl,
            description: description
        });

        if (!error) {
            toast.success("ส่งการบ้านเรียบร้อย! รอ Mentor ตรวจสอบครับ 🚀");
            setPreviewUrl("");
            setDescription("");
        }
    }

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 mt-10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Upload className="text-blue-500" /> ส่งการบ้านวิเคราะห์กราฟ
            </h3>

            <div className="space-y-6">
                {/* Image Upload Area */}
                <div className="aspect-video bg-gray-950 border-2 border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
                    {previewUrl ? (
                        <img src={previewUrl} className="w-full h-full object-cover" alt="Preview Assignment" />
                    ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-2">
                            {uploading ? <Loader2 className="animate-spin text-blue-500" /> : <Upload className="text-gray-600" />}
                            <span className="text-sm text-gray-500">คลิกเพื่ออัปโหลดรูปกราฟ (PNG/JPG)</span>
                            <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                        </label>
                    )}
                </div>

                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="อธิบายแผนการเทรดของคุณ (เช่น ระบุจุด BOS/CHoCH)..."
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-sm focus:border-red-500 focus:outline-none h-32"
                />

                <button
                    onClick={submitAssignment}
                    disabled={!previewUrl || uploading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-4 rounded-xl font-bold transition-all shadow-lg"
                >
                    ส่งการบ้านให้ Mentor
                </button>
            </div>
        </div>
    );
}
