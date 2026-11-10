(() => {
  "use strict";
  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* Theme toggle (main site jaisa, same localStorage key) */
  const toggle = $("#themeToggle");
  const meta = $('meta[name="theme-color"]');
  const applyTheme = (t) => {
    root.setAttribute("data-theme", t);
    toggle.setAttribute(
      "aria-label",
      t === "dark" ? "Switch to light mode" : "Switch to dark mode",
    );
    if (meta) meta.content = t === "dark" ? "#23272f" : "#e0e5ec";
  };
  applyTheme(root.getAttribute("data-theme") || "light");
  toggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
  });

  /* Mobile menu */
  const burger = $("#burger"),
    menu = $("#menu");
  const setMenu = (open) => {
    menu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  burger.addEventListener("click", () =>
    setMenu(!menu.classList.contains("open")),
  );
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav")) setMenu(false);
  });

  /* Header shadow on scroll */
  const header = $(".header");
  const onScroll = () =>
    header.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Image na mile to placeholder dikhao */
  $$(".cert-frame img").forEach((img) => {
    const mark = () => img.closest(".cert-frame").classList.add("missing");
    img.addEventListener("error", mark);
    if (img.complete && img.naturalWidth === 0) mark();
  });

  /* Certificate bada dekhna (lightbox) */
  const box = $("#lightbox"),
    lbImg = $("#lbImg"),
    lbCap = $("#lbCaption");
  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-cert]");
    if (opener) {
      const card = opener.closest(".cert");
      const img = card && $(".cert-frame img", card);
      if (!img || card.querySelector(".cert-frame.missing")) return;
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = ($("h3", card) || {}).textContent || "";
      if (typeof box.showModal === "function") box.showModal();
      else
        window.open(
          lbImg.src,
          "_blank",
          "noopener",
        ); /* purane browsers ke liye */
      return;
    }
    if (box.open && (e.target === box || e.target.closest("[data-close]")))
      box.close();
  });

  $("#year").textContent = new Date().getFullYear();
})();
