import React from 'react';
import styles from './PaymentMethodOption.module.scss';
import { SFChip, SFRadio, SFRadioOptionsProps } from 'sfui';

export interface PaymentMethodOptionProps {
  option: SFRadioOptionsProps;
  checked: boolean;
  onChange: () => void;
}

export const PaymentMethodOption = ({
  option,
  checked,
  onChange
}: PaymentMethodOptionProps): React.ReactElement<PaymentMethodOptionProps> => {
  return (
    <div className={styles.paymentMethodOption}>
      <SFRadio {...option} checked={checked} onChange={onChange} />

      {option.value === 'card' && (
        <SFChip
          label="Immediate access to the plan"
          size="small"
          sfColor="primary"
          variant="outlined"
        />
      )}

      {option.value === 'debit' && (
        <SFChip
          label="Most Popular"
          size="small"
          sfColor="primary"
          variant="outlined"
        />
      )}
    </div>
  );
};
