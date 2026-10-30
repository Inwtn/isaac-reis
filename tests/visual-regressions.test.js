import test from 'node:test';
import assert from 'node:assert/strict';
import {horseFrame,avatarFrame} from '../src/actor-animation.js';
import {houses,trees,signBounds} from '../src/map.js';
test('left-facing horse mirrors the verified right-facing native animation',()=>{for(let f=0;f<17;f++){const left=horseFrame(3,f),right=horseFrame(2,f);assert.equal(left.row,1);assert.equal(left.row,right.row);assert.equal(left.column,right.column);assert.equal(left.flip,true);assert.equal(right.flip,false);assert(left.column>=0&&left.column<=6);}assert.equal(horseFrame(0).row,0);assert.equal(horseFrame(1).row,2);});
test('canopies cannot hide cottage signs, including Contact and Certificates',()=>{for(const h of houses){const b=signBounds(h);for(const t of trees)assert(!(t.x+24>b.x&&t.x-24<b.x+b.w&&t.y>b.y&&t.y-78<b.y+b.h),'Tree hides '+h.sign);}});
test('pixel avatar has a complete walking cycle and reduced-motion still pose',()=>{const frames=new Set(Array.from({length:40},(_,i)=>avatarFrame(i)));assert.equal(frames.size,8);assert.equal(avatarFrame(15,true),0);assert.equal(avatarFrame(40),avatarFrame(0));});
