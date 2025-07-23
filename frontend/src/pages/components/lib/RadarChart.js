import { useRef, useEffect } from "react";
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";


const statLabels = {
    season: "Season",
    // lg: "Leage",
    player: "Player",
    // player_id: "Player ID",
    // age: "Age",
    // team: "Team",
    // pos: "Position",
    // g: "Games",
    // gs: "Games Started",
    // mp: "Minutes Played",
    // fg_per_36_min: "Field Goals",
    // fga_per_36_min: "Field Goal Attempts",
    // fg_percent_per_36_min: "FG %",
    // x3p_per_36_min: "Three Pointers",
    // x3pa_per_36_min: "Three Pointer Attempts",
    // x3p_percent: "Three Point Percentage",
    // x2p_per_36_min: "Two Pointers",
    // x2pa_per_36_min: "Two Pointer Attempts",
    // x2p_percent: "Two Point Percentage",
    // e_fg_percent: "Efficient Field Goal Percentage",
    // ft_per_36_min: "Free Throws",
    // fta_per_36_min: "Free Throw Attempts",
    // ft_percent: "FT %",
    // orb_per_36_min: "OFF Rebounds",
    // drb_per_36_min: "DEF Rebounds",
    // trb_per_36_min: "TOT Rebounds",
    // ast_per_36_min: "Assists",
    // stl_per_36_min: "Steals",
    // blk_per_36_min: "Blocks",
    // tov_per_36_min: "Turnovers",
    // pf_per_36_min: "Personal Fouls",
    // pts_per_36_min: "Points",

    fta_per_36_min_percentile: "Free Throw Attempts",
    // ft_percent: "FT %",
    // orb_per_36_min: "OFF Rebounds",
    // drb_per_36_min: "DEF Rebounds",
    trb_per_36_min_percentile: "TOT Rebounds",
    ast_per_36_min_percentile: "Assists",
    stl_per_36_min_percentile: "Steals",
    blk_per_36_min_percentile: "Blocks",
    tov_per_36_min_percentile: "Turnovers",
    // pf_per_36_min: "Personal Fouls",
    pts_per_36_min_percentile: "Points",
};


export default function RadarChart({playerData}) {
    const ref = useRef();

    useEffect(() => {
        if (!Array.isArray(playerData) || playerData.length === 0) {
            console.log("error", playerData);
            return;
        }

        const players = playerData.map((e) => {
            const formatted = {};

            Object.entries(e).forEach(([key, value]) => {
                const isPercentile = key.includes("percentile");
                if (isPercentile || key === "season" || key === "player") {
                    const newKey = statLabels[key] || key; 
                    const newValue = isPercentile ? +(value/100) : value;

                    formatted[newKey] = newValue;
                }

            });

            return formatted;
        });

        const points = players.flatMap(statObj => {
            // const seasonName = statObj["Season"] ?? "Unknown";
            const playerName = statObj["Player"] ?? "Unknown";


            return Object.entries(statObj)
                .filter(([key]) => key !== "Season" && key !== "Player")
                .map(([key, value]) => ({
                name: playerName,
                key,
                value
                }));
        });


        const longitude = d3.scalePoint(new Set(Plot.valueof(points, "key")), [180, -180]).padding(0.5).align(1)

        const chart = Plot.plot({
            width: 500,
            height: 500,
            margin: 20,
            projection: {
                type: "azimuthal-equidistant",
                rotate: [0, -90],
                // Note: 0.625° corresponds to max. length (here, 0.5), plus enough room for the labels
                domain: d3.geoCircle().center([0, 90]).radius(1.2)()
            },
            color: { 
                legend: true,
                label: {
                    fill: "black",      
                    fontWeight: "bold" 
                }
            },
            x: {
                domain: [0, 1]
            },
            marks: [
                // grey discs
                Plot.geo([1.0, 0.8, 0.6, 0.4, 0.2], {
                    geometry: (r) => d3.geoCircle().center([0, 90]).radius(r)(),
                    stroke: "black",
                    fill: "black",
                    strokeOpacity: 0.6,
                    fillOpacity: 0.03,
                    strokeWidth: 0.5
                }),

                // white axes
                Plot.link(longitude.domain(), {
                    x1: longitude,
                    y1: 90 - 1.05,
                    x2: 0,
                    y2: 90,
                    stroke: "white",
                    strokeOpacity: 0.5,
                    strokeWidth: 2.5
                }),

                // tick labels
                Plot.text([0.2, 0.4, 0.6, 0.8, 1.0], {
                    x: 180,
                    y: (d) => 90 - d + 0.02,
                    dx: 2,
                    textAnchor: "start",
                    text: (d) => `${100 * d}`,
                    fill: "black",
                    stroke: "white",
                    fontSize: 12
                }),

                // axes labels
                Plot.text(longitude.domain(), {
                    x: longitude,
                    y: 90 - 1.15,
                    text: Plot.identity,
                    fill: "black",
                    fontSize: 14,
                    lineWidth: 5
                }),

                // areas
                Plot.area(points, {
                    x1: ({ key }) => longitude(key),
                    y1: ({ value }) => 90 - value,
                    x2: 0,
                    y2: 90,
                    fill: "orange",
                    fillOpacity: 0.3,   
                    stroke: "orange",
                    strokeOpacity: 1,

                    curve: "cardinal-closed"
                }),

                // points
                Plot.dot(points, {
                    x: ({ key }) => longitude(key),
                    y: ({ value }) => 90 - value,
                    fill: "name",
                    stroke: "white"
                }),

                // interactive labels
                Plot.text(
                    points,
                    Plot.pointer({
                        x: ({ key }) => longitude(key),
                        y: ({ value }) => 90 - value,
                        text: (d) => `${(100 * d.value).toFixed(0)}%`,
                        textAnchor: "start",
                        dx: 4,
                        fill: "black",
                        fontSize: 12,
                        maxRadius: 10
                    })
                )
            ]
        });

        ref.current.innerHTML = "";
        ref.current.append(chart);

        // Inject custom style
        const style = document.createElement("style");
        style.textContent = `
            g[aria-label="area"] path {
            fill-opacity: 0.1;
            transition: fill-opacity .2s;
            }
            g[aria-label="area"]:hover path:not(:hover) {
            fill-opacity: 0.05;
            transition: fill-opacity .2s;
            }
            g[aria-label="area"] path:hover {
            fill-opacity: 0.3;
            transition: fill-opacity .2s;
            }
        `;
        chart.appendChild(style); // Inject into the SVG
    }, [playerData]);
    
    return <div ref={ref} />;
}