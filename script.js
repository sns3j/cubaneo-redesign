/* ============================================
   CUBANEO CHICAGO — JavaScript
   ============================================ */

// ===== NAVIGATION =====
const header = document.getElementById('site-header');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

// Scroll-based header style
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });

// Mobile nav toggle
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile nav on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close mobile nav on outside click
document.addEventListener('click', (e) => {
  if (
    navLinks.classList.contains('open') &&
    !navLinks.contains(e.target) &&
    !navToggle.contains(e.target)
  ) {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

// ===== ACTIVE NAV LINK on scroll =====
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinkEls.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(section => sectionObserver.observe(section));

// ===== MENU TABS =====
const tabBtns = document.querySelectorAll('.tab-btn');
const menuPanels = document.querySelectorAll('.menu-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetTab = btn.dataset.tab;

    tabBtns.forEach(b => b.classList.remove('active'));
    menuPanels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    const targetPanel = document.getElementById(`tab-${targetTab}`);
    if (targetPanel) targetPanel.classList.add('active');
  });
});

// ===== SCROLL REVEAL =====
const fadeEls = document.querySelectorAll(
  '.about-grid > *, .feature, .menu-card, .events-grid > *, .visit-grid > *, .stat'
);

fadeEls.forEach((el, i) => {
  el.classList.add('fade-in');
  if (i % 3 === 1) el.classList.add('fade-in-delay-1');
  if (i % 3 === 2) el.classList.add('fade-in-delay-2');
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

fadeEls.forEach(el => revealObserver.observe(el));

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    // Simulate send (replace with actual form submission logic)
    setTimeout(() => {
      contactForm.reset();
      formSuccess.classList.add('visible');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.style.opacity = '';

      setTimeout(() => {
        formSuccess.classList.remove('visible');
      }, 6000);
    }, 1200);
  });
}

// ===== SMOOTH SCROLL (polyfill for older browsers) =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const headerH = header.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== HERO PARALLAX =====
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
    }
  }, { passive: true });
}

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, duration = 1200, suffix = '') {
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + eased * (parseFloat(target) - start));

    el.textContent = current + suffix;

    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target + suffix;
  }

  requestAnimationFrame(update);
}

// Observe stat numbers for counter animation
const statNums = document.querySelectorAll('.stat-num, .events-stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const text = el.textContent.trim();
      // Extract numeric part and suffix
      const match = text.match(/^(\d+)(.*)$/);
      if (match) {
        animateCounter(el, match[1], 1400, match[2]);
      }
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => counterObserver.observe(el));
