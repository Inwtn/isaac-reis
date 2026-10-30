export function horseFrame(direction,frame=0){return {row:direction===1?2:direction===0?0:1,column:frame?1+(frame-1)%6:0,flip:direction===3};}
export const AVATAR={w:32,h:48,scale:1,frames:9};
export function avatarFrame(distance,reduced=false){return reduced?0:1+Math.floor(distance/5)%8;}
