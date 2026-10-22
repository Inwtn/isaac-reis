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
  var stars=[],traces=[],sprites=[],paints=[];
  var pathX=new Float32Array(PATH_SAMPLES),pathY=new Float32Array(PATH_SAMPLES);
  var point={x:0,y:0,scale:0},other={x:0,y:0,scale:0};
  var palette=['93,135,255','136,133,255','106,213,244','211,231,255'];
  var randomSeed=42;

  function clamp(value,min,max){return Math.max(min,Math.min(max,value));}
  function wrap(value,length){return ((value%length)+length)%length;}
  function random(){
    randomSeed=(Math.imul(randomSeed,1664525)+1013904223)>>>0;
    return randomSeed/4294967296;
  }
  function scrollTarget(){
    return 8+Math.max(0,window.scrollY)/Math.max(1,height)*18;
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
    var originX=Math.sin(camera*.014)*1.8;
    var originY=Math.cos(camera*.011)*1.2;
    var tangentX=Math.cos(camera*.014)*.0252;
    var tangentY=-Math.sin(camera*.011)*.0132;
    for(var i=0;i<PATH_SAMPLES;i++){
      var z=i/(PATH_SAMPLES-1)*DEPTH,world=camera+z;
      pathX[i]=Math.sin(world*.014)*1.8-originX-tangentX*z;
      pathY[i]=Math.cos(world*.011)*1.2-originY-tangentY*z;
    }
  }
  function project(x,y,z,out){
    var index=clamp(z/DEPTH*(PATH_SAMPLES-1),0,PATH_SAMPLES-1);
    var lower=Math.floor(index),upper=Math.min(PATH_SAMPLES-1,lower+1),mix=index-lower;
    var bendX=pathX[lower]+(pathX[upper]-pathX[lower])*mix;
    var bendY=pathY[lower]+(pathY[upper]-pathY[lower])*mix;
    out.scale=focal/z;
    out.x=width*.5+(x+bendX)*out.scale;
    out.y=height*.48+(y+bendY)*out.scale;
    return out;
  }
  function drawRails(){
    ctx.beginPath();
    var rails=mobile ? 10 : 16;
    for(var rail=0;rail<rails;rail++){
      var angle=rail/rails*TAU;
      for(var step=0;step<=48;step++){
        var z=NEAR+step/48*(DEPTH-NEAR);
        var twist=angle+(camera+z)*.003;
        project(Math.cos(twist)*RADIUS,Math.sin(twist)*RADIUS,z,point);
        if(step===0)ctx.moveTo(point.x,point.y);
        else ctx.lineTo(point.x,point.y);
      }
    }
    ctx.lineWidth=.65;
    ctx.strokeStyle='rgba(87,124,235,.13)';
    ctx.stroke();
  }
  function drawGates(){
    var first=Math.floor(camera/18)+1;
    var segments=mobile ? 48 : 80;
    for(var gate=first+6;gate>=first;gate--){
      var world=gate*18,z=world-camera;
      if(z<=NEAR || z>DEPTH)continue;
      var alpha=.055+Math.pow(1-z/DEPTH,2)*.16;
      ctx.beginPath();
      for(var j=0;j<=segments;j++){
        var angle=j/segments*TAU;
        var radius=RADIUS*(1+.018*Math.sin(angle*6+world*.08));
        project(Math.cos(angle)*radius,Math.sin(angle)*radius,z,point);
        if(j===0)ctx.moveTo(point.x,point.y);
        else ctx.lineTo(point.x,point.y);
      }
      ctx.lineWidth=5;
      ctx.strokeStyle='rgba(103,151,255,'+(alpha*.18)+')';
      ctx.stroke();
      ctx.lineWidth=.8;
      ctx.strokeStyle='rgba(128,171,255,'+alpha+')';
      ctx.stroke();
    }
  }
  function drawTraces(){
    for(var i=0;i<traces.length;i++){
      var trace=traces[i],z=NEAR+wrap(trace.z-camera,DEPTH-NEAR);
      var length=trace.nodes[trace.nodes.length-1][0];
      if(z+length>DEPTH)continue;
      var alpha=.045+Math.pow(1-z/DEPTH,2)*.28;
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
      project(star.x,star.y,z,point);
      if(point.x<-10 || point.x>width+10 || point.y<-10 || point.y>height+10)continue;
      var depth=1-z/DEPTH;
      var size=clamp(point.scale*star.size,.45,3.2);
      var edgeFade=star.span<DEPTH-NEAR ? clamp((star.span+NEAR-z)/6,0,1) : 1;
      var opacity=clamp((.15+depth*.6)*star.brightness*edgeFade,0,1);
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
      ctx.strokeStyle='rgba(108,158,255,'+(.12+motion*.3)+')';
      ctx.stroke();
    }
  }
  function drawAperture(){
    project(0,0,DEPTH,other);
    var radius=focal*RADIUS/DEPTH*1.25;
    var fog=ctx.createRadialGradient(other.x,other.y,0,other.x,other.y,radius);
    fog.addColorStop(0,'rgba(2,4,12,.94)');
    fog.addColorStop(.56,'rgba(2,4,12,.8)');
    fog.addColorStop(.84,'rgba(26,52,117,.08)');
    fog.addColorStop(1,'rgba(2,4,12,0)');
    ctx.fillStyle=fog;
    ctx.fillRect(other.x-radius,other.y-radius,radius*2,radius*2);
  }
  function draw(){
    if(!width || !height)return;
    ctx.clearRect(0,0,width,height);
    samplePath();
    drawRails();
    drawGates();
    drawTraces();
    drawStars();
    drawAperture();
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
    if(reduced){camera=8;velocity=0;motion=0;}
    draw();
    if(!reduced && (Math.abs(target-camera)>.003 || motion>.006))schedule();
    else{velocity=0;motion=0;lastTime=0;}
  }
  function schedule(){
    if(!frame && !document.hidden)frame=requestAnimationFrame(update);
  }
  function resize(){
    var bounds=host.getBoundingClientRect();
    width=Math.max(1,Math.round(bounds.width));
    height=Math.max(1,Math.round(bounds.height));
    focal=Math.min(width,height)*.88;
    mobile=width<=760;
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
    camera=reduced ? 8 : scrollTarget();
    target=camera;velocity=0;motion=0;lastTime=0;
    schedule();
  }
  if(motionQuery.addEventListener)motionQuery.addEventListener('change',onMotionChange);
  else if(motionQuery.addListener)motionQuery.addListener(onMotionChange);
  window.addEventListener('scroll',function(){if(!reduced)schedule();},{passive:true});
  window.addEventListener('resize',resize);
  window.addEventListener('pageshow',resize);
  document.addEventListener('visibilitychange',function(){
    if(frame){cancelAnimationFrame(frame);frame=0;}
    velocity=0;motion=0;lastTime=0;
    if(!document.hidden)resize();
  });
  makePaints();
  resize();
})();
