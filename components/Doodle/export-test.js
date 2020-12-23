import { useRef } from 'react';
import 'css-doodle';

export default function ExportTest() {
  const doodleRef = useRef();

  const exportArtwork = async () => {
    let result = await doodleRef.current.export({
      scale: 15.5,
      download: true,
    });
  };

  return (
    <div>
      <h1>iOS Export Test</h1>
      <style>
        {`
          css-doodle {
            --rule: (
              @grid: 5 / 8em;
              --d: @p(45deg, -45deg, 135deg, -135deg);
              --lg: linear-gradient(@var(--d),#60569e 50%,transparent 0);
              background:
                @var(--lg) 0 0 / 100% 100%,
                @var(--lg) 0 0 / 50% 50%;
            );
          }
        `}
      </style>
      <css-doodle use="var(--rule)" ref={doodleRef} />

      <button onClick={exportArtwork}>Export</button>
    </div>
  );
}
