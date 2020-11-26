import Head from 'next/head';
import dynamic from 'next/dynamic';
import MainHeader from 'components/main-page/MainHeader';
import HowItWorks from 'components/main-page/HowItWorks';
import BrowseArtwork from 'components/main-page/BrowseArtwork';
import ExampleUses from 'components/main-page/ExampleUses';
import BuiltBy from 'components/main-page/BuiltBy';
import MakeYourArt from 'components/main-page/MakeYourArt';

const Hero = dynamic(() => import('components/main-page/Hero'), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <Head>
        <title>Tabbied</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainHeader />

      <Hero />

      <HowItWorks />

      <BrowseArtwork />

      <ExampleUses />

      <BuiltBy />

      <MakeYourArt />
    </>
  );
}
