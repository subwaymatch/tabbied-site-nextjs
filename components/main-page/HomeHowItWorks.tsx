'use client';

import { useEffect, useState } from 'react';
import useMediaQuery from 'lib/useMediaQuery';
import styles from './HomeHowItWorks.module.css';

// Three steps, each illustrated by a small live panel rather than a screenshot:
// the palette picker moves, the frequency slider travels, the export button
// fills. Everything here is decoration for the copy beside it, so the panels are
// hidden from assistive technology and stop entirely under reduced motion.

/** The four palettes the picker steps through, with the swatches each shows. */
const PALETTE_PILLS = [
  { label: 'Mint', swatches: ['oklch(0.9 0.06 165)', 'oklch(0.3 0.08 165)', '#3eecff'] },
  { label: 'Sunset', swatches: ['oklch(0.7 0.01 260)', 'oklch(0.75 0.1 15)', 'oklch(0.85 0.1 80)'] },
  { label: 'Ocean', swatches: ['oklch(0.5 0.05 240)', 'oklch(0.6 0.06 220)', 'oklch(0.75 0.06 190)'] },
  { label: 'Bauhaus', swatches: ['oklch(0.9 0.03 80)', 'oklch(0.75 0.08 30)', 'oklch(0.6 0.08 260)'] },
];

const FREQUENCY_STEPS = [0.2, 0.4, 0.6, 0.8, 1.0];

const PALETTE_INTERVAL = 3600;
const FREQUENCY_INTERVAL = 5200;

function PalettePanel({ activeIdx }: { activeIdx: number }) {
  return (
    <div className={styles.panelBody}>
      <div className={styles.pillGrid}>
        {/* One highlight slides between the four cells instead of four
            backgrounds cross-fading, which is what makes it read as a choice. */}
        <div
          className={styles.pillHighlight}
          style={{
            transform: `translate(${activeIdx % 2 ? 'calc(100% + 10px)' : '0'}, ${
              activeIdx > 1 ? 'calc(100% + 10px)' : '0'
            })`,
          }}
        />
        {PALETTE_PILLS.map((pill, i) => (
          <div key={pill.label} className={styles.pill}>
            <span className={styles.swatches}>
              {pill.swatches.map((color) => (
                <span key={color} style={{ background: color }} />
              ))}
            </span>
            <span data-active={i === activeIdx || undefined}>{pill.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FrequencyPanel({ value }: { value: number }) {
  return (
    <div className={`${styles.panelBody} ${styles.frequencyBody}`}>
      <div className={styles.frequencyLabel}>
        <span>Frequency</span>
        <span>{value.toFixed(1)}</span>
      </div>
      <div className={styles.track}>
        <span className={styles.knob} style={{ left: `${value * 100}%` }} />
      </div>
      <div className={styles.chips}>
        <span>4×4</span>
        <span data-active>9×9</span>
        <span>12×12</span>
      </div>
    </div>
  );
}

function DownloadPanel() {
  return (
    <div className={`${styles.panelBody} ${styles.downloadBody}`}>
      <span className={styles.formats}>PNG · SVG · PDF</span>
      <span className={styles.downloadButton}>
        <span className={styles.gauge} />
        <span>Download</span>
      </span>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.panel} aria-hidden="true">
      <div className={styles.panelChrome}>
        <span />
        <span />
        <span />
      </div>
      {children}
    </div>
  );
}

export default function HomeHowItWorks() {
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [paletteIdx, setPaletteIdx] = useState(0);
  const [frequencyIdx, setFrequencyIdx] = useState(FREQUENCY_STEPS.length - 1);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const paletteTimer = setInterval(() => {
      setPaletteIdx((i) => (i + 1) % PALETTE_PILLS.length);
    }, PALETTE_INTERVAL);

    const frequencyTimer = setInterval(() => {
      // Drawn outside the updater so it stays a pure function of its argument.
      const next = Math.floor(Math.random() * FREQUENCY_STEPS.length);

      // Never land on the value already showing, or the slider sits still for
      // two full beats.
      setFrequencyIdx((current) =>
        next === current ? (next + 1) % FREQUENCY_STEPS.length : next
      );
    }, FREQUENCY_INTERVAL);

    return () => {
      clearInterval(paletteTimer);
      clearInterval(frequencyTimer);
    };
  }, [reduceMotion]);

  const steps = [
    {
      title: 'Pick colors',
      body: 'Choose one of our many curated palettes or create your own.',
      panel: <PalettePanel activeIdx={paletteIdx} />,
    },
    {
      title: 'Customize it live',
      body: "Adjust colors, frequency, and density until it's exactly yours.",
      panel: <FrequencyPanel value={FREQUENCY_STEPS[frequencyIdx]} />,
    },
    {
      title: 'Download for free',
      body: 'Export high-res files ready for web, print, or product.',
      panel: <DownloadPanel />,
    },
  ];

  return (
    <section className={styles.section} aria-label="How it works">
      <div className={styles.inner}>
        <ol className={styles.steps}>
          {steps.map((step, i) => (
            // Even-numbered steps put the panel on the right; the copy and the
            // panel swap sides down the column.
            <li key={step.title} className={styles.row} data-flipped={i % 2 === 1 || undefined}>
              <Panel>{step.panel}</Panel>
              <div className={styles.text}>
                <span className={styles.stepNumber}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepBody}>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
