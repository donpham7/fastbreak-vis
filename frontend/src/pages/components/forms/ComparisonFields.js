

export default function ComparisonFields({chartProps}) {

    function handleSearch() {
        if (!chartProps.playerAComparison || !chartProps.playerBComparison || isNaN(chartProps.yearAComparison) || isNaN(chartProps.yearBComparison)) {
            alert("Please enter valid player names and years");
            return;
        }

        chartProps.setIsLoading(true);
        Promise.all([
            fetch(`/api/player_comparison/${chartProps.yearAComparison}/${chartProps.playerAComparison}`).then((res) => res.json()),
            fetch(`/api/player_comparison/${chartProps.yearBComparison}/${chartProps.playerBComparison}`).then((res) => res.json())
        ])
        .then(([dataA, dataB]) => {
            if(!dataA || !dataB || Object.keys(dataA).length === 0 || Object.keys(dataB).length === 0) {
            alert("One or more players could not be found");
            return;
            }
            chartProps.setAComparisonData(dataA);
            chartProps.setBComparisonData(dataB);
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
        <div className="panel is-primary">
            <p className="panel-heading">Player Comparison</p>
                <div className="panel-block has-text-black">
                    <div>
                    <input
                        type="text"
                        placeholder="Enter PlayerA"
                        onChange={(e) => chartProps.setplayerAComparison(e.target.value)}
                    ></input>
                    <input
                        type="text"
                        placeholder="Enter YearA"
                        onChange={(e) => chartProps.setyearAComparison(e.target.value)}
                    ></input>
                    </div>
                    <div>
                    <input
                        type="text"
                        placeholder="Enter PlayerB"
                        onChange={(e) => chartProps.setplayerBComparison(e.target.value)}
                    ></input>
                    <input
                        type="text"
                        placeholder="Enter YearB"
                        onChange={(e) => chartProps.setyearBComparison(e.target.value)}
                    ></input>
                    </div>
                    <button onClick={handleSearch}>Search</button>
                </div>
        </div>
    )
}