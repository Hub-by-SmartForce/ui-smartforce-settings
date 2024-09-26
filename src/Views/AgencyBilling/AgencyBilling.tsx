import React, { useMemo } from 'react';
import styles from './AgencyBilling.module.scss';
import { Elements } from '@stripe/react-stripe-js';
import { SFText } from 'sfui';
import { SubscriptionContext } from '../../Context';
import { loadStripeAPI } from '../../Services';
import { getAppSubscription } from '../../Helpers';
import { ApplicationProduct, SFApp, SettingsError } from '../../Models';
import { SF_APPS } from '../../Constants/Apps';
import { AgencyBillingApp } from './AgencyBillingApp/AgencyBillingApp';

export interface AgencyBillingProps {
  canUpdate: boolean;
  stripeApiKey: string;
  product: ApplicationProduct;
  onClose: () => void;
  onError: (e: SettingsError) => void;
  onActivate: (product: ApplicationProduct) => void;
  onUpgrade: (product: string) => void;
  onGetStarted: (product: ApplicationProduct) => void;
  onGenerateDebitUrl: (url: string) => void;
}

export const AgencyBilling = ({
  canUpdate,
  stripeApiKey,
  product,
  onClose,
  onError,
  onActivate,
  onUpgrade,
  onGetStarted,
  onGenerateDebitUrl
}: AgencyBillingProps): React.ReactElement<AgencyBillingProps> => {
  const subscriptions = React.useContext(SubscriptionContext).subscriptions;
  const stripeAPI = useMemo(() => loadStripeAPI(stripeApiKey), [stripeApiKey]);
  const { total_seats_billed, total_seats_used } = subscriptions[0];

  return (
    <Elements stripe={stripeAPI}>
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
          SF_APPS.map((app: SFApp) => (
            <AgencyBillingApp
              key={app.product}
              app={app}
              subscription={getAppSubscription(subscriptions, app.product)}
              currentProduct={product}
              canUpdate={canUpdate}
              onClose={onClose}
              onGetStarted={onGetStarted}
              onActivate={onActivate}
              onUpgrade={onUpgrade}
              onError={onError}
              onGenerateDebitUrl={onGenerateDebitUrl}
            />
          ))}
      </div>
    </Elements>
  );
};
