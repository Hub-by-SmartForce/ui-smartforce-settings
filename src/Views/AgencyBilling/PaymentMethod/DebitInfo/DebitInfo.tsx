import React from 'react';
import styles from './DebitInfo.module.scss';
import { SFText } from 'sfui';
import { SubscriptionPaymentDebit } from '../../../../Models';

export interface DebitInfoProps {
  debit: SubscriptionPaymentDebit;
}

export const DebitInfo = ({
  debit
}: DebitInfoProps): React.ReactElement<DebitInfoProps> => {
  return (
    <div className={styles.debitInfo}>
      <SFText type="component-1-medium">{`*** ${debit.last_4_digits}`}</SFText>
      <SFText type="component-1-medium">{debit.bank_name}</SFText>
    </div>
  );
};
