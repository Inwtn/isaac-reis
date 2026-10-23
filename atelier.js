(function(){
  'use strict';
  var Core=window.JourneyCore,canvas=document.getElementById('portrait');
  if(!Core||!canvas||!window.PORTFOLIO_PORTRAIT)return;
  document.documentElement.classList.add('js');
  var world=canvas.parentElement,gl=null,ctx=null,program,buffer,locations={},points,output;
  var width=innerWidth,height=innerHeight,dpr=1,layout,keys,frame=0,last=0,time=0,playing=true;
  var scroll=window.scrollY,targetScroll=scroll,previousScroll=scroll,velocity=0,galleryProgress=0;
  var pointer={x:-1000,y:-1000,strength:0},mouse={x:-1000,y:-1000,present:false};
  var fine=matchMedia('(pointer: fine)').matches,trailCanvas=document.getElementById('cursor-trail'),trailCtx=trailCanvas.getContext('2d'),cursor=document.getElementById('custom-cursor'),trail=[];
  var motionButton=document.getElementById('motion-toggle'),track=document.querySelector('.gallery-track'),projects=Array.prototype.slice.call(document.querySelectorAll('.project'));
  var wave=document.getElementById('wave-displacement'),worldType=document.querySelector('.world-type'),locationCaption=document.querySelector('.location-caption');
  var contactCopy=document.querySelector('.contact-copy'),dialog=document.getElementById('case-dialog'),sceneStatus=document.getElementById('scene-status'),lastScene=-1;
  var copies=Array.prototype.slice.call(document.querySelectorAll('.scene-copy,.identity'));
  var caseData={
    finance:{title:'Finance Sync API',category:'Integration / Java & Spring Boot',image:'assets/studies/finance.svg',description:'A REST API that receives financial transactions and posts them to Google Sheets automatically.',problem:'Manual entries slow down reporting and introduce avoidable errors.',solution:'Validate each transaction and connect financial events to a management spreadsheet through an API.',stack:'Java 17 · Spring Boot · Google Sheets API · Maven',links:[['View repository','https://github.com/Inwtn/API-Finance-Sync']]},
    bank:{title:'Bank Reconciliation',category:'Automation / Financial operations',image:'assets/studies/bank.svg',description:'An engine that cross-references OFX and CSV bank statements with financial records.',problem:'Matching statements by hand takes time and makes discrepancies harder to track.',solution:'Use configurable matching rules, import history and a dashboard to classify matched, divergent and pending transactions.',stack:'Java · Spring Boot · OFX / CSV · REST API',links:[['View repository','https://github.com/Inwtn/bank-reconciliation']]},
    wallet:{title:'Save Wallet',category:'Web application / Personal finance',image:'assets/studies/wallet.svg',description:'A personal finance web application with Supabase authentication and PostgreSQL persistence.',problem:'Spending and recurring costs are difficult to see together when records are scattered.',solution:'Bring monthly planning into one application with authenticated, user-scoped data access.',stack:'JavaScript · Supabase · PostgreSQL · Vercel',links:[['Visit application','https://save-wallet-nine.vercel.app/'],['View repository','https://github.com/Inwtn/Save-Wallet']]}
  };
  var vertex='attribute vec2 position;attribute float brightness;attribute float size;uniform vec2 resolution;uniform float density;varying float alpha;void main(){vec2 p=position/resolution*2.-1.;gl_Position=vec4(p.x,-p.y,0.,1.);gl_PointSize=max(1.,size*density);alpha=brightness;}';
  var fragment='precision mediump float;varying float alpha;void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;gl_FragColor=vec4(.94,.95,.97,alpha*pow(1.-r,.42));}';
  function fallback(){
    if(gl){var replacement=canvas.cloneNode(false);canvas.replaceWith(replacement);canvas=replacement;}
    gl=null;ctx=canvas.getContext('2d');world.dataset.renderer=ctx?'canvas':'unavailable';
  }
  function shader(type,source){var s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){gl.deleteShader(s);return null;}return s;}
  try{gl=canvas.getContext('webgl',{alpha:true,antialias:false,powerPreference:'low-power',premultipliedAlpha:false});}catch(error){gl=null;}
  if(gl){
    var vs=shader(gl.VERTEX_SHADER,vertex),fs=shader(gl.FRAGMENT_SHADER,fragment);
    if(vs&&fs){program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);if(!gl.getProgramParameter(program,gl.LINK_STATUS))fallback();}else fallback();
  }else fallback();
  points=Core.build(window.PORTFOLIO_PORTRAIT,width<700?11000:gl?22000:15000);
  output=new Float32Array((points.count+points.stars.length/4)*4);
  if(gl){
    gl.useProgram(program);buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,output,gl.DYNAMIC_DRAW);
    [['position',2,0],['brightness',1,8],['size',1,12]].forEach(function(a){var loc=gl.getAttribLocation(program,a[0]);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,a[1],gl.FLOAT,false,16,a[2]);});
    locations.resolution=gl.getUniformLocation(program,'resolution');locations.density=gl.getUniformLocation(program,'density');gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.clearColor(0,0,0,0);world.dataset.renderer='webgl';
  }
  function top(id){return document.getElementById(id).getBoundingClientRect().top+window.scrollY;}
  function measure(){
    width=innerWidth;height=innerHeight;dpr=Math.min(devicePixelRatio||1,1.5);
    var work=document.getElementById('work'),contactRect=contactCopy.getBoundingClientRect();
    layout={w:width,h:height,intro:top('about'),world:top('world'),location:top('location'),approach:top('approach'),work:top('work'),workEnd:top('work')+work.getBoundingClientRect().height,outro:top('outro'),contact:top('contact'),frameWidth:Math.min(width-30,contactRect.width+(width<700?30:90)),frameHeight:contactRect.height+65};
    keys=Core.timeline(layout);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    if(gl)gl.viewport(0,0,canvas.width,canvas.height);else if(ctx)ctx.setTransform(dpr,0,0,dpr,0,0);
    trailCanvas.width=Math.round(width*dpr);trailCanvas.height=Math.round(height*dpr);if(trailCtx)trailCtx.setTransform(dpr,0,0,dpr,0,0);
    layout.gutter=parseFloat(getComputedStyle(document.querySelector('.gallery .section-label')).paddingLeft)||22;
    layout.galleryDistance=Math.max(0,track.scrollWidth-width+layout.gutter*2);
  }
  function drawParticles(state){
    Core.project(points,state,{width:width,height:height,time:time,pointer:pointer,frameWidth:layout.frameWidth,frameHeight:layout.frameHeight},output);
    if(gl){gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform2f(locations.resolution,width,height);gl.uniform1f(locations.density,dpr);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferSubData(gl.ARRAY_BUFFER,0,output);gl.drawArrays(gl.POINTS,0,output.length/4);}
    else if(ctx){ctx.clearRect(0,0,width,height);ctx.fillStyle='#ececf0';for(var i=0;i<output.length;i+=4){var x=output[i],y=output[i+1];if(x<-3||x>width+3||y<-3||y>height+3)continue;ctx.globalAlpha=output[i+2]*.75;var size=Math.max(.65,output[i+3]);ctx.fillRect(x,y,size,size);}ctx.globalAlpha=1;}
  }
  function drawCursor(){
    if(!fine||!trailCtx||!playing||!mouse.present){if(trailCtx)trailCtx.clearRect(0,0,width,height);return;}
    cursor.style.transform='translate3d('+pointer.x+'px,'+pointer.y+'px,0)';
    var now=performance.now(),latest=trail[trail.length-1];
    if(!latest||Math.hypot(pointer.x-latest.x,pointer.y-latest.y)>1.5)trail.push({x:pointer.x,y:pointer.y,born:now});
    while(trail.length&&now-trail[0].born>150)trail.shift();
    trailCtx.clearRect(0,0,width,height);if(trail.length<3)return;
    var left=[],right=[];
    for(var i=0;i<trail.length;i++){
      var point=trail[i],before=trail[Math.max(0,i-1)],after=trail[Math.min(trail.length-1,i+1)];
      var dx=after.x-before.x,dy=after.y-before.y,length=Math.hypot(dx,dy)||1,half=(.75+3.75*(1-(now-point.born)/150));
      left.push({x:point.x-dy/length*half,y:point.y+dx/length*half});right.push({x:point.x+dy/length*half,y:point.y-dx/length*half});
    }
    var first=trail[0],end=trail[trail.length-1],gradient=trailCtx.createLinearGradient(first.x,first.y,end.x,end.y);
    gradient.addColorStop(0,'rgba(240,242,240,0)');gradient.addColorStop(1,'rgba(240,242,240,.85)');
    trailCtx.beginPath();trailCtx.moveTo(left[0].x,left[0].y);
    for(i=1;i<left.length;i++)trailCtx.lineTo(left[i].x,left[i].y);
    for(i=right.length-1;i>=0;i--)trailCtx.lineTo(right[i].x,right[i].y);
    trailCtx.closePath();trailCtx.fillStyle=gradient;trailCtx.shadowColor='#f0f2f0';trailCtx.shadowBlur=10;trailCtx.fill();trailCtx.shadowBlur=0;
  }
  function render(delta,snap){
    if(!layout)return;
    if(playing)time+=Math.min(delta,60)*.001;
    scroll=snap||!playing?targetScroll:Core.mix(scroll,targetScroll,.16);
    velocity=Core.mix(velocity,Core.clamp((targetScroll-previousScroll)/height,-1,1),.12);previousScroll=targetScroll;
    if(playing){var follow=1-Math.pow(.72,Math.max(1,delta)/(1000/60));pointer.x=Core.mix(pointer.x,mouse.x,follow);pointer.y=Core.mix(pointer.y,mouse.y,follow);pointer.strength=Core.mix(pointer.strength,mouse.present?1:0,.14);}else pointer.strength=0;
    var state=Core.stateAt(scroll,keys);drawParticles(state);drawCursor();
    var phase=Core.clamp((targetScroll-layout.work)/Math.max(1,layout.workEnd-layout.work-height),0,1);
    galleryProgress=snap||!playing?phase:Core.mix(galleryProgress,phase,.14);
    track.style.transform='translate3d('+(layout.gutter-galleryProgress*layout.galleryDistance)+'px,0,0)';
    var deformation=playing?4+Math.min(36,Math.abs(velocity)*320)+Math.sin(time*.7)*2:0;wave.setAttribute('scale',deformation.toFixed(2));
    projects.forEach(function(project,index){var surface=project.querySelector('.project-visual');surface.style.transform='rotateY('+Core.clamp(velocity*70,-8,8)+'deg) rotateZ('+(playing?Math.sin(time*.55+index)*.45:0)+'deg)';});
    document.getElementById('gallery-count').textContent=String(Math.min(3,Math.floor(galleryProgress*3)+1)).padStart(2,'0')+' / 03';
    if(playing)worldType.querySelector('svg').style.transform='rotate('+(time*2.5)+'deg)';
    var sphereWeight=(state.from===1?1-state.t:0)+(state.to===1?state.t:0),brazilWeight=(state.from===2?1-state.t:0)+(state.to===2?state.t:0);
    worldType.style.opacity=Core.clamp(sphereWeight*1.4,0,1);locationCaption.style.opacity=Core.clamp(brazilWeight*1.5,0,1);
    copies.forEach(function(copy){var section=copy.closest('section'),bounds=section.getBoundingClientRect(),sectionProgress=-bounds.top/height;var opacity=Core.clamp(Math.min((1+sectionProgress)*2.5,(bounds.height/height-sectionProgress)*2.5),0,1);copy.style.opacity=opacity;copy.style.transform='translateY('+(Core.clamp(sectionProgress,-1,1)*-12)+'px)';});
    var scene=state.t<.5?state.from:state.to;if(scene!==lastScene){lastScene=scene;world.dataset.scene=['portrait','world','brazil','helix','tunnel','contact'][scene];sceneStatus.textContent=['Isaac Reis, Software Engineer','Working worldwide','Based in Brazil','Connecting experience and engineering','Exploring what comes next','Get in touch'][scene];}
  }
  function loop(stamp){frame=0;if(document.hidden||!playing)return;render(stamp-last,false);last=stamp;frame=requestAnimationFrame(loop);}
  function start(){if(!frame&&!document.hidden&&playing){last=performance.now();frame=requestAnimationFrame(loop);}}
  function setCursorActive(active){document.documentElement.classList.toggle('cursor-active',active&&fine&&playing&&!dialog.open);}
  window.addEventListener('pointermove',function(event){if(event.pointerType==='touch'||!fine)return;if(!mouse.present){pointer.x=event.clientX;pointer.y=event.clientY;}mouse.x=event.clientX;mouse.y=event.clientY;mouse.present=true;setCursorActive(true);cursor.classList.toggle('is-link',!!event.target.closest('a,button,summary,[role="button"],[data-cursor]'));},{passive:true});
  window.addEventListener('pointerout',function(event){if(!event.relatedTarget){mouse.present=false;setCursorActive(false);trail.length=0;}});
  window.addEventListener('blur',function(){mouse.present=false;setCursorActive(false);});
  document.addEventListener('keydown',function(event){if(event.key==='Tab')setCursorActive(false);});
  window.addEventListener('scroll',function(){targetScroll=window.scrollY;if(!playing)render(0,true);},{passive:true});
  window.addEventListener('resize',function(){measure();targetScroll=window.scrollY;render(0,true);},{passive:true});
  document.addEventListener('visibilitychange',function(){if(document.hidden){cancelAnimationFrame(frame);frame=0;}else start();});
  motionButton.addEventListener('click',function(){playing=!playing;cancelAnimationFrame(frame);frame=0;motionButton.textContent=playing?'Pause motion Ⅱ':'Play motion ▷';motionButton.setAttribute('aria-pressed',String(playing));motionButton.setAttribute('aria-label',playing?'Pause animations':'Resume animations');setCursorActive(playing&&mouse.present);trail.length=0;render(0,true);start();});
  canvas.addEventListener('webglcontextlost',function(event){event.preventDefault();fallback();measure();render(0,true);start();});
  function openCase(name){
    var data=caseData[name];if(!data||typeof dialog.showModal!=='function')return false;
    document.getElementById('case-category').textContent=data.category;document.getElementById('case-title').textContent=data.title;var image=document.getElementById('case-image');image.src=data.image;image.alt='Visual study for '+data.title;
    ['description','problem','solution','stack'].forEach(function(field){document.getElementById('case-'+field).textContent=data[field];});
    var links=document.getElementById('case-links');links.replaceChildren();data.links.forEach(function(link){var a=document.createElement('a');a.textContent=link[0]+' ↗';a.href=link[1];a.target='_blank';a.rel='noopener noreferrer';links.appendChild(a);});dialog.showModal();setCursorActive(false);dialog.scrollTop=0;return true;
  }
  document.addEventListener('click',function(event){var link=event.target.closest('a[data-case]');if(link&&!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&!event.altKey&&openCase(link.dataset.case))event.preventDefault();});
  dialog.addEventListener('close',function(){setCursorActive(playing&&mouse.present);});
  dialog.querySelector('.case-close').addEventListener('click',function(){dialog.close();});
  dialog.addEventListener('click',function(event){if(event.target===dialog){var r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  track.addEventListener('focusin',function(event){if(!event.target.matches(':focus-visible'))return;var project=event.target.closest('.project'),index=projects.indexOf(project);if(index<0)return;var desired=layout.work+index/Math.max(1,projects.length-1)*(layout.workEnd-layout.work-height);if(Math.abs(targetScroll-desired)>height*.3)window.scrollTo({top:desired,behavior:'auto'});});
  document.getElementById('year').textContent=new Date().getFullYear();measure();render(0,true);start();
  window.addEventListener('load',function(){measure();targetScroll=window.scrollY;render(0,true);},{once:true});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){measure();render(0,true);});
})();
