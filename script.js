/* ==========================================================================
   The Concierge Gynecologist — site behavior
   Vanilla JS, no dependencies. Behavior hooks onto data-* attributes so
   class names stay free for styling. See BRAND-GUIDE.md §6.
   ========================================================================== */

(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Header: solid after scrolling past the top ──────────────────────────
  const header = document.querySelector('[data-header]');
  if (header) {
    const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  // ── Mobile menu ─────────────────────────────────────────────────────────
  const menuToggle = document.querySelector('[data-menu-toggle]');

  function setMenu(open) {
    if (!menuToggle || !header) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    header.classList.toggle('is-menu-open', open);
    root.classList.toggle('is-locked', open);
  }

  menuToggle?.addEventListener('click', () => {
    setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => {
    if (e.matches) setMenu(false);
  });

  // ── Inquire panel ───────────────────────────────────────────────────────
  // Any [data-open-inquire] element opens it. Openers are real links to
  // /inquire/, so the page still works without JavaScript.
  const panel = document.querySelector('[data-inquire-panel]');
  let returnFocusTo = null;

  const focusableIn = (el) =>
    [...el.querySelectorAll('a[href], button:not([disabled]), input:not([type="hidden"]), textarea, select')]
      .filter((node) => node.tabIndex !== -1 && node.offsetParent !== null);

  function openPanel(focusTarget) {
    if (!panel) return;
    setMenu(false);
    returnFocusTo = document.activeElement;
    panel.inert = false;
    panel.classList.add('is-open');
    root.classList.add('is-locked');
    const target = panel.querySelector(`[data-panel-focus="${focusTarget || 'inquiry'}"]`);
    target?.focus({ preventScroll: focusTarget !== 'updates' });
    if (focusTarget === 'updates') target?.scrollIntoView({ block: 'center' });
  }

  function closePanel() {
    if (!panel?.classList.contains('is-open')) return;
    panel.classList.remove('is-open');
    panel.inert = true;
    root.classList.remove('is-locked');
    returnFocusTo?.focus?.({ preventScroll: true });
  }

  if (panel) {
    document.addEventListener('click', (e) => {
      const opener = e.target.closest('[data-open-inquire]');
      if (opener) {
        e.preventDefault();
        openPanel(opener.dataset.openInquire);
      } else if (e.target.closest('[data-close-inquire]')) {
        closePanel();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!panel.classList.contains('is-open')) return;
      if (e.key === 'Escape') {
        closePanel();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusableIn(panel);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    if (window.location.hash === '#inquire') openPanel();
  }

  // ── Rotators ────────────────────────────────────────────────────────────
  // [data-rotator][data-interval="3000"]
  //   [data-rotator-track]      children rotate in lockstep across tracks
  //   [data-rotator-tab]        optional buttons, in item order
  //   [data-rotator-prev|next]  optional controls
  //   [data-rotator-count]      optional "1 / 7" readout
  // data-bg on the first track's items sets --rotator-bg on the root.
  // data-pause-on-hover pauses while the pointer or focus is inside.
  document.querySelectorAll('[data-rotator]').forEach((rotator) => {
    const tracks = [...rotator.querySelectorAll('[data-rotator-track]')];
    const length = tracks[0]?.children.length ?? 0;
    if (length === 0) return;

    const tabs = [...rotator.querySelectorAll('[data-rotator-tab]')];
    const count = rotator.querySelector('[data-rotator-count]');
    const interval = Number(rotator.dataset.interval) || 5000;
    let index = 0;
    let timer = null;
    let hovering = false;

    function show(next) {
      index = (next + length) % length;
      tracks.forEach((track) => {
        [...track.children].forEach((item, i) => {
          const active = i === index;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-hidden', String(!active));
          const video = item.querySelector('video');
          if (!video) return;
          if (active) {
            video.currentTime = 0;
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      });
      tabs.forEach((tab, i) => tab.setAttribute('aria-pressed', String(i === index)));
      const bg = tracks[0].children[index].dataset.bg;
      if (bg) rotator.style.setProperty('--rotator-bg', bg);
      if (count) count.textContent = `${index + 1} / ${length}`;
    }

    function stop() {
      clearInterval(timer);
      timer = null;
    }

    function start() {
      stop();
      if (reducedMotion || hovering || document.hidden || length < 2) return;
      timer = setInterval(() => show(index + 1), interval);
    }

    tabs.forEach((tab, i) => tab.addEventListener('click', () => { show(i); start(); }));
    rotator.querySelector('[data-rotator-prev]')?.addEventListener('click', () => { show(index - 1); start(); });
    rotator.querySelector('[data-rotator-next]')?.addEventListener('click', () => { show(index + 1); start(); });

    if (rotator.hasAttribute('data-pause-on-hover')) {
      const pause = () => { hovering = true; stop(); };
      const resume = () => { hovering = false; start(); };
      rotator.addEventListener('mouseenter', pause);
      rotator.addEventListener('mouseleave', resume);
      rotator.addEventListener('focusin', pause);
      rotator.addEventListener('focusout', (e) => {
        if (!rotator.contains(e.relatedTarget)) resume();
      });
    }

    document.addEventListener('visibilitychange', start);

    show(0);
    start();
  });

  // ── Forms (Netlify Forms via fetch) ─────────────────────────────────────
  document.querySelectorAll('form[data-form]').forEach((form) => {
    const status = form.querySelector('[data-form-status]');
    const submit = form.querySelector('[type="submit"]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      submit.disabled = true;
      status.textContent = 'Sending…';
      try {
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(form)).toString(),
        });
        if (!response.ok) throw new Error(`Form submission failed: ${response.status}`);
        form.reset();
        status.textContent = form.dataset.success || 'Thank you. We’ll be in touch soon.';
      } catch {
        status.textContent = 'Something went wrong. Please email contact@laurenharringtonmd.com.';
      } finally {
        submit.disabled = false;
      }
    });
  });

  // ── Footer year ─────────────────────────────────────────────────────────
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
})();
