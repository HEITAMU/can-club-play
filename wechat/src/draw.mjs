export const C = {
  bg: "#294a54",
  panel: "#42656c",
  panel2: "#536f76",
  ink: "#f5e7c7",
  muted: "#bfd0c3",
  gold: "#e0b574",
  rim: "#8fa69b",
  green: "#a8c9a0",
  paper: "#dfcea6",
  dark: "#29494c",
  red: "#e99c81",
};
export const fmt = (n) =>
  n >= 1e8
    ? (n / 1e8).toFixed(1) + "亿"
    : n >= 1e4
      ? (n / 1e4).toFixed(1) + "万"
      : Math.floor(n).toLocaleString("zh-CN");
export function round(c, x, y, w, h, r = 10) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}
export function box(c, x, y, w, h, fill = C.panel, stroke = C.rim, r = 10) {
  round(c, x, y, w, h, r);
  if (fill) {
    c.fillStyle = fill;
    c.fill();
  }
  if (stroke) {
    c.strokeStyle = stroke;
    c.lineWidth = 1;
    c.stroke();
  }
}
export function text(
  c,
  value,
  x,
  y,
  size = 13,
  color = C.ink,
  weight = 500,
  align = "left",
) {
  c.font =
    (weight >= 650 ? "bold" : "normal") +
    " " +
    size +
    'px "PingFang SC","Noto Sans CJK SC",sans-serif';
  c.fillStyle = color;
  c.textAlign = align;
  c.textBaseline = "middle";
  c.fillText(String(value), x, y);
}
export function ellipse(c, x, y, rx, ry, color) {
  c.beginPath();
  c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  c.fillStyle = color;
  c.fill();
}
const colors = {
  damage: "#ffd49e",
  shield: "#b9e5ee",
  heal: "#c8eaa4",
  control: "#e3ccff",
  energy: "#ffe19a",
  armor: "#f3c5b0",
};
export function rich(
  c,
  html,
  x,
  y,
  width,
  { size = 12, line = 21, color = C.ink, draw = true } = {},
) {
  let px = x,
    py = y,
    style = { color, bold: 500 },
    stack = [];
  for (const token of String(html)
    .split(/(<[^>]+>)/)
    .filter(Boolean)) {
    if (token.startsWith("<")) {
      if (token.startsWith("</")) style = stack.pop() || { color, bold: 500 };
      else if (token.startsWith("<br")) {
        px = x;
        py += line;
      } else {
        stack.push(style);
        const kind = token.match(/skill-([a-z]+)/)?.[1];
        style = {
          color: colors[kind] || (kind === "scaling" ? C.muted : style.color),
          bold: token.startsWith("<strong") ? 800 : 500,
        };
      }
      continue;
    }
    for (const ch of token) {
      if (ch === "\n") {
        px = x;
        py += line;
        continue;
      }
      c.font =
        (style.bold >= 650 ? "bold" : "normal") +
        " " +
        size +
        'px "PingFang SC","Noto Sans CJK SC",sans-serif';
      const w = c.measureText(ch).width;
      if (px + w > x + width && px > x) {
        px = x;
        py += line;
      }
      if (draw) text(c, ch, px, py, size, style.color, style.bold);
      px += w;
    }
  }
  return py - y + line;
}
export function bar(c, x, y, w, h, value, color, back = "#263f47") {
  box(c, x, y, w, h, back, null, h / 2);
  if (value > 0)
    box(c, x, y, w * Math.max(0, Math.min(1, value)), h, color, null, h / 2);
}
