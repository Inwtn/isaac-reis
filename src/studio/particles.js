export function createParticles(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const hero = canvas.parentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = matchMedia('(max-width: 700px)').matches;
  const count = mobile ? 520 : 1500;
  const points = Array.from({length:count}, (_,i) => {
    const y = 1 - i/(count-1)*2;
    const r = Math.sqrt(1-y*y);
    const a = i*Math.PI*(3-Math.sqrt(5));
    return {x:Math.cos(a)*r,y,z:Math.sin(a)*r,w:Math.random()*.7+.3};
  });
  let width=0,height=0,dpr=1,frame=0,mouseX=0,mouseY=0,scroll=0;
  function resize(){
    width=hero.clientWidth; height=hero.clientHeight;
    dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(width*dpr); canvas.height=Math.round(height*dpr);
    canvas.style.width=width+'px'; canvas.style.height=height+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function draw(time=0){
    ctx.clearRect(0,0,width,height);
    const size=Math.min(width*(mobile?.34:.29),height*.37);
    const cx=width*(mobile?.52:.57),cy=height*(mobile?.43:.48);
    const angle=reduced?.15:time*.00011,cos=Math.cos(angle),sin=Math.sin(angle);
    for(const p of points){
      const x=p.x*cos-p.z*sin,z=p.x*sin+p.z*cos;
      const perspective=1+z*.18;
      const px=cx+(x+Math.sin(p.y*8+angle*5)*.045)*size*perspective+mouseX*z*8;
      const py=cy+p.y*size*perspective+mouseY*z*7;
      const edge=Math.max(0,1-Math.abs(Math.hypot((px-cx)/size,(py-cy)/size)-.83)*1.7);
      const alpha=(.13+(.5+z*.3)*.44)*edge*p.w*(1-scroll*.5);
      ctx.fillStyle=`rgba(${p.w>.91?'255,207,42':'235,236,232'},${alpha})`;
      ctx.beginPath();ctx.arc(px,py,p.w>.91?1.45:.8,0,Math.PI*2);ctx.fill();
    }
    ctx.strokeStyle='rgba(255,207,42,.38)';ctx.lineWidth=1;
    ctx.beginPath();ctx.arc(cx,cy,size*1.06,-.95,-.95+Math.PI*.44);ctx.stroke();
    if(!reduced)frame=requestAnimationFrame(draw);
  }
  function onScroll(){scroll=Math.min(1,scrollY/Math.max(1,hero.offsetHeight));if(reduced)draw();}
  hero.addEventListener('pointermove',e=>{mouseX=e.clientX/width*2-1;mouseY=e.clientY/height*2-1;});
  addEventListener('resize',()=>{resize();if(reduced)draw();},{passive:true});
  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('pagehide',()=>cancelAnimationFrame(frame),{once:true});
  resize();onScroll();draw();
}
