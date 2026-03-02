"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Define the type for the course data
interface Course {
    id: string;
    title: string;
    description: string;
    content: string; // HTML or Markdown content (assuming rich text for now)
    video_url?: string;
    duration?: string;
    module?: string;
}

export default function CoursePage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Quiz states
    const [quizStarted, setQuizStarted] = useState(false);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [score, setScore] = useState<number | null>(null);

    const quizQuestions = [
        {
            id: 1,
            question: "Order Block (OB) คืออะไรในแนวคิด SMC?",
            options: ["แท่งเทียนสุดท้ายก่อนราคาจะระเบิดไปทิศทางใหม่ (Imbalance)", "จุดที่ราคาพักตัวนานที่สุด", "เส้นค่าเฉลี่ยเคลื่อนที่แบบพิเศษ", "รูปแบบแท่งเทียนกลับตัวทั่วไป"],
            correctAnswer: 0
        },
        {
            id: 2,
            question: "Liquidity ในตลาดมักจะถูกสร้างขึ้นเพื่อจุดประสงค์ใด?",
            options: ["เพื่อให้รายย่อยทำกำไรได้ง่ายขึ้น", "เพื่อเป็นเชื้อเพลิงให้สถาบันผลักดันราคา", "เพื่อบอกใบ้ทิศทางราคาล่วงหน้า", "เพื่อทำให้กราฟดูสวยงาม"],
            correctAnswer: 1
        },
        {
            id: 3,
            question: "Fair Value Gap (FVG) เกิดขึ้นเมื่อใด?",
            options: ["เมื่อตลาดเปิดในวันจันทร์", "เมื่อราคาวิ่งช้าลงและเกิดการสะสม", "เมื่อเกิดการซื้อขายที่ไม่สมดุลอย่างรุนแรง ทำให้เกิดช่องว่าง", "เมื่อข่าวสำคัญประกาศออกมา"],
            correctAnswer: 2
        },
        {
            id: 4,
            question: "คำว่า 'Sweep Liquidity' หมายถึงอะไร?",
            options: ["การล้างพอร์ตของรายย่อยทีเดียวทั้งหมด", "การกวาด Stop Loss ก่อนที่ราคาจะกลับตัวไปในทิศทางจริง", "การเทขายทำกำไรทั้งหมด", "การเข้าซื้ออย่างบ้าคลั่งไล่ราคา"],
            correctAnswer: 1
        },
        {
            id: 5,
            question: "Break of Structure (BOS) และ Change of Character (CHOCH) แตกต่างกันอย่างไร?",
            options: ["BOS คือทำไปตามเทรนด์เดิม CHOCH คือสัญญาณแรกของการเปลี่ยนเทรนด์", "BOS คือเปลี่ยนเทรนด์ CHOCH คือไปตามเทรนด์เดิม", "ไม่มีความแตกต่างกัน ใช้แทนกันได้", "ใช้ไม่ได้ผลในตลาดจริง"],
            correctAnswer: 0
        }
    ];

    const handleSubmitQuiz = () => {
        let currentScore = 0;
        quizQuestions.forEach(q => {
            if (answers[q.id] === q.correctAnswer) {
                currentScore++;
            }
        });
        setScore(currentScore);
    };

    // Initialize Supabase Client
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch user basic auth status just to ensure they are logged in
                const { data: { user }, error: authError } = await supabase.auth.getUser();
                if (authError || !user) {
                    router.push("/login");
                    return;
                }
                setUserId(user.id);

                const { data, error: courseError } = await supabase
                    .from("courses")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (courseError) {
                    throw courseError;
                }

                if (data) {
                    setCourse(data);
                } else {
                    setError("Course not found.");
                }
            } catch (err: any) {
                console.error("Error fetching course:", err);
                setError("Failed to load course details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCourse();
        }
    }, [id, supabase, router]);

    const handleMarkCompleted = async () => {
        if (!userId) return;
        setIsSaving(true);

        try {
            const dataToSave: any = { user_id: userId, course_id: id, status: 'completed' };
            if (id === "4" && score !== null) {
                dataToSave.quiz_score = score;
            }

            const { error } = await supabase
                .from('user_progress')
                .upsert(dataToSave);

            if (error) {
                console.error("Error saving progress:", error);
                setIsSaving(false);
                return;
            }

            setIsCompleted(true);
            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);
        } catch (err) {
            console.error("Unexpected error:", err);
            setIsSaving(false);
        }
    };

    const getYoutubeEmbedUrl = (url?: string) => {
        if (!url) return null;
        try {
            const urlObj = new URL(url);
            if (urlObj.hostname === 'youtu.be') {
                return `https://www.youtube.com/embed${urlObj.pathname}`;
            }
            if (urlObj.hostname.includes('youtube.com')) {
                if (urlObj.pathname === '/watch') {
                    return `https://www.youtube.com/embed/${urlObj.searchParams.get('v')}`;
                }
                if (urlObj.pathname.startsWith('/embed/')) {
                    return url;
                }
            }
        } catch (e) {
            // Invalid URL format
        }
        return url;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 border-4 border-blue-700/30 border-t-blue-700 rounded-full animate-spin"></div>
                <h2 className="text-white mt-6 text-xl font-medium animate-pulse">Loading Lesson...</h2>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 text-center">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-white mb-2">Error Loading Course</h2>
                <p className="text-gray-400 mb-6 max-w-md">{error || "Could not find the requested course."}</p>
                <button
                    onClick={() => router.push("/dashboard")}
                    className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700"
                >
                    Return to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col md:flex-row">
            {/* Sidebar: Lesson Navigation */}
            <aside className="w-full md:w-80 lg:w-96 bg-gray-900 border-r border-gray-800 flex flex-col h-auto md:h-screen md:sticky top-0 overflow-y-auto">
                <div className="p-6 border-b border-gray-800 shrink-0">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center text-gray-400 hover:text-white transition-colors group mb-6 text-sm"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <div className="text-xs font-bold text-red-500 tracking-wider uppercase mb-2">
                        {course.module || "Course Module"}
                    </div>
                    <h2 className="text-xl font-bold text-white">{course.title}</h2>

                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
                        {course.duration && (
                            <div className="flex items-center gap-1.5">
                                <span>⏱</span> {course.duration}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 p-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Lesson Contents</h3>

                    <div className="space-y-4">
                        {/* Current Lesson Highlight in Sidebar */}
                        <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4 cursor-pointer">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 text-blue-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <div>
                                    <h4 className="font-medium text-blue-500">1. {course.title}</h4>
                                    <p className="text-xs text-gray-400 mt-1">Currently Playing</p>
                                </div>
                            </div>
                        </div>

                        {/* Dummy upcoming lessons for aesthetic purposes */}
                        <div className="border border-gray-800 rounded-lg p-4 hover:bg-gray-800/50 transition-colors cursor-pointer opacity-70">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 text-gray-500 flex items-center justify-center w-5 h-5 rounded-full border border-gray-600">
                                    <span className="text-[10px]">🔒</span>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-300">2. Next Lesson Setup</h4>
                                    <p className="text-xs text-gray-500 mt-1">Complete current to unlock</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 bg-gray-950 p-6 md:p-10 lg:p-12 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    {/* Video Player Placeholder / Area */}
                    <div className="w-full aspect-video bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl relative group mb-10 flex items-center justify-center">

                        {course.video_url ? (
                            <iframe
                                src={getYoutubeEmbedUrl(course.video_url) || course.video_url}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Course Video"
                            />
                        ) : (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-950 opacity-50"></div>
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-20 h-20 bg-blue-600/20 text-blue-500 rounded-full flex items-center justify-center border border-blue-600/40 cursor-pointer hover:bg-blue-600/30 hover:scale-105 transition-all shadow-[0_0_30px_rgba(37,99,235,0.2)]">
                                        <svg className="w-8 h-8 md:w-10 md:h-10 ml-1 md:ml-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                                    </div>
                                    <p className="mt-4 text-gray-400 font-medium tracking-wide">Video Content Pending</p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Course Content Details */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 mb-10 prose prose-invert prose-blue max-w-none">
                        <h1 className="text-3xl font-bold mb-6">{course.title}</h1>

                        {/* Render HTML content securely if it's HTML, or just text. 
                    Assuming simple text or minimal safe HTML for now */}
                        <div
                            className="text-gray-300 leading-relaxed space-y-4"
                            dangerouslySetInnerHTML={{ __html: course.content || course.description }}
                        />
                    </div>

                    {/* Completion Action / Quiz Section */}
                    {id === "4" ? (
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mt-12 mb-20 md:mb-10">
                            {!quizStarted ? (
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-blue-500 mb-4">📝 Quiz ท้ายบท: SMC Masterclass</h3>
                                    <p className="text-gray-400 mb-6 max-w-lg mx-auto">
                                        แบบทดสอบนี้มี 5 ข้อ เพื่อวัดความเข้าใจเรื่อง Order Block และ Liquidity
                                        คุณต้องตอบถูกอย่างน้อย 4 ข้อ ถึงจะสามารถผ่านบทเรียนนี้ได้!
                                    </p>
                                    <button
                                        onClick={() => setQuizStarted(true)}
                                        className="px-8 py-3 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(29,78,216,0.3)] transition-all hover:scale-105"
                                    >
                                        เริ่มทำแบบทดสอบ
                                    </button>
                                </div>
                            ) : score === null ? (
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <span className="text-blue-500">📝</span> ทำแบบทดสอบ (SMC)
                                    </h3>
                                    <div className="space-y-8">
                                        {quizQuestions.map((q, index) => (
                                            <div key={q.id} className="bg-gray-950/50 p-6 rounded-xl border border-gray-800/50">
                                                <h4 className="font-semibold text-lg mb-4 text-blue-400">
                                                    ข้อ {index + 1}: {q.question}
                                                </h4>
                                                <div className="space-y-3">
                                                    {q.options.map((opt, i) => (
                                                        <label key={i} className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer border transition-all ${answers[q.id] === i ? 'border-blue-500 bg-blue-500/10' : 'border-gray-800 hover:border-gray-700 hover:bg-gray-800/50'}`}>
                                                            <div className="mt-0.5">
                                                                <input
                                                                    type="radio"
                                                                    name={`question-${q.id}`}
                                                                    value={i}
                                                                    checked={answers[q.id] === i}
                                                                    onChange={() => setAnswers(prev => ({ ...prev, [q.id]: i }))}
                                                                    className="w-4 h-4 text-blue-500 bg-gray-900 border-gray-700 focus:ring-blue-500 focus:ring-offset-gray-900"
                                                                />
                                                            </div>
                                                            <span className={answers[q.id] === i ? 'text-blue-500' : 'text-gray-300'}>{opt}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8 flex justify-end">
                                        <button
                                            onClick={handleSubmitQuiz}
                                            disabled={Object.keys(answers).length < 5}
                                            className="px-8 py-3 bg-blue-700 hover:bg-blue-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold rounded-xl transition-all"
                                        >
                                            ส่งคำตอบ
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="text-6xl mb-4">{score >= 4 ? '🎉' : '❌'}</div>
                                    <h3 className={`text-3xl font-bold mb-2 ${score >= 4 ? 'text-blue-500' : 'text-red-400'}`}>
                                        คุณได้คะแนน {score} / 5
                                    </h3>

                                    {score >= 4 ? (
                                        <>
                                            <p className="text-gray-400 mb-8">ยอดเยี่ยมมาก! คุณเข้าใจคอนเซปต์ SMC ได้ดีเยี่ยม สามารถผ่านบทเรียนนี้ได้</p>
                                            <button
                                                onClick={handleMarkCompleted}
                                                disabled={isCompleted || isSaving}
                                                className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg flex justify-center items-center gap-2 mx-auto
                                                    ${isCompleted
                                                        ? 'bg-blue-700/20 text-blue-500 border border-blue-700/30 cursor-default'
                                                        : 'bg-blue-700 hover:bg-blue-600 text-white hover:scale-105 shadow-[0_0_20px_rgba(29,78,216,0.3)]'
                                                    }
                                                    ${isSaving ? 'opacity-75 cursor-not-allowed' : ''}
                                                `}
                                            >
                                                {isCompleted ? (
                                                    <><span className="animate-bounce">✅</span><span>Completed</span></>
                                                ) : isSaving ? (
                                                    <><div className="w-5 h-5 border-2 border-gray-950/30 border-t-gray-950 rounded-full animate-spin"></div><span>Saving...</span></>
                                                ) : (
                                                    "Mark as Completed"
                                                )}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-gray-400 mb-8">เสียใจด้วย คุณต้องตอบถูกอย่างน้อย 4 ข้อเพื่อผ่าน ทบทวนเนื้อหาแล้วลองใหม่นะ</p>
                                            <button
                                                onClick={() => {
                                                    setScore(null);
                                                    setAnswers({});
                                                }}
                                                className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 transition-all"
                                            >
                                                🔄 ลองทำใหม่อีกครั้ง
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-900 to-blue-900/20 border border-gray-800 rounded-2xl mt-12 mb-20 md:mb-10">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Finished this lesson?</h3>
                                <p className="text-gray-400 text-sm">Mark it as completed to track your progress.</p>
                            </div>

                            <button
                                onClick={handleMarkCompleted}
                                disabled={isCompleted || isSaving}
                                className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2
                                    ${isCompleted
                                        ? 'bg-blue-700/20 text-blue-500 border border-blue-700/30 cursor-default shadow-[0_0_20px_rgba(29,78,216,0.2)]'
                                        : 'bg-blue-700 hover:bg-blue-600 text-white shadow-lg shadow-blue-700/20 scale-100 hover:scale-105'
                                    }
                                    ${isSaving ? 'opacity-75 cursor-not-allowed' : ''}
                                `}
                            >
                                {isCompleted ? (
                                    <>
                                        <span className="animate-bounce">✅</span>
                                        <span>Completed</span>
                                    </>
                                ) : isSaving ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-gray-950/30 border-t-gray-950 rounded-full animate-spin"></div>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    "Mark as Completed"
                                )}
                            </button>
                        </div>
                    )}

                    {/* If completed, show success message transitioning */}
                    {isCompleted && (
                        <div className="text-center text-blue-500 animate-pulse mt-4">
                            Great job! Returning to dashboard...
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
