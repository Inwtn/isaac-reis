// Displace the original rendered content; no magnified duplicate or overlay.
export function createRefraction(cursor){
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
 svg.setAttribute('aria-hidden','true');svg.style.cssText='position:fixed;width:0;height:0;pointer-events:none';
 const field=document.createElement('canvas');field.width=field.height=128;
 const ctx=field.getContext('2d');if(!ctx)return {update(){},clear(){},dispose(){}};
 const image=ctx.createImageData(128,128);
 for(let y=0;y<128;y++)for(let x=0;x<128;x++){
  const dx=(x-63.5)/63.5,dy=(y-63.5)/63.5,r=Math.hypot(dx,dy);
  const envelope=Math.pow(Math.max(0,1-r*r),2),i=(y*128+x)*4;
  image.data[i]=128+dx*envelope*120;image.data[i+1]=128+dy*envelope*120;
  image.data[i+2]=128;image.data[i+3]=255;
 }
 ctx.putImageData(image,0,0);
 const id='pointer-liquid-displacement';
 svg.innerHTML=`<defs><filter id="${id}" x="-30%" y="-60%" width="160%" height="220%" color-interpolation-filters="sRGB" primitiveUnits="userSpaceOnUse"><feFlood flood-color="rgb(128,128,128)" result="neutral"/><feImage href="${field.toDataURL()}" x="0" y="0" width="160" height="160" result="field"/><feMerge result="map"><feMergeNode in="neutral"/><feMergeNode in="field"/></feMerge><feDisplacementMap in="SourceGraphic" in2="map" scale="38" xChannelSelector="R" yChannelSelector="G"/></filter></defs>`;
 document.body.append(svg);const map=svg.querySelector('feImage');let source=null,previousFilter='';
 function clear(){if(source){source.style.filter=previousFilter;source=null;}}
 return {update(x,y){
  if(!document.body.classList.contains('custom-cursor')||document.body.classList.contains('reduced-motion')||x<0||y<0){clear();return;}
  const hit=document.elementFromPoint(x,y);
  let candidate=hit?.closest('p,h1,h2,h3,h4,a,button,.eyebrow,.experience-title,.case-date,.case-role');
  // Project cards have an invisible clickable cover; find the visible text under it.
  const card=hit?.closest('.monolith');
  if(card)candidate=[...card.querySelectorAll('h3,p,.project-bottom>span')].find(el=>{const r=el.getBoundingClientRect();return x>=r.left-50&&x<=r.right+50&&y>=r.top-50&&y<=r.bottom+50;})||candidate;
  if(!candidate||candidate.closest('#cursor')||!candidate.textContent.trim()){clear();return;}
  if(candidate!==source){clear();source=candidate;previousFilter=source.style.filter;source.style.filter=`url(#${id})`;}
  const rect=source.getBoundingClientRect();
  const sx=rect.width/source.offsetWidth||1,sy=rect.height/source.offsetHeight||1;
  map.setAttribute('x',String((x-rect.left)/sx-80));map.setAttribute('y',String((y-rect.top)/sy-80));
 },clear,dispose(){clear();svg.remove();}};
}
