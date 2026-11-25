type Paint = (x: number, y: number, width: number, height: number, color: string) => void;
type Stage = { x: number; floor: number; unit: number; paint: Paint };
type Landmark = (stage: Stage) => void;

const steel = "#263b50";
const shade = "#111c29";
const gold = "#bd9242";

const workshop: Landmark = ({ x, floor, unit, paint }) => {
  for (const [index, size] of [5, 8, 12, 7].entries()) {
    const left = x + (index * 4 - 7) * unit;
    const roof = floor - size * unit;
    paint(left, roof, unit * 3.75, unit * size, shade);
    paint(left, roof, unit * 3.75, 1, gold);
    paint(left + unit * 2.7, roof + 1, unit, unit * size - 1, steel);
    for (let row = 1; row < size - 1; row++) {
      paint(left + unit * .5, roof + row * unit, unit * 1.7, Math.max(1, unit * .18), row % 3 ? "#4e7e85" : gold);
    }
  }
};

const overlook: Landmark = ({ x, floor, unit, paint }) => {
  for (let stair = 0; stair < 4; stair++) {
    const width = (18 - stair * 3) * unit;
    const y = floor - (stair + 1) * unit;
    paint(x - width / 2, y, width, unit, shade);
    paint(x - width / 2, y, width, 1, "#7a6a42");
  }
  paint(x - .8 * unit, floor - 6 * unit, 1.6 * unit, 2 * unit, steel);
  paint(x - 4 * unit, floor - 6 * unit, 8 * unit, 1, gold);
};

const foundry: Landmark = ({ x, floor, unit, paint }) => {
  paint(x - 7 * unit, floor - 5 * unit, 15 * unit, 5 * unit, shade);
  paint(x - 7 * unit, floor - 5 * unit, 15 * unit, 1, "#a5653d");
  for (const left of [-5, 2]) {
    paint(x + left * unit, floor - 12 * unit, 3 * unit, 10 * unit, "#3f3030");
    paint(x + left * unit, floor - 12 * unit, 3 * unit, 1, "#a5653d");
    paint(x + (left + 2) * unit, floor - 11 * unit, unit, 8 * unit, shade);
    paint(x + (left - .4) * unit, floor - 9 * unit, 3.8 * unit, 1, gold);
  }
  paint(x - 4 * unit, floor - 3.75 * unit, 9 * unit, .65 * unit, "#a5653d");
  paint(x - 4 * unit, floor - 2.25 * unit, 9 * unit, .65 * unit, steel);
};

const observatory: Landmark = ({ x, floor, unit, paint }) => {
  const roof = floor - 3.5 * unit;
  paint(x - 6.5 * unit, roof, 13 * unit, 3.5 * unit, shade);
  for (let row = 0; row < 5; row++) {
    const width = Math.max(2, Math.floor(Math.sqrt(25 - row * row) * 2)) * unit;
    const y = roof - (row + 1) * unit;
    paint(x - width / 2, y, width, unit, steel);
    paint(x - width / 2, y, unit, unit, "#54728a");
  }
  paint(x - 3 * unit, roof + unit, 6 * unit, 1, gold);
  paint(x + 2 * unit, roof - 6.5 * unit, unit, 3.5 * unit, "#54728a");
  paint(x + unit, roof - 6.5 * unit, 3.8 * unit, 1, "#859eac");
};

const relay: Landmark = ({ x, floor, unit, paint }) => {
  paint(x - 5 * unit, floor - 4 * unit, 10 * unit, 4 * unit, shade);
  paint(x - 5 * unit, floor - 4 * unit, 10 * unit, 1, steel);
  paint(x - .4 * unit, floor - 13 * unit, .8 * unit, 9 * unit, "#695737");
  for (let level = 0; level < 3; level++) {
    const radius = (level + 2) * unit;
    const y = floor - (11 - 2 * level) * unit;
    paint(x - radius, y, 2 * radius, 1, gold);
    paint(x - radius, y - unit, 1, unit, "#a77d48");
    paint(x + radius, y - unit, 1, unit, "#a77d48");
  }
  paint(x - .35 * unit, floor - 13 * unit, .7 * unit, .7 * unit, "#ffe365");
};

const landmarks: (Landmark | undefined)[] = [undefined, workshop, overlook, foundry, observatory, relay];
const positions = [.82, .14, .83, .16, .83];

export function drawDistricts(ctx: CanvasRenderingContext2D, paint: Paint, width: number, height: number, position: number, mobile: boolean) {
  const previous = Math.floor(position);
  const blend = position - previous;
  for (const [index, opacity] of [[previous, 1 - blend], [previous + 1, blend]]) {
    const landmark = landmarks[index];
    if (!landmark || opacity <= 0) continue;
    ctx.globalAlpha = opacity * (mobile ? .68 : .88);
    const unit = Math.max(2, Math.min(width * .036, height * .034));
    landmark({ x: width * positions[index - 1], floor: height * .84, unit, paint });
  }
  ctx.globalAlpha = 1;
}
