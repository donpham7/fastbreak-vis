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
