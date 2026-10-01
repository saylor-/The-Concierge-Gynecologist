/**
 * admin-data — data source for /admin/.
 *
 * WHY A FUNCTION AND NOT PLAIN JS
 * -------------------------------
 * This is a static site, so anything shipped to the browser is readable by
 * anyone (View Source). A password checked in page JavaScript would be public
 * and the data it guards — subscriber names and email addresses — would be
 * one fetch away. So the password lives here, as an environment variable, and
 * the browser only ever sends a guess.
 *
 * REQUIRED ENVIRONMENT VARIABLES (Netlify → Site configuration → Environment)
 *   ADMIN_PASSWORD     the password for /admin/
 *   NETLIFY_API_TOKEN  personal access token, used to read form submissions
 *   SITE_ID            supplied automatically by Netlify
 */

const API = 'https://api.netlify.com/api/v1';

/** Length-independent comparison, so timing can't be used to guess the password. */
function sameSecret(a = '', b = '') {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const len = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < len; i++) diff |= a.charCodeAt(i % (a.length || 1)) ^ b.charCodeAt(i % (b.length || 1));
  return diff === 0;
}

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

async function netlify(path, token) {
  const res = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Netlify API ${res.status} on ${path}`);
  return res.json();
}

/** Submissions come back paginated; walk up to 5 pages (500 entries). */
async function allSubmissions(formId, token) {
  const out = [];
  for (let page = 1; page <= 5; page++) {
    const batch = await netlify(`/forms/${formId}/submissions?per_page=100&page=${page}`, token);
    out.push(...batch);
    if (batch.length < 100) break;
  }
  return out;
}

const field = (s, ...names) => {
  for (const n of names) {
    const v = s.data?.[n];
    if (v) return v;
  }
  return '';
};

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const { ADMIN_PASSWORD, NETLIFY_API_TOKEN, SITE_ID } = process.env;
  if (!ADMIN_PASSWORD) return json({ error: 'ADMIN_PASSWORD is not set on this site.' }, 500);

  let body = {};
  try { body = await req.json(); } catch { /* fall through to 401 */ }

  if (!sameSecret(body.password, ADMIN_PASSWORD)) {
    await new Promise((r) => setTimeout(r, 600)); // blunt the brute-force edge
    return json({ error: 'Incorrect password.' }, 401);
  }

  if (!NETLIFY_API_TOKEN || !SITE_ID) {
    return json({ error: 'NETLIFY_API_TOKEN or SITE_ID is missing. See netlify/functions/admin-data.mjs.' }, 500);
  }

  try {
    const [site, forms] = await Promise.all([
      netlify(`/sites/${SITE_ID}`, NETLIFY_API_TOKEN),
      netlify(`/sites/${SITE_ID}/forms`, NETLIFY_API_TOKEN),
    ]);

    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const group = async (formName) => {
      const form = forms.find((f) => f.name === formName);
      if (!form) return { total: 0, last30: 0, entries: [] };
      const subs = await allSubmissions(form.id, NETLIFY_API_TOKEN);
      return {
        total: subs.length,
        last30: subs.filter((s) => new Date(s.created_at).getTime() > thirtyDaysAgo).length,
        entries: subs.map((s) => ({
          name: field(s, 'name', 'first-name') + (s.data?.['last-name'] ? ` ${s.data['last-name']}` : ''),
          email: field(s, 'email'),
          phone: field(s, 'phone'),
          message: field(s, 'message'),
          optIn: field(s, 'updates-opt-in') === 'yes',
          date: s.created_at,
        })),
      };
    };

    const [updates, inquiry] = await Promise.all([group('updates'), group('inquiry')]);

    return json({
      site: {
        name: site.name,
        url: site.ssl_url || site.url,
        lastPublished: site.published_deploy?.published_at || null,
        branch: site.build_settings?.repo_branch || 'main',
      },
      subscribers: updates,
      inquiries: inquiry,
      // People who ticked the opt-in box on an inquiry are also on the list
      optInCount: inquiry.entries.filter((e) => e.optIn).length,
    });
  } catch (err) {
    return json({ error: String(err.message || err) }, 502);
  }
};
