import {useEffect} from "react";



export default function ShotChartFields({ chartProps }) {
    function handleSearch() {
        if (!chartProps.playerShotChart) {
            alert("Please enter valid player name");
            return;
        }

        chartProps.setIsLoading(true);
        fetch(`/api/players/shotchart/${chartProps.playerShotChart}`)
            .then((res) => res.json())
            .then((data) => {
            if (!Array.isArray(data) || data.length === 0) {
                alert("Player could not be found");
                return;
            }
            chartProps.setShotChartData(data);
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
        if (chartProps.playerShotChart) {
            handleSearch();
        }
    }, []);

    return (
        <div className="w-full md:w-[50%] rounded-2xl border border-red-800 bg-gradient-to-br from-[#ffee80] to-[#FF4040] shadow-lg p-4 sm:p-6 md:p-8 mx-auto mb-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-extrabold text-red-700 tracking-wide font-roboto">
                Player Shot Chart
                </h2>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (e.target.checkValidity()) {
                    handleSearch();
                    } else {
                    e.target.reportValidity();
                    }
                }}
                className="flex flex-col md:flex-row items-center gap-6"
                >
                <input
                    type="text"
                    placeholder="Enter First Last name"
                    onChange={(e) => chartProps.setShotChartPlayer(e.target.value)}
                    className="w-full sm:flex-1 px-4 py-3 border border-gray-300 font-roboto rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF4040] text-base sm:text-lg"
                    required
                    pattern="^[A-Z][a-z]+ [A-Z][a-z]+(?:-[A-Z][a-z]+)?(?: (Jr\.|II|III))?$"
                    title="Format: Firstname Lastname (case-sensitive, no accents). Hyphenated last names and suffixes Jr., II, III allowed."
                />

                <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2 bg-[#ffee80] text-[#FF4040] font-bold font-roboto rounded-xl shadow-md hover:scale-105 transform transition duration-200 border border-gray-200 text-base sm:text-lg"
                >
                    Search
                </button>
            </form>
        </div>
    );
}
