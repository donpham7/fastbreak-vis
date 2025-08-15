import { useRef, useEffect } from "react";
import * as Plot from "@observablehq/plot";
import markings from "./markings";


export default function ShotChart({ playerData }) {
  const ref = useRef();

  useEffect(() => {
    console.log("playerData", playerData);
    if (!playerData || playerData.length === 0) return;

    const transformedData = playerData.map(d => ({
      x: d.loc_x,
      y: d.loc_y,
      result: d.shot_made === true
    }));
    console.log("transformedData", transformedData);

    const season = false;

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
        legend: true
      },
      marks: [
        Plot.rect(transformedData, Plot.bin(
          { fill: "count" },
          {
            x: "x",
            y: "y",
            filter: d => d.result, 
            interval: 5, // Change interval depending on amount of shots
            inset: 0
          }
        )),
        Plot.gridX({ interval: 5, strokeOpacity: 0.15 }),
        Plot.gridY({ interval: 5, strokeOpacity: 0.15 }),
        markings() 
      ]
    });
    ref.current.innerHTML = "";
    ref.current.append(chart);
  }, [playerData]);

  return <div ref={ref} />;
}
