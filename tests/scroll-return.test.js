import test from 'node:test';
import assert from 'node:assert/strict';
import {createScrollReturnGate} from '../src/horizon/scroll-return.js';

test('reaching the bottom during a trackpad gesture does not close the story',()=>{
 const gate=createScrollReturnGate();
 assert.equal(gate.wheel(100,false,0),false);
 assert.equal(gate.wheel(30,true,40),false);
 assert.equal(gate.wheel(5,true,100),false);
 assert.equal(gate.wheel(1,true,240),false);
 assert.equal(gate.wheel(80,true,500),true);
});

test('a new downward gesture at the end returns, but upward and mid-story gestures do not',()=>{
 const gate=createScrollReturnGate();
 assert.equal(gate.wheel(-100,true,0),false);
 assert.equal(gate.wheel(100,false,300),false);
 assert.equal(gate.wheel(100,true,600),true);
 gate.reset();
 assert.equal(gate.wheel(80,true,650),true);
});
