const amber = ["#3d2c1d", "#704823", "#ae7230", "#e6a645", "#ffdc75"];
const blue = ["#172536", "#284354", "#426a76", "#76afa9", "#ffe08a"];
const copper = ["#392721", "#694132", "#98603e", "#d18b51", "#ffda82"];
const palettes = [amber, blue, copper, blue, amber];

function noise(x: number, y: number, chapter: number) {
  const hash = Math.imul(x + 13, 1597334677) ^ Math.imul(y + 7, 3812015801) ^ Math.imul(chapter, 8191);
  return ((hash ^ hash >>> 16) >>> 0) / 4294967296;
}

export function drawPixelPassage(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  phase: number,
  chapter: number,
  mobile: boolean,
) {
  if (phase <= 0 || phase >= 1) return;

  const tile = mobile ? 5 : 6;
  const center = width * .5;
  const wave = height * (.94 - .73 * phase);
  const strength = Math.sin(phase * Math.PI);
  const colors = palettes[chapter - 1] ?? amber;

  ctx.save();
  for (let row = 0; row * tile < height; row++) {
    const y = row * tile;
    for (let column = 0; column * tile < width; column++) {
      const x = column * tile;
      const side = Math.abs(x + tile / 2 - center) / center;
      const front = wave - side * height * .26;
      const delta = (y - front) / height;
      if (delta < -.22 || delta > .37) continue;

      const falloff = Math.max(0, 1 - Math.abs(delta) * 3.2);
      const nearCenter = side < (mobile ? .24 : .31);
      const value = noise(column, row, chapter);
      const density = falloff * strength * (nearCenter ? .12 : .69);
      if (value >= density) continue;

      const light = noise(column + 80, row, chapter);
      const edge = Math.abs(delta) < .036;
      const tone = Math.min(4, Math.floor(light * (edge ? 5 : 4)));
      ctx.fillStyle = colors[tone];
      ctx.globalAlpha = (edge ? .93 : .57) * strength;
      const length = edge && light > .80 ? tile * 2 - 1 : tile - 1;
      ctx.fillRect(x, y, length, tile - 1);
    }
  }
  ctx.restore();
}
