import { getAllArtworkIds, getArtwork } from 'lib/artwork';

export default function EditArtworkPage({ artwork }) {
  return (
    <>
      <div>Artwork {JSON.stringify(artwork)}</div>
    </>
  );
}

export const getStaticPaths = async () => {
  const questionIds = await getAllArtworkIds();
  const paths = questionIds.map((questionId) => ({
    params: {
      id: questionId,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const artwork = await getArtwork(params.id);

  return {
    props: {
      artwork,
    },
  };
};
