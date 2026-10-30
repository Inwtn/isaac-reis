import {FRAME_COUNT,WALK_FRAMES} from './animation.js';
import {createAvatar} from './avatar.js';
import {loadReferenceArt} from './reference-art.js';
export const C={ink:'#443326',grass:'#70b638',light:'#89c84c',deep:'#4d9434',gold:'#f2c868',soil:'#bc803c',sand:'#e8b75e',wood:'#805432',cream:'#f5e3bc',red:'#cf613a',orange:'#e99d39',leaf:'#a7be42',water:'#418fa4'};
function sheet(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function rect(g,x,y,w,h,c){g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)));}
function cat(g,ox,oy,dir,frame){
 const phase=(frame-1)/WALK_FRAMES*Math.PI*2,step=frame?Math.round(Math.sin(phase)*2):0,tail=frame?Math.round(Math.sin(phase-.8)*2):0,bob=frame&&Math.cos(phase*2)>.2?1:0;
 const r=(x,y,w,h,c)=>rect(g,ox+x,oy+y,w,h,c),fur='#eee8d8',white='#fffaf0',shade='#c5bcac',point='#e8cbb1',pink='#dcaba5';
 r(7,25,20,2,'#58633d');
 if(dir===2){
  // Long feathery tail, walking paws and a fluffy cream coat.
  r(1,8+tail,4,11,shade);r(0,5+tail,5,11,fur);r(1,3+tail,4,8,white);r(4,13+tail,4,5,fur);
  r(10+step,20,4,5,shade);r(23-step,20,4,5,shade);r(8-step,22,5,4,white);r(21+step,22,5,4,white);
  r(7,12+bob,20,11,shade);r(7,10+bob,20,11,fur);r(9,9+bob,15,7,white);r(6,15+bob,2,6,white);r(9,19+bob,3,4,white);r(14,20+bob,3,3,white);r(19,17+bob,5,6,white);
  r(20,7+bob,10,12,point);r(21,4+bob,4,6,point);r(27,5+bob,3,5,point);r(22,5+bob,2,3,pink);r(21,10+bob,9,9,white);r(20,16+bob,5,5,white);r(22,20+bob,3,2,white);
  r(26,10+bob,3,3,'#739eb9');r(28,11+bob,1,2,'#344650');r(26,10+bob,1,1,'#fffdf4');r(30,14+bob,2,2,pink);r(27,17+bob,4,1,shade);r(29,16+bob,3,1,white);return;
 }
 r(8+step,21,5,5,shade);r(20-step,21,5,5,white);r(6,12+bob,21,12,shade);r(7,10+bob,19,13,fur);r(8,10+bob,16,9,white);
 r(26,15,4,9,fur);r(28,9+tail,3,10,white);r(27,7+tail,4,5,fur);r(26,6+tail,3,3,white);
 r(6,5+bob,20,15,point);r(6,2+bob,5,7,point);r(21,2+bob,5,7,point);r(7,3+bob,3,4,pink);r(22,3+bob,3,4,pink);
 if(dir===1){r(8,7+bob,16,12,fur);r(10,8+bob,12,5,white);r(8,18+bob,4,3,white);r(13,20+bob,4,3,white);r(21,17+bob,4,3,white);return;}
 r(8,8+bob,16,12,white);r(5,13+bob,4,5,white);r(23,13+bob,4,5,white);r(7,18+bob,5,3,white);r(11,20+bob,4,3,white);r(17,20+bob,4,3,white);r(21,18+bob,4,3,white);
 r(9,10+bob,5,3,'#749fb8');r(19,10+bob,5,3,'#749fb8');r(11,10+bob,2,3,'#344650');r(20,10+bob,2,3,'#344650');r(9,10+bob,1,1,white);r(19,10+bob,1,1,white);
 r(14,14+bob,5,2,pink);r(16,16+bob,1,2,'#9d8278');r(12,18+bob,8,1,shade);r(3,14+bob,6,1,'#d4cec0');r(24,14+bob,6,1,'#d4cec0');r(4,17+bob,5,1,'#d4cec0');r(24,17+bob,5,1,'#d4cec0');
}
export async function createSprites(look){
 const art=await loadReferenceArt();
 const player=createAvatar(look),catSheet=sheet(32*FRAME_COUNT,28*4),trees=sheet(96,80);
 for(let d=0;d<4;d++)for(let f=0;f<FRAME_COUNT;f++){const c=catSheet.getContext('2d');if(d===3){c.save();c.translate(f*32+32,d*28);c.scale(-1,1);cat(c,0,0,2,f);c.restore();}else cat(c,f*32,d*28,d,f);}
 const t=trees.getContext('2d');t.imageSmoothingEnabled=false;t.drawImage(art.spring,0,0,48,80,0,0,48,80);t.drawImage(art.fall,0,0,48,80,48,0,48,80);
 return {player,cat:catSheet,trees,art};
}
