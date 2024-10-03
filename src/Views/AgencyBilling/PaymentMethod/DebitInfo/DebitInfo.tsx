import React from 'react';
import styles from './DebitInfo.module.scss';
import { SFChip, SFText } from 'sfui';
import { SubscriptionPaymentDebit } from '../../../../Models';

export interface DebitInfoProps {
  debit: SubscriptionPaymentDebit;
  isPending?: boolean;
}

export const DebitInfo = ({
  debit,
  isPending = false
}: DebitInfoProps): React.ReactElement<DebitInfoProps> => {
  return (
    <div className={styles.debitInfo}>
      <SFText type="component-1-medium">{`*** ${debit.last_4_digits}`}</SFText>
      <SFText type="component-1-medium">{debit.bank_name}</SFText>
      {isPending && (
        <div className={styles.chip}>
          <SFChip
            label="Processing payment method change"
            size="small"
            sfColor="primary"
          />
        </div>
      )}
    </div>
  );
};
