// Generates one home page per college from data/colleges.json:  for/<slug>/index.html
// Each page is the normal home page plus a short note addressed to that school,
// opening on the facet that matters most to them. Run: npm run colleges
import { mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const colleges = JSON.parse(readFileSync(join(root, "data/colleges.json"), "utf8"));
const template = readFileSync(join(root, "index.html"), "utf8");
const FACETS = ["leadership", "technology", "business", "community", "design"];
// School colour: an optional hex like "#4e2a84". Text on it is chosen for contrast at build time.
function lum(hex) { const m = hex.replace("#", "").match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i); if (!m) throw new Error(`Bad color: ${hex} (use six-digit hex)`); const [r, g, b] = m.slice(1).map((h) => { const c = parseInt(h, 16) / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const outRoot = join(root, "for");
if (existsSync(outRoot)) rmSync(outRoot, { recursive: true });

for (const c of colleges) {
  if (!/^[a-z0-9-]+$/.test(c.slug)) throw new Error(`Bad slug: ${c.slug} (lowercase letters, digits, hyphens)`);
  if (!FACETS.includes(c.facet)) throw new Error(`Bad facet for ${c.slug}: ${c.facet}`);
  let html = template;

  // Paths: the page lives two folders deep.
  html = html.replace(/(href|src)="\.\//g, '$1="../../');

  // Identity: which school, which facet to open on, keep it out of search engines.
  html = html.replace('<html lang="en" class="no-js" data-facet="leadership">', `<html lang="en" class="no-js" data-facet="${c.facet}" data-for="${c.slug}">`);
  html = html.replace(/<title>[^<]*<\/title>/, `<title>Kaliph Howard — for ${esc(c.name)}</title>`);
  html = html.replace('<meta name="theme-color" content="#f3efe7">', '<meta name="theme-color" content="#f3efe7">\n  <meta name="robots" content="noindex, nofollow">');
  html = html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="Kaliph Howard — for ${esc(c.name)}">`);

  // Open on the chosen facet: move aria-selected / tabindex / hidden to the right tab and panel.
  for (const f of FACETS) {
    const on = f === c.facet;
    html = html.replace(new RegExp(`(id="tab-${f}"[^>]*?)aria-selected="(true|false)"( tabindex="-1")?`), `$1aria-selected="${on}"${on ? "" : ' tabindex="-1"'}`);
    html = html.replace(new RegExp(`(<div class="facet-panel" role="tabpanel" id="panel-${f}" aria-labelledby="tab-${f}")( hidden)?>`), `$1${on ? "" : " hidden"}>`);
  }

  // The note itself, at the top of main. The school's colour, if given, tints the card only.
  const style = c.color ? ` style="--school:${c.color};--school-ink:${lum(c.color) > 0.35 ? "#17181c" : "#ffffff"}"` : "";
  const note = `
    <!-- School-specific note, generated from data/colleges.json -->
    <section class="for enter" style="--i:0" aria-labelledby="for-title">
      <div class="for__card${c.color ? " for__card--tinted" : ""}"${style}>
        <p class="for__label"><span>For ${esc(c.name)}</span></p>
        <h2 id="for-title" class="serif for__title">A note for your admissions office.</h2>
        <p class="for__note">${esc(c.note)}</p>
        <p class="for__sign">Kaliph Howard · Chicago · Class of 2027</p>
      </div>
    </section>
`;
  html = html.replace('<main id="main">\n', `<main id="main">${note}`);

  const dir = join(outRoot, c.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html);
  console.log(`for/${c.slug}/  ←  ${c.name} (${c.facet})`);
}
