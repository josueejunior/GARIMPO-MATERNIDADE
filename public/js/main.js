const WA_URL =
  "https://urjzikyckegvjzuskahg.supabase.co/functions/v1/link-preview/mari01";

document.querySelectorAll("[data-wa]").forEach((el) => {
  el.href = WA_URL;
});

document.querySelector(".footer-year").textContent =
  `© ${new Date().getFullYear()} Garimpo Maternidade`;

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".nav a, .footer-links a[href^='#']");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 40);
}, { passive: true });

menuToggle?.addEventListener("click", () => {
  const open = document.body.classList.toggle("nav-open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("nav-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

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
