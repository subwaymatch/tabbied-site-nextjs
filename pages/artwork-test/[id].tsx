import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
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
  console.log(artwork);

  const [palette, setPalette] = useState(
    artwork.hasOwnProperty('palette') ? artwork.palette : []
  );
  const [optionValues, setOptionValues] = useState(
    _.cloneDeep(artwork.options.map((o) => o.default))
  );
  const [styleCode, setStyleCode] = useState('');
  const [doodleCode, setDoodleCode] = useState('');
  const [seed, setSeed] = useState('0000');

  useEffect(() => {
    updateDoodleCode();
  }, [palette, optionValues]);

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
          break;
        default:
          break;
      }
    });

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
          <ValueSlider
            min={option.min}
            max={option.max}
            step={option.step}
            value={controlValue}
            onChange={onChange}
          />
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
        <EditArtworkHeader />

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
                grid={'4x6'}
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
              )}

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
