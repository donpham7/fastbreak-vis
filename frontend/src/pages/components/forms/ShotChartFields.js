

export default function ShotChartFields({chartProps}) {

    function handleSearch() {
        if (!chartProps.playerShotChart) {
            alert("Please enter valid player name");
            return;
        }

        chartProps.setIsLoading(true);
        fetch(`/api/player_shotchart/${chartProps.playerShotChart}`).then((res) => res.json())
        .then((data) => {
            if(!Array.isArray(data) || data.length === 0) {
                alert("Player could not be found");
                return;
            }
            chartProps.setShotChartData(data);
            })
        .catch((err => {
            console.log("error", err);
            alert(`Failed to fetch data: ${err.message}`);
        }))
        .finally(() => {
            chartProps.setIsLoading(false);
        })
    }

    return (
        <div className="panel is-danger">
            <p className="panel-heading">Player Shot Chart</p>
                <div className="panel-block has-text-black">
                    <div>
                    <input
                        type="text"
                        placeholder="Enter Player"
                        onChange={(e) => chartProps.setShotChartPlayer(e.target.value)}
                    ></input>
                    </div>
                    <button onClick={handleSearch}>Search</button>
                </div>
        </div>
    )
}