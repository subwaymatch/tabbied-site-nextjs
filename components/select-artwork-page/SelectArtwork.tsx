import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import styles from './SelectArtwork.module.scss';

export default function SelectArtwork() {
  return (
    <main className={styles.selectArtworkSection}>
      <div className={styles.grayBackground}>
        <Container>
          <Row>
            <Col>
              <h2>First, pick a design from our artwork gallery.</h2>
            </Col>
          </Row>
        </Container>

        <div className="container container-fluid-on-mobile">
          <Row noGutters={true}>
            <Col md={3} sm={6}>
              <Link href="/artwork/zario/">
                <div className={styles.galleryCard}>
                  <h4 className={styles.white}>Super Zario</h4>
                  <Image
                    src="/images/thumb_super_zario.png"
                    alt="Zario"
                    width={800}
                    height={800}
                  />
                </div>
              </Link>
            </Col>

            <Col md={3} sm={6}>
              <Link href="/artwork/odessa/">
                <div className={styles.galleryCard}>
                  <h4 className={styles.white}>Odessa</h4>
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
              <Link href="/artwork/symmetry/">
                <div className={styles.galleryCard}>
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
              <Link href="/artwork/radius/">
                <div className={styles.galleryCard}>
                  <h4 className={styles.white}>Radius</h4>
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
              <Link href="/artwork/mixtape/">
                <div className={styles.galleryCard}>
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
              <Link href="/artwork/blossom/">
                <div className={styles.galleryCard}>
                  <h4 className={styles.white}>Blossom</h4>
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
              <Link href="/artwork/veil/">
                <div className={styles.galleryCard}>
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
              <Link href="/artwork/fiesta/">
                <div className={styles.galleryCard}>
                  <h4 className={styles.white}>Fiesta</h4>
                  <Image
                    src="/images/thumb_fiesta.png"
                    alt="Fiesta"
                    width={800}
                    height={800}
                  />
                </div>
              </Link>
            </Col>
          </Row>

          <Row noGutters={true}>
            <Col md={3} sm={6}>
              <Link href="/artwork/disque/">
                <div className={styles.galleryCard}>
                  <h4>Disque</h4>
                  <Image
                    src="/images/thumb_disque.png"
                    alt="Disque"
                    width={800}
                    height={800}
                  />
                </div>
              </Link>
            </Col>

            <Col md={3} sm={6}>
              <Link href="/artwork/ring/">
                <div className={styles.galleryCard}>
                  <h4 className={styles.white}>Ring</h4>
                  <Image
                    src="/images/thumb_ring.png"
                    alt="Ring"
                    width={800}
                    height={800}
                  />
                </div>
              </Link>
            </Col>
            <Col md={3} sm={6}>
              <Link href="/artwork/trigram/">
                <div className={styles.galleryCard}>
                  <h4 className={styles.white}>Trigram</h4>
                  <Image
                    src="/images/thumb_trigram.png"
                    alt="Trigram"
                    width={800}
                    height={800}
                  />
                </div>
              </Link>
            </Col>

            <Col md={3} sm={6}>
              <Link href="/artwork/bloks/">
                <div className={styles.galleryCard}>
                  <h4>Bloks</h4>
                  <Image
                    src="/images/thumb_bloks.png"
                    alt="Bloks"
                    width={800}
                    height={800}
                  />
                </div>
              </Link>
            </Col>
          </Row>

          <Row noGutters={true}>
            <Col md={3} sm={6}>
              <Link href="/artwork/terrain/">
                <div className={styles.galleryCard}>
                  <h4 className={styles.white}>Terrain</h4>
                  <Image
                    src="/images/thumb_terrain.png"
                    alt="Terrain"
                    width={800}
                    height={800}
                  />
                </div>
              </Link>
            </Col>
          </Row>
        </div>
      </div>
    </main>
  );
}
