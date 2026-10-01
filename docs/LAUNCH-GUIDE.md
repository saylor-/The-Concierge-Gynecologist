# Launch guide

Everything needed to take the site from this repository to live on
theconciergegynecologist.com, with the welcome email working.

Do the steps in this order — each one depends on the one before it.

| Step | What it does | Roughly |
|---|---|---|
| 1 | Connect GitHub → Netlify (site goes live on a temporary address) | 10 min |
| 2 | Point the Wix domain at Netlify | 20 min + DNS wait |
| 3 | Connect Resend and test the welcome email | 30 min + DNS wait |
| 4 | Turn on the admin page at /admin | 5 min |

A note on who does what: whoever connects the repo in step 1 must be able to
administer it on GitHub. If the repo now belongs to Dr. Harrington, she should
do step 1 (or add you back as a collaborator and do it herself), then invite
you to the Netlify team.

---

## 1. Connect GitHub to Netlify

1. Sign in at [app.netlify.com](https://app.netlify.com) — use **contact@theconciergegynecologist.com** so the account belongs to the practice.
2. **Add new site → Import an existing project → Deploy with GitHub.**
3. Authorise Netlify for GitHub when prompted. If the repository doesn't appear in the list, click **Configure the Netlify app on GitHub** and grant access to `The-Concierge-Gynecologist` specifically. Only the repo owner can approve this.
4. Pick the repository, then set:
   - **Branch to deploy:** `main`
   - **Build command:** *leave empty*
   - **Publish directory:** `.` (a single dot)
   - **Functions directory:** `netlify/functions` (already set by `netlify.toml`)
5. **Deploy site.** The first build takes under a minute — there's nothing to compile.
6. You'll get an address like `graceful-pastry-123456.netlify.app`. Open it and click through every page.
7. Rename it to something recognisable: **Site configuration → General → Site details → Change site name** → `concierge-gynecologist`.

**Turn on form notifications** (so inquiries reach the inbox):

**Site configuration → Forms → Form notifications → Add notification → Email notification.**
Add one for the `inquiry` form and one for `updates`, both to **contact@theconciergegynecologist.com**.

You should see both forms listed automatically after the first deploy, because Netlify detects the `data-netlify="true"` attribute in the HTML.

---

## 2. Point the Wix domain at Netlify

The domain is registered at Wix. You have two options; **Option A is simpler and is what I'd choose.**

### First: free the domain
If the domain is currently connected to a Wix site, disconnect it:
**Wix dashboard → Domains → (your domain) → Disconnect from site.** Otherwise Wix keeps serving its own pages.

### Option A — let Netlify run the DNS (recommended)

1. In Netlify: **Domain management → Add a domain** → enter `theconciergegynecologist.com` → **Verify → Add domain.**
2. Netlify shows four nameservers, e.g.
   ```
   dns1.p03.nsone.net
   dns2.p03.nsone.net
   dns3.p03.nsone.net
   dns4.p03.nsone.net
   ```
   Copy the four it gives you — they differ per account.
3. In Wix: **Domains → (your domain) → Advanced → Edit name servers → Use external nameservers.** Paste all four, save.
4. Wait for propagation — usually 15 minutes to a few hours, occasionally 24.
5. Back in Netlify, the domain shows **Netlify DNS**, and HTTPS is issued automatically (Let's Encrypt). Confirm under **Domain management → HTTPS** that the certificate is active.

Netlify then handles both `theconciergegynecologist.com` and `www.`, redirecting one to the other.

### Option B — keep DNS at Wix

Use this only if other services depend on Wix DNS records. In **Wix → Domains → Advanced → Edit DNS records**:

| Type | Host | Points to |
|---|---|---|
| A | `@` | `75.2.60.5` |
| CNAME | `www` | `<your-site-name>.netlify.app` |

Then in Netlify, **Domain management → Add domain** and follow the external-DNS prompts. Note that Wix's DNS editor won't let you ALIAS the apex, so the A record above is the only way to serve the bare domain — and if Netlify ever changes that IP you'd have to update it by hand. This is why Option A is the safer default.

### Check it worked
```bash
dig +short theconciergegynecologist.com
dig +short www.theconciergegynecologist.com
```
Then open the site and confirm the padlock appears.

---

## 3. Connect Resend and test the welcome email

The welcome email is already written and wired up — `netlify/functions/submission-created.js`
fires automatically whenever someone submits the **Stay in touch** form. It just needs credentials.

### 3a. Verify the domain in Resend
1. Sign up at [resend.com](https://resend.com) with **contact@theconciergegynecologist.com**.
2. **Domains → Add Domain** → `theconciergegynecologist.com`.
3. Resend shows DNS records to add — typically a DKIM `TXT`, an SPF `TXT`, and sometimes a `MX` for bounce handling.
4. Add them where your DNS now lives:
   - **Option A above:** Netlify → **Domain management → DNS records → Add new record.**
   - **Option B above:** Wix → **Domains → Advanced → Edit DNS records.**
5. Press **Verify** in Resend. This is usually minutes but can take an hour.

Until the domain is verified, Resend will only send to your own address — which is still enough to test.

### 3b. Create the API key
**Resend → API Keys → Create API Key**, permission **Sending access**. Copy it now; it's shown once.

### 3c. Add the credentials to Netlify
**Site configuration → Environment variables → Add a variable**, twice:

| Key | Value |
|---|---|
| `RESEND_API_KEY` | the key you just copied |
| `RESEND_FROM` | `The Concierge Gynecologist <contact@theconciergegynecologist.com>` |

The `RESEND_FROM` address must be at the verified domain, or Resend rejects the send.

Then **Deploys → Trigger deploy → Deploy site** so the functions pick up the new variables. Environment changes do *not* apply to existing deploys.

### 3d. Test it
1. Go to **theconciergegynecologist.com/stay-in-touch/** and sign up with your own address.
2. Check the inbox — the welcome email should arrive within seconds.
3. If nothing arrives, look at **Netlify → Logs → Functions → submission-created**. That log tells you which of these it is:
   - `Resend not configured` → the environment variables are missing, or you didn't redeploy.
   - `Resend error 403` → the domain isn't verified yet, or `RESEND_FROM` doesn't match it.
   - `Ignored form: inquiry` → normal; the welcome email only fires for the Stay in touch form.
   - No log at all → the form submission didn't reach Netlify. Check **Forms** for the entry.

To change the wording of the email, edit the `html` block in
`netlify/functions/submission-created.js` and push.

---

## 4. Turn on the admin page

`/admin` shows the email list, inquiries, and a CSV export. It's protected by a
password checked on the server, so the password is never sent to the browser.

1. Create a Netlify personal access token: **User settings → Applications → Personal access tokens → New access token.** Copy it.
2. **Site configuration → Environment variables**, add two more:

| Key | Value |
|---|---|
| `ADMIN_PASSWORD` | a password you choose — see the warning below |
| `NETLIFY_API_TOKEN` | the token from step 1 |

3. Redeploy (**Deploys → Trigger deploy**).
4. Visit **theconciergegynecologist.com/admin** and sign in.

> **On the password.** This page lists subscriber names and email addresses, so
> treat it as it as patient-adjacent data. A short shared password like `lauren25` can be
> guessed quickly. Use a long random one from a password manager, and change it
> if anyone who's had it stops working on the site. If stronger protection is
> wanted later, Netlify's own password protection or single sign-on is the next
> step up.

Page-view analytics aren't included — the site collects none. If Dr. Harrington
wants traffic numbers, the two clean options are **Netlify Analytics** (server
side, no cookies, ~$9/month) or **Plausible**/**Fathom**. None of them need a
cookie banner, unlike Google Analytics.

---

## Afterwards

- Every push to `main` deploys automatically; there's nothing to run by hand.
- Preview a change safely by opening a pull request — Netlify builds a preview URL for it.
- Netlify keeps every deploy, so **Deploys → (an older one) → Publish deploy** is a one-click rollback.
