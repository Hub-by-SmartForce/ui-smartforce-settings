import React from 'react';
import styles from './CreditCardForm.module.scss';
import { StripeCardError, StripeCreditCardForm } from '../../Components';
import { H3Alt } from '../H3Alt/H3Alt';

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
    <div className={styles.creditCardForm}>
      <H3Alt>Card Details</H3Alt>
      <StripeCreditCardForm
        error={error}
        name={name}
        onNameChange={onNameChange}
        onCardValidChange={onCardValidChange}
      />
    </div>
  );
};
