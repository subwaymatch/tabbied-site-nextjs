import { useState } from 'react';
import styles from './ToggleSwitch.module.scss';
import { v4 as uuidv4 } from 'uuid';

type ToggleSwitchPropTypes = {
  isChecked: boolean;
  handleChange: (e) => void;
};

export default function ToggleSwitch({
  isChecked,
  handleChange,
}: ToggleSwitchPropTypes) {
  const [checkboxId] = useState(uuidv4());

  return (
    <div>
      <input
        id={checkboxId}
        type="checkbox"
        checked={isChecked}
        onChange={(e) => {
          handleChange(e.target.checked);
        }}
        className={styles.toggleCheckbox}
      />
      <label htmlFor={checkboxId} className={styles.toggleSwitch} />
    </div>
  );
}
