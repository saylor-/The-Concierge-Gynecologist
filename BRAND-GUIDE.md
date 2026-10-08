# The Concierge Gynecologist: Brand & Website Guide

**Owner:** Dr. Lauren Harrington, MD
**Site:** theconciergegynecologist.com
**Contact inbox:** contact@theconciergegynecologist.com
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
| `--espresso` | `#1f1711` | Primary text, primary buttons, dark sections | 17.6 : 1 ✅ |
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
- **Home hero video:** nine short clips, **2 seconds each** on screen (encoded at 2.8s so the cross-dissolve always has moving footage on both sides), crossfading. Muted, `playsinline`, no controls. Each clip ≤ 3MB, 1920px wide, H.264 MP4 (plus an optional WebM), with a still `poster` image. Keep the clip length and the rotator's `data-interval` in `index.html` in step.
- **Video workflow:** drop full-resolution source files in `videos/originals/` (git-ignored, never deployed). Encode each as the next `videos/hero-<n>.mp4` with a poster frame, then add a slide in `index.html`:
  ```bash
  ffmpeg -ss 2 -i videos/originals/SOURCE.mp4 -t 2 -an -vf "scale=1920:-2,fps=25" -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart videos/hero-2.mp4
  ffmpeg -i videos/hero-2.mp4 -frames:v 1 -q:v 4 images/hero/hero-2.jpg
  ```
  `-ss` (before `-i`) picks the start second; `-t 2` takes the two seconds that follow. Always cut from the 4K master rather than re-encoding an already-compressed clip, and never leave a raw master in `videos/` — everything there ships.
- **Files:** `images/<section>/<descriptive-kebab-name>.jpg` and `videos/hero-<n>.mp4`. JPG/WebP at 82% quality, max 2400px on the long edge. Always set `width`/`height` attributes and descriptive `alt` text.
- **Icons:** the offering icons are illustrated elements from the Haute Stock graphics packs, trimmed to their artwork and exported at 160px to `images/icons/<slug>.png` (sources in `images/originals/icons/`, git-ignored). They are used at 38px in the offerings rows and 30px in the home list. The set is deliberately limited to the botanical and celestial pieces so it reads as one family — the packs' beach and beauty motifs (flip-flops, lipstick, cocktails) are off-brand and stay unused. Mapping: Perimenopause → crescent moon · Menopause → sun · Sexual function → flowering sprig · Cancer survivorship → olive branch · Previvor surveillance → four-point star · Abnormal uterine bleeding → moon phases · Pelvic pain → waves · Vulvar conditions → daisies · Contraception → three circles · Procedures → crystals.
- **Current sources:** photography from Haute Stock, motion from Artlist. Full-resolution originals live in `images/originals/` and `videos/originals/` (both git-ignored, never deployed); only the cropped derivatives ship. Crop to the slot's ratio rather than letting CSS squash the image:
  ```bash
  # "Care that is" + care model, portrait 4:5
  ffmpeg -i "images/originals/SOURCE.jpg" -vf "scale=1200:1500:force_original_aspect_ratio=increase,crop=1200:1500" -q:v 4 images/approach/NAME.jpg
  # Offering panels, landscape 16:11
  ffmpeg -i "images/originals/SOURCE.jpg" -vf "scale=1280:880:force_original_aspect_ratio=increase,crop=1280:880" -q:v 4 images/offerings/SLUG.jpg
  ```
- Until real assets arrive, pages use `.placeholder` blocks labeled with what belongs there. **Search the codebase for `placeholder` before launch; none should remain.**

---

## 6. Components

### Header (modeled on aesop.com)
Three stacked layers:
1. **Announcement bar**: espresso background, one ivory line, centered — *"A membership-based boutique gynecology practice in Denver, Colorado providing specialized care for women in hormonal transitions."* Removed 2026-09-30, restored 2026-10-07 with this copy. It is long enough to wrap on a phone, so unlike the original it is not clamped to one line with an ellipsis. **`--announce-h` has to match the height it actually takes** — 44px desktop, 60px below 900px — because the full-screen heroes subtract it so they still end exactly at the fold. Change the copy or the type size and re-measure both.
2. **Top row**: 3-column grid. Left: location text (desktop) / menu button (mobile). Center: wordmark → home. Right: **"SUBSCRIBE"** (bold) and **"GET IN TOUCH"** — 0.8125rem, uppercased in CSS (`text-transform`, not in the markup, so screen readers read them as words). They run one step below `.site-nav__link`'s 0.9375rem because uppercase reads larger at the same size; the two should look level. "SUBSCRIBE" is Jost **700** — the only place the site uses that weight, which is why every page's Google Fonts URL carries `Jost:wght@400;500;700`. Both open the Inquire panel.
3. **Nav row**: centered links: Expertise · Dr. Harrington · Q&A · In Their Words. Active page gets a 1px underline (`aria-current="page"`). Hover draws the underline in from the left. Below 900px this becomes the full-screen menu and also carries **Get in touch** and **Subscribe** (`.site-nav__mobile-only`), because only one utility link fits beside the wordmark at that width. The one kept there is **Subscribe**; Get in touch is hidden from the utility row and lives in the menu. They are plain links in the menu, not panel triggers: a slide-out panel over an already full-screen menu is a poor place to land.

Behavior:
- Header is `position: sticky`. The announcement bar scrolls away; the header stays.
- **Home page only:** the header starts transparent with ivory text over the hero video, then turns solid ivory with espresso text on scroll or hover (the MD2 color change).
- **Below 900px:** nav row collapses into a full-screen menu opened by the menu button.

### Inquire panel (modeled on md2.com)
- Slides in from the right over a dimmed backdrop. It's a panel, not a page change. Opened by any element with `data-open-inquire`; closes on ✕, backdrop click, or `Esc`. Focus is trapped inside while open and returned afterward.
- Every `data-open-inquire` element is a real link to `/inquire/`, so it still works without JavaScript. `/#inquire` on any URL also opens the panel.
- **The two forms are separate and never appear together.** The panel has two modes and shows exactly one: `[data-open-inquire]` opens **Get in touch**, `[data-open-inquire="updates"]` opens **Subscribe**. Same rule on the pages: `/inquire/` carries only the inquiry form, `/stay-in-touch/` only the sign-up, each cross-linking to the other. (The URLs still read `/inquire/` and `/stay-in-touch/`; only the labels changed.)
- **Get in touch.** Eyebrow "Get in touch" → title *"Do you have a specific question or inquiry?"* → *"Reach Dr. Harrington's team directly. No medical questions or advice, please."* Fields: First name, Last name, Email, Phone, Message, plus an opt-in checkbox: "I'd like to receive occasional updates — new partnerships, availability, and practice news."
- **Subscribe.** Eyebrow "Subscribe" → title *"Want to know more"* → *"Subscribe to Dr. Harrington's newsletter for information about how to become a patient, announcements about new practice locations, and current news in hormone health."* Fields: Name, Email.
- Both forms carry a privacy note: *don't include personal medical details; not for emergencies.*

### Buttons & links
- `.button`: espresso fill, ivory text, 12px Instrument Sans caps, +0.16em tracking, 48px tall.
- `.button--ghost`: outline version. `.button--light`: solid ivory for dark backgrounds. `.button--ghost-light`: outlined ivory for use over photography or video (the hero's "Learn more").
- `.text-link`: inline underlined link with the same caps treatment.

### Cards
### Disclosure lists (Q&A and Expertise)
One shared component, used by both pages. A `.topic` is a titled group; its `.topic__list` holds `.disclosure` rows, which are native `<details>`/`<summary>`: label on the left, plus/minus on the right, hairline borders between rows, the same fold as the credential groups. The labels are **Jost at 1.375rem** — the body face, matching the answer that folds out beneath, and a step under `--text-heading-sm` because the sans has the larger x-height. Deliberately not the Crimson Pro used by the credential groups on `/dr-harrington/`, and set once for both pages.

- **No JavaScript is required.** Every answer ships in the HTML whether folded or not, which is what lets search engines and assistants read all of it.
- **Hover to open** on a list marked `data-hover-open` (Expertise, and the credential groups on Dr. Harrington): the pointer previews a row, leaving closes it, clicking — or Enter, which fires a click on a `<summary>` — pins it open, and clicking again closes it. Only on `(hover: hover) and (pointer: fine)`; a touch device keeps the plain tap behaviour, since a hover it cannot perform would put the content out of reach. Esc dismisses.

**Rows open in one frame. Do not re-animate the fold.** Both the disclosure rows and the credential groups used to animate `block-size` from 0 with the body fading in. Two artifacts came out of it, and they pull against each other: with a delay on the fade, the row sat open and *empty* for the first ~80ms, so all you saw was the next row's border floating in a blank box; with no delay, the clip edge arrived mid-sentence while that same border sat directly beneath it, reading as a rule struck through the words. Both were caught on frame-by-frame recordings of a real hover. Nothing can be mistimed if nothing animates, so neither property transitions now. The plus/minus still turns, which is enough to keep the control from feeling dead.
- Each row carries an `id`, so `/expertise/#pelvic-pain` deep-links to it. Native `<details>` does not open for a fragment in every browser, so `script.js` opens the match and re-scrolls on the next frame (opening changes the page height); `scroll-margin-top` clears the sticky header.
- This replaced the asktia-style **offerings browser** (icon rows plus a sticky photo panel) on 2026-09-30, along with the ten illustrated icons and ten offering photographs on that page. All of it is in git history — markup, `.offering-*` and `.offer-links` CSS, and the `data-offerings` block in `script.js`. The image and icon files are still in the repo, now unused.

### Credential groups (Dr. Harrington page)
Native `<details>`/`<summary>` rows, closed by default: Crimson Pro heading on the left, a plus/minus icon on the right, hairline borders between groups. The list sits in the right two-thirds when open. The group opens in one frame — see §6 for why it is not animated — and hover opens it, since the list carries `data-hover-open`.

### Parallax bands (modeled on editorialstockimages.com)
Any section marked `data-parallax` holds a `[data-parallax-layer]` image that overhangs its frame by 12% top and bottom and slides at a fraction of the scroll rate, so the section reads as a window moving over a near-stationary photograph. Used on the home page's membership band and "Ready for a different type of care?".

- The overhang covers the whole travel, so nothing exposes an edge.
- The layer overhangs **40%** top and bottom and travels **0.36 × the section height**. Those two numbers move together: travel must stay under the overhang or an edge shows.
- **The trade to know before turning it up again:** a deeper overhang makes the visible frame taller and therefore narrower, so `object-fit: cover` trims more off the sides. At 40% the frame is roughly 1.2:1 on a 1440px screen. That is why each band's `object-position` is set by hand — `left` on the membership band to hold the rosehips, `72%` on the care band to push the subject toward the right edge. Turn the parallax up further and both will need re-checking.
- `script.js` gates the work behind an `IntersectionObserver` (only on-screen bands are measured) and does all reading and writing inside one `requestAnimationFrame`.
- **Under `prefers-reduced-motion` nothing moves** — no class is added, no listener is bound, and CSS pins `transform: none`. With JavaScript off, the layer simply sits centred. The section is complete in every case.

### Rotators (one shared script)
Used for the hero clips, the "Care that is ___" tabs, and the review carousel. Markup contract (see `script.js`): `[data-rotator]` root, one or more `[data-rotator-track]` children that rotate in lockstep, optional `[data-rotator-tab]`, `[data-rotator-prev]`, `[data-rotator-next]`, `[data-rotator-count]`. A `data-bg` attribute on the first track's items tints the section.
**Cross-dissolve:** `data-fade="<ms>"` holds the outgoing item at full opacity (class `.is-leaving`) while the incoming one fades in over it. Without it both items fade at once, the hero dips toward the background colour mid-transition, and that dip reads as a flash. Keep the fade a little under the interval (hero: 1100ms fade, 2000ms interval).

### Footer
Three columns. Left: wordmark, **Denver, Colorado**, then the tagline. Middle: Explore. Right: Contact — Get in touch and Subscribe only. The `contact@theconciergegynecologist.com` address was pulled out of the footer on 2026-09-30; it still appears on `/inquire/`, in the Q&A answer about reaching the office, and in the `MedicalBusiness` schema on the home page.

Charcoal background. Wordmark + one-line description, an Explore nav, contact, then a legal row with copyright and the medical disclaimer.

---

## 7. Pages

Each page lives in its own folder as `index.html`, so URLs are clean (`/expertise/`).

| Page | URL | Folder |
|---|---|---|
| Home | `/` | `/index.html` |
| Expertise | `/expertise/` | `/expertise/` |
| Q&A | `/questions/` | `/questions/` |
| Dr. Harrington | `/dr-harrington/` | `/dr-harrington/` |
| In Their Words | `/in-their-words/` | `/in-their-words/` |
| Get in touch | `/inquire/` (also a slide-out panel on every page) | `/inquire/` |
| Subscribe | `/stay-in-touch/` (also a panel mode) | `/stay-in-touch/` |
| Not found | any unknown URL | `/404.html` |
| Admin | `/admin/` (noindex, password-protected) | `/admin/` |

### Home
1. **Hero video.** 9 clips, 2s each, crossfade. Fixed text that never changes: **"Boutique gynecology care."** (MD2 style), sitting above centre with a "Learn more" button and down arrow beneath it that scrolls to the statement section (`#statement`, which carries `.scroll-target` for the sticky-header offset).
2. **Statement.** Very large, lots of space: *"Specialized care for women in hormonal transitions."* `--text-statement` is `clamp(3.15rem, 6.44vw, 5.6rem)`.
3. **Membership band.** Full-bleed parallax band over `images/sections/membership.jpg` (rosehips on a linen backdrop). The photograph is open on the right, which is where the copy sits; `.membership::after` lays an ivory wash left-to-right so espresso type clears AA wherever the parallax brings the frame. Below 900px the wash runs top-to-bottom instead and the crop pulls left (`object-position: 12% center`) so the branch stays in frame. Copy: *"A membership practice in the Denver metro area for women as they navigate:"* set in **Jost, tracked caps, at display size** (`.membership-lead`), followed by five large Instrument Serif rows — Perimenopause · Menopause · Sexual Health · Cancer Survivorship · Previvor Surveillance — and an "Areas of expertise →" link. This replaced the rotating **"Care that is ___"** panel on 2026-09-30; that markup is in git history and its `.care-tabs` styles are still in `styles.css` if it returns. The split-layout version that stood here briefly used `images/approach/membership.jpg` (a mirrored portrait) — that file is still in the repo but unused.
4. **Meet your physician.** Espresso band (`.section--dark`), ivory text. The portrait's own dark studio backdrop runs into the section background, which is the point. The name (`.physician-name`) uses the same tracked-caps Subtitle treatment as `.membership-lead`, one step larger; the one-sentence bio (`.physician-bio`) is Jost at lede size; then "Read her story →".
5. **Ready for a different type of care?** Full-bleed parallax band over `images/sections/ready-for-different-care.jpg` — blush plaster, subject held to the right by `object-position: 72%`, copy on the open wall at left. **This band is light, not dark**: espresso text on an ivory wash that fades out to the right. It replaced a dark foliage crop (`what-makes-us-different.jpg`, deleted; regenerate from `images/originals/haute-stock-flora-collection-final-14.jpg` if wanted). Below 900px the copy runs full width, so the crop pulls onto the plaster (`object-position: 18%`) and the wash goes top-to-bottom. The opening block is broken by hand into three lines with `<br>`; those breaks are suppressed below 640px, where the sentences already wrap. Replaced the ten-item expertise preview on 2026-09-30; that list is in git history. Headed *"Ready for a different type of care?"*. Copy names the MSCP credential and the University of Colorado directorship — **factual claims about Dr. Harrington, so they need her sign-off before launch.**
6. **Want to learn more?** Closing call to action over `images/sections/learn-more.jpg`, another light parallax band, with a single button to `/expertise/`. Sits below the reviews, between them and the footer.
7. **Reviews carousel.** Above it; cycles through one short verbatim sentence from each review. The quotes are written into the HTML oldest-first, and `script.js` **shuffles the track once per visit** before the rotator reads it — otherwise the carousel always opened on 2022 and the newest quotes were never seen. Remove that block to restore chronological order.

### Expertise
Full-screen image header — *"Personalized gynecology care for every stage of life."*, no supporting line under it — then four titled groups of disclosure rows (see §6). No icons, no photographs — the list is the page. The "On-site care" section (photo, partnership summary, Get in touch) sits below it at the bottom.

The hero photograph is pulled to `object-position: left center` on this page only: in the default centre crop the subject stands directly behind the headline. The list sits close under it (`.section--tight-top`) rather than a full section's padding down.

The closing "On-site care" block is centred copy with no photograph — the portrait that stood there was a placeholder of Dr. Harrington carried over from an earlier layout.

1. **Hormonal health** — Perimenopause · Menopause · Sexual function
2. **Cancer survivorship & risk** — Cancer survivorship · Previvor surveillance
3. **Gynecologic conditions** — Abnormal uterine bleeding · Pelvic pain · Vulvar conditions · Contraception
4. **Procedures** — Endometrial biopsy · IUD insertion · Colposcopy & LEEP · Hysteroscopy

**Descriptions are Dr. Harrington's own words — quote them verbatim and don't paraphrase.** The first nine are hers as written. The four **Procedures** rows are cut from her single "Procedures" sentence and the IUD clause of "Contraception" — no new copy was written, but she has never described these four individually. See §10.

### Q&A
Replaced the Care Model page on 2026-09-30 (that page's markup is in git history at `care-model/index.html`). Full-screen image header, then three groups of native `<details>` accordions — **The practice**, **Care and treatment**, **Alongside your other care** — closed by default, same plus/minus fold as the credential groups.

Eight questions, **Dr. Harrington's own answers, verbatim** (supplied 30 Sep 2026, revised 5 Oct 2026). The scaffold questions that stood here before were replaced wholesale; they are in git history if any are wanted back.

**The answers are split between two voices.** Insurance, office, hormone philosophy and scope of care speak about her in the third person ("Dr. Harrington does not accept insurance"); keeping your own physician, online platforms, timing and becoming a patient speak as her ("see me", "I'm glad to coordinate"). That is how the copy was supplied, so it was left alone — see §10.

Every answer is also written into a `FAQPage` JSON-LD block in `<head>`, word for word. **Edit both or the schema goes stale.** Because the answers ship in the HTML whether folded or not, search engines and AI assistants read all of them — this is the site's main AEO asset.

**Not published:** *"Can I schedule a virtual visit, or does every appointment need to be in person?"* came with no answer — the source note says the telehealth policy is undecided. A question with no answer, or a guessed one, is worse than a missing question on a medical site. See §10.

### Dr. Harrington
Layout modeled on parsleyhealth.com/robin-berzin-md: large portrait beside the bio, then four foldable credential groups, **Education & Training**, **Memberships**, **Awards**, **Presentations** (years right-aligned), closed until hovered or clicked — the list carries `data-hover-open` (see §6). Presentations with several venues stack a `.credential-list__detail` line each and carry a year range in the right column.

The page closes on a light quote band (`.quote-band--light`, `images/sections/founder-quote.jpg`) carrying her founder's statement in **Instrument Serif Italic** — the brand's Quote role — attributed "— Dr. Lauren Harrington, MD, MSCP". Same component as the closing band on In Their Words, light variant: the photograph is near-white, so a `rgba(255, 255, 252, 0.5)` wash both lifts its few dark pixels clear of espresso text and mutes the crosswalk pattern behind a long quote.

The three-paragraph bio is **Dr. Harrington's own copy** (supplied 30 Sep 2026) — quote it verbatim. The `Person` JSON-LD in `<head>` mirrors it: the honor societies sit in `memberOf` and the teaching appointment in `affiliation`. If the bio changes, change the schema with it.

### In Their Words
Fourteen patient reviews, quoted verbatim, **one at a time in a carousel** — the same rotator as the home page, on a 9s interval because these are whole reviews rather than one-line excerpts. Replaced a two-column grid of all fourteen on 2026-09-30.

- Body face at `clamp(1.25rem, 1.9vw, 1.625rem)`, **ranged left inside a centred 820px column**. The column is in px rather than em so the measure holds as the type size changes, and so the quote mark — set at 2.75rem — lines up with the review text instead of resolving to its own width. The home carousel centres its lines because they are short and set large; these run to eighteen, and centred body copy makes the eye hunt for the start of each one.
- The reviews differ wildly in length — one runs about 250 words, most are under 60. Stacked in one grid cell the section would always be as tall as the longest, so **only the active review is in flow** and the track's height follows it. Chromium animates that height (`interpolate-size`); elsewhere it steps.
- Controls are prev / count / next plus the **site-wide motion switch** (`.motion-toggle--inline`), which WCAG 2.2.2 requires for anything that advances on its own — the home hero's toggle and this one are the same control and share their state.
- All fourteen stay in the HTML, so search engines read every review; the rotator sets `aria-hidden` on the inactive ones so screen readers hear only the current one.

Closes on a full-bleed parallax band (`images/sections/closing-quote.jpg`) carrying Dr. Harrington's own line — *"The care I provide is the care most women have **never** been offered."* — her attribution, and a **Become a patient** button. Set in Instrument Serif **Regular**, not the italic Quote role, because the emphasis on "never" has to read as italic against it.

The scrim is `rgba(31, 23, 17, 0.78)` and that number is not a taste call: the brightest pixels in the frame sit near sRGB 213, and ivory text needs the composite at or below ~0.18 relative luminance to clear AA. The caption is ivory rather than the section's blush accent for the same reason. **Lighten the scrim or swap the photograph and both have to be recomputed** — automated checkers report contrast over a photograph as "incomplete", not as a failure, so nothing will catch it for you. This replaced a "Want to know more? Let's stay in touch." callout on 2026-09-30.

### Get in touch / Subscribe
Standalone versions of the panel's two forms, for direct links and no-JS visitors.

### Inspiration references
- **aesop.com**: overall vibe, header/nav structure
- **md2.com**: hero video, header color change, Inquire panel
- **asktia.com**: offering list with icons
- **parsleyhealth.com/robin-berzin-md**: physician profile format
- **radiantwomenshealthmd.com, parsleyhealth.com**: general tone

---

## 8. Technical standards

### Admin & email automation
- `/admin/` reads the email list and inquiries through `netlify/functions/admin-data.mjs`. The password lives in the `ADMIN_PASSWORD` environment variable and is checked **server-side** — never ship a password in page JavaScript, since the data behind it is personal.
- `netlify/functions/submission-created.js` fires on every Netlify form submission and sends the Resend welcome email for the `updates` form only.
- Setup for both, plus domain and deploy steps, is in [docs/LAUNCH-GUIDE.md](docs/LAUNCH-GUIDE.md).

### Stack
- **Plain static HTML + one CSS file + one vanilla JS file.** No framework, no build step, no npm dependencies at runtime.
- **Hosting:** Netlify (publish directory is the repo root; config in `netlify.toml`).
- **Forms:** Netlify Forms (`data-netlify="true"`), with email notifications to contact@theconciergegynecologist.com configured in the Netlify dashboard.
- **Subscriber welcome email:** Resend (to be set up; see open tasks). Will run as a Netlify Function in `netlify/functions/`.

### File structure
```
/
├── index.html              Home
├── expertise/index.html
├── questions/index.html
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
- **HTML:** semantic landmarks (`header`, `nav`, `main`, `footer`), one `<h1>` per page, heading levels in order, root-relative URLs (`/styles.css`, `/expertise/`).
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
| 1 | Contact email | **Confirmed:** `contact@theconciergegynecologist.com` stays the contact address, even though the site is `theconciergegynecologist.com` |
| 2 | Accent color for eyebrows | `--taupe #716862`. The type-system sample used a burgundy that isn't in the palette |
| 3 | "Discrete" in the "Care that is" list | Changed to **"Discreet"** (private/confidential). "Discrete" means separate |
| 4 | ACOG name | Written as "American College of Obstetricians and Gynecologists, Fellow" (official name) |
| 5 | Review typos (e.g., "extremely through") | Kept verbatim, as patient quotes |
| 6 | Sample quotes from the type-system doc ("I don't want you to just get through this decade…") | **Not used on the site** until Dr. Harrington confirms they're her words |
| 7 | "Membership" vs. "partnership" language | **Both are now on the site.** The home page says "A membership practice in the Denver metro area" (Saylor's copy, 30 Sep 2026); the Q&A page and the Expertise footer still describe a partnership model delivered inside concierge primary care practices. **Dr. Harrington should pick one frame** — a reader hitting both will not know whether they join her practice or their own practice brings her in |
| 8 | Offering descriptions | **Supplied by Dr. Harrington** (16 Sep 2026) and used verbatim |
| 9 | Announcement bar | Removed 30 Sep 2026, **restored 7 Oct 2026** with new copy (see §6, Header) |
| 10 | Home review carousel ("just the bold text") | The source doc had no bold excerpts, so each slide uses one short **verbatim** sentence from a review. Swap in preferred excerpts in `index.html` |
| 11 | Page headlines and short section intros not in the source doc (e.g., "Focused care for the transitions that matter") | Drafted in brand voice; edit freely |

---

## 10. Open tasks

| Owner | Task |
|---|---|
| Dev/Lauren | **After the Netlify site exists:** set `ADMIN_PASSWORD` in Site configuration → Environment variables. This is the /admin password — use a long random one, not a short shared word; the page lists subscriber names and emails |
| Dev/Lauren | Set `NETLIFY_API_TOKEN` (a personal access token) so /admin can read form submissions |
| Dev/Lauren | Set `RESEND_API_KEY` and `RESEND_FROM`, then redeploy — environment changes do not apply to existing deploys |
| Dev/Lauren | Verify theconciergegynecologist.com in Resend (DKIM/SPF) before the first real send |
| Lauren | Provide logo files (SVG preferred) to replace the text wordmark |
| Lauren | Review the stock photo and clip chosen for each slot and flag any that miss |
| Lauren | Decide whether to commission real photography of Dr. Harrington and partner practices to replace stock |
| Lauren | Review and approve offering descriptions |
| Lauren | "Sexual function" now reads **desire** rather than *libido* (7 Oct 2026, at her direction) — the one place her verbatim descriptions have been edited |
| Lauren | **"Become a patient" on `/dr-harrington/` opens the Subscribe panel**, not the inquiry form — Saylor's call, 30 Sep 2026. Her own Q&A answer to "How do I become a patient?" says to use Get in Touch instead, so the two routes disagree. Confirm which is right |
| Lauren | **Write, or approve, per-procedure copy.** The Expertise page now lists Endometrial biopsy, IUD insertion, Colposcopy & LEEP and Hysteroscopy separately, but her source text described them in one sentence — the four descriptions are cut from it rather than written for each |
| Lauren | **Pick one voice for the Q&A.** Four answers are third person about Dr. Harrington, four speak as her; a reader opening two in a row will notice. Both are her copy, so neither was changed |
| Lauren | **Answer the telehealth question** — *"Can I schedule a virtual visit, or does every appointment need to be in person?"* is the one Q&A held back, pending her actual policy |
| Lauren | **Two names for the same role.** The home page says "former Director of the **Female** Sexual Health Consultation Service at the University of Colorado"; her own bio on `/dr-harrington/` says "**Women's** Sexual Health Consultation Service". Both are her copy, so neither was changed — pick one and it gets applied in both places |
| Lauren | The home page band says "Stanford-trained **Menopause Certified Practitioner**"; every other page says "**Menopause Society** Certified Practitioner (MSCP)", which is the credential's formal name. Confirm which the home page should use |
| Lauren | Decide between "membership practice" and "partnership model" (see §9, row 7) — the home page and the Q&A page currently say different things |
| Dev | Crop or replace `images/approach/membership.jpg` if the yellow notebook at the bottom reads too saturated against the blush section |
| Lauren | Review the drafted welcome email copy in `netlify/functions/submission-created.js` and adjust the wording |
| Lauren | Create Netlify and Resend accounts using contact@theconciergegynecologist.com (GitHub done) |
| Dev | Connect repo to Netlify; enable form notifications to contact@theconciergegynecologist.com — steps in [docs/LAUNCH-GUIDE.md](docs/LAUNCH-GUIDE.md) |
| Dev | ~~Build Resend subscribe function~~ — done: `netlify/functions/submission-created.js` |
| Dev | ~~Replace every `.placeholder` block~~ — done: all pages use real photography |
| Dev | Add privacy policy page if analytics or subscriber email are enabled |
| Dev | **SEO/AEO:** build a page per area of expertise (`/expertise/perimenopause/` etc.), 600–900 words, with `MedicalProcedure` schema — highest-value item for both search and answer engines |
| Lauren | Clinically review the per-offering page copy before it publishes — medical accuracy outranks keywords |
| Dev | ~~Add FAQ sections with `FAQPage` schema~~ — done: `/questions/` ships ten Q&As with `FAQPage` JSON-LD. Still to add once written: referrals, what an MSCP is, hormone therapy after cancer |
| Dev | Extend `MedicalBusiness` schema (areaServed, medicalSpecialty, availableService); add `BreadcrumbList` and `dateModified` |
| Lauren | Decide on local search: set up a Google Business Profile as a service-area business, or accept that local results aren't a channel (there's no public clinic address by design) |
| Dev | Add `llms.txt` — a short plain-text summary of the practice for AI crawlers |
| Lauren/Dev | Consider a small article cadence (six pieces would outrank the current site for informational queries) |

---

## 11. SEO & AEO backlog

Audited 29 Sep 2026. Recorded here so the next person doesn't re-derive it.

**Already in place:** unique titles and meta descriptions within length limits on
every page, one `<h1>` each, canonicals, Open Graph and Twitter tags, a complete
`sitemap.xml`, `robots.txt` allowing crawl with `/admin` excluded, semantic
landmarks, real `alt` text, static pages that load fast, and zero accessibility
violations. Schema: `MedicalBusiness` (home) and `Person` (Dr. Harrington).

**The gaps, in priority order:**

1. **Content depth.** Page bodies run 30–346 words (In Their Words is 863, and that's
   patient quotes). Competing practices publish 1,500-word service pages. All ten
   offerings share one page, so each gets about two sentences — no page can rank for
   "menopause specialist Denver" on its own. A page per offering is the fix.
2. **Missing structured data.** No `MedicalProcedure`/`Service`, `FAQPage`,
   `BreadcrumbList`, or review markup.
3. **No local signals.** No address, phone, or `PostalAddress` — partly inherent, since
   care happens inside partner practices and there's no clinic address to publish. It
   does mean local-pack results are closed off without a Google Business Profile. Decide
   deliberately.
4. **Nothing aimed at answer engines.** No FAQ content, no question-shaped headings, no
   `llms.txt`. Note that the offering descriptions sit inside panels using the `hidden`
   attribute: indexable, but discounted against visible text — and that is exactly the
   copy an AI would otherwise quote. Per-offering pages solve this too.

**Deliberately not done:** review/`aggregateRating` schema on the patient testimonials.
Self-serving reviews on your own site aren't eligible for rich results, and marking them
up invites a manual action. They still carry E-E-A-T weight as plain text.
