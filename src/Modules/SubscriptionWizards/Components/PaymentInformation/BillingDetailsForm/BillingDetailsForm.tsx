import React from 'react';
import {
  SFAutocompleteLocation,
  SFAutocompleteLocationResult,
  SFNumericField,
  SFTextField
} from 'sfui';
import { WizardStepSection } from '../../WizardStepSection/WizardStepSection';
import { BillingDetailsValue } from '../../../../../Models';

export interface BillingDetailsFormProps {
  value: BillingDetailsValue;
  onChange: (value: BillingDetailsValue) => void;
}

export const BillingDetailsForm = ({
  value,
  onChange
}: BillingDetailsFormProps): React.ReactElement<BillingDetailsFormProps> => {
  return (
    <WizardStepSection title="Billing Details">
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
    </WizardStepSection>
  );
};
