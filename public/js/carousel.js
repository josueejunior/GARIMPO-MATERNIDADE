(function () {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileQuery = window.matchMedia("(max-width: 639px)");

  document.querySelectorAll("[data-dots-for]").forEach((dotsEl) => {
    const track = document.getElementById(dotsEl.getAttribute("data-dots-for"));
    if (!track) return;

    const slides = Array.from(track.children).filter((node) => node.nodeType === 1);
    if (slides.length < 2) return;

    const buttons = slides.map((slide, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "carousel-dot" + (index === 0 ? " is-active" : "");
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-label", `Item ${index + 1} de ${slides.length}`);
      btn.setAttribute("aria-selected", index === 0 ? "true" : "false");
      btn.addEventListener("click", () => {
        track.scrollTo({
          left: slide.offsetLeft - track.offsetLeft,
          behavior: reducedMotion.matches ? "auto" : "smooth",
        });
      });
      dotsEl.appendChild(btn);
      return btn;
    });

    function setActive(index) {
      buttons.forEach((btn, i) => {
        const active = i === index;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-selected", active ? "true" : "false");
      });
    }

    function updateActive() {
      if (!mobileQuery.matches) return;

      const mid = track.scrollLeft + track.clientWidth * 0.35;
      let active = 0;
      let best = Infinity;

      slides.forEach((slide, i) => {
        const dist = Math.abs(slide.offsetLeft - mid);
        if (dist < best) {
          best = dist;
          active = i;
        }
      });

      setActive(active);
    }

    let scrollEnd;
    track.addEventListener(
      "scroll",
      () => {
        window.clearTimeout(scrollEnd);
        scrollEnd = window.setTimeout(updateActive, 60);
      },
      { passive: true }
    );

    updateActive();
    mobileQuery.addEventListener("change", updateActive);
  });
})();
