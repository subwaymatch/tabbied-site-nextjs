import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from 'components/common/Layout';
import ButtonSelectGroup from 'components/ButtonSelectGroup';
import { v4 as uuidv4 } from 'uuid';
import { getAllArtworkIds, getArtwork } from 'lib/artwork';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './EditArtworkPage.module.scss';
import dynamic from 'next/dynamic';
import _ from 'lodash';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Doodle = dynamic(() => import('components/Doodle'), {
  ssr: false,
});

const ColorPicker = dynamic(() => import('components/ColorPicker'), {
  ssr: false,
});

export default function EditArtworkPage({ artwork }) {
  console.log(artwork);

  const getDefaultValue = (key, defaultValue) =>
    artwork.hasOwnProperty(key) ? artwork[key].default : defaultValue;

  const [seed, setSeed] = useState(uuidv4());
  const [palette, setPalette] = useState(
    artwork.hasOwnProperty('palette') ? artwork.palette : []
  );
  const [grid, setGrid] = useState(artwork.grid.default);
  const [frequency, setFrequency] = useState(
    getDefaultValue('frequency', null)
  );
  const [circularity, setCircularity] = useState(
    getDefaultValue('circularity', null)
  );
  const [styleCode, setStyleCode] = useState(artwork.code.style);
  const [doodleCode, setDoodleCode] = useState(artwork.code.doodle);

  console.log(`seed: ${seed}`);
  console.log(`palette: ${palette}`);
  console.log(`grid: ${grid}`);
  console.log(`frequency: ${frequency}`);
  console.log(`circularity: ${circularity}`);

  useEffect(() => {
    if (frequency !== null) {
      setStyleCode(styleCode.split(artwork.frequency.replace).join(frequency));

      setDoodleCode(
        doodleCode.split(artwork.frequency.replace).join(frequency)
      );
    }

    if (circularity !== null) {
      setStyleCode(
        styleCode.split(artwork.circularity.replace).join(circularity)
      );

      setDoodleCode(
        doodleCode.split(artwork.circularity.replace).join(circularity)
      );
    }
  }, []);

  return (
    <Layout>
      <Head>
        <meta name="viewport" content="width=1600" />
      </Head>

      <div className={styles.pageWrapper}>
        <header className={styles.header}>
          <Container>
            <Row className="align-items-center">
              <Col md={4}>
                <Link href="/select-artwork">
                  <a className={styles.backLink}>← Go back to gallery</a>
                </Link>
              </Col>

              <Col md={4}>
                <h1 className="align-center">Make your art</h1>
              </Col>

              <Col md={4}>
                <div className="align-right">
                  <button>Redraw</button>
                  <button>Export</button>
                </div>
              </Col>
            </Row>
          </Container>
        </header>

        <main className={styles.editArtworkSection}>
          <div
            className={styles.previewWrapper}
            style={{
              backgroundColor: palette[0],
            }}
          >
            <div className={styles.doodleFrame}>
              <Doodle
                name={artwork.slug}
                grid={grid}
                colors={palette}
                width={360}
                widthHeightRatio={1.5}
                seed={seed}
                styleCode={styleCode}
                doodleCode={doodleCode}
              />
            </div>
          </div>

          <div className={styles.optionsWrapper}>
            <div className={styles.options}>
              {palette && (
                <div className={styles.optionBox}>
                  <h3>Palette</h3>
                  <div className="colors">
                    {palette.map((hex, index) => (
                      <ColorPicker
                        key={'color' + index}
                        index={index}
                        handleColorChange={(color) => {
                          setPalette((prevPalette) => {
                            const newPalette = prevPalette.slice();
                            newPalette[index] = color;

                            return newPalette;
                          });
                        }}
                        color={hex}
                      />
                    ))}
                  </div>
                </div>
              )}

              {artwork.hasOwnProperty('grid') !== null &&
                artwork.grid.hasOwnProperty('options') && (
                  <div className={styles.optionBox}>
                    <h3>Columns and Rows</h3>

                    <ButtonSelectGroup
                      options={artwork.grid.options}
                      selectedOption={grid}
                      handleSelect={setGrid}
                    />
                  </div>
                )}
            </div>
          </div>
        </main>
      </div>
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
