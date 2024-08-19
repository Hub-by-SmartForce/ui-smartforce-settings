import React from 'react';
import styles from './FilterOption.module.scss';
import { SFText } from 'sfui';
import { InteractiveBox } from '../../../../InteractiveBox/InteractiveBox';

export interface FilterOptionProps {
  selected: boolean;
  label: string;
  disabled?: boolean;
  onClick: () => void;
}

export const FilterOption = ({
  selected,
  label,
  disabled = false,
  onClick
}: FilterOptionProps): React.ReactElement<FilterOptionProps> => {
  return (
    <InteractiveBox
      className={`${styles.filterOption} ${selected ? styles.selected : ''} ${
        disabled ? styles.disabled : ''
      }`}
      onClick={onClick}
    >
      <SFText
        type="component-chip-S-M"
        sfColor={disabled ? 'neutral' : 'default'}
      >
        {label}
      </SFText>
    </InteractiveBox>
  );
};
