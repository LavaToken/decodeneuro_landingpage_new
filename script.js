import Lenis from "lenis";
import "lenis/dist/lenis.css";

document.documentElement.classList.add("has-js");

const nav = document.getElementById("nav");
const heroEl = document.querySelector(".hero");
const heroBgEl = document.querySelector(".hero-bg");
const headlineEl = document.querySelector(".hero-content h1");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const updateNavScrolled = (scroll) => {
  const trigger = window.innerHeight * 0.85;
  nav.classList.toggle("scrolled", scroll > trigger);
};

const updateHeroParallax = (scroll) => {
  if (!heroEl || !heroBgEl) return;

  const heroHeight = heroEl.offsetHeight;
  if (scroll >= heroHeight) return;

  heroBgEl.style.transform = `translate3d(0, ${scroll * 0.4}px, 0)`;

  if (headlineEl) {
    const fadeProgress = Math.min(scroll / (heroHeight * 0.6), 1);
    headlineEl.style.opacity = String(1 - fadeProgress);
    headlineEl.style.transform = `translate3d(0, ${scroll * 0.15}px, 0)`;
  }
};

let lenis;

if (!prefersReducedMotion) {
  lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.5,
  });

  window.lenis = lenis;

  lenis.on("scroll", ({ scroll }) => {
    updateNavScrolled(scroll);
    updateHeroParallax(scroll);
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      lenis.scrollTo(target);
    });
  });

  updateNavScrolled(0);
  updateHeroParallax(0);
} else {
  const onScroll = () => {
    updateNavScrolled(window.scrollY);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// Scroll-triggered fade-up reveal.
const revealEls = document.querySelectorAll(".fade-up");
if (revealEls.length && "IntersectionObserver" in window) {
  revealEls.forEach((el) => el.classList.add("observed-hidden"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("observed-hidden");
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  // Safety net: reveal anything still hidden if the observer never fires.
  setTimeout(() => {
    document.querySelectorAll(".fade-up.observed-hidden:not(.in)").forEach((el) => {
      el.classList.remove("observed-hidden");
      el.classList.add("in");
    });
  }, 1500);
} else {
  revealEls.forEach((el) => el.classList.add("in"));
}

// Interactive step tabs.
const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");
tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const index = btn.dataset.tab;
    tabButtons.forEach((b) => b.classList.toggle("is-active", b === btn));
    tabPanels.forEach((p) => p.classList.toggle("hidden", p.dataset.panel !== index));
  });
});
