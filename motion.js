(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = Boolean(window.gsap);
  const hasScrollTrigger = Boolean(window.ScrollTrigger);
  const hasLenis = Boolean(window.Lenis);

  if (prefersReducedMotion || !hasGsap) {
    document.body.classList.remove("is-loading");
    return;
  }

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const ease = "power3.out";

  if (hasScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  document.documentElement.classList.add("motion-ready");

  const splitHeadingLines = () => {
    document
      .querySelectorAll(".hero h1, .about__copy h2, .section-head h2, .ip-section h2, .archive h2")
      .forEach((heading) => {
        if (heading.querySelector(".motion-line")) return;
        const parts = heading.innerHTML.trim().split(/<br\s*\/?>/i);
        heading.innerHTML = parts
          .map((part) => `<span class="motion-line"><span>${part.trim()}</span></span>`)
          .join("");
      });
  };

  splitHeadingLines();

  let lenis = null;

  if (hasLenis && hasScrollTrigger) {
    lenis = new window.Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.82,
      touchMultiplier: 1.15,
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const scrollToTarget = (target) => {
    if (!target) return;
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.05, easing: (t) => 1 - Math.pow(1 - t, 4) });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      scrollToTarget(target);
      history.pushState(null, "", hash);
    });
  });

  const header = document.querySelector("[data-header]");
  const setHeaderState = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  gsap.set(".brand, .site-nav a", { autoAlpha: 0, y: -10 });
  gsap.set(".hero .eyebrow, .hero__foot > *, .scroll-cue", { autoAlpha: 0, y: 18 });
  gsap.set(".hero h1 .motion-line > span", { yPercent: 110 });
  gsap.set(".hero__visual", { clipPath: "inset(12% 0% 12% 0%)" });
  gsap.set(".hero__visual img", { scale: 1.065 });

  const playHeroIntro = () => {
    const timeline = gsap.timeline({ defaults: { ease } });

    timeline
      .to(".brand", { autoAlpha: 1, y: 0, duration: 0.55 }, 0)
      .to(".site-nav a", { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.035 }, 0.05)
      .to(".hero__visual", { clipPath: "inset(0% 0% 0% 0%)", duration: 1.05 }, 0.08)
      .to(".hero__visual img", { scale: 1, duration: 1.25 }, 0.08)
      .to(".hero .eyebrow", { autoAlpha: 1, y: 0, duration: 0.55 }, 0.28)
      .to(".hero h1 .motion-line > span", { yPercent: 0, duration: 0.9, stagger: 0.09 }, 0.38)
      .to(".hero__foot > *", { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.08 }, 0.72)
      .to(".scroll-cue", { autoAlpha: 1, y: 0, duration: 0.5 }, 0.92);
  };

  const splashCover = document.querySelector("[data-splash-cover]");

  window.addEventListener("load", () => {
    if (splashCover) {
      window.addEventListener("portfolio:splash-done", () => gsap.delayedCall(0.08, playHeroIntro), { once: true });
      return;
    }

    gsap.delayedCall(0.58, playHeroIntro);
  });

  if (!hasScrollTrigger) return;

  gsap.to(".hero__visual img", {
    yPercent: -4,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  document.querySelectorAll(".section-panel h2 .motion-line > span").forEach((line) => {
    gsap.fromTo(
      line,
      { yPercent: 112 },
      {
        yPercent: 0,
        duration: 0.9,
        ease,
        scrollTrigger: {
          trigger: line.closest("h2"),
          start: "top 84%",
          once: true,
        },
      }
    );
  });

  gsap.utils
    .toArray(
      ".section-label, .about__copy p, .ip-section__head p, .visual-works__note, .info-grid, .metric, .project-row, .ip-card, .workflow-card, .visual-grid button, .archive__tools, .archive-item, .site-footer"
    )
    .forEach((element) => {
      gsap.fromTo(
        element,
        { autoAlpha: 0, y: 34 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.78,
          ease,
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            once: true,
          },
        }
      );
    });

  gsap.utils.toArray(".ip-card img, .visual-grid img, .archive-item img").forEach((image) => {
    gsap.fromTo(
      image,
      { clipPath: "inset(10% 0% 10% 0%)", scale: 1.045 },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 1,
        duration: 0.9,
        ease,
        scrollTrigger: {
          trigger: image,
          start: "top 90%",
          once: true,
        },
      }
    );
  });

  gsap.utils.toArray(".ip-card, .visual-grid button, .archive-item").forEach((card) => {
    const image = card.querySelector("img");
    if (!image) return;
    card.addEventListener("mouseenter", () => gsap.to(image, { scale: 1.028, duration: 0.5, ease }));
    card.addEventListener("mouseleave", () => gsap.to(image, { scale: 1, duration: 0.55, ease }));
  });

  const metricNumbers = document.querySelectorAll(".metric strong");
  ScrollTrigger.create({
    trigger: ".metrics",
    start: "top 78%",
    once: true,
    onEnter: () => {
      metricNumbers.forEach((numberNode) => {
        const original = numberNode.textContent.trim();
        const match = original.match(/^(\d+)(.*)$/);
        if (!match) return;
        const target = Number(match[1]);
        const suffix = match[2];
        const counter = { value: 0 };
        gsap.to(counter, {
          value: target,
          duration: 1.15,
          ease,
          onUpdate: () => {
            numberNode.textContent = `${Math.round(counter.value)}${suffix}`;
          },
          onComplete: () => {
            numberNode.textContent = original;
          },
        });
      });
    },
  });

  const workflowCards = gsap.utils.toArray(".workflow-card");
  if (workflowCards.length) {
    ScrollTrigger.create({
      trigger: ".workflow",
      start: "top 55%",
      end: "bottom 45%",
      onUpdate: (self) => {
        const activeIndex = Math.min(workflowCards.length - 1, Math.floor(self.progress * workflowCards.length));
        workflowCards.forEach((card, index) => {
          card.classList.toggle("is-current", index === activeIndex);
          card.classList.toggle("is-dimmed", index !== activeIndex);
        });
      },
      onLeave: () => workflowCards.forEach((card) => card.classList.remove("is-current", "is-dimmed")),
      onLeaveBack: () => workflowCards.forEach((card) => card.classList.remove("is-current", "is-dimmed")),
    });
  }

  ScrollTrigger.refresh();
})();
