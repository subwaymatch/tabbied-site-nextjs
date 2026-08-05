import type { ReactNode } from 'react';
import s from './home.module.css';

/**
 * The home page's section header: a numbered title on the left, the note on
 * the right, sitting on the rule that opens the section. Every section uses it,
 * so the page reads as one numbered document rather than a stack of banners.
 */
export default function SectionHead({
  index,
  title,
  note,
  aside,
}: {
  index: string;
  title: ReactNode;
  note: ReactNode;
  /** Optional right-aligned meta (a count, a link) below the note. */
  aside?: ReactNode;
}) {
  return (
    <header className={s.sectionHead}>
      <div className={s.sectionHeadMain}>
        <span className={s.sectionIndex}>{index}</span>
        <h2 className={s.sectionTitle}>{title}</h2>
      </div>
      <div className={s.sectionHeadNote}>
        <p>{note}</p>
        {aside}
      </div>
    </header>
  );
}
