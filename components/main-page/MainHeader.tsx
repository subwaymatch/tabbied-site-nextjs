import Image from 'next/image';
import Link from 'next/link';
import { Col, Container, Row } from 'react-bootstrap';
import styles from './MainHeader.module.scss';

export default function MainHeader() {
  return (
    <header className={styles.headerSection}>
      <Container>
        <Row className="align-items-center">
          <Col md={3} xs={6}>
            <Link href="/">
              <a className={styles.logoImageWrapper}>
                <Image
                  src="/images/logo_tabbied_v2.svg"
                  alt="Tabbied"
                  layout="fixed"
                  width={52}
                  height={52}
                />
              </a>
            </Link>
          </Col>

          <Col md={6} className="d-md-block d-sm-none">
            <div className="align-center">
              <ul className={styles.pageNavigation}>
                <li>
                  <a href="#section-how-it-works">How it works</a>
                </li>
                <li>
                  <a href="#section-browse-artwork">Browse artwork</a>
                </li>
                <li>
                  <a href="#section-example-uses">Example uses</a>
                </li>
              </ul>
            </div>
          </Col>

          <Col md={3} xs={6}>
            <div className="align-right">
              <div className="d-none d-md-block">
                <Link href="/select-artwork/">
                  <a className={styles.actionBtn}>Make your art</a>
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </header>
  );
}
