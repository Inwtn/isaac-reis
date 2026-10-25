export function direction(x,y){const n=Math.hypot(x,y);return n>1?{x:x/n,y:y/n}:{x,y};}
export function createInput(canvas,onAction){
 const keys=new Set();let stick={x:0,y:0},origin=null,travel=0;
 const relevant=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d','e','Enter'];
 window.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]'))return;if(e.key==='Enter'&&e.target.closest('button,a,input,select'))return;if(relevant.includes(e.key)||['W','A','S','D','E'].includes(e.key)){e.preventDefault();keys.add(e.key.toLowerCase());if(!e.repeat&&(e.key.toLowerCase()==='e'||e.key==='Enter'))onAction();}});
 window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>{keys.clear();stick={x:0,y:0};});
 canvas.addEventListener('pointerdown',e=>{canvas.focus();origin={x:e.clientX,y:e.clientY};travel=0;canvas.setPointerCapture(e.pointerId);});
 canvas.addEventListener('pointermove',e=>{if(!origin)return;const dx=e.clientX-origin.x,dy=e.clientY-origin.y;travel=Math.max(travel,Math.hypot(dx,dy));stick=direction(dx/34,dy/34);});
 const release=e=>{if(origin&&travel<9)onAction(e);origin=null;stick={x:0,y:0};};canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',()=>{origin=null;stick={x:0,y:0};});
 return {read:()=>direction(stick.x+Number(keys.has('d')||keys.has('arrowright'))-Number(keys.has('a')||keys.has('arrowleft')),stick.y+Number(keys.has('s')||keys.has('arrowdown'))-Number(keys.has('w')||keys.has('arrowup'))),clear:()=>{keys.clear();origin=null;stick={x:0,y:0};}};
}
