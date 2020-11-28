import { Container, Row, Col } from 'react-bootstrap';
import styles from './BuiltBy.module.scss';

export default function BuiltBy() {
  return (
    <div className={styles.builtBySection}>
      <Container>
        <Row>
          <Col
            md={{
              span: 7,
              order: 1,
            }}
            sm={{
              span: 12,
              order: 2,
            }}
          >
            <div className={styles.imageWrapper}>
              <img
                src="/images/built_by_people.png"
                alt="Built by Sy Hong and Ye Joo Park"
              />
            </div>
          </Col>

          <Col
            md={{
              span: 5,
              order: 2,
            }}
            sm={{
              span: 12,
              order: 1,
            }}
          >
            <div className={styles.textHeader}>
              <span className={styles.subheading}>Creators of Tabbied</span>
              <h3 className="section-title">Built by design and dev geeks</h3>
            </div>
            <div className={styles.textContent}>
              <p>
                We aim to build simple design tools that energize your
                creativity. Tabbied was initially developed as a tool for making
                wall art, but we quickly realized that it could be used for many
                other purposes. We're very excited to see what you can make
                using our platform.
              </p>

              <p>
                We also like to give a special thanks to{' '}
                <a
                  href="http://yuanchuan.dev/"
                  className={styles.linkUnderline}
                >
                  Chuan Yuan
                </a>{' '}
                from China. Chuan is the developer of{' '}
                <a
                  href="https://css-doodle.com/"
                  className={styles.linkUnderline}
                >
                  CSS-Doodle
                </a>
                , which made Tabbied possible. Thanks to all the supporters of
                both CSS-Doodle and Tabbied. You are inspiring us to keep on
                making.
              </p>

              <div className={styles.people}>
                <span className={styles.names}>Sy &amp; Ye Joo</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
