(function heroCarousel() {
  const root = document.querySelector("[data-hero-carousel]");
  if (!root) return;

  const slides = root.querySelectorAll(".hero-slide");
  const dots = root.querySelectorAll(".hero-carousel-dot");
  if (slides.length < 2) return;

  let index = 0;
  let timer = null;
  const intervalMs = 5500;

  function show(next) {
    index = (next + slides.length) % slides.length;
    slides.forEach((el, i) => {
      el.classList.toggle("is-active", i === index);
      el.setAttribute("aria-hidden", i === index ? "false" : "true");
    });
    dots.forEach((el, i) => {
      el.classList.toggle("is-active", i === index);
      el.setAttribute("aria-selected", i === index ? "true" : "false");
    });
  }

  function start() {
    stop();
    timer = window.setInterval(() => show(index + 1), intervalMs);
  }

  function stop() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      show(i);
      start();
    });
  });

  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", start);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    show(0);
    return;
  }

  show(0);
  start();
})();
