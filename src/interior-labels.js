export function createInteriorLabels(frame){
 const layer=document.createElement('div');layer.className='interior-label-layer';layer.setAttribute('aria-hidden','true');frame.append(layer);let current=null,labels=[];
 return {render(room,camera,width,height){layer.hidden=!room;if(!room){current=null;return;}if(current!==room){current=room;layer.replaceChildren();labels=[];const add=(text,x,y,className)=>{const el=document.createElement('div');el.className=className;el.textContent=text;layer.append(el);labels.push({el,x,y});};add(room.theme.title,320,38,'room-heading');for(const o of room.objects)add(o.short||o.title,o.x,o.y+17,'room-object-label');if(room.id==='projects'){add('PROJECTS',320,123,'room-section-label');add('PROFESSIONAL JOURNEY',320,240,'room-section-label');}}
 for(const {el,x,y} of labels){el.style.left=((x-camera.x)/width*100)+'%';el.style.top=((y-camera.y)/height*100)+'%';if(el.classList.contains('room-object-label'))el.style.width=(134/width*100)+'%';}
 }};
}
