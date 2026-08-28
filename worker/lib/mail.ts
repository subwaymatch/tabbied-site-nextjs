import type { Env } from '../env';
import { isDev } from '../env';

// Transactional mail, behind one function so better-auth's hooks never learn
// which provider is in use.
//
// With no RESEND_API_KEY the message is written to KV instead of sent. That is
// not a stub for its own sake: it is how the e2e suite reads a verification
// link back without a mail provider, and how a developer verifies an account
// offline. It is deliberately confined to the no-key path, so production either
// sends or fails loudly.

const MAIL_TTL_SECONDS = 900;

export const mailKey = (email: string) => `mail:${email.toLowerCase()}`;

export type Mail = { to: string; subject: string; url: string; text: string };

export async function sendMail(env: Env, mail: Mail): Promise<void> {
  if (!env.RESEND_API_KEY) {
    if (!isDev(env)) {
      // Production with no provider is a misconfiguration, not a fallback: a
      // silently-swallowed verification mail strands the account.
      throw new Error('RESEND_API_KEY is not set');
    }

    await env.KV.put(mailKey(mail.to), JSON.stringify(mail), {
      expirationTtl: MAIL_TTL_SECONDS,
    });
    console.log(`[mail:dev] ${mail.subject} → ${mail.to}\n  ${mail.url}`);
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Tabbied <hello@tabbied.com>',
      to: mail.to,
      subject: mail.subject,
      text: mail.text,
    }),
  });

  if (!response.ok) {
    throw new Error(`mail send failed: ${response.status}`);
  }
}
