/* Shared scene math: the browser and offline previews use the same projection. */
(function(root){
  'use strict';
  var TAU=Math.PI*2;
  function clamp(x,a,b){return Math.max(a,Math.min(b,x));}
  function mix(a,b,t){return a+(b-a)*t;}
  function smooth(t){t=clamp(t,0,1);return t*t*(3-2*t);}
  var brazil=[[-.87,.82],[-.50,.91],[-.33,1.06],[-.12,.94],[.05,.98],[.20,.86],[.42,.85],[.55,.70],[.98,.53],[1.04,.32],[.89,.15],[.79,-.08],[.61,-.20],[.53,-.53],[.31,-.64],[.19,-.83],[-.08,-1.06],[-.23,-.91],[-.12,-.73],[-.36,-.56],[-.47,-.29],[-.65,-.20],[-.64,.03],[-.90,.08],[-1.05,.30],[-.98,.55]];
  function inside(x,y){var yes=false;for(var i=0,j=brazil.length-1;i<brazil.length;j=i++){var a=brazil[i],b=brazil[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])yes=!yes;}return yes;}
  function build(encoded,count){
    var binary=atob(encoded),bytes=new Uint8Array(binary.length);for(var i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
    var mesh=new DataView(bytes.buffer),front=[];for(i=0;i<bytes.length;i+=12)if(mesh.getInt16(i+10,true)>-3500)front.push(i);
    count=Math.min(count||18000,front.length);var seed=731;
    function random(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}
    var points={count:count,head:new Float32Array(count*3),normals:new Float32Array(count*3),sphere:new Float32Array(count*3),brazil:new Float32Array(count*3),cloud:new Float32Array(count*3),seeds:new Float32Array(count*3),stars:new Float32Array(650*4)};
    for(i=0;i<count;i++){
      var offset=front[Math.floor(i*front.length/count)],k=i*3;
      for(var a=0;a<3;a++){points.head[k+a]=mesh.getInt16(offset+a*2,true)/10000;points.normals[k+a]=mesh.getInt16(offset+6+a*2,true)/30000;points.seeds[k+a]=random();}
      points.head[k+1]-=.08;
      var sy=1-2*(i+.5)/count,angle=i*2.39996323,r=Math.sqrt(1-sy*sy);
      points.sphere[k]=r*Math.cos(angle)*1.08;points.sphere[k+1]=sy*1.08;points.sphere[k+2]=r*Math.sin(angle)*1.08;
      var x,y;do{x=random()*2.2-1.1;y=random()*2.2-1.1;}while(!inside(x,y));
      points.brazil[k]=x;points.brazil[k+1]=y;points.brazil[k+2]=(random()-.5)*.14;
      var t=random()*TAU,v=random()*TAU,radius=.74+.28*Math.cos(3*t+v);
      points.cloud[k]=Math.cos(t)*radius;points.cloud[k+1]=Math.sin(t)*radius;points.cloud[k+2]=Math.sin(3*t+v)*.55;
    }
    for(i=0;i<points.stars.length;i+=4){points.stars[i]=random();points.stars[i+1]=random();points.stars[i+2]=random();points.stars[i+3]=random();}
    return points;
  }
  function timeline(layout){
    var H=layout.h,mobile=layout.w<700,globeScale=Math.min(.30,layout.w/H*.33),mapScale=Math.min(.32,layout.w/H*.38);
    function key(y,shape,x,scale,yaw,opacity){return {y:y,shape:shape,x:x,scale:scale,yaw:yaw,opacity:opacity};}
    return [key(0,0,0,.29,-.15,1),key(layout.intro,0,mobile?.11:.23,mobile?.26:.30,-.45,1),key(layout.world-.15*H,1,0,globeScale,0,.95),key(layout.world+.35*H,1,0,globeScale,.25,.95),key(layout.location-.12*H,2,0,mapScale,-.1,.95),key(layout.location+.38*H,2,0,mapScale,.15,.95),key(layout.approach-.10*H,3,0,.39,.15,.7),key(layout.work,3,0,.40,.3,.25),key(layout.workEnd-.25*H,3,0,.40,.5,.22),key(layout.outro+.25*H,4,0,.39,.2,.8),key(layout.outro+.65*H,4,0,.39,.5,.8),key(layout.contact-.05*H,5,0,.31,0,.8),key(layout.contact+.5*H,5,0,.31,0,.8)];
  }
  function stateAt(y,keys){
    var index=0;while(index<keys.length-2&&y>keys[index+1].y)index++;
    var a=keys[index],b=keys[index+1],t=smooth((y-a.y)/Math.max(1,b.y-a.y));
    return {from:a.shape,to:b.shape,t:t,x:mix(a.x,b.x,t),scale:mix(a.scale,b.scale,t),yaw:mix(a.yaw,b.yaw,t),opacity:mix(a.opacity,b.opacity,t)};
  }
  function shapePoint(points,id,i,time,frameW,frameH,out){
    var k=i*3,seed=points.seeds[k];
    if(id===0||id===1||id===2){var source=id===0?points.head:id===1?points.sphere:points.brazil;out[0]=source[k];out[1]=source[k+1];out[2]=source[k+2];return;}
    if(id===3||id===4){
      // Reorient one double helix from a horizontal axis into a receding tunnel.
      var rung=i%6===0,u=rung?(Math.floor(points.seeds[k+1]*24)+.5)/24:points.seeds[k+1];
      var angle=u*TAU*2.2+time*.28,strand=seed<.5?-1:1,radial=rung?(points.seeds[k+2]*2-1):strand;
      var thickness=(seed-.5)*.025,cy=Math.cos(angle)*(radial*.5+thickness),cz=Math.sin(angle)*(radial*.5+thickness);
      if(id===3){out[0]=(u-.5)*5.2;out[1]=cy;out[2]=cz;}
      else{out[0]=cy*2.4;out[1]=cz*2.4;out[2]=1.6-u*7;}
      return;
    }
    var distance=seed*4*(frameW+frameH),jitter=(points.seeds[k+1]-.5)*.16;
    if(distance<2*frameW){out[0]=-frameW+distance;out[1]=frameH+jitter;}
    else if(distance<2*frameW+2*frameH){out[0]=frameW+jitter;out[1]=frameH-(distance-2*frameW);}
    else if(distance<4*frameW+2*frameH){out[0]=frameW-(distance-2*frameW-2*frameH);out[1]=-frameH+jitter;}
    else{out[0]=-frameW+jitter;out[1]=-frameH+(distance-4*frameW-2*frameH);}
    out[2]=(points.seeds[k+2]-.5)*.04;
  }
  function project(points,state,view,out){
    var width=view.width,height=view.height,time=view.time||0,pointer=view.pointer||{x:-1000,y:-1000,strength:0};
    var base=height*state.scale,frameW=(view.frameWidth||width*.76)/2/(height*.31),frameH=(view.frameHeight||180)/2/(height*.31);
    var a=[0,0,0],b=[0,0,0],yaw=state.yaw+Math.sin(time*.36)*.11+(pointer.x/width-.5)*.12*(pointer.strength||0),c=Math.cos(yaw),s=Math.sin(yaw);
    var globeWeight=(state.from===1?1-state.t:0)+(state.to===1?state.t:0),tunnelWeight=(state.from===4?1-state.t:0)+(state.to===4?state.t:0);yaw=yaw*(1-tunnelWeight)+time*globeWeight*.09;c=Math.cos(yaw);s=Math.sin(yaw);
    var t=state.t,burst=Math.sin(t*Math.PI)*.055,opacity=state.opacity,lightRadius=height*.5;
    var headWeight=(state.from===0?1-t:0)+(state.to===0?t:0),frameWeight=(state.from===5?1-t:0)+(state.to===5?t:0);
    for(var i=0;i<points.count;i++){
      var k=i*3,o=i*4,seed=points.seeds[k];
      shapePoint(points,state.from,i,time,frameW,frameH,a);shapePoint(points,state.to,i,time,frameW,frameH,b);
      var x=mix(a[0],b[0],t)+Math.sin(seed*40+time*.7)*burst,y=mix(a[1],b[1],t),z=mix(a[2],b[2],t);
      var angle=yaw*(1-frameWeight),cc=frameWeight>.001?Math.cos(angle):c,ss=frameWeight>.001?Math.sin(angle):s;
      var rx=x*cc-z*ss,rz=x*ss+z*cc,perspective=3.8/(3.8-rz);
      var px=width*(.5+state.x)+rx*base*perspective,py=height*.5-y*base*perspective;
      var dx=px-pointer.x,dy=py-pointer.y,proximity=smooth(1-Math.sqrt(dx*dx+dy*dy)/lightRadius)*(pointer.strength||0);
      var normalLight=Math.max(0,-points.normals[k]*.35+points.normals[k+1]*.30+points.normals[k+2]*.87);
      var normalVisibility=clamp((points.normals[k+2]+.12)*3,0,1);
      var tone=mix(.24+seed*.34,(.12+normalLight*.85)*normalVisibility,headWeight);
      var twinkle=.82+.18*Math.sin(time*1.4+seed*TAU),brightness=clamp(tone*(1+proximity*2)*opacity*twinkle,.015,1);
      out[o]=px;out[o+1]=py;out[o+2]=brightness;out[o+3]=(.65+points.seeds[k+2]*.65)*clamp(perspective,.45,1.8);
    }
    var start=points.count*4;
    for(i=0;i<points.stars.length;i+=4){var n=start+i,depth=points.stars[i+2];out[n]=((points.stars[i]+Math.sin(time*.055+depth*30)*.008)%1)*width;out[n+1]=((points.stars[i+1]+Math.cos(time*.06+depth*20)*.006)%1)*height;out[n+2]=.04+depth*.12;out[n+3]=.5+depth*.8;}
    return out;
  }
  var api={build:build,timeline:timeline,stateAt:stateAt,project:project,smooth:smooth,mix:mix,clamp:clamp};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.JourneyCore=api;
})(typeof window!=='undefined'?window:globalThis);
