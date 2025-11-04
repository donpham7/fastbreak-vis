// Simple fetcher for external team logos or images
export async function fetchTeamLogo(identifier) {
    const url = `https://cdn.ssref.net/req/202508011/tlogo/bbr/${identifier}.png`;
    console.log("Fetching team logo:", identifier);
    console.log("Fetching team logo from URL:", url);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch logo: ${response.statusText}`);
        }

        // Convert response into a blob URL so React <img> can use it
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error("Error fetching logo:", error);
        return null; // fallback for when fetch fails
    }
}

export function buildGameLogos(games) {
    var links = games.map((game) => ({
        home: buildTeamLogo(game.HOME_IMG),
        away: buildTeamLogo(game.VISITOR_IMG),
    }));
    console.log("Built game logos:", links);
    return links;
}

export function buildTeamLogo(teamAbbr) {
    return `https://cdn.ssref.net/req/202508011/tlogo/bbr/${teamAbbr}.png`;
}

export function buildTransparentTeamLogo(TEAM_CITY, TEAM_NAME) {
    if (!TEAM_CITY || !TEAM_NAME) return null;

    const format = (str) =>
        str.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    const city = format(TEAM_CITY);
    const name = format(TEAM_NAME);

    return `https://i.logocdn.com/nba/current/${city}-${name}.svg`;
}


export function getTeamColor(teamAbbr) {
  const teamColors = {
    ATL: "#E03A3E", // Atlanta Hawks
    BOS: "#007A33", // Boston Celtics
    BKN: "#000000", // Brooklyn Nets
    CHA: "#1D1160", // Charlotte Hornets
    CHI: "#CE1141", // Chicago Bulls
    CLE: "#6F263D", // Cleveland Cavaliers
    DAL: "#00538C", // Dallas Mavericks
    DEN: "#0E2240", // Denver Nuggets
    DET: "#C8102E", // Detroit Pistons
    GSW: "#1D428A", // Golden State Warriors
    HOU: "#CE1141", // Houston Rockets
    IND: "#002D62", // Indiana Pacers
    LAC: "#C8102E", // LA Clippers
    LAL: "#552583", // Los Angeles Lakers
    MEM: "#5D76A9", // Memphis Grizzlies
    MIA: "#98002E", // Miami Heat
    MIL: "#00471B", // Milwaukee Bucks
    MIN: "#0C2340", // Minnesota Timberwolves
    NOP: "#0C2340", // New Orleans Pelicans
    NYK: "#006BB6", // New York Knicks
    OKC: "#007AC1", // Oklahoma City Thunder
    ORL: "#0077C0", // Orlando Magic
    PHI: "#006BB6", // Philadelphia 76ers
    PHX: "#1D1160", // Phoenix Suns
    POR: "#E03A3E", // Portland Trail Blazers
    SAC: "#5A2D81", // Sacramento Kings
    SAS: "#C4CED4", // San Antonio Spurs
    TOR: "#CE1141", // Toronto Raptors
    UTA: "#002B5C", // Utah Jazz
    WAS: "#002B5C", // Washington Wizards
  };

  return teamColors[teamAbbr] || "#CCCCCC"; // fallback color
}
