import React, { useContext } from 'react';
import styles from './ShiftForm.module.scss';
import {
  SFDatePicker,
  SFNumericField,
  SFPeopleOption,
  SFSelect,
  SFText,
  SFTextField
} from 'sfui';
import { AreasField } from '../../../../Components/AreasField/AreasField';
import { Divider } from '../../../../Components/Divider/Divider';
import { ShiftFormValue, ShiftRecurrence } from '../../../../Models';
import { MemberPicker } from '../../../../Components/MemberPicker/MemberPicker';
import { RepeatForm } from './RepeatForm/RepeatForm';
import { MultipleMemberPicker } from '../../../../Components/MultipleMemberPicker/MultipleMemberPicker';
import { ApiContext } from '../../../../Context';
import { getTimeOptions } from '../../../../Helpers';
import { RepeatInfo } from './RepeatInfo/RepeatInfo';

const TIME_OPTIONS = getTimeOptions();

export interface ShiftFormProps {
  value: ShiftFormValue;
  isEdit?: boolean;
  onChange: (value: ShiftFormValue) => void;
}

export const ShiftForm = ({
  value,
  isEdit,
  onChange
}: ShiftFormProps): React.ReactElement<ShiftFormProps> => {
  const apiBaseUrl = useContext(ApiContext).settings;

  const onDateTimeChange = (newValue: ShiftFormValue) => {
    if (newValue.start.date) {
      const endDate = newValue.start.date.clone();
      if (newValue.start.time >= newValue.end.time) {
        endDate.add(1, 'days');
      }

      onChange({
        ...newValue,
        end: {
          ...newValue.end,
          date: endDate
        }
      });
    } else {
      onChange(newValue);
    }
  };

  return (
    <div className={styles.shiftForm}>
      <div className={styles.section}>
        <SFTextField
          label="Title"
          required
          value={value.name}
          inputProps={{ maxLength: 32 }}
          helperText={'It must be between 1 and 32 characters.'}
          onChange={(e) =>
            onChange({
              ...value,
              name: e.target.value
            })
          }
        />

        <SFTextField
          required
          label="Acronym"
          value={value.acronym}
          inputProps={{ maxLength: 3 }}
          helperText={`It must be between 1 and 3 characters. E.g. "CC1"`}
          onChange={(e) =>
            onChange({
              ...value,
              acronym: e.target.value
            })
          }
        />

        <AreasField
          value={value.areas}
          onChange={(areas) =>
            onChange({
              ...value,
              areas
            })
          }
        />
      </div>

      <Divider />

      <div className={styles.section}>
        <SFText type="component-1-medium">Date and Time</SFText>

        <SFDatePicker
          label="Start date"
          required
          value={value.start.date}
          onChange={(date) =>
            onDateTimeChange({
              ...value,
              start: {
                ...value.start,
                date
              }
            })
          }
        />

        <div className={styles.timeRange}>
          <SFSelect
            label="Start time"
            required
            value={value.start.time}
            options={TIME_OPTIONS}
            onChange={(
              e: React.ChangeEvent<{
                name?: string | undefined;
                value: unknown;
              }>
            ) =>
              onDateTimeChange({
                ...value,
                start: {
                  ...value.start,
                  time: e.target.value as string
                }
              })
            }
          />

          <SFSelect
            label="End time"
            required
            value={value.end.time}
            options={TIME_OPTIONS}
            onChange={(
              e: React.ChangeEvent<{
                name?: string | undefined;
                value: unknown;
              }>
            ) =>
              onDateTimeChange({
                ...value,
                end: {
                  ...value.end,
                  time: e.target.value as string
                }
              })
            }
          />
        </div>

        <RepeatForm
          value={value.recurrence}
          onChange={(recurrence: ShiftRecurrence) =>
            onChange({
              ...value,
              recurrence
            })
          }
        />

        {value.start.date &&
          value.start.date.isValid() &&
          value.recurrence.days.length > 0 &&
          value.start.time.length > 0 &&
          value.end.time.length > 0 && (
            <RepeatInfo
              startDate={value.start.date}
              startTime={value.start.time}
              endTime={value.end.time}
              recurrence={value.recurrence}
            />
          )}
      </div>

      <Divider />

      <div className={styles.section}>
        <SFText type="component-1-medium">Staff</SFText>

        <SFNumericField
          label="Minimum staffing"
          required
          helperText="It takes at least one member to continue."
          value={value.min_staff}
          onChange={(e) =>
            onChange({
              ...value,
              min_staff: e.target.value
            })
          }
        />

        {!isEdit && (
          <MultipleMemberPicker
            baseUrl={apiBaseUrl}
            label="Add Members"
            value={value.participants}
            onChange={(participants: SFPeopleOption[]) =>
              onChange({
                ...value,
                participants
              })
            }
          />
        )}

        <MemberPicker
          activeOnly
          baseUrl={apiBaseUrl}
          label="Supervisor"
          value={value.supervisor}
          onChange={(supervisor: SFPeopleOption) =>
            onChange({
              ...value,
              supervisor
            })
          }
        />
      </div>
    </div>
  );
};
