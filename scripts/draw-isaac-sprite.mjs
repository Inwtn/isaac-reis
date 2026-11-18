import sharp from "sharp";
import { fileURLToPath } from "node:url";

// One cell is one source pixel. The reference portrait supplies the design,
// while the pose and all of the pixels below are drawn for this sprite.
const width = 40, height = 60, frames = 16;
const stripWidth = width * frames;
const pixels = Buffer.alloc(stripWidth * height * 4);
const ink = 0x090a10, hair = 0x191921, jacket = 0x282c37;
const shadow = 0x171a23, seam = 0x3d4350, gold = 0xffd735;
const darkGold = 0x9e6e19, skin = 0xf5a373, skinShade = 0xc16b4e, skinLight = 0xffba88;

function drawFrame(frame) {
  const breathe = [3,4,5,11,12].includes(frame) ? -1 : 0;
  const blink = frame === 6 || frame === 14;
  const shift = [10,11,12].includes(frame) ? 1 : 0;
  const arm = [9,10,11,12].includes(frame) ? -1 : 0;
  const rect = (x,y,w,h,color) => {
    for (let row=y; row<y+h; row++) for (let col=x; col<x+w; col++) {
      const i = (row * stripWidth + frame * width + col) * 4;
      pixels[i] = color >> 16; pixels[i+1] = color >> 8; pixels[i+2] = color; pixels[i+3] = 255;
    }
  };
  const bars = (color, spans, dx=0, dy=0) =>
    spans.forEach(([x,y,w,h]) => rect(x+dx,y+dy,w,h,color));
  const upper = (color, spans) => bars(color,spans,shift,breathe);

  // Boots and tapered techwear trousers.
  bars(ink, [[10,39,20,10],[11,48,8,7],[21,48,8,7],[8,54,11,4],[21,54,11,4]]);
  bars(shadow, [[11,39,18,7],[12,46,6,8],[22,46,6,8],[9,55,9,2],[22,55,9,2]]);
  bars(jacket, [[12,42,6,6],[22,42,6,6],[13,48,3,5],[24,48,3,5]]);
  bars(seam, [[11,55,6,1],[24,55,5,1],[10,57,8,1],[22,57,8,1]]);
  bars(darkGold, [[12,46,1,4],[27,47,1,3],[16,55,2,1],[22,55,2,1]]);

  // Jacket, separate sleeves and a central zip.
  upper(ink, [[12,24,16,3],[9,27,22,4],[8,31,24,6],[10,37,20,5]]);
  upper(jacket, [[13,25,14,3],[11,28,18,8],[11,36,18,5]]);
  upper(shadow, [[12,37,16,4],[12,29,2,8],[26,29,2,8]]);
  upper(seam, [[14,29,4,1],[22,29,4,1],[14,35,3,1],[23,35,3,1],[13,40,14,1]]);
  upper(gold, [[11,28,3,1],[26,28,3,1],[14,29,2,1],[24,29,2,1],[19,29,2,3]]);
  upper(darkGold, [[20,32,1,7]]);
  bars(ink, [[7,29,5,10],[6,35,5,6],[28+shift,29+arm,5,10],[30+shift,35+arm,5,6]]);
  bars(jacket, [[8,30,3,8],[7,36,3,3],[29+shift,30+arm,3,8],[31+shift,36+arm,3,3]]);
  bars(seam, [[8,33,1,4],[31+shift,33+arm,1,4]]);
  bars(gold, [[8,30,2,1],[30+shift,30+arm,2,1],[7,38,3,1],[31+shift,38+arm,3,1]]);
  bars(skinShade, [[7,40,3,2],[31+shift,40+arm,3,2]]);
  bars(skin, [[8,40,2,1],[31+shift,40+arm,2,1]]);

  // Short hair, dark frames, warm skin and a small goatee.
  upper(ink, [[15,3,10,1],[12,4,16,2],[10,6,20,8],[8,13,24,5],[10,18,20,3],[12,21,16,2],[15,23,10,2],[17,25,6,1]]);
  upper(hair, [[15,4,10,2],[12,6,16,2],[11,8,18,5]]);
  upper(0x2c2831, [[14,5,11,1],[12,7,4,2],[11,9,2,1]]);
  upper(skinShade, [[9,14,4,3],[27,14,4,3],[12,14,16,6],[14,20,12,2],[16,22,8,2]]);
  upper(skin, [[13,9,13,2],[12,11,16,8],[14,19,12,2],[16,21,8,1]]);
  upper(skinLight, [[14,10,10,2],[13,16,3,2],[23,16,3,2],[19,16,2,2],[17,21,4,1]]);
  upper(ink, [[11,13,7,1],[22,13,7,1],[11,14,1,3],[17,14,1,3],[22,14,1,3],[28,14,1,3],[18,14,4,1],[12,17,5,1],[23,17,5,1]]);
  if (blink) upper(0x54372e, [[13,15,3,1],[24,15,3,1]]);
  else {
    upper(0xffeddb, [[12,15,5,1],[23,15,5,1]]);
    upper(0x211b21, [[14,14,2,2],[24,14,2,2]]);
  }
  upper(0x49302e, [[17,18,2,1],[21,18,2,1],[18,20,4,1],[19,22,2,2]]);
  upper(skinShade, [[19,17,2,1],[18,19,4,1]]);
}

for (let frame=0; frame<frames; frame++) drawFrame(frame);
await sharp(pixels, {raw:{width:stripWidth,height,channels:4}}).png()
  .toFile(fileURLToPath(new URL("../public/isaac-character-sprite.png", import.meta.url)));
