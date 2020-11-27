import Head from 'next/head';
import PageHeader from 'components/common/PageHeader';
import Footer from 'components/Footer';
import { Col, Container, Row } from 'react-bootstrap';

export default function Home() {
  return (
    <>
      <Head>
        <title>Tabbied - Terms of Service</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageHeader title="Terms of Service" />

      <Container>
        <Row>
          <Col>
            <h1>Terms of Service</h1>
          </Col>
        </Row>
      </Container>

      <Footer />
    </>
  );
}
