import React, { Fragment, useContext } from 'react';
import styles from './AgencyBillingApp.module.scss';
import { SFButton, SFDivider } from 'sfui';
import { formatDateString, isFreePlan, isFreeTrial } from '../../../Helpers';
import {
  ApplicationProduct,
  SFApp,
  SettingsError,
  Subscription,
  SubscriptionPayment
} from '../../../Models';
import { CurrentPlan } from '../CurrentPlan/CurrentPlan';
import { NextInvoice } from '../NextInvoice/NextInvoice';
import { PaymentMethod } from '../PaymentMethod/PaymentMethod';
import { ThemeTypeContext } from '../../../Context';
import { AgencyBillingItem } from '../AgencyBillingItem/AgencyBillingItem';
import { BillingCycle } from '../BillingCycle/BillingCycle';

function hasPayment(payment: SubscriptionPayment | null): boolean {
  return (
    payment !== null &&
    ((payment?.method !== 'debit' && payment?.method !== 'card') ||
      (payment?.method === 'debit' && !!payment.debit) ||
      (payment?.method === 'card' && !!payment.card))
  );
}

export interface AgencyBillingAppProps {
  app: SFApp;
  subscription?: Subscription;
  currentProduct: ApplicationProduct;
  canUpdate: boolean;
  onClose: () => void;
  onError: (e: SettingsError) => void;
  onGenerateDebitUrl: (url: string) => void;
  onActivate: (product: ApplicationProduct) => void;
  onUpgrade: (product: string) => void;
  onGetStarted: (product: ApplicationProduct) => void;
}

export const AgencyBillingApp = ({
  app,
  subscription,
  currentProduct,
  canUpdate,
  onClose,
  onGetStarted,
  onActivate,
  onUpgrade,
  onError,
  onGenerateDebitUrl
}: AgencyBillingAppProps): React.ReactElement<AgencyBillingAppProps> => {
  const { themeType } = useContext(ThemeTypeContext);

  const isPending =
    !isFreePlan(subscription?.plan) &&
    ((subscription?.payment?.method === 'debit' &&
      !subscription.payment?.debit) ||
      (subscription?.unverified_payment?.method === 'debit' &&
        !subscription.unverified_payment.debit));

  const arePendingPayments =
    subscription?.renew ||
    (subscription?.billing_cycle === 'monthly' &&
      subscription.end_date !== subscription.renewal_date);

  return (
    <div className={styles.agencyBillingApp}>
      <div className={`${styles.section} ${styles.logo}`}>
        <img
          className={styles.image}
          src={`data:image/jpeg;base64,${
            themeType === 'day' ? app.logo.dayMode : app.logo.nightMode
          }`}
          alt="App Logo"
        />
        {!subscription && (
          <SFButton onClick={() => onGetStarted(app.product)}>
            Get Started
          </SFButton>
        )}
      </div>

      {subscription && (
        <div className={styles.section}>
          <CurrentPlan
            canUpdate={canUpdate}
            currentSubscription={subscription}
            product={currentProduct}
            isPending={isPending}
            onError={onError}
            onActivate={() => onActivate(subscription.product)}
            onUpgrade={() => onUpgrade(subscription.product)}
          />

          {isFreeTrial(subscription) && !subscription.renew && (
            <>
              <SFDivider />
              <AgencyBillingItem title="Expires on">
                {formatDateString(subscription.end_date, 'MMMM D, YYYY')}
              </AgencyBillingItem>
            </>
          )}

          {!isFreePlan(subscription.plan) &&
            (!isFreeTrial(subscription) || !!subscription?.payment?.method) && (
              <Fragment>
                <SFDivider />
                <BillingCycle
                  product={subscription.product}
                  cycle={subscription.billing_cycle}
                  nextCycle={subscription.next_billing_cycle}
                  canChange={
                    subscription.renew !== false &&
                    subscription.payment?.method === 'card' &&
                    !subscription.next_billing_cycle &&
                    subscription.billing_cycle === 'annually'
                  }
                  onClose={onClose}
                  onError={onError}
                />

                <SFDivider />
                <AgencyBillingItem
                  title="RENEWAL DATE"
                  children={`${formatDateString(
                    subscription.renewal_date,
                    'MMMM D, YYYY'
                  )}${!subscription.renew ? ' (canceled)' : ''}`}
                />

                <SFDivider />
                <AgencyBillingItem
                  title="Next Payment Due"
                  children={
                    arePendingPayments
                      ? formatDateString(subscription.end_date, 'MMMM D, YYYY')
                      : 'There are no more pending payments'
                  }
                />

                {subscription.renew && (
                  <>
                    <SFDivider />
                    <NextInvoice
                      plan={subscription.plan}
                      billingCycle={subscription.billing_cycle}
                      billedSeats={subscription.total_seats_billed}
                      coupon={subscription.next_coupon}
                    />
                  </>
                )}

                {hasPayment(subscription.payment) && (
                  <PaymentMethod
                    subscription={subscription}
                    onClose={onClose}
                    onError={onError}
                    onGenerateDebitUrl={onGenerateDebitUrl}
                  />
                )}
              </Fragment>
            )}
        </div>
      )}
    </div>
  );
};
