import { TabbiedArtwork } from 'tabbied/react';
import { facetgrad } from 'tabbied/artworks';
import { Figure } from 'components/Figure';
import styles from './ledgerline.module.css';

export const metadata = {
  title: 'Ledgerline — Personal finance, minus the panic',
  description:
    'Ledgerline pulls your accounts, cards, and savings pots into one calm screen and explains what changed in plain words. Free for 30 days, no card required.',
};

const NAVY = '#0B1F3A';
const BLUE = '#3E8BFF';
const CYAN = '#3EECFF';
const ICE = '#97F4FF';
const MINT = '#9EFFD8';
const WHITE = '#FFFFFF';

const PROOF_QUOTES = [
  { quote: '“The first budgeting app my partner and I didn’t abandon by February.”', source: 'The Morning Ledger' },
  { quote: '“Refreshingly boring in exactly the right ways.”', source: 'Fernwood Finance Review' },
  { quote: '“Finally, an app that explains a bank fee like a human would.”', source: 'Pocketwise Weekly' },
];

const PRICING = [
  {
    name: 'Pocket',
    price: '$0',
    per: 'forever',
    blurb: 'For getting your bearings.',
    items: [
      'Connect up to 3 accounts',
      'Automatic categories',
      'Monthly summary email',
      'Export to CSV anytime',
    ],
    cta: 'Start with Pocket',
  },
  {
    name: 'Ledger',
    price: '$6',
    per: 'per month, or $60/year',
    blurb: 'The full picture, every day.',
    items: [
      'Unlimited accounts & cards',
      'Rollover budgets & savings pots',
      'Plain-words weekly digest',
      'Bill and subscription radar',
      'Priority support (real humans)',
    ],
    cta: 'Try Ledger free',
    featured: true,
  },
  {
    name: 'Household',
    price: '$10',
    per: 'per month, up to 5 people',
    blurb: 'One home, one honest number.',
    items: [
      'Everything in Ledger',
      'Shared wallets with private space',
      'Fair-split tracking for bills',
      'Kids’ pocket-money pots',
      'Household monthly review',
    ],
    cta: 'Try Household free',
  },
];

const FAQS = [
  {
    q: 'How does Ledgerline connect to my bank?',
    a: 'Through regulated open-banking connections that are strictly read-only. We can see balances and transactions so we can add them up for you — we can never move, hold, or touch your money. Connections re-confirm every 90 days, and you can revoke any of them in two taps.',
  },
  {
    q: 'Can Ledgerline move my money?',
    a: 'No, and that’s a feature. Ledgerline has no payment rails at all — there is no code path in the product that can initiate a transfer. Savings pots are labels on money that stays exactly where it already lives.',
  },
  {
    q: 'How does Ledgerline make money?',
    a: 'Subscriptions. That’s the whole model. We don’t sell your data, we don’t show ads, and we don’t take commissions for nudging you toward financial products. If you pay us $6 a month, we work for you and nobody else.',
  },
  {
    q: 'What happens to my data if I cancel?',
    a: 'You can export everything — transactions, categories, notes — as CSV before you go. Thirty days after you cancel, we delete your data from our production systems, and backups roll off within 90 days. No “are you sure” gauntlet, no dark patterns.',
  },
  {
    q: 'Can I use it with my partner?',
    a: 'Yes — that’s the Household plan. You each keep a private view of your own accounts, and choose exactly what to share into the joint picture. Shared wallets show who paid what; nobody sees anything they weren’t invited to see.',
  },
  {
    q: 'Is there really no card required for the trial?',
    a: 'Really. Thirty days, every feature, no card. If you do nothing at the end, you land softly on the free Pocket plan — we will never quietly start charging you.',
  },
];

const FOOTER_COLS = [
  {
    title: 'Product',
    links: ['Features', 'Pricing', 'What’s new', 'Status'],
  },
  {
    title: 'Company',
    links: ['About', 'The honest blog', 'Careers', 'Press kit'],
  },
  {
    title: 'Legal',
    links: ['Privacy policy', 'Terms of service', 'Security', 'Accessibility'],
  },
];

export default function LedgerlinePage() {
  return (
    <div className={styles.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..800&display=swap"
      />

      <header className={styles.header}>
        <div className={styles.headerBar}>
          <a href="#top" className={styles.logo}>
            <span className={styles.logoMark} aria-hidden="true" />
            Ledgerline
          </a>
          <nav aria-label="Primary" className={styles.headerNav}>
            <a href="#features">Features</a>
            <a href="#security">Security</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </nav>
          <a href="#cta" className={styles.headerCta}>
            Start free
          </a>
        </div>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ hero */}
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroPattern} aria-hidden="true">
            <TabbiedArtwork
              artwork={facetgrad}
              palette={[NAVY, BLUE, CYAN, ICE, MINT]}
              seed="ll-hero-21"
              fit="cover"
              coverRender={{ width: 1600, height: 1000 }}
              style={{ position: 'absolute', inset: 0, opacity: 0.9 }}
            />
          </div>
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <p className={styles.heroEyebrow}>Personal finance, minus the panic</p>
              <h1 id="hero-title">
                Know where every
                <br />
                dollar <span className={styles.heroAccent}>sleeps.</span>
              </h1>
              <p className={styles.heroSub}>
                Ledgerline pulls your accounts, cards, and savings into one calm screen — then
                explains what changed this week in plain words. No jargon, no guilt, no ads.
              </p>
              <div className={styles.heroButtons}>
                <a href="#pricing" className={styles.btnSolid}>
                  Start free for 30 days
                </a>
                <a href="#features" className={styles.btnOutline}>
                  See how it works
                </a>
              </div>
              <ul className={styles.heroChips}>
                <li>No card required</li>
                <li>Read-only bank connections</li>
                <li>4.8★ across app stores</li>
              </ul>
            </div>

            <div className={styles.heroStage}>
              <div className={styles.heroPhone}>
                <Figure
                  slug="ledger-phone-cutout"
                  cutout
                  alt="Clay-render smartphone standing upright with a blank screen"
                  priority
                />
              </div>
              <div className={`${styles.uiCard} ${styles.uiCardBalance}`} aria-hidden="true">
                <span className={styles.uiLabel}>Everyday · all accounts</span>
                <span className={styles.uiBalance}>$2,418.06</span>
                <span className={styles.uiDelta}>▲ $164 calmer than last week</span>
              </div>
              <div className={`${styles.uiCard} ${styles.uiCardBudget}`} aria-hidden="true">
                <span className={styles.uiLabel}>Groceries</span>
                <span className={styles.uiBudgetRow}>
                  <span className={styles.uiMeter}>
                    <span className={styles.uiMeterFill} />
                  </span>
                  <span className={styles.uiBudgetNums}>$312 / $400</span>
                </span>
              </div>
              <div className={`${styles.uiCard} ${styles.uiCardPot}`} aria-hidden="true">
                <span className={styles.uiLabel}>Rainy-day pot</span>
                <span className={styles.uiPotNums}>$1,850 → $3,000</span>
              </div>
              <div className={styles.heroCoins}>
                <Figure slug="ledger-coins-cutout" cutout alt="Clay-render stack of coins" />
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- social proof */}
        <section className={styles.proof} aria-label="What people say about Ledgerline">
          <p className={styles.proofStat}>
            <strong>241,000</strong> households keep their books with Ledgerline
          </p>
          <ul className={styles.proofRow}>
            {PROOF_QUOTES.map((item) => (
              <li key={item.source}>
                <blockquote>
                  <p>{item.quote}</p>
                  <cite>{item.source}</cite>
                </blockquote>
              </li>
            ))}
          </ul>
        </section>

        {/* -------------------------------------------------------- overview */}
        <section className={styles.overview} aria-labelledby="overview-title">
          <div className={styles.overviewCopy}>
            <h2 id="overview-title">A desk-tidy for your money</h2>
            <p>
              Most finance apps shout. Charts everywhere, red arrows, push notifications at
              11&nbsp;p.m. Ledgerline does the opposite: one screen, one honest total, and a short
              weekly note that reads like a friend explaining your money over coffee.
            </p>
          </div>
          <figure className={styles.overviewFigure}>
            <Figure
              slug="ledger-hero"
              alt="Clay-render desk scene with a laptop, notebook, coffee cup, and neatly stacked coins"
            />
            <figcaption>Everything on the desk, nothing under the rug.</figcaption>
          </figure>
        </section>

        {/* -------------------------------------------------------- features */}
        <section id="features" className={styles.features} aria-labelledby="features-title">
          <h2 id="features-title" className={styles.sectionTitle}>
            Four things we do <span className={styles.titleUnderline}>really well</span>
          </h2>

          <article className={styles.featureRow}>
            <div className={styles.featureArt}>
              <div className={styles.featureTile}>
                <div className={styles.featureTilePattern} aria-hidden="true">
                  <TabbiedArtwork
                    artwork={facetgrad}
                    palette={[ICE, BLUE, CYAN, WHITE]}
                    seed="ll-feat-coins"
                    fit="grid"
                    style={{ position: 'absolute', inset: 0, opacity: 0.85 }}
                  />
                </div>
                <Figure
                  slug="ledger-coins-cutout"
                  cutout
                  alt="Clay-render coin stacks of different heights"
                />
              </div>
            </div>
            <div className={styles.featureCopy}>
              <p className={styles.featureKicker}>One honest number</p>
              <h3>Every account, added up while you sleep</h3>
              <p>
                Checking, credit cards, savings, that dusty account from your first job —
                Ledgerline connects to 12,000+ banks and refreshes before you wake. You open the
                app to a single number that’s actually true.
              </p>
              <ul className={styles.featureList}>
                <li>Balances refreshed every morning by 6 a.m.</li>
                <li>Duplicate and pending transactions reconciled automatically</li>
                <li>Old account? Import up to 7 years of history</li>
              </ul>
            </div>
          </article>

          <article className={`${styles.featureRow} ${styles.featureRowFlip}`}>
            <div className={styles.featureArt}>
              <div className={`${styles.featureTile} ${styles.featureTileMint}`}>
                <div className={styles.featureTilePattern} aria-hidden="true">
                  <TabbiedArtwork
                    artwork={facetgrad}
                    palette={[MINT, BLUE, ICE, WHITE]}
                    seed="ll-feat-chart"
                    fit="grid"
                    style={{ position: 'absolute', inset: 0, opacity: 0.85 }}
                  />
                </div>
                <Figure
                  slug="ledger-chart-cutout"
                  cutout
                  alt="Clay-render rising bar chart with a small arrow"
                />
              </div>
            </div>
            <div className={styles.featureCopy}>
              <p className={styles.featureKicker}>Budgets, humanely</p>
              <h3>Budgets that bend, not break</h3>
              <p>
                Overspent on groceries by $22? Ledgerline quietly borrows it from next week
                instead of painting your screen red. Budgets roll over, adjust to real life,
                and never call you a failure for buying a birthday cake.
              </p>
              <ul className={styles.featureList}>
                <li>Rollover budgets smooth the lumpy weeks</li>
                <li>Categories learned from your history, editable in one tap</li>
                <li>“Safe to spend” shown right on the home screen</li>
              </ul>
            </div>
          </article>

          <div className={styles.featurePair}>
            <article className={styles.miniFeature}>
              <div className={styles.miniFeatureArt}>
                <Figure
                  slug="ledger-piggy-cutout"
                  cutout
                  alt="Clay-render piggy bank with a coin in its slot"
                />
              </div>
              <h3>Pots for the life stuff</h3>
              <p>
                Emergency fund, Japan trip, new brakes for the car — pots are labels on money
                that never leaves your own bank account. Watch each one fill; celebrate quietly.
              </p>
            </article>
            <article className={styles.miniFeature}>
              <div className={styles.miniFeatureArt}>
                <Figure
                  slug="ledger-wallet-cutout"
                  cutout
                  alt="Clay-render wallet with cards peeking out"
                />
              </div>
              <h3>Share a wallet, keep your privacy</h3>
              <p>
                Split rent, groceries, and the streaming pile-up without merging your entire
                financial life. Shared wallets show who covered what; your solo spending stays
                yours alone.
              </p>
            </article>
          </div>
        </section>

        {/* -------------------------------------------------------- security */}
        <section id="security" className={styles.security} aria-labelledby="security-title">
          <div className={styles.securityPattern} aria-hidden="true">
            <TabbiedArtwork
              artwork={facetgrad}
              palette={[NAVY, BLUE, MINT]}
              seed="ll-vault-08"
              fit="cover"
              style={{ position: 'absolute', inset: 0, opacity: 0.5 }}
            />
          </div>
          <div className={styles.securityInner}>
            <div className={styles.securityShield}>
              <Figure
                slug="ledger-shield-cutout"
                cutout
                alt="Clay-render shield with a padlock at its center"
              />
            </div>
            <div className={styles.securityCopy}>
              <p className={styles.securityKicker}>Security, in plain words</p>
              <h2 id="security-title">Your data lives in a vault. We just visit.</h2>
              <ul className={styles.securityList}>
                <li>
                  <strong>Read-only, always.</strong> Connections can look, never touch. Moving
                  money through Ledgerline is technically impossible, on purpose.
                </li>
                <li>
                  <strong>Encrypted twice over.</strong> AES-256 at rest, TLS 1.3 in transit,
                  credentials held by our regulated connection partners — never on our servers.
                </li>
                <li>
                  <strong>Audited by outsiders.</strong> SOC 2 Type II, renewed annually,
                  with independent penetration tests every quarter.
                </li>
                <li>
                  <strong>Deletable in one sitting.</strong> Export everything, then erase your
                  account from Settings. No support ticket, no retention tricks.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- pricing */}
        <section id="pricing" className={styles.pricing} aria-labelledby="pricing-title">
          <h2 id="pricing-title" className={styles.sectionTitle}>
            Pricing without an asterisk
          </h2>
          <p className={styles.pricingSub}>
            Every paid plan starts with 30 free days. No card up front, no quiet auto-charge —
            do nothing and you simply land on Pocket.
          </p>
          <div className={styles.planRow}>
            {PRICING.map((plan) => (
              <article
                key={plan.name}
                className={plan.featured ? `${styles.plan} ${styles.planFeatured}` : styles.plan}
              >
                {plan.featured && <p className={styles.planFlag}>Most popular</p>}
                <h3>{plan.name}</h3>
                <p className={styles.planPrice}>
                  {plan.price}
                  <span>{plan.per}</span>
                </p>
                <p className={styles.planBlurb}>{plan.blurb}</p>
                <ul>
                  {plan.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <a href="#cta" className={styles.planCta}>
                  {plan.cta}
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------- faq */}
        <section id="faq" className={styles.faq} aria-labelledby="faq-title">
          <h2 id="faq-title" className={styles.sectionTitle}>
            Fair questions
          </h2>
          <div className={styles.faqList}>
            {FAQS.map((item) => (
              <details key={item.q} className={styles.faqItem}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------- final CTA */}
        <section id="cta" className={styles.finalCta} aria-labelledby="cta-title">
          <div className={styles.finalCtaPattern} aria-hidden="true">
            <TabbiedArtwork
              artwork={facetgrad}
              palette={[NAVY, CYAN, BLUE, ICE, MINT]}
              seed="ll-cta-14"
              fit="cover"
              style={{ position: 'absolute', inset: 0, opacity: 0.85 }}
            />
          </div>
          <div className={styles.finalCtaInner}>
            <h2 id="cta-title">Give your money a quiet place to make sense</h2>
            <p>Thirty days free. Two minutes to connect your first account. Zero jargon after that.</p>
            <a href="#top" className={styles.btnBright}>
              Create your free account
            </a>
            <p className={styles.finalCtaSmall}>iOS · Android · Web — one subscription covers all three.</p>
          </div>
        </section>
      </main>

      {/* -------------------------------------------------------------- footer */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <p className={styles.footerLogo}>
              <span className={styles.logoMark} aria-hidden="true" />
              Ledgerline
            </p>
            <p className={styles.footerTag}>Personal finance, minus the panic.</p>
          </div>
          {FOOTER_COLS.map((col) => (
            <nav key={col.title} aria-label={`Footer: ${col.title}`} className={styles.footerCol}>
              <h3>{col.title}</h3>
              <ul>
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#top">{link}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className={styles.footerLegal}>
          <p>
            © 2026 Ledgerline Labs, Inc. Ledgerline is a fictional product. It is not a bank;
            plain-words summaries are not financial advice, just uncommon decency.
          </p>
          <p className={styles.footerCredit}>
            Facet patterns by{' '}
            <a href="https://tabbied.com" rel="noopener">
              Tabbied
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
