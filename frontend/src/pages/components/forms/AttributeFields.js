

export default function AttributeFields({chartProps}) {

    function handleSearch() {
        if (!chartProps.playerAttributes || isNaN(chartProps.yearAttributes)) {
            alert("Please enter valid player name and year");
            return;
        }

        chartProps.setIsLoading(true);
        fetch(`/api/player_attributes/${chartProps.yearAttributes}/${chartProps.playerAttributes}/${chartProps.attributeScope}`).then((res) => res.json())
        .then((data) => {
            if(!Array.isArray(data) || data.length === 0) {
                alert("Player could not be found");
                return;
            }
            chartProps.setAttributesData(data);
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
        <div className="panel is-info">
            <p className="panel-heading">Player Attributes</p>
                <div className="panel-block has-text-black">
                    <div>
                    <input
                        type="text"
                        placeholder="Enter Player"
                        onChange={(e) => chartProps.setAttributesPlayer(e.target.value)}
                    ></input>
                    <input
                        type="text"
                        placeholder="Enter Year"
                        onChange={(e) => chartProps.setAttributesYear(e.target.value)}
                    ></input>
                    < select
                    style={{ color:"black" }}
                    value={chartProps.attributeScope}
                    onChange={(e) => chartProps.setAttributeScope(e.target.value)}
                    >
                        <option value="overall">Overall</option>
                        <option value="position">Position</option>
                    </select>
                    </div>
                    <button onClick={handleSearch}>Search</button>
                </div>
        </div>
    )
}