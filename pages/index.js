import Head from 'next/head';
import dynamic from 'next/dynamic';
import MainHeader from 'components/MainHeader';

import { Container } from 'react-bootstrap';

const MainHero = dynamic(() => import('components/MainHero'), { ssr: false });

export default function Home() {
  return (
    <>
      <Head>
        <title>Tabbied</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainHeader />

      <MainHero />
    </>
  );
}
