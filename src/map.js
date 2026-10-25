import {chapters} from './content.js';
export const WORLD={w:1120,h:800,tile:16};
export const houses=[
{id:'about',x:184,y:155,w:80,h:112,art:'log',variant:0,sign:'About me'},
{id:'projects',x:486,y:82,w:112,h:128,art:'shed',variant:0,sign:'Projects'},
{id:'skills',x:824,y:219,w:80,h:112,art:'stone',variant:0,sign:'Skills'},
{id:'certs',x:250,y:533,w:80,h:112,art:'stone',variant:2,sign:'Certificates'},
{id:'contact',x:784,y:543,w:80,h:112,art:'log',variant:1,sign:'Contact'}
].map(h=>({...h,label:chapters.find(c=>c.id===h.id).name,door:{x:h.x+h.w/2,y:h.y+h.h+12}}));
export const paths=[[[224,279],[244,337],[344,375],[463,355],[542,284],[542,222]],[[463,355],[568,388],[688,357],[790,389],[864,343]],[[344,375],[300,440],[349,505],[290,657]],[[568,388],[553,471],[628,545],[741,583],[824,667]],[[300,440],[191,466],[158,536]],[[741,583],[931,550],[978,470],[966,390]]];
function segmentDistance(x,y,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy);}
export function isPath(x,y){return paths.some(p=>p.slice(1).some((b,i)=>segmentDistance(x,y,p[i],b)<19));}
export function signBounds(h){const width=h.sign.length*7+18;return {x:h.x+h.w+28-width/2-6,y:h.y+h.h-9,w:width+12,h:26};}
export const trees=[...Array.from({length:20},(_,i)=>({x:30+i*55,y:66+(i%3)*15})),...Array.from({length:14},(_,i)=>({x:22+(i%2)*12,y:110+i*46})),...Array.from({length:14},(_,i)=>({x:1092-(i%2)*12,y:110+i*46})),...[[128,330],[344,232],[672,203],[738,285],[956,294],[438,565],[478,688],[680,707],[918,707],[108,693],[391,725],[597,160],[712,111],[95,196],[175,630],[959,160]].map(([x,y])=>({x,y}))].filter(t=>!houses.some(h=>{const b=signBounds(h);return t.x+24>b.x&&t.x-24<b.x+b.w&&t.y>b.y&&t.y-78<b.y+b.h;}));
export const lake={x:608,y:430,w:130,h:100};
export const horse={x:924,y:421,dir:3};
export const farm={x:92,y:506,cols:4,rows:3,spacing:25};
export const obstacles=[...houses.map(h=>({x:h.x+3,y:h.y+42,w:h.w-6,h:h.h-41})),...trees.map(t=>({x:t.x-6,y:t.y-8,w:12,h:15}))];
export function inLake(x,y,padding=0){return ((x-(lake.x+lake.w/2))/(lake.w/2+padding))**2+((y-(lake.y+lake.h/2))/(lake.h/2+padding))**2<1;}
export function canStand(x,y){return x>18&&x<WORLD.w-18&&y>35&&y<WORLD.h-20&&!inLake(x,y,8)&&!obstacles.some(r=>x+8>r.x&&x-8<r.x+r.w&&y+3>r.y&&y-8<r.y+r.h);}
export function move(entity,dx,dy){if(canStand(entity.x+dx,entity.y))entity.x+=dx;if(canStand(entity.x,entity.y+dy))entity.y+=dy;}
export function nearbyHouse(p){return houses.find(h=>Math.hypot(p.x-h.door.x,p.y-h.door.y)<29);}
