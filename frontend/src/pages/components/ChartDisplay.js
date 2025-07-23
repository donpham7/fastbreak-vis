import MirrorBarChart from "./lib/MirrorBarChart";
import RadarChart from "./lib/RadarChart";



export default function ChartDisplay({activeView, chartProps}) {
    switch (activeView) {
        case "comparison":
        return (
            <div className="cell is-col-span-2 is half-height">
                <div className="panel is-primary">
                    <p className="panel-heading">{chartProps.playerAComparison} {chartProps.yearAComparison} - Season stats per 36 min - {chartProps.playerBComparison} {chartProps.yearBComparison}</p>
                    {chartProps.isLoading ? (
                    <p>Loading chart data...</p>
                    ) : (
                    chartProps.comparisonAData && chartProps.comparisonBData ? (
                        <MirrorBarChart
                        playerAData={chartProps.comparisonAData ?? []}
                        playerBData={chartProps.comparisonBData ?? []}
                        />
                    ) : (
                        <p>No data available</p>
                    )
                    )}
                </div>
            </div>
        );
        case "attributes":
        return (
            <div className="cell is-col-span-2 is half-height">
                <div className="panel is-info">
                    <p className="panel-heading">{chartProps.playerAttributes} {chartProps.yearAttributes} - Attribute Percentiles</p>
                    {chartProps.isLoading ? (
                    <p>Loading chart data...</p>
                    ) : (
                    chartProps.attributesData ? (
                        <RadarChart
                        playerData={chartProps.attributesData ?? []}
                        />
                    ) : (
                        <p>No data available</p>
                    )
                    )}
                </div>
            </div>
        );
        default:
        return null;
    }
}