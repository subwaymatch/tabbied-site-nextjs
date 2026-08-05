import SectionHead from './SectionHead';
import s from './home.module.css';

const STEPS = [
  {
    n: '01',
    title: 'Pick a design',
    body: 'Every design in the gallery is generative: it draws a different composition each time it renders, so the one you keep is yours.',
  },
  {
    n: '02',
    title: 'Set the colours',
    body: 'Apply a palette from the library, or build your own and apply it across the whole gallery at once to see it on every design.',
  },
  {
    n: '03',
    title: 'Take it away',
    body: 'Export true vector SVG or a PNG at any size, or copy the React component and drop the live pattern straight into a page.',
  },
];

export default function HowItWorks() {
  return (
    <section className={s.section} id="section-how-it-works">
      <SectionHead
        index="01"
        title="How it works"
        note="Three steps, no account, nothing to install. The editor runs entirely in the browser — the patterns are CSS, drawn by css-doodle, not images fetched from a server."
      />

      <ol className={s.steps}>
        {STEPS.map((step) => (
          <li key={step.n}>
            <span className={s.stepNumber}>{step.n}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
