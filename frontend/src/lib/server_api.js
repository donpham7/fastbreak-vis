export async function getGamesFromDate(year, month, day) {
    const url = `/api/get_current_games/${year}/${month}/${day}`;
    console.log(url);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch games: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.log("Error fetching logo:", error);
        return null; // fallback for when fetch fails
    }
}

export async function getStandings(year) {
    const url = `/api/get_standings/${year}`;
    console.log(url);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(
                `Failed to fetch standings: ${response.statusText}`
            );
        }

        // Convert response into a blob URL so React <img> can use it
        return response.json();
    } catch (error) {
        console.log("Error fetching logo:", error);
        return null; // fallback for when fetch fails
    }
}

export async function getPlayersByStats(stats, perGameFlags, season = null) {
    var url = `/api/players_by_stats`;
    try {
        const body = JSON.stringify({
            stats: stats,
            perGameFlags: perGameFlags,
            season: season,
        });
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: body,
        });

        if (!response.ok) {
            throw new Error(
                `Failed to fetch players by stats: ${response.statusText}`
            );
        }

        // Convert response into a blob URL so React <img> can use it
        return response.json();
    } catch (error) {
        console.log("Error fetching players by stats:", error);
        return null; // fallback for when fetch fails
    }
}
