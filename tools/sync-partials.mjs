#!/usr/bin/env node
/**
 * sync-partials.mjs — copy shared markup into every page.
 *
 * WHY THIS EXISTS
 * ---------------
 * The site is plain static HTML with no build step: Netlify serves the files
 * exactly as committed. The header, footer, and Inquire panel are the same on
 * every page, so their source of truth lives in /partials and this script
 * copies them into each page between marker comments:
 *
 *     <!-- partial:header -->
 *     …replaced…
 *     <!-- /partial:header -->
 *
 * It also marks the current page's main-nav link with aria-current="page".
 *
 * HOW TO RUN
 * ----------
 *     node tools/sync-partials.mjs
 *
 * Run it after editing anything in /partials or adding a page, then commit
 * the partials and the regenerated pages together.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PARTIALS = ['header', 'footer', 'inquire-panel'];
const SKIP_DIRS = new Set(['.git', '.claude', '.netlify', 'node_modules', 'partials', 'tools', 'netlify', 'images', 'videos']);

function findPages(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return SKIP_DIRS.has(name) ? [] : findPages(path);
    return name.endsWith('.html') ? [path] : [];
  });
}

const partials = Object.fromEntries(
  PARTIALS.map((name) => [name, readFileSync(join(ROOT, 'partials', `${name}.html`), 'utf8').trim()]),
);

let updated = 0;
for (const page of findPages(ROOT)) {
  const original = readFileSync(page, 'utf8');
  const relPath = relative(ROOT, page).split(sep).join('/');
  const urlPath = '/' + relPath.replace(/(^|\/)index\.html$/, '$1'); // offerings/index.html -> /offerings/

  let html = original;
  for (const name of PARTIALS) {
    const pattern = new RegExp(`<!-- partial:${name} -->[\\s\\S]*?<!-- /partial:${name} -->`);
    if (!pattern.test(html)) continue;
    let markup = partials[name];
    if (name === 'header') {
      markup = markup.replaceAll(
        `class="site-nav__link" href="${urlPath}"`,
        `class="site-nav__link" href="${urlPath}" aria-current="page"`,
      );
    }
    html = html.replace(pattern, () => `<!-- partial:${name} -->\n${markup}\n<!-- /partial:${name} -->`);
  }

  if (html !== original) {
    writeFileSync(page, html);
    updated += 1;
    console.log(`updated ${relPath}`);
  }
}
console.log(`${updated} page(s) updated.`);
