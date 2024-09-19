import React from 'react';
import styles from './NextInvoice.module.scss';
import { getInvoiceAmmount } from '../../../Helpers';
import { BillingCycleType, SubscriptionCoupon } from '../../../Models';
import { SFChip, SFText } from 'sfui';
import { AgencyBillingItem } from '../AgencyBillingItem/AgencyBillingItem';

function getPriceString(amount: number): string {
  return `US$${amount.toFixed(2)}`;
}

export interface NextInvoiceProps {
  plan: string;
  billedSeats: number;
  billingCycle: BillingCycleType;
  coupon?: SubscriptionCoupon;
}

export const NextInvoice = ({
  plan,
  billedSeats,
  billingCycle,
  coupon
}: NextInvoiceProps): React.ReactElement<NextInvoiceProps> => {
  const nextInvoiceCost = getInvoiceAmmount(plan, billingCycle, billedSeats);

  return (
    <AgencyBillingItem title="Next Invoice">
      <>
        {!coupon && (
          <SFText type="component-1-medium">
            {getPriceString(nextInvoiceCost)}
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
                {getPriceString(
                  nextInvoiceCost - (nextInvoiceCost * coupon.amount) / 100
                )}
              </SFText>

              <SFChip
                size="small"
                sfColor="primary"
                variant="outlined"
                label={coupon.label}
              />
            </div>
          </div>
        )}
      </>
    </AgencyBillingItem>
  );
};
