# Design notes

## The concept: a world seen through glass

The site is a warm editorial page, paper and ink, with a few pieces of real glass laid on top.

- **Paper and ink** carry the content. Off-white paper, near-black ink, one serif (Fraunces) for anything that should feel like a voice, one sans (Instrument Sans) for anything that should feel like an instrument.
- **Glass** is reserved for controls and captions: the navigation bar, the facet tabs on Home, the filters on Work, the portrait captions, the call-to-action links. Nothing that is content is put behind glass. The material has a refracted rim (a conic highlight masked to the edge), a specular highlight that follows the pointer, and backdrop blur with saturation where supported. Without `backdrop-filter` it degrades to a translucent gradient.
- **Facets** are the organising idea. Kaliph's world has five sides: leadership, technology, business, community and design (the supporting one). Each owns a hue. Selecting a facet on Home, hovering a project on Work, or touching a card on About washes the scene in that hue. The colour tells you which part of his world you are in, so colour is never decoration.
- **The scene** behind every page is three soft colour fields on paper with a faint grain. They drift very slowly and lean a little with the pointer. That is the whole ambient system: enough to keep the page alive, not enough to compete with reading.

Why it fits Kaliph: his work is genuinely plural, and the temptation is to flatten it into "developer" or "Roblox". The facets make the plurality the point. The editorial tone matches how a thoughtful student explains their work: plainly, in sentences. Glass appears where the hand touches the page, which is exactly how Apple uses it, and nowhere else.

## Research applied

Reviewed Typewolf's designer-portfolio list, recent Awwwards portfolio winners, and the current writing on Liquid Glass in the browser (kube.io on SVG refraction, CSS-Tricks on Apple's material). Principles taken:

1. Type carries identity before any project loads. A serif with real optical sizing (Fraunces at 144 for display, 12 for numerals) does most of the work.
2. The strongest personal sites lead with an about-style introduction, not a gallery. Work belongs on its own page.
3. Portraits are integrated, art-directed elements, not centred circles.
4. One material, used consistently, reads as a system. Many glass cards read as a UI kit.
5. SVG-displacement refraction works only in Chromium as a backdrop, so the rim highlight is simulated with a masked conic gradient that works everywhere.
6. Motion should reveal structure: the facet colour change explains the site's organisation; the sticky plate on Work explains which row you are on.

What is original to Kaliph: the facet system and its five hues, the typographic plates that give each project an identity without fake screenshots, the index-plus-sticky-plate layout, the bottom-docked glass nav on phones, and the copy, which is written in his register from verified project facts.

## Motion system

- Entrances: elements with `.enter` fade and rise with a 90 ms stagger (`--i`).
- Pointer: `--px/--py` (−1…1) move the scene fields and tilt the portrait by under a degree; `--lx/--ly` place the specular highlight on each glass element. Values are lerped in one `requestAnimationFrame` loop.
- Facet change: accent tokens transition over 400–900 ms.
- Page transitions: cross-document View Transitions (`@view-transition { navigation: auto }`). The active nav pill carries `view-transition-name: nav-pill` so it slides between pages in browsers that support it. Others get an instant load.
- Reduced motion: all animations and transitions collapse to 1 ms, parallax is removed, entrances render in their final state.

## Type and colour

| Token | Value | Use |
| --- | --- | --- |
| paper | #f3efe7 | page |
| ink | #17181c | text |
| ink-2 | #4a4945 | secondary text (7.9:1 on paper) |
| ink-3 | #6f6d67 | labels (4.6:1 on paper) |
| leadership | #c1502f / ink #a03e21 | clay |
| technology | #2e55c7 / ink #2547aa | cobalt |
| business | #3f7a48 / ink #2f5f37 | moss |
| community | #d68a1c / ink #8f5809 | marigold |
| design | #5b5f72 / ink #474a5a | slate |

The `-ink` variants are used for any text; the base hues wash backgrounds only.

## Content still using placeholders

- Portrait (Home, About): `assets/portrait-placeholder.svg`.
- Contact email: `contact.html`, both the `href` and the visible label.
- Lake County Juneteenth: description, Kaliph's role, what he learned.
- ClaudeKat Website: what it is, link, screenshots.
- School design work: confirm the planner cover; add other pieces and images.
- "More to code": additional entries.
- About, "What's next": to be written by Kaliph.
- Contact, "Elsewhere": profile links, once confirmed.

## Statements that need Kaliph's confirmation (marked `.tbd` in the HTML)

- That he helps lead his class (Home, Leadership facet).
- That he designed and built the WTHS Class of 2027 site and runs it, plus the class's social presence and events.
- The title "Founder" for AVNT.
- Project management, brand, social media and partnerships as his role at Playverse.
- The school planner cover, reproduced on apparel.

Nothing numeric (attendance, visits, members, followers, views) appears anywhere on the site, deliberately.
