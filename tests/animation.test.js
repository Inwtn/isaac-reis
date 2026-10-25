import test from 'node:test';
import assert from 'node:assert/strict';
import {createFollower,walkFrame,WALK_FRAMES} from '../src/animation.js';
test('walking animation advances with distance rather than screen refresh rate',()=>{
 const simulate=hz=>{let distance=0;for(let t=0;t<hz;t++)distance+=76/hz;return walkFrame(distance);};
 assert.equal(simulate(60),simulate(120));
 const frames=new Set(Array.from({length:80},(_,i)=>walkFrame(i)));assert.equal(frames.size,WALK_FRAMES);
 assert.equal(walkFrame(123,5,true),0);
});
test('the cat follows the recorded corner instead of cutting across it',()=>{
 const cat={x:0,y:0,dir:0},leader={x:28,y:0},follow=createFollower(cat,leader,28);
 for(let i=0;i<60;i++){leader.x+=1;follow.record();follow.update(1/60,92);}
 for(let i=0;i<60;i++){leader.y+=1;follow.record();follow.update(1/60,92);assert(cat.x>=87.999||cat.y<.001,'cat cut the recorded corner');}
 assert(Math.abs(cat.x-88)<.001);assert(Math.abs(follow.distance-28)<.001);
});
test('follower consumes several short samples without stuttering or overshooting',()=>{
 const cat={x:0,y:0},leader={x:28,y:0},follow=createFollower(cat,leader,28);
 for(let i=0;i<100;i++){leader.x+=.25;follow.record();}
 const distance=follow.update(.1,92);assert(Math.abs(distance-9.2)<1e-8);assert(Math.abs(cat.x-9.2)<1e-8);
});
