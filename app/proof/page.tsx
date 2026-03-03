"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { DollarSign, Quote, TrendingUp, Users, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function WithdrawalProof() {
    interface Review {
        id: string;
        display_name: string;
        amount: string;
        comment: string;
        screenshot_url: string;
        created_at: string;
    }
    const [reviews, setReviews] = useState<Review[]>([]);
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

    useEffect(() => {
        const fetchReviews = async () => {
            const { data } = await supabase.from('profit_reviews').select('*').order('created_at', { ascending: false });
            setReviews(data || []);
        };
        fetchReviews();
    }, []);

    return (
        <div className="min-h-screen bg-[#020617] text-white p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <header className="text-center mb-20 mt-10">
                    <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full mb-6">
                        <TrendingUp className="text-green-500" size={16} />
                        <span className="text-[10px] uppercase font-bold text-green-500 tracking-widest">Success Stories</span>
                    </div>
                    <h1 className="text-5xl font-black mb-4">Proof of Success</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">ผลกำไรและการถอนเงินจริงจากเหล่านักเรียน VIP ที่ใช้กลยุทธ์ SMC & ICT ในการทำกำไรจากตลาด</p>
                </header>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div className="bg-gray-900 border border-gray-800 p-8 rounded-[2rem] text-center">
                        <div className="text-3xl font-black text-blue-500 mb-1">500+</div>
                        <div className="text-xs text-gray-500 uppercase font-bold tracking-widest">Active Students</div>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 p-8 rounded-[2rem] text-center">
                        <div className="text-3xl font-black text-green-500 mb-1">$250K+</div>
                        <div className="text-xs text-gray-500 uppercase font-bold tracking-widest">Total Withdrawals</div>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 p-8 rounded-[2rem] text-center">
                        <div className="text-3xl font-black text-red-500 mb-1">92%</div>
                        <div className="text-xs text-gray-500 uppercase font-bold tracking-widest">Satisfaction Rate</div>
                    </div>
                </div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((rev) => (
                        <div key={rev.id} className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all">
                            <div className="aspect-video bg-black relative overflow-hidden">
                                <img src={rev.screenshot_url} alt="Profit Screenshot" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-black shadow-xl">
                                    Withdrawal: {rev.amount}
                                </div>
                            </div>
                            <div className="p-6">
                                <Quote className="text-blue-500 mb-4 opacity-50" size={24} />
                                <p className="text-sm text-gray-300 mb-6 italic font-light leading-relaxed">&quot;{rev.comment}&quot;</p>
                                <div className="flex items-center gap-3 border-t border-gray-800 pt-6">
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
                                        {rev.display_name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold">{rev.display_name}</div>
                                        <div className="text-[10px] text-gray-500 uppercase font-bold">VIP Member</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="mt-32 mb-20 p-12 bg-gradient-to-br from-blue-600/20 to-red-600/20 rounded-[3rem] border border-white/5 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black mb-4">อยากเป็นหนึ่งในเรื่องราวความสำเร็จของเราไหม?</h2>
                        <p className="text-gray-400 mb-10 max-w-lg mx-auto text-sm leading-relaxed">สมัครเป็นพาร์ทเนอร์และเริ่มต้นเรียนรู้กลยุทธ์ทำกำไรระดับสถาบันได้ฟรีวันนี้</p>
                        <Link href="/subscription" className="inline-flex items-center gap-2 bg-white text-black px-10 py-4 rounded-2xl font-black hover:bg-blue-500 hover:text-white transition-all">
                            ปลดล็อก VIP ผ่านพาร์ทเนอร์ <ExternalLink size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
