import Image from 'next/image';
import { Container, Col, Row } from 'react-bootstrap';
import styles from './HowItWorks.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export default function HowItWorks() {
  return (
    <div className={styles.howItWorksSection}>
      <Container>
        <Row>
          <Col>
            <h3 className="section-title">How it works</h3>
          </Col>
        </Row>

        <div className={styles.steps}>
          <Row>
            <Col md={4}>
              <div className={styles.stepBox}>
                <div className={cx('stepNumber', 'one')}>
                  <span>1</span>
                </div>
                <p>Pick a design from our growing collection of artwork</p>
              </div>
            </Col>

            <Col md={4}>
              <div className={styles.stepBox}>
                <div className={cx('stepNumber', 'two')}>
                  <span>2</span>
                </div>
                <p>Customize colors and choose settings for your design</p>
              </div>
            </Col>

            <Col md={4}>
              <div className={styles.stepBox}>
                <div className={cx('stepNumber', 'three')}>
                  <span>3</span>
                </div>
                <p>
                  Download your customized design{' '}
                  <span className={styles.highlight}>
                    <span className={styles.text}>for free</span>
                  </span>
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </Container>

      <Container className="container-fluid-on-mobile">
        <Row>
          <Col>
            <div style={{ marginTop: '40px' }}>
              <Image
                src="/images/demo_video_placeholder.jpg"
                alt="Demo Video Placeholder"
                layout="responsive"
                width={1200}
                height={683}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
