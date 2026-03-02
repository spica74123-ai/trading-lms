"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation"; // [เพิ่ม] สำหรับเปลี่ยนหน้า

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const router = useRouter(); // [เพิ่ม] เรียกใช้งาน router

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleSignUp = async () => {
        setMessage(""); setError("");
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) setError(error.message);
        else setMessage("🎉 สมัครสมาชิกสำเร็จ! (คุณสามารถ Sign In ได้เลย)");
    };

    const handleSignIn = async () => {
        setMessage(""); setError("");
        // ดึงข้อมูล data ออกมาเช็คด้วย
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setError(error.message);
        } else if (data.user) {
            setMessage("✅ เข้าสู่ระบบสำเร็จ! กำลังพาคุณไปที่ Dashboard...");

            // [แก้ไข] สั่งให้เปลี่ยนหน้าไปที่ /dashboard หลังจากล็อกอินสำเร็จ
            setTimeout(() => {
                router.push('/dashboard');
            }, 1000); // หน่วงเวลา 1 วินาทีให้เห็นข้อความสำเร็จ
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 w-full max-w-md shadow-2xl">
                <h1 className="text-2xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-red-500">
                    Creative Investment Space Login
                </h1>

                {message && <p className="mb-4 text-emerald-400 text-sm text-center font-medium bg-emerald-900/30 p-2 rounded">{message}</p>}
                {error && <p className="mb-4 text-red-400 text-sm text-center font-medium bg-red-900/30 p-2 rounded">{error}</p>}

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="trader@example.com"
                    />
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="••••••••"
                    />
                </div>

                <div className="flex gap-4">
                    <button onClick={handleSignIn} className="flex-1 bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg shadow-blue-700/20">
                        Sign In
                    </button>
                    <button onClick={handleSignUp} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg shadow-red-600/20">
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
}