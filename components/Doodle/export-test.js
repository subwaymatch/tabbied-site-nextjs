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
      <css-doodle ref={doodleRef}>
        {`
        @grid: 7 / 8em;
        background: @p(#FFF4E0, #F8B501, #06ACB5, #17191D, #FC3D3C);
        :after {
          content: '';
          @size: 100%;
          position: absolute;
          background:
            @m(4, radial-gradient(
              circle at @p(-40% -40%, 140% 140%, 140%  -40%, -40% 140%),
              @p(#FFF4E0, #F8B501, #06ACB5, #17191D, #FC3D3C) 50%,
              transparent 50%
            )),
            radial-gradient(
              @p(#FFF4E0, #F8B501, #06ACB5, #17191D, #FC3D3C) @r(10%, 40%),
              transparent 0
            )
        }
      `}
      </css-doodle>
      <button onClick={exportArtwork}>Export</button>
    </div>
  );
}
