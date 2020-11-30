import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from 'components/common/Layout';
import { getAllArtworkIds, getArtwork } from 'lib/artwork';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './EditArtworkPage.module.scss';
import dynamic from 'next/dynamic';
import _ from 'lodash';

const ColorPicker = dynamic(() => import('components/ColorPicker'), {
  ssr: false,
});

export default function EditArtworkPage({ artwork }) {
  const [palette, setPalette] = useState(artwork.palette);
  const [index, setIndex] = useState(0);
  const [hex, setHex] = useState('#abcdef');

  useEffect(() => {
    console.log(`palette has changed! ${palette}`);
  }, [palette]);

  const setColor = (idx, hex) => {
    console.log(`setColor idx=${idx}, hex=${hex}`);
    console.log(`setColor before=${palette}`);

    const clonedColors = _.clone(palette);
    clonedColors[idx] = hex;

    console.log(`setColor after=${clonedColors}`);

    setPalette(clonedColors);
  };

  return (
    <Layout>
      <Head>
        <meta name="viewport" content="width=1600" />
      </Head>

      <Container>
        <Row>
          <Col>
            <div>
              <label>Index</label>
              <input
                type="number"
                value={index}
                onChange={(e) => {
                  const newIndex = Number.parseInt(
                    (e.target as HTMLInputElement).value
                  );

                  setIndex(newIndex);
                }}
              />
            </div>
            <div>
              <label>Hex</label>
              <input
                type="text"
                value={hex}
                onChange={(e) => {
                  const newHex = (e.target as HTMLInputElement).value;

                  setHex(newHex);
                  setColor(index, newHex);

                  // let newPalette = _.clone(palette);
                  // newPalette[index] = newHex;

                  // setPalette(newPalette);
                }}
              />
            </div>
          </Col>
          <Col>
            <div className="colors-wrapper">
              {palette.map((c, idx) => (
                <div key={idx}>
                  <span className="index">Index {idx}: </span>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            {palette && (
              <div className={styles.optionBox}>
                <h3>Palette</h3>
                <div className="colors">
                  {palette.map((hex, idx) => (
                    <ColorPicker
                      key={'color' + idx}
                      index={idx}
                      handleColorChange={(color) => {
                        console.log(
                          `handleColorChange idx=${idx} color=${color}`
                        );
                        setColor(idx, color);
                      }}
                      color={hex}
                    />
                  ))}
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Container>

      <style jsx>
        {`
          label {
            display: block;
            margin-top: 24px;
          }
          .colors-wrapper {
            margin-top: 24px;
            border-top: 1px solid #ddd;
            padding-top: 12px;
          }
          span.index {
            color: #f54;
          }
        `}
      </style>
    </Layout>
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
