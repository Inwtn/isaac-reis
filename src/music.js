// Original 32-bar pastoral loop. Scheduled on the audio clock, with short lookahead.
export function createMusic(){
 let ctx,bus,timer=null,step=0,next=0,enabled=false;
 const beat=60/76,notes={C:261.63,D:293.66,E:329.63,F:349.23,G:392,A:440,B:493.88};
 const melody=[['E','G','A','G','E','D','C',null],['D','E','G',null,'E','D','C',null],['A','G','E','G','A','B','G',null],['F','E','D',null,'G','E','C',null],['E','G','C5','B','A','G','E',null],['D','F','A','G','F','E','D',null],['E','G','A',null,'G','E','D',null],['F','E','D','G','C',null,null,null]];
 const chords=[[130.81,164.81,196],[110,130.81,164.81],[174.61,220,261.63],[98,123.47,146.83]];
 function voice(hz,start,length,volume,type='sine'){
  const o=ctx.createOscillator(),v=ctx.createGain(),filter=ctx.createBiquadFilter();o.type=type;o.frequency.value=hz;filter.type='lowpass';filter.frequency.value=1700;v.gain.setValueAtTime(0,start);v.gain.linearRampToValueAtTime(volume,start+.025);v.gain.exponentialRampToValueAtTime(.0001,start+length);o.connect(filter).connect(v).connect(bus);o.start(start);o.stop(start+length+.02);
 }
 function schedule(){if(!enabled||ctx.state!=='running')return;if(next<ctx.currentTime-.1)next=ctx.currentTime+.05;while(next<ctx.currentTime+.25){const bar=Math.floor(step/8)%32,pos=step%8,n=melody[Math.floor(bar/4)%8][pos];if(n){const hz=n==='C5'?523.25:notes[n];voice(hz,next,beat*1.65,.036,'triangle');voice(hz*2,next+.012,beat*.65,.008);}if(pos===0)chords[Math.floor(bar/2)%4].forEach(h=>voice(h,next,beat*7,.012));if(pos===0||pos===4)voice(chords[Math.floor(bar/2)%4][0]/2,next,beat*2,.025);if(pos===2||pos===6)voice(chords[Math.floor(bar/2)%4][2],next,beat*1.8,.013,'triangle');step++;next+=beat/2;}}
 return {async set(on){ctx??=new AudioContext();if(!bus){bus=ctx.createGain();bus.gain.value=0;bus.connect(ctx.destination);}await ctx.resume();enabled=on;bus.gain.cancelScheduledValues(ctx.currentTime);bus.gain.setTargetAtTime(on?.72:0,ctx.currentTime,.15);clearInterval(timer);if(on){next=ctx.currentTime+.05;schedule();timer=setInterval(schedule,100);}},get enabled(){return enabled;},get context(){return ctx;},effect(hz,duration=.12,volume=.025){if(enabled&&ctx)voice(hz,ctx.currentTime,duration,volume);}};
}
