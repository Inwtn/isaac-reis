(function(){
  'use strict';
  window.createPortfolioRefraction=function(){
    var size=340,radius=size/2,clones=new Map();
    var root=document.createElement('div');
    root.className='refraction-lens';root.setAttribute('aria-hidden','true');root.inert=true;
    root.innerHTML='<div class="refraction-surface"><canvas class="refraction-background"></canvas><div class="refraction-scene"></div></div>';
    document.body.appendChild(root);
    var background=root.querySelector('canvas'),scene=root.querySelector('.refraction-scene');
    background.width=size;background.height=size;
    var paint=background.getContext('2d');
    if(!paint){root.remove();return {render:function(){}};}

    function clonePanel(record){
      var section=record.slot.closest('section');
      var context=document.createElement('div');
      context.className='refraction-context '+(section ? section.className : '')+(record.panel.classList.contains('story-content') ? ' story-step' : '');
      var copy=record.panel.cloneNode(true);
      copy.removeAttribute('id');
      copy.querySelectorAll('[id]').forEach(function(node){node.removeAttribute('id');});
      copy.querySelectorAll('a,button,[tabindex]').forEach(function(node){node.setAttribute('tabindex','-1');});
      context.appendChild(copy);scene.appendChild(context);
      return {context:context,panel:copy,words:Array.prototype.slice.call(copy.querySelectorAll('.motion-word'))};
    }
    return {render:function(state){
      var pointer=state.pointer;
      if(state.disabled || pointer.strength<.001){
        root.style.visibility='hidden';
        clones.forEach(function(copy){copy.context.remove();});clones.clear();
        return;
      }
      root.style.visibility='visible';root.style.opacity=pointer.strength.toFixed(3);
      var left=pointer.x-radius,top=pointer.y-radius;
      root.style.transform='translate3d('+left.toFixed(2)+'px,'+top.toFixed(2)+'px,0)';
      scene.style.width=state.width+'px';scene.style.height=state.height+'px';
      scene.style.transform='translate3d('+(-left).toFixed(2)+'px,'+(-top).toFixed(2)+'px,0)';

      paint.clearRect(0,0,size,size);
      // Opaque backing replaces the original pixels inside the lens, avoiding a ghost copy.
      var glow=paint.createRadialGradient(state.width*.5-left,state.height*.48-top,0,state.width*.5-left,state.height*.48-top,Math.max(state.width,state.height)*.7);
      glow.addColorStop(0,'#101010');glow.addColorStop(.42,'#070707');glow.addColorStop(.78,'#030303');
      paint.fillStyle=glow;paint.fillRect(0,0,size,size);
      var scaleX=state.canvas.width/state.width,scaleY=state.canvas.height/state.height;
      var sourceLeft=Math.max(0,left),sourceTop=Math.max(0,top);
      var sourceWidth=Math.min(state.width,left+size)-sourceLeft;
      var sourceHeight=Math.min(state.height,top+size)-sourceTop;
      if(sourceWidth>0 && sourceHeight>0){
        paint.drawImage(state.canvas,sourceLeft*scaleX,sourceTop*scaleY,sourceWidth*scaleX,sourceHeight*scaleY,sourceLeft-left,sourceTop-top,sourceWidth,sourceHeight);
      }
      var active=new Set();
      state.panels.forEach(function(record){
        if(record.progress<-.68 || record.progress>1.4 || Number(record.panel.style.opacity)<.01)return;
        active.add(record);
        var copy=clones.get(record);
        if(!copy){copy=clonePanel(record);clones.set(record,copy);}
        copy.context.style.zIndex=record.slot.style.zIndex;
        copy.panel.style.cssText=record.panel.style.cssText;
        copy.panel.style.left=record.centerX+'px';
        copy.panel.style.top=(record.top-state.scrollY+record.slotHeight*.5)+'px';
        record.words.forEach(function(word,index){if(copy.words[index])copy.words[index].style.transform=word.style.transform;});
      });
      clones.forEach(function(copy,record){if(!active.has(record)){copy.context.remove();clones.delete(record);}});
    }};
  };
})();
