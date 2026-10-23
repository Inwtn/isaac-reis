const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const Core=require('../journey-core.js');const scope={window:{}};vm.runInNewContext(fs.readFileSync('assets/portrait-mesh.js','utf8'),scope);
const points=Core.build(scope.window.PORTFOLIO_PORTRAIT,18000);
assert.equal(points.count,18000);
for(const width of [390,1365]){
 const height=width<700?844:768,layout={w:width,h:height,intro:height,world:height*2,location:height*3,approach:height*4,work:height*5.5,workEnd:height*10.3,outro:height*10.3,contact:height*11.5};
 const keys=Core.timeline(layout);for(let i=1;i<keys.length;i++)assert(keys[i].y>keys[i-1].y,'Ordered scene boundaries');
 const output=new Float32Array((points.count+650)*4);
 for(let stage=0;stage<6;stage++){
  const key=keys.find(k=>k.shape===stage),state=Core.stateAt(key.y,keys);assert(state.from===stage||state.to===stage,'Each form has an explicit stage');
  Core.project(points,state,{width,height,time:1,pointer:{x:-1000,y:-1000,strength:0},frameWidth:width*.8,frameHeight:180},output);
  assert(output.every(Number.isFinite),'All projected coordinates and brightness values are finite');
 }
 const samples=Array.from({length:100},(_,i)=>i*height*.12),forward=samples.map(y=>Core.stateAt(y,keys));
 const reverse=samples.slice().reverse().map(y=>Core.stateAt(y,keys)).reverse();assert.deepEqual(forward,reverse,'Scroll reversal reproduces the same states');
 for(const y of samples){const state=Core.stateAt(y,keys);assert(state.t>=0&&state.t<=1);assert(state.opacity>0&&state.opacity<=1);}
 const frameState={from:5,to:5,t:0,x:0,scale:.31,yaw:0,opacity:.8};
 Core.project(points,frameState,{width,height,time:0,frameWidth:width*.8,frameHeight:180},output);
 let lit=0;for(let i=0;i<points.count*4;i+=4)if(output[i]>=-5&&output[i]<=width+5&&output[i+1]>=0&&output[i+1]<=height)lit++;
 assert(lit>points.count*.99,'The contact frame fits the viewport');
 const state={from:1,to:1,t:0,x:0,scale:.3,yaw:0,opacity:1};
 const a=new Float32Array(output.length),b=new Float32Array(output.length);
 Core.project(points,state,{width,height,time:0,pointer:{x:width/2,y:height/2,strength:0}},a);
 Core.project(points,state,{width,height,time:0,pointer:{x:width/2,y:height/2,strength:1}},b);
 let gain=0;for(let i=2;i<points.count*4;i+=4)gain+=b[i]-a[i];assert(gain>100,'Cursor light increases local particle brightness');
 for(let i=0;i<points.count*4;i+=4){assert.equal(a[i],b[i],'Light does not move the geometry');assert.equal(a[i+1],b[i+1],'Light does not move the geometry');}
 const tunnel={from:4,to:4,t:0,x:0,scale:.39,yaw:0,opacity:.8};
 Core.project(points,tunnel,{width,height,time:0},output);
 let near=0,far=0;for(let i=0;i<points.count*4;i+=4){const radius=Math.hypot(output[i]-width/2,output[i+1]-height/2)/height;if(radius>.5)near++;if(radius>.17&&radius<.23)far++;}
 assert(near>points.count*.02&&far>points.count*.04,'Perspective shows both near and receding turns of the tunnel');
 console.log('PASS '+width+'px: six stages, interpolation, reverse scroll, finite projection, contact frame and reactive light');
}
const html=fs.readFileSync('index.html','utf8'),ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,'Unique IDs');
for(const m of html.matchAll(/href="#([^"]+)"/g))assert(ids.includes(m[1]),'Anchor exists: '+m[1]);
for(const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)){const p=m[1].split('?')[0];if(!/^(https?:|mailto:|data:)/.test(p))assert(fs.existsSync(p),'Local asset exists: '+p);}
assert.equal((html.match(/class="project"/g)||[]).length,3);assert.equal((html.match(/data-case="/g)||[]).length,6);
assert(html.indexOf('src="journey-core.js')<html.indexOf('src="atelier.js'),'Core loads before app');
console.log('PASS assets, anchors, unique IDs, three cases and script order');
