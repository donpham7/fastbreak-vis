import { useRef, useEffect } from "react";
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";


const statLabels = {
    player: "Player",
    fg_percent: "FG %",
    x3p_percent: "Three Point Percentage",
    ft_percent: "FT %",
    trb: "TOT Rebounds",
    ast: "Assists",
    stl: "Steals",
    blk: "Blocks",
    pts: "Points"
};

export default function RadarChart({data, playerName}) {
    const ref = useRef();

    useEffect(() => {
        if (!data || data.length === 0) return;

        const players = data.map(element => {
            return Object.entries(element)
            .map(([key, value]) => {
                const isPercentage = key.includes("percent");
                return {
                    key: statLabels[key] ?? key,
                    value: 
                        key === "player"
                            ? value
                            : isPercentage 
                            ? +value 
                            : +(value / (value * 2))
                }
            });  
        });


        const points = players.flatMap(statList => {
            const playerEntry = statList.find(stat => stat.key === statLabels["player"]);
            const playerName = playerEntry?.value ?? "Unknown";

            return statList
                .filter(stat => stat.key !== statLabels["player"])
                .map(({ key, value }) => ({
                name: playerName,
                key,
                value
                }));
        });

        console.log("points", points); 

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
            color: { legend: true },
            x: {
                domain: [0, 1]
            },
            marks: [
                // grey discs
                Plot.geo([1.0, 0.8, 0.6, 0.4, 0.2], {
                    geometry: (r) => d3.geoCircle().center([0, 90]).radius(r)(),
                    stroke: "black",
                    fill: "black",
                    strokeOpacity: 0.3,
                    fillOpacity: 0.03,
                    strokeWidth: 0.5
                }),

                // black axes
                Plot.link(longitude.domain(), {
                    x1: longitude,
                    y1: 90 - 1.05,
                    x2: 0,
                    y2: 90,
                    stroke: "black",
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
                    fill: "currentColor",
                    stroke: "white",
                    fontSize: 8
                }),

                // axes labels
                Plot.text(longitude.domain(), {
                    x: longitude,
                    y: 90 - 1.15,
                    text: Plot.identity,
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
                        fill: "currentColor",
                        stroke: "white",
                        maxRadius: 10
                    })
                )
            ]
        });

        ref.current.innerHTML = "";
        ref.current.append(chart);

    }, [data, playerName]);
    
    return <div ref={ref} />;
}