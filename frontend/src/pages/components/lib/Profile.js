import { useState, useEffect } from "react";
import { buildTransparentTeamLogo, getTeamColor } from "../../../lib/bbr/GetImages.js";


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
        <div className="w-screen">
            {/* Profile Section */}
            <div 
                className="relative w-screen h-[43vh] shadow-md"
                style={{ backgroundColor: team_color }}
            >
                {/* Player Info Text */}
                <div className="absolute top-1/2 left-[55%] transform -translate-x-1/2 -translate-y-1/2 w-[min(90%,600px)] flex flex-col items-center gap-4 z-10">
                    <div className="w-full text-left">
                        <p className="text-[16px] text-white" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
                        {player.TEAM_CITY} {player.TEAM_NAME} | #{player.JERSEY} | {player.POSITION}
                        </p>
                    </div>
                    <div className="w-full text-left">
                        <h2 className="text-[35px] font-bold uppercase leading-tight text-white" style={{ fontFamily: 'Knockout, Arial, sans-serif' }}>
                        {player.FIRST_NAME}<br />
                        {player.LAST_NAME}
                        </h2>
                    </div>
                </div>

                {/* Player Image */}
                <img
                    src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${id}.png`}
                    alt={player.DISPLAY_FIRST_LAST}
                    className="absolute bottom-0 left-[25%] transform -translate-x-1/2 w-[20vw] h-[28vh] object-contain z-10"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png";
                    }}
                />

                {/* Team Logo */}
                <img 
                    src={logo}
                    alt={player.DISPLAY_FIRST_LAST}
                    className="absolute top-1/4 left-[15%] transform -translate-x-1/2 -translate-y-1/2 w-[10vw] h-[10vh] object-contain z-10"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png";
                    }}
                />

                {/* Background Logo */}
                <img 
                    src={logo}
                    alt={player.DISPLAY_FIRST_LAST}
                    className="absolute top-1/4 left-[25%] transform -translate-x-1/2 -translate-y-1/2 w-[75vw] h-[75vh] object-contain opacity-10 z-0"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png";
                    }}
                />
            </div>

            {/* Bio Divider */}
            <div
                className="w-screen h-[13vh] flex justify-center items-center border-t border-b border-white"
                style={{
                    backgroundColor: team_color,
                    filter: "brightness(85%)",
                }}
            >
                <div className="grid grid-cols-4 grid-rows-2 w-[45%] h-full">
                    {/* Row 1 */}
                    <div className="border border-white flex flex-col items-center justify-center text-white font-medium">
                        <span className="text-[12px] uppercase" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>Height</span>
                        <span className="text-[16px]" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>{formattedHeight}</span>
                    </div>
                    <div className="border border-white flex flex-col items-center justify-center text-white font-medium">
                        <span className="text-[12px] uppercase" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>Weight</span>
                        <span className="text-[16px]" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>{formattedWeight}</span>
                    </div>
                    <div className="border border-white flex flex-col items-center justify-center text-white font-medium">
                        <span className="text-[12px] uppercase" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>Country</span>
                        <span className="text-[16px]" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>{player.COUNTRY}</span>
                    </div>
                    <div className="border border-white flex flex-col items-center justify-center text-white font-medium">
                        <span className="text-[12px] uppercase" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>Last Attended</span>
                        <span className="text-[16px]" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>{player.SCHOOL || "N/A"}</span>
                    </div>

                    {/* Row 2 */}
                    <div className="border border-white flex flex-col items-center justify-center text-white font-medium">
                        <span className="text-[12px] uppercase" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>Age</span>
                        <span className="text-[16px]" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>{calculatedAge}</span>
                    </div>
                    <div className="border border-white flex flex-col items-center justify-center text-white font-medium">
                        <span className="text-[12px] uppercase" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>Birthdate</span>
                        <span className="text-[16px]" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>{formattedBirthdate}</span>
                    </div>
                    <div className="border border-white flex flex-col items-center justify-center text-white font-medium">
                        <span className="text-[12px] uppercase" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>Draft</span>
                        <span className="text-[16px]" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>{formattedDraft}</span>
                    </div>
                    <div className="border border-white flex flex-col items-center justify-center text-white font-medium">
                        <span className="text-[12px] uppercase" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>Experience</span>
                        <span className="text-[16px]" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>{formattedExperience}</span>
                    </div>
                </div>
            </div>
        </div>
  );
}
