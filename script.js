const page = document.body.dataset.page;
const activeLink = document.querySelector(`[data-nav="${page}"]`);
if (activeLink) activeLink.setAttribute("aria-current", "page");

document.querySelectorAll("[data-year]").forEach((year) => {
  year.textContent = new Date().getFullYear();
});

const observedItems = document.querySelectorAll(".enter-on-view");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6%" });
  observedItems.forEach((item) => observer.observe(item));
} else {
  observedItems.forEach((item) => item.classList.add("is-visible"));
}

const tiltTarget = document.querySelector("[data-tilt]");
const supportsTilt = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches;
if (tiltTarget && supportsTilt) {
  tiltTarget.addEventListener("pointermove", (event) => {
    const bounds = tiltTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    tiltTarget.style.setProperty("--tilt-x", `${y * -2.4}deg`);
    tiltTarget.style.setProperty("--tilt-y", `${x * 3.2}deg`);
  });
  tiltTarget.addEventListener("pointerleave", () => {
    tiltTarget.style.setProperty("--tilt-x", "0deg");
    tiltTarget.style.setProperty("--tilt-y", "0deg");
  });
}

const world = document.querySelector("[data-world]");

if (world) {
  const projectData = {
    juneteenth: {
      index: "01 / Community",
      title: "Lake County Juneteenth",
      description: "Building an experience around culture, gathering, and local impact.",
      tags: ["Community", "Experience", "Design"],
      label: "LCJ",
      note: "the kind of project where every detail changes how welcome people feel",
      href: "./work.html#juneteenth",
    },
    avnt: {
      index: "02 / Entrepreneurship",
      title: "AVNT Brand",
      description: "Turning a creative identity into an evolving product and community ecosystem.",
      tags: ["Business", "Technology", "Brand"],
      label: "AVNT",
      note: "what started as an idea became a place to learn how products and communities grow",
      href: "./work.html#avnt",
    },
    wths: {
      index: "03 / School leadership",
      title: "WTHS Class of 2027",
      description: "A student-built home for events, information, and a stronger class identity.",
      tags: ["Leadership", "School", "Technology"],
      label: "27",
      note: "senior year should feel connected before it becomes a memory",
      href: "./work.html#wths",
    },
    playverse: {
      index: "04 / Digital community",
      title: "Playverse / Super League Soccer",
      description: "Leading a large digital community around competition, play, and belonging.",
      tags: ["Leadership", "Community", "Business"],
      label: "SLS",
      note: "games were the setting; building a community people cared about was the real work",
      href: "./work.html#playverse",
    },
    claudekat: {
      index: "05 / Technology",
      title: "ClaudeKatWebsite",
      description: "Designing and engineering a digital presence from the ground up.",
      tags: ["Technology", "Web", "Design"],
      label: "CK",
      note: "sometimes the fastest way to understand an idea is to build the interface",
      href: "./work.html#claudekat",
    },
    "school-design": {
      index: "06 / Visual communication",
      title: "School Design Work",
      description: "Making student experiences clearer, more inviting, and more memorable.",
      tags: ["Design", "Leadership", "Communication"],
      label: "VIS",
      note: "good design can make school information feel like something made for students",
      href: "./work.html#design",
    },
  };

  const explorer = world.querySelector(".world-explorer");
  const projects = [...world.querySelectorAll(".world-project")];
  const filters = [...world.querySelectorAll("[data-filter]")];
  const preview = world.querySelector("[data-preview]");
  const previewArt = world.querySelector("[data-preview-art]");
  const previewIndex = world.querySelector("[data-preview-index]");
  const previewTitle = world.querySelector("[data-preview-title]");
  const previewDescription = world.querySelector("[data-preview-description]");
  const previewTags = world.querySelector("[data-preview-tags]");
  const previewLink = world.querySelector("[data-preview-link]");
  const previewNote = world.querySelector("[data-preview-note] p");
  const artLabel = world.querySelector("[data-art-label]");
  const connector = world.querySelector(".world-connector");
  const connectorPath = world.querySelector("[data-connector-path]");
  const connectorStart = world.querySelector("[data-connector-start]");
  const connectorEnd = world.querySelector("[data-connector-end]");
  let activeProject = "juneteenth";
  let previewTimer;

  function drawConnector() {
    const active = world.querySelector(".world-project.is-active:not([hidden])");
    if (!active || window.innerWidth < 760) {
      connector.classList.remove("is-visible");
      return;
    }

    const base = explorer.getBoundingClientRect();
    const source = active.getBoundingClientRect();
    const target = preview.getBoundingClientRect();
    const x1 = source.right - base.left + 12;
    const y1 = source.top - base.top + source.height / 2;
    const x2 = target.left - base.left - 14;
    const y2 = target.top - base.top + target.height * 0.48;
    const bend = Math.max(70, (x2 - x1) * 0.46);

    connector.setAttribute("viewBox", `0 0 ${base.width} ${base.height}`);
    connectorPath.setAttribute("d", `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`);
    connectorStart.setAttribute("cx", x1);
    connectorStart.setAttribute("cy", y1);
    connectorEnd.setAttribute("cx", x2);
    connectorEnd.setAttribute("cy", y2);
    connector.classList.add("is-visible");
  }

  function updatePreview(key, shouldFocus = false) {
    const data = projectData[key];
    if (!data || key === activeProject && previewTitle.textContent === data.title) {
      drawConnector();
      return;
    }

    activeProject = key;
    projects.forEach((project) => project.classList.toggle("is-active", project.dataset.project === key));
    preview.classList.add("is-changing");

    window.clearTimeout(previewTimer);
    previewTimer = window.setTimeout(() => {
      previewIndex.textContent = data.index;
      previewTitle.textContent = data.title;
      previewDescription.textContent = data.description;
      previewLink.href = data.href;
      previewTags.replaceChildren(...data.tags.map((tag) => {
        const item = document.createElement("span");
        item.textContent = tag;
        return item;
      }));
      previewNote.textContent = data.note;
      artLabel.textContent = data.label;
      previewArt.className = `world-art world-art--${key}`;
      preview.classList.remove("is-changing");
      drawConnector();
      if (shouldFocus) previewLink.focus({ preventScroll: true });
    }, 140);
  }

  projects.forEach((project) => {
    project.addEventListener("pointerenter", () => updatePreview(project.dataset.project));
    project.addEventListener("focus", () => updatePreview(project.dataset.project));
    project.addEventListener("click", () => updatePreview(project.dataset.project));
  });

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      const category = filter.dataset.filter;
      filters.forEach((item) => item.classList.toggle("is-active", item === filter));
      projects.forEach((project) => {
        project.hidden = category !== "all" && !project.dataset.categories.split(" ").includes(category);
      });
      const active = projects.find((project) => !project.hidden && project.dataset.project === activeProject);
      const firstVisible = projects.find((project) => !project.hidden);
      if (!active && firstVisible) updatePreview(firstVisible.dataset.project);
      window.requestAnimationFrame(drawConnector);
    });
  });

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    world.addEventListener("pointermove", (event) => {
      const bounds = world.getBoundingClientRect();
      world.style.setProperty("--world-x", `${event.clientX - bounds.left}px`);
      world.style.setProperty("--world-y", `${event.clientY - bounds.top}px`);
      const previewBounds = preview.getBoundingClientRect();
      const x = (event.clientX - previewBounds.left) / previewBounds.width - 0.5;
      const y = (event.clientY - previewBounds.top) / previewBounds.height - 0.5;
      preview.style.setProperty("--preview-x", `${Math.max(-1, Math.min(1, y)) * -1.4}deg`);
      preview.style.setProperty("--preview-y", `${Math.max(-1, Math.min(1, x)) * 1.8}deg`);
    });
  }

  window.addEventListener("resize", () => window.requestAnimationFrame(drawConnector));
  window.addEventListener("load", drawConnector, { once: true });
  window.setTimeout(drawConnector, 500);
}

const portal = document.querySelector("[data-portal]");

if (portal) {
  const lensData = {
    leadership: {
      number: "01 / A part of my world",
      title: "Leadership",
      copy: "Giving an idea direction, helping people contribute, and staying responsible for what happens next.",
    },
    technology: {
      number: "02 / A part of my world",
      title: "Technology",
      copy: "Using software to turn an idea into something useful, thoughtful, and real.",
    },
    business: {
      number: "03 / A part of my world",
      title: "Business",
      copy: "Understanding how ideas become products, brands, systems, and opportunities.",
    },
    community: {
      number: "04 / A part of my world",
      title: "Community",
      copy: "Creating spaces where people feel informed, included, and connected to one another.",
    },
  };

  const lensButtons = [...portal.querySelectorAll("[data-lens]")];
  const lensNumber = portal.querySelector("[data-lens-number]");
  const lensTitle = portal.querySelector("[data-lens-title]");
  const lensCopy = portal.querySelector("[data-lens-copy]");
  const coreLabel = portal.querySelector("[data-core-label]");
  const detail = portal.querySelector(".portal-detail");
  let detailTimer;

  function selectLens(key) {
    const data = lensData[key];
    if (!data || portal.dataset.activeLens === key) return;

    portal.dataset.activeLens = key;
    lensButtons.forEach((button) => {
      const isActive = button.dataset.lens === key;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    detail.classList.add("is-changing");
    window.clearTimeout(detailTimer);
    detailTimer = window.setTimeout(() => {
      lensNumber.textContent = data.number;
      lensTitle.textContent = data.title;
      lensCopy.textContent = data.copy;
      if (coreLabel) coreLabel.textContent = data.title;
      detail.classList.remove("is-changing");
    }, 125);
  }

  lensButtons.forEach((button) => {
    const choose = () => selectLens(button.dataset.lens);
    button.addEventListener("click", choose);
    button.addEventListener("focus", choose);
    button.addEventListener("pointerenter", choose);
  });

  if (window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) {
    portal.addEventListener("pointermove", (event) => {
      const bounds = portal.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      portal.style.setProperty("--portal-x", `${x * 100}%`);
      portal.style.setProperty("--portal-y", `${y * 100}%`);
      portal.style.setProperty("--portal-shift-x", `${(x - 0.5) * 20}px`);
      portal.style.setProperty("--portal-shift-y", `${(y - 0.5) * 14}px`);
      portal.style.setProperty("--portal-rotate-x", `${(0.5 - y) * 1.8}deg`);
      portal.style.setProperty("--portal-rotate-y", `${(x - 0.5) * 2.4}deg`);
    });
    portal.addEventListener("pointerleave", () => {
      portal.style.setProperty("--portal-shift-x", "0px");
      portal.style.setProperty("--portal-shift-y", "0px");
      portal.style.setProperty("--portal-rotate-x", "0deg");
      portal.style.setProperty("--portal-rotate-y", "0deg");
    });
  }
}
