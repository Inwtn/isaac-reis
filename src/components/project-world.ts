const palettes: Record<string, [string,string,string]> = {
  mneme: ["#08141b","#13373d","#66ead2"],
  "reconciliacao-bancaria": ["#111009","#392d17","#ffcc56"],
  "finance-sync-api": ["#091810","#123929","#7befaa"],
  streamhub: ["#101125","#242753","#a5acff"],
  "lupa-net": ["#170d1c","#3b2148","#eaa0f9"],
};

export function drawProject(g: CanvasRenderingContext2D, w: number, h: number, slug: string, progress: number, time: number) {
  const [sky, surface, light] = palettes[slug] ?? palettes.mneme;
  const box = (x: number,y: number,bw: number,bh: number,c: string) => {
    g.fillStyle=c;
    g.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(bw)),Math.max(1,Math.round(bh)));
  };
  box(0,0,w,h,sky);
  const unit = Math.max(1, Math.floor(w/130));
  const grid = 12*unit;
  for(let x=0;x<w;x+=grid) box(x,0,1,h,surface);
  for(let y=Math.floor(progress*110)%grid;y<h;y+=grid) box(0,y,w,1,surface);
  const cx=w*.5, cy=h*.38, phase=Math.floor(time/160), u=unit;
  const panel = (x: number,y: number,pw: number,ph: number) => {
    box(x+3*u,y+3*u,pw,ph,surface);
    box(x,y,pw,ph,light); box(x+u,y+u,pw-2*u,ph-2*u,sky);
    box(x+u,y+u,pw-2*u,4*u,surface);
    box(x+3*u,y+2*u,2*u,u,light);
  };
  if(slug==="mneme") {
    panel(cx-45*u,cy-23*u,90*u,44*u);
    for(let i=0;i<29;i++){
      const v=Math.round(Math.sin(i*.76+progress*5)*4 + Math.sin(i*.26)*5 + i*.54);
      const x=cx+(i*2.8-40)*u,y=cy+(12-v)*u;
      box(x,y-2*u,u,8*u,light); box(x-u,y,3*u,4*u,i%3?light:surface);
      box(x-u,cy+17*u-(i%5)*u,2*u,(i%5+1)*u,surface);
    }
  } else if(slug==="reconciliacao-bancaria") {
    for(const side of [-1,1]){
      const x=cx+side*26*u-18*u;
      panel(x,cy-21*u,36*u,42*u);
      for(let i=0;i<7;i++){
        const yy=cy+(-13+i*4)*u;
        box(x+4*u,yy,14*u,u,i===phase%7?light:surface); box(x+24*u,yy,7*u,u,light);
      }
    }
    box(cx-7*u,cy,14*u,u,light);
    box(cx-2*u,cy-3*u,4*u,7*u,surface);
  } else if(slug==="finance-sync-api") {
    panel(cx-43*u,cy-14*u,27*u,31*u); panel(cx+11*u,cy-22*u,34*u,45*u);
    for(let i=0;i<5;i++){
      box(cx-38*u,cy+(-6+i*4)*u,(8+i%3*4)*u,u,light);
      box(cx+14*u,cy+(-12+i*7)*u,28*u,u,i===phase%5?light:surface);
    }
    for(let i=0;i<3;i++) box(cx+(18+i*8)*u,cy-13*u,u,29*u,surface);
    box(cx-15*u,cy,26*u,u,surface); box(cx+(-14+phase%22)*u,cy-u,3*u,3*u,light);
  } else if(slug==="streamhub") {
    for(const side of [-1,1]){
      const x=cx+side*26*u-18*u;
      panel(x,cy-15*u,36*u,28*u);
      for(let i=0;i<8;i++) box(x+(5+i*3)*u,cy+Math.sin(i+phase*.4)*4*u,2*u,3*u,light);
      box(x+14*u,cy+14*u,8*u,4*u,surface);
    }
    box(cx-8*u,cy,16*u,u,light); box(cx+(-7+phase%14)*u,cy-u,3*u,3*u,light);
  } else {
    panel(cx-43*u,cy-23*u,86*u,46*u);
    box(cx-14*u,cy-17*u,u,37*u,surface);
    for(let i=0;i<8;i++){
      box(cx+(-38+i%3*3)*u,cy+(-13+i*4)*u,(12-i%3)*u,u,light);
      box(cx+(-9+i%3*4)*u,cy+(-13+i*4)*u,(17+i%4*5)*u,u,i===phase%8?light:surface);
    }
  }
}
