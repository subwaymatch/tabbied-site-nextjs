import SiteHeader from 'components/site/SiteHeader';
import SiteFooter from 'components/site/SiteFooter';
import HomeHero from 'components/home/HomeHero';
import HowItWorks from 'components/home/HowItWorks';
import PatternIndex from 'components/home/PatternIndex';
import TemplateShowcase from 'components/home/TemplateShowcase';
import Uses from 'components/home/Uses';
import Colophon from 'components/home/Colophon';
import ClosingCta from 'components/home/ClosingCta';
import { getGalleryItems } from 'lib/pattern';
import { PALETTE_LIBRARY } from 'lib/paletteLibrary';
import { TEMPLATE_SITES } from 'components/template/templateData';
import { NEW_TEMPLATE_SITES } from 'lib/templateSites';
import s from 'components/home/home.module.css';

// Every count on the page is derived, never written out, so adding a design, a
// palette or a template site can't leave a stale number behind.
export default async function Home() {
  const designCount = (await getGalleryItems()).length;
  const paletteCount = PALETTE_LIBRARY.length;
  const templateCount = TEMPLATE_SITES.length + NEW_TEMPLATE_SITES.length;

  return (
    <div className={s.page}>
      <SiteHeader />

      <main>
        <HomeHero
          designCount={designCount}
          paletteCount={paletteCount}
          templateCount={templateCount}
        />

        <HowItWorks />

        <PatternIndex />

        <TemplateShowcase />

        <Uses />

        <Colophon designCount={designCount} paletteCount={paletteCount} />

        <ClosingCta designCount={designCount} />
      </main>

      <SiteFooter />
    </div>
  );
}
