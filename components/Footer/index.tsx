import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <div className={styles.footerSection}>
      <Container>
        <Row>
          <Col md={2}>
            <h5>Tabbied</h5>

            <ul className={styles.footerMenu}>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/">About</Link>
              </li>
              <li>
                <Link href="/">Browse Designs</Link>
              </li>
            </ul>
          </Col>

          <Col md={2}>
            <h5>Company</h5>

            <ul className={styles.footerMenu}>
              <li>
                <Link href="/">Terms of Service</Link>
              </li>
              <li>
                <Link href="/">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/">Contact</Link>
              </li>
            </ul>
          </Col>

          <Col md={2}>
            <h5>CSS Developers</h5>

            <ul className={styles.footerMenu}>
              <li>
                <Link href="/">Submit an artwork</Link>
              </li>
            </ul>
          </Col>

          <Col
            lg={{
              span: 4,
              offset: 2,
            }}
            md={{
              span: 5,
              offset: 1,
            }}
          >
            <h5>Subscribe</h5>

            <p>
              Sign up to our email list to be notified of updates and news from
              Tabbied.
            </p>

            <div className={styles.emailInputWrapper}>
              <input type="email" placeholder="Type your email" />
              <button>Subscribe</button>
            </div>

            <p>
              © {new Date().getFullYear()} Tabbied.
              <br />
              Built with <span className={styles.heart}>❤</span> from Dallas and
              Seoul.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
