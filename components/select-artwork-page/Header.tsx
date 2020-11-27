import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { MdClose } from 'react-icons/md';
import styles from './Header.module.scss';

export default function Header() {
  return (
    <header className={styles.headerSection}>
      <Container>
        <Row className="align-items-center">
          <Col md={2}>
            <Link href="/">
              <a className={styles.logoImageWrapper}>
                <Image
                  src="/images/logo_tabbied.png"
                  alt="Tabbied"
                  layout="fixed"
                  width={48}
                  height={48}
                />
              </a>
            </Link>
          </Col>

          <Col md={8}>
            <div className={styles.alignCenter}>
              <h2>Make your art</h2>
            </div>
          </Col>

          <Col md={2}>
            <div className={styles.alignRight}>
              <MdClose className={styles.icon} />
            </div>
          </Col>
        </Row>
      </Container>
    </header>
  );
}
