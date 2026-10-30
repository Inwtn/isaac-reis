import {chapters} from './content.js';
export const ROOM={w:640,h:400,exit:{x:320,y:354}};
const themes={about:{wall:0,rug:0,title:'A little about me',accent:'#77855e'},projects:{wall:1,rug:1,title:'THE WORKSHOP · PROJECTS & EXPERIENCE',accent:'#688d89'},skills:{wall:2,rug:0,title:'THE TOOL ROOM',accent:'#718951'},certs:{wall:0,rug:1,title:'THE LEARNING GALLERY',accent:'#a77949'},contact:{wall:1,rug:0,title:'THE POST OFFICE',accent:'#7a8d84'}};
export function roomFor(id){
 const c=chapters.find(c=>c.id===id),entries=[];
 if(c.cards)c.cards.forEach(card=>entries.push({title:card.title,short:card.shortTitle||card.title,content:{name:card.title,subtitle:c.subtitle,cards:[card]},kind:id==='projects'?'computer':'frame'}));
 if(c.experience)c.experience.forEach(e=>entries.push({title:e.title.split(' · ')[1]||e.title,short:e.shortTitle||e.title.split(' · ')[1]||e.title,content:{name:e.title,subtitle:'Professional journey',experience:[e]},kind:'career'}));
 if(c.paragraphs)c.paragraphs.forEach((p,i)=>entries.push({title:id==='about'?['Meet Isaac','My journey','What I build'][i]:id==='contact'?'Get in touch':['Education','Languages'][i],content:{name:id==='about'?['Meet Isaac','My journey','What I build'][i]:c.name,subtitle:c.subtitle,paragraphs:[p],...(id==='contact'?{links:c.links}:{})},kind:i%2?'book':'desk'}));
 if(c.skills)entries.push({title:'Development toolkit',content:{name:'Development toolkit',subtitle:c.subtitle,skills:c.skills.slice(0,5),note:c.note},kind:'computer'},{title:'Data, AI & tools',content:{name:'Data, AI & tools',subtitle:c.subtitle,skills:c.skills.slice(5),note:c.note},kind:'desk'});
 const positions=id==='projects'?[[205,158],[435,158],[150,270],[320,270],[490,270]]:[[165,155],[320,155],[475,155],[205,270],[435,270],[320,260]];
 // Decorations have physical bounds as well as visual depth.
 const decor=[{kind:'shelf',x:91,y:159,w:31,h:43},{kind:id==='contact'?'mail':'shelf',x:550,y:159,w:31,h:43},{kind:'plant',x:92,y:321,w:21,h:27},{kind:'plant',x:550,y:321,w:21,h:27}];
 if(id==='about')decor.push({kind:'fireplace',x:548,y:242,w:34,h:75});
 return {id,name:c.name,theme:themes[id],decor,objects:entries.map((e,i)=>({...e,x:positions[i][0],y:positions[i][1],w:64,h:36}))};
}
export function canStandInside(room,x,y){return x>69&&x<571&&y>112&&y<360&&!room.objects.some(o=>x+8>o.x-32&&x-8<o.x+32&&y+3>o.y-20&&y-8<o.y+9)&&!room.decor.some(o=>x+8>o.x-o.w/2&&x-8<o.x+o.w/2&&y+3>o.y-10&&y-8<o.y+4);}
export function nearRoomObject(room,p){return room.objects.filter(o=>Math.hypot(p.x-o.x,p.y-(o.y+24))<37).sort((a,b)=>Math.hypot(p.x-a.x,p.y-a.y-24)-Math.hypot(p.x-b.x,p.y-b.y-24))[0];}
function rect(g,c,x,y,w,h,color){g.fillStyle=color;g.fillRect(x-c.x,y-c.y,w,h);}
function art(g,c,image,sx,sy,sw,sh,x,y,w=sw,h=sh){g.drawImage(image,sx,sy,sw,sh,Math.round(x-c.x),Math.round(y-c.y),w,h);}
export function drawRoom(g,room,camera,time,assets){
 const r=(...a)=>rect(g,camera,...a),draw=(...a)=>art(g,camera,...a);
 r(0,0,640,400,'#29392e');r(53,48,534,323,'#4d3429');r(60,55,520,306,'#926644');
 // Native farmhouse wallpaper, wood floorboards, windows and fireplace.
 for(let y=112;y<352;y+=16)for(let x=64;x<576;x+=16){if(room.id==='projects'||room.id==='contact')draw(assets.walls,32+(Math.floor(x/16)%2)*16,336+(Math.floor(y/16)%2)*16,16,16,x,y);else draw(assets.farmhouse,32+(Math.floor(x/16)%4)*16,64,16,16,x,y);}
 for(let x=64;x<576;x+=16){if(room.id==='projects')draw(assets.walls,176,0,16,48,x,58,16,48);else draw(assets.farmhouse,32,16,16,48,x,58,16,48);}
 for(let x=64;x<576;x+=16){r(x,105,16,7,'#694831');r(x,106,16,2,'#d2ab72');}
 r(60,56,5,302,'#684830');r(575,56,5,302,'#684830');r(61,352,239,7,'#6b482e');r(340,352,238,7,'#6b482e');
 for(const x of [145,475]){draw(assets.farmhouse,48,16,16,32,x-12,61,24,40);r(x-16,99,32,3,'#d8af70');}
 // A framed landscape, a notice board and warm lights sit above the furniture.
 draw(assets.furniture,192,768,32,32,303,65,34,34);
 for(const x of [242,398]){r(x-2,78,4,14,'#84633d');r(x-7,72,14,10,'#edc679');r(x-4,73,8,5,'#ffedb1');g.fillStyle='#ffe4a214';g.beginPath();g.ellipse(x-camera.x,91-camera.y,24,17,0,0,Math.PI*2);g.fill();}
 // Small woven welcome mat, edged aisle rug and visible wooden threshold.
 r(279,306,82,31,'#5e6248');r(282,309,76,25,'#c8bd8c');r(286,312,68,19,room.theme.accent);
 for(let x=287;x<355;x+=6){r(x,307,2,3,'#ead2a0');r(x,334,2,3,'#ead2a0');}
 r(300,350,40,20,'#38291f');r(304,352,32,15,'#bb925e');r(305,353,30,2,'#f5dba1');
 // Differentiated room corners: workshop notes, gallery banner, writing nook.
 if(room.id==='about'||room.id==='contact'){if(room.id==='contact')draw(assets.furniture,128,128,32,32,522,211,32,32);draw(assets.furniture,0,592,32,32,91,215,28,28);r(99,217,13,8,'#eee1b8');}

}
export function roomDrawables(g,room,camera,time,assets){
 const r=(...a)=>rect(g,camera,...a),draw=(...a)=>art(g,camera,...a);
 const decor=room.decor.map(o=>({depth:o.y,draw(){
  if(o.kind==='fireplace'){draw(assets.farmhouse,128,0,32,80,o.x-16,o.y-80);if(Math.sin(time*7)>0)r(o.x-5,o.y-19,3,5,'#f4b95d');}
  else if(o.kind==='shelf')draw(assets.furniture,64,640,32,48,o.x-16,o.y-48,32,48);
  else if(o.kind==='mail'){draw(assets.furniture,0,352,32,32,o.x-16,o.y-32);for(let i=0;i<3;i++){r(o.x-9+i*5,o.y-23+i*4,16,9,'#f2ddb6');r(o.x-7+i*5,o.y-21+i*4,5,1,'#b28c5d');}}
  else draw(assets.furniture,0,672,16,32,o.x-12,o.y-39,24,42);
 }}));
 return [...decor,...room.objects.map(o=>({depth:o.y+10,draw(){
  const x=o.x,y=o.y;r(x-32,y+7,64,7,'#59452b55');
  if(o.kind==='career'){
   draw(assets.furniture,0,352,32,32,x-30,y-35,60,43);
   r(x-18,y-30,35,23,'#463a2f');r(x-16,y-29,31,20,'#f1deb8');r(x-14,y-28,1,18,'#b7996c');r(x,y-28,1,18,'#b7996c');
   for(let i=0;i<3;i++){r(x-11,y-24+i*5,9,1,'#aa865a');r(x+3,y-24+i*5,9,1,'#aa865a');}
   r(x+12,y-31,3,11,'#b97049');
  }else{
   draw(assets.furniture,0,560,32,32,x-32,y-26,64,36);
   if(o.kind==='computer'){
    r(x-25,y-51,50,35,'#343b36');r(x-23,y-49,46,30,'#b9bca8');r(x-21,y-47,42,25,'#294d50');r(x-19,y-45,38,3,'#69948b');
    if(x<320){for(let i=0;i<4;i++){r(x-17,y-38+i*4,7,2,'#7caf9e');r(x-7,y-38+i*4,22,2,i%2?'#d3c187':'#b7d0ab');}}
    else{for(let i=0;i<3;i++){r(x-17,y-38+i*5,31,3,'#adc0a0');r(x+11,y-38+i*5,3,3,['#d0be75','#94bda3','#cb9875'][i]);}}
    r(x-3,y-17,6,4,'#515b51');r(x-11,y-13,22,3,'#828b77');r(x-18,y-8,31,7,'#686d5d');for(let i=0;i<7;i++)r(x-16+i*4,y-6,2,1,'#d8d1b2');r(x+19,y-8,5,7,'#d2ccb2');r(x-28,y-8,5,6,'#eee3c5');r(x-28,y-9,5,2,'#79523b');
    if(Math.sin(time*2)>0)r(x+19,y-19,2,1,'#d3e6aa');
   }else if(o.kind==='frame'){
    r(x-18,y-51,36,35,'#5f432c');r(x-16,y-49,32,31,'#d6ad69');r(x-13,y-46,26,25,'#fbebc7');r(x-9,y-42,18,1,'#a28151');r(x-7,y-38,14,1,'#a28151');r(x-9,y-34,18,1,'#a28151');r(x-3,y-29,6,6,'#b48846');r(x-1,y-28,2,3,'#f5d986');
   }else if(o.kind==='book'){
    for(let i=0;i<4;i++){r(x-21+i*10,y-29,8,18,['#728962','#aa694b','#638c8b','#c7a563'][i]);r(x-19+i*10,y-27,4,1,'#ead9ab');}
   }else{r(x-21,y-25,31,18,'#f5e7c3');for(let i=0;i<3;i++)r(x-17,y-21+i*4,21-i*3,1,'#b99b6d');r(x+16,y-29,3,20,'#5e6757');r(x+9,y-32,18,8,'#efcd87');}
  }

 } }))];
}
