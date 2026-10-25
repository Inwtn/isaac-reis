import './style.css';
import {profile,chapters,ui} from './content.js';
import {WORLD,houses,trees,lake,horse,move,nearbyHouse,isPath,inLake,farm as farmArea} from './map.js';
import {createAvatar} from './avatar.js';
import {readAvatar} from './avatar-options.js';
import {createAvatarEditor} from './avatar-editor.js';
import {createInteriorLabels} from './interior-labels.js';
import {AVATAR,avatarFrame,horseFrame} from './actor-animation.js';
import {C,createSprites} from './sprites.js';
import {createFollower,walkFrame} from './animation.js';
import {createInput} from './input.js';
import {createPanels} from './panels.js';
import {loadGame} from './loading.js';
import {ROOM,roomFor,canStandInside,nearRoomObject,drawRoom,roomDrawables} from './interiors.js';
import {createFarm,readFarm,saveFarm} from './farming.js';
import {createMusic} from './music.js';
const canvas=document.querySelector('#game'),g=canvas.getContext('2d'),reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const player={x:463,y:355,dir:0,frame:0,stride:0},cat={x:435,y:355,dir:0,frame:0,stride:0},camera={x:0,y:0},visited=new Set();
const farm=createFarm(readFarm()),music=createMusic(),interiorLabels=createInteriorLabels(document.querySelector('.game-frame'));
let avatarLook=readAvatar(),beginGame=()=>{};
let sprites,floor,started=false,paused=false,elapsed=0,follower=createFollower(cat,player),acc=0,lastTime=0,room=null,returnDoor=null,mounted=false,transition=null,noticeUntil=0,saveAt=0;
const enter=document.querySelector('#enter-house'),caption=document.querySelector('.map-caption'),panels=createPanels(value=>{paused=value;input.clear();});
const defaultCaption='Explore the cottages · Harvest carrots · Meet Fofão';
function notice(text){caption.textContent=text;noticeUntil=elapsed+4;}
function warp(change){if(transition)return;input.clear();canvas.focus();transition={time:0,changed:false,change};}
function enterHouse(h){if(!h)return;warp(()=>{if(mounted){horse.x=h.door.x+38;horse.y=h.door.y+16;mounted=false;}returnDoor={...h.door};room=roomFor(h.id);player.x=320;player.y=328;player.dir=1;cat.x=296;cat.y=337;follower.reset();visited.add(h.id);document.querySelector('#visited').textContent=visited.size+' / 5 '+ui.houses;notice('Walk to an exhibit and press E to discover it.');});}
function leaveHouse(){warp(()=>{room=null;player.x=returnDoor.x;player.y=returnDoor.y+12;player.dir=0;cat.x=player.x-20;cat.y=player.y+8;follower.reset();notice('Back in the valley. Fofão is right behind you.');});}
function contextAction(){
 if(room){if(Math.hypot(player.x-ROOM.exit.x,player.y-ROOM.exit.y)<32)return {label:'Leave cottage',run:leaveHouse,x:ROOM.exit.x,y:ROOM.exit.y};const o=nearRoomObject(room,player);return o?{label:'Explore '+o.title,run:()=>panels.open(o.content),x:o.x,y:o.y}:null;}
 if(mounted)return {label:'Dismount horse',run:()=>{mounted=false;horse.x=player.x+27;horse.y=player.y;notice('Your horse will wait here.');}};
 const h=nearbyHouse(player);if(h)return {label:'Enter '+h.label,run:()=>enterHouse(h),x:h.door.x,y:h.door.y};
 if(Math.hypot(player.x-horse.x,player.y-horse.y)<42)return {label:'Ride horse',run:()=>{mounted=true;notice('Saddle up! E to dismount · Walk to a cottage on foot.');},x:horse.x,y:horse.y};
 const p=farm.near(player);if(p)return {label:farm.label(p),run:()=>{notice(farm.action(p));saveFarm(farm);music.effect(p.stage==='empty'?660:440,.2);},x:p.x,y:p.y};
 return null;
}
const input=createInput(canvas,e=>{if(!started||paused||transition)return;const a=contextAction();if(e){const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)*canvas.width/r.width+camera.x,y=(e.clientY-r.top)*canvas.height/r.height+camera.y;if(Math.hypot(x-cat.x,y-cat.y+8)<20){notice('Fofão · Your fluffy little explorer ♡');music.effect(620,.2);return;}if(a&&(!Number.isFinite(a.x)||Math.hypot(x-a.x,y-a.y)<65))a.run();}else a?.run();});
const avatarEditor=createAvatarEditor((look,first)=>{avatarLook=look;sprites.player=createAvatar(look);paused=false;input.clear();if(first)beginGame();else canvas.focus();},value=>{paused=value;input.clear();});
document.querySelector('#character').onclick=()=>{if(started&&!transition&&!panels.isOpen)avatarEditor.open(avatarLook);};
enter.onclick=()=>{if(!transition&&!paused)contextAction()?.run();};
document.querySelectorAll('[data-house]').forEach(b=>b.onclick=()=>{if(started&&!paused&&!transition)enterHouse(houses.find(h=>h.id===b.dataset.house));});
document.querySelector('#help').onclick=e=>{const p=document.querySelector('#help-panel');p.hidden=!p.hidden;e.currentTarget.setAttribute('aria-expanded',String(!p.hidden));};
async function setSound(on){try{await music.set(on);const b=document.querySelector('#sound');b.textContent=on?'Music: on':'Music: off';b.setAttribute('aria-pressed',String(on));b.setAttribute('aria-label',on?'Mute farm music':'Play farm music');}catch{document.querySelector('#sound').textContent=ui.soundUnavailable;}}
document.querySelector('#sound').onclick=()=>setSound(!music.enabled);
document.addEventListener('visibilitychange',()=>{input.clear();if(music.context){if(document.hidden)music.context.suspend();else if(music.enabled)music.context.resume();}});
window.addEventListener('pagehide',()=>saveFarm(farm));
function rnd(x,y){let n=(x*374761393+y*668265263)>>>0;n=(n^(n>>>13))*1274126177;return ((n^(n>>>16))>>>0)/4294967295;}
function r(ctx,x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h);}
function createFloor(){
 const c=document.createElement('canvas');c.width=WORLD.w;c.height=WORLD.h;const f=c.getContext('2d'),terrain=sprites.art.outdoors;f.imageSmoothingEnabled=false;
 for(let y=0;y<WORLD.h;y+=16)for(let x=0;x<WORLD.w;x+=16){f.drawImage(terrain,0,112,16,16,x,y,16,16);}
 // Small terrain steps retain the texture while the path itself meanders naturally.
 for(let y=0;y<WORLD.h;y+=8)for(let x=0;x<WORLD.w;x+=8)if(isPath(x+4,y+4)){r(f,x,y,8,8,'#d8ad61');if(rnd(x,y)>.73)r(f,x+2,y+3,3,1,'#eac67e');if(rnd(y,x)>.8)r(f,x+5,y+6,2,1,'#bc904b');}
 // Rounded, terraced shoreline, shallow water and a small timber jetty.
 for(let y=lake.y-8;y<lake.y+lake.h+8;y+=4)for(let x=lake.x-8;x<lake.x+lake.w+8;x+=4){if(inLake(x,y,7))r(f,x,y,4,4,'#c2b077');if(inLake(x,y))r(f,x,y,4,4,'#63b9ba');if(inLake(x,y,-10))r(f,x,y,4,4,'#389eb5');}
 for(let i=0;i<6;i++){r(f,727,470+i*6,35,5,'#b78b57');r(f,727,474+i*6,35,1,'#725136');}r(f,758,470,3,36,'#e0b874');
 for(let i=0;i<300;i++){const x=45+Math.floor(rnd(i,89)*(WORLD.w-90)),y=90+Math.floor(rnd(i,13)*(WORLD.h-130));if(isPath(x,y)||inLake(x,y,12)||houses.some(h=>x>h.x-12&&x<h.x+h.w+12&&y>h.y-8&&y<h.y+h.h+32)||x<205&&y>480&&y<590)continue;r(f,x,y,1,5,'#596d3c');r(f,x-2,y-2,5,3,['#dfbd62','#edb57c','#f5e4ad','#b4c968'][i%4]);r(f,x,y-1,1,1,'#f5df9e');}
 for(let i=0;i<80;i++){const x=55+Math.floor(rnd(i,3)*(WORLD.w-110)),y=90+Math.floor(rnd(i,8)*(WORLD.h-130));if(!inLake(x,y))r(f,x,y,3,1,i%2?'#bc8750':'#cda05a');}
 // Farm border leaves the field open from every side.
 for(let x=78;x<213;x+=18){r(f,x,478,4,17,'#735332');r(f,x,477,4,3,'#dfb678');r(f,x,482,18,3,'#bc935b');}
 for(let x=60;x<WORLD.w-60;x+=18){r(f,x,WORLD.h-45,4,17,'#735332');r(f,x,WORLD.h-46,4,3,'#c8a269');r(f,x,WORLD.h-40,18,3,'#b38a54');}
 return c;
}
function sign(text,x,y){g.font='11px "Pixelify Sans",monospace';const w=Math.max(58,Math.ceil(g.measureText(text).width)+14);r(g,x-camera.x-2,y-camera.y,4,25,'#69452c');r(g,x-camera.x-w/2-2,y-camera.y-10,w+4,20,'#4d3526');r(g,x-camera.x-w/2,y-camera.y-9,w,17,'#f7dd9e');r(g,x-camera.x-w/2+2,y-camera.y-7,w-4,1,'#fff0c2');g.textAlign='center';g.fillStyle='#34271d';g.fillText(text,Math.round(x-camera.x),Math.round(y-camera.y+3));}
function house(h){const x=Math.round(h.x-camera.x),y=Math.round(h.y-camera.y),art=sprites.art[h.art],cw=h.art==='shed'?112:80;r(g,x+3,y+h.h-6,h.w,9,'#456e28');g.drawImage(art,h.variant*cw,0,cw,art.height,x,y,h.w,h.h);r(g,h.door.x-camera.x-12,y+h.h+4,25,10,'#b78a55');sign(h.sign,h.x+h.w+28,h.y+h.h+7);}
function tree(t,i){g.drawImage(sprites.trees,i%3?0:48,0,48,80,Math.round(t.x-camera.x-24),Math.round(t.y-camera.y-78),48,80);}
function drawHorse(x,y,dir,frame=0){const pose=horseFrame(dir,frame);g.save();g.translate(Math.round(x-camera.x),Math.round(y-camera.y));if(pose.flip)g.scale(-1,1);g.drawImage(sprites.art.horse,pose.column*32,pose.row*32,32,32,-24,-46,48,48);g.restore();}
function drawPlayer(){
 const x=Math.round(player.x-camera.x),y=Math.round(player.y-camera.y),sw=AVATAR.w,sh=AVATAR.h;g.imageSmoothingEnabled=false;
 if(mounted){
  drawHorse(player.x,player.y,player.dir,player.frame);
  const side=player.dir===2||player.dir===3,forward=player.dir===3?-1:1;
  const leg=(offset)=>{r(g,x+offset-3,y-25,7,7,avatarLook.pants);r(g,x+offset+(side?forward*4:0)-2,y-19,5,10,avatarLook.pants);r(g,x+offset+(side?forward*4:0)-4,y-10,9,4,avatarLook.shoes);};
  leg(side?-3:-7);g.drawImage(sprites.player,player.frame*sw,player.dir*sh,sw,34,x-16,y-58,32,34);leg(side?2:7);
 }else g.drawImage(sprites.player,player.frame*sw,player.dir*sh,sw,sh,x-16,y-45,32,48);
}
function drawCrops(){for(const p of farm.plots){const x=p.x-camera.x,y=p.y-camera.y;r(g,x-10,y-7,21,17,p.stage==='watered'?'#765237':'#956437');r(g,x-8,y-4,17,1,'#be925b');r(g,x-8,y+3,17,1,'#6d4a2e');if(p.stage==='seed'){r(g,x-2,y-2,3,2,'#e3bd7f');}if(p.stage==='watered'||p.stage==='ripe'){const h=p.stage==='ripe'?12:5+Math.floor(p.growth/8);r(g,x-1,y-h,3,h,'#487535');r(g,x-7,y-h+2,6,3,'#7fae45');r(g,x+2,y-h,5,3,'#9abe4f');if(p.stage==='ripe'){r(g,x-3,y-3,7,7,'#ed9943');r(g,x-1,y+4,3,3,'#e47836');r(g,x-2,y-2,2,5,'#ffd17a');if(!reduce&&Math.sin(elapsed*3+p.x)>0){r(g,x+8,y-15,1,5,'#fff0b5');r(g,x+6,y-13,5,1,'#fff0b5');}}}}sign('Carrot patch',142,454);}
function update(dt){
 if(!started)return;elapsed+=dt;if(farm.update(dt))saveFarm(farm);if(elapsed>saveAt){saveFarm(farm);saveAt=elapsed+5;}
 document.querySelector('#coins').textContent=farm.coins+' coins';
 if(transition){transition.time+=dt;if(transition.time>=.22&&!transition.changed){transition.changed=true;transition.change();}if(transition.time>=.5)transition=null;return;}
 if(paused)return;const d=input.read(),ox=player.x,oy=player.y,speed=mounted?145:83;
 if(room){if(canStandInside(room,player.x+d.x*speed*dt,player.y))player.x+=d.x*speed*dt;if(canStandInside(room,player.x,player.y+d.y*speed*dt))player.y+=d.y*speed*dt;}else move(player,d.x*speed*dt,d.y*speed*dt);
 const distance=Math.hypot(player.x-ox,player.y-oy);if(distance>.001){player.dir=Math.abs(d.x)>Math.abs(d.y)?d.x>0?2:3:d.y>0?0:1;player.stride+=distance;player.frame=avatarFrame(player.stride,reduce);follower.record();}else player.frame=0;
 if(mounted){horse.x=player.x;horse.y=player.y;horse.dir=player.dir;}
 const cd=follower.update(dt,mounted?170:105);cat.stride+=cd;cat.frame=cd>.001?walkFrame(cat.stride,4,reduce):0;
 const a=contextAction();enter.hidden=!a;if(a)enter.textContent='E · '+a.label;
 if(noticeUntil&&elapsed>noticeUntil){noticeUntil=0;caption.textContent=room?'Walk to an exhibit · E to inspect · Door to leave':defaultCaption;}
}
function render(){
 if(!sprites||!floor)return;g.imageSmoothingEnabled=false;const world=room?ROOM:WORLD;camera.x=Math.max(0,Math.min(world.w-canvas.width,Math.round(player.x-canvas.width/2)));camera.y=Math.max(0,Math.min(world.h-canvas.height,Math.round(player.y-canvas.height/2)));g.clearRect(0,0,canvas.width,canvas.height);interiorLabels.render(room,camera,canvas.width,canvas.height);
 if(room)drawRoom(g,room,camera,elapsed,sprites.art);else{g.drawImage(floor,camera.x,camera.y,canvas.width,canvas.height,0,0,canvas.width,canvas.height);drawCrops();}
 const a=contextAction();if(a&&Number.isFinite(a.x)){g.fillStyle='rgba(255,239,174,'+(reduce?.25:.2+Math.sin(elapsed*4)*.1)+')';g.beginPath();g.ellipse(a.x-camera.x,a.y-camera.y+4,17,7,0,0,Math.PI*2);g.fill();}
 const objects=room?roomDrawables(g,room,camera,elapsed,sprites.art):[...houses.map(h=>({depth:h.y+h.h,draw:()=>house(h)})),...trees.map((t,i)=>({depth:t.y,draw:()=>tree(t,i)})),...(!mounted?[{depth:horse.y,draw:()=>drawHorse(horse.x,horse.y,horse.dir)}]:[])];
 objects.push({depth:player.y,draw:drawPlayer}, {depth:cat.y,draw:()=>{g.drawImage(sprites.cat,cat.frame*32,cat.dir*28,32,28,Math.round(cat.x-camera.x-16),Math.round(cat.y-camera.y-26),32,28);}});
 objects.sort((a,b)=>a.depth-b.depth).forEach(o=>o.draw());
 if(!room){sign('Horse meadow',955,370);if(!reduce){for(let i=0;i<7;i++){const x=lake.x+25+(i*17)%75,y=lake.y+20+(i*23)%55;r(g,x-camera.x+Math.floor(Math.sin(elapsed+i)*2),y-camera.y,5,1,'#b1d8c3');}for(let i=0;i<16;i++){const x=(i*89+elapsed*(7+i%3))%WORLD.w,y=(i*67+elapsed*12)%WORLD.h;r(g,x-camera.x,y-camera.y,3,1,i%2?'#dda45a':'#c18548');}}}
 if(transition){g.fillStyle='rgba(35,32,24,'+Math.min(1,transition.time<.22?transition.time/.22:1-(transition.time-.22)/.28)+')';g.fillRect(0,0,canvas.width,canvas.height);}
 const minutes=9*60+Math.floor(elapsed/4);document.querySelector('#clock').textContent=String(Math.floor(minutes/60)%24).padStart(2,'0')+':'+String(minutes%60).padStart(2,'0');
}
function frame(now){const delta=Math.min((now-lastTime)/1000||0,.1);lastTime=now;acc+=delta;while(acc>=1/60){update(1/60);acc-=1/60;}render();requestAnimationFrame(frame);}
function resize(){canvas.width=innerWidth<700?480:640;canvas.height=innerWidth<700?360:400;g.imageSmoothingEnabled=false;}window.addEventListener('resize',resize);resize();
async function boot(){try{await loadGame([async()=>{await Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,2500))]);},async()=>{sprites=await createSprites(avatarLook);const mini=document.createElement('span');mini.className='cat-walk';mini.style.backgroundImage='url('+sprites.cat.toDataURL()+')';document.querySelector('.loading-cat').replaceChildren(mini);},async()=>{floor=createFloor();render();},async()=>{if(chapters.length!==5||!profile.name)throw new Error('Portfolio content is incomplete');}]);const start=()=>{if(started)return;started=true;document.querySelector('#loading').classList.add('dismissed');document.querySelector('.game-shell').inert=false;canvas.focus();input.clear();setSound(true);notice('Welcome, '+avatarLook.name+'! Explore, ride or grow carrots.');};beginGame=start;const edit=()=>{window.removeEventListener('keydown',anyKey);avatarEditor.open(avatarLook,true);};const anyKey=e=>{if(e.key==='Tab'||e.key==='Shift'||e.ctrlKey||e.metaKey||e.target.closest('a'))return;e.preventDefault();edit();};document.querySelector('#start-button').onclick=edit;window.addEventListener('keydown',anyKey);requestAnimationFrame(frame);}catch(e){console.error('Valley loading failed',e);}}boot();
