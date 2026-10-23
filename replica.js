(function(){
  'use strict';
  var app=window.Replica,projects=window.REFERENCE_PROJECTS,energy={current:0},raf=0,homeScroll=0;
  var pg='playground-module-scss-module__dz0hOa__',ct='contacts-module-scss-module__UjTc3a__',wd='world-module-scss-module__0gp3fG__';
  var section=document.querySelector('.'+pg+'playground'),track,stage,kicker=document.querySelector('.'+pg+'kickerLabel'),closing=document.querySelector('.'+pg+'closingLine');
  var content=document.querySelector('main.content'),projectPage=document.getElementById('project-page'),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.__replicaHome=true;
  function element(tag,className,text){var e=document.createElement(tag);if(className)e.className=className;if(text!=null)e.textContent=text;return e;}
  function smooth(value){var p=Math.max(0,Math.min(1,value));return p*p*p*(p*(6*p-15)+10);}
  function localVideo(project){return 'assets/replica/'+project.video.split('/').pop();}
  function mountGallery(){
    stage=element('div',pg+'stage');stage.dataset.active='false';var marquee=element('div',pg+'marquee');marquee.dataset.marquee='projects';track=element('div',pg+'track');track.dataset.exiting='true';
    projects.slice().reverse().forEach(function(project){
      var tile=element('div',pg+'tile'),link=element('a',pg+'tileLink');link.href='#project/'+project.slug;link.dataset.project=project.slug;
      var placeholder=element('div');link.appendChild(placeholder);tile.appendChild(link);
      var caption=element('div',pg+'caption'),title=element('a',pg+'captionTitle t-30',project.title);title.href=link.href;title.dataset.project=project.slug;
      var meta=element('span',pg+'captionMeta');if(project.info)meta.appendChild(element('span',pg+'captionInfo t-20',project.info));meta.appendChild(element('span',pg+'captionYear t-20',project.year));caption.append(title,meta);tile.appendChild(caption);track.appendChild(tile);
      app.mount(68213,{video:localVideo(project),className:pg+'tileMedia',energyRef:energy},placeholder,'VideoSurface');
    });
    marquee.appendChild(track);stage.appendChild(marquee);section.appendChild(stage);requestAnimationFrame(function(){track.dataset.exiting='false';});
  }
  function galleryLayout(){
    var W=innerWidth,H=innerHeight,portrait=W<H,extra=.09*W+(portrait?.9*H:0),reveal=2*H;
    var start=-(W*(projects.length*(portrait?85:50)+(projects.length-1)*12)/100)-extra,travel=W+extra-start;
    var height=Math.max(travel/(portrait?.6:1)-reveal+H,H);section.style.height=height+'px';return {reveal:reveal,start:start,travel:travel,speed:portrait?.6:1};
  }
  var measured;
  function galleryScroll(){
    if(!measured||!window.__replicaHome)return;var b=section.getBoundingClientRect(),visible=b.top<measured.reveal&&b.bottom>0;stage.dataset.active=String(visible);
    if(!visible){kicker.dataset.active='false';closing.dataset.active='false';window.__playgroundClosing=b.bottom<=0?1:0;return;}
    var p=Math.min(Math.max(measured.reveal-b.top,0)*measured.speed,measured.travel)/measured.travel;
    track.style.transform='translateX('+(measured.start+smooth(p)*measured.travel)+'px)';
    var start=innerWidth<innerHeight?.4:.6,ending=smooth((p-start)/(1-start));window.__playgroundClosing=ending;
    var active=b.bottom>.6*innerHeight,work=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--work-ready'))||0;
    kicker.dataset.active=String(active&&!(ending>.5)&&!(work>.15));closing.dataset.active=String(active&&ending>.5);
  }
  function worldRing(){
    var svg=document.querySelector('.'+wd+'ring'),size=svg.clientWidth,half=size/2,radius=size*.46;svg.setAttribute('viewBox','0 0 '+size+' '+size);
    svg.innerHTML='<defs><path id="ring-top" d="M '+(half-radius)+','+half+' A '+radius+','+radius+' 0 0 1 '+(half+radius)+','+half+'"/><path id="ring-bottom" d="M '+(half+radius)+','+half+' A '+radius+','+radius+' 0 0 1 '+(half-radius)+','+half+'"/></defs><text class="'+wd+'ringText" text-anchor="middle"><textPath href="#ring-top" startOffset="50%">Working globally</textPath></text><text class="'+wd+'ringText" text-anchor="middle"><textPath href="#ring-bottom" startOffset="50%">Available everywhere</textPath></text>';
  }
  function contact(){
    var email=document.querySelector('.'+ct+'emailShell');if(!email)return;var b=email.getBoundingClientRect();window.__contactFocus=smooth(1-Math.abs(b.top+b.height/2-innerHeight/2)/(innerHeight/2));window.__contactEmailRect={left:b.left,top:b.top,width:b.width,height:b.height};
    if(b.top<innerHeight*.9)email.dataset.entered='true';
  }
  function contactParticles(){
    var email=document.querySelector('.'+ct+'emailShell'),holder=email.querySelector('.particle-disintegrate-module-scss-module__n_XUIq__particles'),control={current:null};
    app.mount(41169,{children:'isaacreis.dev@gmail.com',ref:control,direction:'left',duration:800,particlesAmountCoefficient:20,elClassName:ct+'email t-85'},holder);
    email.addEventListener('mouseenter',function(){if(!reduced)control.current.disintegrate();});
    var linkedin=document.querySelector('.'+ct+'linkedin'),wrapper=linkedin.closest('.particle-disintegrate-module-scss-module__n_XUIq__particles'),link=wrapper.closest('a'),ref={current:null};
    app.mount(41169,{children:'LinkedIn',ref:ref,direction:'left',className:ct+'linkedinParticles',elClassName:ct+'linkedin'},wrapper);link.addEventListener('mouseenter',function(){if(!reduced)ref.current.disintegrate();});
  }
  function openProject(slug){
    var project=projects.find(function(p){return p.slug===slug;});if(!project)return;
    if(window.__replicaHome)homeScroll=scrollY;window.__replicaHome=false;window.__contactFocus=0;content.hidden=true;projectPage.hidden=false;projectPage.replaceChildren();
    var back=element('a','project-back','← Back to works');back.href='#work';projectPage.appendChild(back);projectPage.appendChild(element('h1','',project.title));projectPage.appendChild(element('p','project-year',project.year));
    var video=element('video');video.src=localVideo(project);video.autoplay=true;video.loop=true;video.muted=true;video.playsInline=true;projectPage.appendChild(video);
    var copy=element('div','project-copy'),description=element('div'),details=element('div');(project.description||[]).forEach(function(p){description.appendChild(element('p','',p));});
    if(project.collaboration)details.appendChild(element('p','',project.collaboration));if(project.stack)details.appendChild(element('p','project-stack',Array.isArray(project.stack)?project.stack.join(' / '):project.stack));copy.append(description,details);projectPage.appendChild(copy);
    var live=element('a','project-live','Visit website ↗');live.href=project.href;live.target='_blank';live.rel='noopener noreferrer';projectPage.appendChild(live);window.__lenis?.scrollTo(0,{immediate:true});window.scrollTo(0,0);
  }
  function route(){
    var slug=location.hash.match(/^#project\/(.+)$/);if(slug){openProject(decodeURIComponent(slug[1]));return;}
    if(!window.__replicaHome){window.__replicaHome=true;content.hidden=false;projectPage.hidden=true;window.__lenis?.scrollTo(homeScroll,{immediate:true});window.scrollTo(0,homeScroll);}
  }
  function preloader(){
    if(reduced)return;
    var overlay=element('div','replica-preloader'),label=element('span','','0');overlay.appendChild(label);document.body.appendChild(overlay);document.body.dataset.preloading='true';window.__preloaderRingMix=1;
    var begun=performance.now(),frame;
    function draw(now){var progress=Math.min(1,(now-begun)/2500);label.textContent=String(Math.round(progress*100));window.__preloaderRingMix=1-smooth((progress-.7)/.3);if(progress<1)frame=requestAnimationFrame(draw);else{window.__preloaderRingMix=0;document.body.dataset.preloading='false';overlay.classList.add('is-leaving');window.__lenis?.start();setTimeout(function(){overlay.remove();},650);}}
    frame=requestAnimationFrame(draw);
  }
  // Keep the original framing and the actual production morph parameters.
  try{
    preloader();
    app.mount(17543,{className:'particle-scene',src:window.REFERENCE_PARTICLES['portrait.bin'],italySrc:window.REFERENCE_PARTICLES['italy.bin'],horizontalOffset:.15,bottomOffset:-.09,formationDuration:4,morphDistance:.6,morphStart2:2.3,morphDistance2:.7,morphStart3:3.4,morphDistance3:.6,workSlideDistance:1.5},document.querySelector('.particle-scene'));
    app.mount(91287,{},document.querySelector('.custom-cursor-module-scss-module__JG2xJG__cursor'));
    app.mount(35117);mountGallery();contactParticles();app.mount(77310);measured=galleryLayout();worldRing();window.__contactMountId=1;contact();galleryScroll();
    var lastY=scrollY,lastTime=performance.now();
    function update(now){var delta=now-lastTime;if(delta>0){var target=Math.min(Math.abs(scrollY-lastY)/delta/3,1);energy.current+=(target-energy.current)*.1;}lastY=scrollY;lastTime=now;galleryScroll();if(window.__replicaHome)contact();raf=requestAnimationFrame(update);}
    raf=requestAnimationFrame(update);window.addEventListener('resize',function(){measured=galleryLayout();worldRing();galleryScroll();});window.addEventListener('hashchange',route);route();
    var monogram=document.querySelector('.monogram-module-scss-module__K070Ja__wrap'),tip=document.querySelector('.monogram-module-scss-module__K070Ja__tooltip');monogram.addEventListener('mouseenter',function(){monogram.dataset.hovered='true';tip.dataset.visible='true';});monogram.addEventListener('mouseleave',function(){monogram.dataset.hovered='false';tip.dataset.visible='false';});
    document.documentElement.dataset.replica='ready';
  }catch(error){document.body.dataset.preloading='false';document.documentElement.dataset.replica='error';console.error('Local reference scene:',error);}
})();
