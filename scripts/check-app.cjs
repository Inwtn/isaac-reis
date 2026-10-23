const fs=require('fs'),vm=require('vm'),assert=require('assert');
const Core=require('../journey-core.js');const asset={window:{}};vm.runInNewContext(fs.readFileSync('assets/portrait-mesh.js','utf8'),asset);
function test(mode){
 let scroll=0,scheduled=0,draws=0,fills=0,trailFills=0,clock=0;const frames=new Map(),winEvents={},docEvents={};
 const known=new Set([...fs.readFileSync('index.html','utf8').matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
 const classList={add(){},remove(){},toggle(){}};
 class Element{
  constructor(id){this.id=id;this.style={};this.dataset={};this.events={};this.classList=classList;this.scrollWidth=2450;this.width=0;this.height=0;this.children=[];this.textContent='';}
  addEventListener(name,fn){this.events[name]=fn;}
  setAttribute(name,value){this[name]=value;}
  getBoundingClientRect(){const geometry=sections[this.id]||{top:0,height:160};return {top:geometry.top-scroll,left:0,width:this.id==='contact-copy'?800:1200,height:geometry.height,right:1200,bottom:geometry.top-scroll+geometry.height};}
  getContext(type){return type==='2d'?context2d:mode==='canvas'?null:gl;}
  cloneNode(){return new Element(this.id);}
  replaceWith(){}
  querySelector(selector){if(selector==='.case-close')return closeButton;if(selector==='svg')return worldSvg;if(selector==='.project-visual')return new Element('surface');return null;}
  closest(selector){return this.section||null;}
  matches(){return true;}
  replaceChildren(){this.children=[];}
  appendChild(child){this.children.push(child);}
  showModal(){this.open=true;}
  close(){this.open=false;}
 }
 const sections={top:{top:0,height:800},about:{top:800,height:800},world:{top:1600,height:800},location:{top:2400,height:800},approach:{top:3200,height:1200},work:{top:4400,height:3840},outro:{top:8240,height:960},contact:{top:9200,height:880}};
 const elements={};for(const id of known)elements[id]=new Element(id);
 const context2d=new Proxy({fillRect(x,y,w,h){assert([x,y,w,h].every(Number.isFinite));fills++;},createLinearGradient(){return {addColorStop(){}};},fill(){trailFills++;}},{get:(o,k)=>k in o?o[k]:()=>{},set:(o,k,v)=>{o[k]=v;return true;}});
 const gl=new Proxy({getShaderParameter:()=>mode!=='shader-error',getProgramParameter:()=>true,getAttribLocation:()=>0,getUniformLocation:(_,n)=>n,drawArrays(){draws++;},bufferSubData:(_,offset,data)=>assert(data.every(Number.isFinite))},{get:(o,k)=>k in o?o[k]:()=>({})});
 const world=new Element('particle-world');elements.portrait.parentElement=world;
 const closeButton=new Element('close'),worldType=new Element('world-type'),worldSvg=new Element('world-svg'),locationCaption=new Element('location-caption'),contactCopy=new Element('contact-copy'),track=new Element('track');
 const projects=[new Element('p0'),new Element('p1'),new Element('p2')],copies=['top','about','approach','outro'].map(id=>{let e=new Element('copy-'+id);e.section=elements[id];return e;});
 const selectors={'.gallery-track':track,'.world-type':worldType,'.location-caption':locationCaption,'.contact-copy':contactCopy,'.gallery .section-label':new Element('gallery-label')};
 const doc={hidden:false,documentElement:{classList},getElementById(id){assert(known.has(id),'Existing ID: '+id);return elements[id];},querySelector:s=>selectors[s],querySelectorAll:s=>s==='.project'?projects:copies,addEventListener:(e,fn)=>docEvents[e]=fn,createElement:()=>new Element('anchor')};
 const win={JourneyCore:Core,PORTFOLIO_PORTRAIT:asset.window.PORTFOLIO_PORTRAIT,get scrollY(){return scroll;},addEventListener:(e,fn)=>winEvents[e]=fn,scrollTo(options){scroll=options.top;winEvents.scroll();}};
 const scope={window:win,document:doc,innerWidth:1200,innerHeight:800,devicePixelRatio:1,Float32Array,Math,Date,matchMedia:()=>({matches:true}),getComputedStyle:()=>({paddingLeft:'56px'}),performance:{now:()=>clock},requestAnimationFrame:fn=>{frames.set(++scheduled,fn);return scheduled;},cancelAnimationFrame:id=>frames.delete(id)};
 vm.runInNewContext(fs.readFileSync('atelier.js','utf8'),scope);
 assert.equal(frames.size,1);assert.equal(world.dataset.scene,'portrait');
 function advance(){clock+=40;const [id,fn]=frames.entries().next().value;frames.delete(id);fn(clock);}
 advance();assert(draws>0||fills>10000);
 for(let i=0;i<6;i++){winEvents.pointermove({clientX:120+i*75,clientY:250+i*20,pointerType:'mouse',target:{closest:()=>null}});advance();}
 assert(trailFills>0,'Pointer movement draws a luminous filled trail');
 for(let i=0;i<20;i++)advance();const settledTrailFills=trailFills;
 for(let i=0;i<5;i++)advance();assert.equal(trailFills,settledTrailFills,'The trail expires after the mouse stops');
 scroll=1600;winEvents.scroll();winEvents.resize();assert.equal(world.dataset.scene,'world');
 scroll=2400;winEvents.scroll();winEvents.resize();assert.equal(world.dataset.scene,'brazil');
 scroll=9500;winEvents.scroll();winEvents.resize();assert.equal(world.dataset.scene,'contact');
 scroll=4400;winEvents.scroll();winEvents.resize();const firstTransform=track.style.transform;
 scroll=7440;winEvents.scroll();winEvents.resize();assert.notEqual(track.style.transform,firstTransform,'Horizontal track follows scroll');
 for(const name of ['finance','bank','wallet']){const link={dataset:{case:name}};let prevented=false;docEvents.click({target:{closest:()=>link},preventDefault(){prevented=true;}});assert(prevented);assert(elements['case-dialog'].open);assert(elements['case-title'].textContent);assert(elements['case-links'].children.length);closeButton.events.click();assert(!elements['case-dialog'].open);}
 elements['motion-toggle'].events.click();assert.equal(frames.size,0);assert(elements['motion-toggle'].textContent.includes('Play'));elements['motion-toggle'].events.click();assert.equal(frames.size,1);
 doc.hidden=true;docEvents.visibilitychange();assert.equal(frames.size,0);doc.hidden=false;docEvents.visibilitychange();assert.equal(frames.size,1);
 if(mode==='webgl'){elements.portrait.events.webglcontextlost({preventDefault(){}});assert.equal(world.dataset.renderer,'canvas');assert(fills>10000);}
 console.log('PASS '+mode+': app boots, scenes follow scroll, gallery moves, all three dialogs open/close, pause/resume, hidden tab and context recovery');
}
for(const mode of ['webgl','canvas','shader-error'])test(mode);
