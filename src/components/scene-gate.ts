const palettes = [
  ["#e7ac36", "#665026"],
  ["#73c1c4", "#2c5055"],
  ["#e59d54", "#60432d"],
  ["#aaa3e3", "#494164"],
  ["#f5cf68", "#61502e"],
] as const;

export function drawSceneGate(ctx: CanvasRenderingContext2D, width: number, height: number, index: number, depth: number) {
  const [light, shadow] = palettes[index % palettes.length];
  const cx = Math.round(width * .5);
  const cy = Math.round(height * (.91 - depth * .41));
  const expansion = depth ** 2;
  const span = width * (.10 + .63 * expansion);
  const rise = height * (.11 + .55 * expansion);
  const opacity = Math.min(1, depth * 6, (1 - depth) * 5);
  const near = [1, .75, .51];

  ctx.save();
  ctx.globalAlpha = opacity * .48;
  ctx.fillStyle = "#080b13";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = shadow;
  ctx.lineWidth = 1;

  for (const [x, y] of [[0, 0], [width, 0], [width, height], [0, height]]) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(cx, cy);
    ctx.stroke();
  }

  for (const [layer, distance] of near.entries()) {
    const left = Math.round(cx - span * distance);
    const right = Math.round(cx + span * distance);
    const top = Math.round(cy - rise * distance);
    const bottom = Math.round(cy + rise * distance);
    const step = Math.max(2, Math.round((right - left) * .065));
    const thick = layer === 0 ? (width < 180 ? 2 : 3) : 1;
    ctx.globalAlpha = opacity * (1 - layer * .24);
    ctx.fillStyle = layer === 0 ? light : shadow;
    ctx.fillRect(left + step, top, right - left - 2 * step, thick);
    ctx.fillRect(left + step, bottom - thick, right - left - 2 * step, thick);
    ctx.fillRect(left, top + step, thick, bottom - top - 2 * step);
    ctx.fillRect(right - thick, top + step, thick, bottom - top - 2 * step);
    for (const x of [left + thick, right - step]) {
      ctx.fillRect(x, top + step - thick, step - thick, thick);
      ctx.fillRect(x, bottom - step, step - thick, thick);
    }
    for (const x of [left + step - thick, right - step]) {
      ctx.fillRect(x, top + thick, thick, step - thick);
      ctx.fillRect(x, bottom - step + thick, thick, step - thick);
    }
    if (layer === 0) {
      ctx.globalAlpha = opacity * .34;
      ctx.fillRect(left + step, top + thick, right - left - 2 * step, 2);
      ctx.fillRect(left + step, bottom - thick - 2, right - left - 2 * step, 2);
    }
  }
  ctx.restore();
}
