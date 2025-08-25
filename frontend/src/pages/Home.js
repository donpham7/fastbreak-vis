import React, { useEffect, useState } from "react";
import { fetchTeamLogo, buildGameLogos } from "../lib/bbr/GetImages.js";
import { getGamesFromDate } from "../lib/serverFunctions/server_api.js";
import { DatePicker } from "./components/lib/Calender.js";
import * as Separator from "@radix-ui/react-separator";
import { set } from "date-fns";

export default function Home() {
    const [games, setGames] = useState([]);
    const [logos, setLogos] = useState([]);
    const [date, setDate] = useState(null);
    const [showTodaysGames, setShowTodaysGames] = useState(true);

    const toggleTodaysGames = async () => {
        setShowTodaysGames(!showTodaysGames);
    };

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

    useEffect(() => {
        handleDateChange(new Date(2025, 3, 11)); // Months are 0-indexed in JS Date
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
                <div className="w-full overflow-x-auto sticky top-0">
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
        </div>
    );
}
