import React from 'react';
import styles from './RepeatForm.module.scss';
import { ShiftRecurrence } from '../../../../../Models';
import { SFDivider, SFNumericField, SFSelect } from 'sfui';
import { DayPicker } from './DayPicker/DayPicker';

export interface RepeatFormProps {
  value: ShiftRecurrence;
  onChange: (value: ShiftRecurrence) => void;
}

export const RepeatForm = ({
  value,
  onChange
}: RepeatFormProps): React.ReactElement<RepeatFormProps> => {
  return (
    <div className={styles.repeatForm}>
      <SFSelect
        label="Repeat"
        options={[{ label: 'Custom', value: 'Custom' }]}
        value="Custom"
        disabled
      />

      <SFDivider />

      <div className={styles.inner}>
        <SFSelect
          label="Frequency"
          options={[{ label: 'Weekly', value: 'Weekly' }]}
          value={value.frequency}
          disabled
        />

        <SFNumericField
          label="Every x week(s) on"
          value={value.interval}
          disabled
        />

        <DayPicker
          value={value.days}
          onChange={(days: string[]) =>
            onChange({
              ...value,
              days
            })
          }
        />
      </div>
    </div>
  );
};
