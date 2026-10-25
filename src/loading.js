import {ui} from './content.js';
export async function loadGame(tasks){
 const bar=document.querySelector('#load-progress'),percent=document.querySelector('#load-percent'),message=document.querySelector('#load-message'),cat=document.querySelector('.loading-cat');
 const messages=ui.loading;let index=0;const timer=setInterval(()=>message.textContent=messages[++index%messages.length],1500),start=performance.now();let done=0;
 try{const results=[];for(const task of tasks){results.push(await task());const p=Math.round(++done/tasks.length*100);bar.setAttribute('aria-valuenow',p);bar.style.setProperty('--progress',p+'%');percent.textContent=p+'%';cat.style.left=p+'%';await new Promise(r=>setTimeout(r,120));}await new Promise(r=>setTimeout(r,Math.max(0,1500-(performance.now()-start))));clearInterval(timer);message.textContent=ui.ready;document.querySelector('#start-button').hidden=false;return results;}
 catch(error){clearInterval(timer);message.textContent=ui.failed;document.querySelector('#load-error').hidden=false;throw error;}
}
