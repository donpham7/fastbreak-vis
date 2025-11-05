import {useEffect} from "react";

export default function AttributeFields({ chartProps }) {
    function handleSearch() {
        if (
            !chartProps.playerAttributes ||
            isNaN(chartProps.yearAttributes)
        ) {
            alert("Please enter valid player name and year");
            return;
        }

        chartProps.setIsLoading(true);
        fetch(`/api/player_attributes/${chartProps.yearAttributes}/${chartProps.playerAttributes}/${chartProps.attributeScope}`)
            .then((res) => res.json())
            .then((data) => {
                if (!Array.isArray(data) || data.length === 0) {
                    alert("Player could not be found");
                    return;
                }
                chartProps.setAttributesData(data);
            })
            .catch((err) => {
                console.log("error", err);
                alert(`Failed to fetch data: ${err.message}`);
            })
                .finally(() => {
                chartProps.setIsLoading(false);
            });
    }
    useEffect(() => {
        if (chartProps.playerAttributes && chartProps.yearAttributes) {
            handleSearch();
        }
    }, [chartProps.playerAttributes, chartProps.yearAttributes]);

    return (
        <div className="rounded-2xl border border-cyan-800 bg-gradient-to-br from-cyan-50 to-cyan-100 shadow-lg p-8 mb-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-extrabold text-cyan-800 tracking-wide">
                Player Attributes
                </h2>
                <button
                    onClick={handleSearch}
                    className="px-6 py-2 bg-gradient-to-r from-blue-700 to-cyan-600 text-white font-bold rounded-xl shadow-md hover:scale-105 transform transition duration-200 border border-gray-200"
                >
                Search
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <input
                    type="text"
                    placeholder="Enter Player Name"
                    onChange={(e) => chartProps.setAttributesPlayer(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                />
                <input
                    type="text"
                    placeholder="Enter Year (e.g. 2023)"
                    onChange={(e) => chartProps.setAttributesYear(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                />
                <select
                    value={chartProps.attributeScope}
                    onChange={(e) => chartProps.setAttributeScope(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                >
                <option value="overall">Overall</option>
                <option value="position">Position</option>
                </select>
            </div>
        </div>
    );
}
