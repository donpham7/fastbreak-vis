import { useRef, useEffect } from "react";
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

export default function BarChartTemplate({ data }) {
    Plot.plot({
        marginBottom: 60,
        x: {
            tickRotate: -30,
            label: data.x_label,
        },
        y: {
            transform: (d) => d / 1000,
            label: data.y_label,
            grid: 5,
        },
        marks: [
            Plot.ruleY([0]),

            Plot.barY(data.points, {
                sort: { x: "y", reverse: true, limit: 20 },
                fill: "steelblue",
            }),
        ],
    });
}
