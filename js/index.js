(() => {
  "use strict";
  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* Theme toggle */
  const toggle = $("#themeToggle");
  const meta = $('meta[name="theme-color"]');
  const applyTheme = (t) => {
    root.setAttribute("data-theme", t);
    toggle.setAttribute(
      "aria-label",
      t === "dark" ? "Switch to light mode" : "Switch to dark mode",
    );
    meta.content = t === "dark" ? "#23272f" : "#e0e5ec";
  };
  applyTheme(root.getAttribute("data-theme"));
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
  const onScroll = () => header.classList.toggle("scrolled", scrollY > 10);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Active link on scroll */
  const links = $$(".menu a");
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          links.forEach((a) =>
            a.classList.toggle(
              "active",
              a.getAttribute("href") === "#" + en.target.id,
            ),
          );
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  $$("main section[id]").forEach((s) => spy.observe(s));

  /* Skill bars animate once when visible */
  const bars = $(".bars");
  if (bars) {
    const io = new IntersectionObserver(
      ([en]) => {
        if (en.isIntersecting) {
          bars.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(bars);
  }

  /* Contact form: EmailJS se email bhejta hai */
  const EMAILJS_PUBLIC_KEY = "NaoeDxGgxV3coD2Fz"; // <-- EmailJS ki Public Key yahan daalo
  const EMAILJS_SERVICE_ID = "service_bhm5gxa";
  const EMAILJS_TEMPLATE_ID = "template_q3homxg";

  const form = $("#contactForm"),
    status = $("#status"),
    sendBtn = form.querySelector('button[type="submit"]');

  if (window.emailjs) emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = $("#name").value.trim(),
      email = $("#email").value.trim(),
      msg = $("#message").value.trim();

    if (!name || !msg || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent =
        "Please fill in your name, a valid email and a message.";
      return;
    }
    if (!window.emailjs) {
      status.textContent =
        "Email service failed to load. Please try again later.";
      return;
    }

    sendBtn.disabled = true;
    status.textContent = "Sending…";
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        name: name,
        email: email,
        message: msg,
        from_name: name,
        from_email: email,
        reply_to: email,
      });
      status.textContent = "Thanks! Your message has been sent.";
      form.reset();
    } catch (err) {
      status.textContent =
        "Sorry, the message could not be sent. Please try again.";
    } finally {
      sendBtn.disabled = false;
    }
  });

  /* "Code is private" popup */
  const modal = $("#privateModal");
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-private]")) {
      if (modal && typeof modal.showModal === "function") modal.showModal();
      else alert("This code is private."); /* bahut purane browsers ke liye */
      return;
    }
    if (
      modal &&
      modal.open &&
      (e.target === modal || e.target.closest("[data-close]"))
    ) {
      modal.close();
    }
  });

  $("#year").textContent = new Date().getFullYear();
})();
