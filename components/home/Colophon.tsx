import Image from 'next/image';
import SectionHead from './SectionHead';
import s from './home.module.css';

export default function Colophon({
  designCount,
  paletteCount,
}: {
  designCount: number;
  paletteCount: number;
}) {
  const SPECS: [string, string][] = [
    ['Engine', 'css-doodle, a web component by Chuan Yuan'],
    ['Designs', `${designCount} presets, each with its own options`],
    ['Palettes', `${paletteCount} in the library, plus your own`],
    ['Export', 'Vector SVG, PNG, or the React component'],
    ['Package', 'npm install tabbied'],
    ['Licence', 'MIT — open source, commercial use included'],
  ];

  return (
    <section className={s.section}>
      <SectionHead
        index="05"
        title="Built by pattern geeks"
        note="Tabbied started as a tool for making wall art and turned into a pattern engine. It stays free, and everything it draws is yours."
      />

      <div className={s.colophon}>
        <div className={s.colophonImage}>
          <Image
            src="/images/built_by_people.png"
            alt="Sy Hong and Ye Joo Park"
            width={688}
            height={661}
          />
        </div>

        <div className={s.colophonText}>
          <p>
            We aim to build simple design tools that energize your creativity.
            Tabbied was initially developed as a tool for making wall art, but we
            quickly realized it could be used for a great deal more. We are very
            excited to see what you make with it.
          </p>
          <p>
            Special thanks to <a href="http://yuanchuan.dev/">Chuan Yuan</a>, the
            creator of <a href="https://css-doodle.com/">css-doodle</a>, the web
            component that draws every pattern here — and to everyone supporting
            both projects. You keep us making.
          </p>
          <p className={s.signature}>
            <a href="https://www.syunghong.com/">Sy</a> &amp;{' '}
            <a href="https://www.behance.net/yejoopark">Park</a>
          </p>
        </div>

        <dl className={s.specs}>
          {SPECS.map(([term, value]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
