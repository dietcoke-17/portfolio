const items = document.querySelectorAll(".reveal");
const cursor = document.querySelector(".cursor");
const toggle = document.querySelector(".menu-toggle");
const overlay = document.querySelector(".menu-overlay");
const closeButton = document.querySelector(".menu-close");
const overlayLinks = document.querySelectorAll(".overlay-nav a");
const menuCounter = document.querySelector(".menu-counter");
const interactive = document.querySelectorAll("a, button");
const mainVertical = document.querySelector(".frame-vertical-main");
const mainHorizontal = document.querySelector(".frame-horizontal");
const themeToggle = document.querySelector(".theme-toggle");
const projectList = document.querySelector(".project-list");
const projectsToggle = document.querySelector(".projects-toggle");
const projectExtraGroup = document.querySelector(".project-extra-group");
const THEME_KEY = "portfolio-theme";

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
  }
);

items.forEach((item) => observer.observe(item));

const applyTheme = (theme) => {
  document.body.dataset.theme = theme;

  if (!themeToggle) {
    return;
  }

  const isLight = theme === "light";
  themeToggle.setAttribute(
    "aria-label",
    isLight ? "Switch to dark mode" : "Switch to light mode"
  );
  themeToggle.setAttribute("aria-pressed", String(isLight));
};

const savedTheme = localStorage.getItem(THEME_KEY);
applyTheme(savedTheme === "light" ? "light" : "dark");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme =
      document.body.dataset.theme === "light" ? "dark" : "light";

    applyTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
  });
}

if (projectExtraGroup && projectsToggle) {
  projectExtraGroup.hidden = true;

  projectsToggle.addEventListener("click", () => {
    const isExpanded = projectExtraGroup.hidden;

    projectExtraGroup.hidden = !isExpanded;
    projectList?.classList.toggle("is-expanded", isExpanded);
    projectsToggle.textContent = isExpanded ? "view less" : "view more";
    projectsToggle.setAttribute("aria-expanded", String(isExpanded));
  });
}

if (toggle && overlay) {
  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    overlay.classList.toggle("is-open");
    overlay.setAttribute("aria-hidden", String(expanded));
  });
}

if (closeButton && toggle && overlay) {
  closeButton.addEventListener("click", () => {
    toggle.setAttribute("aria-expanded", "false");
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
  });
}

overlayLinks.forEach((link) => {
  link.addEventListener("mouseenter", () => {
    if (menuCounter) {
      menuCounter.textContent = link.dataset.number || "01";
    }
  });

  link.addEventListener("click", () => {
    if (!toggle || !overlay) {
      return;
    }

    toggle.setAttribute("aria-expanded", "false");
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
  });
});

if (cursor) {
  window.addEventListener("mousemove", (event) => {
    document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
    document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
  });

  document.addEventListener("mouseleave", () => {
    cursor.classList.add("is-hidden");
  });

  document.addEventListener("mouseenter", () => {
    cursor.classList.remove("is-hidden");
  });

  interactive.forEach((item) => {
    item.addEventListener("mouseenter", () => cursor.classList.add("is-link"));
    item.addEventListener("mouseleave", () => cursor.classList.remove("is-link"));
  });

  const setLineState = (enabled) => {
    cursor.classList.toggle("is-line", enabled);
  };

  const syncCursorWithBoard = () => {
    if (!mainVertical || !mainHorizontal) {
      return;
    }

    const x = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--cursor-x")
    );
    const y = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--cursor-y")
    );

    const verticalRect = mainVertical.getBoundingClientRect();
    const horizontalRect = mainHorizontal.getBoundingClientRect();
    const nearVertical = Math.abs(x - verticalRect.left) < 18;
    const belowHorizontal = y > horizontalRect.top - 18;

    setLineState(nearVertical && belowHorizontal);
  };

  window.addEventListener("mousemove", syncCursorWithBoard);
  window.addEventListener("scroll", syncCursorWithBoard, { passive: true });
}

const syncLineFlow = () => {
  if (!mainVertical || !mainHorizontal) {
    return;
  }

  const verticalRect = mainVertical.getBoundingClientRect();
  const horizontalRect = mainHorizontal.getBoundingClientRect();
  const frameTop = verticalRect.top;
  const startY = horizontalRect.top - frameTop;
  const viewportTravel = Math.max(verticalRect.height - startY - 18, 0);
  const maxScroll = Math.max(
    document.documentElement.scrollHeight - window.innerHeight,
    1
  );
  const progress = Math.min(window.scrollY / maxScroll, 1);
  const flowY = startY + viewportTravel * progress;
  const horizontalTravel = Math.max(window.innerWidth * 0.22, 120);
  const flowX = horizontalTravel * progress;

  document.documentElement.style.setProperty("--line-flow-y", `${flowY}px`);
  document.documentElement.style.setProperty("--line-flow-x", `${flowX}px`);
  document.documentElement.style.setProperty(
    "--line-flow-opacity",
    `${0.72 + progress * 0.28}`
  );
};

syncLineFlow();
window.addEventListener("scroll", syncLineFlow, { passive: true });
window.addEventListener("resize", syncLineFlow);
