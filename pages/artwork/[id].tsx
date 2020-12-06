import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import queryString from 'query-string';
import randomstring from 'randomstring';
import Layout from 'components/Layout';
import EditArtworkHeader from 'components/edit-artwork-page/EditArtworkHeader';
import ButtonSelectGroup from 'components/ButtonSelectGroup';
import ValueSlider from 'components/ValueSlider';
import { getAllArtworkIds, getArtwork } from 'lib/artwork';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './EditArtworkPage.module.scss';
import dynamic from 'next/dynamic';
import _ from 'lodash';
import classNames from 'classnames/bind';
import ToggleSwitch from 'components/ToggleSwitch';

const cx = classNames.bind(styles);

const Doodle = dynamic(() => import('components/Doodle'), {
  ssr: false,
});

const ColorPicker = dynamic(() => import('components/ColorPicker'), {
  ssr: false,
});

export default function EditArtworkPage({ artwork }) {
  const [palette, setPalette] = useState(
    artwork.hasOwnProperty('palette') ? artwork.palette : []
  );
  const [optionValues, setOptionValues] = useState(
    _.cloneDeep(artwork.options.map((o) => o.default))
  );
  const [styleCode, setStyleCode] = useState('');
  const [doodleCode, setDoodleCode] = useState('');
  const [seed, setSeed] = useState('0000');

  const router = useRouter();

  useEffect(() => {
    console.log(router.query);

    if (
      router.query.hasOwnProperty('palette') &&
      router.query.palette.length === artwork.palette.length &&
      !_.isEqual(palette, router.query.palette)
    ) {
      setPalette(router.query.palette);
    }

    artwork.options.forEach((option, optionIndex) => {
      if (router.query.hasOwnProperty(option.id)) {
        const queryVal = router.query[option.id];

        if (typeof option.default === 'string') {
          setOptionByIndex(optionIndex, queryVal);
        } else if (typeof option.default === 'number') {
          setOptionByIndex(optionIndex, Number(queryVal));
        } else if (typeof option.default === 'boolean') {
          setOptionByIndex(optionIndex, Boolean(queryVal));
        }
      }
    });

    if (router.query.hasOwnProperty('seed') && seed !== router.query.seed) {
      setSeed(router.query.seed as string);
    }
  }, [router.query]);

  useEffect(() => {
    updateDoodleCode();
  }, [palette, optionValues]);

  // Update URL query parameters if necessary
  useEffect(() => {
    // console.log(`useEffect seed, palette, optionValues`);
    // console.log(router.query);
    // const newQuery = Object.assign({}, router.query, {
    //   palette,
    //   seed,
    // });
    // artwork.options.forEach((o, idx) => {
    //   newQuery[o.id] = optionValues[idx];
    // });
    // // console.log(newQuery);
    // if (!_.isEqual(router.query, newQuery)) {
    //   router.replace({
    //     pathname: router.pathname,
    //     query: newQuery,
    //   });
    // }
  }, [seed, palette, optionValues]);

  const setOptionByIndex = (index: number, value: any) => {
    setOptionValues((prev) => {
      const newValues = _.clone(prev);
      newValues[index] = value;

      return newValues;
    });
  };

  const randomizeSeed = () => {
    setSeed(randomstring.generate({ length: 4 }));
  };

  const getColorsStyleCode = (colors) => {
    let colorStyleVariables = '';

    colors.forEach((color, idx) => {
      colorStyleVariables += `--color${idx}: ${color};\n`;
    });

    return colorStyleVariables;
  };

  const updateDoodleCode = () => {
    let newStyleCode = artwork.code.style;
    let newDoodleCode = artwork.code.doodle;

    artwork.options.forEach((option, index) => {
      switch (option.type) {
        case 'ButtonSelectGroup':
        case 'Slider':
          newStyleCode = newStyleCode
            .split(option.replace)
            .join(optionValues[index]);

          newDoodleCode = newDoodleCode
            .split(option.replace)
            .join(optionValues[index]);

          break;
        case 'ToggleSwitch':
          if (optionValues[index]) {
            newStyleCode = newStyleCode.split(option.replace).join(option.code);

            newDoodleCode = newDoodleCode.split(option.replace).join('');
          }
          break;
        default:
          break;
      }
    });

    newDoodleCode = newDoodleCode.split('${width}').join('360px');
    newDoodleCode = newDoodleCode.split('${height}').join('540px');

    newStyleCode = getColorsStyleCode(palette) + newStyleCode;

    setStyleCode(newStyleCode);
    setDoodleCode(newDoodleCode);
  };

  const getOptionControlComponent = (
    option: any,
    optionIndex: number
  ): React.ReactNode => {
    const controlValue = optionValues[optionIndex];
    const onChange = (value) => setOptionByIndex(optionIndex, value);

    switch (option.type) {
      case 'ButtonSelectGroup':
        return (
          <ButtonSelectGroup
            options={option.options}
            value={controlValue}
            onChange={onChange}
          />
        );
      case 'Slider':
        return (
          <div className={styles.valueSliderWrapper}>
            <ValueSlider
              min={option.min}
              max={option.max}
              step={option.step}
              value={controlValue}
              onChange={onChange}
            />
          </div>
        );
      case 'ToggleSwitch':
        return <ToggleSwitch isChecked={controlValue} onChange={onChange} />;
      default:
        return <div>Unknown Control Type: {option.type}</div>;
    }
  };

  return (
    <Layout>
      <Head>
        <meta name="viewport" content="width=1600" />
      </Head>

      <div className={styles.pageWrapper}>
        <EditArtworkHeader
          onRedraw={randomizeSeed}
          onExport={() => {
            console.log(`export artwork`);
          }}
        />

        <main className={styles.editArtworkSection}>
          <div
            className={styles.previewWrapper}
            style={{
              backgroundColor: palette.length > 0 ? palette[0] : 'transparent',
            }}
          >
            <div className={styles.doodleFrame}>
              <Doodle
                name={artwork.slug}
                seed={seed}
                styleCode={styleCode}
                doodleCode={doodleCode}
              />
            </div>
          </div>

          <div className={styles.optionsWrapper}>
            <div className={styles.options}>
              {/* {palette && (
                <div className={styles.optionBox}>
                  <h3>Palette</h3>
                  <div className="colors">
                    {palette.map((hex, index) => (
                      <ColorPicker
                        key={'color' + index}
                        index={index}
                        handleColorChange={(color) => {
                          setPalette((prevPalette) => {
                            const newPalette = _.clone(prevPalette);
                            newPalette[index] = color;

                            return newPalette;
                          });
                        }}
                        color={hex}
                      />
                    ))}
                  </div>
                </div>
              )} */}

              {artwork.options.map((option, optionIndex) => {
                return (
                  <div key={option.id} className={styles.optionBox}>
                    <h3>{option.displayName}</h3>
                    {getOptionControlComponent(option, optionIndex)}
                  </div>
                );
              })}
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
