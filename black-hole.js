(function(){
  'use strict';

  var vertexSource='attribute vec2 position;varying vec2 uv;void main(){uv=position;gl_Position=vec4(position,0.,1.);}';
  var fragmentSource=[
    'precision highp float;',
    'varying vec2 uv;uniform float clock;uniform vec2 gaze;uniform float resolution;',
    'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
    'float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}',
    'void main(){',
    ' float yaw=.2+gaze.x*.3+sin(clock*.09)*.12;',
    ' float pitch=.32+gaze.y*.13+sin(clock*.12)*.035;',
    ' vec3 eye=6.8*vec3(sin(yaw)*cos(pitch),sin(pitch),cos(yaw)*cos(pitch));',
    ' vec3 forward=normalize(-eye),right=normalize(cross(forward,vec3(0.,1.,0.))),up=cross(right,forward);',
    ' float roll=-.18+gaze.x*.045;vec2 screen=mat2(cos(roll),-sin(roll),sin(roll),cos(roll))*uv;',
    ' vec3 ray=normalize(forward+.63*(screen.x*right+screen.y*up));',
    ' float b=dot(eye,ray),disc=b*b-dot(eye,eye)+19.36;',
    ' if(disc<0.){gl_FragColor=vec4(0.);return;}',
    ' float start=max(0.,-b-sqrt(disc));vec3 p=eye+ray*(start+.01);',
    ' float emission=0.,opacity=0.,nearest=20.,captured=0.;',
    ' for(int i=0;i<80;i++){',
    '  float distance=length(p);nearest=min(nearest,distance);',
    '  if(distance<1.){captured=1.;break;}',
    '  if(distance>4.42 && i>2)break;',
    '  float stepSize=clamp(abs(p.y)*.36,.085,.26);',
    '  float radius=length(p.xz);',
    '  if(radius>1.42 && radius<3.85 && abs(p.y)<.2){',
    '   float angle=atan(p.z,p.x);',
    '   float orbit=angle-clock*1.1*pow(1.5/radius,1.5);',
    '   vec2 matter=vec2(cos(orbit),sin(orbit))*radius;',
    '   float turbulence=noise(matter*9.+vec2(radius*3.,0.))*.65+noise(matter*23.)*.35;',
    '   float streak=.5+.5*sin(radius*86.+turbulence*8.+sin(orbit*5.+radius*4.)*1.6);',
    '   float spiral=pow(.5+.5*sin(orbit*3.+radius*7.),8.);',
    '   float edge=smoothstep(1.42,1.65,radius)*(1.-smoothstep(2.8,3.85,radius));',
    '   float thickness=exp(-abs(p.y)*27.);',
    '   float density=thickness*edge*(.2+streak*.9+turbulence*.4+spiral*.55);',
    '   vec3 flow=normalize(vec3(-p.z,0.,p.x));',
    '   float beaming=clamp(1.+dot(flow,-ray)*.7,.35,1.7);',
    '   float heat=pow(1.6/radius,1.55)*beaming;',
    '   float absorb=1.-exp(-density*stepSize*6.);',
    '   emission+=(1.-opacity)*absorb*heat*1.7;',
    '   opacity+=(1.-opacity)*absorb*.62;',
    '  }',
    '  ray=normalize(ray-p*(.27*stepSize/(distance*distance*distance)));',
    '  p+=ray*stepSize;',
    ' }',
    ' float footprint=8.568/resolution;',
    ' captured=max(captured,1.-smoothstep(1.,1.+footprint,nearest));',
    ' float photon=exp(-abs(nearest-1.035)*44.)*.85*(1.-captured);',
    ' float impact=length(cross(eye,normalize(forward+.63*(screen.x*right+screen.y*up))));',
    ' float halo=exp(-max(0.,impact-1.)*1.8)*.045*(1.-captured);',
    ' float light=1.-exp(-(emission+photon+halo)*1.25);',
    ' float fade=1.-smoothstep(.86,1.,length(uv));',
    ' float alpha=mix(light,1.,captured)*fade;',
    ' gl_FragColor=vec4(vec3(mix(1.,light,captured)),alpha);',
    '}'
  ].join('\n');

  function createGPU(){
    var canvas=document.createElement('canvas'),gl;
    try{gl=canvas.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:false,powerPreference:'high-performance'});}catch(error){return null;}
    if(!gl)return null;
    var program=null,uniforms=null,lost=false;
    function initialize(){
      function compile(type,source){
        var shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);
        if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);return null;}
        return shader;
      }
      var vertex=compile(gl.VERTEX_SHADER,vertexSource),fragment=compile(gl.FRAGMENT_SHADER,fragmentSource);
      if(!vertex || !fragment)return false;
      program=gl.createProgram();gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);
      gl.deleteShader(vertex);gl.deleteShader(fragment);
      if(!gl.getProgramParameter(program,gl.LINK_STATUS))return false;
      gl.useProgram(program);
      var buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
      gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
      var location=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,2,gl.FLOAT,false,0,0);
      uniforms={clock:gl.getUniformLocation(program,'clock'),gaze:gl.getUniformLocation(program,'gaze'),resolution:gl.getUniformLocation(program,'resolution')};
      gl.clearColor(0,0,0,0);return true;
    }
    if(!initialize())return null;
    canvas.addEventListener('webglcontextlost',function(event){event.preventDefault();lost=true;});
    canvas.addEventListener('webglcontextrestored',function(){lost=!initialize();});
    return {render:function(state){
      if(lost || gl.isContextLost())return null;
      // Stable buffers avoid GPU reallocations on every scroll/zoom frame.
      var size=state.mobile ? 384 : 640;
      if(canvas.width!==size){canvas.width=canvas.height=size;gl.viewport(0,0,size,size);}
      gl.useProgram(program);gl.uniform1f(uniforms.clock,state.time);gl.uniform2f(uniforms.gaze,state.lookX,state.lookY);gl.uniform1f(uniforms.resolution,size);
      gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);return canvas;
    }};
  }

  function createFallback(){
    // Project orbiting 3D particles when WebGL is unavailable.
    var canvas=document.createElement('canvas'),ctx=canvas.getContext('2d'),particles=[],projected=[],seed=19;
    canvas.width=canvas.height=720;
    function random(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}
    for(var i=0;i<1200;i++){
      particles.push({radius:1.45+random()*2.2,angle:random()*Math.PI*2,height:(random()-.5)*.07,light:.3+random()*.7});
      projected.push({x:0,y:0,z:0,light:0,perspective:1});
    }
    return {render:function(state){
      if(!ctx)return null;
      var pitch=.32+state.lookY*.13+Math.sin(state.time*.12)*.035,yaw=.2+state.lookX*.3+Math.sin(state.time*.09)*.12;
      var cp=Math.cos(pitch),sp=Math.sin(pitch),cy=Math.cos(yaw),sy=Math.sin(yaw),scale=720/8.6;
      ctx.clearRect(0,0,720,720);ctx.save();ctx.translate(360,360);ctx.rotate(-.18+state.lookX*.045);
      var glow=ctx.createRadialGradient(0,0,scale*.9,0,0,scale*3.5);
      glow.addColorStop(0,'rgba(255,255,255,.14)');glow.addColorStop(.45,'rgba(220,220,220,.035)');glow.addColorStop(1,'rgba(255,255,255,0)');
      ctx.fillStyle=glow;ctx.fillRect(-360,-360,720,720);
      particles.forEach(function(p,index){
        var angle=p.angle+state.time*1.1*Math.pow(1.5/p.radius,1.5);
        var x=Math.cos(angle)*p.radius,z=Math.sin(angle)*p.radius;
        var viewX=x*cy-z*sy,depth=x*sy+z*cy;
        var y=p.height*cp-depth*sp;depth=depth*cp+p.height*sp;
        var perspective=6.8/(6.8-depth);
        var out=projected[index];out.x=viewX*perspective*scale;out.y=y*perspective*scale;out.z=depth;out.light=p.light;out.perspective=perspective;
      });
      function draw(front){
        projected.forEach(function(p){
          if((p.z>=0)!==front)return;
          // The foreground disk is also hidden wherever it is behind the sphere surface.
          var distance=(p.x*p.x+p.y*p.y)/(scale*scale);
          if(front && distance<1 && p.z<Math.sqrt(1-distance))return;
          ctx.fillStyle='rgba(255,255,255,'+(p.light*(front ? .8 : .5))+')';
          ctx.beginPath();ctx.ellipse(p.x,p.y,1.7*p.perspective,.6*p.perspective,-.1,0,Math.PI*2);ctx.fill();
        });
      }
      draw(false);
      ctx.beginPath();ctx.arc(0,0,scale,0,Math.PI*2);ctx.fillStyle='#010101';ctx.fill();
      ctx.shadowColor='#fff';ctx.shadowBlur=12;ctx.lineWidth=1.1;ctx.strokeStyle='rgba(255,255,255,.8)';ctx.stroke();ctx.shadowBlur=0;
      draw(true);ctx.restore();return canvas;
    }};
  }

  window.createBlackHoleScene=function(){
    var gpu=createGPU(),fallback=null;
    return {render:function(state){
      var image=gpu ? gpu.render(state) : null;
      if(image)return image;
      if(!fallback)fallback=createFallback();
      return fallback.render(state);
    }};
  };
})();
