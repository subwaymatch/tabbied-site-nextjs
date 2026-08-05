import Link from 'next/link';
import s from './home.module.css';

export default function ClosingCta({ designCount }: { designCount: number }) {
  return (
    <section className={s.cta}>
      <p className={s.ctaKicker}>Ready when you are</p>
      <h2 className={s.ctaType}>
        <span>Create your design</span> <span>in under a minute</span>
      </h2>
      <div className={s.ctaFoot}>
        <Link href="/patterns/" className={s.ctaButton} prefetch={false}>
          Make your art
          <span aria-hidden="true">→</span>
        </Link>
        <p>
          {designCount} designs waiting. Nothing to install, nothing to sign up
          for, and every export is free to use.
        </p>
      </div>
    </section>
  );
}
