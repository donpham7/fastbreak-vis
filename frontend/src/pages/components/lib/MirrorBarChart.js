import { useRef, useEffect } from "react";
import * as Plot from "@observablehq/plot";

const statLabels = {
    // season: "Season",
    // lg: "Leage",
    // player: "Player",
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
    fta_per_36_min: "Free Throw Attempts",
    // ft_percent: "FT %",
    // orb_per_36_min: "OFF Rebounds",
    // drb_per_36_min: "DEF Rebounds",
    trb_per_36_min: "TOT Rebounds",
    ast_per_36_min: "Assists",
    stl_per_36_min: "Steals",
    blk_per_36_min: "Blocks",
    tov_per_36_min: "Turnovers",
    // pf_per_36_min: "Personal Fouls",
    pts_per_36_min: "Points",
};



export default function MirrorBarChart({playerAData, playerBData}) {
    const ref = useRef();

    useEffect(() => {
        if (!playerAData || playerAData.length === 0) return;
        if (!playerBData || playerBData.length === 0) return;


        const playerA = Object.entries(playerAData)
        .filter(([key]) => statLabels.hasOwnProperty(key))
        .map(([key, value]) => {
            return {
                label: statLabels[key],
                data: +value,
            }
        });

        const playerB = Object.entries(playerBData)
        .filter(([key]) => statLabels.hasOwnProperty(key))
        .map(([key, value]) => {
            return {
                label: statLabels[key],
                data: +value,
            }
        });

        const sortedLabels = [...playerA]
        .sort((a,b) => b.data - a.data)
        .map(d => d.label)

        const maxA = Math.max(...playerA.map(d => d.data));
        const maxB = Math.max(...playerB.map(d => d.data));
        const domainMax = Math.ceil(Math.max(maxA, maxB)) * 2;

        const chart = Plot.plot({
            height: 640, 
            width: 640,
            label: null,
            x: {
                axis: "top",
                domain: [-domainMax, domainMax],
                tickFormat: () => "",
                tickSize: 0
            },
            y: { 
                axis: null,
                domain: sortedLabels
            },
            color: {
                scheme: "PiYG",
                type: "ordinal"
            },
            marks: [
                Plot.barX(playerA, {x: (d) => -d.data, y: d => d.label, fill: "steelblue"}),
                Plot.barX(playerB, {x: (d) => d.data, y: d => d.label, fill: "crimson"}),
                
                Plot.text(playerA, {
                    x: -42,
                    y: "label",
                    text: (d) => d.label,
                    textAnchor: "start",
                    fill: "black",
                    fontSize: 16

                }),

                Plot.text(playerA, {
                    x: d => -d.data,
                    y: "label",
                    text: d => d.data,
                    textAnchor: "start",
                    dx: -30,
                    fill: "black",
                    fontSize: 14

                }),

                Plot.text(playerB, {
                    x: d => d.data,
                    y: "label",
                    text: d => d.data,
                    textAnchor: "start",
                    dx: 5,
                    fill: "black",
                    fontSize: 14

                }),

                Plot.gridX({ stroke: "white", strokeOpacity: 0.5 }),
                Plot.ruleX([0])
            ]
        });

        ref.current.innerHTML = "";
        ref.current.append(chart);

    }, [playerAData, playerBData]);

    return <div ref={ref} />;

}
