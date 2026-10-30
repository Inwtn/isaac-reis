import {AVATAR} from './actor-animation.js';
import {normalizeAvatar} from './avatar-options.js';
export function createAvatar(value){
 const look=normalizeAvatar(value),canvas=document.createElement('canvas');canvas.width=AVATAR.w*AVATAR.frames;canvas.height=AVATAR.h*4;const g=canvas.getContext('2d');g.imageSmoothingEnabled=false;
 for(let dir=0;dir<4;dir++)for(let frame=0;frame<AVATAR.frames;frame++){g.save();g.translate(frame*AVATAR.w,dir*AVATAR.h);if(dir===3){g.translate(AVATAR.w,0);g.scale(-1,1);}drawPerson(g,dir===3?2:dir,frame,look);g.restore();}return canvas;
}
function shade(hex,factor){const n=parseInt(hex.slice(1),16);return '#'+[n>>16,(n>>8)&255,n&255].map(v=>Math.max(0,Math.min(255,Math.round(v*factor))).toString(16).padStart(2,'0')).join('');}
function drawPerson(g,dir,frame,look){
 const phase=frame?(frame-1)/8*Math.PI*2:0,step=frame?Math.round(Math.sin(phase)*2):0,swing=frame?Math.round(Math.sin(phase)*2):0,bob=frame&&Math.cos(phase*2)>.4?1:0;
 const r=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y+(y<31?bob:0)),w,h);},skin=look.skin,skinShadow=shade(skin,.8),hair=look.hairColor,shirt=look.shirt,pants=look.pants,outline='#24242a',female=look.model==='female';
 g.fillStyle='#53603b';g.fillRect(7,45,19,2);
 if(look.hairStyle==='long'){if(dir===1)r(7,11,19,16,shade(hair,.78));else{r(7,11,3,16,shade(hair,.78));r(24,11,3,16,shade(hair,.78));}r(9,25,4,3,hair);r(21,25,3,3,hair);}
 r(8,31,8,10+step,shade(pants,.8));r(17,31,8,10-step,pants);r(10,33,2,7,shade(pants,1.25));r(18,34,2,5,shade(pants,1.2));
 r(7,40+step,10,4,look.shoes);r(17,40-step,10,4,shade(look.shoes,.92));r(8,44+step,9,1,shade(look.shoes,.7));r(18,44-step,9,1,shade(look.shoes,.7));r(9,41+step,5,1,shade(look.shoes,.83));r(19,41-step,5,1,shade(look.shoes,.8));
 if(female){r(9,22,16,12,outline);r(10,23,14,9,shirt);r(11,26,12,5,shirt);r(10,31,15,2,shirt);r(11,24,2,6,shade(shirt,1.25));r(10,33,15,1,'#f0ece0');}else{r(8,22,18,12,outline);r(9,22,16,10,shirt);r(11,24,2,7,shade(shirt,1.25));r(9,32,16,2,'#f0ece0');}
 const armX=female?6:5,armW=female?4:5;r(armX,23-swing,armW,9,shirt);r(24,23+swing,armW,9,shade(shirt,.9));r(armX,31-swing,armW,3,skinShadow);r(24,31+swing,armW,3,skin);
 r(13,19,7,5,female?shade(skin,.94):skinShadow);r(11,22,5,2,'#fbf4df');r(19,22,4,2,'#fbf4df');r(13,24,3,2,'#e4e2d7');r(18,24,3,2,'#e4e2d7');
 r(9,5,15,15,female?skin:skinShadow);r(8,8,18,10,skin);r(10,4,13,4,skin);r(5,11,3,5,skinShadow);r(25,11,3,5,skin);r(10,19,12,2,female?shade(skin,.97):skinShadow);r(11,9,11,4,shade(skin,1.07));
 if(look.hairStyle!=='bald'){
  r(9,3,14,2,hair);r(7,5,18,3,hair);r(7,7,3,5,hair);r(24,7,2,5,hair);
  if(look.hairStyle==='short'){r(9,2,14,4,hair);r(11,1,10,2,hair);r(9,5,8,3,hair);r(11,3,9,1,shade(hair,1.4));}
  if(look.hairStyle==='curly'){for(const [x,y] of [[7,4],[10,2],[14,1],[18,2],[22,3],[24,5]]){r(x,y,4,4,hair);r(x+1,y,2,1,shade(hair,1.3));}}
  if(look.hairStyle==='long'){r(7,5,3,17,hair);r(24,5,3,17,hair);r(9,3,15,4,hair);}
 }
 if(dir===1){if(look.hairStyle!=='bald'){r(8,6,17,12,hair);r(10,6,12,3,shade(hair,1.2));if(look.hairStyle==='long')r(9,17,15,9,hair);}r(12,19,9,2,skinShadow);return;}
 if(dir===2){if(look.hairStyle!=='bald')r(8,9,5,9,hair);r(25,14,2,2,skin);r(22,12,2,2,outline);if(look.glasses){r(18,11,8,1,outline);r(19,12,6,4,outline);r(20,13,4,2,shade(skin,1.1));r(23,13,1,2,outline);}if(look.beard&&!female){r(21,18,4,1,hair);r(19,19,5,2,hair);}return;}
 r(12,13,2,2,outline);r(21,13,2,2,outline);if(female)r(17,16,1,2,shade(skin,.92));else r(16,15,2,3,skinShadow);
 if(look.glasses){r(8,11,8,1,outline);r(18,11,8,1,outline);r(8,12,1,4,outline);r(15,12,1,4,outline);r(18,12,1,4,outline);r(25,12,1,4,outline);r(9,16,6,1,outline);r(19,16,6,1,outline);r(16,12,2,1,outline);r(10,12,1,1,'#fff0d9');r(20,12,1,1,'#fff0d9');}
 if(female){r(11,19,2,1,skin);r(22,19,2,1,skin);r(11,12,1,1,outline);r(23,12,1,1,outline);}if(female){r(11,17,13,3,skin);r(12,20,10,1,skin);r(16,19,3,1,shade(skin,.85));}else r(15,19,5,1,shade(skin,.7));if(look.beard&&!female){r(13,18,9,1,shade(hair,1.3));r(16,19,4,2,hair);}
}
