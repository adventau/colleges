# Kaliph Howard — portfolio

A personal college-admissions portfolio for Kaliph Howard (Chicago, Illinois, Class of 2027).
Four real pages: Home, Work, About, Contact. Static HTML, CSS and JavaScript. No build step, no dependencies.

## Run locally

```bash
npm run dev
```

Then open http://127.0.0.1:4173. (Any static server works; `npx serve .` or `python3 -m http.server` are fine too.)

`npm run check` syntax-checks the JavaScript.

## Structure

```
index.html            Home: name, place, year, introduction, the five facets, routes to About and Work
work.html             Work: filterable project index with a sticky identity plate per project
work/*.html           Case studies: student council + class site, Playverse, AVNT, ClaudeKat
404.html              Not-found page (uses absolute paths; serve from the site root)
about.html            About: portrait + facts, biography in short sections, facet map
contact.html          Contact: email (placeholder), location, school
css/site.css          The whole design system (tokens, glass material, nav, pages, motion, responsive)
js/site.js            Progressive enhancement: pointer light, facet tabs, project index, filters
assets/               Portrait placeholder, favicon, Open Graph image, and project images in assets/work/
scripts/dev-server.mjs  Zero-dependency preview server
data/colleges.json    One entry per college for the school-specific pages
scripts/build-colleges.mjs  Generates for/<slug>/index.html from that list  (npm run colleges)
scripts/activities-template.html  Source of the one-page activities PDF in assets/
docs/DESIGN.md        Creative direction, research notes, content guide, what is still placeholder
```

## Editing content

All copy lives in the HTML, next to `<!-- CONTENT: ... -->` comments.
Anything wrapped in `<span class="tbd">` is a statement that needs Kaliph's confirmation and renders with a dashed underline until it is confirmed (remove the span to clear it).
See `docs/DESIGN.md` for the full list of placeholders.

## External resources

Two typefaces are loaded from Google Fonts: **Fraunces** (display serif) and **Instrument Sans** (text).
Both have system fallbacks, so the site is readable offline. No other third-party code.

## Adding real photographs and screenshots

- Portrait: replace `assets/portrait-placeholder.svg` with a photograph cropped to 4:5, then update the `alt` text and `<figcaption>` in `index.html` and `about.html`.
- Project images: each project on the Work page has a `.plate`. Swap the typographic plate for an `<img>` when real screenshots exist. Do not add mockups of screens that do not exist.

## School-specific links

`data/colleges.json` holds one entry per college: `slug`, `name`, `facet` (which of the five facets the page opens on) and `note` (two or three sentences addressed to that school). Run:

```bash
npm run colleges
```

This regenerates `for/<slug>/index.html` for every entry: the normal home page with the note at the top, opening on that facet, marked `noindex`. Share `https://<domain>/for/<slug>/`. Delete the `example` entry before sending real links, and never hand-edit the generated files.

## Activities PDF

`assets/kaliph-howard-activities.pdf` is rendered from `scripts/activities-template.html`. Edit the template, then regenerate with headless Chrome or any print-to-PDF; keep it to one Letter page.

## Sharing metadata

Every page carries Open Graph tags. `og:image` points at `assets/og.png` with a relative path; once the site has a domain, change it to the absolute URL on each page.

## Publishing

Nothing is deployed. GitHub Pages is not enabled and no domain is configured. That is a separate decision.
