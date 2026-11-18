// Sample a detailed portrait mask so the particle figure keeps natural proportions.
export function createParticles(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const hero = canvas.parentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let mobile = matchMedia('(max-width: 700px)').matches;
  const portrait = new Image();
  let points = [], width = 0, height = 0, scroll = 0, mouseX = 0, mouseY = 0, frame = 0, seed = 31;
  const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  function samplePortrait() {
    const source = document.createElement('canvas');
    source.width = 420;
    source.height = Math.round(420 * portrait.naturalHeight / portrait.naturalWidth);
    const sourceCtx = source.getContext('2d', { willReadFrequently: true });
    sourceCtx.drawImage(portrait, 0, 0, source.width, source.height);
    const { data } = sourceCtx.getImageData(0, 0, source.width, source.height);
    points = [];
    const target = mobile ? 3600 : 10500;
    let attempts = 0;
    while (points.length < target && attempts++ < target * 30) {
      const x = Math.floor(random() * source.width);
      const y = Math.floor(random() * source.height);
      const offset = (y * source.width + x) * 4;
      const alpha = data[offset + 3] / 255;
      if (alpha < .66) continue;
      const light = (data[offset] * .24 + data[offset + 1] * .6 + data[offset + 2] * .16) / 255;
      if (random() > .28 + light * .72) continue;
      points.push({ x: x / source.width - .5, y: y / source.height - .5, light,
        gold: random() < .055, size: 1 + random() * .75,
        phase: random() * Math.PI * 2, depth: random() * 2 - 1 });
    }
    draw();
  }

  function resize() {
    const wasMobile = mobile;
    mobile = matchMedia('(max-width: 700px)').matches;
    width = hero.clientWidth;
    height = hero.clientHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (wasMobile !== mobile && portrait.complete && portrait.naturalWidth) samplePortrait();
    if (reduced) draw();
  }

  function draw(time = 0) {
    ctx.clearRect(0, 0, width, height);
    if (!points.length) return;
    const size = mobile ? Math.min(width * 1.14, height * .78) : Math.min(width * .57, height * .98);
    const imageRatio = portrait.naturalHeight / portrait.naturalWidth;
    const centerX = width * (mobile ? .67 : .69);
    const centerY = height * (mobile ? .41 : .52);
    const fade = 1 - Math.min(1, scroll * 1.45);
    const drift = reduced ? 0 : Math.sin(time * .00034) * 3;
    for (const point of points) {
      const shimmer = reduced ? 1 : .9 + .1 * Math.sin(time * .0014 + point.phase);
      const alpha = (.38 + point.light * .58) * fade * shimmer;
      const x = centerX + point.x * size + mouseX * point.depth * 4;
      const y = centerY + point.y * size * imageRatio + drift + mouseY * point.depth * 4;
      ctx.fillStyle = point.gold ? `rgba(244,203,46,${alpha})` : `rgba(239,239,234,${alpha})`;
      ctx.fillRect(x, y, point.size, point.size);
    }
    if (!reduced) frame = requestAnimationFrame(draw);
  }

  function onScroll() {
    scroll = Math.min(1, scrollY / Math.max(1, hero.offsetHeight));
    if (reduced) draw();
  }
  hero.addEventListener('pointermove', event => {
    mouseX = event.clientX / width * 2 - 1;
    mouseY = event.clientY / height * 2 - 1;
  });
  addEventListener('resize', resize, { passive: true });
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('pagehide', () => cancelAnimationFrame(frame), { once: true });
  portrait.onload = samplePortrait;
  portrait.src = '/portrait-particles.png';
  resize();
  onScroll();
}
