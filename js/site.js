/* Kaliph Howard — portfolio behaviour.
   Progressive enhancement only: every page reads fine with this file missing. */
(() => {
  "use strict";
  const doc = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- Year ---------- */
  $$("[data-year]").forEach((el) => (el.textContent = String(new Date().getFullYear())));

  /* ---------- Split headline text into masked words ---------- */
  $$("[data-split]").forEach((el) => {
    const walk = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            const w = document.createElement("span"); w.className = "w";
            const inner = document.createElement("span"); inner.textContent = part;
            w.appendChild(inner); frag.appendChild(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && child.tagName !== "BR") walk(child);
      });
    };
    walk(el);
    $$(".w > span", el).forEach((sp, j) => sp.style.setProperty("--j", j));
  });

  /* ---------- Reveal on scroll ---------- */
  const revealables = $$("[data-reveal], [data-split], [data-stagger]");
  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.05 });
    revealables.forEach((el) => io.observe(el));
    // Belt and braces: anything near the viewport shows even if the observer is throttled.
    const sweep = () => revealables.forEach((el) => { if (el.classList.contains("in")) return; const r = el.getBoundingClientRect(); if (r.top < window.innerHeight * 1.05 && r.bottom > 0) { el.classList.add("in"); io.unobserve(el); } });
    setTimeout(sweep, 0); setTimeout(sweep, 400);
    window.addEventListener("scroll", sweep, { passive: true });
    document.addEventListener("visibilitychange", sweep);
  } else revealables.forEach((el) => el.classList.add("in"));

  /* ---------- Header rule once scrolled ---------- */
  const head = $(".site-head");
  if (head) {
    const onScroll = () => head.classList.toggle("is-scrolled", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Menu (phones) ---------- */
  const menuBtn = $(".menu-btn"), menu = $(".menu");
  if (menuBtn && menu) {
    const setOpen = (open) => {
      menuBtn.setAttribute("aria-expanded", String(open));
      menu.classList.toggle("is-open", open);
      body.style.overflow = open ? "hidden" : "";
      if (open) $("a", menu).focus({ preventScroll: true });
    };
    menuBtn.addEventListener("click", () => setOpen(menuBtn.getAttribute("aria-expanded") !== "true"));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && menu.classList.contains("is-open")) { setOpen(false); menuBtn.focus(); } });
    $$("a", menu).forEach((a) => a.addEventListener("click", () => setOpen(false)));
  }

  /* ---------- Facets: tabs ---------- */
  const tabs = $$(".facet-tab");
  if (tabs.length) {
    const panels = $$(".facet-panel");
    const select = (tab, focus = false) => {
      tabs.forEach((t) => { const on = t === tab; t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; });
      panels.forEach((p) => { const on = p.id === tab.getAttribute("aria-controls"); p.hidden = !on; if (on) { p.style.animation = "none"; void p.offsetWidth; p.style.animation = ""; } });
      doc.dataset.facet = tab.dataset.facet;
      if (focus) tab.focus();
    };
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => select(tab));
      if (finePointer.matches) tab.addEventListener("pointerenter", () => select(tab));
      tab.addEventListener("keydown", (e) => {
        const i = tabs.indexOf(tab);
        const map = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
        if (!(e.key in map)) return;
        e.preventDefault();
        select(tabs[(map[e.key] + tabs.length) % tabs.length], true);
      });
    });
  }

  /* ---------- Lightbox ---------- */
  const zooms = $$("[data-lightbox]");
  if (zooms.length && "HTMLDialogElement" in window) {
    const dialog = document.createElement("dialog");
    dialog.className = "lightbox"; dialog.setAttribute("aria-label", "Enlarged screenshot");
    dialog.innerHTML = '<button class="lightbox__close" type="button">Close ✕</button><img alt=""><p></p>';
    body.appendChild(dialog);
    const img = $("img", dialog), cap = $("p", dialog);
    let opener = null;
    zooms.forEach((a) => a.addEventListener("click", (e) => {
      e.preventDefault(); opener = a;
      const inner = $("img", a);
      img.src = a.getAttribute("href"); img.alt = inner ? inner.alt : "";
      cap.textContent = a.closest("figure")?.querySelector("figcaption")?.textContent || "";
      dialog.showModal();
    }));
    $(".lightbox__close", dialog).addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener("close", () => { img.removeAttribute("src"); opener?.focus(); });
  }

  /* ---------- Copy email ---------- */
  $$("[data-copy]").forEach((btn) => btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      const was = btn.textContent; btn.textContent = "Copied"; btn.classList.add("is-done");
      setTimeout(() => { btn.textContent = was; btn.classList.remove("is-done"); }, 1800);
    } catch { location.href = `mailto:${btn.dataset.copy}`; }
  }));

  body.classList.add("is-ready");
})();
