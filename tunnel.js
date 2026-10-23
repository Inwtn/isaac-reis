(function(){
  'use strict';

  var host=document.getElementById('site-atmosphere');
  var canvas=document.getElementById('atmosphere-canvas');
  if(!host || !canvas || !canvas.getContext)return;
  var ctx=canvas.getContext('2d',{alpha:true});
  if(!ctx)return;

  var motionQuery=window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced=motionQuery.matches;
  var TAU=Math.PI*2,DEPTH=112,NEAR=1.8,RADIUS=4.8,PATH_SAMPLES=128;
  var width=0,height=0,focal=0,mobile=false,frame=0,lastTime=0;
  var camera=8,target=8,velocity=0,motion=0;
  var look={x:0,y:0,targetX:0,targetY:0};
  var yawSin=0,yawCos=1,pitchSin=0,pitchCos=1,endDistance=DEPTH;
  var singularity=null;
  var stars=[],traces=[],sprites=[],paints=[];
  var pathX=new Float32Array(PATH_SAMPLES),pathY=new Float32Array(PATH_SAMPLES);
  var point={x:0,y:0,scale:0},other={x:0,y:0,scale:0};
  var palette=['156,156,156','192,192,192','225,225,225','255,255,255'];
  var randomSeed=42;
  var panels=[],flight=false,flightStep=0;

  function clamp(value,min,max){return Math.max(min,Math.min(max,value));}
  function wrap(value,length){return ((value%length)+length)%length;}
  function random(){
    randomSeed=(Math.imul(randomSeed,1664525)+1013904223)>>>0;
    return randomSeed/4294967296;
  }
  function scrollTarget(){
    return 8+Math.max(0,window.scrollY)/Math.max(1,height)*18;
  }
  function panelGroups(){
    var groups=[];
    function add(nodes,panelWidth,lane){
      if(nodes.length)groups.push({nodes:nodes,width:panelWidth,lane:lane||0});
    }
    function all(selector){return Array.prototype.slice.call(document.querySelectorAll(selector));}
    all('.story-content').forEach(function(node,index){add([node],650,index===1 ? .15 : -.15);});
    add(all('#work .section-heading'),1080,0);
    all('#work .work-item').forEach(function(node,index){add([node],1180,index ? .025 : -.025);});
    add(all('#about .section-heading'),1080,-.025);
    add(all('#about .about-grid, #about .fact-row'),1120,0);
    add(all('#expertise .section-heading'),1080,.025);
    var capabilities=all('#expertise .capability');
    add(capabilities.slice(0,2),1080,-.025);
    add(capabilities.slice(2),1080,.025);
    add(all('#experience .section-heading'),1080,-.025);
    var jobs=all('#experience .job');
    add(jobs.slice(0,2),1100,0);
    add(jobs.slice(2),1100,.025);
    all('#credentials > .container > div').forEach(function(node,index){add([node],index ? 800 : 1000,0);});
    add(all('#contact > .container'),1120,0);
    add(all('#singularity > .container'),1120,0);
    return groups;
  }
  function nearestPanel(){
    var best=null,distance=Infinity;
    panels.forEach(function(record){
      var delta=Math.abs(record.top-window.scrollY);
      if(delta<distance){best=record;distance=delta;}
    });
    return best;
  }
  function jumpTo(top){
    var root=document.documentElement,old=root.style.scrollBehavior;
    root.style.scrollBehavior='auto';
    window.scrollTo(0,Math.max(0,top));
    root.style.scrollBehavior=old;
  }
  function prepareFlight(){
    var groups=panelGroups(),nearest=null,distance=Infinity;
    groups.forEach(function(group){
      var first=group.nodes[0],bounds=first.getBoundingClientRect();
      var delta=Math.abs(bounds.top+bounds.height*.5-height*.5);
      if(delta<distance){nearest=first;distance=delta;}
      var origins=group.nodes.map(function(node){
        return {node:node,parent:node.parentNode,next:node.nextSibling};
      });
      var panel=group.nodes.length===1 ? first : document.createElement('div');
      var originalStyle=panel.getAttribute('style');
      var originalClass=panel.getAttribute('class');
      if(group.nodes.length>1){
        panel.className='flight-group';
        origins[0].parent.insertBefore(panel,first);
        group.nodes.forEach(function(node){panel.appendChild(node);});
      }
      var slot=document.createElement('div');
      slot.className='flight-slot';
      panel.parentNode.insertBefore(slot,panel);
      slot.appendChild(panel);
      panel.classList.add('flight-panel');
      panels.push({slot:slot,panel:panel,origins:origins,width:group.width,lane:group.lane,
        originalStyle:originalStyle,originalClass:originalClass,group:group.nodes.length>1,top:0,fit:1});
    });
    flight=panels.length>0;
    document.documentElement.classList.toggle('journey-flight',flight);
    return nearest;
  }
  function restoreFlight(){
    for(var i=panels.length-1;i>=0;i--){
      var record=panels[i];
      for(var j=record.origins.length-1;j>=0;j--){
        var origin=record.origins[j];
        origin.parent.insertBefore(origin.node,origin.next && origin.next.parentNode===origin.parent ? origin.next : null);
      }
      if(!record.group){
        if(record.originalStyle===null)record.panel.removeAttribute('style');
        else record.panel.setAttribute('style',record.originalStyle);
        if(record.originalClass===null)record.panel.removeAttribute('class');
        else record.panel.setAttribute('class',record.originalClass);
      }
      record.slot.remove();
    }
    panels=[];
    flight=false;
    document.documentElement.classList.remove('journey-flight');
  }
  function layoutFlight(){
    if(!flight)return;
    flightStep=Math.round(height*1.18);
    panels.forEach(function(record,index){
      record.slot.style.height=(index===panels.length-1 ? height : flightStep)+'px';
      var lane=mobile ? 0 : record.lane*width;
      record.panel.style.width=Math.min(record.width,width-(mobile ? 36 : 100)-Math.abs(lane)*2)+'px';
    });
    panels.forEach(function(record){
      var bounds=record.slot.getBoundingClientRect();
      record.top=bounds.top+window.scrollY;
      record.centerX=bounds.left+bounds.width*.5;
      record.slotHeight=bounds.height;
      record.fit=Math.min(1,(height-(mobile ? 140 : 180))/Math.max(1,record.panel.offsetHeight));
    });
  }
  function drawPanels(){
    if(!flight)return;
    var travel=(camera-8)/18*height;
    panels.forEach(function(record){
      var progress=(record.top-travel)/flightStep;
      var panel=record.panel;
      if(progress>2.05 || progress<-.58){
        panel.style.opacity='0';
        panel.style.pointerEvents='none';
        panel.style.willChange='auto';
        panel.style.transform='translate(-50%,-50%) scale(.15)';
        record.slot.style.zIndex='0';
        return;
      }
      var z=progress>.12 ? -(progress-.12)*2500 : progress<-.12 ? (-progress-.12)*1900 : 0;
      var projection=1100/(1100-z);
      var lane=mobile ? 0 : record.lane*width;
      var curve=clamp((progress-.12)/.8,0,1);
      project(0,0,clamp(14+Math.max(0,progress)*40,NEAR,DEPTH),other);
      var x=width*.5-record.centerX+lane*projection+(other.x-width*.5)*curve-look.x*14*(1-curve);
      var y=height*.5+22-(record.top-window.scrollY+record.slotHeight*.5)+(other.y-height*.48)*curve-look.y*10*(1-curve);
      var opacity=progress>=0 ? clamp(1-Math.max(0,progress-.6)*1.9,.025,1) : clamp(1-Math.max(0,-progress-.2)/.26,0,1);
      panel.style.transform='translate(-50%,-50%) translate3d('+x.toFixed(2)+'px,'+y.toFixed(2)+'px,0) perspective(1100px) translateZ('+z.toFixed(2)+'px) scale('+record.fit.toFixed(4)+') rotateY('+(-record.lane*14-look.x*1.1).toFixed(2)+'deg) rotateX('+(look.y*.6).toFixed(2)+'deg)';
      panel.style.opacity=opacity.toFixed(3);
      panel.style.pointerEvents=progress>=-.12 && progress<=.3 ? 'auto' : 'none';
      panel.style.willChange='transform,opacity';
      record.slot.style.zIndex=String(Math.round(1000-progress*100));
    });
  }
  function makeField(){
    var count=mobile ? 2100 : 5200;
    if(stars.length===count)return;
    randomSeed=42;
    stars=[];
    traces=[];
    for(var i=0;i<count;i++){
      var angle=random()*TAU,dust=random()>.85;
      var span=i%4===0 ? 32 : DEPTH-NEAR;
      var radius=dust ? 1.2+random()*6 : RADIUS+(random()-.5)*1.1;
      var color=random()>.95 ? 3 : Math.floor(random()*3);
      stars.push({
        x:Math.cos(angle)*radius,
        y:Math.sin(angle)*radius,
        z:random()*span,
        span:span,
        size:.014+random()*.025,
        brightness:(dust ? .42 : .65)+random()*.4,
        color:color,
        glow:random()>.965
      });
    }
    for(var t=0;t<(mobile ? 24 : 50);t++){
      var turn=(random()-.5)*.28,step=4+random()*5;
      traces.push({
        angle:random()*TAU,
        z:random()*DEPTH,
        color:t%4===0 ? 1 : 0,
        nodes:[[0,0],[step,0],[step,turn],[step*2.4,turn],[step*2.4,turn*.35],[step*3.8,turn*.35]]
      });
    }
  }
  function makePaints(){
    for(var color=0;color<palette.length;color++){
      paints[color]=[];
      for(var opacity=0;opacity<20;opacity++){
        paints[color].push('rgba('+palette[color]+','+(opacity/19)+')');
      }
      var sprite=document.createElement('canvas');
      sprite.width=48;sprite.height=48;
      var paint=sprite.getContext('2d');
      if(paint){
        var glow=paint.createRadialGradient(24,24,0,24,24,24);
        glow.addColorStop(0,'rgba('+palette[color]+',.9)');
        glow.addColorStop(.14,'rgba('+palette[color]+',.45)');
        glow.addColorStop(.45,'rgba('+palette[color]+',.1)');
        glow.addColorStop(1,'rgba('+palette[color]+',0)');
        paint.fillStyle=glow;
        paint.fillRect(0,0,48,48);
        sprites[color]=sprite;
      }
    }
  }
  function samplePath(){
    // Follow the local tangent, so each bend becomes the next stretch of tunnel.
    var originX=Math.sin(camera*.023)*7+Math.sin(camera*.047)*1.4;
    var originY=Math.cos(camera*.019)*4;
    var tangentX=Math.cos(camera*.023)*.161+Math.cos(camera*.047)*.0658;
    var tangentY=-Math.sin(camera*.019)*.076;
    for(var i=0;i<PATH_SAMPLES;i++){
      var z=i/(PATH_SAMPLES-1)*DEPTH,world=camera+z;
      pathX[i]=Math.sin(world*.023)*7+Math.sin(world*.047)*1.4-originX-tangentX*z;
      pathY[i]=Math.cos(world*.019)*4-originY-tangentY*z;
    }
  }
  function project(x,y,z,out){
    var index=clamp(z/DEPTH*(PATH_SAMPLES-1),0,PATH_SAMPLES-1);
    var lower=Math.floor(index),upper=Math.min(PATH_SAMPLES-1,lower+1),mix=index-lower;
    var bendX=pathX[lower]+(pathX[upper]-pathX[lower])*mix;
    var bendY=pathY[lower]+(pathY[upper]-pathY[lower])*mix;
    var localX=x+bendX-look.x*.42,localY=y+bendY-look.y*.28;
    var viewX=localX*yawCos-z*yawSin;
    var viewZ=localX*yawSin+z*yawCos;
    var viewY=localY*pitchCos-viewZ*pitchSin;
    viewZ=localY*pitchSin+viewZ*pitchCos;
    out.scale=focal/Math.max(.35,viewZ);
    out.x=width*.5+viewX*out.scale;
    out.y=height*.48+viewY*out.scale;
    return out;
  }
  function drawRails(){
    ctx.beginPath();
    var rails=mobile ? 10 : 16;
    for(var rail=0;rail<rails;rail++){
      var angle=rail/rails*TAU;
      for(var step=0;step<=48;step++){
        var z=NEAR+step/48*(Math.min(DEPTH,endDistance)-NEAR);
        var twist=angle+(camera+z)*.003;
        project(Math.cos(twist)*RADIUS,Math.sin(twist)*RADIUS,z,point);
        if(step===0)ctx.moveTo(point.x,point.y);
        else ctx.lineTo(point.x,point.y);
      }
    }
    ctx.lineWidth=.65;
    ctx.strokeStyle='rgba(210,210,210,.12)';
    ctx.stroke();
  }
  function drawGates(){
    var first=Math.floor(camera/18)+1;
    var segments=mobile ? 48 : 80;
    for(var gate=first+6;gate>=first;gate--){
      var world=gate*18,z=world-camera;
      if(z<=NEAR || z>DEPTH || z>endDistance)continue;
      var alpha=.09+Math.pow(1-z/DEPTH,2)*.2;
      ctx.beginPath();
      for(var j=0;j<=segments;j++){
        var angle=j/segments*TAU;
        var radius=RADIUS*(1+.018*Math.sin(angle*6+world*.08));
        project(Math.cos(angle)*radius,Math.sin(angle)*radius,z,point);
        if(j===0)ctx.moveTo(point.x,point.y);
        else ctx.lineTo(point.x,point.y);
      }
      ctx.lineWidth=5;
      ctx.strokeStyle='rgba(230,230,230,'+(alpha*.15)+')';
      ctx.stroke();
      ctx.lineWidth=.8;
      ctx.strokeStyle='rgba(240,240,240,'+alpha+')';
      ctx.stroke();
    }
  }
  function drawTraces(){
    for(var i=0;i<traces.length;i++){
      var trace=traces[i],z=NEAR+wrap(trace.z-camera,DEPTH-NEAR);
      var length=trace.nodes[trace.nodes.length-1][0];
      if(z+length>DEPTH || z+length>endDistance)continue;
      var alpha=.08+Math.pow(1-z/DEPTH,2)*.34;
      ctx.beginPath();
      for(var j=0;j<trace.nodes.length;j++){
        var node=trace.nodes[j],depth=z+node[0];
        var angle=trace.angle+node[1]+(camera+depth)*.003;
        project(Math.cos(angle)*RADIUS,Math.sin(angle)*RADIUS,depth,point);
        if(j===0)ctx.moveTo(point.x,point.y);
        else ctx.lineTo(point.x,point.y);
      }
      ctx.lineWidth=.6+Math.max(0,1-z/30)*1.1;
      ctx.strokeStyle='rgba('+palette[trace.color]+','+alpha+')';
      ctx.stroke();
      if(point.x>0 && point.x<width && point.y>0 && point.y<height){
        ctx.fillStyle='rgba('+palette[trace.color]+','+(alpha*1.5)+')';
        var size=clamp(focal/(z+length)*.025,1,3);
        ctx.fillRect(point.x-size*.5,point.y-size*.5,size,size);
      }
    }
  }
  function drawStars(){
    ctx.beginPath();
    for(var i=0;i<stars.length;i++){
      var star=stars[i],z=NEAR+wrap(star.z-camera,star.span);
      if(z>endDistance)continue;
      project(star.x,star.y,z,point);
      if(point.x<-10 || point.x>width+10 || point.y<-10 || point.y>height+10)continue;
      var depth=1-z/DEPTH;
      var size=clamp(point.scale*star.size,.55,3.2);
      var edgeFade=star.span<DEPTH-NEAR ? clamp((star.span+NEAR-z)/6,0,1) : 1;
      var opacity=clamp((.22+depth*.68)*star.brightness*edgeFade,0,1);
      ctx.fillStyle=paints[star.color][Math.round(opacity*19)];
      ctx.fillRect(point.x-size*.5,point.y-size*.5,size,size);
      if(star.glow && size>.65 && sprites[star.color]){
        var glowSize=5+size*5;
        ctx.globalAlpha=opacity*.8;
        ctx.drawImage(sprites[star.color],point.x-glowSize*.5,point.y-glowSize*.5,glowSize,glowSize);
        ctx.globalAlpha=1;
      }
      if(motion>.018 && z<75){
        var ratio=z/Math.max(NEAR,z+velocity*1.7);
        var tailX=(point.x-width*.5)*(ratio-1);
        var tailY=(point.y-height*.48)*(ratio-1);
        var distance=Math.hypot(tailX,tailY);
        var limit=distance>70 ? 70/distance : 1;
        ctx.moveTo(point.x,point.y);
        ctx.lineTo(point.x+tailX*limit,point.y+tailY*limit);
      }
    }
    if(motion>.018){
      ctx.lineWidth=.55+motion*.6;
      ctx.strokeStyle='rgba(240,240,240,'+(.16+motion*.34)+')';
      ctx.stroke();
    }
  }
  function drawAperture(){
    project(0,0,DEPTH,other);
    var radius=focal*RADIUS/DEPTH*1.25;
    var fog=ctx.createRadialGradient(other.x,other.y,0,other.x,other.y,radius);
    fog.addColorStop(0,'rgba(0,0,0,.94)');
    fog.addColorStop(.56,'rgba(0,0,0,.8)');
    fog.addColorStop(.84,'rgba(180,180,180,.06)');
    fog.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=fog;
    ctx.fillRect(other.x-radius,other.y-radius,radius*2,radius*2);
  }
  function makeSingularity(){
    // Paint the detailed accretion disk once; reuse it at its projected depth.
    singularity=document.createElement('canvas');
    singularity.width=1200;singularity.height=1200;
    var paint=singularity.getContext('2d');
    if(!paint){singularity=null;return;}
    var r=140;
    paint.translate(600,600);
    var halo=paint.createRadialGradient(0,0,r*.9,0,0,r*4);
    halo.addColorStop(0,'rgba(220,220,220,.28)');
    halo.addColorStop(.2,'rgba(180,180,180,.12)');
    halo.addColorStop(.5,'rgba(150,150,150,.045)');
    halo.addColorStop(1,'rgba(150,150,150,0)');
    paint.fillStyle=halo;paint.fillRect(-600,-600,1200,1200);
    paint.globalCompositeOperation='screen';
    for(var band=0;band<90;band++){
      var mix=band/89,radius=r*(1.3+mix*1.9);
      paint.beginPath();paint.ellipse(0,0,radius,radius*.205,0,0,TAU);
      var tone=255-Math.round(mix*110);
      paint.strokeStyle='rgba('+tone+','+tone+','+tone+','+((1-mix)*.19)+')';
      paint.lineWidth=1.2+mix*1.4;paint.stroke();
    }
    var seed=731;
    for(var i=0;i<1800;i++){
      seed=(Math.imul(seed,1664525)+1013904223)>>>0;
      var angle=seed/4294967296*TAU;
      seed=(Math.imul(seed,1664525)+1013904223)>>>0;
      var orbit=1.35+seed/4294967296*1.75;
      var x=Math.cos(angle)*r*orbit,y=Math.sin(angle)*r*orbit*.205;
      paint.fillStyle='rgba(245,245,245,'+((3.1-orbit)*.14)+')';
      paint.fillRect(x,y,1.5, .65);
    }
    // Light bent over the horizon, with a brighter edge on the approaching side.
    paint.shadowColor='#dddddd';paint.shadowBlur=22;
    for(var arc=0;arc<12;arc++){
      paint.beginPath();
      paint.ellipse(0,0,r*(1.06+arc*.012),r*(1.06+arc*.012),0,Math.PI*.98,TAU+.035);
      paint.strokeStyle='rgba(240,240,240,'+(.22-arc*.015)+')';
      paint.lineWidth=2;paint.stroke();
    }
    paint.shadowBlur=0;paint.globalCompositeOperation='source-over';
    paint.beginPath();paint.arc(0,0,r,0,TAU);
    paint.fillStyle='#010101';paint.fill();
    paint.beginPath();paint.arc(0,0,r*1.012,0,TAU);
    paint.strokeStyle='rgba(255,255,255,.95)';paint.lineWidth=1.7;
    paint.shadowColor='#ffffff';paint.shadowBlur=10;paint.stroke();
    paint.shadowBlur=0;
    var disk=paint.createLinearGradient(-r*3,0,r*3,0);
    disk.addColorStop(0,'rgba(190,190,190,0)');
    disk.addColorStop(.2,'rgba(220,220,220,.5)');
    disk.addColorStop(.45,'rgba(255,255,255,1)');
    disk.addColorStop(.6,'rgba(255,255,255,1)');
    disk.addColorStop(.8,'rgba(220,220,220,.5)');
    disk.addColorStop(1,'rgba(190,190,190,0)');
    paint.globalCompositeOperation='screen';
    for(var layer=9;layer>=0;layer--){
      paint.beginPath();paint.moveTo(-r*3.1,0);
      paint.bezierCurveTo(-r*1.2,r*.14,-r*.8,r*.49,0,r*.48);
      paint.bezierCurveTo(r*.85,r*.47,r*1.3,r*.1,r*3.1,0);
      paint.strokeStyle=disk;paint.lineWidth=1.4+layer*1.8;
      paint.globalAlpha=layer===0 ? 1 : .045;
      paint.stroke();
    }
  }
  function drawSingularity(){
    if(!singularity || endDistance>DEPTH)return;
    project(0,0,endDistance,other);
    var radius=Math.min(other.scale*3.5,Math.min(width*.23,height*.2));
    var fade=clamp((DEPTH-endDistance)/35,0,1);
    ctx.save();
    ctx.translate(other.x,other.y);ctx.rotate(-.16+look.x*.045);
    ctx.globalAlpha=fade;
    ctx.drawImage(singularity,-radius*600/140,-radius*600/140,radius*1200/140,radius*1200/140);
    ctx.restore();
  }
  function draw(){
    if(!width || !height)return;
    ctx.clearRect(0,0,width,height);
    yawSin=Math.sin(look.x*.19);yawCos=Math.cos(look.x*.19);
    pitchSin=Math.sin(look.y*.13);pitchCos=Math.cos(look.y*.13);
    var last=panels[panels.length-1];
    var endWorld=last ? 8+last.top/height*18+14 : 8+Math.max(0,document.documentElement.scrollHeight-height)/height*18+14;
    endDistance=clamp(endWorld-camera,14,DEPTH+1);
    if(reduced){
      var remaining=Math.max(0,document.documentElement.scrollHeight-height-window.scrollY)/height;
      endDistance=clamp(14+remaining*18,14,DEPTH+1);
    }
    samplePath();
    drawRails();
    drawGates();
    drawTraces();
    drawStars();
    drawAperture();
    drawSingularity();
    drawPanels();
  }
  function update(time){
    frame=0;
    if(document.hidden)return;
    var elapsed=lastTime ? clamp(time-lastTime,8,40) : 16;
    lastTime=time;
    target=reduced ? 8 : scrollTarget();
    var previous=camera;
    camera+=((target-camera)*(1-Math.exp(-elapsed/85)));
    if(Math.abs(target-camera)<.003)camera=target;
    velocity=camera-previous;
    motion+=(Math.min(1,Math.abs(velocity)*1.7)-motion)*.32;
    var lookEase=1-Math.exp(-elapsed/125);
    look.x+=(look.targetX-look.x)*lookEase;
    look.y+=(look.targetY-look.y)*lookEase;
    if(Math.abs(look.targetX-look.x)<.0005)look.x=look.targetX;
    if(Math.abs(look.targetY-look.y)<.0005)look.y=look.targetY;
    if(reduced){camera=8;velocity=0;motion=0;look.x=look.y=look.targetX=look.targetY=0;}
    draw();
    if(!reduced && (Math.abs(target-camera)>.003 || motion>.006 || look.x!==look.targetX || look.y!==look.targetY))schedule();
    else{velocity=0;motion=0;lastTime=0;}
  }
  function schedule(){
    if(!frame && !document.hidden)frame=requestAnimationFrame(update);
  }
  function resize(){
    var hadViewport=width>0,wasFlight=flight,oldWidth=width,oldHeight=height;
    var closest=flight ? nearestPanel() : null;
    var anchor=closest ? closest.origins[0].node : null;
    var bounds=host.getBoundingClientRect();
    width=Math.max(1,Math.round(bounds.width));
    height=Math.max(1,Math.round(bounds.height));
    focal=Math.min(width,height)*.88;
    mobile=width<=760;
    if(mobile || reduced)look.x=look.y=look.targetX=look.targetY=0;
    var shouldFly=!reduced && width>=340 && height>=620 && typeof document.querySelectorAll==='function' && document.getElementById('main');
    if(shouldFly && !flight)anchor=prepareFlight();
    else if(!shouldFly && flight)restoreFlight();
    layoutFlight();
    if(hadViewport && anchor && (wasFlight!==flight || oldWidth!==width || oldHeight!==height)){
      if(flight){
        var matching=panels.find(function(record){return record.origins.some(function(origin){return origin.node===anchor;});});
        if(matching)jumpTo(matching.top);
      }else if(wasFlight){
        jumpTo(anchor.getBoundingClientRect().top+window.scrollY-100);
      }
    }
    makeField();
    var dpr=Math.min(window.devicePixelRatio||1,mobile ? 1.5 : 1.75);
    canvas.width=Math.round(width*dpr);
    canvas.height=Math.round(height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    camera=reduced ? 8 : scrollTarget();
    target=camera;velocity=0;motion=0;lastTime=0;
    schedule();
  }
  function onMotionChange(event){
    reduced=event.matches;
    resize();
  }
  if(motionQuery.addEventListener)motionQuery.addEventListener('change',onMotionChange);
  else if(motionQuery.addListener)motionQuery.addListener(onMotionChange);
  window.addEventListener('scroll',schedule,{passive:true});
  function resetLook(){look.targetX=look.targetY=0;schedule();}
  window.addEventListener('pointermove',function(event){
    if(reduced || mobile || event.pointerType==='touch' || document.body.classList.contains('menu-open'))return;
    look.targetX=clamp(event.clientX/width*2-1,-1,1);
    look.targetY=clamp(event.clientY/height*2-1,-1,1);
    schedule();
  },{passive:true});
  document.addEventListener('pointerleave',resetLook);
  window.addEventListener('blur',resetLook);
  window.addEventListener('resize',resize);
  window.addEventListener('pageshow',resize);
  document.addEventListener('visibilitychange',function(){
    if(frame){cancelAnimationFrame(frame);frame=0;}
    velocity=0;motion=0;lastTime=0;
    look.targetX=look.targetY=0;
    if(!document.hidden)resize();
  });
  document.addEventListener('focusin',function(event){
    if(!flight)return;
    var record=panels.find(function(item){return item.panel.contains(event.target);});
    if(record){
      if(Math.abs(record.top-window.scrollY)>flightStep*.12)jumpTo(record.top);
      camera=target=scrollTarget();
      velocity=0;motion=0;lastTime=0;
      schedule();
    }
  });
  function anchorPanel(hash){
    var node;
    try{node=document.getElementById(decodeURIComponent(hash.slice(1)));}catch(error){return null;}
    if(!node)return null;
    return panels.find(function(record){return record.panel.contains(node) || node.contains(record.slot);});
  }
  function followHash(instant){
    if(!flight || !location.hash)return;
    var record=anchorPanel(location.hash);
    if(!record)return;
    if(instant){
      jumpTo(record.top);
      camera=target=scrollTarget();
      velocity=0;motion=0;lastTime=0;
      schedule();
    }else window.scrollTo({top:record.top,behavior:'smooth'});
  }
  document.addEventListener('click',function(event){
    if(!flight || event.defaultPrevented || event.button!==0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)return;
    var link=event.target.closest('a[href^="#"]');
    if(!link || !anchorPanel(link.hash))return;
    event.preventDefault();
    if(location.hash!==link.hash)history.pushState(null,'',location.href.split('#')[0]+link.hash);
    followHash(false);
  });
  window.addEventListener('hashchange',function(){followHash(false);});
  makePaints();
  makeSingularity();
  resize();
  if(document.fonts && document.fonts.ready){
    document.fonts.ready.then(function(){layoutFlight();followHash(true);schedule();});
  }
})();
