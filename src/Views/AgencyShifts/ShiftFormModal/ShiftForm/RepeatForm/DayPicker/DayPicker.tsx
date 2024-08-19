import React from 'react';
import styles from './DayPicker.module.scss';
import { SFMenuOption, SFText } from 'sfui';
import { InteractiveBox } from '../../../../../../Components';

const options: SFMenuOption[] = [
  { label: 'M', value: 'MO' },
  { label: 'T', value: 'TU' },
  { label: 'W', value: 'WE' },
  { label: 'T', value: 'TH' },
  { label: 'F', value: 'FR' },
  { label: 'S', value: 'SA' },
  { label: 'S', value: 'SU' }
];

export interface DayPickerProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export const DayPicker = ({
  value,
  onChange
}: DayPickerProps): React.ReactElement<DayPickerProps> => {
  const onToggle = (day: string, selected: boolean) => {
    if (selected) {
      onChange(value.filter((d: string) => d !== day));
    } else {
      onChange([...value, day]);
    }
  };

  return (
    <div className={styles.dayPicker}>
      {options.map((day: SFMenuOption) => {
        const selected: boolean = value.includes(day.value);
        return (
          <InteractiveBox
            key={day.value}
            onClick={() => onToggle(day.value, selected)}
            className={`${styles.day} ${selected ? styles.selected : ''}`}
          >
            <SFText type="component-button-L">{day.label}</SFText>
          </InteractiveBox>
        );
      })}
    </div>
  );
};
