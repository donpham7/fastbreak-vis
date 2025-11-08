import { useState, useEffect } from "react";
import { buildTransparentTeamLogo, getTeamColor } from "@lib/GetImages";



export default function Profile({ id }) {
    const [player, setPlayer] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    fetch(`/api/player_info/${id}`)
        .then((res) => res.json())
        .then((data) => {
            if (!data || Object.keys(data).length === 0) {
                alert("Player could not be found");
                return;
            }
            setPlayer(data);
        })
        .catch((err) => {
            console.error("error", err);
            alert(`Failed to fetch data: ${err.message}`);
        })
        .finally(() => {
            setIsLoading(false);    
        });
    }, [id]);

    const logo = player?.TEAM_CITY && player?.TEAM_NAME
        ? buildTransparentTeamLogo(player.TEAM_CITY, player.TEAM_NAME)
        : null;

    const team_color = player?.TEAM_ABBREVIATION
        ? getTeamColor(player.TEAM_ABBREVIATION)
        : "#ffffff";
    

    function convertHeightToMeters(heightStr) {
        if (!heightStr) return null;

        const normalized = heightStr.replace("-", "'");
        const match = normalized.match(/(\d+)'(\d+)/);
        if (!match) return null;

        const feet = parseInt(match[1], 10);
        const inches = parseInt(match[2], 10);
        const totalInches = feet * 12 + inches;
        const meters = totalInches * 0.0254;
        return meters.toFixed(2);
    }


    function convertWeightToKg(weightStr) {
        const pounds = parseFloat(weightStr);
        if (isNaN(pounds)) return null;
        const kg = pounds * 0.453592;
        return Math.round(kg);
    }

    const formattedHeight = player?.HEIGHT
        ? `${player.HEIGHT.replace("-", "'")}" (${convertHeightToMeters(player.HEIGHT)}m)`
        : "N/A";

    const formattedWeight = player?.WEIGHT
        ? `${player.WEIGHT}lb (${convertWeightToKg(player.WEIGHT)}kg)`
        : "N/A";

    const birthdate = player?.BIRTHDATE 
        ? new Date(player.BIRTHDATE) : null;

    const calculatedAge = birthdate
        ? `${Math.floor((new Date() - birthdate) / (1000 * 60 * 60 * 24 * 365.25))} years`
        : "N/A";

    const formattedBirthdate = birthdate
        ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(birthdate)
        : "N/A";

    const formattedDraft = player?.DRAFT_YEAR && player?.DRAFT_ROUND && player?.DRAFT_NUMBER
        ? `${player.DRAFT_YEAR} R${player.DRAFT_ROUND} Pick ${player.DRAFT_NUMBER}`
        : "N/A";

    const formattedExperience = player?.SEASON_EXP
        ? `${player.SEASON_EXP} Years`
        : "N/A";

    return (
        <div className="w-screen overflow-hidden">

            {/* Profile Section */}
            <div
            className="relative w-full h-[20vh] sm:h-[25vh] md:h-[38vh] flex"
            style={{ backgroundColor: team_color }}
            >
                {/* Background Logo */}
                <img
                    src={logo}
                    alt={player.DISPLAY_FIRST_LAST}
                    className="absolute top-[85%] left-[25%] -translate-x-1/2 -translate-y-1/2 w-[60%] sm:w-[50%] md:w-[40%] h-auto w-full object-contain opacity-5 z-0"
                    onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png";
                    }}
                />
                {/* Player and Team Images and Player info */}
                <div className="absolute bottom-0 left-4 sm:left-8 md:left-56 flex flex-row items-end space-x-3 sm:space-x-6 md:space-x-12 z-10">
                    {/* Team Logo */}
                    <img
                    src={logo}
                    alt={player.TEAM_NAME}
                    className="h-[5vh] sm:h-[6vh] md:h-[8vh] lg:h-[10vh]
                        w-auto object-contain self-start translate-x-6 sm:translate-x-10 md:translate-x-16
                        -translate-y-6 sm:-translate-y-10 md:-translate-y-16"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png";
                    }}
                    />

                    {/* Player Image */}
                    <img
                    src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${id}.png`}
                    alt={player.DISPLAY_FIRST_LAST}
                    className="
                        h-[18vh] sm:h-[22vh] md:h-[24vh] lg:h-[27vh]
                        w-auto object-contain
                    "
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png';
                    }}
                    />

                    {/* Player Info */}
                    <div className="max-w-[90%] sm:max-w-[70%] md:max-w-[600px] text-white text-left -translate-y-4 sm:-translate-y-10 md:-translate-y-20">
                        <p className="text-sm md:text-base font-roboto">
                        {player.TEAM_CITY} {player.TEAM_NAME} | #{player.JERSEY} | {player.POSITION}
                        </p>
                        <h2 className="text-4xl md:text-6xl font-knockout uppercase leading-tight mt-2">
                        {player.FIRST_NAME}<br />
                        {player.LAST_NAME}
                        </h2>
                    </div>
                </div>

            </div>

            {/* Bio Divider */}
            <div
            className="w-screen h-[12vh] flex justify-center items-center border-t border-b border-white"
            style={{
                backgroundColor: team_color,
                filter: "brightness(85%)",
            }}
            >
            <div className="text-white font-medium grid grid-cols-4 grid-rows-2 w-[90%] sm:w-[75%] md:w-[45%] h-full">
                {[
                { label: "Height", value: formattedHeight },
                { label: "Weight", value: formattedWeight },
                { label: "Country", value: player.COUNTRY },
                { label: "Last Attended", value: player.SCHOOL || "N/A" },
                { label: "Age", value: calculatedAge },
                { label: "Birthdate", value: formattedBirthdate },
                { label: "Draft", value: formattedDraft },
                { label: "Experience", value: formattedExperience },
                ].map(({ label, value }) => (
                <div
                    key={label}
                    className="border border-white p-2 flex flex-col items-center justify-center"
                >
                    <span className="text-xs uppercase font-roboto">{label}</span>
                    <span className="text-sm md:text-base font-roboto">{value}</span>
                </div>
                ))}
            </div>
            </div>
        </div>
    );

}
