export async function getGamesFromDate(year, month, day) {
    const url = `/api/get_current_games/${year}/${month}/${day}`;
    console.log(url);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch logo: ${response.statusText}`);
        }

        // Convert response into a blob URL so React <img> can use it
        return response.json();
    } catch (error) {
        console.log("Error fetching logo:", error);
        return null; // fallback for when fetch fails
    }
}
