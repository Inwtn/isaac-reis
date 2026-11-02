export function createCaseAtmosphere(dialog){
 const canvas=document.createElement('canvas');canvas.className='case-atmosphere';canvas.setAttribute('aria-hidden','true');dialog.prepend(canvas);const g=canvas.getContext('2d');if(!g)return {dispose(){canvas.remove();}};
 const reduce=matchMedia('(prefers-reduced-motion:reduce)');let width=0,height=0,raf=0,last=0,disposed=false,start=performance.now(),seed=517;const random=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
 const dust=Array.from({length:105},()=>({x:random(),y:random(),r:.35+random()*1.15,v:.002+random()*.004,a:.12+random()*.29}));
 const atoms=Array.from({length:9},(_,i)=>({x:.06+random()*.9,y:.06+random()*.88,r:13+random()*17,phase:random()*6.28,speed:.12+random()*.22}));
 function resize(){cancelAnimationFrame(raf);width=innerWidth;height=innerHeight;const dpr=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);g.setTransform(dpr,0,0,dpr,0,0);draw(performance.now(),true);}
 function draw(now,force=false){if(disposed||!dialog.open)return;const still=reduce.matches||document.body.classList.contains('reduced-motion');if(!force&&!still&&now-last<32){raf=requestAnimationFrame(draw);return;}last=now;g.clearRect(0,0,width,height);const t=still?0:(now-start)/1000;
  for(const p of dust){const x=(p.x+t*p.v*.15)%1*width,y=(p.y+t*p.v*.25)%1*height;g.fillStyle=`rgba(215,207,235,${p.a})`;g.beginPath();g.arc(x,y,p.r,0,Math.PI*2);g.fill();}
  for(const a of atoms){const x=(a.x+Math.sin(t*.045+a.phase)*.035)*width,y=(a.y+Math.cos(t*.04+a.phase)*.025)*height,r=a.r*(width<700?.72:1);const glow=g.createRadialGradient(x,y,0,x,y,r*.7);glow.addColorStop(0,'rgba(202,184,241,.14)');glow.addColorStop(1,'rgba(202,184,241,0)');g.fillStyle=glow;g.fillRect(x-r,y-r,r*2,r*2);
   for(let orbit=0;orbit<3;orbit++){const angle=a.phase+orbit*Math.PI/3+t*.035;g.strokeStyle='rgba(192,180,215,.15)';g.lineWidth=.7;g.beginPath();g.ellipse(x,y,r,r*.34,angle,0,Math.PI*2);g.stroke();const phase=t*a.speed+orbit*2.1+a.phase,u=Math.cos(phase)*r,v=Math.sin(phase)*r*.34;g.fillStyle='rgba(225,211,255,.6)';g.beginPath();g.arc(x+u*Math.cos(angle)-v*Math.sin(angle),y+u*Math.sin(angle)+v*Math.cos(angle),1.1,0,Math.PI*2);g.fill();}
   g.fillStyle='rgba(223,213,244,.65)';g.beginPath();g.arc(x,y,1.6,0,Math.PI*2);g.fill();
  }
  if(!still)raf=requestAnimationFrame(draw);
 }
 const preference=()=>{cancelAnimationFrame(raf);draw(performance.now(),true);};window.addEventListener('resize',resize);reduce.addEventListener('change',preference);resize();
 return {dispose(){disposed=true;cancelAnimationFrame(raf);window.removeEventListener('resize',resize);reduce.removeEventListener('change',preference);canvas.remove();}};
}
