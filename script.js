// ── NAVBAR SCROLL EFFECT ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── HAMBURGER / MOBILE MENU ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.mm-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── ACTIVE NAV ON SCROLL ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-45% 0px -55% 0px' });

sections.forEach(s => sectionObs.observe(s));

// ── FADE UP ON SCROLL ──
const fadeEls = document.querySelectorAll('.fade-up');

const fadeObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    // Stagger cards within the same grid parent
    const parent = entry.target.parentElement;
    const siblings = Array.from(parent.querySelectorAll('.fade-up:not(.visible)'));
    const idx = siblings.indexOf(entry.target);
    const delay = Math.min(idx * 90, 360);

    setTimeout(() => {
      entry.target.classList.add('visible');
    }, delay);

    fadeObs.unobserve(entry.target);
  });
}, { threshold: 0.1 });

fadeEls.forEach(el => fadeObs.observe(el));

// ── SKILL BAR ANIMATION ──
const bars = document.querySelectorAll('.exp-fill');

const barObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      el.style.width = el.style.width; // trigger reflow
      barObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });

bars.forEach(bar => {
  const targetWidth = bar.style.width;
  bar.style.width = '0%';
  bar.style.transition = 'width 1.2s ease';

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      setTimeout(() => { bar.style.width = targetWidth; }, 200);
      obs.unobserve(bar);
    }
  }, { threshold: 0.3 });

  obs.observe(bar);
});

// ── SMOOTH COUNTER ANIMATION FOR HERO STATS ──
function animateCounter(el) {
  const text = el.textContent.trim();
  const match = text.match(/^(\d+\.?\d*)/);
  if (!match) return;

  const end = parseFloat(match[1]);
  const suffix = text.replace(match[0], '');
  const duration = 1200;
  const step = 16;
  const steps = duration / step;
  const increment = end / steps;
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= end) {
      clearInterval(timer);
      el.textContent = end % 1 === 0 ? Math.round(end) + suffix : end + suffix;
    } else {
      el.textContent = (end % 1 === 0 ? Math.round(current) : current.toFixed(1)) + suffix;
    }
  }, step);
}

const statNums = document.querySelectorAll('.hstat-n');
let statsAnimated = false;

const statObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !statsAnimated) {
    statsAnimated = true;
    statNums.forEach(el => animateCounter(el));
  }
}, { threshold: 0.5 });

if (statNums.length) statObs.observe(statNums[0].closest('.hero-stats') || document.body);
