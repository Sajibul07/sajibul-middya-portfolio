(() => {
  'use strict';
  const root = document.documentElement;
  const $ = (s) => document.querySelector(s);

  /* Theme toggle (main site jaisa hi, same localStorage key) */
  const toggle = $('#themeToggle');
  const meta = $('meta[name="theme-color"]');
  const applyTheme = (t) => {
    root.setAttribute('data-theme', t);
    toggle.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    if (meta) meta.content = t === 'dark' ? '#23272f' : '#e0e5ec';
  };
  applyTheme(root.getAttribute('data-theme') || 'light');
  toggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* Mobile menu */
  const burger = $('#burger'), menu = $('#menu');
  const setMenu = (open) => {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  document.addEventListener('click', (e) => { if (!e.target.closest('.nav')) setMenu(false); });

  /* Header shadow on scroll */
  const header = $('.header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Visitor ne kaunsa URL kholne ki koshish ki thi (textContent = safe) */
  const path = $('#path');
  if (path) {
    let p = location.pathname + location.search;
    try { p = decodeURIComponent(p); } catch (e) {} /* kharab %-encoding par crash nahi hoga */
    path.textContent = p || '/';
  }

  /* Go back: history ho to peeche, warna home */
  $('#backBtn').addEventListener('click', () => {
    if (window.history.length > 1) window.history.back();
    else window.location.href = '/';
  });

  $('#year').textContent = new Date().getFullYear();
})();