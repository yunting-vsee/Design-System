/* Top-bar controls shared by the Pages (login.html, preference.html).

   0. Page dropdown (#pageSelect): go to another page.

   1. Switch Buttons (.btn-group, same component as Buttons → Switch Button):
      setBtnGroup(group, value) marks the chosen button and slides the
      highlight under it. The page's own script wires the Mode group.

   2. View group (Desktop / Mobile): Mobile shows this same page on a 390 × 844
      phone screen (zoomed out to fit), so the page's own phone layout (its @media rules) kicks in. Inside
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
      if (e.data.qr === 'off') root.setAttribute('data-qr', 'off'); else root.removeAttribute('data-qr');
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
      qr: root.getAttribute('data-qr'),   /* Login: "QR code login" checkbox */
    }, location.origin);
  };
  /* Phone screen = 390 × 844 (iPhone 14/15). The page inside always renders at that real size;
     the whole phone is zoomed out (scaled) to fit the window, never zoomed in. */
  const PHONE_W = 390, PHONE_H = 844, BEZEL_PAD = 12;
  const OUTER_W = PHONE_W + BEZEL_PAD * 2, OUTER_H = PHONE_H + BEZEL_PAD * 2;
  const fit = () => {
    const box = frameWrap?.querySelector('[data-phone-box]');
    if (!box) return;
    const availH = window.innerHeight - box.getBoundingClientRect().top - 24;   /* 24 = bottom padding */
    const availW = frameWrap.clientWidth - 48;                                  /* 48 = side padding */
    const scale = Math.max(0.3, Math.min(1, availH / OUTER_H, availW / OUTER_W));
    box.style.width = OUTER_W * scale + 'px';
    box.style.height = OUTER_H * scale + 'px';
    box.firstElementChild.style.transform = 'scale(' + scale + ')';
  };
  /* Phone look: dark bezel (fixed near-black — device hardware, stays dark in dark mode too),
     rounded screen, status bar with the camera pill; the page starts below the status bar.
     Same frame as DeviceFrame in App.tsx (Steppers). */
  const STATUS_BAR = '<div aria-hidden="true" style="position: relative; flex-shrink: 0; height: 44px; display: flex; align-items: center; justify-content: space-between; padding: 0 28px; font-size: 15px; font-weight: 600; color: var(--vsee-text-primary);"><span>9:41</span><span style="position: absolute; left: 50%; top: 10px; transform: translateX(-50%); width: 96px; height: 26px; border-radius: 13px; background: #0B0B0F;"></span><span style="display: flex; align-items: center; gap: 6px;"><svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg><svg width="16" height="12" viewBox="0 0 24 18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M2 6.5a15 15 0 0 1 20 0"/><path d="M6 10.5a9 9 0 0 1 12 0"/><path d="M10 14.5a3 3 0 0 1 4 0"/></svg><svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="currentColor" opacity="0.4"/><rect x="2" y="2" width="18" height="8" rx="1.5" fill="currentColor"/><rect x="22.5" y="4" width="1.5" height="4" rx="0.75" fill="currentColor" opacity="0.4"/></svg></span></div>';
  const showMobile = () => {
    frameWrap = document.createElement('div');
    frameWrap.style.cssText = 'flex: 1; min-height: 0; display: flex; justify-content: center; align-items: flex-start; padding: var(--vsee-sp-6);';
    const box = document.createElement('div');                 /* reserves the zoomed-out size */
    box.setAttribute('data-phone-box', '');
    const phone = document.createElement('div');
    phone.style.cssText = 'width: ' + OUTER_W + 'px; height: ' + OUTER_H + 'px; padding: ' + BEZEL_PAD + 'px; box-sizing: border-box; border-radius: 48px; background: #0B0B0F; box-shadow: var(--vsee-shadow-lg); transform-origin: top left;';
    phone.innerHTML = '<div data-phone-screen style="width: ' + PHONE_W + 'px; height: ' + PHONE_H + 'px; border-radius: 36px; overflow: hidden; background: var(--vsee-white); display: flex; flex-direction: column;">' + STATUS_BAR + '</div>';
    box.appendChild(phone);
    const frame = document.createElement('iframe');
    const url = new URL(location.href);
    url.searchParams.set('frame', '');
    frame.src = url.href;
    frame.title = 'Mobile view (390 × 844)';
    frame.style.cssText = 'flex: 1; width: 100%; border: 0; display: block; background: var(--vsee-white);';
    frame.addEventListener('load', send);
    phone.firstElementChild.appendChild(frame);
    frameWrap.appendChild(box);
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
  new MutationObserver(send).observe(root, { attributes: true, attributeFilter: ['data-theme', 'data-mode', 'data-qr'] });
  window.addEventListener('resize', fit);
})();
