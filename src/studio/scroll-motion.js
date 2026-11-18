const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function initScrollMotion() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const heroItems = [...document.querySelectorAll('.hero-content > *')];
  heroItems.forEach((item, index) => {
    const animation = item.animate([
      { opacity: 0, transform: 'translate3d(0, 30px, 0) rotateX(5deg)', filter: 'blur(7px)' },
      { opacity: 1, transform: 'translate3d(0, 0, 0) rotateX(0)', filter: 'blur(0)' },
    ], {
      duration: 900,
      delay: 100 + index * 135,
      easing: 'cubic-bezier(.16, 1, .3, 1)',
      fill: 'both',
    });
    animation.onfinish = () => animation.cancel();
  });

  const targets = [...document.querySelectorAll(
    '.section-label, .intro-content, .work-header, .journey-content, .experience-item, .contact > .small-overline, .contact h2, .contact-email, .contact-bottom',
  )];
  targets.forEach((item, index) => {
    item.dataset.scrollMotion = '';
    item.dataset.motionDirection = index % 2 ? 'left' : 'right';
  });

  let frame = 0;
  function render() {
    frame = 0;
    const viewport = window.innerHeight || 1;
    for (const item of targets) {
      const rect = item.getBoundingClientRect();
      const entering = clamp((viewport * 0.94 - rect.top) / (viewport * 0.64));
      const leaving = clamp((rect.bottom + viewport * 0.18) / (viewport * 0.5));
      const focus = Math.min(entering, leaving);
      const direction = item.dataset.motionDirection === 'left' ? -1 : 1;
      const x = direction * (1 - focus) * 22;
      const y = (1 - focus) * 34;
      item.style.opacity = String(0.58 + focus * 0.42);
      item.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${0.982 + focus * 0.018})`;
      item.style.filter = `blur(${(1 - focus) * 3}px)`;
    }
  }

  function requestRender() {
    if (!frame) frame = requestAnimationFrame(render);
  }

  addEventListener('scroll', requestRender, { passive: true });
  addEventListener('resize', requestRender, { passive: true });
  addEventListener('pagehide', () => {
    if (frame) cancelAnimationFrame(frame);
  }, { once: true });
  requestRender();
}
