const WA_URL =
  "https://urjzikyckegvjzuskahg.supabase.co/functions/v1/link-preview/mari01";

document.querySelectorAll("[data-wa]").forEach((el) => {
  el.href = WA_URL;
  el.target = "_blank";
  el.rel = "noopener noreferrer";
});

document.querySelector(".footer-year").textContent =
  `© ${new Date().getFullYear()} Garimpo Maternidade`;

const topBar = document.querySelector(".top-bar");
let savedScrollY = 0;
const menuToggle = document.querySelector(".menu-toggle");
const navClose = document.querySelector(".nav-close");
const navBackdrop = document.querySelector(".nav-backdrop");
const navDrawer = document.querySelector("#nav-drawer");
const navLinks = document.querySelectorAll(
  ".nav a, .footer-links a[href^='#'], .nav-drawer-cta"
);

function setMenuOpen(open) {
  document.body.classList.toggle("nav-open", open);
  menuToggle?.setAttribute("aria-expanded", String(open));
  navDrawer?.setAttribute("aria-hidden", String(!open));
  navBackdrop?.setAttribute("aria-hidden", String(!open));

  if (open) {
    savedScrollY = window.scrollY;
    document.body.style.top = `-${savedScrollY}px`;
  } else {
    document.body.style.top = "";
    window.scrollTo(0, savedScrollY);
  }
}

function closeMenu() {
  setMenuOpen(false);
}

function openMenu() {
  setMenuOpen(true);
}

function toggleMenu() {
  const isOpen = document.body.classList.contains("nav-open");
  setMenuOpen(!isOpen);
}

menuToggle?.addEventListener("click", toggleMenu);
navClose?.addEventListener("click", closeMenu);
navBackdrop?.addEventListener("click", closeMenu);

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

window.addEventListener(
  "resize",
  () => {
    if (window.matchMedia("(min-width: 640px)").matches) closeMenu();
  },
  { passive: true }
);

window.addEventListener("scroll", () => {
  topBar?.classList.toggle("scrolled", window.scrollY > 40);
}, { passive: true });

const sections = document.querySelectorAll("section[id], .panel[id]");
const navAnchors = document.querySelectorAll(".nav a[href^='#']");

if (sections.length && navAnchors.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navAnchors.forEach((a) => {
          a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`);
        });
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((sec) => navObserver.observe(sec));
}

const revealEls = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

revealEls.forEach((el) => observer.observe(el));

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
  document.body.classList.remove("custom-cursor");
  document.querySelector(".cursor-fx")?.remove();
}

document.querySelectorAll(".faq-item").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll(".faq-item").forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});
