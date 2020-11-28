import Layout from 'components/common/Layout';
import dynamic from 'next/dynamic';
import MainHeader from 'components/main-page/MainHeader';
import HowItWorks from 'components/main-page/HowItWorks';
import BrowseArtwork from 'components/main-page/BrowseArtwork';
import ExampleUses from 'components/main-page/ExampleUses';
import BuiltBy from 'components/main-page/BuiltBy';
import MakeYourArt from 'components/main-page/MakeYourArt';
import Footer from 'components/Footer';

const Hero = dynamic(() => import('components/main-page/Hero'), {
  ssr: false,
});

export default function Home() {
  return (
    <Layout>
      <MainHeader />

      <Hero />

      <HowItWorks />

      <BrowseArtwork />

      <ExampleUses />

      <BuiltBy />

      <MakeYourArt />

      <Footer />
    </Layout>
  );
}
