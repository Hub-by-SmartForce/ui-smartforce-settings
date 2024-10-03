import React, { useContext } from 'react';
import { SFButton, SFDivider, SFText } from 'sfui';
import { UserContext } from '../../../Context';
import { AGENCY_SUBSCRIPTION_UPDATE } from '../../../Constants';
import { checkPermissions } from '../../../Helpers';
import { SettingsError, Subscription } from '../../../Models';
import { CreditCardInfo } from './CreditCardInfo/CreditCardInfo';
import { DebitInfo } from './DebitInfo/DebitInfo';
import { AgencyBillingItem } from '../AgencyBillingItem/AgencyBillingItem';
import { ChangeCreditCardModal } from './ChangeCreditCardModal/ChangeCreditCardModal';
import { ChangePaymentMethodModal } from './ChangePaymentMethodModal/ChangePaymentMethodModal';

export interface PaymentMethodProps {
  subscription: Subscription;
  onClose: () => void;
  onError: (e: SettingsError) => void;
  onGenerateDebitUrl: (url: string) => void;
}

export const PaymentMethod = ({
  subscription,
  onClose,
  onError,
  onGenerateDebitUrl
}: PaymentMethodProps): React.ReactElement<PaymentMethodProps> => {
  const { user } = useContext(UserContext);

  const [isChangeCardOpen, setIsChangeCardOpen] =
    React.useState<boolean>(false);
  const [isChangeMethodOpen, setIsChangeMethodOpen] =
    React.useState<boolean>(false);

  const showCreditCardChangeButton =
    checkPermissions(AGENCY_SUBSCRIPTION_UPDATE, user?.role.permissions) &&
    subscription.payment?.method === 'card' &&
    subscription.payment.card &&
    !subscription.unverified_payment;

  const showMethodChangeButton =
    checkPermissions(AGENCY_SUBSCRIPTION_UPDATE, user?.role.permissions) &&
    !subscription.unverified_payment &&
    subscription.billing_cycle !== 'monthly' &&
    subscription.next_billing_cycle !== 'monthly';

  return (
    <>
      <ChangeCreditCardModal
        subscription={subscription}
        isOpen={isChangeCardOpen}
        onPanelClose={() => setIsChangeCardOpen(false)}
        onClose={onClose}
        onError={onError}
      />

      <ChangePaymentMethodModal
        subscription={subscription}
        isOpen={isChangeMethodOpen}
        onPanelClose={() => setIsChangeMethodOpen(false)}
        onClose={onClose}
        onError={onError}
        onGenerateDebitUrl={onGenerateDebitUrl}
      />

      <SFDivider />
      <AgencyBillingItem
        title="Payment Method"
        action={
          <>
            {showCreditCardChangeButton ? (
              <SFButton
                size="small"
                variant="text"
                color="primary"
                onClick={() => {
                  setIsChangeCardOpen(true);
                }}
              >
                Change Credit Card
              </SFButton>
            ) : undefined}
            {showMethodChangeButton ? (
              <SFButton
                size="small"
                variant="text"
                color="primary"
                onClick={() => {
                  setIsChangeMethodOpen(true);
                }}
              >
                Change Payment Method
              </SFButton>
            ) : undefined}
          </>
        }
      >
        {!subscription.unverified_payment && (
          <>
            {(subscription.payment?.method === 'check' ||
              subscription.payment?.method === 'wire_transfer') && (
              <SFText type="component-1-medium">Manual Payment</SFText>
            )}

            {subscription.payment?.method === 'debit' &&
              subscription.payment.debit && (
                <DebitInfo debit={subscription.payment.debit} />
              )}
          </>
        )}

        {(!subscription.unverified_payment ||
          subscription.unverified_payment.payment_method_setup_url) &&
          subscription.payment?.method === 'card' &&
          subscription.payment.card && (
            <CreditCardInfo card={subscription.payment.card} />
          )}

        {subscription.unverified_payment &&
          subscription.unverified_payment?.method === 'debit' &&
          subscription.unverified_payment.debit && (
            <DebitInfo debit={subscription.unverified_payment.debit} />
          )}
      </AgencyBillingItem>
    </>
  );
};
