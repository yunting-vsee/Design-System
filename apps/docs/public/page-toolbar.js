/* Top-bar controls shared by the Pages (login.html, preference.html).

   0. Page dropdown (#pageSelect): go to another page.

   1. Switch Buttons (.btn-group, same component as Buttons → Switch Button):
      setBtnGroup(group, value) marks the chosen button and slides the
      highlight under it. The page's own script wires the Mode group.

   2. View group (Desktop / Mobile): Mobile shows this same page in a 375px-wide
      frame, so the page's own phone layout (its @media rules) kicks in. Inside
      the frame (?frame) the toolbar is hidden and brand + light/dark follow
      the outer page's toolbar. The Steppers page (React) does the same thing
      in App.tsx. */
(() => {
  const root = document.documentElement;
  const toolbar = document.querySelector('.toolbar');
  const stage = document.querySelector('main.stage');

  window.setBtnGroup = (group, value) => {
    const btns = [...group.querySelectorAll('.btn')];
    const active = btns.find(b => b.dataset.value === value);
    if (!active) return;
    btns.forEach(b => {
      b.classList.toggle('active-group', b === active);
      b.setAttribute('aria-pressed', String(b === active));
    });
    group.style.setProperty('--slider-x', `${active.offsetLeft - btns[0].offsetLeft}px`);
    group.style.setProperty('--slider-w', `${active.offsetWidth}px`);
  };
  const placeAll = () => document.querySelectorAll('.btn-group').forEach(g => {
    const active = g.querySelector('.active-group');
    if (active) window.setBtnGroup(g, active.dataset.value);
  });

  /* Inside the frame: no toolbar; take brand + mode from the outer page. */
  if (new URLSearchParams(location.search).has('frame')) {
    if (toolbar) toolbar.style.display = 'none';
    window.addEventListener('message', (e) => {
      if (e.origin !== location.origin || e.data?.type !== 'vsee-preview') return;
      root.setAttribute('data-theme', e.data.theme);
      root.setAttribute('data-mode', e.data.mode);
    });
    return;
  }

  placeAll();
  document.fonts?.ready.then(placeAll);   /* widths change once Figtree loads */

  /* Page dropdown: jump to another of the Pages (docs side-menu list, minus Kitchen Sink) */
  document.getElementById('pageSelect')?.addEventListener('change', (e) => {
    location.href = e.detail.value;   /* design-system Select: change carries detail.value */
  });

  const viewGroup = document.getElementById('viewGroup');
  if (!viewGroup || !stage) return;
  let frameWrap = null;

  const send = () => {
    const frame = frameWrap?.querySelector('iframe');
    frame?.contentWindow?.postMessage({
      type: 'vsee-preview',
      theme: root.getAttribute('data-theme') || 'green',
      mode: root.getAttribute('data-mode') === 'dark' ? 'dark' : 'light',
    }, location.origin);
  };
  const fit = () => {
    const frame = frameWrap?.querySelector('iframe');
    if (frame) frame.style.height = Math.min(812, window.innerHeight - (toolbar?.offsetHeight || 0) - 50) + 'px';
  };
  const showMobile = () => {
    frameWrap = document.createElement('div');
    frameWrap.style.cssText = 'flex: 1; min-height: 0; display: flex; justify-content: center; align-items: flex-start; padding: var(--vsee-sp-6);';
    const frame = document.createElement('iframe');
    const url = new URL(location.href);
    url.searchParams.set('frame', '');
    frame.src = url.href;
    frame.title = 'Mobile view (375px)';
    frame.style.cssText = 'box-sizing: content-box; width: 375px; max-width: 100%; border: 1px solid var(--vsee-border); border-radius: var(--vsee-r-lg); background: var(--vsee-white); box-shadow: var(--vsee-shadow-md);';
    frame.addEventListener('load', send);
    frameWrap.appendChild(frame);
    stage.style.display = 'none';
    stage.after(frameWrap);
    fit();
  };
  const showDesktop = () => {
    frameWrap?.remove(); frameWrap = null;
    stage.style.display = '';
  };

  viewGroup.addEventListener('click', (e) => {
    const b = e.target.closest('.btn');
    if (!b || b.classList.contains('active-group')) return;
    window.setBtnGroup(viewGroup, b.dataset.value);
    if (b.dataset.value === 'mobile') showMobile(); else showDesktop();
  });

  /* Brand / mode changes on the outer page reach the frame. */
  new MutationObserver(send).observe(root, { attributes: true, attributeFilter: ['data-theme', 'data-mode'] });
  window.addEventListener('resize', fit);
})();
