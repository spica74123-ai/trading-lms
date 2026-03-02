import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, BookOpen, BarChart2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="bg-white p-1 rounded-lg group-hover:scale-105 transition-transform">
            <Image
              src="/logo.png"
              alt="Creative Investment Space"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black leading-none text-white uppercase tracking-tighter">
              Creative Investment
            </span>
            <span className="text-xs font-bold text-red-500 tracking-[0.2em] uppercase">
              Space
            </span>
          </div>
        </Link>
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
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-red-500">
            With Data & Discipline.
          </span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          ยกระดับการเทรดของคุณด้วยแพลตฟอร์มการเรียนรู้ที่สมบูรณ์แบบที่สุด พร้อมเครื่องมือวิเคราะห์กราฟ Real-time และระบบบันทึกสถิติอัจฉริยะ
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <Link href="/dashboard" className="group bg-blue-700 hover:bg-blue-600 px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center gap-2 shadow-lg shadow-blue-700/20">
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
              icon: <BarChart2 className="text-red-500" />,
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

      {/* About Us Section */}
      <section className="py-20 bg-gray-950 relative overflow-hidden">
        {/* แสงฟุ้งสีน้ำเงิน-แดง ด้านหลัง */}
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] -translate-y-1/2"></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-red-500 uppercase tracking-[0.3em] mb-4">About Our Community</h2>
            <h3 className="text-4xl md:text-5xl font-black text-white">
              ยินดีต้อนรับสู่ <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-red-500">Creative Investment Space</span> 💡
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-lg text-gray-400 leading-relaxed">
              <p className="text-white font-medium text-xl">
                &quot;สังคมนักเทรด สังคมแห่งโลกของการลงทุน พื้นที่ของการเรียนรู้&quot;
              </p>
              <p>
                เราไม่ได้เป็นเพียงแค่แพลตฟอร์มการสอนเทรด แต่เราคือ <strong>Community</strong> ที่รวบรวมเหล่านักลงทุนที่ต้องการพัฒนาศักยภาพตนเองอย่างแท้จริง
                ด้วยหลักสูตรที่เจาะลึกทั้ง <strong>SMC (Smart Money Concepts)</strong> และ <strong>ICT (Inner Circle Trader)</strong>
                เพื่อให้คุณก้าวข้ามขีดจำกัดและเทรดอย่างมีระบบ
              </p>
              <div className="flex gap-4 pt-4">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-white">1,000+</span>
                  <span className="text-sm text-gray-500">Active Members</span>
                </div>
                <div className="w-px h-12 bg-gray-800"></div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-white">100%</span>
                  <span className="text-sm text-gray-500">Verified Strategies</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-3xl hover:border-blue-600/50 transition-colors">
                <div className="text-blue-500 mb-4">📊</div>
                <h4 className="text-white font-bold mb-2">Advanced Analysis</h4>
                <p className="text-xs text-gray-500">วิเคราะห์กราฟด้วยเทคนิคระดับสถาบัน</p>
              </div>
              <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-3xl hover:border-red-500/50 transition-colors mt-8">
                <div className="text-red-500 mb-4">🤝</div>
                <h4 className="text-white font-bold mb-2">Sharing Space</h4>
                <p className="text-xs text-gray-500">สังคมแห่งการแบ่งปันความรู้และประสบการณ์</p>
              </div>
              <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-3xl hover:border-blue-600/50 transition-colors">
                <div className="text-blue-500 mb-4">💡</div>
                <h4 className="text-white font-bold mb-2">Learning Path</h4>
                <p className="text-xs text-gray-500">เส้นทางการเรียนรู้ที่ออกแบบมาเพื่อคุณ</p>
              </div>
              <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-3xl hover:border-red-500/50 transition-colors mt-8">
                <div className="text-red-500 mb-4">🏆</div>
                <h4 className="text-white font-bold mb-2">Growth Mindset</h4>
                <p className="text-xs text-gray-500">เติบโตไปพร้อมกับสังคมนักลงทุนคุณภาพ</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}