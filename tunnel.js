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
  var pointer={x:0,y:0,targetX:0,targetY:0,strength:0,present:false};
  var refraction=window.createPortfolioRefraction ? window.createPortfolioRefraction() : null;
  var yawSin=0,yawCos=1,pitchSin=0,pitchCos=1,endDistance=DEPTH;
  var singularity=null,sceneTime=0,holeCanvas=null,holeFrame=null,lastHoleTime=-Infinity;
  var scroll={value:0,destination:0,speed:0,driven:false,lastWrite:0};
  var maxScroll=0,userInteracted=false,portalProgress=0,introductionTop=0,holeTop=0;
  var introduction=document.getElementById('introduction');
  var forcePaint=true,lastCamera=NaN,lastLookX=NaN,lastLookY=NaN,lastMotion=NaN,renderTime=0;
  var stars=[],traces=[],sprites=[],paints=[];
  var pathX=new Float32Array(PATH_SAMPLES),pathY=new Float32Array(PATH_SAMPLES);
  var point={x:0,y:0,scale:0},other={x:0,y:0,scale:0};
  var palette=['156,156,156','192,192,192','225,225,225','255,255,255'];
  var tones=[156/255,192/255,225/255,1];
  var randomSeed=42;
  var panels=[],flight=false,flightStep=0;

  function clamp(value,min,max){return Math.max(min,Math.min(max,value));}
  function smoothstep(start,end,value){var t=clamp((value-start)/(end-start),0,1);return t*t*(3-2*t);}
  function wrap(value,length){return ((value%length)+length)%length;}
  function random(){
    randomSeed=(Math.imul(randomSeed,1664525)+1013904223)>>>0;
    return randomSeed/4294967296;
  }
  function scrollTarget(){
    return 8+Math.max(0,scroll.value)/Math.max(1,height)*18;
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
    add(all('#explorations > .container'),1120,0);
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
    scroll.value=scroll.destination=scroll.lastWrite=window.scrollY;
    scroll.speed=0;
    scroll.driven=false;forcePaint=true;
  }
  function smoothTo(top){
    scroll.destination=clamp(top,0,maxScroll);
    scroll.driven=true;
    schedule();
  }
  function resetStart(){
    if(location.hash)history.replaceState(null,'',location.href.split('#')[0]);
    jumpTo(0);camera=target=8;
    velocity=motion=0;lastTime=0;forcePaint=true;
  }
  function measureJourney(){
    maxScroll=Math.max(0,document.documentElement.scrollHeight-height);
    var last=panels[panels.length-1],end=document.getElementById('singularity');
    holeTop=last ? last.top : end.getBoundingClientRect().top+window.scrollY;
    introductionTop=introduction ? introduction.getBoundingClientRect().top+window.scrollY : holeTop+height*1.35;
  }
  function prepareFlight(){
    prepareWords();
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
        originalStyle:originalStyle,originalClass:originalClass,group:group.nodes.length>1,top:0,fit:1,
        words:Array.prototype.slice.call(panel.querySelectorAll('.motion-word'))});
    });
    flight=panels.length>0;
    document.documentElement.classList.toggle('journey-flight',flight);
    return nearest;
  }
  function restoreFlight(){
    for(var i=panels.length-1;i>=0;i--){
      var record=panels[i];
      record.words.forEach(function(word){word.style.removeProperty('transform');word.portfolioTransform=null;});
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
    if(introduction)introduction.style.removeProperty('opacity');
  }
  function layoutFlight(){
    if(!flight)return;
    flightStep=Math.round(height*1.02);
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
  function prepareWords(){
    document.querySelectorAll('main h1,main h2,main h3').forEach(function(heading){
      if(heading.closest('[data-static]'))return;
      if(heading.dataset.motionReady)return;
      heading.dataset.motionReady='true';
      var walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT),nodes=[],node;
      while((node=walker.nextNode()))nodes.push(node);
      nodes.forEach(function(textNode){
        var fragment=document.createDocumentFragment();
        textNode.textContent.split(/(\s+)/).forEach(function(part){
          if(!part)return;
          if(/^\s+$/.test(part)){fragment.appendChild(document.createTextNode(part));return;}
          var mask=document.createElement('span'),word=document.createElement('span');
          mask.className='word-window';word.className='motion-word';word.textContent=part;
          mask.appendChild(word);fragment.appendChild(mask);
        });
        textNode.parentNode.replaceChild(fragment,textNode);
      });
    });
  }
  function drawPanels(){
    if(!flight)return;
    var travel=(camera-8)/18*height;
    panels.forEach(function(record){
      var progress=(record.top-travel)/flightStep;
      var panel=record.panel;
      record.progress=progress;
      if(progress>1.6 || progress<-.74){
        if(record.hidden)return;
        record.hidden=true;
        panel.style.opacity='0';
        panel.style.visibility='hidden';
        panel.style.pointerEvents='none';
        panel.style.willChange='auto';
        panel.style.transform='translate(-50%,-50%) scale(.15)';
        record.slot.style.zIndex='0';
        return;
      }
      if(record.hidden || record.hidden===undefined){panel.style.visibility='visible';record.hidden=false;}
      // A continuous depth curve avoids the old flat stop around each reading point.
      var z=progress>=0 ? -2500*progress*progress/(progress+.22) : 1450*progress*progress/(-progress+.2);
      var projection=1100/(1100-z);
      var lane=mobile ? 0 : record.lane*width;
      var curve=smoothstep(.08,1,progress);
      project(0,0,clamp(14+Math.max(0,progress)*40,NEAR,DEPTH),other);
      var x=lane*projection+(other.x-width*.5)*curve-look.x*14*(1-curve);
      var y=22+(other.y-height*.48)*curve-look.y*10*(1-curve);
      y+=height*(smoothstep(0,1.25,progress)*.16-smoothstep(0,.72,-progress)*.55);
      var opacity=progress>=0 ? 1-smoothstep(.45,1.25,progress) : 1-smoothstep(.15,.68,-progress);
      panel.style.transform='translate(-50%,-50%) translate3d('+x.toFixed(2)+'px,'+y.toFixed(2)+'px,0) perspective(1100px) translateZ('+z.toFixed(2)+'px) scale('+record.fit.toFixed(4)+') rotateY('+(-record.lane*14-look.x*1.1).toFixed(2)+'deg) rotateX('+(look.y*.6).toFixed(2)+'deg)';
      panel.style.opacity=opacity.toFixed(3);
      panel.style.pointerEvents=progress>=-.12 && progress<=.3 ? 'auto' : 'none';
      panel.style.willChange='transform,opacity';
      record.words.forEach(function(word,index){
        var stagger=(index%9)*.018;
        var enter=smoothstep(.12+stagger,1.25+stagger,progress);
        var leave=smoothstep(.06+stagger,.48+stagger,-progress);
        // Move the complete glyphs gently; individual clipping masks sliced the rising text.
        var transform='translate3d(0,'+(enter*.38-leave*.42).toFixed(4)+'em,0)';
        if(word.portfolioTransform!==transform){word.style.transform=transform;word.portfolioTransform=transform;}
      });
      record.slot.style.zIndex=String(Math.round(1000-progress*100));
    });
  }
  function makeField(){
    var count=mobile ? 1400 : 2800;
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
    ctx.strokeStyle='rgba(225,231,240,.16)';
    ctx.stroke();
  }
  function drawGates(){
    var first=Math.floor(camera/18)+1;
    var segments=mobile ? 48 : 80;
    for(var gate=first+6;gate>=first;gate--){
      var world=gate*18,z=world-camera;
      if(z<=NEAR || z>DEPTH || z>endDistance)continue;
      var alpha=.12+Math.pow(1-z/DEPTH,2)*.24;
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
    // Batch monochrome dust into a few paints instead of thousands of fill calls.
    var batches=typeof Path2D==='function' ? [] : null;
    if(batches)for(var bucket=0;bucket<20;bucket++)batches.push(new Path2D());
    for(var i=0;i<stars.length;i++){
      var star=stars[i],z=NEAR+wrap(star.z-camera,star.span);
      if(z>endDistance)continue;
      project(star.x,star.y,z,point);
      if(point.x<-10 || point.x>width+10 || point.y<-10 || point.y>height+10)continue;
      var depth=1-z/DEPTH;
      var size=clamp(point.scale*star.size,.55,3.2);
      var edgeFade=star.span<DEPTH-NEAR ? clamp((star.span+NEAR-z)/6,0,1) : 1;
      var opacity=clamp((.26+depth*.74)*star.brightness*edgeFade,0,1);
      if(batches)batches[Math.round(opacity*tones[star.color]*19)].rect(point.x-size*.5,point.y-size*.5,size,size);
      else{
        ctx.fillStyle=paints[star.color][Math.round(opacity*19)];
        ctx.fillRect(point.x-size*.5,point.y-size*.5,size,size);
      }
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
    if(batches){
      for(var paint=1;paint<batches.length;paint++){
        ctx.fillStyle=paints[3][paint];ctx.fill(batches[paint]);
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
    singularity=window.createBlackHoleScene ? window.createBlackHoleScene() : null;
  }
  function drawSingularity(){
    var fade=clamp((DEPTH-endDistance)/35,0,1)*(1-smoothstep(.85,1.25,portalProgress));
    if(!singularity || fade<.005 || scroll.value>=introductionTop){
      if(holeCanvas)holeCanvas.style.visibility='hidden';
      holeFrame=null;lastHoleTime=-Infinity;return;
    }
    project(0,0,endDistance,other);
    var radius=Math.min(other.scale*3.5,Math.min(width*.23,height*.2));
    var moving=Math.abs(scroll.destination-scroll.value)>1;
    if(!holeCanvas || sceneTime-lastHoleTime>=(moving ? 1/30 : 1/60) || reduced){
      var image=singularity.render({radius:radius,time:sceneTime,lookX:look.x,lookY:look.y,mobile:mobile});
      if(image){
        if(image!==holeCanvas){
          if(holeCanvas)holeCanvas.remove();
          holeCanvas=image;holeCanvas.className='black-hole-layer';
          holeCanvas.style.width=holeCanvas.style.height='640px';
          host.appendChild(holeCanvas);
        }
        lastHoleTime=sceneTime;
      }
    }
    if(!holeCanvas)return;
    var zoom=1+18*Math.pow(smoothstep(0,1.15,portalProgress),2);
    var size=radius*8.6*zoom,center=smoothstep(0,.7,portalProgress);
    var x=other.x+(width*.5-other.x)*center,y=other.y+(height*.5-other.y)*center;
    holeCanvas.style.visibility='visible';holeCanvas.style.opacity=fade.toFixed(3);
    holeCanvas.style.transform='translate3d('+(x-320).toFixed(2)+'px,'+(y-320).toFixed(2)+'px,0) scale('+(size/640).toFixed(5)+')';
    holeFrame={canvas:holeCanvas,left:x-size*.5,top:y-size*.5,size:size,opacity:fade};
  }
  function draw(){
    if(!width || !height)return;
    portalProgress=flight ? Math.max(0,(scroll.value-holeTop)/height) : 0;
    var sceneOpacity=flight ? 1-smoothstep(.9,1.3,portalProgress) : scroll.value<introductionTop ? 1 : 0;
    var opacity=sceneOpacity.toFixed(3);
    if(host.style.opacity!==opacity)host.style.opacity=opacity;
    if(introduction && flight){
      var reveal=smoothstep(.95,1.3,portalProgress).toFixed(3);
      if(introduction.style.opacity!==reveal)introduction.style.opacity=reveal;
    }
    endDistance=clamp(8+holeTop/height*18+14-camera,14,DEPTH+1);
    if(reduced)endDistance=clamp(14+(holeTop-window.scrollY)/height*18,14,DEPTH+1);
    var changed=forcePaint || camera!==lastCamera || look.x!==lastLookX || look.y!==lastLookY || Math.abs(motion-lastMotion)>.01;
    if(changed){
      yawSin=Math.sin(look.x*.19);yawCos=Math.cos(look.x*.19);
      pitchSin=Math.sin(look.y*.13);pitchCos=Math.cos(look.y*.13);
      samplePath();
      if(sceneOpacity>.001){
        ctx.clearRect(0,0,width,height);
        drawRails();drawGates();drawTraces();drawStars();drawAperture();
      }
      drawPanels();
      lastCamera=camera;lastLookX=look.x;lastLookY=look.y;lastMotion=motion;forcePaint=false;
    }
    drawSingularity();
    if(refraction)refraction.render({canvas:canvas,width:width,height:height,panels:panels,pointer:pointer,hole:holeFrame,time:renderTime,disabled:reduced || mobile || portalProgress>.2});
  }
  function update(time){
    frame=0;
    if(document.hidden)return;
    var elapsed=lastTime ? clamp(time-lastTime,1,64) : 16;
    lastTime=time;
    renderTime=time;
    if(!reduced)sceneTime+=elapsed*.001;
    if(!scroll.driven)scroll.destination=window.scrollY;
    // Exact critically damped motion keeps velocity continuous between wheel impulses.
    // Integrating in seconds gives the same journey at 30, 60 and 120 Hz.
    if(reduced){scroll.value=scroll.destination;scroll.speed=0;}
    else{
      var seconds=elapsed*.001,frequency=12;
      var offset=scroll.value-scroll.destination;
      var impulse=scroll.speed+frequency*offset;
      var decay=Math.exp(-frequency*seconds);
      scroll.value=scroll.destination+(offset+impulse*seconds)*decay;
      scroll.speed=(scroll.speed-frequency*impulse*seconds)*decay;
      if(scroll.value<0 || scroll.value>maxScroll){scroll.value=clamp(scroll.value,0,maxScroll);scroll.speed=0;}
      if(Math.abs(scroll.destination-scroll.value)<.08 && Math.abs(scroll.speed)<.8){scroll.value=scroll.destination;scroll.speed=0;}
    }
    if(scroll.driven){
      window.scrollTo({top:scroll.value,behavior:'instant'});
      scroll.lastWrite=window.scrollY;
      if(scroll.value===scroll.destination){scroll.value=scroll.destination=window.scrollY;scroll.driven=false;}
    }
    target=reduced ? 8 : scrollTarget();
    var previous=camera;
    camera=target;
    velocity=(camera-previous)*16.667/elapsed;
    motion+=(Math.min(1,Math.abs(velocity)*1.7)-motion)*(1-Math.exp(-elapsed/43));
    var lookEase=1-Math.exp(-elapsed/125);
    look.x+=(look.targetX-look.x)*lookEase;
    look.y+=(look.targetY-look.y)*lookEase;
    if(Math.abs(look.targetX-look.x)<.0005)look.x=look.targetX;
    if(Math.abs(look.targetY-look.y)<.0005)look.y=look.targetY;
    var pointerEase=1-Math.exp(-elapsed/65);
    pointer.x+=(pointer.targetX-pointer.x)*pointerEase;
    pointer.y+=(pointer.targetY-pointer.y)*pointerEase;
    pointer.strength+=((pointer.present ? 1 : 0)-pointer.strength)*pointerEase;
    if(Math.abs(pointer.targetX-pointer.x)<.05)pointer.x=pointer.targetX;
    if(Math.abs(pointer.targetY-pointer.y)<.05)pointer.y=pointer.targetY;
    if(pointer.strength<.001)pointer.strength=0;
    if(pointer.strength>.999)pointer.strength=1;
    if(reduced){camera=8;velocity=0;motion=0;look.x=look.y=look.targetX=look.targetY=0;}
    draw();
    if(!reduced && (Math.abs(scroll.destination-scroll.value)>.05 || Math.abs(scroll.speed)>.8 || scroll.driven || motion>.006 || look.x!==look.targetX || look.y!==look.targetY || pointer.x!==pointer.targetX || pointer.y!==pointer.targetY || pointer.strength!==(pointer.present ? 1 : 0) || (singularity && endDistance<DEPTH && portalProgress<1.25 && scroll.value<introductionTop)))schedule();
    else{velocity=0;motion=0;lastTime=0;}
  }
  function schedule(){
    if(!frame && !document.hidden)frame=requestAnimationFrame(update);
  }
  function resize(){
    var hadViewport=width>0,wasFlight=flight,oldWidth=width,oldHeight=height;
    var introductionOffset=window.scrollY-introductionTop;
    var closest=flight ? nearestPanel() : null;
    var anchor=closest ? closest.origins[0].node : null;
    var bounds=host.getBoundingClientRect();
    width=Math.max(1,Math.round(bounds.width));
    var nextHeight=Math.max(1,Math.round(bounds.height));
    height=hadViewport && width<=760 && oldWidth===width && Math.abs(nextHeight-oldHeight)<120 ? oldHeight : nextHeight;
    focal=Math.min(width,height)*.88;
    mobile=width<=760;
    if(mobile || reduced){look.x=look.y=look.targetX=look.targetY=0;pointer.present=false;pointer.strength=0;}
    var shouldFly=!reduced && width>=340 && height>=620 && typeof document.querySelectorAll==='function' && document.getElementById('main');
    if(shouldFly && !flight)anchor=prepareFlight();
    else if(!shouldFly && flight)restoreFlight();
    layoutFlight();
    measureJourney();
    if(hadViewport && anchor && (wasFlight!==flight || oldWidth!==width || oldHeight!==height)){
      if(introductionOffset>=0){
        jumpTo(introductionTop+introductionOffset);
      }else if(flight){
        var matching=panels.find(function(record){return record.origins.some(function(origin){return origin.node===anchor;});});
        if(matching)jumpTo(matching.top);
      }else if(wasFlight){
        jumpTo(anchor.getBoundingClientRect().top+window.scrollY-100);
      }
    }
    makeField();
    var dpr=Math.min(window.devicePixelRatio||1,mobile ? 1.25 : 1.35);
    canvas.width=Math.round(width*dpr);
    canvas.height=Math.round(height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    if(!scroll.driven){scroll.value=scroll.destination=scroll.lastWrite=window.scrollY;scroll.speed=0;}
    camera=reduced ? 8 : scrollTarget();
    target=camera;velocity=0;motion=0;lastTime=0;
    forcePaint=true;
    schedule();
  }
  function onMotionChange(event){
    reduced=event.matches;
    resize();
  }
  if(motionQuery.addEventListener)motionQuery.addEventListener('change',onMotionChange);
  else if(motionQuery.addListener)motionQuery.addListener(onMotionChange);
  window.addEventListener('scroll',function(){
    if(!scroll.driven || Math.abs(window.scrollY-scroll.lastWrite)>2){scroll.driven=false;scroll.destination=window.scrollY;}
    schedule();
  },{passive:true});
  window.addEventListener('wheel',function(event){
    userInteracted=true;
    if(reduced || !flight || event.ctrlKey || event.metaKey || event.shiftKey || event.defaultPrevented || !event.deltaY)return;
    if(event.target.closest && event.target.closest('input,textarea,select,[contenteditable="true"]'))return;
    if(!event.cancelable)return;
    event.preventDefault();
    var delta=event.deltaY*(event.deltaMode===1 ? 16 : event.deltaMode===2 ? height : 1);
    if(!scroll.driven)scroll.destination=window.scrollY;
    smoothTo(scroll.destination+delta*.9);
  },{passive:false});
  window.addEventListener('keydown',function(event){
    userInteracted=true;
    if(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].indexOf(event.key)!==-1)scroll.driven=false;
  });
  window.addEventListener('pointerdown',function(){userInteracted=true;scroll.driven=false;},{passive:true});
  window.addEventListener('touchstart',function(){userInteracted=true;scroll.driven=false;},{passive:true});
  function resetLook(){look.targetX=look.targetY=0;pointer.present=false;schedule();}
  window.addEventListener('pointermove',function(event){
    if(reduced || mobile || event.pointerType==='touch')return;
    if(!pointer.present){pointer.x=event.clientX;pointer.y=event.clientY;}
    pointer.targetX=event.clientX;pointer.targetY=event.clientY;pointer.present=true;
    look.targetX=clamp(event.clientX/width*2-1,-1,1);
    look.targetY=clamp(event.clientY/height*2-1,-1,1);
    schedule();
  },{passive:true});
  document.addEventListener('pointerleave',resetLook);
  window.addEventListener('blur',resetLook);
  window.addEventListener('resize',resize);
  window.addEventListener('pageshow',function(event){if(!userInteracted || event.persisted)resetStart();resize();});
  document.addEventListener('visibilitychange',function(){
    if(frame){cancelAnimationFrame(frame);frame=0;}
    velocity=0;motion=0;lastTime=0;
    look.targetX=look.targetY=0;
    pointer.present=false;pointer.strength=0;
    if(!document.hidden)resize();
  });
  document.addEventListener('focusin',function(event){
    if(!flight || !userInteracted)return;
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
    var top=record ? record.top : location.hash==='#introduction' ? introductionTop : null;
    if(top===null)return;
    if(instant){
      jumpTo(top);
      camera=target=scrollTarget();
      velocity=0;motion=0;lastTime=0;
      schedule();
    }else smoothTo(top);
  }
  document.addEventListener('click',function(event){
    if(!flight || event.defaultPrevented || event.button!==0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)return;
    var link=event.target.closest('a[href^="#"]');
    if(!link || (!anchorPanel(link.hash) && link.hash!=='#introduction'))return;
    userInteracted=true;
    event.preventDefault();
    if(location.hash!==link.hash)history.pushState(null,'',location.href.split('#')[0]+link.hash);
    followHash(false);
  });
  window.addEventListener('hashchange',function(){followHash(false);});
  makePaints();
  makeSingularity();
  resetStart();
  resize();
  if(document.fonts && document.fonts.ready){
    document.fonts.ready.then(function(){
      layoutFlight();measureJourney();
      if(!userInteracted)resetStart();
      forcePaint=true;schedule();
    });
  }
  window.addEventListener('load',function(){if(!userInteracted)resetStart();schedule();});
})();
