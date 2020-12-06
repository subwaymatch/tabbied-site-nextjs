import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import styles from './EditArtworkHeader.module.scss';

type EditArtworkHeaderPropTypes = {
  onRedraw: () => void;
  onExport: () => void;
};

export default function EditArtworkHeader({
  onRedraw,
  onExport,
}: EditArtworkHeaderPropTypes) {
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
              <button onClick={onRedraw}>Redraw</button>
              <button onClick={onExport}>Export</button>
            </div>
          </Col>
        </Row>
      </Container>
    </header>
  );
}
