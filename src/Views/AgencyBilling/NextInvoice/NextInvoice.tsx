import React from 'react';
import styles from './NextInvoice.module.scss';
import { getInvoiceAmmount } from '../../../Helpers';
import { BillingCycleType, SubscriptionCoupon } from '../../../Models';
import { SFChip, SFText } from 'sfui';

function getPriceString(amount: number): string {
  return `US$${amount.toFixed(2)}`;
}

export interface NextInvoiceProps {
  plan: string;
  billedSeats: number;
  billingCycle: BillingCycleType;
  canceled: boolean;
  coupon?: SubscriptionCoupon;
}

export const NextInvoice = ({
  plan,
  billedSeats,
  billingCycle,
  canceled,
  coupon
}: NextInvoiceProps): React.ReactElement<NextInvoiceProps> => {
  const nextInvoiceCost = getInvoiceAmmount(plan, billingCycle, billedSeats);

  return (
    <div className={styles.nextInvoice}>
      <SFText type="component-messages" sfColor="neutral">
        NEXT INVOICE
      </SFText>

      {!coupon && (
        <SFText type="component-1-medium">
          {canceled ? 'Canceled' : getPriceString(nextInvoiceCost)}
        </SFText>
      )}

      {coupon && coupon.type === 'percent' && (
        <div>
          <SFText
            className={styles.withoutDiscountAmount}
            type="component-chip-S-M"
          >
            {getPriceString(nextInvoiceCost)}
          </SFText>

          <div className={styles.withDiscountAmount}>
            <SFText type="component-1-medium">
              {getPriceString((nextInvoiceCost * coupon.amount) / 100)}
            </SFText>

            <SFChip
              size="small"
              sfColor="primary"
              variant="outlined"
              label={`${coupon.amount}% ${coupon.name}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};
