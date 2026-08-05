import Image from 'next/image';
import SectionHead from './SectionHead';
import s from './home.module.css';

const USES = [
  { src: 'uses_wall_art', label: 'Wall art', note: 'Print at any size — the export is vector', w: 748, h: 808 },
  { src: 'uses_notebook', label: 'Stationery', note: 'Covers, endpapers, wrapping', w: 748, h: 808 },
  { src: 'uses_tshirt', label: 'Apparel', note: 'Screen print and DTG', w: 748, h: 808 },
  { src: 'uses_packaging', label: 'Packaging', note: 'Boxes, labels, tape, tissue', w: 748, h: 808 },
];

export default function Uses() {
  return (
    <section className={s.section} id="section-example-uses">
      <SectionHead
        index="04"
        title="Use it for just about anything"
        note="Exports are yours to use, commercially included. Vector SVG scales to a wall; PNG comes out at whatever pixel size you ask for."
      />

      <div className={s.useGrid}>
        {USES.map((use, i) => (
          <figure key={use.src} className={s.useItem}>
            <div className={s.useImage}>
              <Image
                src={`/images/${use.src}.jpg`}
                alt={use.label}
                width={use.w}
                height={use.h}
              />
            </div>
            <figcaption>
              <span className={s.useIndex}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className={s.useLabel}>{use.label}</span>
              <span className={s.useNote}>{use.note}</span>
            </figcaption>
          </figure>
        ))}

        <figure className={`${s.useItem} ${s.useWide}`}>
          <div className={s.useImage}>
            <Image
              src="/images/uses_devices.jpg"
              alt="Patterns used on websites and apps"
              width={779}
              height={421}
            />
          </div>
          <figcaption>
            <span className={s.useIndex}>05</span>
            <span className={s.useLabel}>Screens</span>
            <span className={s.useNote}>
              Or skip the export entirely: drop the React component in and let
              the pattern draw itself at whatever size the layout gives it.
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
