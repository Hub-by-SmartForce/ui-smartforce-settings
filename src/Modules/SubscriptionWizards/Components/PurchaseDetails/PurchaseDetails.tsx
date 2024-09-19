import React from 'react';
import styles from './PurchaseDetails.module.scss';
import {
  SFButton,
  SFCounter,
  SFRadioGroup,
  SFRadioOptionsProps,
  SFScrollable,
  SFText
} from 'sfui';
import { WizardStepSection } from '../WizardStepSection/WizardStepSection';
import { Divider } from '../../../../Components/Divider/Divider';
import {
  ANNUALLY_FEE_ANALYTICS,
  MONTHLY_FEE_ANALYTICS
} from '../../../../Constants';
import { getPlanLabel } from '../../../../Helpers';
import { BillingCycleType, SubscriptionCoupon } from '../../../../Models';

function getFee(isAnnually: boolean): number {
  return isAnnually ? ANNUALLY_FEE_ANALYTICS : MONTHLY_FEE_ANALYTICS;
}

const CYCLE_OPTIONS: SFRadioOptionsProps[] = [
  { label: 'Pay annually', value: 'annually' },
  { label: 'Pay monthly', value: 'monthly' }
];

export interface BillingFormValue {
  billing_cycle: BillingCycleType;
  additional_seats: number;
}

export interface PurchaseDetailsProps {
  onChange: (value: BillingFormValue) => void;
  onContinue: () => void;
  plan: string;
  totalSeatsUsed: number;
  totalSeatsBilled?: number;
  value: BillingFormValue;
  additionalSeatsAvailable: boolean;
  coupon?: SubscriptionCoupon;
}

export const PurchaseDetails = ({
  onChange,
  onContinue,
  plan,
  totalSeatsUsed,
  totalSeatsBilled,
  value,
  additionalSeatsAvailable,
  coupon
}: PurchaseDetailsProps): React.ReactElement<PurchaseDetailsProps> => {
  const isAnnually: boolean = value.billing_cycle === 'annually';
  const fee = getFee(isAnnually);

  const membersCost = totalSeatsUsed * fee;
  const purchasedSeats = totalSeatsBilled
    ? Math.max(totalSeatsBilled - totalSeatsUsed, 0)
    : 0;
  const purchasedSeatsCost = purchasedSeats * fee;
  const additionalCost = value.additional_seats * fee;
  const subtotal = membersCost + purchasedSeatsCost + additionalCost;
  const discount = coupon ? (coupon.amount / 100) * subtotal : 0;
  const total = subtotal - discount;

  const priceLabel = `US$${fee} x member x ${
    isAnnually ? 'year' : 'month'
  } (annual plan)`;

  const planTitle = getPlanLabel(plan);

  return (
    <div className={styles.purchaseDetails}>
      <SFScrollable containerClassName={styles.scrollable}>
        <WizardStepSection title="Billing Cycle for your Annual Plan">
          <SFRadioGroup
            className={styles.options}
            options={CYCLE_OPTIONS}
            value={value.billing_cycle}
            onChange={(_e, newCycle: string) =>
              onChange({
                ...value,
                billing_cycle: newCycle as BillingCycleType
              })
            }
          ></SFRadioGroup>
        </WizardStepSection>

        <Divider />

        <WizardStepSection title={planTitle}>
          <div className={styles.membersPrice}>
            <div>
              <SFText type="component-1-medium">
                {totalSeatsUsed} members in your agency
              </SFText>
              <SFText type="component-2" sfColor="neutral">
                {priceLabel}
              </SFText>
            </div>
            <SFText type="component-1-medium">
              US${membersCost.toFixed(2)}
            </SFText>
          </div>

          {!additionalSeatsAvailable && (
            <div className={styles.membersPrice}>
              <div>
                <SFText type="component-1-medium">
                  {purchasedSeats} additional seats purchased
                </SFText>
                <SFText type="component-2" sfColor="neutral">
                  {priceLabel}
                </SFText>
              </div>
              <SFText type="component-1-medium">
                US${purchasedSeatsCost.toFixed(2)}
              </SFText>
            </div>
          )}

          {/* If isn't update and hasn't a subscription can set the additional seats value */}
          {additionalSeatsAvailable && (
            <div className={styles.additionalPrice}>
              <div>
                <SFText type="component-1-medium">Additional seats</SFText>
                <SFCounter
                  value={value.additional_seats}
                  onChange={(newCounter: number) =>
                    onChange({
                      ...value,
                      additional_seats: newCounter
                    })
                  }
                />
                <SFText type="component-2" sfColor="neutral">
                  {priceLabel}
                </SFText>
              </div>
              <SFText type="component-1-medium">
                US${additionalCost.toFixed(2)}
              </SFText>
            </div>
          )}

          {coupon && (
            <div className={styles.membersPrice}>
              <div>
                <SFText type="component-1-medium">Discount</SFText>
                <SFText type="component-2" sfColor="neutral">
                  {coupon.label}
                </SFText>
              </div>
              <SFText type="component-1-medium">
                US${discount.toFixed(2)}
              </SFText>
            </div>
          )}
        </WizardStepSection>

        <Divider />

        <div className={styles.price}>
          <h3>Total</h3>
          <h3>US${total.toFixed(2)}</h3>
        </div>
      </SFScrollable>

      <div className={styles.button}>
        <SFButton size="large" fullWidth onClick={onContinue}>
          Continue
        </SFButton>
      </div>
    </div>
  );
};
