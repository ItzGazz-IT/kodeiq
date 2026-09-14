/* ═══════════════════════════════════════════
   KODEIQ — script.js  v2
   Immersive unified background system
═══════════════════════════════════════════ */

'use strict';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ══════════════════════════════════════
   AURORA CANVAS — global fixed BG
══════════════════════════════════════ */
(function initAurora() {
  const canvas = document.getElementById('aurora-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = document.documentElement.scrollHeight;
  }

  const palette = [
    [14,  165, 233, 0.06],   // electric blue
    [139,  92, 246, 0.08],   // violet
    [236,  72, 153, 0.04],   // pink
    [6,   182, 212, 0.05],   // cyan
    [167, 139, 250, 0.05],   // lavender
    [14,  165, 233, 0.04],   // blue again (weighted)
  ];

  class Blob {
    constructor() { this.init(); }
    init() {
      this.x    = Math.random() * W;
      this.y    = Math.random() * H;
      this.vx   = (Math.random() - 0.5) * 0.35;
      this.vy   = (Math.random() - 0.5) * 0.35;
      this.size = 280 + Math.random() * 480;
      this.col  = palette[Math.floor(Math.random() * palette.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -this.size) this.x = W + this.size;
      if (this.x > W + this.size) this.x = -this.size;
      if (this.y < -this.size) this.y = H + this.size;
      if (this.y > H + this.size) this.y = -this.size;
    }
    draw() {
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
      g.addColorStop(0, `rgba(${this.col[0]},${this.col[1]},${this.col[2]},${this.col[3]})`);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  let blobs = [];
  function build() {
    resize();
    blobs = Array.from({ length: 10 }, () => new Blob());
  }

  let frame = 0;
  function loop() {
    requestAnimationFrame(loop);
    // redraw every 2 frames for perf
    frame++;
    if (frame % 2 !== 0) return;

    ctx.clearRect(0, 0, W, H);
    blobs.forEach(b => { b.update(); b.draw(); });
  }

  build();
  loop();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 300);
  }, { passive: true });
})();


/* ══════════════════════════════════════
   HERO PARTICLE CANVAS
══════════════════════════════════════ */
(function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.init(); }
    init() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 1.3 + 0.4;
      this.a  = Math.random() * 0.5 + 0.1;
      this.c  = Math.random() > 0.55 ? '14,165,233' : '139,92,246';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.c},${this.a})`;
      ctx.fill();
    }
  }

  function buildParticles() {
    particles = Array.from({ length: Math.min(Math.floor(W / 11), 85) }, () => new Particle());
  }

  function drawLines() {
    const MAX = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.hypot(dx, dy);
        if (d < MAX) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(14,165,233,${(1 - d / MAX) * 0.12})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    requestAnimationFrame(loop);
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
  }

  resize();
  buildParticles();
  loop();

  let t;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(() => { resize(); buildParticles(); }, 200);
  }, { passive: true });
})();


/* ══════════════════════════════════════
   CURSOR GLOW
══════════════════════════════════════ */
const cursorEl = document.getElementById('cursor-glow');
let mx = -600, my = -600, cx = -600, cy = -600;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function animCursor() {
  cx += (mx - cx) * 0.07;
  cy += (my - cy) * 0.07;
  cursorEl.style.left = cx + 'px';
  cursorEl.style.top  = cy + 'px';
  requestAnimationFrame(animCursor);
})();


/* ══════════════════════════════════════
   NAVBAR
══════════════════════════════════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });


/* ══════════════════════════════════════
   HAMBURGER
══════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('active');
  navLinks.classList.remove('open');
  document.body.style.overflow = '';
}));

/* ── Services dropdown: mobile click toggle ── */
document.querySelectorAll('.has-dropdown .dropdown-trigger').forEach(trigger => {
  trigger.addEventListener('click', e => {
    if (window.innerWidth > 768) return; // desktop uses CSS :hover
    e.preventDefault();
    trigger.closest('.has-dropdown').classList.toggle('open');
  });
});
// Close dropdown when clicking outside (desktop)
document.addEventListener('click', e => {
  if (!e.target.closest('.has-dropdown')) {
    document.querySelectorAll('.has-dropdown').forEach(el => el.classList.remove('open'));
  }
});

/* ── FAQ Accordion ── */
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-q');
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    // close all
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });
    // open clicked if it was closed
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});


/* ══════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════ */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = parseInt(entry.target.dataset.delay) || 0;
    setTimeout(() => entry.target.classList.add('visible'), delay);
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


/* ── Scroll progress, active sections and ambient depth ── */
const scrollProgress = document.getElementById('scroll-progress');
const parallaxLayers = [...document.querySelectorAll('[data-parallax]')];
let scrollFrame = 0;

function paintScrollEffects() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
  if (scrollProgress) scrollProgress.style.transform = `scaleX(${progress})`;

  if (!prefersReducedMotion) {
    parallaxLayers.forEach(layer => {
      const section = layer.closest('section');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const speed = Number(layer.dataset.parallax) || 0;
      layer.style.transform = `translate3d(0, ${rect.top * speed}px, 0)`;
    });
  }
  scrollFrame = 0;
}

window.addEventListener('scroll', () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(paintScrollEffects);
}, { passive: true });
window.addEventListener('resize', paintScrollEffects, { passive: true });
paintScrollEffects();

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => entry.target.classList.toggle('section-active', entry.isIntersecting));
}, { threshold: .28 });
document.querySelectorAll('main section, body > section').forEach(section => sectionObserver.observe(section));


/* ── Automation opportunity estimator ── */
const automationForm = document.getElementById('automation-calculator');
if (automationForm) {
  const task = document.getElementById('automation-task');
  const people = document.getElementById('automation-people');
  const hours = document.getElementById('automation-hours');
  const peopleOutput = document.getElementById('people-output');
  const hoursOutput = document.getElementById('hours-output');
  const result = document.getElementById('automation-result');
  const cta = document.getElementById('automation-cta');

  function updateAutomationEstimate() {
    const monthlyHours = Math.round(Number(people.value) * Number(hours.value) * 4.33 * .8);
    peopleOutput.value = people.value;
    peopleOutput.textContent = people.value;
    hoursOutput.value = hours.value;
    hoursOutput.textContent = hours.value;
    result.textContent = monthlyHours.toLocaleString();

    const brief = `Hi KodeIQ! I'd like to automate ${task.value.toLowerCase()}. Around ${people.value} people spend ${hours.value} hours each week on it. Your estimator suggests we could return roughly ${monthlyHours} hours per month. Can we discuss it?`;
    cta.href = `https://wa.me/27826535019?text=${encodeURIComponent(brief)}`;
  }

  [task, people, hours].forEach(control => control.addEventListener('input', updateAutomationEstimate));
  updateAutomationEstimate();
}


/* ── Live automation workflow showcase ── */
const workflowConsole = document.getElementById('workflow-console');
if (workflowConsole) {
  const runButton = document.getElementById('run-workflow');
  const nodes = [...workflowConsole.querySelectorAll('.workflow-node')];
  const lines = [...workflowConsole.querySelectorAll('.workflow-line')];
  const log = document.getElementById('workflow-log');
  const time = document.getElementById('workflow-time');
  const messages = [
    'Lead captured from website. Contact record created.',
    'Lead scored and routed using project requirements.',
    'Personal follow-up prepared and delivery scheduled.'
  ];
  let running = false;

  const pause = ms => new Promise(resolve => setTimeout(resolve, prefersReducedMotion ? 30 : ms));
  async function runWorkflow() {
    if (running) return;
    running = true;
    runButton.disabled = true;
    runButton.textContent = 'Running…';
    nodes.forEach(node => node.classList.remove('active', 'done'));
    lines.forEach(line => line.classList.remove('active'));
    time.textContent = '0.0s';

    const started = performance.now();
    for (let index = 0; index < nodes.length; index++) {
      nodes[index].classList.add('active');
      nodes[index].querySelector('small').textContent = 'Processing';
      log.textContent = messages[index];
      if (index > 0) lines[index - 1].classList.remove('active');
      await pause(720);
      nodes[index].classList.remove('active');
      nodes[index].classList.add('done');
      nodes[index].querySelector('small').textContent = 'Complete';
      if (lines[index]) lines[index].classList.add('active');
      time.textContent = `${((performance.now() - started) / 1000).toFixed(1)}s`;
      await pause(280);
    }
    lines.forEach(line => line.classList.remove('active'));
    log.textContent = 'Workflow complete. No copying, chasing or manual hand-off.';
    runButton.textContent = 'Run again';
    runButton.disabled = false;
    running = false;
  }

  runButton.addEventListener('click', runWorkflow);
  const workflowObserver = new IntersectionObserver(([entry], observer) => {
    if (!entry.isIntersecting) return;
    runWorkflow();
    observer.disconnect();
  }, { threshold: .65 });
  workflowObserver.observe(workflowConsole);
}


/* ── Cursor-reactive section lighting ── */
if (!prefersReducedMotion && window.matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('section').forEach(section => {
    section.addEventListener('pointermove', event => {
      const rect = section.getBoundingClientRect();
      section.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`);
      section.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`);
    }, { passive: true });
  });
}


/* ══════════════════════════════════════
   HERO PARALLAX
══════════════════════════════════════ */
const heroContent = document.getElementById('hero-content');
let ticking = false;

window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const sy = window.scrollY;
    const vh = window.innerHeight;
    if (heroContent && sy < vh) {
      heroContent.style.transform = `translateY(${sy * 0.16}px)`;
      heroContent.style.opacity   = Math.max(0, 1 - (sy / vh) * 1.7);
    }
    ticking = false;
  });
}, { passive: true });


/* ══════════════════════════════════════
   SERVICE CARD MOUSE GLOW
══════════════════════════════════════ */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const glow = card.querySelector('.card-glow');
    if (!glow) return;
    const isViolet = card.classList.contains('service-card--violet');
    const col = isViolet ? '139,92,246' : '14,165,233';
    glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(${col},0.14), transparent 60%)`;
    glow.style.opacity = '1';
    // 3D tilt
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -6;
    const ry = ((x - cx) / cx) * 6;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    card.style.transition = 'box-shadow 0.1s ease, border-color 0.1s ease, background 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    const glow = card.querySelector('.card-glow');
    if (glow) glow.style.opacity = '0';
    card.style.transform = '';
    card.style.transition = 'transform 0.5s var(--ease), box-shadow 0.35s var(--ease), border-color 0.35s var(--ease), background 0.35s var(--ease)';
  });
});


/* ══════════════════════════════════════
   WHY CARD MOUSE GLOW + TILT
══════════════════════════════════════ */
document.querySelectorAll('.why-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -5;
    const ry = ((x - cx) / cx) * 5;
    card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    card.style.transition = 'box-shadow 0.1s ease, border-color 0.1s ease';
    // dynamic inner glow following cursor
    card.style.setProperty('--glow-x', x + 'px');
    card.style.setProperty('--glow-y', y + 'px');
    card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(14,165,233,0.09), rgba(255,255,255,0.05) 60%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.background = '';
    card.style.transition = 'transform 0.5s var(--ease), box-shadow 0.35s var(--ease), border-color 0.35s var(--ease), background 0.4s ease';
  });
});


/* ══════════════════════════════════════
   LAPTOP MOUSE PARALLAX
══════════════════════════════════════ */
const laptop = document.querySelector('.laptop');
if (laptop) {
  let lpActive = false;
  const laptopSection = document.getElementById('showcase');

  const lpObs = new IntersectionObserver(([e]) => { lpActive = e.isIntersecting; }, { threshold: 0.3 });
  lpObs.observe(laptopSection);

  document.addEventListener('mousemove', e => {
    if (!lpActive) return;
    const rx = ((e.clientY / window.innerHeight) - 0.5) * 5;
    const ry = ((e.clientX / window.innerWidth) - 0.5) * -8;
    laptop.style.transform =
      `perspective(1200px) rotateX(${2 + rx}deg) rotateY(${-5 + ry}deg) translateY(0)`;
  });
}


/* ══════════════════════════════════════
   PRICING CARD TILT
══════════════════════════════════════ */
const pricingCard = document.querySelector('.pricing-card');
if (pricingCard) {
  pricingCard.addEventListener('mousemove', e => {
    const r  = pricingCard.getBoundingClientRect();
    const x  = (e.clientX - r.left) / r.width  - 0.5;
    const y  = (e.clientY - r.top)  / r.height - 0.5;
    pricingCard.style.transform = `perspective(900px) rotateX(${-y * 3.5}deg) rotateY(${x * 3.5}deg)`;
  });
  pricingCard.addEventListener('mouseleave', () => {
    pricingCard.style.transform = '';
    pricingCard.style.transition = 'transform 0.5s var(--ease)';
    setTimeout(() => { pricingCard.style.transition = ''; }, 500);
  });
}


/* ══════════════════════════════════════
   BUTTON RIPPLE EFFECT
══════════════════════════════════════ */
document.querySelectorAll('.btn, .nav-cta, .whatsapp-btn, .pricing-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    ripple.style.cssText = `
      position:absolute; border-radius:50%; pointer-events:none;
      width:6px; height:6px; background:rgba(255,255,255,0.45);
      left:${e.clientX - rect.left - 3}px; top:${e.clientY - rect.top - 3}px;
      animation:btnRipple 0.65s ease-out forwards;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});


/* ══════════════════════════════════════
   ACTIVE NAV HIGHLIGHT
══════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a');

const navObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.getAttribute('id');
    navAs.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + id ? 'var(--blue)' : '';
    });
  });
}, { threshold: 0.45 });

sections.forEach(s => navObs.observe(s));


/* ══════════════════════════════════════
   SMOOTH SCROLL
══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ══════════════════════════════════════
   NUMBER COUNTER
══════════════════════════════════════ */
function countUp(el, original, duration) {
  const num    = parseInt(original);
  const suffix = original.replace(/^[\d]+/, '');
  if (!num) return;
  const t0 = performance.now();
  (function tick(now) {
    const p = Math.min((now - t0) / duration, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(e * num) + suffix;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = original;
  })(t0);
}

let counted = false;
const statsEl = document.querySelector('.hero-stats');
if (statsEl) {
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !counted) {
      counted = true;
      statsEl.querySelectorAll('.stat-number').forEach(el => {
        const orig = el.textContent.trim();
        if (/^\d+/.test(orig) && !orig.startsWith('R')) countUp(el, orig, 1800);
      });
    }
  }, { threshold: 0.6 }).observe(statsEl);
}


/* ══════════════════════════════════════
   FLOATING WHATSAPP FAB — entrance
══════════════════════════════════════ */
const fab = document.getElementById('wa-fab');
if (fab) {
  // entrance animation after 1.5s
  fab.style.opacity = '0';
  fab.style.transform = 'scale(0.5) translateY(20px)';
  fab.style.transition = 'opacity 0.5s var(--ease), transform 0.5s var(--ease)';
  setTimeout(() => {
    fab.style.opacity   = '1';
    fab.style.transform = '';
  }, 1500);
}

  /* ══════════════════════════════════════
     CV PROMO LIGHTBOX
  ══════════════════════════════════════ */
  (function initLightbox() {
    const overlay = document.getElementById('lb-overlay');
    const closeBtn = document.getElementById('lb-close');
    const timerEl = document.querySelector('#lb-timer strong');
    if (!overlay) return;

    const COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes
    const lastClosed = Number(localStorage.getItem('lb-last-closed') || 0);
    const forceOpen = window.location.hash === '#offer';

    function canAutoOpen() {
      if (forceOpen) return true;
      return (Date.now() - lastClosed) > COOLDOWN_MS;
    }

    function openLb() {
      overlay.classList.add('lb-open');
      // Hard fallback so modal is visible even if a CSS rule fails to apply.
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'all';
      overlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      startCountdown();
    }

    function closeLb() {
      overlay.classList.remove('lb-open');
      overlay.style.opacity = '';
      overlay.style.pointerEvents = '';
      overlay.style.display = '';
      document.body.style.overflow = '';
      localStorage.setItem('lb-last-closed', String(Date.now()));
    }

    if (canAutoOpen()) {
      setTimeout(openLb, 1800);
    }

    closeBtn.addEventListener('click', closeLb);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeLb(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeLb();
      if (e.key.toLowerCase() === 'o' && e.altKey) openLb();
    });

    // Countdown: 15 minutes
    function startCountdown() {
      if (!timerEl) return;
      let total = 15 * 60;
      const tick = () => {
        if (!overlay.classList.contains('lb-open')) return;
        const m = String(Math.floor(total / 60)).padStart(2, '0');
        const s = String(total % 60).padStart(2, '0');
        timerEl.textContent = `${m}:${s}`;
        if (total > 0) {
          total--;
          setTimeout(tick, 1000);
        }
      };
      tick();
    }
  })();


/* ══════════════════════════════════════
   SPARKLE DRIFT — pricing section
══════════════════════════════════════ */
document.querySelectorAll('.sparkle').forEach((el, i) => {
  const dur  = 3 + i * 0.7;
  const del  = i * 0.4;
  const ampX = 8 + Math.random() * 12;
  const ampY = 6 + Math.random() * 10;
  let start;
  (function drift(ts) {
    if (!start) start = ts;
    const t = (ts - start) / 1000 + del;
    el.style.transform = `translate(${Math.sin(t / dur * Math.PI * 2) * ampX}px, ${Math.cos(t / dur * Math.PI * 2) * ampY}px)`;
    requestAnimationFrame(drift);
  })(performance.now());
});


/* ══════════════════════════════════════
   SECTION ENTRANCE GLOW PULSE
   — adds a brief shimmer when section enters view
══════════════════════════════════════ */
const pulseObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const glow = entry.target.querySelector('.sec-glow');
    if (!glow) return;
    glow.style.transition = 'opacity 0.8s ease';
    glow.style.opacity = '1.5';
    setTimeout(() => { glow.style.opacity = ''; glow.style.transition = ''; }, 800);
  });
}, { threshold: 0.2 });

document.querySelectorAll('section').forEach(s => pulseObs.observe(s));


/* ══════════════════════════════════════
   CONTACT CARD HOVER GLOW
══════════════════════════════════════ */
const contactCard = document.querySelector('.contact-card');
if (contactCard) {
  contactCard.addEventListener('mousemove', e => {
    const r = contactCard.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const g = contactCard.querySelector('.contact-glow');
    if (g) {
      g.style.left       = `${x - 180}px`;
      g.style.top        = `${y - 180}px`;
      g.style.transition = 'left 0.3s ease, top 0.3s ease';
    }
  });
}
