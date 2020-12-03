import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import styles from './EditArtworkHeader.module.scss';

export default function EditArtworkHeader() {
  return (
    <header className={styles.header}>
      <Container>
        <Row className="align-items-center">
          <Col md={4}>
            <Link href="/select-artwork">
              <a className={styles.backLink}>← Go back to gallery</a>
            </Link>
          </Col>

          <Col md={4}>
            <h1 className="align-center">Make your art</h1>
          </Col>

          <Col md={4}>
            <div className="align-right">
              <button>Redraw</button>
              <button>Export</button>
            </div>
          </Col>
        </Row>
      </Container>
    </header>
  );
}
