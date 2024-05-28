import React from 'react';
import styles from './AgencyAreasForm.module.scss';
import { SFTextField } from 'sfui';
import { AreaFormValue } from '../../../../Models';
import { TourTooltip } from '../../../../Modules/Tour';

export interface AgencyAreasFormErrors {
  name: boolean;
  acronym: boolean;
}

export interface AgencyAreasFormProps {
  errors: AgencyAreasFormErrors;
  value: AreaFormValue;
  onChange: (value: AreaFormValue) => void;
}

export const AgencyAreasForm = ({
  errors,
  onChange,
  value
}: AgencyAreasFormProps): React.ReactElement<AgencyAreasFormProps> => {
  const onNameChange = (newValue: string) => {
    onChange({ ...value, name: newValue });
  };

  const onAcronymChange = (newValue: string) => {
    onChange({ ...value, acronym: newValue });
  };

  return (
    <div className={styles.agencyAreasForm}>
      <SFTextField
        required
        label="Name"
        value={value.name}
        error={errors.name}
        inputProps={{ maxLength: 32 }}
        helperText={
          errors.name
            ? 'This name is already taken.'
            : 'It must be between 1 and 32 characters.'
        }
        onChange={(e) => onNameChange(e.target.value)}
      />

      <TourTooltip
        title="Complete the fields"
        description="Type the area name and acronym. Please note that the maximum number of characters that each field has."
        step={2}
        lastStep={5}
        tourId={5}
        topZIndex
      >
        <SFTextField
          required
          label="Acronym"
          value={value.acronym}
          error={errors.acronym}
          inputProps={{ maxLength: 3 }}
          helperText={
            errors.acronym
              ? 'This acronym is already taken.'
              : `It must be between 1 and 3 characters. E.g. "CC1"`
          }
          onChange={(e) => onAcronymChange(e.target.value)}
        />
      </TourTooltip>
    </div>
  );
};
