import React from 'react';
import styles from './NextInvoice.module.scss';
import { getInvoiceAmmount } from '../../../Helpers';
import { BillingCycleType } from '../../../Models';

export interface NextInvoiceProps {
  plan: string;
  billedSeats: number;
  billingCycle: BillingCycleType;
  canceled: boolean;
}

export const NextInvoice = ({
  plan,
  billedSeats,
  billingCycle,
  canceled
}: NextInvoiceProps): React.ReactElement<NextInvoiceProps> => {
  const nextInvoiceCost: string = `US$${getInvoiceAmmount(
    plan,
    billingCycle,
    billedSeats
  ).toFixed(2)}`;

  return (
    <div className={styles.nextInvoice}>
      <div className={styles.description}>
        <p className={styles.title}>Next Invoice</p>
        <p className={styles.text}>{canceled ? 'Canceled' : nextInvoiceCost}</p>
      </div>
    </div>
  );
};
