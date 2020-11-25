import Link from 'next/link';
import styles from './MainBrowseArtwork.module.scss';

// import thumbZario from 'images/thumb_super_zario.png';
// import thumbOdessa from 'images/thumb_odessa.png';
// import thumbSymmetry from 'images/thumb_symmetry.png';
// import thumbRadius from '../../../images/thumb_radius.png';
// import thumbMixtape from '../../../images/thumb_mixtape.png';
// import thumbBlossom from '../../../images/thumb_blossom.png';
// import thumbVeil from '../../../images/thumb_veil.png';
// import thumbEmpty from '../../../images/thumb_empty.png';

export default function BrowseArtworkSection() {
  return (
    <div id="section-browse-artwork">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <span className="subheading">Browse artwork</span>
            <h3>
              Start designing with our curated artwork of
              <br />
              timeless patterns and illustrations.
            </h3>
          </div>
        </div>
      </div>

      <div className="container container-fluid-on-mobile">
        <div className="row no-gutters">
          <div className="col-md-3 col-6">
            <Link href={`/artwork/zario/`}>
              <div className="gallery-card">
                <h4 className="white">Super Zario</h4>
                <img src="" alt="zario" />
              </div>
            </Link>
          </div>

          <div className="col-md-3 col-6">
            <Link href={`/artwork/odessa/`}>
              <div className="gallery-card">
                <h4 className="white">Odessa</h4>
                <img src="" alt="odessa" />
              </div>
            </Link>
          </div>

          <div className="col-md-3 col-6">
            <Link href={`/artwork/symmetry/`}>
              <div className="gallery-card">
                <h4>Symmetry</h4>
                <img src="" alt="Symmetry" />
              </div>
            </Link>
          </div>

          <div className="col-md-3 col-6">
            <Link href={`/artwork/radius/`}>
              <div className="gallery-card">
                <h4 className="white">Radius</h4>
                <img src="" alt="Radius" />
              </div>
            </Link>
          </div>
        </div>

        <div className="row no-gutters">
          <div className="col-md-3 col-6">
            <Link href={`/artwork/mixtape/`}>
              <div className="gallery-card">
                <h4>Mixtape</h4>
                <img src="" alt="Mixtape" />
              </div>
            </Link>
          </div>

          <div className="col-md-3 col-6">
            <Link href={`/artwork/blossom/`}>
              <div className="gallery-card">
                <h4 className="white">Blossom</h4>
                <img src="" alt="Blossom" />
              </div>
            </Link>
          </div>
          <div className="col-md-3 col-6">
            <Link href={`/artwork/veil/`}>
              <div className="gallery-card">
                <h4>Veil</h4>
                <img src="" alt="Veil" />
              </div>
            </Link>
          </div>

          <div className="col-md-3 col-6">
            <Link href={`/select-artwork/`}>
              <div className="gallery-card card-action">
                <img src="" alt="View All" />
                <div className="center">
                  <span className="text">View All &#8594;</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
