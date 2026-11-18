// A procedural point portrait that dissolves into a sphere as the page moves.
export function createParticles(canvas) {
  const ctx=canvas.getContext('2d');
  if(!ctx)return;
  const hero=canvas.parentElement;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile=matchMedia('(max-width: 700px)').matches;
  const count=mobile?1700:5200;
  let seed=17;
  const random=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
  const points=Array.from({length:count},(_,i)=>{
    const torso=i/count>.48;
    const y=torso?.10+random()*1.08:-.87+random()*.99;
    let width;
    if(torso){
      const shoulder=Math.min(1,Math.max(0,(y-.1)/.5));
      width=.15+.84*Math.sin(shoulder*Math.PI/2);
      if(y>.66)width=.95;
    }else{
      const normalized=(y+.42)/.53;
      width=(.27+.17*Math.sqrt(Math.max(0,1-normalized*normalized)))*(y>-.13?.82:1);
    }
    const x=(random()*2-1)*width;
    const depth=(random()*2-1)*.3;
    const sphereY=1-2*i/(count-1);
    const sphereR=Math.sqrt(Math.max(0,1-sphereY*sphereY));
    const sphereAngle=i*Math.PI*(3-Math.sqrt(5));
    return {x,y,depth,sx:Math.cos(sphereAngle)*sphereR,sy:sphereY,sz:Math.sin(sphereAngle)*sphereR,weight:.4+random()*.6};
  });
  let width=0,height=0,dpr=1,frame=0,scroll=0,mx=0,my=0;
  function resize(){
    width=hero.clientWidth;height=hero.clientHeight;dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    canvas.style.width=width+'px';canvas.style.height=height+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function draw(time=0){
    ctx.clearRect(0,0,width,height);
    const morph=Math.min(1,Math.max(0,(scroll-.08)/.6));
    const ease=morph*morph*(3-2*morph);
    const scale=Math.min(width*(mobile?.42:.33),height*.43);
    const cx=width*(mobile?.60:.63),cy=height*(mobile?.45:.45);
    const angle=reduced?0:time*.0001;
    const cos=Math.cos(angle),sin=Math.sin(angle);
    for(const point of points){
      const faceX=point.x+Math.sin(angle*1.4+point.y*4)*.012;
      const globeX=point.sx*cos-point.sz*sin;
      const globeZ=point.sx*sin+point.sz*cos;
      const px=cx+(faceX*(1-ease)+globeX*ease)*scale+mx*point.depth*8;
      const py=cy+(point.y*(1-ease)+point.sy*ease)*scale+my*point.depth*8;
      const alpha=(.10+point.weight*.42)*(1-scroll*.38)*(1+globeZ*ease*.25);
      ctx.fillStyle=`rgba(${point.weight>.965?'255,209,55':'239,239,235'},${alpha})`;
      ctx.fillRect(px,py,point.weight>.96?1.4:.8,point.weight>.96?1.4:.8);
    }
    if(!reduced)frame=requestAnimationFrame(draw);
  }
  function onScroll(){scroll=Math.min(1,scrollY/Math.max(1,hero.offsetHeight));if(reduced)draw()}
  hero.addEventListener('pointermove',event=>{mx=event.clientX/width*2-1;my=event.clientY/height*2-1});
  addEventListener('resize',()=>{resize();if(reduced)draw()},{passive:true});
  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('pagehide',()=>cancelAnimationFrame(frame),{once:true});
  resize();onScroll();draw();
}
