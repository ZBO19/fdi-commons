// ===== FDI Commons Landing — Script =====

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initCountUp();
  initNavScroll();
  initSmoothScroll();
  initFormHandler();
});

// ===== Scroll-triggered animations =====
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger children slightly
          const delay = entry.target.closest('.problem-grid, .solution-features, .product-grid, .segments-grid, .deliverables-grid, .trust-grid')
            ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 100
            : 0;
          setTimeout(() => entry.target.classList.add('visible'), delay);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );

  const targets = document.querySelectorAll(
    '.section, .problem-card, .feature-card, .pipeline-step, .segment-card, .timeline-phase, .pricing-card, .trust-item, .product-card, .deliverable-card'
  );
  targets.forEach((el) => observer.observe(el));
}

// ===== Animated counter =====
function initCountUp() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          if (isNaN(target) || target === 0) return;
          animateCount(el, 0, target, 2000);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat-num[data-target]').forEach((el) => {
    const target = parseInt(el.dataset.target, 10);
    if (!isNaN(target) && target > 0) {
      observer.observe(el);
    }
  });
}

function animateCount(el, start, end, duration) {
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (end - start) * eased);
    el.textContent = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

// ===== Navbar =====
function initNavScroll() {
  const nav = document.getElementById('main-nav');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.style.background = window.scrollY > 60
          ? 'rgba(255,255,255,0.98)'
          : 'rgba(255,255,255,0.95)';
        nav.style.boxShadow = window.scrollY > 60
          ? '0 1px 4px rgba(0,0,0,0.08)'
          : 'none';
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ===== Smooth scroll =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = document.getElementById('main-nav').offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ===== Contact form =====
function initFormHandler() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();

    if (!name || !email) {
      submitBtn.textContent = 'Please fill in required fields';
      submitBtn.style.background = '#B35900';
      setTimeout(() => {
        submitBtn.textContent = 'Get in Touch';
        submitBtn.style.background = '';
      }, 2500);
      return;
    }

    submitBtn.textContent = 'Submitting…';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = '✓ Thank you! We\'ll be in touch.';
      submitBtn.style.background = '#2E7D32';
      form.reset();
      setTimeout(() => {
        submitBtn.textContent = 'Get in Touch';
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 4000);
    }, 1200);
  });
}
