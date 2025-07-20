// markings.js
import { svg as htl } from "htl";


export default function markings({
  stroke = "currentColor",
  strokeWidth = 1,
  strokeOpacity = 1
} = {}) {
  const angle = Math.atan(90 / 220);

  const lines = [
    [-250, 420, 250, 420],
    [-250, 450, -250, -50],
    [250, 450, 250, -50],
    [250, -50, -250, -50],
    [-220, -50, -220, 90],
    [220, -50, 220, 90],
    [-80, -50, -80, 140],
    [80, -50, 80, 140],
    [-60, -50, -60, 140],
    [60, -50, 60, 140],
    [-80, 140, 80, 140],
    [-30, -10, 30, -10],
    [0, -10, 0, -7.5],
    [-40, -10, -40, 0],
    [40, -10, 40, 0]
  ];

  const circles = [
    [0, 0, 7.5],
    [0, 140, 60],
    [0, 420, 20],
    [0, 420, 60]
  ];

  const arcs = [
    [0, 0, 40, -Math.PI * 0.5, Math.PI * 0.5],
    [0, 0, 237.5, -Math.PI * 0.5 - angle, Math.PI * 0.5 + angle]
  ];

  // This function will be called by Plot with `x()` and `y()` scaling
  return (index, { x, y }) =>
    htl`<g fill="none" stroke=${stroke} stroke-width=${strokeWidth} stroke-opacity=${strokeOpacity}>
      ${lines.map(([x1, y1, x2, y2]) =>
        htl`<line x1=${x(x1)} x2=${x(x2)} y1=${y(y1)} y2=${y(y2)} />`
      )}
      ${circles.map(([cx, cy, r]) =>
        htl`<ellipse cx=${x(cx)} cy=${y(cy)} rx=${Math.abs(x(cx + r) - x(cx))} ry=${Math.abs(y(cy + r) - y(cy))} />`
      )}
      ${arcs.map(([cx, cy, r, a1, a2]) => {
        const x0 = x(cx + r * Math.cos(a1 - Math.PI / 2));
        const y0 = y(cy + r * Math.sin(a1 - Math.PI / 2));
        const x1 = x(cx + r * Math.cos(a2 - Math.PI / 2));
        const y1 = y(cy + r * Math.sin(a2 - Math.PI / 2));
        const rx = Math.abs(x(cx + r) - x(cx));
        const ry = Math.abs(y(cy + r) - y(cy));
        const sweepFlag = (x(cx + r) - x(cx)) * (y(cy + r) - y(cy)) > 0 ? 0 : 1;
        return htl`<path d="M${x0},${y0} A${rx} ${ry} 0 0 ${sweepFlag} ${x1},${y1}" />`;
      })}
    </g>`;
}
