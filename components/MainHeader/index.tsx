import { Col, Container, Row } from 'react-bootstrap';
import styles from './MainHeader.module.scss';

export default function MainHeader() {
  return (
    <Container>
      <Row>
        <Col>Logo here</Col>

        <Col>Menu Here</Col>

        <Col>Make your art</Col>
      </Row>
    </Container>
  );
}
