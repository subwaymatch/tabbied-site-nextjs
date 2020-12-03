import { Container, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { MdClose } from 'react-icons/md';
import styles from './PageHeader.module.scss';

export default function PageHeader({ title }: { title: string }) {
  const router = useRouter();

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
            <div className="align-center">
              <h2>{title}</h2>
            </div>
          </Col>

          <Col md={2}>
            <div className="align-right">
              <a
                onClick={(e) => {
                  e.preventDefault();

                  router.back();
                }}
              >
                <MdClose className={styles.icon} />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </header>
  );
}
