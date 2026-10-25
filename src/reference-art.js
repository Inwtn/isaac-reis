import outdoors from './assets/sv/outdoors.png';
import log from './assets/sv/log-cabin.png';
import stone from './assets/sv/stone-cabin.png';
import shed from './assets/sv/shed.png';
import spring from './assets/sv/tree-spring.png';
import fall from './assets/sv/tree-fall.png';
import horse from './assets/sv/horse.png';
import furniture from './assets/sv/furniture.png';
import farmhouse from './assets/sv/farmhouse.png';
import walls from './assets/sv/walls-floors.png';
export async function loadReferenceArt(){
 const entries=await Promise.all(Object.entries({outdoors,log,stone,shed,spring,fall,horse,furniture,farmhouse,walls}).map(async([key,url])=>{
  const image=new Image();image.src=url;await image.decode();return [key,image];
 }));return Object.fromEntries(entries);
}
