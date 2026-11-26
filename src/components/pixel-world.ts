import { drawDistricts } from "./pixel-districts";
import { streetSurface } from "./street";

const TAU = Math.PI * 2;
const BAYER = [0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
const SUN = ["#583219","#8e4917","#bf6915","#e6961b","#ffc12a","#ffd735","#ffe365","#fff2a6"];
const SKY = ["#080b12","#0b101b","#101728","#151e30","#1b2539"];
const DAY_SKIES = [
  ["#111522","#191a27","#28202c","#45302f","#78452f"],
  ["#18263a","#21334a","#30465b","#4e5c64","#796343"],
  ["#203852","#294965","#395a70","#526d75","#7d704f"],
  ["#253348","#343d50","#4c4d58","#70534f","#95603c"],
  ["#1b192b","#2a202f","#3e2b37","#674033","#9a542f"],
  SKY,
];
const ROCK = ["#0b0f19","#12192a","#202a3a","#2c394e"];
const DAY_STOPS = [0, .18, .4, .62, .82, 1];
const mod = (n: number, m: number) => ((n % m) + m) % m;
const noise = (n: number) => mod(Math.imul(n ^ (n >>> 11), 1597334677) >>> 0, 65536) / 65536;
const clamp = (n: number, max: number) => Math.max(0, Math.min(max, n));
const colorChannel = (hex: string, channel: number) => Number.parseInt(hex.slice(1 + channel * 2, 3 + channel * 2), 16);
const mixColor = (a: string, b: string, amount: number) => `#${[0,1,2].map(channel => Math.round(colorChannel(a, channel) + (colorChannel(b, channel) - colorChannel(a, channel)) * amount).toString(16).padStart(2,"0")).join("")}`;

function skyAt(dayCycle: number): string[] {
  let stop = DAY_STOPS.findIndex(value => value >= dayCycle);
  if (stop <= 0) return DAY_SKIES[0];
  stop = Math.min(stop, DAY_STOPS.length - 1);
  const blend = clamp((dayCycle - DAY_STOPS[stop - 1]) / (DAY_STOPS[stop] - DAY_STOPS[stop - 1]), 1);
  return DAY_SKIES[stop].map((color, index) => mixColor(DAY_SKIES[stop - 1][index], color, blend));
}

export function drawWorld(g: CanvasRenderingContext2D, w: number, h: number, progress: number, t: number, mobile: boolean, district: number, dayCycle?: number) {
  const phase = mod(progress, 1) * TAU;
  const daylight = dayCycle === undefined ? phase : dayCycle * Math.PI;
  const px = Math.round(dayCycle === undefined ? w * .5 + w * .19 * Math.sin(phase) : w * (.08 + dayCycle * .84));
  const py = Math.round(dayCycle === undefined ? h * (mobile ? .32 : .31) + h * .06 * Math.sin(phase) : h * (.69 - Math.sin(daylight) * .39));
  const r = Math.round(Math.min(w * (mobile ? .30 : .145), h * .22) * (dayCycle === undefined ? 1 + .1 * Math.sin(phase) : 1));
  const horizon = Math.round(h * (.74 + .035 * Math.sin(phase)));
  const sky = dayCycle === undefined ? SKY : skyAt(dayCycle);
  const step = (x: number, y: number, width: number, height: number, color: string) => {
    g.fillStyle = color; g.fillRect(Math.floor(x), Math.floor(y), Math.ceil(width), Math.ceil(height));
  };
  for (let y = 0; y < h; y++) step(0,y,w,1,sky[clamp(Math.floor(y / horizon * 4),4)]);

  const starsAlpha = dayCycle === undefined ? 1 : clamp((dayCycle - .68) / .2, 1);
  g.globalAlpha = starsAlpha;
  for (let i = 0; i < Math.floor(w * .77); i++) {
    const x = mod(Math.floor(noise(i + 1000) * w - progress * w * (i % 5 ? 1 : 2)), w);
    const y = Math.floor(noise(i + 2800) * horizon * .91);
    const bright = i % 17 === 0;
    step(x,y,1,1,bright ? "#ffd735" : i % 3 === 0 ? "#677994" : "#34445c");
    if (bright && (Math.floor(t / 480) + i) % 5 !== 0) {
      step(x-1,y,1,1,"#8e691c"); step(x+1,y,1,1,"#8e691c");
      step(x,y-1,1,1,"#8e691c"); step(x,y+1,1,1,"#8e691c");
    }
  }
  g.globalAlpha = 1;
  // A sun drawn on the raster grid. Integer rows keep its silhouette stepped.
  const evening = dayCycle === undefined ? 0 : clamp((dayCycle - .67) / .23, 1);
  if (dayCycle !== undefined) g.globalAlpha = 1 - clamp((dayCycle - .82) / .18, 1);
  for (let y = -r; y <= r; y++) {
    const edge = Math.floor(Math.sqrt(r*r - y*y));
    const left = Math.max(-edge, -px), right = Math.min(edge, w-px-1);
    for (let x = left; x <= right; x++) {
      const light = 4.75 - 2.65*y/r - .6*x/r + Math.sin(y*.48 + x*.047)*.42;
      const patch = noise(Math.floor((x + r) / 5) + Math.floor((y + r) / 3) * 107);
      const dither = (BAYER[(mod(y,4)*4)+mod(x,4)] + .5) / 16;
      const tone = clamp(Math.floor(light + dither - patch * .85), SUN.length-1);
      const sunColor = evening > .55 ? mixColor(SUN[tone], "#b65e20", (evening - .55) * .52) : SUN[tone];
      step(px+x,py+y,1,1,sunColor);
    }
  }
  if (dayCycle !== undefined) g.globalAlpha = 1;
  if (dayCycle !== undefined && dayCycle > .76) {
    const moonProgress = clamp((dayCycle - .76) / .24, 1);
    const moonX = Math.round(w * (.69 + moonProgress * .18));
    const moonY = Math.round(h * (.26 - moonProgress * .035));
    const moonR = Math.max(3, Math.round(r * .48));
    const skyColorAt = (y: number) => sky[clamp(Math.floor(y / horizon * 4),4)];
    for (let y = -moonR; y <= moonR; y++) {
      const edge = Math.floor(Math.sqrt(moonR * moonR - y * y));
      for (let x = -edge; x <= edge; x++) {
        const cutX = x - moonR * .34;
        const cutY = y + moonR * .12;
        if (cutX * cutX + cutY * cutY < moonR * moonR * .72) continue;
        const patch = noise(Math.floor((x + moonR) / 4) + Math.floor((y + moonR) / 3) * 83);
        const dither = (BAYER[(mod(y,4)*4)+mod(x,4)] + .5) / 16;
        const shade = clamp(Math.floor(2.5 + dither - patch * .9), 3);
        step(moonX + x, moonY + y, 1, 1, ["#897443","#b89a57","#e4c76b","#fff0a6"][shade]);
      }
    }
    g.globalAlpha = moonProgress;
    step(moonX - moonR, moonY - moonR - 3, 1, 3, "#ffd735");
    step(moonX + moonR, moonY + moonR, 2, 1, "#ffe365");
    g.globalAlpha = 1;
  }
  for (let i=0;i<11;i++) {
    const x = mod(Math.floor(noise(9000+i) * w - progress*w),w);
    const y = Math.floor(horizon * (.25 + .63 * noise(9200+i)));
    const length = 8 + Math.floor(noise(9500+i) * w * .115);
    step(x,y,length,1,sky[2]); step(x+5,y+1,length,2,sky[1]);
    step(x+1,y-1,length*.65,1,sky[3]);
  }

  for (let layer = 0; layer < 3; layer++) {
    const block = (layer === 2 ? 2 : 4);
    for (let x = 0; x < w; x+=block) {
      const a = x/w*TAU - phase*(layer+1);
      const shape = Math.abs(Math.sin(a*2 + layer*.4))*.48 + Math.abs(Math.sin(a*5 + .4))*.31 + Math.sin(a*9)*.12;
      const y = horizon + h*(layer*.064 - shape*(mobile ? .085 : .17));
      step(x, y, block, h, ["#161f31","#111827","#0b111b"][layer]);
    }
  }
  const gridTop = horizon + Math.floor(h*.1);
  for (let row=0; row<7; row++) {
    const dy = Math.floor((h-gridTop)*((row+1)/7)**2);
    step(0,gridTop+dy,w,1,row % 2 ? "#242719" : "#1d241f");
  }
  for (let line=-9;line<=9;line++) {
    const vanishing = w*.61 + Math.sin(phase)*w*.12;
    for(let y=gridTop;y<h;y+=2) {
      const spread = (y-gridTop)/(h-gridTop);
      step(vanishing + line*spread*w*.12,y,1,2,"#232519");
    }
  }

  // Modular towers slide past the viewport on three depth layers.
  for(let layer=0;layer<3;layer++) for(let i=0;i<(mobile ? 16 : 21);i++) {
    const j=layer*100+i;
    const depth=[1,2,3][layer];
    const x=mod(Math.floor((.50 + noise(j+40)*.54 - progress*depth)*w),w);
    const right = x/w;
    const base = horizon + Math.floor(h*(.025 + layer*.082));
    const bh = Math.floor(h*(.025 + noise(j+404)*.155)*(right > .59 ? 1.38 : .26));
    const bw = Math.floor(2 + noise(j+808)*w*.041);
    const top = base-bh;
    const cap = layer===2 ? "#ffd735" : layer===1 ? "#91601a" : "#58461f";
    step(x,top,bw,bh,ROCK[layer]); step(x,top,bw,1,cap);
    step(x+1,top-3,Math.max(2,bw-4),3,ROCK[layer+1]);
    if(i%4===0) {step(x+bw/2,top-11,1,8,cap); step(x+bw/2,top-12,1,1,"#ffe365");}
    for(let wy=top+5;wy<base-1;wy+=4) for(let wx=2;wx<bw-1;wx+=3)
      if(noise(j*251+wy*49+wx)>.62) step(x+wx,wy,1,1,i%3 ? cap : "#81a0ac");
    step(x+bw-1,top+1,1,bh-1,ROCK[layer+1]);
  }

  drawDistricts(g, step, w, h, district, mobile);

  // A pair of foreground cliffs puts a clean silhouette below the interface.
  for(let side=0;side<2;side++) {
    const count=9, span=w*(side ? .45 : .28);
    for(let k=0;k<count;k++) {
      const x=side ? w-span+k*span/count : k*span/count;
      const rise=(side ? k : count-1-k)/count;
      const y=h - h*(.025 + rise*.19) + Math.sin(phase)*h*.018;
      const tile=span/count+1;
      step(x,y,tile,h-y,ROCK[0]);
      step(x,y,tile,1,side ? "#c98c21" : "#746024");
      step(x,y+2,tile,2,ROCK[1]);
      step(x+2,y+6,tile*.6,1,ROCK[2]);
    }
  }
  if(mobile) for(let y=Math.floor(h*.46);y<h;y++) {
    g.fillStyle=`rgba(8,11,13,${Math.min(.56, (y/h-.46)*1.2)})`;g.fillRect(0,y,w,1);
  }
  // Keep a continuous foreground path across districts.
  for (let x = 0; x < w; x++) {
    const y = Math.round(streetSurface(x, w, h));
    step(x, y, 1, 2, "#2b2923");
    step(x, y + 2, 1, h - y, "#090d15");
    if (x % 29 < 3) step(x, y, 1, 1, "#614b24");
    if (Math.min(Math.abs(x - w * .38), Math.abs(x - w * .69)) < 1) step(x, y, 1, 3, "#ad7c35");
  }
}
