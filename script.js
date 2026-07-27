/* ════════════════════════════════════════════
   MITALI NIMANE — PORTFOLIO SCRIPT
   Custom Cursor | Canvas | Animations | Forms
════════════════════════════════════════════ */

'use strict';

// ─── DOM READY ─────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initCanvas();
  initNav();
  initMobileMenu();
  initHeroRoles();
  initAOS();
  initCounters();
  initSkillBars();
  initProjectFilter();
  initTimeline();
  initContactForm();
  initFooter();
  initMagneticButtons();
  initPageReveal();
});


// ═══ LOADER ════════════════════════════════
function initLoader() {
  const loader     = document.getElementById('loader');
  const fill       = document.getElementById('loaderFill');
  const loaderText = document.getElementById('loaderText');

  const messages = [
    'Loading experience...',
    'Setting up animations...',
    'Almost there...',
    'Welcome! ✨'
  ];

  let progress = 0;
  let msgIdx   = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 5;
    if (progress > 100) progress = 100;

    fill.style.width = progress + '%';

    const mIdx = Math.floor((progress / 100) * (messages.length - 1));
    if (mIdx !== msgIdx) {
      msgIdx = mIdx;
      loaderText.textContent = messages[msgIdx];
    }

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
      }, 300);
    }
  }, 60);

  document.body.style.overflow = 'hidden';
}


// ═══ CUSTOM CURSOR ═════════════════════════
function initCursor() {
  const dot   = document.getElementById('cursorDot');
  const ring  = document.getElementById('cursorRing');
  const trail = document.getElementById('cursorTrailContainer');

  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let trailParticles = [];

  // Smooth ring follow
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';

    // Create trail particle
    createTrailParticle(mouseX, mouseY);
  });

  // Trail particles
  function createTrailParticle(x, y) {
    const p = document.createElement('div');
    p.className = 'cursor-trail';
    p.style.left = x + 'px';
    p.style.top  = y + 'px';
    p.style.opacity = '0.4';
    p.style.width  = (Math.random() * 5 + 3) + 'px';
    p.style.height = p.style.width;
    p.style.background = `hsl(${250 + Math.random() * 40}, 80%, ${60 + Math.random() * 20}%)`;
    trail.appendChild(p);
    setTimeout(() => { if (p.parentNode) p.parentNode.removeChild(p); }, 600);
  }

  // Hoverable elements
  const hoverEls = document.querySelectorAll('a, button, .project-card, .skill-pill, .tech-tag, .filter-btn, .timeline-tab, .social-link');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });

  document.addEventListener('mousedown', () => ring.classList.add('clicking'));
  document.addEventListener('mouseup',   () => ring.classList.remove('clicking'));

  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
}


// ═══ HERO CANVAS (PARTICLES) ════════════════
function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animFrame;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x    = Math.random() * W;
      this.y    = Math.random() * H;
      this.vx   = (Math.random() - 0.5) * 0.4;
      this.vy   = (Math.random() - 0.5) * 0.4;
      this.r    = Math.random() * 2 + 0.5;
      this.alpha = Math.random() * 0.4 + 0.1;
      this.color = `hsla(${250 + Math.random() * 50}, 70%, 65%, ${this.alpha})`;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = Array.from({ length: 80 }, () => new Particle());
  }

  let mouseX = W / 2, mouseY = H / 2;
  canvas.parentElement.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108,99,255,${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animFrame = requestAnimationFrame(loop);
  }

  resize();
  initParticles();
  loop();

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });
}


// ═══ NAVIGATION ════════════════════════════
function initNav() {
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });

  // Active link highlight on scroll
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(sec => observer.observe(sec));

  // Smooth scroll for all anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}


// ═══ MOBILE MENU ═══════════════════════════
function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
    });
  });

  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
    }
  });
}


// ═══ HERO ROLE SLIDER ══════════════════════
function initHeroRoles() {
  // CSS-driven — nothing extra needed
  // But we can add a type-writer variant for enhanced UX
  const roleItems = document.querySelectorAll('.role-item');
  if (!roleItems.length) return;

  let current = 0;

  setInterval(() => {
    roleItems[current].classList.remove('active');
    current = (current + 1) % roleItems.length;
    roleItems[current].classList.add('active');
  }, 3000);
}


// ═══ AOS (ANIMATE ON SCROLL) ═══════════════
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.aosDelay || 0);
        setTimeout(() => {
          entry.target.classList.add('aos-animated');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  elements.forEach(el => observer.observe(el));
}


// ═══ COUNTER ANIMATION ═════════════════════
function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target);
        const duration = 1800;
        const start    = performance.now();

        function step(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}


// ═══ SKILL BAR ANIMATION ═══════════════════
function initSkillBars() {
  const fills = document.querySelectorAll('.pill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  fills.forEach(f => observer.observe(f));
}


// ═══ PROJECT FILTER ════════════════════════
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;

        if (show) {
          card.style.display = '';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = '';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.92)';
          setTimeout(() => { card.style.display = 'none'; }, 350);
        }
      });
    });
  });
}


// ═══ TIMELINE TABS ═════════════════════════
function initTimeline() {
  const tabs    = document.querySelectorAll('.timeline-tab');
  const timelines = document.querySelectorAll('.timeline');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.dataset.tab + 'Timeline';

      timelines.forEach(tl => {
        if (tl.id === target) {
          tl.classList.remove('hidden');
          // Re-trigger animations
          tl.querySelectorAll('.timeline-item').forEach((item, i) => {
            item.style.animation = 'none';
            item.offsetHeight; // reflow
            item.style.animation = `fadeUp 0.6s ease both ${i * 0.1}s`;
          });
        } else {
          tl.classList.add('hidden');
        }
      });
    });
  });
}


// ═══ CONTACT FORM ══════════════════════════
function initContactForm() {
  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const success   = document.getElementById('formSuccess');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fields = form.querySelectorAll('input, textarea');
    let valid = true;

    fields.forEach(field => {
      if (!field.value.trim()) {
        valid = false;
        field.style.borderBottomColor = '#ef4444';
        field.addEventListener('input', () => {
          field.style.borderBottomColor = '';
        }, { once: true });
      }
    });

    if (!valid) return;

    // Simulate submission
    const span = submitBtn.querySelector('span');
    const icon = submitBtn.querySelector('i');
    span.textContent = 'Sending...';
    icon.className   = 'bx bx-loader-alt bx-spin';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      span.textContent = 'Send Message';
      icon.className   = 'bx bx-send';
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 2000);
  });
}


// ═══ FOOTER YEAR ═══════════════════════════
function initFooter() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}


// ═══ MAGNETIC BUTTONS ══════════════════════
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn-primary, .btn-outline, .nav-cta');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect   = btn.getBoundingClientRect();
      const x      = e.clientX - rect.left - rect.width  / 2;
      const y      = e.clientY - rect.top  - rect.height / 2;
      const factor = 0.35;
      btn.style.transform = `translate(${x * factor}px, ${y * factor}px) translateY(-3px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      setTimeout(() => { btn.style.transition = ''; }, 500);
    });
  });
}


// ═══ PAGE REVEAL (STAGGERED ENTRANCE) ══════
function initPageReveal() {
  // Add staggered entrance to hero elements
  const heroElements = document.querySelectorAll(
    '.hero-badge, .hero-title, .hero-description, .hero-actions, .hero-stats'
  );

  heroElements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.8s ease, transform 0.8s ease`;
    el.style.transitionDelay = `${i * 0.15 + 0.2}s`;

    // Trigger after loader hides
    setTimeout(() => {
      el.style.opacity = '';
      el.style.transform = '';
    }, 700 + i * 100);
  });
}


// ═══ PARALLAX ON SCROLL ════════════════════
(function initParallax() {
  const heroCanvas = document.getElementById('heroCanvas');
  const heroGrid   = document.querySelector('.hero-grid-overlay');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (heroCanvas) {
      heroCanvas.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
    if (heroGrid) {
      heroGrid.style.transform = `translateY(${scrollY * 0.15}px)`;
    }
  }, { passive: true });
})();


// ═══ TEXT SCRAMBLE EFFECT ══════════════════
class TextScramble {
  constructor(el) {
    this.el    = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#abcdefghijklmnopqrstuvwxyz';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const old  = this.el.innerText;
    const len  = Math.max(old.length, newText.length);
    const prom = new Promise(resolve => { this.resolve = resolve; });
    this.queue = [];

    for (let i = 0; i < len; i++) {
      const from = old[i] || '';
      const to   = newText[i] || '';
      const start = Math.floor(Math.random() * 20);
      const end   = start + Math.floor(Math.random() * 20);
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return prom;
  }

  update() {
    let output = '';
    let complete = 0;

    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];

      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span style="opacity:0.4;color:var(--accent)">${char}</span>`;
      } else {
        output += from;
      }
    }

    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

// Apply scramble to section titles on scroll
(function initScramble() {
  const titles = document.querySelectorAll('.section-title');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el       = entry.target;
        const original = el.innerText;
        const fx       = new TextScramble(el);
        fx.setText(original);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  titles.forEach(t => observer.observe(t));
})();


// ═══ TILT EFFECT ON PROJECT CARDS ══════════
(function initTilt() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const x     = e.clientX - rect.left;
      const y     = e.clientY - rect.top;
      const cx    = rect.width  / 2;
      const cy    = rect.height / 2;
      const rotX  = ((y - cy) / cy) * -8;
      const rotY  = ((x - cx) / cx) *  8;

      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      setTimeout(() => { card.style.transition = ''; }, 600);
    });
  });
})();


// ═══ RIPPLE ON BUTTONS ══════════════════════
(function initRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect  = this.getBoundingClientRect();
      const x     = e.clientX - rect.left;
      const y     = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute;
        border-radius:50%;
        background:rgba(255,255,255,0.35);
        width:4px; height:4px;
        left:${x}px; top:${y}px;
        transform:translate(-50%,-50%) scale(0);
        animation:rippleEffect 0.6s ease-out forwards;
        pointer-events:none;
      `;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Add keyframe dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleEffect {
      to { transform: translate(-50%,-50%) scale(60); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();


// ═══ FLOATING LABELS POLISH ════════════════
(function initFormLabels() {
  document.querySelectorAll('.form-field input, .form-field textarea').forEach(el => {
    // Ensure autofill is handled
    el.addEventListener('animationstart', (e) => {
      if (e.animationName === 'onAutoFillStart') {
        el.parentElement.querySelector('label').classList.add('floated');
      }
    });
  });
})();


// ═══ DOWNLOAD CV ════════════════════════════
document.getElementById('downloadCV')?.addEventListener('click', (e) => {
  e.preventDefault();
  // Placeholder — in production, link to actual PDF
  alert('CV download will be available soon! Please contact me directly.');
});


// ═══ SECTION PROGRESS INDICATOR ════════════
(function initProgressBar() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(135deg, #6c63ff, #a78bfa, #c084fc);
    z-index: 10001;
    width: 0%;
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const total  = document.documentElement.scrollHeight - window.innerHeight;
    const prog   = (window.scrollY / total) * 100;
    bar.style.width = prog + '%';
  }, { passive: true });
})();
