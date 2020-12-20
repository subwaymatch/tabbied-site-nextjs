import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Col, Container, Row } from 'react-bootstrap';
import MenuButton from 'components/main-page/MenuButton';
import styles from './MainHeader.module.scss';

export default function MainHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={styles.headerSection}>
      <div className={styles.backdrop} />

      <Container>
        <Row className="align-items-center">
          <Col md={3} xs={6}>
            <Link href="/">
              <a className={styles.logoImageWrapper}>
                <Image
                  src="/images/logo_tabbied_v3.svg"
                  alt="Tabbied"
                  layout="fixed"
                  width={52}
                  height={52}
                />
              </a>
            </Link>
          </Col>

          <Col md={6} className="d-none d-md-block">
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

          <Col md={3} className="d-none d-md-block">
            <div className="align-right">
              <Link href="/select-artwork/">
                <a className={styles.actionBtn}>Make your art</a>
              </Link>
            </div>
          </Col>

          <Col xs={6} className="d-md-none">
            <div className={styles.menuBtnWrapper}>
              <MenuButton
                isOpen={isMenuOpen}
                onClick={() => {
                  setIsMenuOpen((v) => !v);
                }}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </header>
  );
}
