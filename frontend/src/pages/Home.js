import React, { useEffect, useState } from "react";
import {
    fetchTeamLogo,
    buildGameLogos,
    buildTeamLogo,
} from "../lib/bbr/GetImages.js";
import {
    getGamesFromDate,
    getStandings,
    getPlayersByStats,
} from "../lib/serverFunctions/server_api.js";
import { DatePicker } from "./components/lib/Calender.js";
import * as Separator from "@radix-ui/react-separator";
import { set } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    const [date, setDate] = useState(null);
    const [showTodaysGames, setShowTodaysGames] = useState(true);
    const [current, setCurrent] = useState(0);
    const [statsLeaders, setStatsLeaders] = useState({});
    const [expandPointsLeaders, setExpandPointsLeaders] = useState(false);
    const [expandReboundsLeaders, setExpandReboundsLeaders] = useState(false);
    const [expandAssistsLeaders, setExpandAssistsLeaders] = useState(false);
    const [expandStealsLeaders, setExpandStealsLeaders] = useState(false);
    const [videoUrl, setVideoUrl] = useState(
        "https://videos.nba.com/nba/pbp/media/2025/04/01/0022401097/8/2fc68822-5c5f-2d02-eba9-d89deb148806_1280x720.mp4"
    );
    const prevSlide = () =>
        setCurrent((current - 1 + images.length) % images.length);
    const nextSlide = () => setCurrent((current + 1) % images.length);
    const toggleTodaysGames = async () => {
        setShowTodaysGames(!showTodaysGames);
    };

    const expectedStatsHeaders = ["PTS_PG", "AST_PG", "REB_PG"];
    async function handleDateChange(date) {
        var year = date.getFullYear();
        var month = String(date.getMonth() + 1).padStart(2, "0");
        var day = String(date.getDate()).padStart(2, "0");
        var gamesData = await getGamesFromDate(year, month, day);
        if (!gamesData) {
            console.log("No games data for today, fetching for 2025-04-11");
            gamesData = [];
        }
        setGames(gamesData);
        setLogos(buildGameLogos(gamesData));
        setDate(date);
        console.log("Fetched games data:", gamesData);
    }

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

    useEffect(() => {
        handleDateChange(new Date(2025, 3, 11)); // Months are 0-indexed in JS Date
        handleStandings();
        getLeagueLeaders();
    }, []);

    return (
        <div className="bg-surface_2">
            {/* <div
                className="flex flex-row items-center justify-center "
                onClick={toggleTodaysGames}
            >
                {showTodaysGames ? (
                    <p className="select-none cursor-pointer">
                        Hide Today's Games
                    </p>
                ) : (
                    <p className="select-none cursor-pointer">
                        Show Today's Games
                    </p>
                )}
            </div> */}
            {showTodaysGames && (
                <div className="w-full overflow-x-auto sticky bg-white top-0 z-50">
                    <div className="flex flex-row ">
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
                                        {game.HOME_SCORE}
                                    </h3>
                                    <h3 className=" text-text ml-2 text-sm font-bold">
                                        {game.GAME_STATUS_TEXT}
                                    </h3>
                                    <h3 className="text-2xl ml-2 font-bold text-text">
                                        {game.AWAY_SCORE}
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
            )}

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
                                <div className="flex-shrink-0 w-full px-2">
                                    <video
                                        src={videoUrl}
                                        controls
                                        className="rounded-2xl shadow-lg w-full object-cover"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Left button */}
                <button
                    onClick={prevSlide}
                    className="absolute top-1/2 left-2 -translate-y-1/2 bg-blue-100 text-blue-600 rounded-full p-2 shadow hover:bg-blue-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <ChevronLeft className="h-12 w-6" />
                </button>

                {/* Right button */}
                <button
                    onClick={nextSlide}
                    className="absolute top-1/2 right-2 -translate-y-1/2 bg-blue-100 text-blue-600 rounded-full p-2 shadow hover:bg-blue-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <ChevronRight className="h-12 w-6" />
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
            <div class="grid grid-cols-2 gap-4 m-4">
                <div>
                    <div className="rounded-2xl border border-gray-200 bg-white shadow-md p-6 grid grid-cols-9 gap-4">
                        <div className="flex flex-col justify-top col-span-4">
                            <h2 className="text-xl font-bold mb-2">
                                Western Conference
                            </h2>
                            <div className="flex flex-col p-3 gap-0">
                                {standingWest.map((team, index) => (
                                    <div
                                        key={team.TeamAbbr}
                                        className="flex items-center py-2 border-b last:border-b-0"
                                    >
                                        <div className="w-8 text-lg font-bold text-blue-600 text-center mr-4">
                                            {index + 1}.
                                        </div>
                                        {/* Team logo */}
                                        <img
                                            src={standingWestLogos[index]}
                                            alt={team.TeamAbbr}
                                            className="w-10 h-10"
                                        />
                                        {/* City + Team name */}
                                        <div className="flex flex-col ml-3 flex-1">
                                            <span className="font-semibold">
                                                {team.TeamName}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {team.TeamAbbr}{" "}
                                                {team.ClinchIndicator}
                                            </span>
                                        </div>
                                        {/* Record */}
                                        <div className="text-right font-medium w-16">
                                            {team.WINS}-{team.LOSSES}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Separator.Root
                            className="SeparatorRoot"
                            decorative
                            orientation="vertical"
                            style={{ margin: "1px 1px" }}
                        />
                        <div className="flex flex-col justify-top col-span-4">
                            <h2 className="text-xl font-bold mb-2">
                                Eastern Conference
                            </h2>
                            <div className="flex flex-col p-3 gap-0">
                                {standingEast.map((team, index) => (
                                    <div
                                        key={team.TeamAbbr}
                                        className="flex items-center py-2 border-b last:border-b-0"
                                    >
                                        <div className="w-8 text-lg font-bold text-blue-600 text-center mr-4">
                                            {index + 1}.
                                        </div>
                                        {/* Team logo */}
                                        <img
                                            src={standingEastLogos[index]}
                                            alt={team.TeamAbbr}
                                            className="w-10 h-10"
                                        />
                                        {/* City + Team name */}
                                        <div className="flex flex-col ml-3 flex-1">
                                            <span className="font-semibold">
                                                {team.TeamName}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {team.TeamAbbr}{" "}
                                                {team.ClinchIndicator}
                                            </span>
                                        </div>
                                        {/* Record */}
                                        <div className="text-right font-medium w-16">
                                            {team.WINS}-{team.LOSSES}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-gray-200 bg-white shadow-md p-6 ">
                        <div className="flex flex-col justify-center">
                            <h2 className="text-xl font-bold mb-2">
                                Points per Game
                            </h2>
                            <div className="text-gray-600">
                                <div
                                    className={`transition-all duration-500 overflow-hidden ${
                                        expandPointsLeaders
                                            ? "max-h-[2000px] opacity-100"
                                            : "max-h-[300px] opacity-90"
                                    }`}
                                >
                                    {statsLeaders.PTS_PG &&
                                        (expandPointsLeaders
                                            ? statsLeaders.PTS_PG.slice(0, 20)
                                            : statsLeaders.PTS_PG.slice(0, 5)
                                        ).map((player, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center py-2 border-b last:border-b-0"
                                            >
                                                {/* Rank */}
                                                <div className="w-8 text-lg font-bold text-blue-600 text-center">
                                                    {index + 1}.
                                                </div>
                                                {/* Player Image */}
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
                                                            "https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png";
                                                    }}
                                                />
                                                {/* Name and Team */}
                                                <div className="flex flex-col ml-2">
                                                    <span className="font-semibold text-black leading-tight">
                                                        {player.PLAYER}
                                                    </span>
                                                    <span className="text-xs text-gray-500 leading-tight">
                                                        {player.TEAM}
                                                    </span>
                                                </div>
                                                {/* Stat Value */}
                                                <div className="ml-auto font-bold text-lg text-blue-700">
                                                    {player.PTS_PG}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                                <div className="flex justify-center mt-2">
                                    <button
                                        className="ml-2 px-4 py-1 bg-blue-100 text-blue-600 font-semibold rounded-full shadow hover:bg-blue-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        onClick={() =>
                                            setExpandPointsLeaders(
                                                !expandPointsLeaders
                                            )
                                        }
                                    >
                                        {expandPointsLeaders
                                            ? "Show Less"
                                            : "Show More"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white shadow-md p-6 ">
                        <div className="flex flex-col justify-center">
                            <h2 className="text-xl font-bold mb-2">
                                Rebounds per Game
                            </h2>
                            <div className="text-gray-600">
                                <div
                                    className={`transition-all duration-500 overflow-hidden ${
                                        expandReboundsLeaders
                                            ? "max-h-[2000px] opacity-100"
                                            : "max-h-[300px] opacity-90"
                                    }`}
                                >
                                    {statsLeaders.REB_PG &&
                                        (expandReboundsLeaders
                                            ? statsLeaders.REB_PG.slice(0, 20)
                                            : statsLeaders.REB_PG.slice(0, 5)
                                        ).map((player, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center py-2 border-b last:border-b-0"
                                            >
                                                {/* Rank */}
                                                <div className="w-8 text-lg font-bold text-blue-600 text-center">
                                                    {index + 1}.
                                                </div>
                                                {/* Player Image */}
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
                                                            "https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png";
                                                    }}
                                                />
                                                {/* Name and Team */}
                                                <div className="flex flex-col ml-2">
                                                    <span className="font-semibold text-black leading-tight">
                                                        {player.PLAYER}
                                                    </span>
                                                    <span className="text-xs text-gray-500 leading-tight">
                                                        {player.TEAM}
                                                    </span>
                                                </div>
                                                {/* Stat Value */}
                                                <div className="ml-auto font-bold text-lg text-blue-700">
                                                    {player.REB_PG}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                                <div className="flex justify-center mt-2">
                                    <button
                                        className="ml-2 px-4 py-1 bg-blue-100 text-blue-600 font-semibold rounded-full shadow hover:bg-blue-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        onClick={() =>
                                            setExpandReboundsLeaders(
                                                !expandReboundsLeaders
                                            )
                                        }
                                    >
                                        {expandReboundsLeaders
                                            ? "Show Less"
                                            : "Show More"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white shadow-md p-6 ">
                        <div className="flex flex-col justify-center">
                            <h2 className="text-xl font-bold mb-2">
                                Assists per Game
                            </h2>
                            <div className="text-gray-600">
                                <div
                                    className={`transition-all duration-500 overflow-hidden ${
                                        expandAssistsLeaders
                                            ? "max-h-[2000px] opacity-100"
                                            : "max-h-[300px] opacity-90"
                                    }`}
                                >
                                    {statsLeaders.AST_PG &&
                                        (expandAssistsLeaders
                                            ? statsLeaders.AST_PG.slice(0, 20)
                                            : statsLeaders.AST_PG.slice(0, 5)
                                        ).map((player, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center py-2 border-b last:border-b-0"
                                            >
                                                {/* Rank */}
                                                <div className="w-8 text-lg font-bold text-blue-600 text-center">
                                                    {index + 1}.
                                                </div>
                                                {/* Player Image */}
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
                                                            "https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png";
                                                    }}
                                                />
                                                {/* Name and Team */}
                                                <div className="flex flex-col ml-2">
                                                    <span className="font-semibold text-black leading-tight">
                                                        {player.PLAYER}
                                                    </span>
                                                    <span className="text-xs text-gray-500 leading-tight">
                                                        {player.TEAM}
                                                    </span>
                                                </div>
                                                {/* Stat Value */}
                                                <div className="ml-auto font-bold text-lg text-blue-700">
                                                    {player.AST_PG}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                                <div className="flex justify-center mt-2">
                                    <button
                                        className="ml-2 px-4 py-1 bg-blue-100 text-blue-600 font-semibold rounded-full shadow hover:bg-blue-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        onClick={() =>
                                            setExpandAssistsLeaders(
                                                !expandAssistsLeaders
                                            )
                                        }
                                    >
                                        {expandAssistsLeaders
                                            ? "Show Less"
                                            : "Show More"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white shadow-md p-6 ">
                        <div className="flex flex-col justify-center">
                            <h2 className="text-xl font-bold mb-2">
                                Steals per Game
                            </h2>
                            <div className="text-gray-600">
                                <div
                                    className={`transition-all duration-500 overflow-hidden ${
                                        expandStealsLeaders
                                            ? "max-h-[1000px] opacity-100"
                                            : "max-h-[300px] opacity-90"
                                    }`}
                                >
                                    {statsLeaders.STL_PG &&
                                        (expandStealsLeaders
                                            ? statsLeaders.STL_PG.slice(0, 20)
                                            : statsLeaders.STL_PG.slice(0, 5)
                                        ).map((player, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center py-2 border-b last:border-b-0"
                                            >
                                                {/* Rank */}
                                                <div className="w-8 text-lg font-bold text-blue-600 text-center">
                                                    {index + 1}.
                                                </div>
                                                {/* Player Image */}
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
                                                            "https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png";
                                                    }}
                                                />
                                                {/* Name and Team */}
                                                <div className="flex flex-col ml-2">
                                                    <span className="font-semibold text-black leading-tight">
                                                        {player.PLAYER}
                                                    </span>
                                                    <span className="text-xs text-gray-500 leading-tight">
                                                        {player.TEAM}
                                                    </span>
                                                </div>
                                                {/* Stat Value */}
                                                <div className="ml-auto font-bold text-lg text-blue-700">
                                                    {player.STL_PG}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                                <div className="flex justify-center mt-2">
                                    <button
                                        className="ml-2 px-4 py-1 bg-blue-100 text-blue-600 font-semibold rounded-full shadow hover:bg-blue-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        onClick={() =>
                                            setExpandStealsLeaders(
                                                !expandStealsLeaders
                                            )
                                        }
                                    >
                                        {expandStealsLeaders
                                            ? "Show Less"
                                            : "Show More"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
