# Handoff — Kaliph Howard's college portfolio

Written 5 September 2026, after a full-day redesign session with Kaliph. Read this before touching anything. The editorial history is in `DESIGN.md`; this file is the working state.

## 1. Where things stand

- **Committed and pushed** to `main` of `adventau/colleges` on 5 September 2026 at Kaliph's request (commit 07738ac). Ask before committing further work, and never enable GitHub Pages or deploy anywhere. The site runs on localhost only (`npm run dev`, port 4173). He has Railway if real hosting ever comes up, but only on his explicit request.
- **The site works.** All pages load without console errors, every local link and image resolves, and every page holds at 375px wide with no horizontal overflow.
- **What is live at http://127.0.0.1:4173:** home, Work (a dated timeline of 20 entries), About, Contact, six case studies, the N.C. A&T school page, and a 404.

## 2. How to build and check

```bash
npm run dev        # static server on 127.0.0.1:4173 (Kaliph often already has one running on that port)
npm run pages      # regenerate every page from scripts/build-pages.mjs, then the school pages
npm run colleges   # school pages only (for/<slug>/index.html from data/colleges.json + index.html)
npm run og         # re-render assets/og.png from scripts/og-template.html with headless Chrome
npm run check      # syntax-check the JS and the build scripts
```

**Pages are generated, not hand-edited.** All copy and structure live in `scripts/build-pages.mjs`. Edit there, run `npm run pages`, and commit the resulting HTML. The HTML files are committed so the site itself needs no build step. The school-page generator is separate (`scripts/build-colleges.mjs`) and reads `index.html` as its template, so always run it after regenerating pages.

Screenshots: the app's browser pane often reports the page as hidden and returns black frames. Use headless Chrome instead:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --window-size=1440,900 --virtual-time-budget=6000 --screenshot=out.png "http://127.0.0.1:4173/"
```

Chrome will not go narrower than about 500px, so phone checks are done in the app browser with the mobile preset and a `scrollWidth` check.

## 3. The design, and what was rejected

Kaliph rejected four directions in one day. Do not drift back to any of them.

| Rejected | His words |
|---|---|
| Navy/white with glass controls (the version before this session) | "looks like some random template off Weebly" |
| Ink-black award-site: uppercase giant name, custom cursor, marquee, grain, page-wide recolouring | "more like a brand's website than me trying to give myself to a college", "too much going on" |
| Bright cream, very minimal | "a bit too minimalistic", later "a bit too bright" |
| Work page as a flat filtered list, then as grouped cards | "don't like that way either" |

What stuck:

- **Ground and type.** Warm stone `#d9d3c8` (interludes `#cdc6b9`, cards `#e7e2d9`), Newsreader serif headlines in normal case with an italic accent line, Manrope body, JetBrains Mono labels. One muted accent per facet (leadership amber, technology teal, business green, community rust, design violet), set by `data-facet` on `<html>` and used only for small rules, italics, badges, and hover states.
- **Character, in moderation.** Portrait in a slightly tilted frame with an offset colour mat, hand-drawn underline under italic lines, one dark warm section per page, masked word reveals on headlines, gentle fade-ins. Nothing else moves.
- **Density.** He dislikes scrolling. Home is the introduction plus the five facets and fits about two screens. Prose sections sit two across, lists two across, covers are 21:9. The Work timeline is the one long page, by his choice, because it copies a reference he likes (charliem.in).
- **Portrait.** `assets/kaliph-howard.jpg`, cropped 4:5 from the studio headshot on his Desktop ("i think we got it.png"). Used in the home hero and on About only.

## 4. Content rules

Everything on the site was either confirmed by Kaliph directly or sourced and attributed. Keep it that way.

- **Never invent** a metric, date, title, quote, or anecdote. Unconfirmed statements do not go up.
- **Numbers keep their caveats.** Studio and project figures are labelled as the team's results, not his. The Work page carries a closing note saying so. Case studies separate "the project" from "my part".
- **No quotes from references.** MATS at Playverse and the GWDC president offered references; the site says "available on request" and nothing more.
- **Kept off the site on purpose:** his GPA. His ACT of 25 is on About, labelled self-reported, by his decision.
- **The private app is called Hearth on the site.** Its real working name is Royal Vault, which the sign-in screenshot shows, so the caption and Access line say "built under the working name Royal Vault". Keep that sentence.
- **The thirteen managed projects** came from Charlie Min's timeline at charliem.in. Kaliph confirmed on 4 September he was project manager on every project listed there except Sleeping Simulator, with the same responsibility pattern throughout: hiring and staffing, partnerships and deals, product decisions with the founders, marketing and community, launch and live operations, testing and quality, day-to-day team leadership. **Not** budgets or payments. The "what my part was" paragraphs were drafted from that pattern and he approved them. Dates and figures on those entries are the projects' own, as shown on Charlie's page.
- **Thumbnails for those entries** were copied from charliem.in at Kaliph's request into `assets/work/pm/`. They are the projects' artwork. If Charlie objects, swap them for typographic plates (the NIBSU and Juneteenth entries show the pattern).

Confirmed dates: AVNT founded early 2024; joined Playverse's team September 2023 (Playverse owns RoTube Life 2 and Super League Soccer, and later became an AVNT client); Hearth started January or February 2026; NIBSU president since 2024 (grades 10 to 12); Juneteenth Lake County June 2024 at Foss Park.

## 5. Open items, in priority order

1. **Show Kaliph what changed on 5 September** before it goes further: the Playverse page retitle, the new activities PDF (including the new "Project management for Roblox teams" entry), and the new `assets/og.png`. All three reuse wording he already approved, but he has not seen them assembled.

Closed on 5 September 2026 (details in `DESIGN.md`):

- **Activities PDF** regenerated from an updated `data/activities.json`. ReportLab is not installed system-wide; the README shows the one-line venv recipe. The PDF must stay one page; padding in `scripts/build-activities.py` was tightened to keep it there.
- **Social preview image** regenerated at 1200×630 in the stone palette from `scripts/og-template.html` via `npm run og`.
- **Commit** done on 5 September at Kaliph's request; `.claude/` (the app's launch config) is now in `.gitignore`.
- **Managed-project detail pages: not doing them.** Kaliph said on 5 September he has no further details for those projects, so a page would only restate the timeline paragraph. Leave the entries as they are. Revisit only if he offers specifics (a decision he made, a hire or partner he brought in, a launch problem he handled, a figure that was his rather than the team's).
- **Student Council start date** confirmed as August 2026 (the current school year) and added to the timeline, the case study, and the activities summary.
- **Playverse case study** retitled "Playverse" and restructured as the studio page, with the two Playverse games in one section.

## 6. File map

```
index.html, work.html, about.html, contact.html, 404.html   generated pages
work/*.html                                                  six case studies (generated)
for/ncat/index.html                                          school page (generated from index.html)
scripts/build-pages.mjs                                      ALL copy and structure; edit here
scripts/build-colleges.mjs                                   school-page generator
scripts/dev-server.mjs                                       zero-dependency static server
scripts/build-activities.py, data/activities.json            activities PDF + printable HTML (needs ReportLab)
scripts/og-template.html                                     source of assets/og.png
data/colleges.json                                           school notes, colours, first-choice flag
css/site.css                                                 one stylesheet, tokens at the top
js/site.js                                                   reveals, tabs, phone menu, lightbox, copy-email
assets/kaliph-howard.jpg                                     portrait (4:5, 1000px wide)
assets/work/                                                 project screenshots and AVNT marks
assets/work/pm/                                              thumbnails for the managed projects
docs/DESIGN.md                                               editorial record, every decision and its source
docs/HANDOFF.md                                              this file
```

## 7. Working with Kaliph

He gives short, fast feedback and means it literally. "Too much scrolling" means cut the page. "Too bright" means darken the ground. When two attempts at a page miss, show him two or three live options side by side rather than describing them; he said "I need to see to choose." He will confirm facts when asked with a specific list, and he corrects overclaims and underclaims alike, so propose wording and let him approve it.
