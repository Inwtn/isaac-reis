const TAU = Math.PI * 2;
const BAYER = [0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
const SUN = ["#583219","#8e4917","#bf6915","#e6961b","#ffc12a","#ffd735","#ffe365","#fff2a6"];
const SKY = ["#080b12","#0b101b","#101728","#151e30","#1b2539"];
const ROCK = ["#0b0f19","#12192a","#202a3a","#2c394e"];
const mod = (n: number, m: number) => ((n % m) + m) % m;
const noise = (n: number) => mod(Math.imul(n ^ (n >>> 11), 1597334677) >>> 0, 65536) / 65536;
const clamp = (n: number, max: number) => Math.max(0, Math.min(max, n));

export function drawWorld(g: CanvasRenderingContext2D, w: number, h: number, progress: number, t: number, mobile: boolean) {
  const phase = mod(progress, 1) * TAU;
  const px = Math.round(w * .5 + w * .19 * Math.sin(phase));
  const py = Math.round(h * (mobile ? .32 : .31) + h * .06 * Math.sin(phase));
  const r = Math.round(Math.min(w * (mobile ? .30 : .145), h * .22) * (1 + .1 * Math.sin(phase)));
  const horizon = Math.round(h * (.74 + .035 * Math.sin(phase)));
  const step = (x: number, y: number, width: number, height: number, color: string) => {
    g.fillStyle = color; g.fillRect(Math.floor(x), Math.floor(y), Math.ceil(width), Math.ceil(height));
  };
  for (let y = 0; y < h; y++) step(0,y,w,1,SKY[clamp(Math.floor(y / horizon * 4),4)]);

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
  // A sun drawn on the raster grid. Integer rows keep its silhouette stepped.
  for (let y = -r; y <= r; y++) {
    const edge = Math.floor(Math.sqrt(r*r - y*y));
    const left = Math.max(-edge, -px), right = Math.min(edge, w-px-1);
    for (let x = left; x <= right; x++) {
      const light = 4.75 - 2.65*y/r - .6*x/r + Math.sin(y*.48 + x*.047)*.42;
      const patch = noise(Math.floor((x + r) / 5) + Math.floor((y + r) / 3) * 107);
      const dither = (BAYER[(mod(y,4)*4)+mod(x,4)] + .5) / 16;
      const tone = clamp(Math.floor(light + dither - patch * .85), SUN.length-1);
      step(px+x,py+y,1,1,SUN[tone]);
    }
  }
  for (let i=0;i<11;i++) {
    const x = mod(Math.floor(noise(9000+i) * w - progress*w),w);
    const y = Math.floor(horizon * (.25 + .63 * noise(9200+i)));
    const length = 8 + Math.floor(noise(9500+i) * w * .115);
    step(x,y,length,1,SKY[2]); step(x+5,y+1,length,2,SKY[1]);
    step(x+1,y-1,length*.65,1,SKY[3]);
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
}
