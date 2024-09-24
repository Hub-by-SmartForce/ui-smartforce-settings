import React from 'react';
import styles from './BillingDetailsForm.module.scss';
import {
  SFTextField,
  SFNumericField,
  SFAutocompleteLocation,
  SFAutocompleteLocationResult
} from 'sfui';
import { BillingDetailsValue } from '../../Models';
import { H3Alt } from '../H3Alt/H3Alt';

export interface BillingDetailsFormProps {
  value: BillingDetailsValue;
  onChange: (value: BillingDetailsValue) => void;
}

export const BillingDetailsForm = ({
  value,
  onChange
}: BillingDetailsFormProps): React.ReactElement<BillingDetailsFormProps> => {
  return (
    <div className={styles.billingDetailsForm}>
      <H3Alt>Billing Details</H3Alt>

      <SFTextField
        label="Full Name"
        required
        value={value.full_name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange({
            ...value,
            full_name: e.target.value
          })
        }
      />

      <SFNumericField
        label="Phone"
        required
        numberFormatProps={{ format: '(###) ###-####' }}
        value={value.phone}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange({
            ...value,
            phone: e.target.value
          })
        }
      />

      <SFAutocompleteLocation
        label="Full Address"
        required
        value={{ text: value.full_address ?? '' }}
        onChange={(result: SFAutocompleteLocationResult) =>
          onChange({
            ...value,
            full_address: result.text
          })
        }
      />
    </div>
  );
};
