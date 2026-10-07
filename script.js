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

  // ── Shuffle the home review carousel ────────────────────────────────────
  // The reviews are written into the page oldest-first, so left alone the
  // carousel always opens on 2022 and the newest quotes never get seen. Shuffle
  // once per visit, before the rotator reads the track.
  const reviewTrack = document.querySelector('.reviews__track[data-rotator-track]');
  if (reviewTrack) {
    const items = [...reviewTrack.children];
    for (let i = items.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    reviewTrack.append(...items);
  }

  // ── Rotators ────────────────────────────────────────────────────────────
  // [data-rotator][data-interval="3000"]
  //   [data-rotator-track]      children rotate in lockstep across tracks
  //   [data-rotator-tab]        optional buttons, in item order
  //   [data-rotator-prev|next]  optional controls
  //   [data-rotator-count]      optional "1 / 7" readout
  // data-bg on the first track's items sets --rotator-bg on the root.
  // data-pause-on-hover pauses while the pointer or focus is inside.
  // ── Motion switch (WCAG 2.2.2 Pause, Stop, Hide) ────────────────────────
  // One control stops every auto-advancing rotator on the site; the choice is
  // remembered so a visitor who stops motion keeps it stopped.
  const rotatorControls = [];
  let motionPaused = false;
  try { motionPaused = localStorage.getItem('tcg-motion') === 'paused'; } catch { /* private mode */ }

  function setMotionPaused(paused) {
    motionPaused = paused;
    try { localStorage.setItem('tcg-motion', paused ? 'paused' : 'playing'); } catch { /* ignore */ }
    document.querySelectorAll('[data-motion-toggle]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(paused));
      btn.setAttribute('aria-label', paused ? 'Play background motion' : 'Pause background motion');
    });
    rotatorControls.forEach((c) => (paused ? c.stop() : c.start()));
  }

  document.querySelectorAll('[data-motion-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => setMotionPaused(!motionPaused));
  });

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
      if (reducedMotion || motionPaused || hovering || document.hidden || length < 2) return;
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
    rotatorControls.push({
      start,
      stop: () => {
        stop();
        tracks.forEach((t) => [...t.children].forEach((c) => c.querySelector('video')?.pause()));
      },
    });

    show(0);
    start();
  });

  // ── Hover-opening disclosures ───────────────────────────────────────────
  // On a list marked [data-hover-open], moving the pointer over a row previews
  // its description and leaving closes it again. Clicking (or Enter, which
  // fires a click on a <summary>) pins it open so it survives the pointer
  // leaving; clicking again closes it. Only on devices that actually hover —
  // a touch device keeps the plain tap behaviour, because a hover it cannot
  // perform would put the content out of reach.
  //
  // WCAG 1.4.13 asks that content shown on hover be hoverable (the panel opens
  // directly under the row the cursor is already on, inside the same element),
  // dismissible (Esc) and persistent (it stays while the pointer is inside).
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');

  document.querySelectorAll('[data-hover-open]').forEach((list) => {
    list.querySelectorAll('details').forEach((row) => {
      const summary = row.querySelector('summary');
      let pinned = null;   // null = follow the pointer, true = held open, false = held shut
      let inside = false;

      const sync = () => { row.open = pinned === null ? inside : pinned; };

      summary.addEventListener('click', (event) => {
        if (!finePointer.matches) return; // touch: let <details> do its own thing
        event.preventDefault();
        pinned = pinned === true ? false : true;
        sync();
      });

      row.addEventListener('pointerenter', (event) => {
        if (event.pointerType !== 'mouse' || !finePointer.matches) return;
        inside = true;
        sync();
      });

      row.addEventListener('pointerleave', (event) => {
        if (event.pointerType !== 'mouse' || !finePointer.matches) return;
        inside = false;
        if (pinned === false) pinned = null; // a held-shut row goes back to hovering
        sync();
      });

      row.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || !row.open) return;
        pinned = false;
        inside = false;
        sync();
        summary.focus();
      });
    });
  });

  // ── Deep-linked disclosures ─────────────────────────────────────────────
  // /expertise/#pelvic-pain and the like should land on an open row. Native
  // <details> does not open for a fragment in every browser, so nudge it —
  // and scroll again afterwards, because opening changes the page height.
  function openHashDisclosure() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    const target = document.getElementById(id);
    if (!target || target.tagName !== 'DETAILS') return;
    target.open = true;
    // Opening changes the page height, so place it on the next frame.
    requestAnimationFrame(() => target.scrollIntoView({ block: 'start', behavior: 'auto' }));
  }
  if (document.querySelector('details.disclosure')) {
    openHashDisclosure();
    addEventListener('hashchange', openHashDisclosure);
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
        status.textContent = 'Something went wrong. Please email contact@theconciergegynecologist.com.';
      } finally {
        submit.disabled = false;
      }
    });
  });

  // ── Parallax bands ──────────────────────────────────────────────────────
  // Each [data-parallax] section holds a [data-parallax-layer] image that is
  // taller than the frame (see styles.css) and slides at a fraction of the
  // scroll rate, so the section reads as a window moving over a near-still
  // photograph. Only sections on screen are measured, and everything is read
  // and written inside one rAF so the loop never thrashes layout.
  const parallaxBands = [...document.querySelectorAll('[data-parallax]')]
    .map((section) => ({ section, layer: section.querySelector('[data-parallax-layer]') }))
    .filter((band) => band.layer);

  if (parallaxBands.length && !reducedMotion) {
    document.documentElement.classList.add('js-parallax');

    const visible = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });
      schedule();
    }, { rootMargin: '10% 0px' });
    parallaxBands.forEach(({ section }) => observer.observe(section));

    let ticking = false;
    function schedule() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(paint);
    }

    function paint() {
      ticking = false;
      const viewportH = window.innerHeight;
      parallaxBands.forEach(({ section, layer }) => {
        if (!visible.has(section)) return;
        const box = section.getBoundingClientRect();
        // -1 when the section is just below the fold, +1 when just above it
        const progress = 1 - 2 * ((box.top + box.height / 2) / (viewportH + box.height));
        // The layer overhangs by 40% top and bottom; stay inside that.
        const travel = box.height * 0.36;
        layer.style.transform = `translate3d(0, ${(progress * travel).toFixed(2)}px, 0)`;
      });
    }

    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule, { passive: true });
    schedule();
  }

  // ── Footer year ─────────────────────────────────────────────────────────
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
})();
