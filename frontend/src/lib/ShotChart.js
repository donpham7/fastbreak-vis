import { useRef, useEffect } from "react";
import * as Plot from "@observablehq/plot";
import markings from "./markings";
import { legend } from "@observablehq/plot";





export default function ShotChart({ data }) {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const season = true;

    const chart = Plot.plot({
      height: 640,
      width: 640,
      axis: null,
      x: { domain: [-250, 250] },
      y: { domain: [-50, 450] },
      color: {
        type: "log",
        scheme: "ylgnbu",
        label: "Made shots",
        domain: (season === true ? [1, 50] : [1, 1000]),
        legend: false
      },
      marks: [
        Plot.rect(data, Plot.bin(
          { fill: "count" },
          {
            x: "x",
            y: "y",
            filter: d => d.result, 
            interval: 5, // Change interval depending on amount of shots
            inset: 0
          }
        )),
        Plot.gridX({ interval: 5, strokeOpacity: 0.05 }),
        Plot.gridY({ interval: 5, strokeOpacity: 0.05 }),
        markings() // Draw court
      ]
    });

    const legendElement = legend({
      color: {
        type: "log",
        scheme: "ylgnbu",
        label: "Made shots"
      }
    });

    const legendContainer = document.getElementById("legend-container");
    if (legendContainer) legendContainer.innerHTML = "";
    legendContainer.appendChild(legendElement);

    ref.current.innerHTML = "";
    ref.current.append(chart);
  }, [data]);

  return <div ref={ref} />;
}
