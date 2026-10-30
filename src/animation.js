export const WALK_FRAMES=8;
export const FRAME_COUNT=WALK_FRAMES+1;
export function walkFrame(distance,stepLength=5,reduced=false){return reduced?0:1+Math.floor(distance/stepLength)%WALK_FRAMES;}
export function createFollower(cat,leader,gap=28){
 let points=[],distance=0,last={...leader};
 function reset(){points=[{x:leader.x,y:leader.y}];distance=Math.hypot(leader.x-cat.x,leader.y-cat.y);last={...leader};}
 reset();
 return {reset,record(){const d=Math.hypot(leader.x-last.x,leader.y-last.y);if(d<.01)return;points.push({x:leader.x,y:leader.y});distance+=d;last={...leader};},update(dt,speed=92){
  let budget=Math.min(speed*dt,Math.max(0,distance-gap)),moved=0;
  while(budget>.00001&&points.length){const target=points[0],dx=target.x-cat.x,dy=target.y-cat.y,len=Math.hypot(dx,dy);if(len<.00001){points.shift();continue;}
   const step=Math.min(budget,len);cat.dir=Math.abs(dx)>Math.abs(dy)?dx>0?2:3:dy>0?0:1;cat.x+=dx/len*step;cat.y+=dy/len*step;budget-=step;distance-=step;moved+=step;if(step>=len-.00001)points.shift();
  }return moved;
 },get distance(){return distance;}};
}
