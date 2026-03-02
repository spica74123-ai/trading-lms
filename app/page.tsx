import Link from 'next/link';
import { TrendingUp, BookOpen, BarChart2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tighter">
          TRADING LMS
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard" className="bg-white/5 hover:bg-white/10 px-6 py-2 rounded-full border border-white/10 transition-all font-medium">
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-8 pt-20 pb-32 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
          <ShieldCheck className="w-4 h-4" />
          <span>Next-Gen Trading Education Platform</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tight">
          Master the Markets <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-500">
            With Data & Discipline.
          </span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          ยกระดับการเทรดของคุณด้วยแพลตฟอร์มการเรียนรู้ที่สมบูรณ์แบบที่สุด พร้อมเครื่องมือวิเคราะห์กราฟ Real-time และระบบบันทึกสถิติอัจฉริยะ
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <Link href="/dashboard" className="group bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20">
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-8 py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <BookOpen className="text-blue-400" />,
              title: "Expert Courses",
              desc: "หลักสูตรเจาะลึก Fibonacci, RSI และ Price Action จากเทรดเดอร์อาชีพ"
            },
            {
              icon: <BarChart2 className="text-emerald-400" />,
              title: "Advanced Tools",
              desc: "วิเคราะห์กราฟทองคำและคู่เงินแบบ Real-time พร้อมอินดิเคเตอร์ระดับสูง"
            },
            {
              icon: <TrendingUp className="text-purple-400" />,
              title: "Smart Journal",
              desc: "ระบบบันทึกและคำนวณ Win Rate อัตโนมัติเพื่อพัฒนาวินัยการเทรด"
            }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-3xl bg-gray-900/50 border border-white/5 hover:border-blue-500/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}