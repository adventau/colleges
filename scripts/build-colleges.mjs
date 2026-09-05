// Generates one home page per college from data/colleges.json:  for/<slug>/index.html
// Each page is the normal home page plus a short note addressed to that school,
// opening on the facet that matters most to them. Run: npm run colleges
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const colleges = JSON.parse(readFileSync(join(root, "data/colleges.json"), "utf8"));
const template = readFileSync(join(root, "index.html"), "utf8");
const FACETS = ["leadership", "technology", "business", "community", "design"];
// Validate optional school accent colors as six-digit hex values.
function lum(hex) { const m = hex.replace("#", "").match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i); if (!m) throw new Error(`Bad color: ${hex} (use six-digit hex)`); const [r, g, b] = m.slice(1).map((h) => { const c = parseInt(h, 16) / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const outRoot = join(root, "for");
// Validate every record before writing. Never remove unrelated school pages.
const seen = new Set();
for (const c of colleges) {
  if (!/^[a-z0-9-]+$/.test(c.slug) || seen.has(c.slug)) throw new Error(`Invalid or duplicate slug: ${c.slug}`);
  seen.add(c.slug);
  if (!FACETS.includes(c.facet)) throw new Error(`Bad facet for ${c.slug}`);
  for (const field of ["name", "note"]) if (typeof c[field] !== "string" || !c[field].trim()) throw new Error(`Missing ${field} for ${c.slug}`);
  if (c.heading !== undefined && typeof c.heading !== "string") throw new Error(`Bad heading for ${c.slug}`);
  if (c.firstChoice !== undefined && typeof c.firstChoice !== "boolean") throw new Error(`Bad firstChoice for ${c.slug}`);
  if (c.color) lum(c.color);
  if (c.color2) lum(c.color2);
}

for (const c of colleges) {
  if (!/^[a-z0-9-]+$/.test(c.slug)) throw new Error(`Bad slug: ${c.slug} (lowercase letters, digits, hyphens)`);
  if (!FACETS.includes(c.facet)) throw new Error(`Bad facet for ${c.slug}: ${c.facet}`);
  let html = template;

  // Paths: the page lives two folders deep.
  html = html.replace(/(href|src|content)="\.\//g, '$1="../../');

  // Identity: which school, which facet to open on, keep it out of search engines.
  html = html.replace('<html lang="en" class="no-js" data-facet="leadership">', `<html lang="en" class="no-js" data-facet="${c.facet}" data-for="${c.slug}">`);
  html = html.replace(/<title>[^<]*<\/title>/, `<title>Kaliph Howard — for ${esc(c.name)}</title>`);
  html = html.replace('</head>', '  <meta name="robots" content="noindex, nofollow">\n</head>');
  html = html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="Kaliph Howard — for ${esc(c.name)}">`);

  // Open on the chosen facet: move aria-selected / tabindex / hidden to the right tab and panel.
  for (const f of FACETS) {
    const on = f === c.facet;
    html = html.replace(new RegExp(`(id="tab-${f}"[^>]*?)aria-selected="(true|false)"( tabindex="-1")?`), `$1aria-selected="${on}"${on ? "" : ' tabindex="-1"'}`);
    html = html.replace(new RegExp(`(<div class="facet-panel" role="tabpanel" id="panel-${f}" aria-labelledby="tab-${f}")( hidden)?>`), `$1${on ? "" : " hidden"}>`);
  }

  // A small invitation belongs near the name; the complete letter follows the facets.
  const style = ` style="--school:${c.color || '#004684'};--school-2:${c.color2 || '#f3b800'}"`;
  const short = esc(c.short || c.name);
  const invitation = `<a class="college-invitation" href="#college-letter">A note for ${short} <span aria-hidden="true">↘</span></a>`;
  const paragraphs = c.note.split(/\n\s*\n/).map((p) => `<p>${esc(p)}</p>`).join("\n        ");
  const note = `
  <section class="college-letter section wrap" id="college-letter" aria-labelledby="college-letter-title"${style}>
    <div class="college-letter__inner" data-reveal>
      <aside class="college-letter__aside">
        <p class="eyebrow">The next chapter</p>
        <h2 id="college-letter-title">${esc(c.name)}</h2>
        ${c.firstChoice ? '<p class="college-letter__choice">My first-choice university</p>' : ""}
      </aside>
      <div class="college-letter__body">
        <h3>${esc(c.heading || 'Why I can picture myself here.')}</h3>
        ${paragraphs}
        <p class="college-letter__sign">Kaliph Howard</p>
        <nav class="college-letter__links" aria-label="Work connected to this note">
          <a href="../../work/wths.html">Student Council &amp; the class website ↗</a>
          <a href="../../work/nibsu.html">My Black Student Union work ↗</a>
          <a href="../../work/avnt.html">My interest in entrepreneurship ↗</a>
        </nav>
      </div>
    </div>
  </section>`;
  if (!html.includes('<!-- COLLEGE_INVITATION -->') || !html.includes('<!-- COLLEGE_LETTER -->')) throw new Error('College insertion points are missing');
  html = html.replace('<!-- COLLEGE_INVITATION -->', invitation).replace('<!-- COLLEGE_LETTER -->', note);

  const dir = join(outRoot, c.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html.replace(/[ \t]+$/gm, ""));
  console.log(`for/${c.slug}/  ←  ${c.name} (${c.facet})`);
}
