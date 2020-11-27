import Head from 'next/head';
import PageHeader from 'components/common/PageHeader';
import SelectArtwork from 'components/select-artwork-page/SelectArtwork';

export default function SelectArtworkPage() {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=1600" />
      </Head>

      <PageHeader title="Make your art" />

      <SelectArtwork />
    </>
  );
}
