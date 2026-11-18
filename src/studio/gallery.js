export function initGallery(){
  const section=document.querySelector('.work');
  const stage=section.querySelector('.work-stage');
  const track=section.querySelector('.project-list');
  const cards=[...track.children];
  const count=stage.querySelector('.gallery-count');
  const bar=stage.querySelector('.gallery-bar i');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let maxX=0,range=0,drag=null,targetProgress=0,currentProgress=0,frame=0;

  function measure(){
    if(reduced)return;
    maxX=Math.max(0,track.scrollWidth-innerWidth);
    range=maxX+innerHeight*.35;
    section.style.height=(innerHeight+range)+'px';
    targetProgress=currentProgress=Math.max(0,Math.min(1,(scrollY-section.offsetTop)/Math.max(1,range)));
    update();
  }
  function update(){
    if(reduced)return;
    targetProgress=Math.max(0,Math.min(1,(scrollY-section.offsetTop)/Math.max(1,range)));
    if(!frame)frame=requestAnimationFrame(animate);
  }
  function animate(){
    frame=0;
    currentProgress+=(targetProgress-currentProgress)*.14;
    if(Math.abs(targetProgress-currentProgress)<.0005)currentProgress=targetProgress;
    const progress=currentProgress;
    track.style.transform=`translate3d(${-progress*maxX}px,0,0)`;
    bar.style.width=(progress*100)+'%';
    count.textContent=String(Math.min(cards.length,Math.floor(progress*cards.length)+1)).padStart(2,'0')+' / '+String(cards.length).padStart(2,'0');
    for(const card of cards){
      const center=card.offsetLeft-progress*maxX+card.offsetWidth/2;
      const distance=Math.abs(center-innerWidth/2)/Math.max(1,innerWidth);
      card.style.opacity=String(.68+Math.max(0,1-distance*1.15)*.32);
    }
    if(currentProgress!==targetProgress)frame=requestAnimationFrame(animate);
  }

  stage.addEventListener('pointerdown',event=>{
    if(reduced||event.pointerType==='touch'||event.target.closest('a,button'))return;
    drag={x:event.clientX,y:scrollY};
    stage.classList.add('is-dragging');
    stage.setPointerCapture(event.pointerId);
  });
  stage.addEventListener('pointermove',event=>{
    if(!drag)return;
    const factor=range/Math.max(1,maxX);
    window.scrollTo({top:drag.y+(drag.x-event.clientX)*factor,behavior:'instant'});
  });
  const endDrag=()=>{drag=null;stage.classList.remove('is-dragging')};
  stage.addEventListener('pointerup',endDrag);
  stage.addEventListener('pointercancel',endDrag);
  addEventListener('resize',measure,{passive:true});
  addEventListener('scroll',update,{passive:true});
  addEventListener('pagehide',()=>{if(frame)cancelAnimationFrame(frame)},{once:true});
  measure();
}
