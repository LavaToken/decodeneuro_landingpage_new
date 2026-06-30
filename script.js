document.documentElement.classList.add("has-js");

// Nav: transparent over the hero, solid once scrolled past it.
const nav = document.getElementById("nav");
const onScroll = () => {
  const trigger = window.innerHeight * 0.85;
  nav.classList.toggle("scrolled", window.scrollY > trigger);
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

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
