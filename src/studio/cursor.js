export function initCursor() {
  if(!matchMedia('(pointer:fine)').matches)return;
  const dot=document.createElement('div');
  dot.className='cursor-dot';
  dot.setAttribute('aria-hidden','true');
  document.body.append(dot);
  let x=-100,y=-100,tx=-100,ty=-100,frame;
  addEventListener('pointermove',event=>{
    tx=event.clientX;ty=event.clientY;
    dot.classList.add('is-visible');
    dot.classList.toggle('is-hover',Boolean(event.target.closest('a,button')));
  },{passive:true});
  addEventListener('pointerleave',()=>dot.classList.remove('is-visible'));
  function tick(){
    x+=(tx-x)*.24;y+=(ty-y)*.24;
    dot.style.transform=`translate3d(${x-dot.offsetWidth/2}px,${y-dot.offsetHeight/2}px,0)`;
    frame=requestAnimationFrame(tick);
  }
  tick();
  addEventListener('pagehide',()=>cancelAnimationFrame(frame),{once:true});
}
