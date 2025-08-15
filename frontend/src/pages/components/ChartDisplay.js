import MirrorBarChart from "./lib/MirrorBarChart";
import RadarChart from "./lib/RadarChart";
import ShotChart from "./lib/ShotChart";
import ImpactChart from "./lib/ImpactChart";




export default function ChartDisplay({activeView, chartProps}) {

    function handleButton(chart) {
        chartProps.setChartType(chart);
    }


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
                    <div className="panel-block">
                        < select
                        style={{ color:"black" }}
                        value={chartProps.chartType}
                        onChange={(e) => chartProps.setChartType(e.target.value)}
                        >
                            <option value="standard">Standard</option>
                            <option value="impact">Impact</option>
                        </select>
                    </div>

                    {chartProps.isLoading ? (
                        <p>Loading chart data...</p>
                    ) : (
                        chartProps.chartType === "standard" && chartProps.attributesData ? (
                            <RadarChart playerData={chartProps.attributesData ?? []}/>
                        ) : chartProps.chartType === "impact" && chartProps.attributesData ? (
                            <ImpactChart playerData = {chartProps.attributesData ?? []} />
                        ) : (
                            <p>No data available</p>
                        )
                    )}

                </div>
            </div>
        );
        case "shotchart":
        return (
            <div className="cell is-col-span-2 is half-height">
                <div className="panel is-danger">
                    <p className="panel-heading">{chartProps.playerShotChart} - Career Shot Chart</p>
                    {chartProps.isLoading ? (
                    <p>Loading chart data...</p>
                    ) : (
                    chartProps.shotChartData ? (
                        <ShotChart
                        playerData={chartProps.shotChartData ?? []}
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