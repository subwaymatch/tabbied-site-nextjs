import MainHeader from 'components/main-page/MainHeader';
import MainHero from 'components/main-page/Hero';
import HowItWorksSection from 'components/main-page/HowItWorks';
import BrowsePattern from 'components/main-page/BrowsePattern';
import ExampleUses from 'components/main-page/ExampleUses';
import BuiltBy from 'components/main-page/BuiltBy';
import MakeYourArt from 'components/main-page/MakeYourArt';
import Footer from 'components/Footer';

export default function Home() {
  return (
    <>
      <MainHeader />

      <MainHero />

      <HowItWorksSection />

      <BrowsePattern />

      <ExampleUses />

      <BuiltBy />

      <MakeYourArt />

      <Footer />
    </>
  );
}
