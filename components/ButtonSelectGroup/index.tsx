import styles from './ButtonSelectGroup.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

type ButtonSelectGroupPropTypes = {
  options: Array<string>;
  selectedOption: string;
  handleSelect: (option: string) => void;
};

export default function ButtonSelectGroup({
  options,
  selectedOption,
  handleSelect,
}: ButtonSelectGroupPropTypes) {
  return (
    <div className={styles.buttonSelectGroup}>
      {options.map((option) => (
        <div
          key={option}
          className={cx('option', {
            selected: selectedOption === option,
          })}
          onClick={() => {
            handleSelect(option);
          }}
        >
          {option}
        </div>
      ))}
    </div>
  );
}
