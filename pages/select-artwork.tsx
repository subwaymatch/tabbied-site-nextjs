import Head from 'next/head';
import Layout from 'components/Layout';
import PageHeader from 'components/PageHeader';
import SelectArtwork from 'components/select-artwork-page/SelectArtwork';

export default function SelectArtworkPage() {
  return (
    <Layout>
      <Head>
        <meta name="viewport" content="width=1600" />
      </Head>

      <PageHeader title="Make your art" />

      <SelectArtwork />
    </Layout>
  );
}
