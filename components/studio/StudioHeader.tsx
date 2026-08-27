import Link from 'next/link';
import StudioSpark from 'components/main-page/StudioSpark';
import styles from './StudioHeader.module.css';

/**
 * Shared by both Studio screens: a back link on the left, the wordmark centred.
 * The three-column grid is what keeps "Studio" centred on the page rather than
 * centred on whatever is left over beside the back link.
 */
export default function StudioHeader({
  backHref,
  backLabel,
  title,
}: {
  backHref: string;
  backLabel: string;
  title?: string;
}) {
  return (
    <header className={styles.header}>
      <Link
        href={backHref}
        prefetch={false}
        className={styles.back}
        aria-label={backLabel}
      >
        <svg
          viewBox="0 0 24 24"
          width="17"
          height="17"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M14.5 5.5 8 12l6.5 6.5" />
        </svg>
      </Link>

      {title ? (
        <span className={styles.title}>{title}</span>
      ) : (
        <span className={styles.wordmark}>
          <StudioSpark size={11} />
          Studio
        </span>
      )}
    </header>
  );
}
