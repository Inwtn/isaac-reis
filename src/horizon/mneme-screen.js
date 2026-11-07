export function mnemeScreen(){
 const candles=[[19,85,36],[47,70,29],[75,81,30],[103,52,34],[131,46,26],[159,59,35],[187,35,29],[215,46,28],[243,25,29],[271,30,25]];
 return `<div class="product-screen mneme-screen" aria-hidden="true">
  <div class="screen-toolbar"><span class="screen-mark">m.</span><span>MNEME</span><span class="screen-preview">INTERFACE CONCEPT</span></div>
  <div class="mneme-desk"><div class="mneme-desk-heading"><div><small>RESEARCH / FINANCIAL INTELLIGENCE</small><h4>Evidence before action.</h4></div><span>PAPER MODE</span></div>
   <div class="mneme-summary"><div><small>DATA</small><b>Collect</b></div><div><small>RESEARCH</small><b>Validate</b></div><div><small>OPERATIONS</small><b>Review</b></div></div>
   <div class="mneme-chart"><div><span>Market structure</span><small>ILLUSTRATIVE DATA</small></div><svg viewBox="0 0 310 150" fill="none"><path d="M0 25H310M0 60H310M0 95H310M0 130H310" stroke="#ffffff0c"/>${candles.map(([x,body,height],i)=>`<g stroke="${i%3===0?'#80748f':'#d8cbe8'}"><path d="M${x} ${body-12}v${height+24}"/><rect x="${x-4}" y="${body}" width="8" height="${height}" fill="${i%3===0?'#80748f44':'#c6b5da33'}"/></g>`).join('')}<path d="M0 135Q50 132 85 110T160 94T235 67T310 51" stroke="#bda5d780" stroke-dasharray="4 5"/><path d="M0 145Q75 145 125 115T235 100T310 82" stroke="#ffffff19"/></svg></div>
   <div class="mneme-pipeline"><span>DATA</span><i></i><span>MODEL</span><i></i><b>RISK GATE</b><i></i><span>JOURNAL</span></div><div class="mneme-review"><span>Every decision leaves a trail.</span><b>SIMULATED EXECUTION</b></div>
  </div><div class="screen-disclaimer">Illustrative workspace · no live orders or performance claims</div></div>`;
}
