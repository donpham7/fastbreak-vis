import { useEffect, useState } from "react";
import Header from './components/Header';
import StandingList from './components/StandingList';
import StatLeaderCard from './components/StatLeaderCard';
import * as Separator from "@radix-ui/react-separator";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import { DatePicker } from "./components/lib/Calender.js";
// import { set } from "date-fns";
import {
    // fetchTeamLogo,
    buildGameLogos,
    buildTeamLogo,
} from "../lib/bbr/GetImages.js";
import {
    getGamesFromDate,
    getStandings,
    getPlayersByStats,
} from "../lib/serverFunctions/server_api.js";

const images = [
    "https://picsum.photos/id/1015/800/400",
    "https://picsum.photos/id/1016/800/400",
    "https://picsum.photos/id/1018/800/400",
];


export default function Home() {
    const [games, setGames] = useState([]);
    const [logos, setLogos] = useState([]);
    const [standingEastLogos, setEastStandingLogos] = useState([]);
    const [standingEast, setEastStanding] = useState([]);
    const [standingWestLogos, setWestStandingLogos] = useState([]);
    const [standingWest, setWestStanding] = useState([]);
    const [current, setCurrent] = useState(0);
    const [statsLeaders, setStatsLeaders] = useState({});

    // const expectedStatsHeaders = ["PTS_PG", "AST_PG", "REB_PG"];

    /* 
    ============================ Highlight Section ============================ 
    */
    const prevSlide = () =>
        setCurrent((current - 1 + images.length) % images.length);
    const nextSlide = () => setCurrent((current + 1) % images.length);

    /* 
    ============================ Today's Games Section ============================ 
    */

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const initialDate = new Date().toLocaleDateString('en-CA', {
        timeZone: userTimeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    const [today, setToday] = useState(initialDate);

    function handleTodaysDate() {
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        console.log("User's time zone:", userTimeZone); // e.g., "America/Chicago"

        const localDate = new Date().toLocaleDateString('en-CA', {
            timeZone: userTimeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        setToday(localDate);
        console.log("Today's date:", today);

        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(0, 0, 0, 0); 
        midnight.setDate(midnight.getDate() + 1); 
        const msUntilMidnight = midnight - now;


        // Schedule update at midnight
        const timeout = setTimeout(() => {
            const updated = new Date();
            const newLocalDate = updated.toLocaleDateString('en-CA', {
                timeZone: userTimeZone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
            setToday(newLocalDate);
        }, msUntilMidnight);

        // Cleanup function to clear timeout if component unmounts
        return () => clearTimeout(timeout);
    }


    async function handleDateChange(today) {
        let year, month, day;
        [year, month, day] = today.split('-');
        var gamesData = await getGamesFromDate(year, month, day);
        if (!gamesData) {
            console.log("No games data for today, fetching for 2025-10-11");
            gamesData = await getGamesFromDate("2025", "10", "11");
        }
        setGames(gamesData);
        setLogos(buildGameLogos(gamesData));
        console.log("Fetched games data:", gamesData);
    }

    /* 
    ============================ Standings Section ============================ 
    */

    async function handleStandings(year) {
        var standings = await getStandings(year || 2025);
        var east = [];
        var west = [];
        standings.East.forEach((team) => {
            east.push(buildTeamLogo(team.IMG));
        });
        standings.West.forEach((team) => {
            west.push(buildTeamLogo(team.IMG));
        });
        setEastStanding(standings.East);
        setWestStanding(standings.West);
        setEastStandingLogos(east);
        setWestStandingLogos(west);
        console.log("Fetched standings data:", standings);
    }

    /* 
    ============================ League Leaders Section ============================ 
    */

    async function getLeagueLeaders() {
        console.log("Fetching league leaders for PTS, AST, REB");
        var leaders = await getPlayersByStats(
            ["PTS", "AST", "REB", "STL"],
            [true, true, true, true],
            "2024-25"
        );
        console.log("Fetched league leaders:", leaders);
        setStatsLeaders(leaders);
    }

    /* 
    =============================================================================== 
    */
    useEffect(() => {
        handleTodaysDate(); // run once
    }, );

    useEffect(() => {
        handleDateChange(today); 
        handleStandings();
        getLeagueLeaders();
    }, [today]);

    return (
        <div className="bg-surface_2">
            <Header />

            {/* Today's Games Section */}

            {games.length > 0 ? (
                <div className="w-full overflow-x-auto">
                    <div className="flex flex-row">
                        {games.map((game, index) => (
                            <div
                                key={index}
                                className="flex flex-row items-center justify-center py-2"
                            >
                                <div className="flex flex-row items-center justify-center mx-8">
                                    {/* Home Logo */}
                                    <div className="flex flex-col items-center w-12">
                                        <img
                                            src={logos[index]?.home}
                                            alt="Home Team Logo"
                                            className="h-12 w-12 object-contain"
                                        />
                                        <span className="text-lg font-bold text-text">
                                            {game.HOME_ABBREVIATION}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl ml-4 font-bold text-text">
                                        {game.HOME_SCORE === 0 ? '' : game.HOME_SCORE}
                                    </h3>
                                    <h3 className="text-text ml-2 text-sm font-bold">
                                        {game.GAME_STATUS_TEXT}
                                    </h3>
                                    <h3 className="text-2xl ml-2 font-bold text-text">
                                        {game.AWAY_SCORE === 0 ? '' : game.AWAY_SCORE}
                                    </h3>
                                    {/* Away Logo */}
                                    <div className="flex flex-col ml-4 items-center w-12">
                                        <img
                                            src={logos[index]?.away}
                                            alt="Away Team Logo"
                                            className="h-12 w-12 object-contain"
                                        />
                                        <span className="text-lg font-bold text-text">
                                            {game.VISITOR_ABBREVIATION}
                                        </span>
                                    </div>
                                </div>
                                <Separator.Root
                                    orientation="vertical"
                                    className="bg-gray-300 w-px h-14"
                                    decorative
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-center text-lg text-text py-4">No games today</p>
            )}

            {/* Highlights Section */}

            <div className="relative w-full pt-4">
                {/* Outer wrapper hides overflow */}
                <div className="overflow-hidden">
                    {/* Slide track */}
                    <div
                        className="flex transition-transform duration-500 w-[50%] ease-in-out"
                        style={{
                            transform: `translateX(calc(50% - ${
                                current * 1.25 * 80
                            }%))`,
                        }}
                    >
                        {images.map((src, idx) => (
                            <div
                                key={idx}
                                className="flex-shrink-0 w-full px-2"
                            >
                                <img
                                    src={src}
                                    alt="Highlight"
                                    className="rounded-2xl shadow-lg w-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Left button */}
                <button
                    onClick={prevSlide}
                     className="absolute top-1/2 left-1 sm:left-2 -translate-y-1/2 bg-blue-100 text-blue-600 rounded-full p-1 sm:p-2 shadow hover:bg-blue-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <ChevronLeft className="h-6 w-3 sm:h-12 sm:w-6" />
                </button>

                {/* Right button */}
                <button
                    onClick={nextSlide}
                    className="absolute top-1/2 right-2 sm:right-2 -translate-y-1/2 bg-blue-100 text-blue-600 rounded-full p-2 shadow hover:bg-blue-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <ChevronRight className="h-6 w-3 sm:h-12 sm:w-6" />
                </button>

                {/* Dots */}
                <div className="flex justify-center mt-4 space-x-2">
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`w-2 h-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                                current === idx
                                    ? "bg-blue-600"
                                    : "bg-blue-100 hover:bg-blue-200 border border-blue-300"
                            }`}
                        />
                    ))}
                </div>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 m-4">

                {/* Conference Standings Section */}

                <div>
                    <div className="rounded-2xl border border-gray-200 bg-white shadow-md p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-8">
                        <div className="flex-1 flex flex-col justify-start">
                            <h2 className="text-xl sm:text-xl font-bold mb-2">Western Conference</h2>
                            <StandingList standingData={standingWest} logos={standingWestLogos} />
                        </div>

                        <div className="flex-1 flex flex-col justify-start">
                            <h2 className="text-xl sm:text-xl font-bold mb-2">Eastern Conference</h2>
                            <StandingList standingData={standingEast} logos={standingEastLogos} />
                        </div>
                    </div>
                </div>

                {/* Leaders Section */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <StatLeaderCard
                        title="Points per Game"
                        statKey="PTS_PG"
                        data={statsLeaders.PTS_PG || []}
                    />
                    <StatLeaderCard
                        title="Assists per Game"
                        statKey="AST_PG"
                        data={statsLeaders.AST_PG || []}
                    />
                    <StatLeaderCard
                        title="Rebounds per Game"
                        statKey="REB_PG"
                        data={statsLeaders.REB_PG || []}
                    />
                    <StatLeaderCard
                        title="Steals per Game"
                        statKey="STL_PG"
                        data={statsLeaders.STL_PG || []}
                    />
                </div>
            </div>
        </div>
    );
};
