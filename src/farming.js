import {farm} from './map.js';
const KEY='isaacs-valley-farm-v1';
export const GROW_SECONDS=35;
export function createFarm(saved){
 const plots=Array.from({length:farm.cols*farm.rows},(_,i)=>({x:farm.x+(i%farm.cols)*farm.spacing,y:farm.y+Math.floor(i/farm.cols)*farm.spacing,stage:i<3?'ripe':'empty',growth:0}));
 let coins=0;
 if(saved&&Number.isFinite(saved.coins)&&saved.coins>=0&&saved.plots?.length===plots.length){coins=Math.floor(saved.coins);saved.plots.forEach((p,i)=>{if(['empty','seed','watered','ripe'].includes(p.stage)){plots[i].stage=p.stage;plots[i].growth=Math.max(0,Math.min(GROW_SECONDS,Number(p.growth)||0));}});}
 return {plots,get coins(){return coins;},near(p){return plots.find(t=>Math.hypot(p.x-t.x,p.y-t.y)<23);},update(dt){let changed=false;for(const p of plots)if(p.stage==='watered'){p.growth+=dt;if(p.growth>=GROW_SECONDS){p.stage='ripe';changed=true;}}return changed;},action(p){if(p.stage==='ripe'){coins+=15;p.stage='empty';p.growth=0;return '+15 coins · Carrot harvested!';}if(p.stage==='empty'){p.stage='seed';return 'Carrot planted · E to water';}if(p.stage==='seed'){p.stage='watered';p.growth=0;return 'Watered! Growing in 35 seconds.';}return 'Growing… explore the valley while you wait.';},label(p){return {empty:'Plant carrot · free seeds',seed:'Water carrot',watered:'Carrot growing…',ripe:'Harvest carrot · +15 coins'}[p.stage];},save(){return {coins,plots:plots.map(({stage,growth})=>({stage,growth}))};}};
}
export function readFarm(){try{return JSON.parse(localStorage.getItem(KEY));}catch{return null;}}
export function saveFarm(farm){try{localStorage.setItem(KEY,JSON.stringify(farm.save()));}catch{}}
