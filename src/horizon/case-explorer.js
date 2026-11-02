import {externalArrow} from '../icons.js';
import {chapters as portfolioChapters} from '../content.js';
import {sectionHTML} from '../panels.js';
import {createCaseAtmosphere} from './case-atmosphere.js';
import {buildCaseChapters} from './case-model.js';
import {createScrollReturnGate} from './scroll-return.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tags=value=>value?`<div class="tech-tags">${value.split(' · ').map(t=>`<span>${esc(t)}</span>`).join('')}</div>`:'';
export function createCaseExplorer(onPause){
 const dialog=document.querySelector('#house-panel');let atmosphere=null,returnFocus=null,observer=null,active=0,sections=[],buttons=[],returnPosition={x:0,y:0},touchStart=null,leaving=false,departure=null;
 const reduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches||document.body.classList.contains('reduced-motion');
 const exitGate=createScrollReturnGate();
 const atEnd=()=>dialog.scrollTop+dialog.clientHeight>=dialog.scrollHeight-3;
 const canReturn=()=>dialog.open&&dialog.classList.contains('case-mode')&&!leaving;
 let absorbWheelUntil=0;
 // Consume the rest of the exit gesture, so its momentum cannot move the gallery.
 window.addEventListener('wheel',e=>{if((leaving||performance.now()<absorbWheelUntil)&&!e.ctrlKey&&!e.metaKey){absorbWheelUntil=performance.now()+180;e.preventDefault();e.stopPropagation();}},{capture:true,passive:false});
 async function leave(){
  if(!dialog.open||leaving)return;
  leaving=true;observer?.disconnect();cancelAnimationFrame(scrollFrame);
  if(dialog.classList.contains('case-mode')&&!reduced()){
   dialog.classList.add('case-leaving');
   const hint=dialog.querySelector('[data-scroll-hint]');if(hint)hint.textContent='BACK TO YOUR JOURNEY';
   // Keep scroll locked and the native top layer alive until the reveal finishes.
   departure=dialog.animate([
    {opacity:1,transform:'perspective(1600px) translateZ(0) translateY(0)',filter:'blur(0px)',clipPath:'inset(0 round 0px)'},
    {opacity:.88,offset:.38,transform:'perspective(1600px) translateZ(-70px) translateY(-8px)',filter:'blur(0px)',clipPath:'inset(1% round 16px)'},
    {opacity:0,transform:'perspective(1600px) translateZ(-300px) translateY(-36px)',filter:'blur(7px)',clipPath:'inset(5% round 28px)'}
   ],{duration:900,easing:'cubic-bezier(.22,.61,.36,1)',fill:'forwards'});
   document.querySelector('main').animate([{filter:'blur(4px)',opacity:.55},{filter:'blur(0px)',opacity:1}],{duration:1000,easing:'ease-out'});
   try{await departure.finished;}catch{/* Native close or teardown can cancel the animation. */}
  }
  if(dialog.open)dialog.close();
 }
 function returnToOrbit(event){event.preventDefault();event.stopPropagation();if(event.type==='wheel')absorbWheelUntil=performance.now()+180;void leave();}
 const cursor=()=>document.querySelector('#cursor');
 function setActive(i){active=Math.max(0,Math.min(i,sections.length-1));buttons.forEach((b,n)=>{if(n===active)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});const count=dialog.querySelector('.case-position');if(count)count.textContent=String(active+1).padStart(2,'0')+' / '+String(sections.length).padStart(2,'0');const prev=dialog.querySelector('.case-prev'),next=dialog.querySelector('.case-next');if(prev)prev.disabled=active===0;if(next){next.disabled=false;next.textContent=active===sections.length-1?'Continue the journey ↓':'Next chapter →';next.setAttribute('aria-label',active===sections.length-1?'Continue the journey':'Next chapter');}}
 function go(i){if(leaving)return;const next=Math.max(0,Math.min(i,sections.length-1));setActive(next);sections[next]?.scrollIntoView({behavior:reduced()?'instant':'smooth',block:'start'});}
 dialog.addEventListener('close',()=>{atmosphere?.dispose();atmosphere=null;observer?.disconnect();cancelAnimationFrame(scrollFrame);departure?.cancel();departure=null;exitGate.reset();touchStart=null;leaving=false;dialog.classList.remove('case-leaving','case-animated');dialog.style.removeProperty('--case-progress');document.querySelector('#app').append(cursor());document.body.classList.remove('immersive-case');returnFocus?.focus({preventScroll:true});onPause(false);window.scrollTo({left:returnPosition.x,top:returnPosition.y,behavior:'instant'});document.querySelector('#scene-status').textContent='Back to your journey, right where you left off.';});
 dialog.addEventListener('cancel',e=>{e.preventDefault();void leave();});
 dialog.addEventListener('click',e=>{if(e.target.closest('[data-close-case],[data-return-case]'))void leave();else if(e.target===dialog&&!dialog.classList.contains('case-mode'))void leave();});
 function updateProgress(){
  const max=dialog.scrollHeight-dialog.clientHeight;
  dialog.style.setProperty('--case-progress',max>0?Math.min(1,dialog.scrollTop/max):1);
  const ending=dialog.querySelector('.case-return');
  const approach=ending?Math.max(0,Math.min(1,(innerHeight-ending.getBoundingClientRect().top)/(innerHeight*.8))):0;
  ending?.style.setProperty('--return-approach',approach);
  const hint=dialog.querySelector('[data-scroll-hint]');
  if(hint)hint.textContent=atEnd()?'KEEP SCROLLING · BACK TO YOUR JOURNEY ↓':approach>.3?'THE STORY CONTINUES BELOW ↓':'SCROLL TO EXPLORE ↓';
 }
 let scrollFrame=0;dialog.addEventListener('scroll',()=>{if(!canReturn())return;cancelAnimationFrame(scrollFrame);scrollFrame=requestAnimationFrame(()=>{const reference=dialog.getBoundingClientRect().top+innerHeight*.43;let index=0;sections.forEach((s,i)=>{if(s.getBoundingClientRect().top<reference)index=i;});setActive(index);updateProgress();});},{passive:true});
 dialog.addEventListener('wheel',e=>{if(!e.ctrlKey&&!e.metaKey&&canReturn()&&exitGate.wheel(e.deltaY,atEnd(),performance.now()))returnToOrbit(e);},{passive:false});
 dialog.addEventListener('touchstart',e=>{touchStart=canReturn()&&e.touches.length===1?{y:e.touches[0].clientY,atEnd:atEnd()}:null;},{passive:true});
 dialog.addEventListener('touchmove',e=>{if(leaving){e.preventDefault();return;}if(touchStart?.atEnd&&canReturn()&&e.touches.length===1&&touchStart.y-e.touches[0].clientY>35){touchStart=null;returnToOrbit(e);}},{passive:false});
 dialog.addEventListener('touchend',()=>{touchStart=null;},{passive:true});
 dialog.addEventListener('touchcancel',()=>{touchStart=null;},{passive:true});
 dialog.addEventListener('keydown',e=>{if(leaving){if(['ArrowDown','ArrowUp','PageDown','PageUp',' ','Home','End'].includes(e.key)){e.preventDefault();e.stopPropagation();}return;}if(!canReturn()||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||e.target.closest('input,select,textarea'))return;if(!e.repeat&&atEnd()&&['ArrowDown','PageDown',' '].includes(e.key)&&!e.target.closest('button,a')){returnToOrbit(e);return;}if(e.key==='ArrowRight'){e.preventDefault();go(active+1);}if(e.key==='ArrowLeft'){e.preventDefault();go(active-1);}});
 return {open(value){if(leaving||dialog.open)return;const content=typeof value==='string'?portfolioChapters.find(c=>c.id===value):value;if(!content)return;atmosphere?.dispose();observer?.disconnect();returnFocus=document.activeElement;returnPosition={x:window.scrollX,y:window.scrollY};exitGate.reset();touchStart=null;const model=buildCaseChapters(content);dialog.classList.toggle('case-mode',!!model);document.body.classList.toggle('immersive-case',!!model);
 if(model){
  dialog.innerHTML=`<header class="case-topbar"><span class="case-brand">IΛ <i>/</i> ${model.kind==='project'?'THE WORK, IN DEPTH':'BEHIND THE EXPERIENCE'}</span><span class="case-position">01 / ${String(model.chapters.length).padStart(2,'0')}</span><button data-close-case class="case-close" aria-label="Close details">Back to orbit <span>×</span></button></header><div class="case-layout"><aside class="case-sidebar"><span class="eyebrow">${model.label}</span><h2 id="panel-title">${esc(model.title)}</h2>${model.role?`<p class="case-role">${esc(model.role)}</p>`:''}<p class="case-date">${esc(model.date)}</p><div class="case-orbit" aria-hidden="true"><span>${model.kind==='project'?'SYSTEM':'EXPERIENCE'}</span><i></i><b></b><em></em></div><nav class="case-chapters" aria-label="Case chapters">${model.chapters.map((c,i)=>`<button data-chapter-step="${i}"><span>${String(i+1).padStart(2,'0')}</span>${esc(c.title)}</button>`).join('')}</nav>${model.url?`<a href="${esc(model.url)}" target="_blank" rel="noopener" class="case-source">Explore the source ${externalArrow}</a>`:''}${model.liveUrl?`<a href="${esc(model.liveUrl)}" target="_blank" rel="noopener" class="case-source">Visit StreamHub ${externalArrow}</a>`:''}</aside><div class="case-story">${model.chapters.map((c,i)=>`<section class="case-chapter" id="case-step-${i}" aria-labelledby="case-title-${i}"><div class="case-chapter-heading"><span class="case-large-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><div><span class="eyebrow">${model.kind==='project'?'INSIDE THE BUILD':'INSIDE THE ROLE'} / ${String(i+1).padStart(2,'0')}</span><h3 id="case-title-${i}">${esc(c.title)}</h3></div></div><div class="case-chapter-copy">${c.paragraphs?.map(p=>`<p>${esc(p)}</p>`).join('')||''}${c.steps?`<ol class="case-flow">${c.steps.map((s,n)=>`<li><span>${String(n+1).padStart(2,'0')}</span><p>${esc(s)}</p></li>`).join('')}</ol>`:''}${c.bullets?`<ul class="case-deliverables">${c.bullets.map(s=>`<li><span aria-hidden="true">${externalArrow}</span><p>${esc(s)}</p></li>`).join('')}</ul>`:''}${tags(i===0?model.tags:c.tags)}</div></section>`).join('')}<section class="case-return" aria-labelledby="case-return-title"><span class="eyebrow">ONE STORY. AN ONGOING JOURNEY.</span><div class="case-return-portal" aria-hidden="true"><i></i><i></i><i></i><span>∞</span></div><h3 id="case-return-title">There's more<br><em>beyond the build.</em></h3><p>Keep scrolling. Back to your journey,<br>right where you left off.</p><button data-return-case>Continue the journey <span aria-hidden="true">↓</span></button></section></div></div><footer class="case-controls"><span data-scroll-hint>SCROLL TO EXPLORE ↓</span><div><button class="case-prev" aria-label="Previous chapter">←</button><button class="case-next" aria-label="Next chapter">Next chapter →</button></div></footer>`;
 }else dialog.innerHTML=`<header class="panel-header"><div><small>${esc(content.subtitle)}</small><h2 id="panel-title">${esc(content.name)}</h2></div><button data-close-case class="close-panel" aria-label="Close details">✕</button></header><div id="panel-content">${sectionHTML(content)}</div>`;
 onPause(true);dialog.append(cursor());dialog.showModal();dialog.scrollTo({top:0,left:0,behavior:'instant'});dialog.querySelector('[data-close-case]').focus({preventScroll:true});
 if(model){atmosphere=createCaseAtmosphere(dialog);sections=[...dialog.querySelectorAll('.case-chapter')];buttons=[...dialog.querySelectorAll('[data-chapter-step]')];buttons.forEach((b,i)=>b.onclick=()=>go(i));dialog.querySelector('.case-prev').onclick=()=>go(active-1);dialog.querySelector('.case-next').onclick=()=>active===sections.length-1?(atEnd()?void leave():dialog.querySelector('.case-return').scrollIntoView({behavior:reduced()?'instant':'smooth',block:'end'})):go(active+1);
  if(!reduced()){
   dialog.classList.add('case-animated');
   observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('case-in-view');observer.unobserve(e.target);}}),{root:dialog,threshold:.08});
   sections.forEach(s=>observer.observe(s));
  }
  setActive(0);updateProgress();}
 },get isOpen(){return dialog.open;}};
}
