(function initCustomCursor() {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!finePointer.matches || reducedMotion.matches) return;

  const root = document.body;
  const layer = document.querySelector(".cursor-fx");
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");

  if (!layer || !dot || !ring) return;

  root.classList.add("custom-cursor");

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx;
  let ry = my;
  let visible = false;

  const hoverTargets =
    "a, button, summary, .cta, .card, .nav-cta, .float-wa, .faq-item summary";

  const setPos = (el, x, y) => {
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const onMove = (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (!visible) {
      visible = true;
      layer.style.opacity = "1";
      rx = mx;
      ry = my;
      setPos(dot, mx, my);
      setPos(ring, mx, my);
    }
  };

  const tick = () => {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    setPos(ring, rx, ry);
    setPos(dot, mx, my);
    requestAnimationFrame(tick);
  };

  const spawnSpark = (x, y) => {
    const colors = ["#ff6bcb", "#ffd166", "#7dffb8", "#5ec4ff", "#c77dff"];
    for (let i = 0; i < 8; i++) {
      const s = document.createElement("span");
      s.className = "cursor-spark";
      s.style.left = `${x}px`;
      s.style.top = `${y}px`;
      s.style.background = colors[i % colors.length];
      const angle = (Math.PI * 2 * i) / 8;
      const dist = 24 + Math.random() * 20;
      s.style.setProperty("--tx", `${Math.cos(angle) * dist}px`);
      s.style.setProperty("--ty", `${Math.sin(angle) * dist}px`);
      layer.appendChild(s);
      s.addEventListener("animationend", () => s.remove());
    }
  };

  window.addEventListener("mousemove", onMove, { passive: true });

  window.addEventListener("mousedown", () => {
    root.classList.add("cursor-click");
    spawnSpark(mx, my);
  });

  window.addEventListener("mouseup", () => {
    root.classList.remove("cursor-click");
  });

  document.addEventListener("mouseover", (e) => {
    root.classList.toggle("cursor-hover", !!e.target.closest(hoverTargets));
  });

  window.addEventListener("mouseleave", () => {
    layer.style.opacity = "0";
    visible = false;
  });

  window.addEventListener("mouseenter", () => {
    if (visible) layer.style.opacity = "1";
  });

  finePointer.addEventListener("change", (e) => {
    if (!e.matches) {
      root.classList.remove("custom-cursor", "cursor-hover", "cursor-click");
      layer.style.display = "none";
    }
  });

  requestAnimationFrame(tick);
})();
