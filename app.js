const pageCount = 92;
const pad = (number) => String(number).padStart(2, "0");
const pageSrc = (number, size = "pages") => `assets/portfolio/${size}/page-${pad(number)}.jpg`;
const pdfSrc = "assets/portfolio/zinnia-portfolio-2026.pdf";
const pdfPageSrc = (number) => `${pdfSrc}#page=${Math.max(1, Math.min(pageCount, Number(number) || 1))}`;

const ranges = [
  { key: "cover", label: "Cover", start: 1, end: 5 },
  { key: "campaign", label: "Campaign", start: 6, end: 34 },
  { key: "ip", label: "IP Design", start: 35, end: 54 },
  { key: "workflow", label: "Workflow", start: 55, end: 70 },
  { key: "works", label: "Visual Works", start: 71, end: 92 },
];

const sectionForPage = (page) => ranges.find((range) => page >= range.start && page <= range.end) || ranges[0];

let currentPage = 1;

document.body.classList.add("is-loading");

const loader = document.querySelector("[data-loader]");
const loaderBar = document.querySelector("[data-loader-bar]");
const loaderPercent = document.querySelector("[data-loader-percent]");

let progress = 0;
const loaderTimer = window.setInterval(() => {
  progress = Math.min(progress + Math.ceil(Math.random() * 9), 96);
  loaderBar.style.width = `${progress}%`;
  loaderPercent.textContent = `${progress}%`;
}, 90);

window.addEventListener("load", () => {
  window.clearInterval(loaderTimer);
  loaderBar.style.width = "100%";
  loaderPercent.textContent = "100%";
  window.setTimeout(() => {
    loader.classList.add("is-done");
    document.body.classList.remove("is-loading");
    revealVisible();
  }, 420);
});

const revealItems = [...document.querySelectorAll(".reveal")];
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
);

const revealVisible = () => revealItems.forEach((item) => revealObserver.observe(item));
revealVisible();

const navLinks = [...document.querySelectorAll(".site-nav a")];
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
      });
    });
  },
  { threshold: 0.34 }
);

document.querySelectorAll("section[id]").forEach((section) => sectionObserver.observe(section));

const menuToggle = document.querySelector("[data-menu-toggle]");
const siteNav = document.querySelector("[data-site-nav]");

menuToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav.addEventListener("click", (event) => {
  if (!event.target.matches("a")) return;
  siteNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
});

const hoverPreview = document.querySelector("[data-hover-preview]");
const hoverPreviewImg = hoverPreview.querySelector("img");
const previewRows = document.querySelectorAll("[data-preview]");

previewRows.forEach((row) => {
  row.addEventListener("mouseenter", () => {
    hoverPreviewImg.src = row.dataset.preview;
    hoverPreview.classList.add("is-visible");
  });

  row.addEventListener("mouseleave", () => {
    hoverPreview.classList.remove("is-visible");
  });

  row.addEventListener("mousemove", (event) => {
    hoverPreview.style.left = `${event.clientX}px`;
    hoverPreview.style.top = `${event.clientY}px`;
  });
});

function openPdfPage(page) {
  currentPage = Math.max(1, Math.min(pageCount, Number(page)));
  window.open(pdfPageSrc(currentPage), "_blank", "noopener");
}

document.querySelectorAll("[data-page]").forEach((trigger) => {
  trigger.addEventListener("click", () => openPdfPage(trigger.dataset.page));
});

const archiveGrid = document.querySelector("[data-archive-grid]");
const archiveButtons = [...document.querySelectorAll("[data-filter]")];

function renderArchive(filter = "all") {
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1).filter((page) => {
    const section = sectionForPage(page);
    return filter === "all" || section.key === filter;
  });

  archiveGrid.innerHTML = pages
    .map((page) => {
      const section = sectionForPage(page);
      return `
        <button class="archive-item" type="button" data-page="${page}" data-section-key="${section.key}" title="Open original PDF page ${pad(page)}">
          <img loading="lazy" src="${pageSrc(page, "thumbs")}" alt="Portfolio page ${pad(page)} thumbnail" />
          <span><b>#${pad(page)}</b><em>${section.label}</em></span>
        </button>
      `;
    })
    .join("");

  archiveGrid.querySelectorAll("[data-page]").forEach((item) => {
    item.addEventListener("click", () => openPdfPage(item.dataset.page));
  });
}

archiveButtons.forEach((button) => {
  button.addEventListener("click", () => {
    archiveButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    renderArchive(button.dataset.filter);
  });
});

renderArchive();
