/* ═══════════════════════════════════════════════════
   MOHAMED BALTAMR — main.js
   Dark/Light · AR/EN · Navbar · Reveal · Counter · Forms
═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────────
     YEAR
  ───────────────────────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ─────────────────────────────────────────────────
     HELPERS
  ───────────────────────────────────────────────── */
  const html      = document.documentElement;
  const body      = document.body;
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  /* ─────────────────────────────────────────────────
     THEME  (dark / light)
  ───────────────────────────────────────────────── */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon   = document.getElementById('themeIcon');

  // Load saved theme, default = dark
  let currentTheme = localStorage.getItem('mb_theme') || 'dark';
  applyTheme(currentTheme);

  themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(currentTheme);
    localStorage.setItem('mb_theme', currentTheme);
  });

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      themeIcon.className = 'fa-solid fa-sun';
      themeToggle.title   = 'Switch to Light Mode';
    } else {
      themeIcon.className = 'fa-solid fa-moon';
      themeToggle.title   = 'Switch to Dark Mode';
    }
  }

  /* ─────────────────────────────────────────────────
     LANGUAGE  (en / ar)
  ───────────────────────────────────────────────── */
  const langToggle = document.getElementById('langToggle');
  const langLabel  = document.getElementById('langLabel');

  // Load saved language, default = en
  let currentLang = localStorage.getItem('mb_lang') || 'en';
  let currentLangGlobal = currentLang;
  applyLang(currentLang);

  langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    applyLang(currentLang);
    localStorage.setItem('mb_lang', currentLang);
  });

  function applyLang(lang) {
    // Set html attributes
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    // Toggle button label
    langLabel.textContent = lang === 'ar' ? 'EN' : 'ع';
    langToggle.title      = lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية';

    // Translate every element that has data-en / data-ar
    document.querySelectorAll('[data-en][data-ar]').forEach(el => {
      const text = lang === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en');

      // For inputs / textareas update placeholder instead of textContent
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        const phAttr = lang === 'ar' ? 'data-placeholder-ar' : 'data-placeholder-en';
        const ph = el.getAttribute(phAttr);
        if (ph) el.placeholder = ph;
      } else if (el.tagName === 'OPTION') {
        el.textContent = text;
      } else {
        // Only update if the element has no child elements (leaf text node)
        // or if it is a known single-text element
        const hasChildEls = [...el.children].some(c =>
          !['I', 'BR', 'STRONG', 'EM', 'SPAN'].includes(c.tagName)
        );
        if (!hasChildEls) {
          // Preserve any icon children
          const icons = [...el.querySelectorAll('i')];
          el.textContent = text;
          icons.forEach(ic => el.appendChild(ic));
        }
      }
    });

    // Special: placeholders on elements with data-placeholder-ar/en but no data-ar
    document.querySelectorAll('[data-placeholder-ar]').forEach(el => {
      const phAttr = lang === 'ar' ? 'data-placeholder-ar' : 'data-placeholder-en';
      const ph = el.getAttribute(phAttr);
      if (ph) el.placeholder = ph;
    });

    // Update page title
    document.title = lang === 'ar'
      ? 'محمد بالتمر | استوديو تصميم داخلي'
      : 'Mohamed Baltamr | Interior Design';

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.content = lang === 'ar'
        ? 'محمد بالتمر – استوديو تصميم داخلي فاخر. طرابلس، ليبيا.'
        : 'Mohamed Baltamr – Luxury interior design studio. Tripoli, Libya.';
    }

    // Update form feedback messages language
    currentLangGlobal = lang;
  }

  /* ─────────────────────────────────────────────────
     NAVBAR SCROLL
  ───────────────────────────────────────────────── */
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─────────────────────────────────────────────────
     HAMBURGER
  ───────────────────────────────────────────────── */
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });

  /* ─────────────────────────────────────────────────
     SMOOTH SCROLL
  ───────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });

  /* ─────────────────────────────────────────────────
     SCROLL REVEAL
  ───────────────────────────────────────────────── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ─────────────────────────────────────────────────
     COUNTER ANIMATION
  ───────────────────────────────────────────────── */
  const countUp = (el) => {
    const target   = +el.dataset.target;
    const duration = 1600;
    const step     = target / (duration / 16);
    let current    = 0;
    const timer    = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, 16);
  };

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num[data-target]').forEach(c => counterObs.observe(c));

  /* ─────────────────────────────────────────────────
     PORTFOLIO FILTER
  ───────────────────────────────────────────────── */
  const filterBtns     = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      portfolioItems.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('hidden', !match);
        item.style.display = match ? '' : 'none';
      });
    });
  });

  /* ─────────────────────────────────────────────────
     FORM HANDLER
  ───────────────────────────────────────────────── */
  const msgs = {
    sending:  { en: 'Sending...', ar: 'جاري الإرسال...' },
    success_order: {
      en: '✓ Request sent! We\'ll contact you within 24 hours.',
      ar: '✓ تم إرسال طلبك! سنتواصل معك خلال 24 ساعة.'
    },
    success_contact: {
      en: '✓ Message sent successfully!',
      ar: '✓ تم إرسال رسالتك بنجاح!'
    },
    error: {
      en: 'Oops! Something went wrong. Please try again.',
      ar: 'حدث خطأ ما. يرجى المحاولة مجدداً.'
    },
    network: {
      en: 'Network error. Please try again.',
      ar: 'خطأ في الاتصال. يرجى المحاولة مجدداً.'
    }
  };

  const handleForm = (formId, msgId, successKey) => {
    const form  = document.getElementById(formId);
    const msgEl = document.getElementById(msgId);
    if (!form || !msgEl) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn      = form.querySelector('[type="submit"]');
      const origHTML = btn.innerHTML;
      const lang     = currentLangGlobal;

      btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${msgs.sending[lang]}`;
      btn.disabled  = true;

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body:    new FormData(form),
          headers: { Accept: 'application/json' }
        });

        msgEl.style.display = 'block';
        if (res.ok) {
          msgEl.className = 'form-feedback success';
          msgEl.textContent = msgs[successKey][lang];
          form.reset();
        } else {
          msgEl.className = 'form-feedback error';
          msgEl.textContent = msgs.error[lang];
        }
      } catch {
        msgEl.style.display = 'block';
        msgEl.className = 'form-feedback error';
        msgEl.textContent = msgs.network[lang];
      } finally {
        btn.innerHTML = origHTML;
        btn.disabled  = false;
        setTimeout(() => { msgEl.style.display = 'none'; }, 6000);
      }
    });
  };

  handleForm('orderForm',   'orderMsg',   'success_order');
  handleForm('contactForm', 'contactMsg', 'success_contact');

  /* ─────────────────────────────────────────────────
     ACTIVE NAV LINK ON SCROLL
  ───────────────────────────────────────────────── */
  const sections    = document.querySelectorAll('section[id]');
  const navLinkEls  = document.querySelectorAll('.nav-link');

  const activeObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinkEls.forEach(l => l.classList.remove('active-link'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active-link');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => activeObs.observe(s));

});
