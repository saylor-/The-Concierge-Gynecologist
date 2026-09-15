# Project instructions

- Read `BRAND-GUIDE.md` before any change. It is the source of truth for colors, type, components, page content, and conventions.
- Plain static HTML/CSS/JS, no build step. Each page is `<slug>/index.html`.
- Header, footer, and Inquire panel live in `partials/`. Never edit them inside a page; edit the partial and run `node tools/sync-partials.mjs`.
- Use CSS tokens from the top of `styles.css`; never hard-code hex values.
- Preview with `npx serve .` (config in `.claude/launch.json`).
