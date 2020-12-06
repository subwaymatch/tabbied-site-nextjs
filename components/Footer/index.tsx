import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footerSection}>
      <Container>
        <Row>
          <Col
            md={{
              span: 7,
            }}
          >
            <h5>Tabbied</h5>

            <Row>
              <Col md={6}>
                <p>© 2020 Tabbied.com. All rights reserved.</p>
              </Col>

              <Col md={6}>
                <p>
                  <Link href="/terms-of-service">
                    <a>Terms of Service</a>
                  </Link>{' '}
                  <Link href="/privacy-policy">
                    <a>Privacy Policy</a>
                  </Link>
                </p>
              </Col>
            </Row>
          </Col>

          <Col
            md={{
              span: 5,
            }}
          >
            <h5>About Us</h5>

            <p>
              Tabbied lets you easily create timeless and beautifully generated
              patterns or artwork to use for wall art, websites, print materials
              and more.
            </p>
            <p>
              This free tool was built with{' '}
              <span className={styles.heart}>❤</span> by Sy Hong and Ye Joo
              Park.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
