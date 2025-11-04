import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


export default function Players() {
    const [players, setPlayers] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const playersPerPage = 50;
    const navigate = useNavigate();
    const [suggestions, setSuggestions] = useState([]);
    const [activeIndex, setActiveIndex] = useState(-1);

    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (search.trim()) {
                const res = await fetch(`/api/search_players/${encodeURIComponent(search.trim())}`);
                const data = await res.json();
                console.log("data", data)
                setSuggestions(data); 
                setActiveIndex(-1);
            } else {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [search]);

    const handleSelect = (playerId) => {
        navigate(`/player/${playerId}`);
        setSearch('');
        setSuggestions([]);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
        } else if (e.key === 'ArrowUp') {
            setActiveIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && activeIndex >= 0) {
            handleSelect(suggestions[activeIndex].player_id);
        }
    };

    useEffect(() => {
        fetch('/api/league_roster') 
            .then(res => res.json())
            .then(data => {
                setPlayers(data)
        });
    }, []);

    if (players.length === 0) {
        return <div>Empty roster</div>;
    };

    const paginatedPlayers = players.slice(
    (page - 1) * playersPerPage,
    page * playersPerPage
    );



    return (
        <div className="bg-[#f5f5f5] min-h-screen">
            <header className="sticky top-0 z-50 bg-black h-16 shadow-md">
                <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center space-x-4 overflow-visible">
                        <img src="/fastbreak-logo.svg" alt="Logo" className="absolute top-[-30px] left-8 h-[126px] w-[126px] object-contain filter invert" />
                    </div>


                    {/* Navigation */}
                    <nav className="flex items-center space-x-6 text-white font-medium">
                        <a href="/" className="hover:text-blue-600 transition">Home</a>
                        <a href="/players" className="hover:text-blue-600 transition">Players</a>
                        <a href="/games" className="hover:text-blue-600 transition">Games</a>
                    </nav>
                </div>
            </header>
          
            <main className="flex justify-center items-start pt-10">
                <div className="bg-white w-[70%] p-5 shadow-md rounded-lg flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold m-0">League Roster</h2>
                        <div className="relative w-[250px]">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Search players..."
                                className="px-2 py-2 text-base w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            {suggestions.length > 0 && (
                                <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded shadow-md z-10">
                                {suggestions.map((player, index) => (
                                    <li
                                    key={player.player_id}
                                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                                        index === activeIndex ? 'bg-gray-200' : ''
                                    }`}
                                    onMouseDown={() => handleSelect(player.player_id)}
                                    >
                                    {player.name}
                                    </li>
                                ))}
                                </ul>
                            )}
                        </div>

                    </div>

                    <hr className="my-4 border-t border-gray-300 w-[70%] self-center" />

                    <table className="w-full border-collapse bg-[#f0f0f0] text-left">

                        <thead>
                            <tr>
                            <th className="p-2 bg-[#e0e0e0] text-[10px] font-sans">PLAYER</th>
                            <th className="p-2 bg-[#e0e0e0] text-[10px] font-sans">TEAM</th>
                            <th className="p-2 bg-[#e0e0e0] text-[10px] font-sans">NUMBER</th>
                            <th className="p-2 bg-[#e0e0e0] text-[10px] font-sans">POSITION</th>
                            <th className="p-2 bg-[#e0e0e0] text-[10px] font-sans">HEIGHT</th>
                            <th className="p-2 bg-[#e0e0e0] text-[10px] font-sans">WEIGHT</th>
                            <th className="p-2 bg-[#e0e0e0] text-[10px] font-sans">LAST ATTENDED</th>
                            <th className="p-2 bg-[#e0e0e0] text-[10px] font-sans">COUNTRY</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedPlayers.map((p, i) => (
                                <React.Fragment key={i}>
                                <tr>
                                    <td className="p-2 bg-white text-sm font-sans">
                                    <div className="flex items-center space-x-2">
                                        <img                                     
                                            src={
                                                p.IMG ||
                                                `https://cdn.nba.com/headshots/nba/latest/1040x760/${p.PERSON_ID}.png`
                                            }
                                            alt={p.DISPLAY_FIRST_LAST} 
                                            className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                        />
                                        <Link to={`/player/${p.PERSON_ID}`} className="text-blue-500 hover:text-blue-800">
                                        {p.DISPLAY_FIRST_LAST}
                                        </Link>
                                    </div>
                                    </td>
                                    <td className="p-2 bg-white text-sm font-sans">{p.TEAM_ABBREVIATION}</td>
                                    <td className="p-2 bg-white text-sm font-sans">{p.JERSEY}</td>
                                    <td className="p-2 bg-white text-sm font-sans">{p.POSITION}</td>
                                    <td className="p-2 bg-white text-sm font-sans">{p.HEIGHT}</td>
                                    <td className="p-2 bg-white text-sm font-sans">{p.WEIGHT}</td>
                                    <td className="p-2 bg-white text-sm font-sans">{p.LAST_AFFILIATION?.split('/')[0]}</td>
                                    <td className="p-2 bg-white text-sm font-sans">{p.COUNTRY}</td>
                                </tr>
                                <tr>
                                    <td colSpan="8" className="border-b border-gray-300 w-[85%] mx-auto"></td>
                                </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-5 flex justify-center gap-2">
                        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
                        <span>Page {page}</span>
                        <button
                        disabled={page * playersPerPage >= players.length}
                        onClick={() => setPage(page + 1)}
                        >
                        Next
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );

};

