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

  // The note itself, at the top of main.
  const note = `
    <!-- School-specific note, generated from data/colleges.json -->
    <section class="for enter" style="--i:0" aria-labelledby="for-title">
      <div class="for__card">
        <p class="glass for__label"><span>For ${esc(c.name)}</span></p>
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
