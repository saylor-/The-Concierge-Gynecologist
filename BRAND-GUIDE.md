# The Concierge Gynecologist: Brand & Website Guide

**Owner:** Dr. Lauren Harrington, MD
**Site:** theconciergegynecologist.com
**Contact inbox:** contact@laurenharringtonmd.com
**Repo:** github.com/saylor-/The-Concierge-Gynecologist

This is the single source of truth for how the website looks, sounds, and is built. It is written so that a developer or an AI coding agent can pick up the project cold and make changes that stay on-brand. If something you're about to build contradicts this document, follow the document or update it deliberately. Don't drift.

---

## 1. Brand at a glance

| | |
|---|---|
| **Name** | The Concierge Gynecologist |
| **Physician** | Lauren Harrington, MD: Stanford-trained, board-certified OB/GYN, Menopause Society Certified Practitioner (MSCP) |
| **What it is** | Boutique gynecology care for women in hormonal transitions, delivered **on-site at partnering concierge primary care practices** across the Denver metro area |
| **What it is not** | Not a standalone clinic, not a telehealth app, not a mass-market women's health brand |
| **Core audience** | Women in perimenopause, menopause, and beyond; cancer survivors and previvors; patients of concierge primary care practices in Denver |
| **Secondary audience** | Concierge primary care physicians evaluating a partnership |
| **Hero line** | Boutique gynecology care. |
| **Positioning statement** | Specialized care for women in hormonal transitions, delivered on-site at concierge primary care practices. |

### The feeling
Private, considered, and worth it. It should feel like a discreet luxury brand (reference: **Aesop**), not like a hospital system or a wellness startup. Quiet confidence. Lots of air. Nothing shouts.

### Voice & tone
- **Warm, precise, unhurried.** Write the way Dr. Harrington talks to a patient she respects.
- **Evidence-based, never clinical-cold.** Plain language first; medical terms where they help.
- **Discreet.** Never sensational, never fear-based, never "hacks" or "secrets."
- **Second person ("you") for patients; "Dr. Harrington" in third person** in site copy (first person only inside direct quotes).
- **Short sentences. Sentence case for headings.**

**Words that fit:** personalized, unrushed, evidence-based, discreet, trauma-informed, uncompromised, comprehensive, considered, partnership, on-site.
**Avoid:** cheap, deal, revolutionary, cutting-edge, anti-aging, "fix," exclamation points, emoji, stock-medical clichés.

---

## 2. Color

All colors are defined once as CSS custom properties at the top of `styles.css`. **Never hard-code a hex value in a page or component; use the token.**

### Core palette (use these first)

| Token | Hex | Role | Contrast on Ivory |
|---|---|---|---|
| `--ivory` | `#fffffc` | Page background | n/a |
| `--espresso` | `#1f1711` | Primary text, primary buttons, announcement bar, dark sections | 17.6 : 1 ✅ |
| `--charcoal` | `#2d2929` | Secondary text, footer background | 14.4 : 1 ✅ |
| `--taupe` | `#716862` | **The accent**: eyebrow/subtitle labels, small meta text | 5.4 : 1 ✅ AA |
| `--stone` | `#887e76` | Hairlines, decorative marks, large text only | 3.96 : 1 ⚠️ large text only |
| `--blush` | `#e8d2c6` | Warm section backgrounds, card hover, eyebrows on dark backgrounds | 1.45 : 1 ❌ never for text on light |

### Extended palette (only when more color is needed, **in this order**)

| Token | Hex | Notes |
|---|---|---|
| `--cream` | `#fbf7ef` | Card and panel backgrounds, alternate sections |
| `--clay` | `#e3d2cb` | Alternate warm background |
| `--sage` | `#a3aca8` | Tinted background; espresso text passes (7.6 : 1) |
| `--slate` | `#667487` | Ivory text passes (4.75 : 1) |
| `--brass` | `#aa9b76` | Tinted background; espresso text passes (6.4 : 1) |
| `--forest` | `#495a49` | Ivory text passes (7.4 : 1) |

> Note: the original list included `#fbfef`, which isn't a valid hex (5 digits). It's treated as a typo for `#fbf7ef` (already in the list). The Canva kit also shows `#6d615d`, `#4a3a31`, and `#201912`; these are **not** adopted, because they're near-duplicates of taupe, espresso, and charcoal.

### Color rules
1. **Ivory and cream do most of the work.** The site should read as cream-and-brown. Tinted sections (blush, clay, sage, brass) are accents, used one section at a time.
2. **One accent color, one job.** `--taupe` is used only for eyebrow labels and the rare emphasized word. Never for large blocks of text or backgrounds.
3. **On tinted backgrounds (blush, clay, sage, brass), eyebrows switch to `--charcoal`.** Taupe drops below AA there. Components handle this by overriding `--color-accent` locally.
4. **On dark backgrounds (espresso, charcoal), eyebrows use `--blush`.**
5. **Body text is always espresso or charcoal**, never taupe or stone.
6. **No pure black (`#000`) or pure white (`#fff`)** anywhere.

---

## 3. Typography

Four free Google Fonts, five roles. Loaded via one Google Fonts request in each page's `<head>` with `display=swap`.

| Role | Font | Style | Web size (token) | Tracking | CSS class |
|---|---|---|---|---|---|
| **Title** | Instrument Serif | Regular | 40–68px `--text-title` (hero: 48–96px `--text-display`) | -0.01em | `.title`, `.title--display` |
| **Subtitle / eyebrow** | Instrument Sans | Semibold, ALL CAPS | 12px `--text-eyebrow` | +0.2em (Canva +200) | `.eyebrow` |
| **Heading** | Crimson Pro | Medium (500), sentence case | 26–34px `--text-heading` | normal | `.heading`, `.heading--sm` |
| **Body** | Jost | Regular 400 (Medium 500 for emphasis) | 17px `--text-body`; lede 18–21px | normal | default `body`, `.lede` |
| **Quote** | Instrument Serif | Italic | 28–40px `--text-quote` | normal | `.quote` |

**Size order is fixed:** Title > Quote > Heading > Body > Subtitle.

### How it looks together (reference composition)
```
PRIVATE GYNECOLOGIC CARE · DENVER            ← eyebrow (Instrument Sans, taupe)
Care built around your history, not your chart   ← title (Instrument Serif)
A boutique membership practice for…          ← lede (Jost)
─────────────────────────────────────────
What membership includes                     ← heading (Crimson Pro)
Same-week appointments, direct access…       ← body (Jost)
  "The care I wanted to give women…"          ← quote (Instrument Serif italic)
```

### Five rules to keep it feeling expensive
1. **One accent color, one job.** (See color rule 2.)
2. **Wide tracking only at small, all-caps sizes.** The +0.2em tracking is reserved for labels under ~13px (eyebrows, buttons, form labels). Never track headings.
3. **Instrument Serif stays large.** It has presence above 28px and gets thin below that. Titles, statements, and quotes only. Never body copy or fine print. *(The one exception is the text wordmark in the header, which is a stand-in until the real logo arrives.)*
4. **Keep the two serifs from competing.** Instrument Serif is rare (titles, quotes); Crimson Pro carries every other serif moment. If both appear in one block, separate them clearly by size and weight.
5. **Crimson Pro never becomes body text.** Headings and short section intros only. Anything paragraph-length is Jost.

### Web-specific type rules
- Line length for body copy: max ~68 characters (`--max-width-text: 680px`).
- Body line-height 1.7; titles 1.0–1.12; headings 1.2.
- Use `text-wrap: balance` on titles and statements.
- Long patient reviews are body-length, so they're set in **Jost**, not the quote style. Only short pull-quotes (roughly under 30 words) use `.quote`.

---

## 4. Layout & spacing

| Token | Value | Use |
|---|---|---|
| `--max-width` | 1240px | Page container |
| `--max-width-text` | 680px | Reading column |
| `--gutter` | 20–48px (fluid) | Side padding |
| `--section-space` | 72–140px (fluid) | Vertical rhythm between sections |
| `--radius` | 4px | Cards, images, buttons. Nearly square, never pill-shaped |

- **Generous whitespace is the brand.** When in doubt, add space, not elements.
- Hairline dividers (`1px`, `--color-line`) instead of boxes and shadows. **No drop shadows.**
- Grids collapse to one column below 900px (header/nav) and 640px (card grids).
- Motion is slow and soft: fades and small translations with `--ease`, 0.35–1.2s. No bouncing, no parallax. All auto-rotation stops for users with `prefers-reduced-motion`.

---

## 5. Imagery & video

- **Subjects:** real women in their 40s–60s living active, grounded lives (walking, hiking, swimming, laughing with friends), plus Dr. Harrington in a calm office setting.
- **Look:** natural light, warm neutrals that sit inside the palette, soft contrast, candid rather than posed. Nothing sterile, no exam tables, no stethoscope close-ups, no stock "doctor pointing at clipboard."
- **Home hero video:** 4–5 short clips, **3 seconds each**, crossfading. Muted, `playsinline`, no controls. Each clip ≤ 3MB, 1920px wide, H.264 MP4 (plus an optional WebM), with a still `poster` image.
- **Files:** `images/<section>/<descriptive-kebab-name>.jpg` and `videos/hero-<n>.mp4`. JPG/WebP at 82% quality, max 2400px on the long edge. Always set `width`/`height` attributes and descriptive `alt` text.
- Until real assets arrive, pages use `.placeholder` blocks labeled with what belongs there. **Search the codebase for `placeholder` before launch; none should remain.**

---

## 6. Components

### Header (modeled on aesop.com)
Three stacked layers:
1. **Announcement bar**: espresso background, one short ivory line, centered.
2. **Top row**: 3-column grid. Left: location text (desktop) / menu button (mobile). Center: wordmark → home. Right: "Stay in touch" and **"Inquire"** (both open the Inquire panel).
3. **Nav row**: centered links: Offerings · Care Model · Dr. Harrington · In Their Words. Active page gets a 1px underline (`aria-current="page"`). Hover draws the underline in from the left.

Behavior:
- Header is `position: sticky`. The announcement bar scrolls away; the header stays.
- **Home page only:** the header starts transparent with ivory text over the hero video, then turns solid ivory with espresso text on scroll or hover (the MD2 color change).
- **Below 900px:** nav row collapses into a full-screen menu opened by the menu button.

### Inquire panel (modeled on md2.com)
- Slides in from the right over a dimmed backdrop. It's a panel, not a page change. Opened by any element with `data-open-inquire`; closes on ✕, backdrop click, or `Esc`. Focus is trapped inside while open and returned afterward.
- Every `data-open-inquire` element is a real link to `/inquire/`, so it still works without JavaScript. `/#inquire` on any URL also opens the panel.
- **Form 1: Inquiry.** First name, Last name, Email, Phone, Message, plus an opt-in checkbox: "I'd like to receive occasional updates — new partnerships, availability, and practice news."
- **Form 2: Practice updates.** Name, Email.
- Both forms carry a privacy note: *don't include personal medical details; not for emergencies.*

### Buttons & links
- `.button`: espresso fill, ivory text, 12px Instrument Sans caps, +0.16em tracking, 48px tall.
- `.button--ghost`: outline version. `.button--light`: for dark backgrounds.
- `.text-link`: inline underlined link with the same caps treatment.

### Cards
- **Offering card** (asktia.com list + DSR box grid): cream background, hairline border, line icon in taupe, Crimson Pro name, 1–2 sentence Jost description. Hover: background warms to blush. No shadow, no lift.
- **Feature card**: image on top, text below, sticky beside the offerings grid on desktop.

### Rotators (one shared script)
Used for the hero clips, the "Care that is ___" tabs, and the review carousel. Markup contract (see `script.js`): `[data-rotator]` root, one or more `[data-rotator-track]` children that rotate in lockstep, optional `[data-rotator-tab]`, `[data-rotator-prev]`, `[data-rotator-next]`, `[data-rotator-count]`. A `data-bg` attribute on the first track's items tints the section.

### Footer
Charcoal background. Wordmark + one-line description, an Explore nav, contact, then a legal row with copyright and the medical disclaimer.

---

## 7. Pages

Each page lives in its own folder as `index.html`, so URLs are clean (`/care-model/`).

| Page | URL | Folder |
|---|---|---|
| Home | `/` | `/index.html` |
| Offerings | `/offerings/` | `/offerings/` |
| Care Model | `/care-model/` | `/care-model/` |
| Dr. Harrington | `/dr-harrington/` | `/dr-harrington/` |
| In Their Words | `/in-their-words/` | `/in-their-words/` |
| Inquire | `/inquire/` (also a slide-out panel on every page) | `/inquire/` |
| Not found | any unknown URL | `/404.html` |

### Home
1. **Hero video.** 4–5 clips, 3s each, crossfade. Fixed text at the bottom that never changes: **"Boutique gynecology care."** (MD2 style).
2. **Statement.** Very large, lots of space: *"Specialized care for women in hormonal transitions, delivered on-site at concierge primary care practices."*
3. **Care that is ___.** Rotating words, each paired with an image; section background tint shifts with each word. Also clickable as tabs. Words: Personalized · Unrushed · Evidence-based · Discreet · Trauma-informed · Uncompromised · Comprehensive.
4. **Meet Dr. Harrington.** Photo + short bio + link.
5. **Offerings preview.** All 12 offerings as compact links to `/offerings/`.
6. **Reviews carousel.** At the bottom; cycles through the bolded excerpt of each review.

### Offerings
Twelve services in boxes with icon + short description (asktia.com feel, DSR box layout), next to a sticky feature card with a photo of Dr. Harrington and an Inquire CTA.
Perimenopause · Menopause · Sexual function · Cancer survivorship · Previvor surveillance · Abnormal uterine bleeding · Pelvic pain · Vulvar conditions · Endometrial biopsy · IUD insertion · Colposcopy & LEEP · Hysteroscopy.
**Descriptions are drafts and must be reviewed by Dr. Harrington for clinical accuracy before launch.**

### Care Model
Explains the partnership model: Dr. Harrington provides gynecologic care, consultations, and select procedural services on-site at partnering concierge primary care practices across the Denver metro area. It is not an independent practice. Includes a three-step explainer, a patient callout ("ask your physician whether their office partners with Dr. Harrington"), and a CTA for practices interested in partnering.

### Dr. Harrington
Layout modeled on parsleyhealth.com/robin-berzin-md: large portrait beside the bio, then credential groups as labeled rows: **Education & Training**, **Memberships**, **Awards** (with years right-aligned).

### In Their Words
Intro line, then all patient reviews **at the same text size**, each with its date. Reviews are quoted verbatim.

### Inquire
Standalone version of the panel's two forms, for direct links and no-JS visitors.

### Inspiration references
- **aesop.com**: overall vibe, header/nav structure
- **md2.com**: hero video, header color change, Inquire panel
- **asktia.com**: offering list with icons
- **parsleyhealth.com/robin-berzin-md**: physician profile format
- **radiantwomenshealthmd.com, parsleyhealth.com**: general tone

---

## 8. Technical standards

### Stack
- **Plain static HTML + one CSS file + one vanilla JS file.** No framework, no build step, no npm dependencies at runtime.
- **Hosting:** Netlify (publish directory is the repo root; config in `netlify.toml`).
- **Forms:** Netlify Forms (`data-netlify="true"`), with email notifications to contact@laurenharringtonmd.com configured in the Netlify dashboard.
- **Subscriber welcome email:** Resend (to be set up; see open tasks). Will run as a Netlify Function in `netlify/functions/`.

### File structure
```
/
├── index.html              Home
├── offerings/index.html
├── care-model/index.html
├── dr-harrington/index.html
├── in-their-words/index.html
├── inquire/index.html
├── 404.html
├── partials/               Shared header, footer, Inquire panel (source of truth)
│   ├── header.html
│   ├── footer.html
│   └── inquire-panel.html
├── tools/
│   └── sync-partials.mjs   Copies partials into every page
├── styles.css              All styles; tokens at the top
├── script.js               All behavior
├── images/                 team/, offerings/, …
├── videos/                 hero clips
├── favicon.svg
├── netlify.toml            Hosting, caching, security headers
├── robots.txt
├── sitemap.xml
└── BRAND-GUIDE.md          This document
```

### Shared markup workflow
The header, footer, and Inquire panel are identical on every page. Edit them **only** in `/partials`, then run:
```bash
node tools/sync-partials.mjs
```
This rewrites the content between `<!-- partial:name -->` … `<!-- /partial:name -->` markers in every page and sets `aria-current="page"` on the right nav link. Commit the partials and the updated pages together.

### Adding a page
1. Create `new-page/index.html` by copying an existing inner page (keeps the full `<head>` and partial markers).
2. Update `<title>`, meta description, canonical URL, and Open Graph tags.
3. Add the link to `partials/header.html` and `partials/footer.html`, then run the sync script.
4. Add the URL to `sitemap.xml`.

### Code conventions
- **CSS:** tokens only (no raw hex), BEM-style class names (`block__element--modifier`), mobile-safe fluid sizes via `clamp()`, sections separated by comment banners.
- **HTML:** semantic landmarks (`header`, `nav`, `main`, `footer`), one `<h1>` per page, heading levels in order, root-relative URLs (`/styles.css`, `/offerings/`).
- **JS:** vanilla, no globals, behavior attached through `data-*` attributes rather than classes.

### SEO
Every page has: a unique `<title>` ("Page — The Concierge Gynecologist"), a meta description (140–160 chars), a canonical URL, Open Graph + Twitter tags, and an entry in `sitemap.xml`. Home carries `MedicalBusiness` JSON-LD; the Dr. Harrington page carries `Physician`/`Person` JSON-LD with credentials.

### Accessibility (WCAG 2.2 AA)
- Color pairs in §2 are pre-checked; don't introduce new ones without checking contrast.
- Skip link, visible focus styles, keyboard-operable menu/panel/rotators, `Esc` closes overlays.
- Auto-rotating content pauses on hover/focus, stops when the tab is hidden, and doesn't auto-play under `prefers-reduced-motion`.
- All form fields have visible labels; status messages use `aria-live`.
- Videos are decorative (muted, no audio) and marked `aria-hidden`.

### Performance
- Target Lighthouse ≥ 90 on all four categories on mobile.
- Compress every image and clip before committing (see §5). Lazy-load anything below the fold (`loading="lazy"`).
- Images and videos are cached for a year (`netlify.toml`), so **add new filenames instead of overwriting files**.

### Privacy
- This is a medical practice. **Web forms are not HIPAA-secure channels.** Forms must never ask for symptoms, diagnoses, or health history, and must tell visitors not to include them.
- No third-party trackers or analytics without Dr. Harrington's sign-off; if analytics are added, prefer a privacy-first option (e.g., Plausible or Fathom) and add a privacy policy page.

### Local development
```bash
npx serve .
```
Then open http://localhost:3000. Netlify Forms only work on the deployed site; locally, form submissions show a fallback error message.

---

## 9. Content decisions to confirm

| # | Item | Current choice |
|---|---|---|
| 1 | Contact email domain | Site is `theconciergegynecologist.com`; forms and footer still use `contact@laurenharringtonmd.com` |
| 2 | Accent color for eyebrows | `--taupe #716862`. The type-system sample used a burgundy that isn't in the palette |
| 3 | "Discrete" in the "Care that is" list | Changed to **"Discreet"** (private/confidential). "Discrete" means separate |
| 4 | ACOG name | Written as "American College of Obstetricians and Gynecologists, Fellow" (official name) |
| 5 | Review typos (e.g., "extremely through") | Kept verbatim, as patient quotes |
| 6 | Sample quotes from the type-system doc ("I don't want you to just get through this decade…") | **Not used on the site** until Dr. Harrington confirms they're her words |
| 7 | "Membership" language in the type samples | Not used; the site describes a partnership model, not a direct membership |
| 8 | Offering descriptions | Drafted; need clinical review |
| 9 | Announcement bar copy | "Private gynecologic care, delivered on-site at concierge practices across Denver" |
| 10 | Home review carousel ("just the bold text") | The source doc had no bold excerpts, so each slide uses one short **verbatim** sentence from a review. Swap in preferred excerpts in `index.html` |
| 11 | Page headlines and short section intros not in the source doc (e.g., "Focused care for the transitions that matter") | Drafted in brand voice; edit freely |

---

## 10. Open tasks

| Owner | Task |
|---|---|
| Lauren | Provide logo files (SVG preferred) to replace the text wordmark |
| Lauren | Provide AI avatar / images for each "Care that is" word |
| Lauren | Provide photo for the Offerings page |
| Lauren | Upload 4–5 hero videos |
| Lauren | Review and approve offering descriptions |
| Lauren | Draft the automatic welcome email for subscribers (sent via Resend) |
| Lauren | Create Netlify, GitHub, and Resend accounts using contact@laurenharringtonmd.com |
| Dev | Connect repo to Netlify; enable form notifications to contact@laurenharringtonmd.com |
| Dev | Build Resend subscribe function (`netlify/functions/`) once the account exists |
| Dev | Replace every `.placeholder` block with final assets |
| Dev | Add privacy policy page if analytics or subscriber email are enabled |
