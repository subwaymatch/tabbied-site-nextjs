import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAllArtworkIds, getArtwork } from 'lib/artwork';
import dynamic from 'next/dynamic';
import _ from 'lodash';

const Doodle = dynamic(() => import('components/Doodle'), {
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
          setOptionByIndex(optionIndex, queryVal === 'true');
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

  const setOptionByIndex = (index: number, value: any) => {
    setOptionValues((prev) => {
      const newValues = _.clone(prev);
      newValues[index] = value;

      return newValues;
    });
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

  return (
    <Doodle
      name={artwork.slug}
      seed={seed}
      styleCode={styleCode}
      doodleCode={doodleCode}
    />
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
