// Rebuild the particle asset from the CC-BY-3.0 Lee Perry-Smith scan.
const fs=require('fs');
const source=fs.readFileSync('assets/LeePerrySmith.glb');
const jsonLength=source.readUInt32LE(12);
const model=JSON.parse(source.toString('utf8',20,20+jsonLength));
const binary=source.subarray(28+jsonLength);
function accessor(index){const a=model.accessors[index],v=model.bufferViews[a.bufferView],start=(v.byteOffset||0)+(a.byteOffset||0),size=a.type==='VEC3'?3:1,read=a.componentType===5126?'readFloatLE':'readUInt16LE',bytes=a.componentType===5126?4:2;return Array.from({length:a.count*size},(_,i)=>binary[read](start+i*bytes));}
const primitive=model.meshes[0].primitives[0],pos=accessor(primitive.attributes.POSITION),norm=accessor(primitive.attributes.NORMAL),ind=accessor(primitive.indices);
let total=0;const areas=[];
for(let i=0;i<ind.length;i+=3){const a=ind[i]*3,b=ind[i+1]*3,c=ind[i+2]*3,ux=pos[b]-pos[a],uy=pos[b+1]-pos[a+1],uz=pos[b+2]-pos[a+2],vx=pos[c]-pos[a],vy=pos[c+1]-pos[a+1],vz=pos[c+2]-pos[a+2];total+=Math.hypot(uy*vz-uz*vy,uz*vx-ux*vz,ux*vy-uy*vx)*.5;areas.push(total);}
let seed=818;function random(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}
const count=64000,packed=Buffer.alloc(count*12);
for(let i=0;i<count;i++){
 const target=random()*total;let lo=0,hi=areas.length-1;while(lo<hi){let mid=(lo+hi)>>1;if(areas[mid]<target)lo=mid+1;else hi=mid;}
 const a=ind[lo*3]*3,b=ind[lo*3+1]*3,c=ind[lo*3+2]*3,r=Math.sqrt(random()),v=random(),weights=[1-r,r*(1-v),r*v];let normal=[];
 for(let j=0;j<3;j++){const value=pos[a+j]*weights[0]+pos[b+j]*weights[1]+pos[c+j]*weights[2];packed.writeInt16LE(Math.round(value*.34*10000),i*12+j*2);normal.push(norm[a+j]*weights[0]+norm[b+j]*weights[1]+norm[c+j]*weights[2]);}
 const length=Math.hypot(...normal);normal.forEach((n,j)=>packed.writeInt16LE(Math.round(n/length*30000),i*12+6+j*2));
}
fs.writeFileSync('assets/portrait-mesh.js','// Lee Perry-Smith / Infinite Realities. CC BY 3.0. See LeePerrySmith_License.txt.\nwindow.PORTFOLIO_PORTRAIT="'+packed.toString('base64')+'";\n');
console.log('Built '+count+' surface samples from '+ind.length/3+' triangles');
