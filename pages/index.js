import Head from 'next/head';
import dynamic from 'next/dynamic';
import MainHeader from 'components/main-page/MainHeader';
import HowItWorks from 'components/main-page/HowItWorks';

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

      <HowItWorks />
    </>
  );
}
