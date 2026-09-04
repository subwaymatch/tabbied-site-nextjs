import styles from './LogoMark.module.css';

/**
 * The mark on its own, for the light mastheads (account, admin). The
 * homepage draws the same four cells in HomeNav with its own hover colour;
 * this one takes its colour from the text around it.
 */
export default function LogoMark({ size = 14 }: { size?: number }) {
  return (
    <span className={styles.mark} style={{ width: size, height: size }} aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}
