'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import StudioHeader from 'components/studio/StudioHeader';
import { signIn, signUp } from 'lib/authClient';
import styles from './AuthForm.module.css';

// Sign-in and sign-up are the same form with two labels and one extra field,
// so they are one component: the states that matter (pending, error, "check
// your mail") are identical, and keeping them together is what stops the two
// pages drifting apart.

type Mode = 'sign-in' | 'sign-up';

const COPY = {
  'sign-in': {
    title: 'Sign in',
    lede: 'Studio generations are tied to an account, so your results are yours to come back to.',
    submit: 'Sign in',
    swapText: 'No account yet?',
    swapLabel: 'Create one',
    swapHref: '/sign-up',
  },
  'sign-up': {
    title: 'Create an account',
    lede: 'You need one to generate with AI. Browsing patterns, templates and library matches never asks for it.',
    submit: 'Create account',
    swapText: 'Already have one?',
    swapLabel: 'Sign in',
    swapHref: '/sign-in',
  },
} as const;

/** Where to land afterwards. Same-origin paths only — never an open redirect. */
function safeNext(raw: string | null): string {
  return raw && raw.startsWith('/') && !raw.startsWith('//') ? raw : '/studio';
}

export default function AuthForm({ mode }: { mode: Mode }) {
  const copy = COPY[mode];
  const router = useRouter();
  const next = safeNext(useSearchParams().get('next'));

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const result =
      mode === 'sign-up'
        ? await signUp.email({ name, email, password })
        : await signIn.email({ email, password });

    setPending(false);

    if (result.error) {
      setError(result.error.message ?? 'That did not work. Try again.');
      return;
    }

    // A new account has no session until the address is confirmed, so there is
    // nowhere to send them yet — say so rather than bouncing to a page that
    // will tell them they are signed out.
    if (mode === 'sign-up') {
      setSent(true);
      return;
    }

    router.push(next);
  }

  if (sent) {
    return (
      <div className={styles.form}>
        <h1 className={styles.title}>Check your email</h1>
        <p className={styles.lede}>
          We sent a confirmation link to <strong>{email}</strong>. Follow it and
          you&rsquo;ll be signed in.
        </p>
        <p className={styles.swap}>
          <Link href="/studio">Back to Studio</Link>
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <h1 className={styles.title}>{copy.title}</h1>
      <p className={styles.lede}>{copy.lede}</p>

      {mode === 'sign-up' ? (
        <label className={styles.field}>
          <span>Name</span>
          <input
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
      ) : null}

      <label className={styles.field}>
        <span>Email</span>
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>

      <label className={styles.field}>
        <span>Password</span>
        <input
          type="password"
          autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? 'One moment…' : copy.submit}
      </button>

      <p className={styles.swap}>
        {copy.swapText} <Link href={copy.swapHref}>{copy.swapLabel}</Link>
      </p>
    </form>
  );
}

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StudioHeader backHref="/" backLabel="Back to the homepage" title="Account" />
      {children}
    </>
  );
}
