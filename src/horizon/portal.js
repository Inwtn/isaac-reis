import * as THREE from 'three';
import horizon from './event-horizon.png';
export function createPortal(){
 const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
 const uniforms={uMap:{value:null},uTime:{value:0},uAspect:{value:innerWidth/innerHeight},uImageAspect:{value:16/9},uZoom:{value:1},uOpacity:{value:0},uMotion:{value:1},uLens:{value:0},uLensRadius:{value:.04},uPointer:{value:new THREE.Vector2()},uEntry:{value:0},uCursor:{value:new THREE.Vector2()}};
 const material=new THREE.ShaderMaterial({transparent:true,depthTest:false,depthWrite:false,toneMapped:false,uniforms,vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}',fragmentShader:`
 precision highp float;
 uniform sampler2D uMap;uniform float uTime,uAspect,uImageAspect,uZoom,uOpacity,uMotion,uLens,uLensRadius,uEntry;uniform vec2 uPointer,uCursor;varying vec2 vUv;
 void main(){
  vec2 lensCenter=uCursor*.5+.5;vec2 delta=vUv-lensCenter;float lensDistance=length(delta*vec2(uAspect,1.0));float lens=1.0-smoothstep(0.0,uLensRadius,lensDistance);vec2 uv=lensCenter+delta*(1.0-.22*lens*lens*uLens);
  if(uAspect<uImageAspect)uv.x=(uv.x-.5)*(uAspect/uImageAspect)+.5;else uv.y=(uv.y-.5)*(uImageAspect/uAspect)+.5;
  vec2 center=vec2(.70,.50);uv=(uv-center)/uZoom+center;uv+=uPointer*vec2(.002,-.001)*uMotion;
  vec2 p=(uv-center)*vec2(uImageAspect,1.0);float radius=length(p);float angle=atan(p.y,p.x);
  float band=smoothstep(.235,.34,radius)*(1.0-smoothstep(.65,1.15,radius));
  // Differential rotation: preserve the silhouette while the disk flows.
  float rotation=(sin(uTime*.22-radius*4.0)*.16+sin(uTime*.4-radius*9.0)*.06)*band*uMotion;
  float wave=(sin(radius*95.0-uTime*1.8+angle*4.0)*.0015+sin(angle*7.0+uTime*.5)*.0008)*band*uMotion;
  wave+=sin(radius*25.0-uTime*.6)*.003*smoothstep(.4,.6,radius)*(1.0-smoothstep(.6,1.5,radius))*uMotion;
  float a=angle+rotation;vec2 warped=vec2(cos(a),sin(a))*(radius+wave);vec2 sampleUv=center+warped/vec2(uImageAspect,1.0);
  vec3 color=texture2D(uMap,clamp(sampleUv,vec2(.001),vec2(.999))).rgb;
  // Fine photon filaments add definition without moving the event horizon.
  float rim=exp(-pow((radius-.307)/.004,2.0));
  color+=vec3(.65,.62,.72)*rim*.09;
  float flight=smoothstep(.15,.7,uEntry)*(1.0-smoothstep(.88,1.0,uEntry))*uMotion;
  float streak=pow(max(0.0,sin(angle*173.0+sin(angle*39.0)*3.0)),90.0);
  color+=vec3(.7,.67,.8)*streak*flight*.14*smoothstep(.05,.8,length((vUv-vec2(.5))*vec2(uAspect,1.0)));
  color*=1.0+sin(angle*11.0-uTime*.8+radius*35.0)*.035*band*uMotion;
  gl_FragColor=vec4(color,uOpacity);
  #include <colorspace_fragment>
 }`});
 const plane=new THREE.Mesh(new THREE.PlaneGeometry(2,2),material);scene.add(plane);let ready=false;
 const texture=new THREE.TextureLoader().load(horizon,t=>{t.colorSpace=THREE.SRGBColorSpace;uniforms.uMap.value=t;uniforms.uImageAspect.value=t.image.width/t.image.height;ready=true;document.body.classList.add('animated-horizon');});
 return {render(renderer,{time,motion,portal,pointer}){if(!ready||portal.opacity<.001)return;uniforms.uLens.value=motion&&document.body.classList.contains('custom-cursor')?1:0;uniforms.uLensRadius.value=30/innerHeight;uniforms.uEntry.value=portal.entry||0;uniforms.uCursor.value.set(portal.cursorX||0,portal.cursorY||0);uniforms.uTime.value=time;uniforms.uMotion.value=motion?1:0;uniforms.uAspect.value=innerWidth/innerHeight;uniforms.uZoom.value=motion?portal.zoom:1;uniforms.uOpacity.value=portal.opacity;uniforms.uPointer.value.set(pointer.x,pointer.y);renderer.render(scene,camera);},dispose(){texture.dispose();plane.geometry.dispose();material.dispose();}};
}
