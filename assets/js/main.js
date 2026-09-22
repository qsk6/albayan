const TOOL_LINKS = {
  // عدّل رابط مولّد الباج من هنا فقط.
  badgeGenerator: "https://github.com/qsk6/badge-generator"
};

const CATEGORY_ALIASES = {
  all: "all",
  الكل: "all",
  students: "students",
  طلاب: "students",
  "أدوات-طلابية": "students",
  cards: "cards",
  بطاقات: "cards",
  badges: "cards",
  qr: "qr",
  "qr-code": "qr",
  صور: "images",
  images: "images",
  ملفات: "files",
  files: "files",
  حاسبات: "calculators",
  calculators: "calculators"
};

function normalizeCategory(value) {
  if (!value) return "all";
  const key = String(value).trim().toLowerCase();
  return CATEGORY_ALIASES[key] || "all";
}

function setupMobileMenu() {
  const toggleButton = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-main-nav]");

  if (!toggleButton || !nav) return;

  toggleButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggleButton.setAttribute("aria-expanded", String(isOpen));
  });
}

function setupActiveNav() {
  const page = document.body.dataset.page;
  const links = document.querySelectorAll(".nav-link[data-page]");

  links.forEach((link) => {
    const isActive = link.dataset.page === page;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function setupDynamicYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll(".js-year").forEach((el) => {
    el.textContent = year;
  });
}

function bindToolLinks() {
  const badgeLinks = document.querySelectorAll("[data-tool-link='badge']");
  badgeLinks.forEach((link) => {
    link.setAttribute("href", TOOL_LINKS.badgeGenerator);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });
}

function setupFilters() {
  const filterButtons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll("[data-tool-category]");
  const noResults = document.querySelector("[data-no-results]");

  if (!filterButtons.length || !cards.length) return;

  const applyFilter = (rawCategory) => {
    const category = normalizeCategory(rawCategory);
    let visibleCount = 0;

    cards.forEach((card) => {
      const cardCategory = card.dataset.toolCategory;
      const show = category === "all" || cardCategory === category;
      card.hidden = !show;
      if (show) visibleCount += 1;
    });

    filterButtons.forEach((button) => {
      const buttonCategory = normalizeCategory(button.dataset.filter);
      button.classList.toggle("is-active", buttonCategory === category);
      button.setAttribute("aria-pressed", String(buttonCategory === category));
    });

    if (noResults) {
      noResults.hidden = visibleCount > 0;
    }
  };

  const searchParams = new URLSearchParams(window.location.search);
  const initialCategory = normalizeCategory(searchParams.get("category"));
  applyFilter(initialCategory);

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = normalizeCategory(button.dataset.filter);
      applyFilter(category);
      const url = new URL(window.location.href);
      if (category === "all") {
        url.searchParams.delete("category");
      } else {
        url.searchParams.set("category", category);
      }
      window.history.replaceState({}, "", url);
    });
  });
}

function init() {
  setupMobileMenu();
  setupActiveNav();
  setupDynamicYear();
  bindToolLinks();
  setupFilters();
}

document.addEventListener("DOMContentLoaded", init);
