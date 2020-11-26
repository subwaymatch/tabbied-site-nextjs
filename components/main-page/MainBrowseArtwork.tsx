import Link from 'next/link';
import Image from 'next/image';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './MainBrowseArtwork.module.scss';

export default function BrowseArtworkSection() {
  return (
    <div id="section-browse-artwork">
      <Container>
        <Row>
          <Col>
            <span className="subheading">Browse artwork</span>
            <h3>
              Start designing with our curated artwork of
              <br />
              timeless patterns and illustrations.
            </h3>
          </Col>
        </Row>
      </Container>

      <div className="container container-fluid-on-mobile">
        <Row noGutters={true}>
          <Col md={3} sm={6}>
            <Link href={`/artwork/zario/`}>
              <div className="gallery-card">
                <h4 className="white">Super Zario</h4>
                <Image
                  src="/images/thumb_super_zario.png"
                  alt="Super Zario"
                  width={800}
                  height={800}
                />
              </div>
            </Link>
          </Col>

          <Col md={3} sm={6}>
            <Link href={`/artwork/odessa/`}>
              <div className="gallery-card">
                <h4 className="white">Odessa</h4>
                <Image
                  src="/images/thumb_odessa.png"
                  alt="Odessa"
                  width={800}
                  height={800}
                />
              </div>
            </Link>
          </Col>

          <Col md={3} sm={6}>
            <Link href={`/artwork/symmetry/`}>
              <div className="gallery-card">
                <h4>Symmetry</h4>
                <Image
                  src="/images/thumb_symmetry.png"
                  alt="Symmetry"
                  width={800}
                  height={800}
                />
              </div>
            </Link>
          </Col>

          <Col md={3} sm={6}>
            <Link href={`/artwork/radius/`}>
              <div className="gallery-card">
                <h4 className="white">Radius</h4>
                <Image
                  src="/images/thumb_radius.png"
                  alt="Radius"
                  width={800}
                  height={800}
                />
              </div>
            </Link>
          </Col>
        </Row>

        <Row noGutters={true}>
          <Col md={3} sm={6}>
            <Link href={`/artwork/mixtape/`}>
              <div className="gallery-card">
                <h4>Mixtape</h4>
                <Image
                  src="/images/thumb_mixtape.png"
                  alt="Mixtape"
                  width={800}
                  height={800}
                />
              </div>
            </Link>
          </Col>

          <Col md={3} sm={6}>
            <Link href={`/artwork/blossom/`}>
              <div className="gallery-card">
                <h4 className="white">Blossom</h4>
                <Image
                  src="/images/thumb_blossom.png"
                  alt="Blossom"
                  width={800}
                  height={800}
                />
              </div>
            </Link>
          </Col>
          <Col md={3} sm={6}>
            <Link href={`/artwork/veil/`}>
              <div className="gallery-card">
                <h4>Veil</h4>
                <Image
                  src="/images/thumb_veil.png"
                  alt="Veil"
                  width={800}
                  height={800}
                />
              </div>
            </Link>
          </Col>

          <Col md={3} sm={6}>
            <Link href={`/select-artwork/`}>
              <div className="gallery-card card-action">
                <Image
                  src="/images/thumb_empty.png"
                  alt="View All"
                  width={800}
                  height={800}
                />
                <div className="center">
                  <span className="text">View All &#8594;</span>
                </div>
              </div>
            </Link>
          </Col>
        </Row>
      </div>
    </div>
  );
}
