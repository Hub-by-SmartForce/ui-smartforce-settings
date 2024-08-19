import React from 'react';
import styles from './SectionMenu.module.scss';
import { SFChip } from 'sfui';
import { InteractiveBox } from '../InteractiveBox/InteractiveBox';

export interface SectionMenuProps {
  title: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const SectionMenu = ({
  title,
  selected,
  disabled,
  onClick
}: SectionMenuProps): React.ReactElement<SectionMenuProps> => {
  return (
    <InteractiveBox
      className={`${styles.sectionMenu} ${selected ? styles.selected : ''} ${
        disabled ? styles.disabled : ''
      }`}
      aria-disabled={disabled}
      onClick={!disabled ? onClick : undefined}
    >
      <p className={styles.title}>{title}</p>
      {disabled && <SFChip size="small" sfColor="default" label="Soon" />}
    </InteractiveBox>
  );
};

export default SectionMenu;
