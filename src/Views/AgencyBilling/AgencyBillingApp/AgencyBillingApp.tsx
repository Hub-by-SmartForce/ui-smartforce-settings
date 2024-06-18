import React, { Fragment, useContext } from 'react';
import styles from './AgencyBillingApp.module.scss';
import { SFButton } from 'sfui';
import { isFreePlan, isFreeTrial } from '../../../Helpers';
import {
  ApplicationProduct,
  SFApp,
  SettingsError,
  Subscription
} from '../../../Models';
import { CurrentPlan } from '../CurrentPlan/CurrentPlan';
import { NextInvoice } from '../NextInvoice/NextInvoice';
import { NextPayment } from '../NextPayment/NextPayment';
import { PaymentMethod } from '../PaymentMethod/PaymentMethod';
import { ThemeTypeContext } from '../../../Context';

export interface AgencyBillingAppProps {
  app: SFApp;
  subscription?: Subscription;
  currentProduct: ApplicationProduct;
  canUpdate: boolean;
  onClose: () => void;
  onError: (e: SettingsError) => void;
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
  onError
}: AgencyBillingAppProps): React.ReactElement<AgencyBillingAppProps> => {
  const { themeType } = useContext(ThemeTypeContext);

  const freeTrial = isFreeTrial(subscription);
  const isCanceled = !subscription?.renew;
  const hasNextPayment = !isCanceled || !freeTrial;

  return (
    <div className={styles.agencyBillingApp}>
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
              product={currentProduct}
              onError={onError}
              onActivate={() => onActivate(subscription.product)}
              onUpgrade={() => onUpgrade(subscription.product)}
            />
          </div>

          {!isFreePlan(subscription.plan) && (
            <div className={styles.section}>
              <Fragment>
                {subscription.status === 'Active' && subscription.payment && (
                  <Fragment>
                    <NextPayment
                      paymentDue={subscription.end_date}
                      canceled={isCanceled}
                    />

                    {hasNextPayment && (
                      <NextInvoice
                        plan={subscription.plan}
                        billingCycle={subscription.billing_cycle}
                        billedSeats={subscription.total_seats_billed}
                        canceled={isCanceled}
                        coupon={subscription.next_coupon}
                      />
                    )}
                  </Fragment>
                )}

                {hasNextPayment &&
                  subscription.payment &&
                  subscription.status !== 'Canceled' && (
                    <PaymentMethod
                      subscription={subscription}
                      onClose={onClose}
                      onError={onError}
                    />
                  )}
              </Fragment>
            </div>
          )}
        </Fragment>
      )}
    </div>
  );
};
