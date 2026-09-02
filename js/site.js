/* Kaliph Howard — portfolio behaviour.
   Everything here is progressive enhancement: the pages read fine without it. */
(() => {
  "use strict";
  const doc = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  /* ---------- Year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = String(new Date().getFullYear())));

  /* ---------- Entrance ----------
     Added synchronously: a throttled rAF (background tab) must never leave content invisible. */
  document.body.classList.add("is-ready");

  /* ---------- Pointer light: scene parallax + glass specular ----------
     One rAF loop, values lerped so the light feels like it has weight. */
  const glass = Array.from(document.querySelectorAll(".glass"));
  let targetX = 0, targetY = 0, curX = 0, curY = 0, pointerX = -1, pointerY = -1, raf = 0;

  function tick() {
    raf = 0;
    curX += (targetX - curX) * 0.08;
    curY += (targetY - curY) * 0.08;
    doc.style.setProperty("--px", curX.toFixed(4));
    doc.style.setProperty("--py", curY.toFixed(4));
    if (pointerX >= 0) {
      for (const el of glass) {
        const r = el.getBoundingClientRect();
        if (r.width === 0) continue;
        el.style.setProperty("--lx", `${pointerX - r.left}px`);
        el.style.setProperty("--ly", `${pointerY - r.top}px`);
      }
    }
    if (Math.abs(targetX - curX) > 0.001 || Math.abs(targetY - curY) > 0.001) raf = requestAnimationFrame(tick);
  }
  function schedule() { if (!raf) raf = requestAnimationFrame(tick); }

  if (finePointer.matches && !reduceMotion.matches) {
    window.addEventListener("pointermove", (e) => {
      pointerX = e.clientX; pointerY = e.clientY;
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = (e.clientY / window.innerHeight) * 2 - 1;
      schedule();
    }, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
  } else if (!reduceMotion.matches && window.DeviceOrientationEvent && "ontouchstart" in window) {
    // Touch devices: a whisper of tilt parallax, if the browser allows it without a permission prompt.
    window.addEventListener("deviceorientation", (e) => {
      if (e.gamma == null || e.beta == null) return;
      targetX = Math.max(-1, Math.min(1, e.gamma / 30));
      targetY = Math.max(-1, Math.min(1, (e.beta - 40) / 30));
      schedule();
    }, { passive: true });
  }

  /* ---------- Home: facet tabs ---------- */
  const tablist = document.querySelector('.facets__tabs[role="tablist"]');
  if (tablist) {
    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
    const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));
    let current = tabs.findIndex((t) => t.getAttribute("aria-selected") === "true");

    function select(i, { focus = false } = {}) {
      if (i === current) { if (focus) tabs[i].focus(); return; }
      tabs.forEach((t, k) => { t.setAttribute("aria-selected", String(k === i)); t.tabIndex = k === i ? 0 : -1; });
      panels.forEach((p, k) => { p.hidden = k !== i; });
      doc.dataset.facet = tabs[i].dataset.facet;
      current = i;
      if (focus) tabs[i].focus();
      try { sessionStorage.setItem("facet", tabs[i].dataset.facet); } catch (_) {}
    }

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => select(i));
      tab.addEventListener("pointerenter", () => { if (finePointer.matches) select(i); });
      tab.addEventListener("keydown", (e) => {
        const n = tabs.length;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); select((i + 1) % n, { focus: true }); }
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); select((i - 1 + n) % n, { focus: true }); }
        else if (e.key === "Home") { e.preventDefault(); select(0, { focus: true }); }
        else if (e.key === "End") { e.preventDefault(); select(n - 1, { focus: true }); }
      });
    });

    // Return visitors land on the facet they last chose, unless this is a
    // school-specific page, which always opens on the facet chosen for that school.
    if (!doc.dataset.for) {
      try {
        const saved = sessionStorage.getItem("facet");
        const k = tabs.findIndex((t) => t.dataset.facet === saved);
        if (k >= 0) select(k);
      } catch (_) {}
    }
  }

  /* ---------- Work: index rows, sticky preview, filters ---------- */
  const index = document.querySelector(".index");
  if (index) {
    const rows = Array.from(index.querySelectorAll(".project"));
    const plates = Array.from(document.querySelectorAll(".index__preview .plate"));
    const filters = Array.from(document.querySelectorAll(".filter"));

    function showPlate(id) {
      plates.forEach((p) => p.classList.toggle("is-active", p.dataset.for === id));
      const row = rows.find((r) => r.id === id);
      if (row && row.dataset.facet) doc.dataset.facet = row.dataset.facet;
    }

    rows.forEach((row) => {
      const btn = row.querySelector(".project__row");
      const body = row.querySelector(".project__body");
      btn.addEventListener("click", () => {
        const open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open));
        body.hidden = open;
        if (!open) showPlate(row.id);
      });
      row.addEventListener("pointerenter", () => showPlate(row.id));
      row.addEventListener("focusin", () => showPlate(row.id));
    });

    function applyFilter(name) {
      filters.forEach((f) => f.setAttribute("aria-pressed", String(f.dataset.filter === name)));
      let firstVisible = null;
      rows.forEach((row) => {
        const show = name === "all" || row.dataset.facets.split(" ").includes(name);
        row.hidden = !show;
        if (show && !firstVisible) firstVisible = row;
      });
      if (firstVisible) showPlate(firstVisible.id);
      const facet = name === "all" ? "leadership" : name;
      doc.dataset.facet = facet;
      if (name !== "all") history.replaceState(null, "", `#${name}`);
      else history.replaceState(null, "", location.pathname);
    }
    filters.forEach((f) => f.addEventListener("click", () => applyFilter(f.dataset.filter)));

    const hash = location.hash.replace("#", "");
    if (hash) {
      if (filters.some((f) => f.dataset.filter === hash)) applyFilter(hash);
      else {
        const target = rows.find((r) => r.id === hash);
        if (target) {
          target.querySelector(".project__row").click();
          target.scrollIntoView({ block: "start" });
        }
      }
    } else if (rows[0]) showPlate(rows[0].id);
  }

  /* ---------- About: facet map colours the scene on hover/focus ---------- */
  document.querySelectorAll(".map li[data-facet]").forEach((li) => {
    const set = () => (doc.dataset.facet = li.dataset.facet);
    li.addEventListener("pointerenter", set);
    li.addEventListener("focusin", set);
  });
})();
