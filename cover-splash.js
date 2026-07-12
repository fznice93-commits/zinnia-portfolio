(() => {
  const splash = document.querySelector("[data-splash-cover]");
  if (!splash) return;

  const enterTriggers = splash.querySelectorAll("[data-splash-enter]");
  let exitTimer;

  function enterPortfolio() {
    window.clearTimeout(exitTimer);
    splash.classList.add("is-hidden");
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent("portfolio:splash-done"));
    }, 420);
  }

  enterTriggers.forEach((trigger) => {
    trigger.addEventListener("click", enterPortfolio);
  });

  window.addEventListener("load", () => {
    window.setTimeout(() => {
      splash.classList.add("is-ready");
      exitTimer = window.setTimeout(enterPortfolio, 7600);
    }, 120);
  });
})();
