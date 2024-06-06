import React, { Fragment, useContext, useMemo } from 'react';
import styles from './AgencyBilling.module.scss';
import { CurrentPlan } from './CurrentPlan/CurrentPlan';
import { NextInvoice } from './NextInvoice/NextInvoice';
import { NextPayment } from './NextPayment/NextPayment';
import { PaymentMethod } from './PaymentMethod/PaymentMethod';
import {
  CustomerContext,
  SubscriptionContext,
  ThemeTypeContext
} from '../../Context';
import { loadStripeAPI } from '../../Services';
import { Elements } from '@stripe/react-stripe-js';
import { getAppSubscription, isFreeCustomer } from '../../Helpers';
import { ApplicationProduct, SFApp, SettingsError } from '../../Models';
import { SFButton, SFText } from 'sfui';
import { SF_APPS } from '../../Constants/Apps';

export interface AgencyBillingProps {
  canUpdate: boolean;
  stripeApiKey: string;
  product: ApplicationProduct;
  onClose: () => void;
  onError: (e: SettingsError) => void;
  onUpgrade: (product: string) => void;
  onGetStarted: (product: ApplicationProduct) => void;
}

export const AgencyBilling = ({
  canUpdate,
  stripeApiKey,
  product,
  onClose,
  onError,
  onUpgrade,
  onGetStarted
}: AgencyBillingProps): React.ReactElement<AgencyBillingProps> => {
  const subscriptions = React.useContext(SubscriptionContext).subscriptions;
  const { customer } = useContext(CustomerContext);
  const { themeType } = useContext(ThemeTypeContext);
  const stripeAPI = useMemo(() => loadStripeAPI(stripeApiKey), [stripeApiKey]);
  const { total_seats_billed, total_seats_used } = subscriptions[0];

  return (
    <div className={styles.agencyBilling}>
      <div className={styles.seats}>
        <div className={styles.information}>
          <SFText className={styles.title} type="component-title">
            Members
          </SFText>
          <SFText type="component-title-number">{total_seats_used}</SFText>
        </div>
        <div className={styles.information}>
          <SFText className={styles.title} type="component-title">
            Additional Seats
          </SFText>
          <SFText type="component-title-number">
            {total_seats_billed <= 0
              ? 0
              : total_seats_billed - total_seats_used}
          </SFText>
        </div>
      </div>
      {subscriptions &&
        SF_APPS.map((app: SFApp) => {
          const subscription = getAppSubscription(subscriptions, app.product);
          const isSubscriptionCanceled: boolean =
            subscription?.renew === false ?? false;

          return (
            <div className={styles.card} key={app.product}>
              <div className={`${styles.section} ${styles.logo}`}>
                <img
                  className={styles.image}
                  src={`data:image/jpeg;base64,${
                    themeType === 'day' ? app.logo.dayMode : app.logo.nightMode
                  }`}
                  alt=""
                />
                {!subscription && (
                  <SFButton onClick={() => onGetStarted(app.product)}>
                    Get Started
                  </SFButton>
                )}
              </div>
              {subscription && (
                <Fragment>
                  <div className={styles.section}>
                    <CurrentPlan
                      canUpdate={canUpdate}
                      currentSubscription={subscription}
                      product={product}
                      onError={onError}
                      onUpgrade={() => onUpgrade(subscription.product)}
                    />
                  </div>
                  <div className={styles.section}>
                    {!isFreeCustomer(customer, subscription.plan) && (
                      <Fragment>
                        {subscription.status === 'Active' && (
                          <Fragment>
                            <NextPayment
                              paymentDue={subscription.end_date}
                              canceled={isSubscriptionCanceled}
                            />
                            <NextInvoice
                              plan={subscription.plan}
                              billingCycle={subscription.billing_cycle}
                              billedSeats={subscription.total_seats_billed}
                              canceled={isSubscriptionCanceled}
                            />
                          </Fragment>
                        )}
                        {subscription.payment &&
                          subscription.status !== 'Canceled' && (
                            <Elements stripe={stripeAPI}>
                              <PaymentMethod
                                subscription={subscription}
                                onClose={onClose}
                                onError={onError}
                              />
                            </Elements>
                          )}
                      </Fragment>
                    )}
                  </div>
                </Fragment>
              )}
            </div>
          );
        })}
    </div>
  );
};
