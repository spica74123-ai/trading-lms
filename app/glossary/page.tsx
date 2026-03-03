"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

// Define the type for our vocabulary data
type Vocabulary = {
    id: string; // usually UUID from Supabase
    term: string;
    category: string;
    categoryColor?: string; // We might need to map this on the frontend depending on your DB schema
    meaning: string;
};

export default function GlossaryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");

    // New states for Supabase data
    const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initialize Supabase Client
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Fetch data from Supabase
    useEffect(() => {
        const fetchVocabularies = async () => {
            try {
                // Fetch all rows from the 'vocabularies' table
                const { data, error } = await supabase
                    .from("vocabularies")
                    .select("*")
                    .order('term', { ascending: true }); // Alphabetical order by default

                if (error) {
                    throw error;
                }

                if (data) {
                    // Map data to ensure categoryColor exists for the UI
                    // (Assuming 'categoryColor' isn't explicitly in the DB, we infer it from 'category')
                    const mappedData = data.map(item => ({
                        ...item,
                        categoryColor: item.category === "Basic" ? "blue" : "emerald"
                    }));
                    setVocabularies(mappedData);
                }
            } catch (err: unknown) {
                console.error("Error fetching vocabularies:", err);
                setError(err instanceof Error ? err.message : "Failed to load glossary data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchVocabularies();
    }, [supabase]);

    // Derived state for filtering
    const filteredData = vocabularies.filter(item => {
        const matchesSearch = item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.meaning.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter = activeFilter === "All" ||
            (activeFilter === "Basic Vocabulary" && item.category === "Basic") ||
            (activeFilter === "Technical Indicators" && item.category === "Indicator");

        return matchesSearch && matchesFilter;
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                <h2 className="text-white mt-6 text-xl font-medium animate-pulse">Loading Glossary Terms...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6">
                <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-2xl max-w-md text-center text-red-200">
                    <span className="text-4xl mb-4 block">⚠️</span>
                    <h2 className="text-lg font-bold mb-2">Failed to load data</h2>
                    <p className="text-sm">{error}</p>
                    <p className="text-xs text-red-400 mt-4">Check if the &apos;vocabularies&apos; table exists in your Supabase project.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Header & Search Section */}
                <div className="text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 inline-block mt-8">
                        Trading Glossary
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Master the language of the markets. Search for terms, indicators, and concepts essential for every trader.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative mt-8">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="text-gray-500 text-xl">🔍</span>
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search glossary (e.g., 'RSI' or 'Pip')..."
                            className="w-full bg-gray-900 border border-gray-800 text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-500 shadow-xl"
                        />
                    </div>
                </div>

                {/* Categories Overview Snippet */}
                <div className="flex flex-wrap justify-center gap-4 py-4">
                    <button
                        onClick={() => setActiveFilter("All")}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${activeFilter === "All"
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20"
                            : "bg-gray-900 text-gray-400 border border-gray-800 hover:text-white"
                            }`}
                    >
                        All Terms
                    </button>
                    <button
                        onClick={() => setActiveFilter("Basic Vocabulary")}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${activeFilter === "Basic Vocabulary"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20"
                            : "bg-gray-900 text-gray-400 border border-gray-800 hover:text-white"
                            }`}
                    >
                        Basic Vocabulary
                    </button>
                    <button
                        onClick={() => setActiveFilter("Technical Indicators")}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${activeFilter === "Technical Indicators"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                            : "bg-gray-900 text-gray-400 border border-gray-800 hover:text-white"
                            }`}
                    >
                        Technical Indicators
                    </button>
                </div>

                {/* Glossary Grid */}
                {filteredData.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                        {filteredData.map((item) => (
                            <div key={item.id} className={`bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:border-${item.category === 'Basic' ? 'purple' : 'emerald'}-500/50 hover:shadow-[0_0_20px_rgba(${item.category === 'Basic' ? '168,85,247' : '16,185,129'},0.1)] transition-all group`}>
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className={`text-2xl font-bold text-white group-hover:text-${item.category === 'Basic' ? 'purple' : 'emerald'}-400 transition-colors`}>
                                        {item.term}
                                    </h2>
                                    <span className={`px-2.5 py-1 bg-${item.categoryColor || (item.category === 'Basic' ? 'blue' : 'emerald')}-500/10 text-${item.categoryColor || (item.category === 'Basic' ? 'blue' : 'emerald')}-400 text-xs font-bold rounded-lg border border-${item.categoryColor || (item.category === 'Basic' ? 'blue' : 'emerald')}-500/20`}>
                                        {item.category}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {item.meaning}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-xl font-medium">No results found for &quot;{searchQuery}&quot;</p>
                        <button
                            onClick={() => { setSearchQuery(""); setActiveFilter("All"); }}
                            className="mt-4 text-purple-400 hover:text-purple-300 underline"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
