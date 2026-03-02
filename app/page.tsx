export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mb-16">
        <h1 className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          Trading LMS Masterclass
        </h1>
        <p className="text-xl text-gray-400">
          ยกระดับการเทรดของคุณด้วยแพลตฟอร์มการเรียนรู้ที่สมบูรณ์แบบที่สุด พร้อมเครื่องมือและอินดิเคเตอร์ระดับมืออาชีพ
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {/* Card 1: Courses */}
        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-blue-500 transition-all cursor-pointer">
          <div className="text-blue-500 text-4xl mb-4">📚</div>
          <h2 className="text-2xl font-bold mb-3">Courses</h2>
          <p className="text-gray-400">บทเรียนตั้งแต่พื้นฐานจนถึงการใช้ Fibonacci และ ATR</p>
        </div>

        {/* Card 2: Trading Tools */}
        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-emerald-500 transition-all cursor-pointer">
          <div className="text-emerald-500 text-4xl mb-4">📈</div>
          <h2 className="text-2xl font-bold mb-3">Trading Tools</h2>
          <p className="text-gray-400">ทดลองใช้เครื่องมือจำลองการเทรดด้วยกราฟจริง (XAU/USD)</p>
        </div>

        {/* Card 3: Glossary */}
        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-purple-500 transition-all cursor-pointer">
          <div className="text-purple-500 text-4xl mb-4">📖</div>
          <h2 className="text-2xl font-bold mb-3">Glossary</h2>
          <p className="text-gray-400">คลังคำศัพท์การเทรดที่มือใหม่ทุกคนต้องรู้ (Pip, Lot, Spread)</p>
        </div>
      </div>
    </div>
  );
}