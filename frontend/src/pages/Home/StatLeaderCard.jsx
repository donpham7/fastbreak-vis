import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function StatLeaderCard ({ title, statKey, data }) {
    const [expanded, setExpanded] = useState(false);

    const visibleData = expanded ? data.slice(0, 20) : data.slice(0, 5);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-md p-6">
            <div className="flex flex-col justify-center">
                <h2 className="text-xl font-bold mb-2">{title}</h2>
                <div className="text-gray-600">
                    <div
                    className={`transition-all duration-500 overflow-hidden ${
                        expanded ? 'max-h-[2000px] opacity-100' : 'max-h-[300px] opacity-90'
                    }`}
                    >
                    {data && visibleData.map((player, index) => (
                        <div key={index} className="flex items-center py-2 border-b last:border-b-0">
                            {/* Rank */}
                            <div className="w-8 text-lg font-bold text-blue-600 text-center">{index + 1}.</div>
                            {/* Player Image */}
                            <Link to={`/player/${player.PLAYER_ID}`} className="flex items-center hover:text-blue-800 transition-colors duration-200">
                                <img
                                    src={
                                    player.IMG ||
                                    `https://cdn.nba.com/headshots/nba/latest/1040x760/${player.PLAYER_ID}.png`
                                    }
                                    alt={player.PLAYER}
                                    className="w-10 h-10 rounded-full object-cover mx-2 border border-gray-300"
                                    onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                        'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png';
                                    }}
                                />
                                {/* Name and Team */}
                                <div className="flex flex-col ml-2">
                                    <span className="font-semibold text-base leading-tight">{player.PLAYER}</span>
                                    <span className="text-xs text-gray-500 leading-tight">{player.TEAM}</span>
                                </div>
                            </Link>
                            {/* Stat Value */}
                            <div className="ml-auto font-bold text-lg text-blue-700">{player[statKey]}</div>
                        </div>
                        ))}
                    </div>
                    <div className="flex justify-center mt-2">
                        <button
                            className="ml-2 px-4 py-1 bg-blue-100 text-blue-600 font-semibold rounded-full shadow hover:bg-blue-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            onClick={() => setExpanded(!expanded)}
                        >
                            {expanded ? 'Show Less' : 'Show More'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

