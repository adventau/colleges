// Assembles the site's pages from the shared shell and the content below, writing plain HTML
// into the repo. Run: npm run pages  (then npm run colleges to refresh the school pages).
// The output is committed, so the site itself needs no build step to serve.
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url))) + "/";
const FONTS = "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..600;1,6..72,400..600&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap";
const EMAIL = "adventacious@gmail.com";

const head = ({ p, title, desc, facet, og = "website", robots = "", theme = "#d9d3c8" }) => `<!doctype html>
<html lang="en" class="no-js" data-facet="${facet}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <meta name="theme-color" content="${theme}">${robots}
  <meta property="og:type" content="${og}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:image" content="${p}assets/og.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="${p}assets/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${FONTS}" rel="stylesheet">
  <link rel="stylesheet" href="${p}css/site.css">
  <script>document.documentElement.classList.replace('no-js','js')</script>
  <script src="${p}js/site.js" defer></script>
</head>`;

const NAV = [["index.html", "Home"], ["work.html", "Work"], ["about.html", "About"], ["contact.html", "Contact"]];
const header = (p, current) => `<body data-page="${current}">
  <a class="skip-link" href="#main">Skip to content</a>

  <!-- Shared header: identical on every page except aria-current -->
  <header class="site-head">
    <a class="brand" href="${p}index.html" aria-label="Kaliph Howard, home"><span class="brand__mark" aria-hidden="true">kh</span><span>Kaliph Howard<small>Chicago · Class of 2027</small></span></a>
    <nav class="nav" aria-label="Primary">
      <ul>
${NAV.map(([h, n]) => `        <li><a href="${p}${h}"${n.toLowerCase() === current ? ' aria-current="page"' : ""}><span data-text="${n}">${n}</span></a></li>`).join("\n")}
      </ul>
    </nav>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu">Menu <b aria-hidden="true"></b></button>
  </header>
  <div class="menu" id="menu">
    <ul>
${NAV.map(([h, n], i) => `      <li><a href="${p}${h}"><small>0${i + 1}</small>${n}</a></li>`).join("\n")}
    </ul>
    <div class="menu__foot"><span>${EMAIL}</span><span>Chicago, Illinois · Class of 2027</span></div>
  </div>
`;

const footer = (p, { cta = true } = {}) => `
  <footer class="site-foot dark">
${cta ? `
    <div class="wrap site-foot__cta">
      <p class="eyebrow" data-reveal="fade">Let’s connect</p>
      <p class="site-foot__title" data-reveal><a href="mailto:${EMAIL}">Get in touch.</a></p>
      <div class="site-foot__row" data-reveal style="--i:2"><a class="btn" href="${p}contact.html">Contact <i>↗</i></a><a class="btn btn--ghost" href="${p}assets/kaliph-howard-activities.pdf">Activities summary · PDF <i>↗</i></a></div>
    </div>` : ""}
    <div class="wrap site-foot__bar">
      <span>Kaliph Howard · Chicago, Illinois · Class of 2027</span>
      <ul>
${NAV.map(([h, n]) => `        <li><a href="${p}${h}">${n}</a></li>`).join("\n")}
        <li><a href="https://github.com/adventau/colleges" rel="noopener">Source</a></li>
      </ul>
      <span>© <span data-year>2026</span> Kaliph Howard</span>
    </div>
  </footer>
</body>
</html>
`;

const FACETS = ["leadership", "technology", "business", "community", "design"];
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const marquee = (cls = "") => `  <div class="marquee ${cls}" aria-hidden="true"><div class="marquee__track">${[...FACETS, ...FACETS].map((f) => `<span>${cap(f)}</span>`).join("")}</div></div>`;

/* ---------------- Home ---------------- */
const facetCopy = {
  leadership: ["Learning to represent people.", "As Student Council President, I plan school events, lead committees for different events, and help staff when needed. Leading the National Independent Black Student Union gives me another way to bring students together."],
  technology: ["An idea I can actually build.", "I like being able to turn an idea into a working website or tool. My projects include a site for the Class of 2027, software for AVNT, and Hearth, a private app. There is always another detail to work out, and that keeps me interested."],
  business: ["Curious about how things grow.", "I founded AVNT, a project management, marketing, and hiring agency. I also build tools for its operations. My work includes project management with Playverse, an AVNT client. It gives me a practical connection to the business and management subjects I want to study."],
  community: ["Being part of something together.", "Black community matters to me. Through the National Independent Black Student Union and my work at Juneteenth Lake County, I take part in spaces where people can meet, celebrate, and learn from each other."],
  design: ["Thinking about the person using it.", "I care about how a page reads, where a button belongs, and whether something feels like it was made for the people using it. Design connects my websites, AVNT’s identity, and my school projects."],
};
const home = (p = "./") => `
  <main id="main">
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero__wash" aria-hidden="true"></div>
    <div class="wrap hero__body">
      <div class="hero__meta mono" data-reveal="fade"><span>Chicago, Illinois</span><span>Class of 2027</span><span>Warren Township High School</span><!-- COLLEGE_INVITATION --></div>
      <div class="hero__grid">
        <div class="hero__main">
          <h1 class="display hero__name" id="hero-title" data-split style="--i:1">Kaliph <em>Howard.</em></h1>
          <p class="hero__kicker" data-reveal style="--i:2">Student leader. Builder. Always curious.</p>
          <p class="lede" data-reveal style="--i:3">I bring people together and build things they can use. My interests connect student leadership, Black community, business, and technology.</p>
          <div class="hero__actions" data-reveal style="--i:4"><a class="btn" href="${p}work.html">Step into my work <i>↗</i></a><a class="arrow-link" href="${p}about.html">A little about me <i>→</i></a></div>
          <dl class="card-facts" aria-label="At a glance" data-reveal style="--i:5">
            <div><dt>School</dt><dd>Warren Township High School</dd></div>
            <div><dt>Role</dt><dd>Student Council President</dd></div>
            <div><dt>Also</dt><dd>President, National Independent Black Student Union</dd></div>
            <div><dt>Class</dt><dd>2027 · Chicago, Illinois</dd></div>
          </dl>
        </div>
        <aside class="hero__aside" data-reveal style="--i:3">
          <figure class="hero__photo"><img src="${p}assets/kaliph-howard.jpg" alt="Kaliph Howard." width="1000" height="1249" fetchpriority="high"></figure>
        </aside>
      </div>
    </div>
  </section>

  <section class="section wrap" aria-labelledby="facets-title">
    <div class="facets__head">
      <p class="eyebrow" id="facets-label" data-reveal="fade">Explore my world</p><h2 class="display h2" id="facets-title" data-split>Five ways in.</h2>
    </div>
    <div class="facets__grid">
      <div class="facets__tabs" role="tablist" aria-labelledby="facets-label" aria-orientation="vertical" data-stagger>
${FACETS.map((f, i) => `        <button class="facet-tab" role="tab" id="tab-${f}" aria-controls="panel-${f}" aria-selected="${i === 0}"${i === 0 ? "" : ' tabindex="-1"'} data-facet="${f}"><span class="n" aria-hidden="true">0${i + 1}</span><span>${cap(f)}</span><span class="arrow" aria-hidden="true">→</span></button>`).join("\n")}
      </div>
      <div class="facets__stage" data-reveal>
${FACETS.map((f, i) => `        <div class="facet-panel" role="tabpanel" id="panel-${f}" aria-labelledby="tab-${f}"${i === 0 ? "" : " hidden"}>
          <span class="facet-panel__n" aria-hidden="true">0${i + 1}</span>
          <p class="eyebrow">${cap(f)}</p>
          <h3 class="h3">${facetCopy[f][0]}</h3>
          <p>${facetCopy[f][1]}</p>
          <a class="arrow-link" href="${p}work.html">See the ${f} work <i>→</i></a>
        </div>`).join("\n")}
      </div>
    </div>
  </section>
  <!-- COLLEGE_LETTER -->

  </main>
`;

const thread = (p = "./") => `
  <section class="dark section" aria-labelledby="thread-title">
    <div class="wrap thread">
      <div><p class="eyebrow" data-reveal="fade">The thread through it all</p><h2 class="display thread__title" id="thread-title" data-split>People.<br>Ideas.<br><em>Follow-through.</em></h2></div>
      <div class="thread__body" data-reveal style="--i:2"><p class="thread__lede">I’m interested in what happens when an idea becomes something other people can be part of.</p><p>Sometimes that means helping bring students together. Sometimes it means building a website, shaping a brand, or working with a team. I like the mix of people and practical work.</p></div>
    </div>
  </section>
`;

/* ---------------- Work index ---------------- */
const projects = [
  { id: "student-council", slug: "wths", title: "Student Council &amp; Class of 2027", role: "Event leadership · Separate website project", facet: "leadership", facets: "leadership technology community design", blurb: "As Student Council President, I plan events and lead committees, including royalty and social media. I also help staff when needed. Separately, I designed, built, and maintain the Class of 2027 website.", peek: `<img src="./assets/work/wths-home.jpg" alt="" loading="lazy">` },
  { id: "bsu", slug: "nibsu", title: "National Independent Black Student Union", role: "President · Student community", facet: "community", facets: "community leadership", blurb: "As president, I help plan and run kickoffs and social events, including bowling and restaurant gatherings. A state representative and a senator have also attended our events.", peek: "NIBSU", peekClass: "row__peek--word" },
  { id: "juneteenth", slug: "juneteenth", title: "Juneteenth Lake County", role: "Volunteer &amp; vendor manager · 2024", facet: "community", facets: "community leadership", blurb: "I directed volunteers where they were needed and helped keep event operations coordinated. As vendor manager, I helped vendors settle in, assisted them, and checked that they had what they needed.", peek: "June<br>19", peekClass: "row__peek--word" },
  { id: "avnt", slug: "avnt", title: "AVNT", role: "Founder · Management, marketing &amp; hiring", facet: "business", facets: "business technology design", blurb: "I work with my leadership team on client management, ideas for attracting more players, and community activity. I also developed AVNT’s identity, website, operations dashboard, and bot tools.", peek: `<img src="./assets/work/avnt-wordmark.svg" alt="" loading="lazy">`, peekClass: "row__peek--logo" },
  { id: "playverse", slug: "playverse", title: "Playverse", role: "Project manager · AVNT client", facet: "business", facets: "business leadership community", blurb: "Playverse develops and publishes games on Roblox. My work with its team includes project coordination, brand and social channels, and partnerships, about twelve hours a week.", peek: `<img src="./assets/work/playverse-site.jpg" alt="" loading="lazy">` },
  { id: "claudekat", slug: "hearth", title: "Hearth", role: "App design and development", facet: "technology", facets: "technology design", blurb: "My work spans the interface, server, real-time messaging, file handling, and the iOS wrapper.", peek: `<img src="./assets/work/royal-vault-login.jpg" alt="" loading="lazy">` },
];
const entries = [
  { slug: "wths", kind: "Leadership", year: "Now", when: "Aug 2026 – now", title: "Student Council &amp; Class of 2027", sub: "Student Council President · built the class website", text: "I plan school events, lead committees including royalty and social media, and help staff when needed. Separately, I designed, built, and maintain the Class of 2027 website: events and RSVPs, announcements, a photo gallery, senior spotlights, and an admin dashboard for contributors.", chips: ["President", "1,101 visits · first month", "72,835 Instagram views"], facet: "leadership", img: "./assets/work/wths-home.jpg" },
  { slug: "avnt", kind: "Business", year: "Now", when: "Early 2024 – now", title: "AVNT", sub: "Founder · project management, marketing &amp; hiring agency", text: "A service business for Roblox project teams: organising delivery, supporting marketing, and finding people for the roles a project needs. I work with my leadership team on client projects, game audiences, and community activity, and I built the agency’s identity, website, operations dashboard, and bot tools.", chips: ["Founder", "Identity · site · dashboard · bot", "Playverse is a client"], facet: "business", img: "./assets/work/avnt-wordmark.svg", logo: true },
  { slug: "playverse", kind: "Business", year: "Now", when: "Sep 2023 – now", title: "Playverse", sub: "Project manager · AVNT client", text: "Playverse develops and publishes games on Roblox, including RoTube Life 2 and Super League Soccer, now FIFA Super Soccer. I joined its team in September 2023, and the studio later became an AVNT client. Through AVNT I work with its team on project coordination, brand and social channels, and partnerships, about twelve hours a week. My social-media work included growing the studio’s X account to 130,000 followers.", chips: ["~12 hrs / week", "130K X followers · milestone", "AVNT client"], facet: "business", img: "./assets/work/playverse-site.jpg" },
  { slug: "hearth", kind: "Technology", year: "Now", when: "Early 2026 – now", title: "Hearth", sub: "App design and development", text: "A private web app for messaging, files, notes, and personal tools for a small circle, with an iOS wrapper. Built under the working name Royal Vault. I work on the interface, the server, real-time messaging over Socket.IO, media handling including voice-message conversion, and the Capacitor shell that brings it to a phone.", chips: ["Web + iOS", "Node.js · Socket.IO · PostgreSQL"], facet: "technology", img: "./assets/work/royal-vault-login.jpg" },
  { slug: "nibsu", kind: "Community", year: "Now", when: "2024 – now", title: "National Independent Black Student Union", sub: "President", text: "An independent organisation bringing together Black students from four Lake County school districts. As president I help plan and run kickoffs, bowling outings, restaurant gatherings, and meetings. A state representative and a senator have attended our events.", chips: ["4 districts", "60+ events"], facet: "community", word: "NIBSU" },
  { pm: true, kind: "Tool", year: "2026", when: "Jul 2026", title: "Wilbo.ai", did: "I ran the team day to day, worked with the founder on what to build and in what order, and staffed the roles the product needed. I set up the creator-led marketing that drives sign-ups and managed the launch and the updates after it.", img: "./assets/work/pm/wilbo.jpg", sub: "Project manager", tag: "Meet Wilbo, your AI job hunter.", text: "Wilbo scouts for jobs around the clock, drafts applications, and applies automatically. Growth runs on short-form creator content.", chips: ["UGC-led growth"] },
  { pm: true, kind: "Tool", year: "2026", when: "Jun 2026", title: "Ropilot.ai · UGC marketing push", did: "I built and ran the creator operation: recruiting and briefing creators, deciding which build videos to make, managing the posting schedule, and reading the results to decide what to make next.", img: "./assets/work/pm/ropilot-ugc.jpg", sub: "Project manager", tag: "Short-form UGC content engine on TikTok", text: "A TikTok content engine of “made with prompts” build videos for Ropilot, with clips ranging from 10K to 851K+ views. Creator content drives distribution.", chips: ["Clips 10K – 851K+ views", "@ropilot__ai on TikTok"] },
  { pm: true, kind: "Tool", year: "2026", when: "May 2026", title: "Pinevex Renderer", did: "I decided the scope of the open-source release with the team, ran testing on the renderer and the web demo, and managed the launch, from the announcement to the developer community around it.", img: "./assets/work/pm/pinevex-icon.jpg", sub: "Project manager", tag: "Open-source UI renderer for Roblox-style interface trees", text: "The open-sourced renderer half of Pinevex: a CPU-only renderer that turns a Roblox-style UI tree into near pixel-perfect previews, with a live web demo that accepts Pinevex JSON or a binary ScreenGui file.", chips: ["Apache 2.0", "Live web demo"] },
  { pm: true, kind: "Game", year: "2026", when: "Apr 2026", title: "New Roblox game", did: "I set the production plan with the founder, staffed the build team, and run it day to day: milestones, playtests, and clearing blockers as development continues.", img: "./assets/work/pm/new-game-wip.svg", sub: "Project manager", tag: "In development", text: "A new title in a high-grossing Roblox genre spotted through the studio’s own platform intelligence, with about $20K allocated to enter it.", chips: ["$20K allocated", "In development"] },
  { pm: true, kind: "Infra", year: "2026", when: "Apr 2026", title: "Rosuite", did: "I gathered what each live title needed from the console, decided the feature priorities with the team, ran testing against real live-ops workflows, and managed the rollout across the studio’s titles.", img: "./assets/work/pm/rosuite.jpg", sub: "Project manager", tag: "Proprietary Roblox live-ops platform", text: "One operator console for live-ops across every title the studio ships: progression analytics, an AI-assisted optimisation loop for retention and monetisation, a config pipeline that pushes changes live without a rebuild, and a review workflow for user-generated content.", chips: ["Multi-title live-ops", "AI metric optimisation", "Cloudflare Workers + D1"] },
  { pm: true, kind: "Tool", year: "2026", when: "Apr 2026", title: "Ropilot Analytics", did: "I shaped what the analytics surface needed to show for operators, ran the team through the build, tested each stage of the pipeline, and managed the launch to developers.", img: "./assets/work/pm/ropilot-analytics.jpg", sub: "Project manager", tag: "Market-intelligence engine for the Roblox ecosystem", text: "An hourly ingestion pipeline sweeping 38K+ universes into a time-series warehouse: rank, concurrent players, visits, favourites, and more per snapshot, surfaced at analytics.ropilot.ai.", chips: ["38K+ universes tracked", "Hourly ingest + 15-min deltas"] },
  { pm: true, kind: "Model", year: "2026", when: "Mar 2026", title: "Pinevex", did: "I coordinated the model work and the UI-engine work as one product, staffed the testing with studio developers, and managed the release and the follow-up based on their feedback.", img: "./assets/work/pm/pinevex-lockup.jpg", sub: "Project manager", tag: "UI reconstructor model + UI engine", text: "A reconstructor model trained from scratch that takes a screenshot and returns structured Roblox UI elements, paired with a custom UI engine that turns the output into something shippable.", chips: ["Screenshot → structured UI", "Trained on H100s"] },
  { pm: true, kind: "Tool", year: "2026", when: "Feb 2026", title: "Ropilot.ai", did: "I ran the team through the launch, made product calls with the founder on what shipped first, led testing with developers, and managed marketing and community during the first weeks of growth.", img: "./assets/work/pm/ropilot.jpg", sub: "Project manager", tag: "AI-powered Roblox development", text: "The first AI developer tool for Roblox: code generation with full codebase context and automated playtests. Reached 10,000 professional developer workflows in the first two weeks; now 50,000+ users.", chips: ["50K+ users", "10K workflows in 2 weeks"] },
  { pm: true, kind: "Game", year: "2026", when: "Jan 2026", title: "Chase Train for Brainrots!", did: "I led the two-person team through the four-hour build, kept scope to what could ship that day, tested it, and ran the launch and the live updates that followed.", img: "./assets/work/pm/chase-train-for-brainrots.jpg", sub: "Project manager", tag: "Concept to launch in four hours", text: "A trend-driven game taken from concept to launch in four hours by a team of two. It hit a $100K USD valuation shortly after release.", chips: ["4 hours to ship", "$100K valuation"] },
  { pm: true, kind: "Game", year: "2025", when: "Nov 2025", title: "My Waterslide", did: "I managed the partnership with Devextra, staffed and ran the team through the seven-day build, led testing, and handled the launch and live operations afterwards.", img: "./assets/work/pm/my-waterslide.jpg", sub: "Project manager", tag: "Formerly Build a Water Slide · with Devextra", text: "Shipped in seven days in partnership with Devextra. Peaked at 20,000 concurrent players and hit a $60K USD valuation shortly after release.", chips: ["20K peak players", "$60K valuation", "Devextra"] },
  { pm: true, kind: "Game", year: "2025", when: "Aug 2025", title: "Brainrot Wars!", did: "I ran the team, decided the scope with the founder, led playtesting and bug triage, and managed the launch and the updates after release.", img: "./assets/work/pm/brainrot-wars.jpg", sub: "Project manager", tag: "Roblox game", text: "Peaked at 3,300 concurrent players.", chips: ["3.3K peak players"] },
  { pm: true, kind: "Game", year: "2025", when: "Mar 2025", title: "RoTube Life 2!", studio: "Playverse", did: "I ran production on the sequel, staffed the roles the project needed, led testing, and managed the launch and the live-operations cadence after it.", img: "./assets/work/pm/rotube-life-2.jpg", sub: "Project manager", tag: "The sequel to RoTube Life", text: "46M+ plays and 152K favourites.", chips: ["46M+ plays", "152K favourites"] },
  { slug: "juneteenth", kind: "Community", year: "2024", when: "June 2024", title: "Juneteenth Lake County", sub: "Volunteer &amp; vendor manager · Foss Park, North Chicago", text: "A community celebration with music, food, and local vendors, organised by the Greater Waukegan Development Coalition. I organised where volunteers needed to go and directed them there, and I helped vendors get settled with what they needed to operate.", chips: ["Volunteers + vendors", "Reference on request"], facet: "community", word: "June 19" },
  { pm: true, kind: "Game", year: "2023", when: "Sep 2023 – Jan 2024", title: "Super League Soccer", did: "I ran the project with Playverse’s team, made product and priority calls with the studio, staffed roles as needed, led testing, and managed the game’s brand, social channels, and partnerships through launch and live operations.", img: "./assets/work/pm/super-league-soccer.jpg", sub: "Project manager · Playverse", tag: "Fast-paced football on Roblox, now FIFA Super Soccer", text: "Playverse’s realistic football game with simple controls. 116M+ plays; the studio reports a 40,000 peak in simultaneous players.", chips: ["116M+ plays", "40K peak players"], href: "./work/playverse.html" },
  { pm: true, kind: "Game", year: "2022", when: "Feb 2022", title: "RoTube Life", did: "I ran the three-person team day to day, worked with the founders on product direction, led testing, and managed the launch and the live updates as the game climbed the Top 50.", img: "./assets/work/pm/rotube-life.jpg", sub: "Project manager", tag: "Roblox Top 50 at release", text: "Climbed to the Roblox Top 50 at release with a peak of 50,000 concurrent players. Lifetime: 236M+ sessions and over $1M USD grossed.", chips: ["236M+ plays", "50K peak players", ">$1M grossed"] },
];
const emedia = (x) => x.word
  ? `<span class="entry__thumb entry__thumb--word"><span>${x.word}</span><i class="entry__badge">${x.kind}</i></span>`
  : `<span class="entry__thumb${x.logo ? " entry__thumb--logo" : ""}"><img src="${x.img}" alt="" loading="lazy"><i class="entry__badge">${x.kind}</i></span>`;
const entry = (x) => {
  const href = x.slug ? `./work/${x.slug}.html` : x.href;
  const facet = x.facet || "business";
  return `        <article class="entry${x.pm ? " entry--pm" : ""}" style="--c:var(--${facet})">
          ${href ? `<a class="entry__media" href="${href}" aria-hidden="true" tabindex="-1">${emedia(x)}</a>` : `<span class="entry__media">${emedia(x)}</span>`}
          <div class="entry__body">
            <p class="entry__date">${x.when}</p>
            <h3 class="entry__title">${href ? `<a href="${href}">${x.title}</a>` : x.title}</h3>
            ${x.tag ? `<p class="entry__tag">${x.tag}</p>` : ""}
            <p class="entry__sub">${x.sub}</p>
            <p class="entry__text">${x.text}</p>${x.did ? `
            <p class="entry__text entry__did">${x.did}</p>` : ""}
            <ul class="entry__chips">${x.chips.map((c) => `<li>${c}</li>`).join("")}</ul>
          </div>
        </article>`;
};
const timeline = () => {
  const years = [];
  entries.forEach((x) => { const last = years[years.length - 1]; if (!last || last.year !== x.year) years.push({ year: x.year, items: [] }); years[years.length - 1].items.push(x); });
  return years.map((y) => `      <section class="yr" aria-labelledby="yr-${y.year.toLowerCase()}">
        <h2 class="yr__label" id="yr-${y.year.toLowerCase()}">${y.year}</h2>
        <div class="yr__list">
${y.items.map(entry).join("\n")}
        </div>
      </section>`).join("\n");
};
const work = () => `
  <main id="main" class="page page--tight">
    <div class="wrap">
      <header class="page-head page-head--compact">
        <p class="eyebrow" data-reveal="fade">Selected work</p>
        <h1 class="display h2" data-split>What I’ve been part of.</h1>
        <p class="lede lede--s" data-reveal style="--i:2">My own roles and projects, and the projects I’ve managed for other teams, newest first. Open any of mine for the full study.</p>
        <dl class="stats" data-stagger>
          <div><dt>Presidencies</dt><dd>2</dd></div>
          <div><dt>Projects managed for teams</dt><dd>13</dd></div>
          <div><dt>NIBSU events</dt><dd>60+</dd></div>
          <div><dt>X followers grown for Playverse</dt><dd>130K</dd></div>
        </dl>
      </header>
      <div class="timeline">
${timeline()}
      </div>
      <p class="page-head__row" data-reveal><a class="btn btn--ghost" href="./assets/kaliph-howard-activities.pdf">Activities summary · PDF <i>↗</i></a><span class="tl__note">Figures on my own entries come from screenshots and reports I shared. Figures on managed projects are the team’s results, as the projects report them. Each entry says what my part was.</span></p>
    </div>
  </main>
`;

/* ---------------- Case studies ---------------- */
const zoom = (src, alt, caption, { lazy = true, dims = "" } = {}) => `<figure><a class="zoom-link" data-lightbox href="${src}" aria-label="Enlarge screenshot: ${caption.replace(/"/g, "&quot;")}"><img src="${src}" alt="${alt}"${lazy ? ' loading="lazy"' : ""}${dims}><span class="zoom-tag" aria-hidden="true">View larger ↗</span></a><figcaption>${caption}</figcaption></figure>`;
const block = (n, title, content, extra = "") => `      <section class="block${extra}" aria-labelledby="b${n}">
        <h2 class="block__title" id="b${n}" data-n="${n}" data-reveal>${title}</h2>
        <div class="block__content" data-reveal style="--i:1">${content}</div>
      </section>`;
const prose = (...ps) => `<div class="prose">${ps.map((t) => `<p>${t}</p>`).join("")}</div>`;
const detail = (items) => `<dl class="detail">${items.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join("")}</dl>`;
const steps = (label, items) => `<ol class="steps" aria-label="${label}">${items.map(([t, d], i) => `<li><span>0${i + 1}</span><strong>${t}</strong><p>${d}</p></li>`).join("")}</ol>`;
const metrics = (items) => `<div class="metrics">${items.map(([v, l, count, suffix]) => `<div><strong${count !== undefined ? ` data-count="${count}"${suffix ? ` data-suffix="${suffix}"` : ""}` : ""}>${v}</strong><span>${l}</span></div>`).join("")}</div>`;
const note = (t) => `<p class="note">${t}</p>`;

const cases = {
  wths: {
    facet: "leadership", title: "Student Council and the Class of 2027 site — Kaliph Howard", crumb: "Student Council &amp; Class of 2027",
    desc: "Student representation, senior-year events, and a website built for my classmates.",
    h1: "Two ways I contribute at school.",
    lede: "As Student Council President at Warren Township High School, I plan events, lead event committees, and help staff when needed. Separately, I built and maintain wths2027.com for the Class of 2027.",
    meta: [["Student Council", "President · Events, committees, and staff support"], ["Since", "August 2026"], ["For", "Warren Township High School · Class of 2027"], ["Website tools", "Next.js, TypeScript, SQLite"], ["Visit", '<a href="https://wths2027.com" rel="noopener">wths2027.com</a>']],
    cover: zoom("../assets/work/wths-home.jpg", "The WTHS Class of 2027 website with graduation countdown and links to class information.", "Class of 2027 website · September 2026", { lazy: false, dims: ' width="1440" height="900"' }),
    blocks: [
      ["Student Council President", `<p class="intro">My council work has three main parts.</p>` + detail([["Event planning", "I help plan school events."], ["Committee leadership", "I lead committees for different events, including the royalty and social media committees."], ["Staff support", "I help staff when they need support."]])],
      ["A separate website project", prose("Senior year comes with events, deadlines, photos, and questions. I wanted a place where classmates could find that information without needing to ask someone each time. I built and maintain the class website as a separate project from my Student Council responsibilities.")],
      ["Building the class site", prose("I designed and built the class site. Its pages cover events and RSVPs, announcements, deadlines, a photo gallery, senior spotlights, and an opt-in directory.", "I also built an admin dashboard so authorized contributors can update content. Forms let classmates submit material without needing to work on the code.")],
      ["The class Instagram", prose("I also manage the class Instagram, where the insights snapshot I shared on September 2, 2026 showed 72,835 views. That is a platform count, not a count of individual students. The website’s separate analytics snapshot appears below.")],
      ["From the project", `<div class="shots">${zoom("../assets/work/wths-events.jpg", "Events, with category filters and a calendar view.", "Events, with category filters and a calendar view.")}${zoom("../assets/work/wths-announcements.jpg", "Class announcements and pinned posts.", "Class announcements and pinned posts.")}${zoom("../assets/work/wths-mobile.jpg", "The class website on a phone.", "The class website on a phone.")}</div>`],
      ["Inside the website", detail([["Find what’s happening", "Event pages combine dates, locations, RSVPs, and calendar links. Announcements give the class a place to find updates alongside its upcoming events."], ["Contribute to the class", "Photo submissions, announcement requests, and spotlight nominations give classmates ways to take part. These go through moderation before publication."], ["Keep information current", "The admin dashboard lets authorized contributors manage events, announcements, the gallery, resources, and other class information without editing the code."], ["Be clear about uncertainty", "The site supports source and confirmation labels for event information. Dates that have not been confirmed can remain unset instead of looking official."]])],
      ["From submission to gallery", `<p class="intro">Photo sharing is one example of how the public site and editing tools work together.</p>` + steps("Photo submission workflow", [["Submit", "A classmate uploads a photo, adds a caption and photographer credit, and confirms permission to share it."], ["Review", "The submission appears in the admin gallery queue, where an authorized contributor can approve or reject it."], ["Publish", "Approved submissions appear in the public gallery, where visitors can browse and enlarge photos."]]) + note("This describes the website’s existing workflow. It is separate from my Student Council duties.")],
      ["A snapshot of use", metrics([["1,101", "Website visits", 1101], ["1,860", "Page views", 1860]]) + note("From the website analytics snapshot I shared on September 2, 2026. Visits and page views are different measures; neither is a count of unique classmates.")],
      ["The decisions behind it", prose("The project brings together a public experience and an editing experience. Classmates need to find information quickly; contributors need a manageable way to keep it up to date. The dashboard, moderation tools, and public pages are different parts of that same problem.", "Keeping the site useful and current is an ongoing responsibility throughout senior year. I’m interested in continuing this kind of work in college: looking at what a student group needs, then building something practical around it.")],
    ],
    next: ["nibsu", "National Independent Black Student Union"],
  },
  nibsu: {
    facet: "community", title: "National Independent Black Student Union — Kaliph Howard", crumb: "National Independent Black Student Union",
    desc: "An independent student organization connecting Black students across four Lake County districts.",
    h1: "Black community beyond one school.",
    lede: "I lead the National Independent Black Student Union, an independent organization that brings together students from four Lake County school districts. We organize kickoffs and social events, including bowling and restaurant gatherings, where students can spend time together.",
    meta: [["Role", "President"], ["Community", "Students from four Lake County districts"], ["Activities", "Kickoffs · Bowling · Restaurant gatherings"], ["Areas", "Student leadership · Black community"]],
    cover: `<div class="plate" aria-hidden="true"><span class="plate__cap">Lake County, Illinois</span><span class="plate__word">NIBSU</span><span class="plate__sub">President · Student community</span></div>`,
    blocks: [
      ["Why it matters", prose("Black community is an important part of what I want in my life and in college. The union gives students a way to connect beyond the people they already know at their own school.")],
      ["My part", prose("As president, I help plan and run our kickoffs, social events, and meetings. I like that this role involves both talking with people and working through the practical details of bringing a group together.")],
      ["The community we reach", metrics([["4", "Lake County school districts", 4], ["60+", "Events across the union’s activities", 60, "+"]]) + note("These describe the organization and its collective activity. My role is president, helping plan and run its events and meetings.")],
      ["Ways we come together", detail([["Kickoff events", "We have held multiple kickoffs to bring students together."], ["Bowling and restaurants", "Our social events include bowling outings and restaurant gatherings, with time for students to enjoy each other’s company."], ["Community guests", "A state representative and a senator have attended our events alongside students."]])],
      ["What I want to carry forward", prose("I want to keep participating in Black student organizations in college. I’m interested in meeting people from different backgrounds, hearing what matters to them, and helping create opportunities for students to connect.")],
    ],
    next: ["juneteenth", "Juneteenth Lake County"],
  },
  juneteenth: {
    facet: "community", title: "Juneteenth Lake County 2024 — Kaliph Howard", crumb: "Juneteenth Lake County",
    desc: "Volunteer and vendor management at Juneteenth Lake County’s 2024 festival.",
    h1: "Helping a community celebration happen.",
    lede: "I served as volunteer and vendor manager at Juneteenth Lake County’s 2024 festival at Foss Park in North Chicago. I coordinated where volunteers went, helped vendors get settled, and supported the event’s day-to-day operations.",
    meta: [["Role", "Volunteer and vendor manager"], ["When", "2024"], ["Where", "Foss Park · North Chicago"], ["Event", '<a href="https://juneteenthlakecounty.com" rel="noopener">Juneteenth Lake County</a>']],
    cover: `<div class="plate" aria-hidden="true"><span class="plate__cap">Foss Park · North Chicago</span><span class="plate__word">June<br>19</span><span class="plate__sub">Volunteer &amp; vendor manager · 2024</span></div>`,
    blocks: [
      ["The setting", prose("Juneteenth Lake County brings people together for a community celebration with music, food, and local vendors. The festival is organized by the Greater Waukegan Development Coalition.")],
      ["Volunteer management", prose("I organized where volunteers needed to go and directed them to the areas they were supporting. My focus was keeping their work coordinated throughout the event so the wider operation could run smoothly.")],
      ["Vendor management", prose("I helped vendors get settled, assisted them as they prepared to operate, and checked that they had what they needed to do their jobs.")],
      ["Why it matters to me", prose("This work connects my interest in leadership with my commitment to Black community. I value being able to contribute to an event where people come together to celebrate. I want to continue service alongside student leadership in college, including work where I can support an existing team.")],
      ["Reference", prose('A reference for my work with Juneteenth Lake County is available on request. <a href="../contact.html">Get in touch</a>.')],
    ],
    next: ["avnt", "AVNT"],
  },
  avnt: {
    facet: "business", title: "AVNT — Kaliph Howard", crumb: "AVNT",
    desc: "AVNT: the project management, marketing, and hiring agency I founded, and the tools I build for its operations.",
    h1: "Building an agency around people and projects.",
    lede: "I founded AVNT, a project management, marketing, and hiring agency. It works with Roblox project teams, bringing together coordination, staffing, community operations, and supporting technology.",
    meta: [["Role", "Founder · Agency and operations tools"], ["Founded", "Early 2024"], ["Services", "Project management · Marketing · Hiring"], ["Tools", "Next.js, TypeScript, PostgreSQL, Python"], ["Visit", '<a href="https://avntbrand.com/" rel="noopener">avntbrand.com</a>']],
    cover: `<div class="plate plate--logo"><img src="../assets/work/avnt-wordmark.svg" alt="The AVNT wordmark." width="1200" height="300"></div>`,
    coverCaption: "AVNT · Brand identity",
    blocks: [
      ["What AVNT does", prose("AVNT is a service business for project owners and teams. Its work includes organizing delivery, supporting marketing, and finding people for the roles a project needs.", 'The agency’s public site describes work with Roblox teams across project management, testing, community operations, staffing, websites, and launch support. The scope depends on what each team needs. <a href="https://avntbrand.com/#services" rel="noopener">Explore AVNT’s services</a>.')],
      ["The core services", detail([["Project management", "Turning a project’s goals into priorities, responsibilities, and schedules, then coordinating the work through delivery."], ["Marketing", "Marketing is one of AVNT’s core areas, alongside communications and community work around a project’s launch and ongoing activity."], ["Hiring and staffing", "Matching people to project needs across management, testing, community work, and development, with direction and support around the placement."], ["Supporting operations", "Quality assurance, community support, and websites or internal tools help teams prepare for release and keep operating afterward."]])],
      ["My work as founder", prose("A typical week at AVNT involves working with my leadership team to manage our clients and their projects. We discuss what we can do to bring more players into the games we support and get more people participating in their communities.", "That work connects the management and marketing sides of AVNT: keeping client projects moving while thinking about the people those projects are trying to reach.", "Alongside that agency work, I develop the website and internal tools that support its operations.")],
      ["Examples from the agency", detail([["Playverse", 'Playverse is an AVNT client. <a href="playverse.html">My Playverse case study</a> describes my project-management, brand, and social work with its team.'], ["Ropilot", "AVNT’s portfolio lists product management for this Roblox coding and playtesting platform, plus community management for its associated Discord. AVNT does not own Ropilot."], ["Profile Studio", "The public portfolio identifies Profile Studio as a live product owned and operated by AVNT."]]) + note('Ropilot and Profile Studio are agency-level examples from <a href="https://avntbrand.com/portfolio" rel="noopener">AVNT’s public portfolio</a>, reviewed September 4, 2026.')],
      ["Identity and tools", prose("I created AVNT’s monogram and wordmark. I also work on its website and internal tools, connecting the brand’s public presentation with the software behind its operation.")],
      ["Inside the operations tools", detail([["Task and question board", "Tasks move through Open, In progress, and Done. Questions can be marked answered, so unfinished work and unresolved questions have a visible place."], ["Contacts and skills", "A directory organizes developer contacts with skill tags and supporting information. It gives the team a way to find people by what they do."], ["Activity records", "Completing a task creates an activity-log entry. The log preserves a record of completed work and can be reviewed as a weekly digest."], ["Connected community tools", "The dashboard and supporting Discord bot exchange selected tasks and information through an API. They are connected parts of the operation."]])],
      ["One small workflow", steps("Task workflow in the AVNT app", [["Open", "A task has a place on the board."], ["In progress", "Its status shows that work is underway."], ["Done + recorded", "Completion creates an activity-log entry."]]) + note("A simplified view of the existing task workflow, not a screenshot.")],
      ["The business question", prose("AVNT brings several of my interests into one business: organizing projects, marketing, hiring, and building useful systems. It is one reason I want to study business and management. I want to better understand the decisions behind a service business, from the work it takes on to the people and resources it needs.")],
    ],
    next: ["playverse", "Playverse"],
  },
  playverse: {
    facet: "business", title: "Playverse — Kaliph Howard", crumb: "Playverse",
    desc: "Project management, brand, and social work with Playverse, a Roblox studio and AVNT client.",
    h1: "Working with a studio, over time.",
    lede: "Playverse develops and publishes games on Roblox. I joined its team in September 2023, and the studio later became a client of AVNT. Through that relationship I work with its team on project management, brand, and social channels, about twelve hours a week.",
    meta: [["Role", "Project manager · Client work through AVNT"], ["Since", "September 2023"], ["Time", "About 12 hours per week"], ["Focus", "Coordination · Brand · Social channels"], ["Studio", '<a href="https://playverse.games" rel="noopener">Playverse</a>']],
    cover: zoom("../assets/work/playverse-site.jpg", "The Playverse studio website.", "playverse.games · Screenshot from September 2026", { lazy: false, dims: ' width="1440" height="900"' }),
    blocks: [
      ["How this connects to AVNT", prose('Playverse is one of AVNT’s clients. This page looks more closely at my work with its team as part of that client relationship. <a href="avnt.html">Read about AVNT and my role in the agency</a>.')],
      ["The studio", prose('Playverse develops and publishes games on Roblox. Its titles include Super League Soccer, now FIFA Super Soccer, and RoTube Life 2. This page is about my ongoing work with the studio; the games themselves have their own entries on the <a href="../work.html">Work timeline</a>. <a href="https://playverse.games" rel="noopener">Studio overview</a>.')],
      ["My responsibilities", detail([["Project coordination", "Working on priorities and schedules with the wider team."], ["Brand and communications", "Contributing to how the project appears and communicates through its social channels."], ["Partnerships", "Supporting the project’s work with partners and its brand relationships."]])],
      ["Two of its games", detail([["Super League Soccer · Sep 2023 – Jan 2024", "I ran the project with Playverse’s team, made product and priority calls with the studio, staffed roles as needed, led testing, and managed the game’s brand, social channels, and partnerships through launch and live operations. The game has 116M+ plays, and the studio reports a peak of 40,000 simultaneous players. It is now FIFA Super Soccer."], ["RoTube Life 2 · Mar 2025", "I ran production on the sequel, staffed the roles the project needed, led testing, and managed the launch and the live-operations cadence after it. 46M+ plays and 152K favourites."]]) + note("Game figures are the projects’ own and describe each game’s reach, not my individual contribution. Development and studio-wide results belong to the wider team.")],
      ["Why it interests me", prose("I’m interested in the organization behind a studio: how a team decides what to work on, communicates with players, and keeps a project moving. Those questions connect directly to my interest in studying management.")],
      ["See the studio’s work", prose('<a href="https://www.roblox.com/games/12177325772/FIFA-Super-Soccer" rel="noopener">FIFA Super Soccer on Roblox</a> · <a href="https://x.com/PlayverseStudio" rel="noopener">The studio’s X account</a>', "The games are team projects. This page describes my role in project management and communications; the gameplay and studio-wide results reflect the work of the wider team.")],
      ["From the studio", `<div class="shots">${zoom("../assets/work/fifa-super-soccer-roblox.jpg", "The FIFA Super Soccer game listing on Roblox.", "FIFA Super Soccer on Roblox · Screenshot from September 2026")}</div>`],
      ["Experience over time", metrics([["12", "Approximate hours per week", 12], ["130k", "X follower milestone during my work", 130, "k"]]) + note("My social-media work included growing the studio’s X account to 130,000 followers. This is a milestone from that work, not the account’s current total. Game development and studio-wide results belong to the wider team.")],
    ],
    next: ["hearth", "Hearth"],
  },
  hearth: {
    facet: "technology", title: "Hearth — Kaliph Howard", crumb: "Hearth",
    desc: "A private app combining messaging, files, notes, and an iOS experience.",
    h1: "A personal idea, turned into an app.",
    lede: "Hearth is a private web app for messaging, files, notes, and personal tools, made for a small circle of people. I work on its design and development, including an iOS wrapper for using it on a phone.",
    meta: [["Role", "App design and development"], ["Since", "Early 2026"], ["Areas", "Technology · Design"], ["Tools", "Node.js, Socket.IO, PostgreSQL, Capacitor"], ["Access", "Private app · working name Royal Vault"]],
    cover: zoom("../assets/work/royal-vault-login.jpg", "The Hearth sign-in screen, showing its working name, Royal Vault.", "Hearth · Sign-in screen, built under the working name Royal Vault", { lazy: false, dims: ' width="1440" height="900"' }),
    blocks: [
      ["What it does", prose("The app brings messaging, files, and notes into one place. It is a personal project with a small intended audience, which lets me work closely with the details of how it feels to use.")],
      ["What I work on", prose("My work includes the web interface, the server, real-time messaging, and media handling. The iOS wrapper connects the web app to a phone experience.", "This gives me a project that crosses several parts of development. A feature needs an interface, a way to handle its data, and a way to fit into the rest of the app.")],
      ["What happens when a message is sent", `<p class="intro">A chat message connects several parts of the app: the screen someone uses, the stored conversation, and the live updates other connected clients receive.</p>` + steps("Message workflow", [["Compose", "The sender writes a message and can include attachments or reply to an earlier message."], ["Save", "The server records the message, its sender, timestamp, attachments, and any reply relationship."], ["Deliver", "A Socket.IO event sends the new message to connected clients so the conversation can update live."]]) + note("A simplified explanation of the implemented message flow; no private conversation content is shown.")],
      ["The details behind voice messages", prose("A voice recording has to do more than upload successfully: it needs to play in the receiving interface. The server includes a conversion step that turns uploaded recordings into M4A/AAC audio, a format intended for playback across the app’s web and phone interfaces.", "If the conversion tool is unavailable or conversion fails, the upload handler falls back to the original file. This is an example of the media-processing work behind a simple-looking chat feature.")],
      ["Connecting web and phone", prose("The iOS project uses Capacitor to load the hosted web application inside a native shell. The web interface stays shared, while the native layer adds a device-authentication gate and a cover when the app goes into the background.", "This wrapper depends on the hosted app and a network connection. It is a way to bring the web project onto a phone, with additional work around how the app opens and returns from the background.")],
      ["The product question", prose("A project with several features can easily feel like several separate tools. I’m interested in how the interface can make those pieces feel connected while keeping common actions easy to find.", "I’m interested in how an app becomes something people want to return to: small interactions, readable layouts, and an experience that carries over from a computer to a phone. This project lets me keep exploring those decisions alongside the server-side work.")],
    ],
    next: ["wths", "Student Council &amp; Class of 2027"],
  },
};
const isWide = (html) => /class="(detail|steps|shots|metrics)"/.test(html);
const caseBlocks = (blocks) => {
  const out = []; let run = [];
  const flush = () => { if (run.length) { out.push(`      <div class="blocks-2">\n${run.join("\n")}\n      </div>`); run = []; } };
  blocks.forEach(([t, html], i) => {
    const n = String(i + 1).padStart(2, "0");
    if (isWide(html)) { flush(); out.push(block(n, t, html)); }
    else run.push(block(n, t, html, " block--half"));
  });
  flush();
  return out.join("\n");
};
const casePage = (c) => `
  <main id="main" class="page">
    <div class="wrap">
      <header class="case__hero">
        <p class="crumb" data-reveal="fade"><a href="../work.html">Work</a><span aria-hidden="true">/</span><span>${c.crumb}</span></p>
        <h1 class="display case__title" data-split>${c.h1}</h1>
        <p class="lede" data-reveal style="--i:2">${c.lede}</p>
      </header>
      <dl class="meta" data-stagger>${c.meta.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join("")}</dl>
      <div class="cover" data-reveal>
        ${c.cover.startsWith("<figure") ? c.cover.replace('<figure><a class="zoom-link"', '<figure><a class="zoom-link cover__frame"') : `${c.cover}${c.coverCaption ? `<figure><figcaption>${c.coverCaption}</figcaption></figure>` : ""}`}
      </div>
      <div class="case__body">
${caseBlocks(c.blocks)}
      </div>
      <nav class="next" aria-label="Next project"><a href="./${c.next[0]}.html"><span><small>Next project</small><strong>${c.next[1]}</strong></span><b aria-hidden="true">↗</b></a></nav>
    </div>
  </main>
`;

/* ---------------- About ---------------- */
const about = () => `
  <main id="main" class="page">
    <div class="wrap">
      <div class="about-hero">
        <div class="page-head">
          <p class="eyebrow" data-reveal="fade">About</p>
          <h1 class="display h1" data-split>Still learning.<br><em>Already building.</em></h1>
          <p class="lede" data-reveal style="--i:2">I’m Kaliph Howard. I care about Black community, student voice, and making ideas useful. Here’s how those interests fit together.</p>
        </div>
        <aside class="about-aside" aria-label="At a glance" data-reveal style="--i:3">
          <figure class="about__photo"><img src="./assets/kaliph-howard.jpg" alt="Kaliph Howard." width="1000" height="1249" loading="lazy"></figure>
          <dl class="facts">
            <div><dt>School</dt><dd>Warren Township High School</dd></div>
            <div><dt>Class</dt><dd>2027</dd></div>
            <div><dt>Leadership</dt><dd>Student Council President<br>National Independent Black Student Union President</dd></div>
            <div><dt>Interests</dt><dd>Business, technology, community, design</dd></div>
          </dl>
        </aside>
      </div>
      <div class="blocks-2">
${block("01", "A little about me", prose("I’m Kaliph, a senior at Warren Township High School. I like having something to work on: a website, an event, a design, or an idea that hasn’t quite taken shape yet.", "I serve as Student Council President and lead the National Independent Black Student Union. Separately, I build and maintain the Class of 2027 website and work on business and technology projects. Those interests overlap more than I expected. A school website involves decisions about people as well as code; a student organization needs both ideas and follow-through."), " block--half")}
${block("02", "Community", prose("Being part of a Black community is important to me. With the National Independent Black Student Union, that community reaches beyond one school. Our kickoffs, bowling outings, and restaurant gatherings bring together students from four Lake County districts.", "I want college to be a place where I can keep building those connections, contribute to student life, and learn from people whose experiences are different from mine."), " block--half")}
${block("03", "What keeps me curious", prose("I’m interested in what happens after the first idea. How does a website become useful to a class? How does a brand organize its work? What makes someone want to come back to a community?", "Projects such as the Class of 2027 website, AVNT, and Hearth give me ways to explore those questions. I use AI-assisted tools in my development work, alongside my own decisions about what to build and how I want it to work."), " block--half")}
${block("04", "Looking ahead", prose("In college, I want to keep participating in student government, find people to build with, and understand business beyond the projects I already know. I’m especially interested in the connection between entrepreneurship, technology, and community.", "I have things to contribute, and plenty left to learn. I’m excited about both."), " block--half")}
      </div>
      <div class="case__body case__body--tight">
${block("05", "Learning now", `<p class="intro">I’m interested in studying business and management while continuing to build my technical skills.</p><ul class="ledger">
          <li><i>01</i><b>AP Computer Science Principles</b><span>Current senior-year coursework</span></li>
          <li><i>02</i><b>Language and Composition</b><span>Current senior-year coursework</span></li>
          <li><i>03</i><b>ASU Universal Learner</b><span>ENG 101 coursework in progress</span></li>
          <li><i>04</i><b>ACT composite: 25</b><span>Self-reported</span></li>
          <li><i>05</i><b>Microsoft Office Specialist</b><span>Excel, Word, PowerPoint, and Associate certifications</span></li>
        </ul>`)}
${block("06", "Skills in context", detail([["Student leadership", "Planning school events, leading committees including royalty and social media, and helping staff through Student Council; planning and running activities through NIBSU."], ["Event operations", "As volunteer and vendor manager at Juneteenth Lake County, I coordinated volunteer placement and helped vendors settle in with what they needed to operate."], ["Building for people", "The Class of 2027 website connects information, student submissions, and administration in one project."], ["Organizing work", "At AVNT, the agency I founded, I work with my leadership team on client projects, game audiences, and community activity. I also build tools for its operations and work in project management with Playverse, an AVNT client."], ["Visual communication", "Brand identity, page layout, and interfaces give me ways to make information clearer and easier to use."]]))}
${block("07", "Questions I want to explore", `<div class="questions" data-stagger>
          <div style="--q:var(--leadership)"><span>01 / Leadership</span><h3>How can student organizations make participation easier?</h3><p>I want to learn more about representing students and making room for different voices.</p></div>
          <div style="--q:var(--business)"><span>02 / Entrepreneurship</span><h3>What helps an idea become a sustainable venture?</h3><p>I want a stronger understanding of management, financial decisions, and the people behind a business.</p></div>
          <div style="--q:var(--technology)"><span>03 / Technology</span><h3>How do useful tools fit into everyday life?</h3><p>I want to keep building software while learning more about the decisions that make it worth using.</p></div>
        </div>`, " block--full")}
      </div>
    </div>
    <section class="dark section section--tight" aria-labelledby="thread-title" style="margin-top:clamp(2.5rem,6vw,5rem)">
      <div class="wrap thread thread--compact">
        <div><p class="eyebrow" data-reveal="fade">The thread through it all</p><h2 class="display thread__title" id="thread-title" data-split>People. Ideas. <em>Follow-through.</em></h2></div>
        <div class="thread__body" data-reveal style="--i:2"><p class="thread__lede">I’m interested in what happens when an idea becomes something other people can be part of.</p><p>Sometimes that means helping bring students together. Sometimes it means building a website, shaping a brand, or working with a team. I like the mix of people and practical work.</p><p class="colophon">This portfolio brings together my work in school, community, business, and technology. I developed its direction and content with AI assistance; the site uses HTML, CSS, and JavaScript. <a class="link" href="https://github.com/adventau/colleges" rel="noopener">View the source on GitHub</a>.</p><div class="site-foot__row"><a class="btn" href="./work.html">Explore my work <i>↗</i></a><a class="btn btn--ghost" href="./assets/kaliph-howard-activities.pdf">Activities summary · PDF <i>↗</i></a></div></div>
      </div>
    </section>
  </main>
`;

/* ---------------- Contact ---------------- */
const contact = () => `
  <main id="main" class="page">
    <div class="wrap contact">
      <div>
        <p class="eyebrow" data-reveal="fade">Contact</p>
        <h1 class="display h1" data-split style="margin-top:1rem">Get in touch.</h1>
        <p class="lede" data-reveal style="--i:2;margin-top:1.4rem">Thanks for taking the time to get to know me. If something here made you curious, I’d love to hear from you.</p>
        <p data-reveal style="--i:3;margin-top:2.5rem"><a class="email" href="mailto:${EMAIL}">${EMAIL}</a><br><button class="copy-btn" type="button" data-copy="${EMAIL}">Copy address</button></p>
        <p data-reveal style="--i:4;margin-top:1.8rem;color:var(--fg-dim);max-width:34em">I’d be happy to talk about my role in a project, share more about my interests, or answer a question about this portfolio.</p>
      </div>
      <dl class="contact-list" data-stagger>
        <div><dt>Based in</dt><dd>Chicago, Illinois</dd></div>
        <div><dt>School</dt><dd>Warren Township High School, Class of 2027</dd></div>
        <div><dt>Good for</dt><dd>Questions from admissions readers, conversations about the projects, and anyone who wants to work on something together.</dd></div>
        <div><dt>References</dt><dd>References for my work with Playverse and Juneteenth Lake County are available on request.</dd></div>
        <div><dt>Activities</dt><dd><a href="./assets/kaliph-howard-activities.pdf">One-page activities summary (PDF)</a></dd></div>
        <div><dt>Elsewhere</dt><dd><a href="https://github.com/adventau" rel="noopener">GitHub · adventau</a></dd></div>
      </dl>
    </div>
  </main>
`;

/* ---------------- 404 ---------------- */
const notfound = () => `
  <main id="main" class="page notfound wrap">
    <p class="eyebrow" data-reveal="fade">Nothing here</p>
    <p class="code" aria-hidden="true">404</p>
    <h1 class="display h2" data-split>That page isn’t available.</h1>
    <p class="lede" data-reveal style="--i:2">You can return home or explore my work instead.</p>
    <div class="site-foot__row" data-reveal style="--i:3"><a class="btn" href="/index.html">Home <i>→</i></a><a class="btn btn--ghost" href="/work.html">Work <i>→</i></a></div>
  </main>
`;

/* ---------------- Write everything ---------------- */
const pages = [
  ["index.html", head({ p: "./", title: "Kaliph Howard — Chicago, Class of 2027", desc: "Kaliph Howard is a student in Chicago, Illinois (Class of 2027) whose work crosses leadership, technology, business, community and design.", facet: "leadership" }) + header("./", "home") + home() + footer("./", { cta: false })],
  ["work.html", head({ p: "./", title: "Work — Kaliph Howard", desc: "Selected work by Kaliph Howard in student leadership, community, business, technology, and design.", facet: "leadership" }) + header("./", "work") + work() + footer("./")],
  ["about.html", head({ p: "./", title: "About — Kaliph Howard", desc: "Who Kaliph Howard is, what interests him, and how leadership, community, business, technology and design connect in his work.", facet: "design" }) + header("./", "about") + about() + footer("./", { cta: false })],
  ["contact.html", head({ p: "./", title: "Contact — Kaliph Howard", desc: "How to reach Kaliph Howard.", facet: "technology" }) + header("./", "contact") + contact() + footer("./", { cta: false })],
  ["404.html", head({ p: "/", title: "Not found — Kaliph Howard", desc: "That page isn’t available.", facet: "design", robots: '\n  <meta name="robots" content="noindex">' }) + header("/", "404") + notfound() + footer("/", { cta: false })],
  ...Object.entries(cases).map(([slug, c]) => [`work/${slug}.html`, head({ p: "../", title: c.title, desc: c.desc, facet: c.facet, og: "article" }) + header("../", "work") + casePage(c) + footer("../", { cta: false })]),
];
for (const [file, html] of pages) { writeFileSync(ROOT + file, html.replace(/[ \t]+$/gm, "")); console.log("wrote", file); }
