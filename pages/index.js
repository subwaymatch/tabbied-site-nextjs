import Head from 'next/head';
import dynamic from 'next/dynamic';
import MainHeader from 'components/main-page/MainHeader';
import MainHowItWorks from 'components/main-page/MainHowItWorks';
import MainBrowseArtwork from 'components/main-page/MainBrowseArtwork';
import MainExampleUses from 'components/main-page/MainExampleUses';

const MainHero = dynamic(() => import('components/main-page/MainHero'), {
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

      <MainHero />

      <MainHowItWorks />

      <MainBrowseArtwork />

      <MainExampleUses />
    </>
  );
}
