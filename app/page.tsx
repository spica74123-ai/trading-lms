"use client";

import Link from "next/link";
import { Crown, Zap, BarChart3, BookOpen, ShieldCheck, Globe, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-red-500/30">
      {/* --- Navigation --- */}
      <nav className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <img src="/logo.jpg" alt="CIS Logo" className="h-10" />
          <div className="flex gap-4">
            <Link href="/login" className="px-6 py-2 text-sm font-medium hover:text-blue-400 transition-colors">เข้าสู่ระบบ</Link>
            <Link href="/subscribe" className="bg-gradient-to-r from-blue-600 to-red-600 px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-red-500/20 hover:scale-105 transition-transform">
              สมัครสมาชิก VIP
            </Link>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-600/10 to-transparent blur-3xl opacity-50" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-gray-900/50 border border-gray-800 px-4 py-2 rounded-full mb-8 animate-fade-in">
            <Crown className="text-yellow-500" size={16} />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">The Ultimate Trading Institution</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tighter">
            Master the Market with <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-white to-red-500">Creative Investment</span>
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            ยกระดับการเทรดด้วยกลยุทธ์ SMC & ICT จาก Mentor มืออาชีพ <br />
            เปลี่ยนกราฟที่ซับซ้อน ให้เป็นโอกาสในการทำกำไรอย่างยั่งยืน
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Link href="/subscription" className="w-full md:w-auto px-12 py-5 bg-white text-black rounded-2xl font-black text-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
              เริ่มเส้นทาง VIP ของคุณ <ArrowRight size={20} />
            </Link>
            <Link href="/courses" className="w-full md:w-auto px-12 py-5 bg-gray-900 border border-gray-800 rounded-2xl font-bold text-lg hover:border-blue-500 transition-all">
              สำรวจบทเรียน
            </Link>
          </div>
        </div>
      </section>

      {/* --- Course Showcase --- */}
      <section className="py-24 px-6 bg-gray-950/50">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">หลักสูตรระดับสถาบัน</h2>
          <p className="text-gray-500">เนื้อหาครอบคลุมทุกมิติของการเทรดสมัยใหม่</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {['SMC Mastery', 'ICT Core Content', 'Fibonacci Mastery'].map((course, i) => (
            <div key={i} className="group p-8 bg-gray-900 border border-gray-800 rounded-3xl hover:border-red-500/50 transition-all hover:-translate-y-2">
              <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center mb-6 text-blue-500 group-hover:bg-red-500/10 group-hover:text-red-500 transition-colors">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4">{course}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">เจาะลึกอัลกอริทึมของตลาดและพฤติกรรมสถาบันการเงิน เพื่อหาจุดเข้าที่แม่นยำที่สุด</p>
              <span className="text-blue-500 text-xs font-bold uppercase tracking-widest">Enroll Now</span>
            </div>
          ))}
        </div>
      </section>

      {/* --- Exclusive Features --- */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-8 leading-snug">
              ไม่ได้มีแค่บทเรียน แต่เรามอบ <span className="text-red-500">Ecosystem</span> สำหรับนักเทรด
            </h2>
            <div className="space-y-6">
              {[
                { title: "Trading Journal", desc: "บันทึกและวิเคราะห์แผนการเทรดของคุณอย่างเป็นระบบ", icon: <BarChart3 /> },
                { title: "Mentor Feedback", desc: "ส่งการบ้านวิเคราะห์กราฟและรับคำแนะนำโดยตรง", icon: <ShieldCheck /> },
                { title: "Global Leaderboard", desc: "ท้าทายความสามารถและเติบโตไปพร้อมกับชุมชน", icon: <Globe /> }
              ].map((f, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-gray-900 transition-colors">
                  <div className="text-blue-500 mt-1">{f.icon}</div>
                  <div>
                    <h4 className="font-bold mb-1">{f.title}</h4>
                    <p className="text-sm text-gray-500">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-600/20 to-red-600/20 rounded-[3rem] p-1 border border-white/5 aspect-square flex items-center justify-center">
            <img src="/logo.jpg" className="w-64 opacity-50 grayscale hover:grayscale-0 transition-all duration-700" />
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-12 border-t border-gray-900 text-center">
        <p className="text-xs text-gray-600">© 2026 Creative Investment Space. Your Success is Our Mission.</p>
      </footer>
    </div>
  );
}