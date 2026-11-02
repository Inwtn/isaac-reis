// A wheel burst that reaches the end must finish before a new gesture can exit.
// This keeps trackpad momentum from closing a story while it is still being read.
export function createScrollReturnGate(){
 let lastTime=-Infinity,startedAtEnd=false;
 return {
  wheel(deltaY,atEnd,now){
   const fresh=now-lastTime>180;
   lastTime=now;
   if(deltaY<=0){startedAtEnd=false;return false;}
   if(fresh)startedAtEnd=atEnd;
   return fresh&&startedAtEnd&&atEnd;
  },
  reset(){lastTime=-Infinity;startedAtEnd=false;}
 };
}
