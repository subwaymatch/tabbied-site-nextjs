import { Container, Row, Col } from 'react-bootstrap';
import styles from './ExampleUses.module.scss';

export default function ExampleUsesSection() {
  return (
    <div className={styles.exampleUsesSection}>
      <Container>
        <Row>
          <Col>
            <span className={styles.subheading}>Example uses</span>
            <h3 className="section-title">Use it for just about anything</h3>
          </Col>
        </Row>
      </Container>

      <Container className="container-fluid-on-mobile">
        <Row noGutters={true}>
          <Col md={4} sm={6}>
            <div className={styles.imageWrapper}>
              <img src="/images/uses_wall_art.jpg" alt="Wall Art" />
            </div>
          </Col>

          <Col md={4} sm={6}>
            <div className={styles.imageWrapper}>
              <img src="/images/uses_notebook.jpg" alt="Stationery" />
            </div>
          </Col>

          <Col md={4} sm={6}>
            <div className={styles.imageWrapper}>
              <img src="/images/uses_tshirt.jpg" alt="Tshirt" />
            </div>
          </Col>

          <Col md={4} sm={6}>
            <div className={styles.imageWrapper}>
              <img src="/images/uses_packaging.jpg" alt="Packaging" />
            </div>
          </Col>

          <Col md={8}>
            <div className={styles.imageWrapper}>
              <img src="/images/uses_devices.jpg" alt="Devices" />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
