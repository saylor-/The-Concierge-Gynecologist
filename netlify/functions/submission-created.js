/**
 * submission-created — fires automatically whenever a Netlify form is
 * submitted. Sends the welcome email for the "updates" (Stay in touch) form
 * through Resend, and ignores every other form.
 *
 * REQUIRED ENVIRONMENT VARIABLES
 *   RESEND_API_KEY   from resend.com → API Keys
 *   RESEND_FROM      e.g. "The Concierge Gynecologist <contact@theconciergegynecologist.com>"
 *                    The domain must be verified in Resend first.
 *
 * Event-triggered functions use the classic handler signature.
 */

exports.handler = async (event) => {
  let payload = {};
  try { payload = JSON.parse(event.body).payload || {}; } catch { return { statusCode: 400, body: 'Bad payload' }; }

  const formName = payload.form_name;
  if (formName !== 'updates') return { statusCode: 200, body: `Ignored form: ${formName}` };

  const email = payload.data?.email;
  const name = (payload.data?.name || '').trim();
  if (!email) return { statusCode: 200, body: 'No email address on submission' };

  const { RESEND_API_KEY, RESEND_FROM } = process.env;
  if (!RESEND_API_KEY || !RESEND_FROM) {
    console.error('Resend is not configured: set RESEND_API_KEY and RESEND_FROM');
    return { statusCode: 500, body: 'Resend not configured' };
  }

  const greeting = name ? `Hello ${name.split(' ')[0]},` : 'Hello,';
  const html = `
    <div style="font-family:Georgia,serif;color:#1f1711;max-width:520px;line-height:1.7">
      <p style="font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#716862">
        The Concierge Gynecologist
      </p>
      <p>${greeting}</p>
      <p>Thank you for signing up. You'll hear from us occasionally with new
         partnerships, availability, and practice news &mdash; nothing more.</p>
      <p>If you have a question in the meantime, simply reply to this note.</p>
      <p style="margin-top:28px">Warmly,<br>Lauren Harrington, MD</p>
      <p style="font-size:12px;color:#716862;margin-top:32px">
        This message is for general information and is not medical advice.
        In an emergency, call 911.
      </p>
    </div>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: [email],
      subject: 'Welcome — The Concierge Gynecologist',
      html,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error('Resend failed', res.status, detail);
    return { statusCode: 502, body: `Resend error ${res.status}` };
  }
  return { statusCode: 200, body: `Welcome email sent to ${email}` };
};
