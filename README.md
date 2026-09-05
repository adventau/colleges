# Kaliph Howard — portfolio

A personal portfolio for Warren Township High School's Class of 2027, with a dedicated N.C. A&T introduction. Static HTML, CSS, and JavaScript; no frontend dependencies or compilation step.

## Local preview

Run `npm run dev`, then open the URL printed by the server. The default is `http://127.0.0.1:4173`. Set `PORT` to choose another port.

Pages are generated: edit `scripts/build-pages.mjs`, then run `npm run pages` (which also refreshes the school pages). Run `npm run check` for syntax checks. See `docs/HANDOFF.md` for the working state and open items.

## Pages

- `index.html`: personal introduction and five interactive areas of interest, kept deliberately short.
- `work.html`: a dated timeline. Kaliph's six own roles and projects (with thumbnails, one line of what he did, sourced metric chips, and links to their studies) sit alongside thirteen compact project-management entries for other teams' projects, dated by each project's own date. Ongoing roles sit under Now.
- `work/*.html`: individual studies of Student Council and the class website, NIBSU, Juneteenth Lake County, AVNT, Playverse, and Hearth (built under the working name Royal Vault; the page is work/hearth.html).
- `about.html`: personal interests, current learning, the "People. Ideas. Follow-through." passage, and college aspirations.
- `contact.html`: public email and activities summary.
- `for/ncat/index.html`: generated A&T introduction with links to relevant work.
- `404.html`: recovery links for missing pages.

## Content and assets

Copy lives in the HTML. The site uses existing project screenshots, AVNT artwork, and Kaliph's studio headshot (`assets/kaliph-howard.jpg`, supplied September 4, 2026, cropped 4:5) in the home hero and on About. No stock or generated image is presented as Kaliph.

College notes live in `data/colleges.json`. Each record has a slug, name, facet, note, optional heading, optional `firstChoice` boolean, and school colors. The generator validates all records before writing and preserves unrelated folders. Remove retired school pages explicitly after updating the data. `noindex` discourages search indexing; it provides no access control.

The activities summary uses `data/activities.json`. After editing those descriptions, run `python3 scripts/build-activities.py` with ReportLab installed (for example `python3 -m venv /tmp/rl && /tmp/rl/bin/pip install reportlab && /tmp/rl/bin/python scripts/build-activities.py`). This produces both `assets/kaliph-howard-activities.pdf` and `scripts/activities-template.html`. Check the one-page PDF after regenerating it.

The social preview image `assets/og.png` is rendered from `scripts/og-template.html` with `npm run og` (headless Google Chrome, 1200×630).

The public email is `adventacious@gmail.com`, supplied by Kaliph on September 4, 2026. Current academic copy follows his latest course list: Language and Composition is not labeled AP, and ASU coursework is in progress.

## Design and behavior

Warm stone ground, Newsreader serif headlines in normal case, Manrope body text, and JetBrains Mono for small labels, all from Google Fonts. Each facet (leadership, technology, business, community, design) has one muted accent colour; the root `data-facet` attribute chooses it, and the accent is used sparingly for eyebrow rules, italic emphasis, and hover states rather than for large areas.

Character comes from a few deliberate moves rather than effects: a tilted index card beside the name, a tinted facet panel with a large numeral, one dark warm section per page, offset colour mats behind case-study covers, and a hand-drawn underline under each italic accent line. Motion lives in `js/site.js` as progressive enhancement: word-by-word headline reveals, gentle fade-ins on scroll, a cross-fade between pages via view transitions, and hover states. Tabs support arrow keys, Home, and End; the home page panels link to the Work timeline; screenshots open in a native dialog that returns focus when closed; phones get a full-screen menu behind the Menu button. Everything honours `prefers-reduced-motion`, and every page reads fully without JavaScript.

## Publishing

This revision is for local review. No deployment, domain configuration, or remote push is included. Preserve that boundary until Kaliph explicitly requests publication. Existing social preview artwork is retained; absolute social URLs can be set once a final domain is known.
