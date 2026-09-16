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

  // Inquire and Stay in touch are separate forms: show one mode at a time,
  // never both stacked.
  function openPanel(mode = 'inquiry') {
    if (!panel) return;
    setMenu(false);
    returnFocusTo = document.activeElement;
    const dialog = panel.querySelector('[role="dialog"]');
    panel.querySelectorAll('[data-panel-mode]').forEach((section) => {
      const shown = section.dataset.panelMode === mode;
      section.hidden = !shown;
      const title = shown && section.querySelector('.title');
      if (title) dialog?.setAttribute('aria-labelledby', title.id);
    });
    panel.inert = false;
    panel.classList.add('is-open');
    root.classList.add('is-locked');
    panel.querySelector(`[data-panel-mode="${mode}"] [data-panel-focus]`)?.focus({ preventScroll: true });
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
        openPanel(opener.dataset.openInquire || 'inquiry');
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

    if (window.location.hash === '#inquire') openPanel('inquiry');
    if (window.location.hash === '#updates') openPanel('updates');
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
    // data-fade: hold the outgoing item at full opacity for this many ms so
    // the incoming one dissolves over it instead of both fading through the
    // background. Paired with .is-leaving in the CSS.
    const fade = Number(rotator.dataset.fade) || 0;
    let index = 0;
    let timer = null;
    let leavingTimer = null;
    let hovering = false;

    const clearLeaving = () => tracks.forEach((track) => {
      [...track.children].forEach((child) => {
        child.classList.remove('is-leaving');
        // Park the outgoing clip only once it is fully hidden. Pausing it at
        // the start of the dissolve leaves a frozen frame on screen for the
        // whole fade, which reads as a dead pause between clips.
        if (!child.classList.contains('is-active')) child.querySelector('video')?.pause();
      });
    });

    function markLeaving(previous) {
      if (!fade || previous === index) return;
      tracks.forEach((track) => track.children[previous]?.classList.add('is-leaving'));
      clearTimeout(leavingTimer);
      leavingTimer = setTimeout(clearLeaving, fade);
    }

    function show(next) {
      const previous = index;
      index = (next + length) % length;
      markLeaving(previous);
      tracks.forEach((track) => {
        [...track.children].forEach((item, i) => {
          const active = i === index;
          item.classList.toggle('is-active', active);
          if (active) item.classList.remove('is-leaving');
          item.setAttribute('aria-hidden', String(!active));
          const video = item.querySelector('video');
          if (!video) return;
          if (active) {
            if (!reducedMotion) {
              video.currentTime = 0;
              video.play().catch(() => {});
            }
          } else if (!fade) {
            video.pause(); // no cross-dissolve configured: park it right away
          }
        });
      });

      // Buffer the clip that is up next, so it never stalls on its first frame
      const upcoming = tracks[0].children[(index + 1) % length];
      const upcomingVideo = upcoming?.querySelector?.('video');
      if (upcomingVideo && !upcoming.classList.contains('is-leaving')) {
        upcomingVideo.preload = 'auto';
        if (upcomingVideo.readyState < 3) upcomingVideo.load();
      }
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

  // ── Offerings browser ───────────────────────────────────────────────────
  // [data-offering-toggle] rows control detail panels via aria-controls.
  // Desktop: one offering is always open, shown in the sticky sidebar.
  // Mobile: each panel opens beneath its row and rows toggle like an
  // accordion. /offerings/#<panel-id> opens that offering on load.
  const offerings = document.querySelector('[data-offerings]');
  if (offerings) {
    const toggles = [...offerings.querySelectorAll('[data-offering-toggle]')];
    const desktop = window.matchMedia('(min-width: 901px)');
    const panelId = (toggle) => toggle.getAttribute('aria-controls');
    const isOpen = (toggle) => toggle.getAttribute('aria-expanded') === 'true';

    function setOpen(toggle, open) {
      toggle.setAttribute('aria-expanded', String(open));
      document.getElementById(panelId(toggle)).hidden = !open;
    }

    function select(toggle) {
      if (isOpen(toggle) && !desktop.matches) {
        setOpen(toggle, false);
        return;
      }
      toggles.forEach((t) => setOpen(t, t === toggle));
      history.replaceState(null, '', `#${panelId(toggle)}`);
      if (!desktop.matches) {
        toggle.scrollIntoView({ block: 'start', behavior: reducedMotion ? 'auto' : 'smooth' });
      }
    }

    toggles.forEach((toggle) => toggle.addEventListener('click', () => select(toggle)));

    desktop.addEventListener('change', (e) => {
      if (e.matches && !toggles.some(isOpen)) setOpen(toggles[0], true);
    });

    function openFromHash() {
      const fromHash = toggles.find((t) => `#${panelId(t)}` === window.location.hash);
      if (!fromHash) return;
      toggles.forEach((t) => setOpen(t, t === fromHash));
      (desktop.matches ? offerings : fromHash).scrollIntoView({ block: 'start' });
    }

    openFromHash();
    window.addEventListener('hashchange', openFromHash);
  }

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
