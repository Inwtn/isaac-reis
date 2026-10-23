(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,77310,e=>{"use strict";var t=e.i(71645),i=e.i(18566);function o(e,t){let i=e.querySelectorAll(t);if(!i.length)return;let o=i.length>15?.015:.05;e.style.setProperty("--anim-stagger",`${o}s`),i.forEach((e,t)=>{e.style.setProperty("--anim-index",`${t}`)})}e.s(["default",0,function(){let e=(0,i.usePathname)();return(0,t.useEffect)(()=>{let e,t=Array.from(document.querySelectorAll(".split, .blur-anim")).filter(e=>!e.classList.contains("no-anim"));if(!t.length)return;for(let e of t){let t=.15+parseFloat(e.getAttribute("data-delay")??"0");e.style.setProperty("--anim-delay",`${t}s`),e.classList.contains("split")?(!function e(t){if(!t.querySelector(".word")){for(let i of Array.from(t.childNodes))if(i.nodeType===Node.TEXT_NODE){let e=i.nodeValue??"";if(!e.trim())continue;let t=document.createDocumentFragment();for(let i of e.split(/(\s+)/)){if(!i)continue;if(/^\s+$/.test(i)){t.append(i);continue}let e=document.createElement("span");e.className="word-wrapper";let o=document.createElement("span");o.className="word",o.textContent=i,e.append(o),t.append(e)}i.parentNode?.replaceChild(t,i)}else if(i.nodeType===Node.ELEMENT_NODE){if(i.classList.contains("no-anim"))continue;e(i)}}}(e),o(e,".word")):e.classList.contains("blur-anim")&&(!function(e){if(e.querySelector(".char"))return;let t=e.textContent??"";if(!t)return;e.getAttribute("aria-label")||e.setAttribute("aria-label",t);let i=document.createDocumentFragment();for(let e of Array.from(t)){let t=document.createElement("span");t.className="char",t.textContent=e,t.setAttribute("aria-hidden","true"),i.append(t)}e.replaceChildren(i)}(e),o(e,".char")),e.classList.add("is-split")}if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){for(let e of t)e.classList.add("is-visible");return}let i=new Map,n=e=>{let t=i.get(e);if(t)return t;let o=(e.trim().split(/\s+/).pop()??"90%").match(/^(top|center|bottom)?(?:([+-])=)?([\d.]+)?%?$/),n=90;if(o){let[,e,t,i]=o,r=i?parseFloat(i):0;n=e?(e?({top:0,center:50,bottom:100})[e]:0)+("-"===t?-r:r):r||90}let r=Math.min(Math.max(100-n,0),100),a=new IntersectionObserver(e=>{for(let t of e)t.isIntersecting&&(t.target.classList.add("is-visible"),a.unobserve(t.target))},{rootMargin:`0px 0px -${r}% 0px`});return i.set(e,a),a},r=()=>{for(let e of t)n(e.getAttribute("data-start")??"90%").observe(e)};return"true"===document.body.dataset.preloading?(e=new MutationObserver(()=>{"true"!==document.body.dataset.preloading&&(e?.disconnect(),r())})).observe(document.body,{attributes:!0,attributeFilter:["data-preloading"]}):r(),()=>{for(let t of(e?.disconnect(),i.values()))t.disconnect()}},[e]),null}])},43796,e=>{e.v({canvas:"custom-cursor-module-scss-module__JG2xJG__canvas",cursor:"custom-cursor-module-scss-module__JG2xJG__cursor",head:"custom-cursor-module-scss-module__JG2xJG__head"})},91287,e=>{"use strict";var t=e.i(43476),i=e.i(71645),o=e.i(43796);e.s(["default",0,function(){let e=(0,i.useRef)(null),n=(0,i.useRef)(null),r=(0,i.useRef)(null);return(0,i.useEffect)(()=>{if(!(window.matchMedia("(pointer: fine) and (hover: hover)").matches&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches))return;let t=e.current,i=n.current,o=r.current;if(!t||!i||!o)return;let a=i.getContext("2d");if(!a)return;document.documentElement.classList.add("has-custom-cursor");let s=getComputedStyle(t).getPropertyValue("--foreground").trim()||"#f2f2f2",l=1,h=()=>{l=Math.min(window.devicePixelRatio||1,2),i.width=window.innerWidth*l,i.height=window.innerHeight*l,i.style.width=`${window.innerWidth}px`,i.style.height=`${window.innerHeight}px`};h(),window.addEventListener("resize",h);let u=[],d={x:0,y:0},c={x:0,y:0},p=!1,m=0,f=e=>{d.x=e.clientX,d.y=e.clientY,p||(p=!0,c.x=d.x,c.y=d.y,u.length=0),"true"!==t.dataset.visible&&(t.dataset.visible="true")},g=e=>{let i=e.target?.closest("a, button, [data-cursor]");t.dataset.hover=i?"true":"false"},w=()=>{t.dataset.visible="false"},v=e=>{m=requestAnimationFrame(v),c.x+=(d.x-c.x)*.28,c.y+=(d.y-c.y)*.28,o.style.transform=`translate3d(${c.x}px, ${c.y}px, 0)`;let t=u[u.length-1];for(p&&(!t||Math.hypot(c.x-t.x,c.y-t.y)>=1.5)&&u.push({x:c.x,y:c.y,t:e});u.length&&e-u[0].t>150;)u.shift();if(a.setTransform(l,0,0,l,0,0),a.clearRect(0,0,window.innerWidth,window.innerHeight),u.length<3)return;let i=u.length,n=[],r=[];for(let t=0;t<i;t++){let o=u[t],a=u[Math.max(0,t-1)],s=u[Math.min(i-1,t+1)],l=s.x-a.x,h=s.y-a.y,d=Math.hypot(l,h)||1;l/=d,h/=d;let c=(1.5+7.5*Math.min(1,Math.max(0,1-(e-o.t)/150)))/2;n.push({x:o.x-h*c,y:o.y+l*c}),r.push({x:o.x+h*c,y:o.y-l*c})}let h=u[0],f=u[i-1],g=a.createLinearGradient(h.x,h.y,f.x,f.y);g.addColorStop(0,"rgba(255,255,255,0)"),g.addColorStop(1,s),a.beginPath(),a.moveTo(n[0].x,n[0].y);for(let e=1;e<i;e++)a.lineTo(n[e].x,n[e].y);for(let e=i-1;e>=0;e--)a.lineTo(r[e].x,r[e].y);a.closePath(),a.fillStyle=g,a.shadowColor=s,a.shadowBlur=10,a.fill(),a.shadowBlur=0};return window.addEventListener("pointermove",f,{passive:!0}),window.addEventListener("pointerover",g,{passive:!0}),document.documentElement.addEventListener("pointerleave",w),m=requestAnimationFrame(v),()=>{cancelAnimationFrame(m),window.removeEventListener("resize",h),window.removeEventListener("pointermove",f),window.removeEventListener("pointerover",g),document.documentElement.removeEventListener("pointerleave",w),document.documentElement.classList.remove("has-custom-cursor")}},[]),(0,t.jsxs)("div",{ref:e,className:o.default.cursor,"aria-hidden":"true",children:[(0,t.jsx)("canvas",{ref:n,className:o.default.canvas}),(0,t.jsx)("div",{ref:r,className:o.default.head})]})}])},17543,e=>{"use strict";var t=e.i(43476),i=e.i(71645),o=e.i(8560),n=e.i(90072);let r=`
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uFormation;
  uniform float uMorph;
  uniform float uMorph2;
  uniform float uMorph3;
  uniform float uMorph4;
  uniform float uMorph5;
  uniform float uRingMix;
  uniform float uRingRadius;
  uniform vec4 uOutlineRect;
  uniform float uWaveformWidth;
  uniform float uWaveformAmp;
  uniform float uSpiralRadius;
  uniform float uWorkSlide;
  uniform float uTurbulence;
  uniform vec2 uPointer;
  uniform float uGlow;
  uniform float uGlowRadius;
  uniform float uAspect;
  // 1 on a portrait-orientation viewport (width < height), 0 otherwise —
  // updated on resize alongside uAspect. Any portrait-only tweak blends in
  // through this (mix(currentValue, portraitValue, uIsPortrait)) so
  // landscape/desktop stays byte-identical to today, never touched by
  // future portrait-specific tuning.
  uniform float uIsPortrait;
  // Shrinks the globe shape on portrait only — scaled around its own
  // vertical centre (uGlobeCentreY, cloudCentre baked once at setup) rather
  // than the world origin, since aGlobe's Y already carries that offset.
  uniform float uGlobeScale;
  uniform float uGlobeCentreY;
  // Same idea, Italy shape, scaled around its own vertical centre
  // (uItalyCentreY, italyCentre baked once at setup).
  uniform float uItalyScale;
  uniform float uItalyCentreY;

  attribute vec3 aOrigin;
  attribute vec3 aGlobe;
  attribute vec3 aItaly;
  attribute float aWaveX;
  attribute float aWaveCurve;
  attribute float aWaveJitter;
  attribute float aIsRung;
  attribute float aRungT;
  attribute float aDelay;
  attribute float aSize;
  attribute float aPhase;
  attribute float aLuma;

  varying float vAlpha;
  // 0 for every particle except the sparse ring dots (uRingMix *
  // ringParticipate, below) — the fragment shader uses it to fade in a
  // fake-sphere shaded look ONLY for those, leaving every other point on
  // the site (portrait, globe, DNA, everything) exactly as flat-glow as
  // before.
  varying float vRingShade;

  void main() {
    // The preloader's own ring slot — one of RING_SLOTS fixed, evenly
    // spaced positions (not a continuous angle) — computed up here because
    // the stagger just below needs it too, so particles swirl into place
    // in the same order they'll sit in around the ring.
    float ringHash = fract(sin(dot(aOrigin.xy, vec2(12.9898, 78.233))) * 43758.5453);
    // Many more slots than the old 10-dot spinner — enough points along
    // the circumference to actually read as a circle outline at a glance,
    // not a handful of scattered blobs the eye can't connect.
    const float RING_SLOTS = 20.0;
    float ringSlot = floor(ringHash * RING_SLOTS);

    // Whether this particle is one of the sparse few that actually go on
    // to build a ring dot (see the ring geometry further down, which needs
    // "shape" and so has to come later) — computed this early so the "stay
    // put and just twinkle" gate on ease/swirl below can use it. Everyone
    // else keeps doing the site's own ordinary scattered-cloud "stellar"
    // look (ambient twinkle, no directed motion) instead of invisibly also
    // drifting toward the ring underneath the visible spinner — only a
    // portion of the cloud peeling off to build it, composing the same way
    // the comet version of this did, the rest staying as background stars.
    float ringHash2 = fract(sin(dot(aOrigin.xy, vec2(4.898, 32.233))) * 12345.678);
    float ringParticipate = step(ringHash2, 0.02);

    // Everything in this block — the delay stagger, the eased curve shape
    // — only ever changes for the sparse ring-forming particles
    // (uRingMix * ringParticipate). The rest of the cloud reads
    // effectiveDelay/ease exactly as it always has (aDelay, the normal
    // ease-out curve), same as if the preloader didn't exist — genuinely
    // different particles building the ring, not the same cloud being
    // held back/frozen while it's up.
    float ringActive = uRingMix * ringParticipate;

    // Normally each particle's own swirl-in stagger is random (aDelay, set
    // once per particle at generation time) — fine for the portrait, but
    // for the preloader's ring it reads as the whole cloud converging at
    // once instead of the spinner's dots lighting up in order. Blending
    // toward a slot-based delay instead makes the ring's own particles
    // arrive in that order.
    // Lower = every dot's own stagger starts (and finishes) earlier within
    // the formation window — 0.8 meant the last dot didn't even begin
    // moving until 80% of the way through.
    float slotDelay = (ringSlot / RING_SLOTS) * 0.15;
    float effectiveDelay = mix(aDelay, slotDelay, ringActive);
    float t = clamp((uFormation - effectiveDelay) / max(1.0 - effectiveDelay, 0.001), 0.0, 1.0);
    // Ease-out everywhere else (fast start, settling in) — but for the
    // comet's own particles specifically, blended toward a plain
    // ease-in-out-cubic instead: slow start, fast middle, slow arrival.
    // Same curve as preloader.tsx's own easeInOutCubic, just inlined here
    // since it's GLSL, not JS.
    float easeOut = 1.0 - pow(1.0 - t, 3.0);
    float easeSlowStart = t < 0.5
      ? 4.0 * t * t * t
      : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
    float ease = mix(easeOut, easeSlowStart, ringActive);
    // The comet's own particles (ringParticipate) use "ease" exactly as
    // computed above, unconditionally. Everyone else instead gets held at
    // 0 — frozen at their raw scattered aOrigin, not forming toward the
    // portrait at all — for as long as the ring is fully up (uRingMix==1),
    // then eased back to their real, natural "ease" as uRingMix falls on
    // hand-off (mix itself does that ramp smoothly, no separate timer
    // needed). This is what actually keeps the background looking like
    // the initial scattered field the whole time the ring is on screen,
    // rather than slowly assembling into the portrait underneath it.
    float formEase = mix(ease * (1.0 - uRingMix), ease, ringParticipate);

    float swirl = (1.0 - formEase) * 1.4;
    float c = cos(swirl);
    float s = sin(swirl);
    vec3 origin = vec3(
      aOrigin.x * c - aOrigin.z * s,
      aOrigin.y,
      aOrigin.x * s + aOrigin.z * c
    );

    // A double helix along X: two strands circling the same axis in the
    // Y-Z plane, a half-turn apart, plus rungs — particles held back to sit
    // *between* the strands instead of on one of them, connecting the two
    // through the centre at regular intervals like DNA's base pairs. uTime
    // keeps it spinning continuously; uWorkSlide adds more turning on top
    // of that as the page scrolls through the point-by-point browsing
    // phase, so the spin visibly speeds up with scroll instead of just
    // running on a timer. The same uWorkSlide also slides the whole helix
    // sideways along its own axis, so a different stretch of it is under
    // the text at each point — the "slider" reads through motion, not just
    // a crossfade. aWaveJitter scatters each particle's radius and angle a
    // little, so every strand reads as a soft rope of particles, not a
    // hairline — and that same jitter amplitude grows with uTurbulence
    // (scroll speed), so fast scrolling visibly roughens the strands
    // instead of just spinning them faster.
    float jitterAmount = 1.0 + uTurbulence * 3.0;
    float baseAngle = aWaveX * 13.0 + uTime * 0.6 + uWorkSlide * 2.4 + aWaveJitter * 0.12 * jitterAmount;
    float radius = uWaveformAmp * (0.85 + aWaveJitter * 0.15 * jitterAmount);
    // Both strands at this particle's X — strand 1 is strand 0 rotated
    // half a turn, i.e. the antipodal point on the same circle, so the
    // line between them passes through the helix's own centre.
    vec2 strand0 = vec2(sin(baseAngle), cos(baseAngle)) * radius;
    vec2 strand1 = vec2(sin(baseAngle + 3.14159265), cos(baseAngle + 3.14159265)) * radius;
    vec2 onStrand = mix(strand0, strand1, aWaveCurve);
    vec2 onRung = mix(strand0, strand1, aRungT);
    vec2 yz = mix(onStrand, onRung, aIsRung);
    float slideX = aWaveX * uWaveformWidth - uWorkSlide * uWaveformWidth * 0.15;
    vec3 waveform = vec3(slideX, yz.x, yz.y);

    // The closing beat, once Playground's own experiments have swept
    // through (uMorph4, driven by window.__playgroundClosing — see
    // playground.tsx): the exact same double-helix geometry as the DNA
    // above (same constant tube radius, same two-strand-plus-rungs
    // construction) — just turned 90\xb0, so instead of sliding along local
    // X (spanning left-to-right on screen) it recedes along local Z
    // (spanning toward-and-away from the camera). A perspective camera
    // does the rest on its own: the same coil radius, unchanged with
    // distance, reads as a tunnel because farther rings project smaller —
    // no new shape to author, no radius/fray tuning, just a reused formula
    // with its axis swapped.
    float spiralSpin = mix(uTime * 0.6, 1.1, smoothstep(0.5, 1.0, uMorph4));
    float tunnelAngle = aWaveX * 13.0 + spiralSpin + aWaveJitter * 0.12 * jitterAmount;
    // Wider than the DNA's own tube radius — this is the tunnel's own
    // scale, not the helix's, so it's free to be bigger without touching
    // how the DNA itself reads.
    float tunnelRadius = radius * 1.5;
    vec2 tunnelStrand0 = vec2(sin(tunnelAngle), cos(tunnelAngle)) * tunnelRadius;
    vec2 tunnelStrand1 = vec2(sin(tunnelAngle + 3.14159265), cos(tunnelAngle + 3.14159265)) * tunnelRadius;
    vec2 tunnelOnStrand = mix(tunnelStrand0, tunnelStrand1, aWaveCurve);
    vec2 tunnelOnRung = mix(tunnelStrand0, tunnelStrand1, aRungT);
    vec2 tunnelXY = mix(tunnelOnStrand, tunnelOnRung, aIsRung);
    float tunnelDepth = aWaveX * uSpiralRadius * 2.4;
    vec3 spiral = vec3(tunnelXY.x, tunnelXY.y, tunnelDepth);

    // The last beat: once Contacts' own email link is centred on screen
    // (uMorph5, driven by window.__contactFocus — see contacts.tsx), the
    // tunnel's particles trace a soft rectangular outline around it.
    // uOutlineRect (left, right, top, bottom, already converted to this
    // pivot's own local space in JS, matching the email's live screen
    // rect through the same camera that's rendering this frame) is walked
    // by arc length rather than a plain 0..1 split across four equal
    // quarters — the email link is much wider than it is tall, and an
    // even quarter-split would cram the short edges with as many
    // particles as the long ones, reading dense on the sides and sparse
    // top/bottom instead of an even trace.
    float outlineW = max(uOutlineRect.y - uOutlineRect.x, 0.0001);
    float outlineH = max(uOutlineRect.z - uOutlineRect.w, 0.0001);
    float outlinePerim = 2.0 * (outlineW + outlineH);
    float outlineTopShareRaw = outlineW / outlinePerim;
    float outlineSideShareRaw = outlineH / outlinePerim;
    // Blended halfway toward an even quarter-split rather than pure arc
    // length: the email link is much wider than tall, so a strictly
    // proportional split leaves the short left/right edges with only a
    // handful of particles each — few enough that ordinary jitter can
    // make one look noticeably denser than the other by sampling luck
    // alone, not because of any actual left/right bias in the math (the
    // walk itself is symmetric). More particles on the short edges makes
    // that per-side variance average out instead of standing out.
    float outlineTopShare = mix(outlineTopShareRaw, 0.25, 0.5);
    float outlineSideShare = mix(outlineSideShareRaw, 0.25, 0.5);
    // Offset so the parameter's own wrap point (0 back to 1) lands mid-edge
    // instead of at a corner: outlineHashA/B below are hashed from
    // outlineT, and hash(0) != hash(1) even though both land on the exact
    // same physical point when the wrap sits at a corner (0 and 1 are the
    // two adjacent edges meeting there) — two unrelated jitter clouds
    // converging on one spot read as that corner alone looking warped/
    // bulged, the other three corners (an ordinary shared boundary between
    // adjacent edges, not the wrap point) don't have this. A mid-edge seam
    // is the same discontinuity, just hidden inside a straight run instead
    // of distorting a sharp 90\xb0 corner.
    float outlineT = fract(aWaveX + 0.5 + outlineTopShare * 0.5);
    vec2 outlineXY;
    if (outlineT < outlineTopShare) {
      float u = outlineT / outlineTopShare;
      outlineXY = vec2(mix(uOutlineRect.x, uOutlineRect.y, u), uOutlineRect.z);
    } else if (outlineT < outlineTopShare + outlineSideShare) {
      float u = (outlineT - outlineTopShare) / outlineSideShare;
      outlineXY = vec2(uOutlineRect.y, mix(uOutlineRect.z, uOutlineRect.w, u));
    } else if (outlineT < outlineTopShare * 2.0 + outlineSideShare) {
      float u = (outlineT - outlineTopShare - outlineSideShare) / outlineTopShare;
      outlineXY = vec2(mix(uOutlineRect.y, uOutlineRect.x, u), uOutlineRect.w);
    } else {
      float u = (outlineT - outlineTopShare * 2.0 - outlineSideShare) / outlineSideShare;
      outlineXY = vec2(uOutlineRect.x, mix(uOutlineRect.w, uOutlineRect.z, u));
    }
    // A little scatter off the exact line, same idea as the helix's own
    // strand jitter — reads as particles loosely tracing a shape, not a
    // ruler-drawn rectangle. Hashed from outlineT (position along THIS
    // shape) rather than reusing aWaveJitter (the DNA's own per-particle
    // jitter attribute) directly: aWaveJitter was assigned once, per
    // particle, back when the DNA geometry was generated, uncorrelated
    // with which edge that particle happens to land on here — for any
    // one random assignment, the specific particles that land on a given
    // edge can carry a skewed sample of jitter values purely by chance
    // (visible as one side looking a little denser or sparser than the
    // other, confirmed NOT to be a positioning bug — the projection math
    // checks out exactly). A hash of position along this shape's own
    // perimeter instead gives every edge an independent, evenly-spread
    // scatter field that doesn't inherit whatever the DNA's own
    // generation-time randomness happened to produce.
    float outlineHashA = fract(sin(outlineT * 127.1 + 7.3) * 43758.5453);
    float outlineHashB = fract(sin(outlineT * 269.5 + 3.7) * 24634.6345);
    float outlineJitterX = outlineHashA * 2.0 - 1.0;
    float outlineJitterY = outlineHashB * 2.0 - 1.0;
    float outlinePad = 0.06 * max(outlineW, outlineH);
    vec3 outline = vec3(
      outlineXY + vec2(outlineJitterX, outlineJitterY) * outlinePad * 0.4,
      outlineJitterX * outlinePad * 0.5
    );

    vec3 globeScaled = vec3(aGlobe.x, aGlobe.y - uGlobeCentreY, aGlobe.z) * uGlobeScale + vec3(0.0, uGlobeCentreY, 0.0);
    vec3 italyScaled = vec3(aItaly.x, aItaly.y - uItalyCentreY, aItaly.z) * uItalyScale + vec3(0.0, uItalyCentreY, 0.0);

    vec3 shape = mix(mix(mix(mix(mix(position, globeScaled, uMorph), italyScaled, uMorph2), waveform, uMorph3), spiral, uMorph4), outline, uMorph5);

    // The preloader's own intro shape (see preloader.tsx, which drives
    // uRingMix from window.__preloaderRingMix): a sparse loading-spinner
    // ring — a handful of distinct dots evenly spaced around a circle
    // (ringSlot, computed above), composing the same way the comet version
    // of this did (a portion of the cloud peeling off, the rest staying
    // put as background stars — see ringParticipate/formEase above), not
    // the full particle cloud (tried the whole globe scaled down; read as
    // a dense fuzzy blob, not discrete dots).
    //
    // uTime * spin adds a continuous rotation on top of each dot's own
    // fixed slot — same wave speed as ringPulse below so the size wave and
    // the ring's own spin travel together, not against each other.
    float ringAngle = (ringSlot / RING_SLOTS) * 6.28318530718 + uTime * 1.2;
    vec3 ring = vec3(cos(ringAngle), sin(ringAngle), 0.0) * uRingRadius;
    vec3 target = mix(shape, ring, ringActive);

    // A traveling wave around the 10 slots — each dot's own size/alpha
    // pulses based on its slot position minus uTime, phase-shifted per
    // slot, so the "biggest" position visibly moves around the ring
    // continuously (a real classic spinner: dots don't rotate in place, a
    // wave of size does). Runs off uTime alone, not ease/uFormation —
    // continuous for as long as the ring is up, not a one-shot.
    float ringWavePhase = (ringSlot / RING_SLOTS) * 6.28318530718;
    float ringPulse = pow(0.5 + 0.5 * sin(uTime * 1.0 - ringWavePhase), 2.0);
    // No fake-sphere shading here anymore — with only 10 big dots it read
    // as a "ball", but with 48 smaller ones a soft sphere gradient per dot
    // just muddies them into random blurry blobs instead of a crisp,
    // readable circle. Flat glow, like every other point in the cloud.
    vRingShade = 0.0;
    vec3 formed = mix(origin, target, formEase);
    formed.z += sin(uTime * 0.7 + aPhase) * 0.012 * formEase;

    // Background stars sit frozen at their own raw aOrigin scatter while
    // the ring is up (see formEase above) — a full 3D sphere around the
    // origin, unrelated to the ring's own Z=0 plane, so some of them
    // naturally land BETWEEN the ring and the camera. Those close ones
    // blow up into oversized "in your face" points below (point size
    // scales with 1/distance-to-camera) instead of reading as background.
    // Clamping Z behind the ring for exactly this population keeps every
    // star safely further from the camera than the ring itself, so the
    // ring genuinely reads as being in FRONT of the star field, not lost
    // among random giant ones.
    float bgClamp = uRingMix * (1.0 - ringParticipate);
    formed.z = mix(formed.z, min(formed.z, -uRingRadius * 0.8), bgClamp);

    vec4 mvPosition = modelViewMatrix * vec4(formed, 1.0);
    vec4 clipPosition = projectionMatrix * mvPosition;
    gl_Position = clipPosition;

    vec2 ndc = clipPosition.xy / max(clipPosition.w, 0.001);
    vec2 toPointer = ndc - uPointer;
    toPointer.x *= uAspect;
    float glow = smoothstep(uGlowRadius, 0.0, length(toPointer)) * uGlow * formEase;

    float twinkle = 0.82 + 0.18 * sin(uTime * 1.4 + aPhase * 3.0);

    vAlpha = (0.16 + 0.84 * aLuma) * (1.0 + glow) * twinkle * smoothstep(0.0, 0.12, t);
    // The background (everyone NOT building the comet) gets boosted while
    // the ring is up — brighter and bigger than its own everyday look
    // elsewhere on the site, so it reads as a dense, vivid star field
    // behind the comet rather than the cloud's usual restrained brightness.
    // Same value as bgClamp above (kept as one shared name would need
    // reordering the block that needs it before "shape" exists — not
    // worth it for one extra multiply).
    float bgBoost = bgClamp;
    // Dialed back — the ring itself should read as the brightest thing on
    // screen, the background as a quieter field behind it, not competing
    // brightness.
    vAlpha *= mix(1.0, 1.4, bgBoost);
    // Fewer background stars — portrait only (uIsPortrait), landscape
    // untouched. Culls most of the background outright (not just dimmer):
    // this is the full particle cloud, thousands of points, and on a
    // narrower portrait frame that reads as an overcrowded field rather
    // than a handful of stars. ringHash2 is already a stable per-particle
    // 0..1 (used for the ring's own sparse selection above), reused here
    // from its complementary side — only ~35% of background particles
    // show when culling is active.
    float bgCull = step(ringHash2, 0.35);
    vAlpha *= mix(1.0, mix(1.0, bgCull, uIsPortrait), bgBoost);
    // Ring dots ride the wave (ringPulse) on top, boosted well past normal
    // brightness at the wave's peak so the ring reads as distinctly more
    // intense than the (now quieter) background — only dipping low at the
    // wave's own trough, not shrinking to a dim dot.
    vAlpha *= mix(1.0, mix(0.15, 2.2, ringPulse), ringActive);

    float sizeBoost = 1.0 + (1.0 - formEase) * 0.7;
    // Background size barely nudged — aSize already has real per-particle
    // variance built in (some naturally-bigger "stars" by design), and a
    // bigger flat multiplier amplifies exactly those outliers into
    // isolated blobs.
    sizeBoost *= mix(1.0, 1.05, bgBoost);
    // Ring dots noticeably bigger at the wave's peak now (1.3-3.2, not
    // 0.9-1.8) — the ring is meant to stand out clearly against the now-
    // quieter background, not blend into a similar scale.
    float ringSizeBoost = mix(1.0, mix(0.1, 4.5, ringPulse), ringActive);
    gl_PointSize = min(
      uSize * aSize * sizeBoost * ringSizeBoost * uPixelRatio / max(-mvPosition.z, 0.001),
      48.0 * uPixelRatio
    );
  }
`,a=`
  uniform vec3 uColor;
  uniform float uExposure;

  varying float vAlpha;
  varying float vRingShade;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float flatShade = smoothstep(0.5, 0.05, d);

    // Fake-sphere impostor, faded in only for the preloader's ring dots
    // (vRingShade) — a flat glowing disc doesn't read as a "ball" like the
    // reference spinner; a cheap normal reconstructed from the point's own
    // UV (as if it really were a hemisphere bulging toward the camera)
    // plus one fixed light direction gets there without a texture or any
    // real per-particle geometry.
    float r2 = dot(uv, uv);
    float sphereZ = sqrt(max(0.25 - r2, 0.0)) / 0.5;
    vec3 normal = normalize(vec3(uv * 2.0, sphereZ));
    vec3 lightDir = normalize(vec3(-0.4, 0.55, 0.75));
    float diffuse = max(dot(normal, lightDir), 0.0);
    float sphereShade = flatShade * mix(0.35, 1.6, diffuse);

    float shade = mix(flatShade, sphereShade, vRingShade);

    gl_FragColor =
      vec4(uColor, min(shade * vAlpha * uExposure, 1.0));

    #include <colorspace_fragment>
  }
`;function s(e){let t=new DataView(e),i=String.fromCharCode(t.getUint8(0),t.getUint8(1),t.getUint8(2),t.getUint8(3));if("PPT1"!==i)throw Error(`Portrait format: ${i}`);let o=t.getUint32(4,!0),n=t.getFloat32(8,!0),r=new Float32Array(3*o),a=new Float32Array(o);for(let e=0;e<o;e++){let i=12+8*e;r[3*e]=t.getInt16(i,!0)*n,r[3*e+1]=t.getInt16(i+2,!0)*n,r[3*e+2]=t.getInt16(i+4,!0)*n,a[e]=t.getUint8(i+6)/255}return{count:o,positions:r,luma:a}}e.s(["default",0,function({className:e,src:l="/portrait.bin",italySrc:h="/italy.bin",color:u="#ffffff",cameraDistance:d=3,fill:c=.9,widthFill:p=.92,bottomOffset:m=0,horizontalOffset:f=0,formationDuration:g=2.8,headTurn:w=.16,maxTurn:v=.22,idleTurn:y=.12,followTime:b=.35,settleTime:S=1.1,exposure:x=.5,glow:M=2,glowRadius:E=1,mobileRatio:T=.6,scrollScale:A=.2,scrollScaleDistance:R=1,scrollRotate:_=-.6,morphStart:L=1,morphDistance:P=1,globeRadius:z=.42,globeSpin:k=.06,morphStart2:O=2,morphDistance2:C=1,italyOffset:W=-.04,morphStart3:N=3,morphDistance3:I=1,workSlideDistance:H=2.5}){let F=(0,i.useRef)(null);return(0,i.useEffect)(()=>{let e,t=F.current;if(!t)return;let i=!1,D=new AbortController,j=e=>fetch(e,{signal:D.signal}).then(t=>{if(!t.ok)throw Error(`${e}: ${t.status}`);return t.arrayBuffer()});return Promise.all([j(l),j(h)]).then(([l,h])=>{i||(e=function({count:e,positions:i,luma:s},l){let h;try{h=new o.WebGLRenderer({alpha:!0,antialias:!0})}catch(e){return console.error("WebGL init failed:",e),()=>{}}let{width:F,height:D}=t.getBoundingClientRect();if(0===F||0===D)return console.error("Container has no dimensions"),()=>{};let j=window.matchMedia("(prefers-reduced-motion: reduce)").matches,B=-1/0,U=1/0,Y=1/0,q=-1/0;for(let t=0;t<e;t++){let e=i[3*t],o=i[3*t+1];o>B&&(B=o),o<U&&(U=o),e<Y&&(Y=e),e>q&&(q=e)}let G=Math.max(B-U,.001),X=Math.max(q-Y,.001),V=(B+U)/2,J=window.matchMedia("(pointer: coarse)").matches,$=i,Z=s,K=l;if(J&&T<1){let t=Math.max(Math.round(1/T),1),o=Math.ceil(e/t);$=new Float32Array(3*o),Z=new Float32Array(o),K=new Float32Array(3*o);for(let e=0;e<o;e++){let o=e*t;$[3*e]=i[3*o],$[3*e+1]=i[3*o+1],$[3*e+2]=i[3*o+2],Z[e]=s[o],K[3*e]=l[3*o],K[3*e+1]=l[3*o+1],K[3*e+2]=l[3*o+2]}e=o,i=$,s=Z,l=K}h.setPixelRatio(Math.min(window.devicePixelRatio,2)),h.setSize(F,D,!1),h.domElement.style.width="100%",h.domElement.style.height="100%",h.domElement.style.display="block",h.domElement.style.position="absolute",h.domElement.style.inset="0",t.appendChild(h.domElement),t.style.transition="opacity 1.2s ease-in-out",t.style.opacity="0";let Q=new n.Scene,ee=new n.PerspectiveCamera(45,F/D,.1,100);ee.position.z=d;let et=new Float32Array(3*e),ei=new Float32Array(e),eo=new Float32Array(e),en=new Float32Array(e),er=new n.Vector3;for(let t=0;t<e;t++)er.set(2*Math.random()-1,2*Math.random()-1,2*Math.random()-1),0===er.lengthSq()&&er.set(0,1,0),er.normalize().multiplyScalar(2+4.5*Math.random()),et[3*t]=er.x,et[3*t+1]=er.y,et[3*t+2]=er.z,ei[t]=.55*Math.random(),eo[t]=.5+.35*s[t]+1.4*Math.pow(Math.random(),3),en[t]=Math.random()*Math.PI*2;let ea=-1/0,es=1/0;for(let t=0;t<e;t++){let e=l[3*t+1];e>ea&&(ea=e),e<es&&(es=e)}let el=(ea+es)/2,eh=new Float32Array(3*e);{let t=Math.PI*(3-Math.sqrt(5)),i=G*z;for(let o=0;o<e;o++){let n=1-o/Math.max(e-1,1)*2,r=Math.sqrt(Math.max(1-n*n,0)),a=t*o;eh[3*o]=Math.cos(a)*r*i,eh[3*o+1]=n*i+V,eh[3*o+2]=Math.sin(a)*r*i}}let eu=1/6,ed=new Float32Array(e),ec=new Float32Array(e),ep=new Float32Array(e),em=new Float32Array(e),ef=new Float32Array(e);{let t=new Uint32Array(e);for(let i=0;i<e;i++)t[i]=i;for(let i=e-1;i>0;i--){let e=Math.floor(Math.random()*(i+1)),o=t[i];t[i]=t[e],t[e]=o}let i=1/Math.max(e-1,1);for(let o=0;o<e;o++){let e=t[o];if(ep[e]=2*Math.random()-1,o%Math.round(1/eu)==0){let t=Math.floor(24*Math.random());ed[e]=(t+.5)*.041666666666666664-.5+(Math.random()-.5)*.041666666666666664*.5,em[e]=1,ef[e]=Math.random()}else ed[e]=o*i-.5+(Math.random()-.5)*i,ec[e]=o%2}}let eg=new n.BufferGeometry;eg.setAttribute("position",new n.BufferAttribute(i,3)),eg.setAttribute("aOrigin",new n.BufferAttribute(et,3)),eg.setAttribute("aGlobe",new n.BufferAttribute(eh,3)),eg.setAttribute("aItaly",new n.BufferAttribute(l,3)),eg.setAttribute("aWaveX",new n.BufferAttribute(ed,1)),eg.setAttribute("aWaveCurve",new n.BufferAttribute(ec,1)),eg.setAttribute("aWaveJitter",new n.BufferAttribute(ep,1)),eg.setAttribute("aIsRung",new n.BufferAttribute(em,1)),eg.setAttribute("aRungT",new n.BufferAttribute(ef,1)),eg.setAttribute("aDelay",new n.BufferAttribute(ei,1)),eg.setAttribute("aSize",new n.BufferAttribute(eo,1)),eg.setAttribute("aPhase",new n.BufferAttribute(en,1)),eg.setAttribute("aLuma",new n.BufferAttribute(s,1));let ew=new n.ShaderMaterial({vertexShader:r,fragmentShader:a,uniforms:{uTime:{value:0},uSize:{value:0},uPixelRatio:{value:h.getPixelRatio()},uFormation:{value:+!!j},uMorph:{value:0},uMorph2:{value:0},uMorph3:{value:0},uMorph4:{value:0},uMorph5:{value:0},uRingMix:{value:0},uRingRadius:{value:.1*X},uOutlineRect:{value:new n.Vector4(0,0,0,0)},uWaveformWidth:{value:0},uSpiralRadius:{value:0},uWaveformAmp:{value:.12*G},uWorkSlide:{value:0},uTurbulence:{value:0},uColor:{value:new n.Color(u)},uExposure:{value:x},uPointer:{value:new n.Vector2(0,0)},uGlow:{value:0},uGlowRadius:{value:E},uAspect:{value:F/D},uIsPortrait:{value:+(F<D)},uGlobeScale:{value:F<D?.6:1},uGlobeCentreY:{value:V},uItalyScale:{value:F<D?.7:1},uItalyCentreY:{value:el}},transparent:!0,depthWrite:!1,blending:n.AdditiveBlending}),ev=new n.Points(eg,ew),ey=new n.Group;ey.add(ev),Q.add(ey);let eb=performance.now(),eS=1,ex=0,eM=0,eE=0,eT="/"===window.location.pathname?window.scrollY:window.innerHeight*(N+I),eA=eT,eR=0,e_=0,eL=!1,eP=-1,ez=new n.Vector3(0,0,0),ek=new n.Vector3,eO=new n.Vector3,eC=new n.Vector2(0,0),eW=new n.Vector2(0,0),eN=0,eI=0,eH=e=>{let i=t.getBoundingClientRect(),o=(e.clientX-i.left)/i.width,n=(e.clientY-i.top)/i.height;if(o<0||o>1||n<0||n>1){eI=0;return}eW.set(2*o-1,-(2*n-1)),eI=1},eF=()=>{eI=0};j||(window.addEventListener("pointermove",eH,{passive:!0}),window.addEventListener("pointerleave",eF));let eD=!1,ej=e=>{let i=Math.min((e-eb)/1e3,.02);eb=e,"/"===window.location.pathname&&(eT=window.scrollY);let o=eT,r=Math.abs(o-eA)/Math.max(i,.001);eA=o;let a=n.MathUtils.clamp(r/2400,0,1);eR+=(a-eR)*(1-Math.exp(-i/.15)),ew.uniforms.uTurbulence.value=eR;let s=window.__homeLinkLeaving?"0":"1";eD&&t.style.opacity!==s&&(t.style.opacity=s);let l=ew.uniforms.uTime.value+=i,u=1-Math.exp(-i/Math.max(b,.001)),c=1-Math.exp(-i/Math.max(S,.001));eC.lerp(eW,u),eC.x=n.MathUtils.clamp(eC.x,-1,1),eC.y=n.MathUtils.clamp(eC.y,-1,1),eN+=(eI-eN)*(j?1:eI>eN?u:c);let p=ew.uniforms.uFormation.value,x=Math.sin(.16*l)*y,E=-(Math.sin(.11*l+1.4)*y*.4),T=n.MathUtils.clamp(o/(window.innerHeight*R),0,1),z=n.MathUtils.clamp((o/window.innerHeight-L)/Math.max(P,.001),0,1),F=z*z*(3-2*z);ew.uniforms.uMorph.value=F;let D=1-F,B=n.MathUtils.clamp((o/window.innerHeight-O)/Math.max(C,.001),0,1),Y=B*B*(3-2*B);ew.uniforms.uMorph2.value=Y;let q=n.MathUtils.clamp((o/window.innerHeight-N)/Math.max(I,.001),0,1),G=q*q*(3-2*q);ew.uniforms.uMorph3.value=G,document.documentElement.style.setProperty("--portrait-morph",F.toFixed(4));let X=n.MathUtils.clamp((F-.85)/.15,0,1)*(1-n.MathUtils.clamp(Y/.15,0,1));document.documentElement.style.setProperty("--globe-ready",X.toFixed(4));let J=n.MathUtils.clamp((Y-.99)/.01,0,1)*(1-n.MathUtils.clamp((G-.85)/.15,0,1));document.documentElement.style.setProperty("--italy-ready",J.toFixed(4));let $=Math.max(0,o/window.innerHeight-(N+I)),Z=n.MathUtils.clamp($/Math.max(H,.001),0,1);ew.uniforms.uWorkSlide.value=Z;let K=n.MathUtils.clamp((G-.85)/.15,0,1)*(1-n.MathUtils.clamp((Z-.85)/.15,0,1));document.documentElement.style.setProperty("--work-ready",K.toFixed(4));let et=window.__playgroundClosing??0;ew.uniforms.uMorph4.value=et;let ei=window.__preloaderRingMix??0;ew.uniforms.uRingMix.value=ei;let eo=window.__contactFocus??0,en=window.__contactMountId??0;en!==eP&&(eP=en,e_=0,eL=!1);let er="/"===window.location.pathname,ea=Math.max(document.documentElement.scrollHeight-window.innerHeight,0),es=window.scrollY>=ea-2;er?eL=!1:es?(eL||(e_=eo),eL=!0):eL=!1;let eh=eL,eu=eh?e_:eo,ed=Math.max(et,eu),ec=F*(1-Y);eE=(eE+i*k*Math.PI*2*ec)%(2*Math.PI);let ep=(e,t)=>t*Math.tanh(e/t);ey.rotation.y=(ep(n.MathUtils.lerp(x,eC.x*w,eN)*p,v)+_*T*D+eE*ec)*(1-ed),ey.rotation.x=ep(n.MathUtils.lerp(E,-eC.y*w*.6,eN)*p,.6*v)*(1-ed),ey.rotation.z=.35*G*(1-ed),ew.uniforms.uPointer.value.copy(eC),ew.uniforms.uGlow.value=M*eN,ew.uniforms.uFormation.value<1&&(ew.uniforms.uFormation.value=Math.min(ew.uniforms.uFormation.value+i/g,1)),window.__preloaderFormation=ew.uniforms.uFormation.value;let em=eS*(1+T*A*D)*(1+.6*Z);ey.scale.set(em,em,em);let ef=-ex/2-U*em+m*ex*T*D,eg=-n.MathUtils.lerp(n.MathUtils.lerp(V,el,Y),0,G)*em+W*Y*(1-G)*ex;ey.position.y=n.MathUtils.lerp(ef,eg,F),ey.position.x=f*eM*T*D-.22*G*eM,ey.position.x=n.MathUtils.lerp(ey.position.x,0,ei),ey.position.y=n.MathUtils.lerp(ey.position.y,0,ei);let ev=Math.PI/7*Z*(1-ed),eH=d*(1-.15*Z);ee.position.x=n.MathUtils.lerp(Math.sin(ev)*eH,ey.position.x,ed),ee.position.y=n.MathUtils.lerp(0,ey.position.y,ed),ee.position.z=Math.cos(ev)*eH,ez.set(0,0,0).lerp(ey.position,Math.max(Z,ed)),ee.lookAt(ez),ew.uniforms.uMorph5.value=eu;let eF=window.__contactEmailRect;if(eF&&!eh&&eo>.001){let e=ey.position.z,t=Math.abs(ee.position.z-e),i=2*Math.tan(ee.fov*Math.PI/180/2)*t,o=i*ee.aspect,n=window.innerWidth<window.innerHeight,r=eF.width*(n?.08:.1),a=eF.height*(n?1:1.05),s=(eF.left-r)/window.innerWidth-.5,l=(eF.left+eF.width+r)/window.innerWidth-.5,h=(eF.top-a)/window.innerHeight-.5,u=(eF.top+eF.height+a)/window.innerHeight-.5;ek.set(ee.position.x+s*o,ee.position.y-h*i,e),eO.set(ee.position.x+l*o,ee.position.y-u*i,e),ey.updateMatrixWorld(),ey.worldToLocal(ek),ey.worldToLocal(eO),ew.uniforms.uOutlineRect.value.set(ek.x,eO.x,ek.y,eO.y)}h.render(Q,ee),eD||(eD=!0,t.style.opacity=window.__homeLinkLeaving?"0":"1"),requestAnimationFrame(ej)};requestAnimationFrame(ej);let eB=()=>{let e=t.getBoundingClientRect(),i=2*Math.tan(ee.fov*Math.PI/180/2)*d,o=i*(e.width/e.height),r=c*i/G,a=p*o/X,s=e.width<e.height;eS=s?+r:Math.min(r,a),ex=i,eM=o,ew.uniforms.uWaveformWidth.value=i/.34289780745545134/eS*1.15,ew.uniforms.uSpiralRadius.value=.2*i/eS,ew.uniforms.uSize.value=n.MathUtils.clamp(e.height/900*5.5,2.4,7),ew.uniforms.uAspect.value=e.width/e.height,ew.uniforms.uIsPortrait.value=+!!s,ew.uniforms.uRingRadius.value=.07*X,ew.uniforms.uGlobeScale.value=s?.6:1,ew.uniforms.uItalyScale.value=s?.7:1,ee.aspect=e.width/e.height,ee.updateProjectionMatrix(),h.setSize(e.width,e.height,!1)};return eB(),window.addEventListener("resize",eB),()=>{window.removeEventListener("pointermove",eH),window.removeEventListener("pointerleave",eF),window.removeEventListener("resize",eB),h.dispose(),eg.dispose(),ew.dispose(),t.contains(h.domElement)&&t.removeChild(h.domElement)}}(s(l),s(h).positions))}).catch(e=>{"AbortError"!==e.name&&console.error(e)}),()=>{i=!0,D.abort(),e?.()}},[l,h,u,d,c,p,m,f,g,w,v,y,b,S,x,M,E,T,A,R,_,L,P,z,k,O,C,W,N,I,H]),(0,t.jsx)("div",{ref:F,className:e,"aria-hidden":"true"})}])},2537,e=>{e.v({count:"preloader-module-scss-module__clZ1Cq__count",preloader:"preloader-module-scss-module__clZ1Cq__preloader"})},73714,e=>{"use strict";let t;var i=e.i(43476),o=e.i(71645),n=e.i(2537);let r="preloader-shown",a=new Set([" ","ArrowUp","ArrowDown","PageUp","PageDown","Home","End"]);e.s(["default",0,function(){let[e,s]=(0,o.useState)(!1),[l,h]=(0,o.useState)(!1),[u,d]=(0,o.useState)(!1),[c,p]=(0,o.useState)(0);return((0,o.useLayoutEffect)(()=>{let e,i,o,n;{let e=!1;try{e="1"===sessionStorage.getItem(r)}catch{}let t=window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(e||t)return}return s(!0),document.body.dataset.preloading="true",window.scrollTo(0,0),t?.(),e=e=>{e.cancelable&&e.preventDefault()},i=t=>{a.has(t.key)&&e(t)},o={passive:!1},n=()=>{0!==window.scrollY&&window.scrollTo(0,0)},window.addEventListener("wheel",e,o),window.addEventListener("touchmove",e,o),window.addEventListener("keydown",i,o),window.addEventListener("scroll",n),t=()=>{window.removeEventListener("wheel",e),window.removeEventListener("touchmove",e),window.removeEventListener("keydown",i),window.removeEventListener("scroll",n)},window.__lenis?.stop(),window.__preloaderRingMix=1,()=>{t?.(),t=void 0}},[]),(0,o.useLayoutEffect)(()=>{if(!e)return;let t=window.setTimeout(()=>d(!0),3e3);return()=>window.clearTimeout(t)},[e]),(0,o.useLayoutEffect)(()=>{if(!e)return;let i=performance.now(),o=0,n=()=>{let e=performance.now()-i-3500;if(e<0){o=requestAnimationFrame(n);return}let a=Math.min(e/2e3,1);if(p(Math.round(a*a*a*100)),a<1){o=requestAnimationFrame(n);return}window.setTimeout(()=>{d(!1),window.setTimeout(()=>{let e=performance.now(),i=0,o=t=>{let n=Math.min((t-e)/2e3,1);window.__preloaderRingMix=1-(n<.5?4*n*n*n:1-Math.pow(-2*n+2,3)/2),n<1?i=requestAnimationFrame(o):window.__preloaderRingMix=0};i=requestAnimationFrame(o),window.setTimeout(()=>{cancelAnimationFrame(i),document.body.dataset.preloading="false",t?.(),t=void 0,window.__lenis?.resize(),window.__lenis?.start();try{sessionStorage.setItem(r,"1")}catch{}h(!0),window.setTimeout(()=>{s(!1)},700)},2e3)},400)},500)};return o=requestAnimationFrame(n),()=>cancelAnimationFrame(o)},[e]),e)?(0,i.jsx)("div",{className:n.default.preloader,"data-dismissing":l,children:(0,i.jsxs)("span",{className:`${n.default.count} t-20`,"data-entered":u,children:[c,"%"]})}):null}])},12616,e=>{"use strict";var t=e.i(71645),i=e.i(18566);e.s(["default",0,function(){let e=(0,i.usePathname)(),o=(0,t.useRef)(!1);return(0,t.useEffect)(()=>{let e=()=>{o.current=!0};return window.addEventListener("popstate",e),()=>window.removeEventListener("popstate",e)},[]),(0,t.useEffect)(()=>{if(o.current){o.current=!1;let e=window.__homeLinkLeaving??!1;window.__homeLinkLeaving=!1;let t=requestAnimationFrame(()=>{e?(window.scrollTo(0,0),window.__lenis?.scrollTo(0,{immediate:!0})):window.__lenis?.scrollTo(window.scrollY,{immediate:!0})});return()=>cancelAnimationFrame(t)}let e=requestAnimationFrame(()=>{window.scrollTo(0,0),window.__lenis?.scrollTo(0,{immediate:!0})});return()=>cancelAnimationFrame(e)},[e]),null}])},35117,e=>{"use strict";var t=e.i(71645),i="1.3.26";function o(e,t,i){return Math.max(e,Math.min(t,i))}var n=class{isRunning=!1;value=0;from=0;to=0;currentTime=0;lerp;duration;easing;onUpdate;advance(e){if(!this.isRunning)return;let t=!1;if(this.duration&&this.easing){this.currentTime+=e;let i=o(0,this.currentTime/this.duration,1),n=(t=i>=1)?1:this.easing(i);this.value=this.from+(this.to-this.from)*n}else if(this.lerp){var i,n,r,a;this.value=(i=this.value,n=this.to,r=60*this.lerp,(1-(a=1-Math.exp(-r*e)))*i+a*n),Math.round(this.value)===Math.round(this.to)&&(this.value=this.to,t=!0)}else this.value=this.to,t=!0;t&&this.stop(),this.onUpdate?.(this.value,t)}stop(){this.isRunning=!1}fromTo(e,t,{lerp:i,duration:o,easing:n,onStart:r,onUpdate:a}){this.from=this.value=e,this.to=t,this.lerp=i,this.duration=o,this.easing=n,this.currentTime=0,this.isRunning=!0,r?.(),this.onUpdate=a}},r=class{width=0;height=0;scrollHeight=0;scrollWidth=0;debouncedResize;wrapperResizeObserver;contentResizeObserver;constructor(e,t,{autoResize:i=!0,debounce:o=250}={}){this.wrapper=e,this.content=t,i&&(this.debouncedResize=function(e,t){let i;return function(...o){clearTimeout(i),i=setTimeout(()=>{i=void 0,e.apply(this,o)},t)}}(this.resize,o),this.wrapper instanceof Window?window.addEventListener("resize",this.debouncedResize):(this.wrapperResizeObserver=new ResizeObserver(this.debouncedResize),this.wrapperResizeObserver.observe(this.wrapper)),this.contentResizeObserver=new ResizeObserver(this.debouncedResize),this.contentResizeObserver.observe(this.content)),this.resize()}destroy(){this.wrapperResizeObserver?.disconnect(),this.contentResizeObserver?.disconnect(),this.wrapper===window&&this.debouncedResize&&window.removeEventListener("resize",this.debouncedResize)}resize=()=>{this.onWrapperResize(),this.onContentResize()};onWrapperResize=()=>{this.wrapper instanceof Window?(this.width=window.innerWidth,this.height=window.innerHeight):(this.width=this.wrapper.clientWidth,this.height=this.wrapper.clientHeight)};onContentResize=()=>{this.wrapper instanceof Window?(this.scrollHeight=this.content.scrollHeight,this.scrollWidth=this.content.scrollWidth):(this.scrollHeight=this.wrapper.scrollHeight,this.scrollWidth=this.wrapper.scrollWidth)};get limit(){return{x:this.scrollWidth-this.width,y:this.scrollHeight-this.height}}},a=class{events={};emit(e,...t){let i=this.events[e]||[];for(let e=0,o=i.length;e<o;e++)i[e]?.(...t)}on(e,t){return this.events[e]?this.events[e].push(t):this.events[e]=[t],()=>{this.events[e]=this.events[e]?.filter(e=>t!==e)}}off(e,t){this.events[e]=this.events[e]?.filter(e=>t!==e)}destroy(){this.events={}}};let s=100/6,l={passive:!1};function h(e,t){return 1===e?s:2===e?t:1}var u=class{touchStart={x:0,y:0};lastDelta={x:0,y:0};window={width:0,height:0};emitter=new a;constructor(e,t={wheelMultiplier:1,touchMultiplier:1}){this.element=e,this.options=t,window.addEventListener("resize",this.onWindowResize),this.onWindowResize(),this.element.addEventListener("wheel",this.onWheel,l),this.element.addEventListener("touchstart",this.onTouchStart,l),this.element.addEventListener("touchmove",this.onTouchMove,l),this.element.addEventListener("touchend",this.onTouchEnd,l)}on(e,t){return this.emitter.on(e,t)}destroy(){this.emitter.destroy(),window.removeEventListener("resize",this.onWindowResize),this.element.removeEventListener("wheel",this.onWheel,l),this.element.removeEventListener("touchstart",this.onTouchStart,l),this.element.removeEventListener("touchmove",this.onTouchMove,l),this.element.removeEventListener("touchend",this.onTouchEnd,l)}onTouchStart=e=>{let{clientX:t,clientY:i}=e.targetTouches?e.targetTouches[0]:e;this.touchStart.x=t,this.touchStart.y=i,this.lastDelta={x:0,y:0},this.emitter.emit("scroll",{deltaX:0,deltaY:0,event:e})};onTouchMove=e=>{let{clientX:t,clientY:i}=e.targetTouches?e.targetTouches[0]:e,o=-(t-this.touchStart.x)*this.options.touchMultiplier,n=-(i-this.touchStart.y)*this.options.touchMultiplier;this.touchStart.x=t,this.touchStart.y=i,this.lastDelta={x:o,y:n},this.emitter.emit("scroll",{deltaX:o,deltaY:n,event:e})};onTouchEnd=e=>{this.emitter.emit("scroll",{deltaX:this.lastDelta.x,deltaY:this.lastDelta.y,event:e})};onWheel=e=>{let{deltaX:t,deltaY:i,deltaMode:o}=e,n=h(o,this.window.width),r=h(o,this.window.height);t*=n,i*=r,t*=this.options.wheelMultiplier,i*=this.options.wheelMultiplier,this.emitter.emit("scroll",{deltaX:t,deltaY:i,event:e})};onWindowResize=()=>{this.window={width:window.innerWidth,height:window.innerHeight}}};let d=e=>Math.min(1,1.001-2**(-10*e));var c=class{_isScrolling=!1;_isStopped=!1;_isLocked=!1;_preventNextNativeScrollEvent=!1;_resetVelocityTimeout=null;_rafId=null;_isDraggingSelection=!1;reducedMotionMediaQuery=window.matchMedia("(prefers-reduced-motion: reduce)");isTouching;isIos;time=0;userData={};lastVelocity=0;velocity=0;direction=0;options;targetScroll;animatedScroll;animate=new n;emitter=new a;dimensions;virtualScroll;constructor({wrapper:e=window,content:t=document.documentElement,eventsTarget:o=e,smoothWheel:n=!0,syncTouch:a=!1,syncTouchLerp:s=.075,touchInertiaExponent:l=1.7,duration:h,easing:c,lerp:p=.1,infinite:m=!1,orientation:f="vertical",gestureOrientation:g="horizontal"===f?"both":"vertical",touchMultiplier:w=1,wheelMultiplier:v=1,autoResize:y=!0,prevent:b,virtualScroll:S,overscroll:x=!0,autoRaf:M=!1,anchors:E=!1,autoToggle:T=!1,allowNestedScroll:A=!1,__experimental__naiveDimensions:R=!1,naiveDimensions:_=R,stopInertiaOnNavigate:L=!1,respectReducedMotion:P=!0}={}){window.lenisVersion=i,window.lenis||(window.lenis={}),window.lenis.version=i,"horizontal"===f&&(window.lenis.horizontal=!0),!0===a&&(window.lenis.touch=!0),this.isIos=/(iPad|iPhone|iPod)/g.test(navigator.userAgent),e&&e!==document.documentElement||(e=window),"number"==typeof h&&"function"!=typeof c?c=d:"function"==typeof c&&"number"!=typeof h&&(h=1),this.options={wrapper:e,content:t,eventsTarget:o,smoothWheel:n,syncTouch:a,syncTouchLerp:s,touchInertiaExponent:l,duration:h,easing:c,lerp:p,infinite:m,gestureOrientation:g,orientation:f,touchMultiplier:w,wheelMultiplier:v,autoResize:y,prevent:b,virtualScroll:S,overscroll:x,autoRaf:M,anchors:E,autoToggle:T,allowNestedScroll:A,naiveDimensions:_,stopInertiaOnNavigate:L,respectReducedMotion:P},this.dimensions=new r(e,t,{autoResize:y}),this.updateClassName(),this.targetScroll=this.animatedScroll=this.actualScroll,this.options.wrapper.addEventListener("scroll",this.onNativeScroll),this.options.wrapper.addEventListener("scrollend",this.onScrollEnd,{capture:!0}),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.addEventListener("click",this.onClick),this.options.wrapper.addEventListener("pointerdown",this.onPointerDown),this.virtualScroll=new u(o,{touchMultiplier:w,wheelMultiplier:v}),this.virtualScroll.on("scroll",this.onVirtualScroll),this.options.autoToggle&&(this.checkOverflow(),this.rootElement.addEventListener("transitionend",this.onTransitionEnd)),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))}destroy(){this.emitter.destroy(),this.options.wrapper.removeEventListener("scroll",this.onNativeScroll),this.options.wrapper.removeEventListener("scrollend",this.onScrollEnd,{capture:!0}),this.options.wrapper.removeEventListener("pointerdown",this.onPointerDown),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.removeEventListener("click",this.onClick),this.virtualScroll.destroy(),this.dimensions.destroy(),this.cleanUpClassName(),this._rafId&&cancelAnimationFrame(this._rafId)}on(e,t){return this.emitter.on(e,t)}off(e,t){return this.emitter.off(e,t)}onScrollEnd=e=>{e instanceof CustomEvent||"smooth"!==this.isScrolling&&!1!==this.isScrolling||e.stopPropagation()};dispatchScrollendEvent=()=>{this.options.wrapper.dispatchEvent(new CustomEvent("scrollend",{bubbles:this.options.wrapper===window,detail:{lenisScrollEnd:!0}}))};get overflow(){let e=this.isHorizontal?"overflow-x":"overflow-y";return getComputedStyle(this.rootElement)[e]}checkOverflow(){["hidden","clip"].includes(this.overflow)?this.internalStop():this.internalStart()}onTransitionEnd=e=>{e.propertyName?.includes("overflow")&&e.target===this.rootElement&&this.checkOverflow()};setScroll(e){this.isHorizontal?this.options.wrapper.scrollTo({left:e,behavior:"instant"}):this.options.wrapper.scrollTo({top:e,behavior:"instant"})}onClick=e=>{let t=e.composedPath().filter(e=>e instanceof HTMLAnchorElement&&e.href).map(e=>new URL(e.href)),i=new URL(window.location.href);if(this.options.anchors){let e=t.find(e=>i.host===e.host&&i.pathname===e.pathname&&e.hash);if(e){let t="object"==typeof this.options.anchors&&this.options.anchors?this.options.anchors:void 0,i=decodeURIComponent(e.hash);this.scrollTo(i,t);return}}if(this.options.stopInertiaOnNavigate&&t.some(e=>i.host===e.host&&i.pathname!==e.pathname))return void this.reset()};onPointerDown=e=>{1===e.button&&this.reset()};isTouchOnSelectionHandle(e){let t=window.getSelection();if(!t||t.isCollapsed||0===t.rangeCount)return!1;let i=e.targetTouches[0]??e.changedTouches[0];if(!i)return!1;let o=t.getRangeAt(0).getClientRects();if(0===o.length)return!1;let n=o[0],r=o[o.length-1],a=40>=Math.hypot(i.clientX-n.left,i.clientY-n.top),s=40>=Math.hypot(i.clientX-r.right,i.clientY-r.bottom);return a||s}onVirtualScroll=e=>{if("function"==typeof this.options.virtualScroll&&!1===this.options.virtualScroll(e))return;let{deltaX:t,deltaY:i,event:o}=e;if(this.emitter.emit("virtual-scroll",{deltaX:t,deltaY:i,event:o}),o.ctrlKey||o.lenisStopPropagation)return;let n=o.type.includes("touch"),r=o.type.includes("wheel");if(n&&this.isIos&&("touchstart"===o.type&&(this._isDraggingSelection=this.isTouchOnSelectionHandle(o)),this._isDraggingSelection)){"touchend"===o.type&&(this._isDraggingSelection=!1);return}this.isTouching="touchstart"===o.type||"touchmove"===o.type;let a=0===t&&0===i;if(this.options.syncTouch&&n&&"touchstart"===o.type&&a&&!this.isStopped&&!this.isLocked)return void this.reset();let s="vertical"===this.options.gestureOrientation&&0===i||"horizontal"===this.options.gestureOrientation&&0===t;if(a||s)return;let l=o.composedPath();l=l.slice(0,l.indexOf(this.rootElement));let h=this.options.prevent,u=Math.abs(t)>=Math.abs(i)?"horizontal":"vertical";if(l.find(e=>e instanceof HTMLElement&&("function"==typeof h&&h?.(e)||e.hasAttribute?.("data-lenis-prevent")||"vertical"===u&&e.hasAttribute?.("data-lenis-prevent-vertical")||"horizontal"===u&&e.hasAttribute?.("data-lenis-prevent-horizontal")||n&&e.hasAttribute?.("data-lenis-prevent-touch")||r&&e.hasAttribute?.("data-lenis-prevent-wheel")||this.options.allowNestedScroll&&this.hasNestedScroll(e,{deltaX:t,deltaY:i}))))return;if(this.isStopped||this.isLocked){o.cancelable&&o.preventDefault();return}if(!(this.options.syncTouch&&n||this.options.smoothWheel&&r)){this.isScrolling="native",this.animate.stop(),o.lenisStopPropagation=!0;return}let d=i;"both"===this.options.gestureOrientation?d=Math.abs(i)>Math.abs(t)?i:t:"horizontal"===this.options.gestureOrientation&&(d=t),(!this.options.overscroll||this.options.infinite||this.options.wrapper!==window&&this.limit>0&&(this.animatedScroll>0&&this.animatedScroll<this.limit||0===this.animatedScroll&&i>0||this.animatedScroll===this.limit&&i<0))&&(o.lenisStopPropagation=!0),o.cancelable&&o.preventDefault();let c=n&&this.options.syncTouch,p=n&&"touchend"===o.type;p&&(d=Math.sign(d)*Math.abs(this.velocity)**this.options.touchInertiaExponent),this.scrollTo(this.targetScroll+d,{programmatic:!1,...c?{lerp:p?this.options.syncTouchLerp:1}:{lerp:this.options.lerp,duration:this.options.duration,easing:this.options.easing}})};resize(){this.dimensions.resize(),this.animatedScroll=this.targetScroll=this.actualScroll,this.emit()}emit(){this.emitter.emit("scroll",this)}onNativeScroll=()=>{if(null!==this._resetVelocityTimeout&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this._preventNextNativeScrollEvent){this._preventNextNativeScrollEvent=!1;return}if(!1===this.isScrolling||"native"===this.isScrolling){let e=this.animatedScroll;this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity,this.velocity=this.animatedScroll-e,this.direction=Math.sign(this.animatedScroll-e),this.isStopped||(this.isScrolling="native"),this.emit(),0!==this.velocity&&(this._resetVelocityTimeout=setTimeout(()=>{this.lastVelocity=this.velocity,this.velocity=0,this.isScrolling=!1,this.emit()},400))}};reset(){this.isLocked=!1,this.isScrolling=!1,this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity=0,this.animate.stop()}start(){if(this.isStopped){if(this.options.autoToggle)return void this.rootElement.style.removeProperty("overflow");this.internalStart()}}internalStart(){this.isStopped&&(this.reset(),this.isStopped=!1,this.emit())}stop(){if(!this.isStopped){if(this.options.autoToggle)return void this.rootElement.style.setProperty("overflow","clip");this.internalStop()}}internalStop(){this.isStopped||(this.reset(),this.isStopped=!0,this.emit())}raf=e=>{let t=e-(this.time||e);this.time=e,this.animate.advance(.001*t),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))};scrollTo(e,{offset:t=0,immediate:i=!1,lock:n=!1,programmatic:r=!0,lerp:a=r?this.options.lerp:void 0,duration:s=r?this.options.duration:void 0,easing:l=r?this.options.easing:void 0,onStart:h,onComplete:u,force:c=!1,userData:p}={}){if(this.prefersReducedMotion&&(r?i=!0:(a=1,s=void 0,l=void 0)),(this.isStopped||this.isLocked)&&!c)return;let m=e,f=t;if("string"==typeof m&&["top","left","start","#"].includes(m))m=0;else if("string"==typeof m&&["bottom","right","end"].includes(m))m=this.limit;else{let e=null;if("string"==typeof m?(e=m.startsWith("#")?document.getElementById(m.slice(1)):document.querySelector(m))||("#top"===m?m=0:console.warn("Lenis: Target not found",m)):m instanceof HTMLElement&&m?.nodeType&&(e=m),e){if(this.options.wrapper!==window){let e=this.rootElement.getBoundingClientRect();f-=this.isHorizontal?e.left:e.top}let t=e.getBoundingClientRect(),i=getComputedStyle(e),o=this.isHorizontal?Number.parseFloat(i.scrollMarginLeft):Number.parseFloat(i.scrollMarginTop),n=getComputedStyle(this.rootElement),r=this.isHorizontal?Number.parseFloat(n.scrollPaddingLeft):Number.parseFloat(n.scrollPaddingTop);m=(this.isHorizontal?t.left:t.top)+this.animatedScroll-(Number.isNaN(o)?0:o)-(Number.isNaN(r)?0:r)}}if("number"==typeof m){if(m+=f,this.options.infinite){if(r){this.targetScroll=this.animatedScroll=this.scroll;let e=m-this.animatedScroll;e>this.limit/2?m-=this.limit:e<-this.limit/2&&(m+=this.limit)}}else m=o(0,m,this.limit);if(m===this.targetScroll){h?.(this),u?.(this);return}if(this.userData=p??{},i){this.animatedScroll=this.targetScroll=m,this.setScroll(this.scroll),this.reset(),this.preventNextNativeScrollEvent(),this.emit(),u?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()});return}r||(this.targetScroll=m),"number"==typeof s&&"function"!=typeof l?l=d:"function"==typeof l&&"number"!=typeof s&&(s=1),this.animate.fromTo(this.animatedScroll,m,{duration:s,easing:l,lerp:a,onStart:()=>{n&&(this.isLocked=!0),this.isScrolling="smooth",h?.(this)},onUpdate:(e,t)=>{this.isScrolling="smooth",this.lastVelocity=this.velocity,this.velocity=e-this.animatedScroll,this.direction=Math.sign(this.velocity),this.animatedScroll=e,this.setScroll(this.scroll),r&&(this.targetScroll=e),t||this.emit(),t&&(this.reset(),this.emit(),u?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()}),this.preventNextNativeScrollEvent())}})}}preventNextNativeScrollEvent(){this._preventNextNativeScrollEvent=!0,requestAnimationFrame(()=>{this._preventNextNativeScrollEvent=!1})}hasNestedScroll(e,{deltaX:t,deltaY:i}){let o,n,r,a,s,l,h,u,d,c,p,m,f,g,w,v,y=Date.now();e._lenis||(e._lenis={});let b=e._lenis;if(y-(b.time??0)>2e3){b.time=Date.now();let t=window.getComputedStyle(e);if(b.computedStyle=t,o=["auto","overlay","scroll"].includes(t.overflowX),n=["auto","overlay","scroll"].includes(t.overflowY),s=["auto"].includes(t.overscrollBehaviorX),l=["auto"].includes(t.overscrollBehaviorY),b.hasOverflowX=o,b.hasOverflowY=n,!(o||n))return!1;h=e.scrollWidth,u=e.scrollHeight,d=e.clientWidth,c=e.clientHeight,r=h>d,a=u>c,b.isScrollableX=r,b.isScrollableY=a,b.scrollWidth=h,b.scrollHeight=u,b.clientWidth=d,b.clientHeight=c,b.hasOverscrollBehaviorX=s,b.hasOverscrollBehaviorY=l}else r=b.isScrollableX,a=b.isScrollableY,o=b.hasOverflowX,n=b.hasOverflowY,h=b.scrollWidth,u=b.scrollHeight,d=b.clientWidth,c=b.clientHeight,s=b.hasOverscrollBehaviorX,l=b.hasOverscrollBehaviorY;if(!(o&&r||n&&a))return!1;let S=Math.abs(t)>=Math.abs(i)?"horizontal":"vertical";if("horizontal"===S)p=Math.round(e.scrollLeft),m=h-d,f=t,g=o,w=r,v=s;else{if("vertical"!==S)return!1;p=Math.round(e.scrollTop),m=u-c,f=i,g=n,w=a,v=l}return!v&&(p>=m||p<=0)||(f>0?p<m:p>0)&&g&&w}get rootElement(){return this.options.wrapper===window?document.documentElement:this.options.wrapper}get limit(){return this.options.naiveDimensions?this.isHorizontal?this.rootElement.scrollWidth-this.rootElement.clientWidth:this.rootElement.scrollHeight-this.rootElement.clientHeight:this.dimensions.limit[this.isHorizontal?"x":"y"]}get isHorizontal(){return"horizontal"===this.options.orientation}get actualScroll(){let e=this.options.wrapper;return this.isHorizontal?e.scrollX??e.scrollLeft:e.scrollY??e.scrollTop}get scroll(){var e;return this.options.infinite?(this.animatedScroll%(e=this.limit)+e)%e:this.animatedScroll}get progress(){return 0===this.limit?1:this.scroll/this.limit}get isScrolling(){return this._isScrolling}set isScrolling(e){this._isScrolling!==e&&(this._isScrolling=e,this.updateClassName())}get isStopped(){return this._isStopped}set isStopped(e){this._isStopped!==e&&(this._isStopped=e,this.updateClassName())}get isLocked(){return this._isLocked}set isLocked(e){this._isLocked!==e&&(this._isLocked=e,this.updateClassName())}get isSmooth(){return"smooth"===this.isScrolling}get prefersReducedMotion(){return this.options.respectReducedMotion&&this.reducedMotionMediaQuery.matches}get className(){let e="lenis";return this.options.autoToggle&&(e+=" lenis-autoToggle"),this.isStopped&&(e+=" lenis-stopped"),this.isLocked&&(e+=" lenis-locked"),this.isScrolling&&(e+=" lenis-scrolling"),"smooth"===this.isScrolling&&(e+=" lenis-smooth"),e}updateClassName(){this.cleanUpClassName(),this.className.split(" ").forEach(e=>{this.rootElement.classList.add(e)})}cleanUpClassName(){for(let e of Array.from(this.rootElement.classList))("lenis"===e||e.startsWith("lenis-"))&&this.rootElement.classList.remove(e)}};e.s(["default",0,function(){return(0,t.useEffect)(()=>{let e=new c({autoRaf:!0});return window.__lenis=e,"true"===document.body.dataset.preloading&&e.stop(),()=>{window.__lenis=void 0,e.destroy()}},[]),null}],35117)},8341,(e,t,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0});var o={cancelIdleCallback:function(){return a},requestIdleCallback:function(){return r}};for(var n in o)Object.defineProperty(i,n,{enumerable:!0,get:o[n]});let r="u">typeof self&&self.requestIdleCallback&&self.requestIdleCallback.bind(window)||function(e){let t=Date.now();return self.setTimeout(function(){e({didTimeout:!1,timeRemaining:function(){return Math.max(0,50-(Date.now()-t))}})},1)},a="u">typeof self&&self.cancelIdleCallback&&self.cancelIdleCallback.bind(window)||function(e){return clearTimeout(e)};("function"==typeof i.default||"object"==typeof i.default&&null!==i.default)&&void 0===i.default.__esModule&&(Object.defineProperty(i.default,"__esModule",{value:!0}),Object.assign(i.default,i),t.exports=i.default)},19083,(e,t,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0});var o={ESCAPE_REGEX:function(){return a},htmlEscapeAttributeString:function(){return u},htmlEscapeJsonString:function(){return h}};for(var n in o)Object.defineProperty(i,n,{enumerable:!0,get:o[n]});let r={"&":"\\u0026",">":"\\u003e","<":"\\u003c","\u2028":"\\u2028","\u2029":"\\u2029"},a=/[&><\u2028\u2029]/g,s={"&":"&amp;",'"':"&quot;","'":"&#39;","<":"&lt;",">":"&gt;"},l=/[&"'<>]/g;function h(e){return e.replace(a,e=>r[e])}function u(e){return e.replace(l,e=>s[e])}},79520,(e,t,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0});var o={default:function(){return b},handleClientScriptLoad:function(){return w},initScriptLoader:function(){return v}};for(var n in o)Object.defineProperty(i,n,{enumerable:!0,get:o[n]});let r=e.r(55682),a=e.r(90809),s=e.r(43476),l=r._(e.r(74080)),h=a._(e.r(71645)),u=e.r(42732),d=e.r(22737),c=e.r(8341),p=e.r(19083),m=new Map,f=new Set,g=e=>{let{src:t,id:i,onLoad:o=()=>{},onReady:n=null,dangerouslySetInnerHTML:r,children:a="",strategy:s="afterInteractive",onError:h,stylesheets:u}=e,c=i||t;if(c&&f.has(c))return;if(m.has(t)){f.add(c),m.get(t).then(o,h);return}let p=()=>{n&&n(),f.add(c)},g=document.createElement("script"),w=new Promise((e,t)=>{g.addEventListener("load",function(t){e(),o&&o.call(this,t),p()}),g.addEventListener("error",function(e){t(e)})}).catch(function(e){h&&h(e)});r?(g.innerHTML=r.__html||"",p()):a?(g.textContent="string"==typeof a?a:Array.isArray(a)?a.join(""):"",p()):t&&(g.src=t,m.set(t,w)),(0,d.setAttributesFromProps)(g,e),"worker"===s&&g.setAttribute("type","text/partytown"),g.setAttribute("data-nscript",s),u&&(e=>{if(l.default.preinit)return e.forEach(e=>{l.default.preinit(e,{as:"style"})});if("u">typeof window){let t=document.head;e.forEach(e=>{let i=document.createElement("link");i.type="text/css",i.rel="stylesheet",i.href=e,t.appendChild(i)})}})(u),document.body.appendChild(g)};function w(e){let{strategy:t="afterInteractive"}=e;"lazyOnload"===t?window.addEventListener("load",()=>{(0,c.requestIdleCallback)(()=>g(e))}):g(e)}function v(e){e.forEach(w),[...document.querySelectorAll('[data-nscript="beforeInteractive"]'),...document.querySelectorAll('[data-nscript="beforePageRender"]')].forEach(e=>{let t=e.id||e.getAttribute("src");f.add(t)})}function y(e){let{id:t,src:i="",onLoad:o=()=>{},onReady:n=null,strategy:r="afterInteractive",onError:a,stylesheets:d,...m}=e,{updateScripts:w,scripts:v,getIsSsr:y,appDir:b,nonce:S}=(0,h.useContext)(u.HeadManagerContext);S=m.nonce||S;let x=(0,h.useRef)(!1);(0,h.useEffect)(()=>{let e=t||i;x.current||(n&&e&&f.has(e)&&n(),x.current=!0)},[n,t,i]);let M=(0,h.useRef)(!1);if((0,h.useEffect)(()=>{if(!M.current){if("afterInteractive"===r)g(e);else"lazyOnload"===r&&("complete"===document.readyState?(0,c.requestIdleCallback)(()=>g(e)):window.addEventListener("load",()=>{(0,c.requestIdleCallback)(()=>g(e))}));M.current=!0}},[e,r]),("beforeInteractive"===r||"worker"===r)&&(w?(v[r]=(v[r]||[]).concat([{id:t,src:i,onLoad:o,onReady:n,onError:a,...m,nonce:S}]),w(v)):y&&y()?f.add(t||i):y&&!y()&&g({...e,nonce:S})),b){if(d&&d.forEach(e=>{l.default.preinit(e,{as:"style"})}),"beforeInteractive"===r)if(!i)return m.dangerouslySetInnerHTML&&(m.children=m.dangerouslySetInnerHTML.__html,delete m.dangerouslySetInnerHTML),(0,s.jsx)("script",{nonce:S,dangerouslySetInnerHTML:{__html:`(self.__next_s=self.__next_s||[]).push(${(0,p.htmlEscapeJsonString)(JSON.stringify([0,{...m,id:t}]))})`}});else return l.default.preload(i,m.integrity?{as:"script",integrity:m.integrity,nonce:S,crossOrigin:m.crossOrigin}:{as:"script",nonce:S,crossOrigin:m.crossOrigin}),(0,s.jsx)("script",{nonce:S,dangerouslySetInnerHTML:{__html:`(self.__next_s=self.__next_s||[]).push(${(0,p.htmlEscapeJsonString)(JSON.stringify([i,{...m,id:t}]))})`}});"afterInteractive"===r&&i&&l.default.preload(i,m.integrity?{as:"script",integrity:m.integrity,nonce:S,crossOrigin:m.crossOrigin}:{as:"script",nonce:S,crossOrigin:m.crossOrigin})}return null}Object.defineProperty(y,"__nextScript",{value:!0});let b=y;("function"==typeof i.default||"object"==typeof i.default&&null!==i.default)&&void 0===i.default.__esModule&&(Object.defineProperty(i.default,"__esModule",{value:!0}),Object.assign(i.default,i),t.exports=i.default)}]);