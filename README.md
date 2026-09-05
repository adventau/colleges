# Kaliph Howard — portfolio

A personal portfolio for Warren Township High School's Class of 2027, with a dedicated N.C. A&T introduction. Static HTML, CSS, and JavaScript; no frontend dependencies or compilation step.

## Local preview

Run `npm run dev`, then open the URL printed by the server. The default is `http://127.0.0.1:4173`. Set `PORT` to choose another port.

Run `npm run check` for JavaScript syntax checks and `npm run colleges` after changing the homepage or `data/colleges.json`.

## Pages

- `index.html`: personal introduction and five interactive areas of interest.
- `work.html`: six filterable projects, with roles visible before expanding.
- `work/*.html`: individual studies of Student Council and the class website, NIBSU, Juneteenth Lake County, AVNT, Playverse, and Royal Vault.
- `about.html`: personal interests, current learning, and college aspirations.
- `contact.html`: public email and activities summary.
- `for/ncat/index.html`: generated A&T introduction with links to relevant work.
- `404.html`: recovery links for missing pages.

## Content and assets

Copy lives in the HTML. The site uses existing project screenshots and AVNT artwork. The small `kh.` identity treatment is intentional; no stock or generated image is presented as Kaliph. A real portrait can be added when supplied.

College notes live in `data/colleges.json`. Each record has a slug, name, facet, note, optional heading, optional `firstChoice` boolean, and school colors. The generator validates all records before writing and preserves unrelated folders. Remove retired school pages explicitly after updating the data. `noindex` discourages search indexing; it provides no access control.

The activities summary uses `data/activities.json`. After editing those descriptions, run `python3 scripts/build-activities.py` with ReportLab installed. This produces both `assets/kaliph-howard-activities.pdf` and `scripts/activities-template.html`. Check the one-page PDF after regenerating it.

The public email is `adventacious@gmail.com`, supplied by Kaliph on September 4, 2026. Current academic copy follows his latest course list: Language and Composition is not labeled AP, and ASU coursework is in progress.

## Design and behavior

Cool white, navy, cobalt, and lime accents frame Instrument Sans and italic Fraunces typography. The homepage pairs an oversized name with numbered interests. The school-specific page puts its personal letter below the introduction. Phone navigation floats at the bottom. Tabs support arrow keys, Home, and End; work filters update a live project count. Hash links open a project or category. Project screenshots expand in an accessible native dialog and return focus when closed. Content remains readable without JavaScript, and reduced-motion and print styles are included.

## Publishing

This revision is for local review. No deployment, domain configuration, or remote push is included. Preserve that boundary until Kaliph explicitly requests publication. Existing social preview artwork is retained; absolute social URLs can be set once a final domain is known.
