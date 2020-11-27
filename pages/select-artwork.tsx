import Head from 'next/head';
import Header from 'components/select-artwork-page/Header';
import SelectArtwork from 'components/select-artwork-page/SelectArtwork';

export default function SelectArtworkPage() {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=1600" />
      </Head>

      <Header />

      <SelectArtwork />
    </>
  );
}
