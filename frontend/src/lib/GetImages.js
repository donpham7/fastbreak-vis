// Simple fetcher for external team logos or images
export async function fetchTeamLogo(teamCode = "NOP") {
    const url = `https://cdn.ssref.net/req/202508011/tlogo/bbr/${teamCode}.png`;
    console.log("Fetching team logo:", teamCode);
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
