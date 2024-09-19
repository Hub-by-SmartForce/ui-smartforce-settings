import React from 'react';
import { WizardStepSection } from '../../WizardStepSection/WizardStepSection';
import {
  StripeCardError,
  StripeCreditCardForm
} from '../../../../../Components';

export interface CreditCardFormProps {
  error?: StripeCardError;
  name: string;
  onNameChange: (name: string) => void;
  onCardValidChange: (isValid: boolean) => void;
}

export const CreditCardForm = ({
  error,
  name,
  onNameChange,
  onCardValidChange
}: CreditCardFormProps): React.ReactElement<CreditCardFormProps> => {
  return (
    <WizardStepSection title="Card Details">
      <StripeCreditCardForm
        error={error}
        name={name}
        onNameChange={onNameChange}
        onCardValidChange={onCardValidChange}
      />
    </WizardStepSection>
  );
};
