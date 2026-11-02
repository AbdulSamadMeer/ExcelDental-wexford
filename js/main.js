/* =====================================================
   Excel Dental of Wexford — Main JavaScript
   ===================================================== */

/* === NAVBAR === */
const navbar    = document.querySelector('.navbar');
const hamburger = document.querySelector('.nav-hamburger');
const mobileNav = document.querySelector('.nav-mobile');

// Scroll class
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Hamburger toggle
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);

    const [s1, s2, s3] = hamburger.querySelectorAll('span');
    if (open) {
      s1.style.transform = 'translateY(7px) rotate(45deg)';
      s2.style.opacity   = '0';
      s3.style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      s1.style.transform = s2.style.opacity = s3.style.transform = '';
    }
  });

  // Close on any link click
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      hamburger.querySelectorAll('span').forEach(s => {
        s.style.transform = s.style.opacity = '';
      });
    });
  });
}

/* === SCROLL PROGRESS BAR === */
let progressBar = document.querySelector('.scroll-progress');
if (!progressBar) {
  progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(progressBar, document.body.firstChild);
}
if (progressBar) {
  const update = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    progressBar.style.transform = `scaleX(${max > 0 ? (h.scrollTop / max) : 0})`;
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* === SCROLL REVEAL ANIMATIONS === */
const revealEls = document.querySelectorAll('[data-reveal], .fade-up');
if (revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const delay = el.getAttribute('data-delay');
        if (delay) {
          setTimeout(() => el.classList.add('in-view'), parseInt(delay, 10) || 0);
        } else {
          el.classList.add('in-view');
        }
        io.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => io.observe(el));
}

/* === CONTACT FORM === */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const btn = contactForm.querySelector('[type="submit"]');
    if (!btn) return;

    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      btn.textContent = 'Message Sent!';
      btn.style.background = '#4caf50';
      btn.style.borderColor = '#4caf50';
      contactForm.reset();
    } catch (err) {
      btn.textContent = 'Try Again';
      btn.style.background = '#b42318';
      btn.style.borderColor = '#b42318';
    } finally {
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.background = '';
        btn.style.borderColor = '';
      }, 3500);
    }
  });
}

/* === AUTO YEAR IN FOOTER === */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* === SITE NAVIGATION === */
document.querySelectorAll('.footer-col ul').forEach(list => {
  list.querySelectorAll('li:empty').forEach(item => item.remove());
});

const websiteFooterLinks = document.querySelector('.footer-col ul');
if (websiteFooterLinks) {
  [
    ['wexford-privacy-policy.html', 'Privacy Policy'],
    ['wexford-sms-terms.html', 'SMS Terms & Conditions']
  ].forEach(([href, label]) => {
    if (websiteFooterLinks.querySelector(`a[href="${href}"]`)) return;
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = href;
    link.textContent = label;
    item.append(link);
    websiteFooterLinks.append(item);
  });
}

document.querySelectorAll('.footer-col:nth-of-type(3) ul').forEach(list => {
  if (list.querySelector('a[href="dental-sleep-medicine.html"]')) return;
  const item = document.createElement('li');
  item.innerHTML = '<a href="dental-sleep-medicine.html">Dental Sleep Medicine</a>';
  list.append(item);
});

/* === ACTIVE NAV LINK === */
(function setActiveLink() {
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a, .nav-mobile a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();
