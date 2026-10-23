// Geometry proof, rendered from the exact scene math used by the website.
const fs=require('node:fs'),vm=require('node:vm'),zlib=require('node:zlib'),Core=require('../journey-core.js');
const scope={window:{}};vm.runInNewContext(fs.readFileSync('assets/portrait-mesh.js','utf8'),scope);
const points=Core.build(scope.window.PORTFOLIO_PORTRAIT,22000),output=new Float32Array((points.count+650)*4);
const cw=600,ch=420,w=cw*2,h=ch*3,pixels=new Float32Array(w*h);pixels.fill(38);
function dot(x,y,alpha,size){const radius=Math.max(.65,size/2);for(let yy=Math.floor(y-radius);yy<=Math.ceil(y+radius);yy++)for(let xx=Math.floor(x-radius);xx<=Math.ceil(x+radius);xx++){if(xx<0||xx>=w||yy<0||yy>=h)continue;const r=Math.hypot(xx+.5-x,yy+.5-y)/radius;if(r>1)continue;const idx=yy*w+xx;pixels[idx]=Math.min(252,pixels[idx]+230*alpha*Math.pow(1-r,.42));}}
const scales=[.29,.30,.32,.39,.39,.31];
for(let stage=0;stage<6;stage++){
 const state={from:stage,to:stage,t:0,x:0,scale:scales[stage],yaw:stage===0?-.15:stage===5?0:.15,opacity:stage===3?.7:.95};
 Core.project(points,state,{width:cw,height:ch,time:1,pointer:{x:cw*.6,y:ch*.35,strength:stage===0?.7:0},frameWidth:500,frameHeight:150},output);
 const ox=(stage%2)*cw,oy=Math.floor(stage/2)*ch;
 for(let i=0;i<output.length;i+=4)if(output[i]>=0&&output[i]<cw&&output[i+1]>=0&&output[i+1]<ch)dot(ox+output[i],oy+output[i+1],output[i+2],output[i+3]);
}
const glyphs={A:['01110','10001','11111','10001','10001'],B:['11110','10001','11110','10001','11110'],C:['01111','10000','10000','10000','01111'],D:['11110','10001','10001','10001','11110'],E:['11111','10000','11110','10000','11111'],F:['11111','10000','11110','10000','10000'],G:['01111','10000','10111','10001','01110'],H:['10001','10001','11111','10001','10001'],I:['111','010','010','010','111'],L:['10000','10000','10000','10000','11111'],M:['10001','11011','10101','10001','10001'],N:['10001','11001','10101','10011','10001'],O:['01110','10001','10001','10001','01110'],P:['11110','10001','11110','10000','10000'],R:['11110','10001','11110','10100','10010'],S:['01111','10000','01110','00001','11110'],T:['11111','00100','00100','00100','00100'],U:['10001','10001','10001','10001','01110'],V:['10001','10001','10001','01010','00100'],'1':['010','110','010','010','111'],'2':['111','001','111','100','111'],'3':['111','001','111','001','111'],'4':['101','101','111','001','001'],'5':['111','100','111','001','111'],'6':['111','100','111','101','111'],'.':['0','0','0','0','1']};
function text(str,x,y){for(const ch of str){const glyph=glyphs[ch];if(!glyph){x+=10;continue;}glyph.forEach((row,yy)=>[...row].forEach((bit,xx)=>{if(bit==='1')for(let a=0;a<2;a++)for(let b=0;b<2;b++)pixels[(y+yy*2+a)*w+x+xx*2+b]=160;}));x+=(glyph[0].length+1)*2;}}
['1. BUSTO','2. ESFERA','3. BRASIL','4. HELICE','5. TUNEL','6. CONTATO'].forEach((label,i)=>text(label,i%2*cw+20,Math.floor(i/2)*ch+20));
for(let y=0;y<h;y++)pixels[y*w+cw]=56;for(const yy of [ch,ch*2])for(let x=0;x<w;x++)pixels[yy*w+x]=56;
const raw=Buffer.alloc((w*4+1)*h);for(let y=0;y<h;y++)for(let x=0;x<w;x++){let p=y*(w*4+1)+1+x*4,v=Math.round(pixels[y*w+x]);raw[p]=v;raw[p+1]=v;raw[p+2]=Math.min(255,v+4);raw[p+3]=255;}
function crc(b){let c=-1;for(const byte of b){c^=byte;for(let k=0;k<8;k++)c=(c>>>1)^((c&1)?0xedb88320:0);}return(c^-1)>>>0;}
function chunk(type,b){let t=Buffer.from(type),n=Buffer.alloc(4),c=Buffer.alloc(4);n.writeUInt32BE(b.length);c.writeUInt32BE(crc(Buffer.concat([t,b])));return Buffer.concat([n,t,b,c]);}
const header=Buffer.alloc(13);header.writeUInt32BE(w);header.writeUInt32BE(h,4);header[8]=8;header[9]=6;
const path=process.argv[2];if(!path)throw Error('Provide output PNG path');
fs.writeFileSync(path,Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',zlib.deflateSync(raw)),chunk('IEND',Buffer.alloc(0))]));console.log(path);
