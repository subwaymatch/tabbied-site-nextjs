import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { motion, AnimatePresence } from 'framer-motion';
import { Col, Container, Row } from 'react-bootstrap';
import MenuButton from 'components/main-page/MenuButton';
import styles from './MainHeader.module.scss';

const MainPageNavigation = ({ howItWorksRef }) => {
  return (
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
  );
};

const SelectArtworkLinkButton = () => {
  return (
    <Link href="/select-artwork/">
      <a className={styles.actionBtn}>Make your art</a>
    </Link>
  );
};

export default function MainHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isScreenDesktop = useMediaQuery('(min-width: 992px)');

  useEffect(() => {
    if (isScreenDesktop && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isScreenDesktop]);

  return (
    <>
      {isMenuOpen && (
        <div
          className={styles.backdrop}
          onClick={(e) => {
            e.preventDefault();

            setIsMenuOpen(false);
          }}
        />
      )}

      <header className={styles.headerSection}>
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
                <MainPageNavigation />
              </div>
            </Col>

            <Col md={3} className="d-none d-md-block">
              <div className="align-right">
                <SelectArtworkLinkButton />
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

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className={styles.mobileMenu}
              initial="closed"
              animate="open"
              exit={{
                height: 0,
                opacity: 0,
              }}
              variants={{
                open: {
                  height: 'auto',
                  opacity: 1,
                },
                closed: { height: 0, opacity: 0 },
              }}
            >
              <MainPageNavigation />

              <div className={styles.actionBtnWrapper}>
                <SelectArtworkLinkButton />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
