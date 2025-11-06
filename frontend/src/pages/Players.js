import React, { useState, useEffect } from 'react';
import Header from './components/Header';
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
            <Header/>
            {/* Player Container */}
            <main className="flex justify-center items-start pt-10">
                <div className="bg-white w-[86%] p-5 shadow-md rounded-lg flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-[24px] font-knockout  m-0 text-gray-800">LEAGUE ROSTER</h2>


                        {/* Search Bar */}

                        <div className="relative w-[300px]">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Search players..."
                                className="px-4 py-2 text-sm w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            />
                            {suggestions.length > 0 && (
                                <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1">
                                {suggestions.map((player, index) => (
                                    <li
                                    key={player.player_id}
                                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
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

                    {/* Horizontal Divider */}

                    <hr className="my-4 border-t border-gray-300 w-full" />

                    {/* Player Table */}

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse bg-[#f0f0f0] text-left">

                            {/* Table Header */}
                            <thead>
                                <tr>
                                <th className="p-2 bg-[#e0e0e0] text-[10px] font-roboto">PLAYER</th>
                                <th className="p-2 bg-[#e0e0e0] text-[10px] font-roboto">TEAM</th>
                                <th className="p-2 bg-[#e0e0e0] text-[10px] font-roboto">NUMBER</th>
                                <th className="p-2 bg-[#e0e0e0] text-[10px] font-roboto">POSITION</th>
                                <th className="p-2 bg-[#e0e0e0] text-[10px] font-roboto">HEIGHT</th>
                                <th className="p-2 bg-[#e0e0e0] text-[10px] font-roboto">WEIGHT</th>
                                <th className="p-2 bg-[#e0e0e0] text-[10px] font-roboto">LAST ATTENDED</th>
                                <th className="p-2 bg-[#e0e0e0] text-[10px] font-roboto">COUNTRY</th>
                                </tr>
                            </thead>
                            <tbody>

                                {/* Table Rows */}


                                {paginatedPlayers.map((p, i) => (
                                    <React.Fragment key={i}>
                                    <tr>
                                        <td className="p-2 bg-white text-sm font-sans">
                                        <div className="flex items-center space-x-2">
                                            <img                                     
                                                src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${p.PERSON_ID}.png`}
                                                alt={p.DISPLAY_FIRST_LAST} 
                                                className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                            />
                                            <Link to={`/player/${p.PERSON_ID}`} className="text-[#0268d6] hover:text-[#0147a3] font-roboto">
                                            {p.DISPLAY_FIRST_LAST}
                                            </Link>
                                        </div>
                                        </td>
                                        <td className="p-2 bg-white text-sm font-roboto">{p.TEAM_ABBREVIATION}</td>
                                        <td className="p-2 bg-white text-sm font-roboto">{p.JERSEY}</td>
                                        <td className="p-2 bg-white text-sm font-roboto">{p.POSITION}</td>
                                        <td className="p-2 bg-white text-sm font-roboto">{p.HEIGHT}</td>
                                        <td className="p-2 bg-white text-sm font-roboto">{p.WEIGHT}</td>
                                        <td className="p-2 bg-white text-sm font-roboto">{p.LAST_AFFILIATION?.split('/')[0]}</td>
                                        <td className="p-2 bg-white text-sm font-roboto">{p.COUNTRY}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="8" className="border-b border-gray-300 w-[85%] mx-auto"></td>
                                    </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pages */}
                    
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

