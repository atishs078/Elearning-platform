import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch } from 'react-icons/fa';
import Data from '../store/Data';
import CourseCard from '../components/CourseCard';
import SideMenu from '../components/SideMenu';

const Search = () => {
    const { host } = Data();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchBy, setSearchBy] = useState('title'); // 'title' or 'category'
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Debounced search function (No change in logic)
    const handleSearch = useCallback(async () => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (searchBy === 'title') {
            params.append('title', searchQuery.trim());
        } else {
            params.append('category', searchQuery.trim());
        }

        try {
            const res = await fetch(`${host}/courses?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) throw new Error('Failed to fetch search results.');

            const json = await res.json();
            setSearchResults(json);

        } catch (err) {
            console.error('Search error:', err);
            setError('Could not connect to the server or retrieve results.');
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    }, [host, searchQuery, searchBy]);

    // Debounce effect (No change in logic)
    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch();
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, searchBy, handleSearch]);


    return (
        // 1. Global Background Change
        <div className="flex bg-slate-900 min-h-screen">
            <div className="w-64 flex-shrink-0">
                <SideMenu isDarkTheme={true} />
            </div>

            <div className="flex-1 p-4 md:p-8">
                {/* 2. Main Title Color Change */}
                <h1 className="text-3xl font-bold text-indigo-400 mb-6 flex items-center">
                    <FaSearch className="mr-3" /> Course Search
                </h1>

                {/* --- Search Input and Filter Container --- */}
                {/* 3. Search Bar Container Background and Shadow Change */}
                <div className="bg-slate-800 p-6 rounded-2xl shadow-xl shadow-slate-700/50 mb-8 flex flex-col md:flex-row gap-4">

                    {/* 4. Input Styling for Dark Theme */}
                    <input
                        type="text"
                        placeholder={`Search by ${searchBy}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 p-3 border border-slate-700 bg-slate-700 text-white rounded-lg text-lg 
                        focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
                    />

                    {/* 5. Select Styling for Dark Theme */}
                    <select
                        value={searchBy}
                        onChange={(e) => setSearchBy(e.target.value)}
                        className="p-3 border border-slate-700 bg-slate-700 text-white rounded-lg appearance-none 
                        focus:ring-indigo-500 focus:border-indigo-500 md:w-48"
                    >
                        <option value="title">By Title</option>
                        <option value="category">By Category</option>
                    </select>

                    {/* 6. Button Styling (Adjusted hover color) */}
                    <button
                        onClick={handleSearch}
                        disabled={searchQuery.trim() === '' || loading}
                        className="p-3 bg-indigo-600 text-white rounded-lg flex items-center justify-center gap-2 
                        hover:bg-indigo-500 transition md:w-40 disabled:bg-gray-700 disabled:text-gray-400 disabled:opacity-70"
                    >
                        {loading ? 'Searching...' : <><FaSearch /> Search</>}
                    </button>
                </div>

                {/* --- Search Results Header --- */}
                {/* 7. Header Text Color Change */}
                <h2 className="text-2xl font-bold text-white mb-4">
                    Results ({searchResults.length})
                </h2>

                {/* 8. Error Message Styling */}
                {error && <p className="text-red-400 bg-red-900/30 p-4 rounded-lg border border-red-800">{error}</p>}

                {/* 9. No Results Message Styling */}
                {!loading && searchQuery.trim() !== '' && searchResults.length === 0 && !error && (
                    <p className="text-yellow-400 bg-yellow-900/30 p-4 rounded-lg border border-yellow-800">
                        No courses found matching "{searchQuery}". Try a different term or category.
                    </p>
                )}

                {/* 10. Course Cards - Relying on CourseCard component to handle dark theme internally */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {searchResults.map((course) => (
                        <CourseCard
                            key={course.id}
                            id={course.id}
                            title={course.title}
                            description={course.shortDescription}
                            thumbnailUrl={course.thumbnailUrl}
                            isDarkTheme={true} // Pass dark theme prop
                        />
                    ))}
                </div>

                {/* 11. Empty Search Prompt Styling */}
                {searchQuery.trim() === '' && !loading && searchResults.length === 0 && (
                    <div className="p-4 text-gray-500">Start typing to search for courses.</div>
                )}

            </div>
        </div>
    );
};

export default Search;