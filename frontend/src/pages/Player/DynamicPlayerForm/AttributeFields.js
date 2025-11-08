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
    }, []);

    return (
        <div className="w-full md:w-[50%] rounded-2xl font-roboto border-red-800 bg-gradient-to-br from-cyan-700 to-[#00FF7F] shadow-lg p-4 sm:p-6 md:p-8 mx-auto mb-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">
                Player Attributes
                </h2>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[2fr_2fr_1fr_0.5fr] gap-6">

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
                <button
                    onClick={handleSearch}
                    className="w-full sm:w-auto px-6 py-2 bg-cyan-700 text-white font-bold rounded-xl shadow-md hover:scale-105 transform transition duration-200 border border-gray-200"
                >
                Search
                </button>
            </div>
        </div>
    );
}
