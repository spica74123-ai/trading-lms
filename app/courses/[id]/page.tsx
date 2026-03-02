"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

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
            const { error } = await supabase
                .from('user_progress')
                .upsert({ user_id: userId, course_id: id, status: 'completed' });

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
                <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
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
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="flex items-center text-gray-400 hover:text-white transition-colors mb-6 text-sm"
                    >
                        <span className="mr-2">←</span> Back to Dashboard
                    </button>
                    <div className="text-xs font-bold text-emerald-500 tracking-wider uppercase mb-2">
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
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 cursor-pointer">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 text-emerald-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <div>
                                    <h4 className="font-medium text-emerald-400">1. {course.title}</h4>
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
                                    <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/40 cursor-pointer hover:bg-emerald-500/30 hover:scale-105 transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                        <svg className="w-8 h-8 md:w-10 md:h-10 ml-1 md:ml-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                                    </div>
                                    <p className="mt-4 text-gray-400 font-medium tracking-wide">Video Content Pending</p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Course Content Details */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 mb-10 prose prose-invert prose-emerald max-w-none">
                        <h1 className="text-3xl font-bold mb-6">{course.title}</h1>

                        {/* Render HTML content securely if it's HTML, or just text. 
                    Assuming simple text or minimal safe HTML for now */}
                        <div
                            className="text-gray-300 leading-relaxed space-y-4"
                            dangerouslySetInnerHTML={{ __html: course.content || course.description }}
                        />
                    </div>

                    {/* Completion Action */}
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-900 to-emerald-900/20 border border-gray-800 rounded-2xl mt-12 mb-20 md:mb-10">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">Finished this lesson?</h3>
                            <p className="text-gray-400 text-sm">Mark it as completed to track your progress.</p>
                        </div>

                        <button
                            onClick={handleMarkCompleted}
                            disabled={isCompleted || isSaving}
                            className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2
                      ${isCompleted
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                                    : 'bg-emerald-500 hover:bg-emerald-400 text-gray-950 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-100 hover:scale-105'
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

                    {/* If completed, show success message transitioning */}
                    {isCompleted && (
                        <div className="text-center text-emerald-400 animate-pulse mt-4">
                            Great job! Returning to dashboard...
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
