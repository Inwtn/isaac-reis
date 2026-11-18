export function initLoop(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const overlay=document.createElement('div');
  overlay.className='loop-transition';
  overlay.setAttribute('aria-hidden','true');
  overlay.innerHTML='<span></span>';
  document.body.append(overlay);
  let busy=false;
  function atEnd(){return scrollY+innerHeight>=document.documentElement.scrollHeight-3}
  function returnToStart(){
    if(busy||!atEnd())return;
    busy=true;
    overlay.classList.add('is-active');
    setTimeout(()=>{
      window.scrollTo({top:0,behavior:'instant'});
      setTimeout(()=>{
        overlay.classList.remove('is-active');
        setTimeout(()=>{busy=false},400);
      },140);
    },400);
  }
  addEventListener('wheel',event=>{if(event.deltaY>15)returnToStart()},{passive:true});
  let touchY=null;
  addEventListener('touchstart',event=>{touchY=event.touches[0]?.clientY??null},{passive:true});
  addEventListener('touchend',event=>{
    if(touchY!==null&&touchY-(event.changedTouches[0]?.clientY??touchY)>45)returnToStart();
    touchY=null;
  },{passive:true});
}
