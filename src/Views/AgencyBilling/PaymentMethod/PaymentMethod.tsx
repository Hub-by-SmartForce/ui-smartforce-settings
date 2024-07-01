import React, { useContext } from 'react';
import styles from './PaymentMethod.module.scss';
import { HttpStatusCode, SFText } from 'sfui';
import {
  PanelModal,
  PanelModalAnchor,
  StripeCardError,
  StripeCreditCardForm
} from '../../../Components';
import { useElements, useStripe } from '@stripe/react-stripe-js';
import { SubscriptionContext } from '../../../Context';
import { SETTINGS_CUSTOM_EVENT } from '../../../Constants';
import {
  dispatchCustomEvent,
  getCardErrorMessage,
  replaceElementAt
} from '../../../Helpers';
import { SettingsError, Subscription } from '../../../Models';
import { updateCreditCard, getStripeCardToken } from '../../../Services';
import { ApiContext } from '../../../Context';
import { CreditCardInfo } from './CreditCardInfo/CreditCardInfo';
import { DebitInfo } from './DebitInfo/DebitInfo';

export interface PaymentMethodProps {
  subscription: Subscription;
  onClose: () => void;
  onError: (e: SettingsError) => void;
}

export const PaymentMethod = ({
  subscription,
  onClose,
  onError
}: PaymentMethodProps): React.ReactElement<PaymentMethodProps> => {
  const apiBaseUrl = useContext(ApiContext).settings;
  const elements = useElements();
  const stripe = useStripe();
  const { setSubscriptions } = useContext(SubscriptionContext);

  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [paymentError, setPaymentError] = React.useState<
    StripeCardError | undefined
  >();

  const [isCreditCardValid, setIsCreditCardValid] =
    React.useState<boolean>(false);
  const [cardOwnerName, setCardOwnerName] = React.useState<string>('');

  const [anchor, setAnchor] = React.useState<PanelModalAnchor>('right');

  const isSaveDisabled = !isCreditCardValid || cardOwnerName === '';

  const onPanelClose = () => {
    setPaymentError(undefined);
    setCardOwnerName('');
    setIsOpen(false);
  };

  const onChangeLink = () => {
    setIsOpen(true);
  };

  const onStripeCreditCardChange = (isValid: boolean) => {
    setIsCreditCardValid(isValid);
  };

  const onCardOwnerNameChange = (name: string) => {
    setCardOwnerName(name);
  };

  const onCreditCardSubmit = async () => {
    setIsLoading(true);
    try {
      if (elements && stripe) {
        const stripeCardToken = await getStripeCardToken(
          cardOwnerName,
          stripe,
          elements
        );

        const newCardInformation = await updateCreditCard(
          apiBaseUrl,
          stripeCardToken,
          subscription.product
        );

        if (subscription) {
          setSubscriptions((subscriptions) => {
            const currentSubscriptionIndex = subscriptions.findIndex(
              (s) => s.id === subscription.id
            );

            return replaceElementAt(
              subscriptions,
              {
                ...subscription,
                payment: {
                  method: 'card',
                  card: { ...newCardInformation }
                }
              },
              currentSubscriptionIndex
            );
          });
        }

        dispatchCustomEvent(SETTINGS_CUSTOM_EVENT, {
          message: 'Your change was saved successfully.'
        });

        setIsLoading(false);
        onPanelClose();
      }
    } catch (e) {
      console.error('Settings::AgencyBilling::ChangeCreditCard');
      setIsLoading(false);
      const error: SettingsError = e as SettingsError;

      if (error.code === HttpStatusCode.BAD_REQUEST && error.detail) {
        const cardErrorMsg = getCardErrorMessage(error.detail);
        setPaymentError({
          title: 'We could not proceed with the credit card change.',
          message: cardErrorMsg
        });
      } else {
        onError(error);
      }
    }
  };

  return (
    <div className={styles.paymentMethod}>
      <PanelModal
        anchor={anchor}
        title="Change Credit Card"
        actionButton={{
          label: 'Save Changes',
          disabled: isSaveDisabled || isLoading,
          onClick: onCreditCardSubmit,
          isLoading: isLoading
        }}
        dialogCloseButton={{
          label: 'Discard',
          variant: 'text',
          sfColor: 'grey',
          onClick: onPanelClose
        }}
        isOpen={isOpen}
        onBack={onPanelClose}
        onClose={() => {
          setAnchor('bottom');
          onClose();
          onPanelClose();
        }}
      >
        <StripeCreditCardForm
          error={paymentError}
          name={cardOwnerName}
          onCardValidChange={onStripeCreditCardChange}
          onNameChange={onCardOwnerNameChange}
        />
      </PanelModal>

      <div className={styles.description}>
        <p className={styles.title}>Payment Method</p>

        {subscription.payment?.method === 'wire_transfer' && (
          <SFText type="component-1-medium">Wire Transfer</SFText>
        )}

        {subscription.payment?.method === 'check' && (
          <SFText type="component-1-medium">Check</SFText>
        )}
        {subscription.payment?.method === 'card' &&
          subscription.payment.card && (
            <CreditCardInfo
              card={subscription.payment.card}
              onChangeCardClick={onChangeLink}
            />
          )}
        {subscription.payment?.method === 'debit' &&
          subscription.payment.debit && (
            <DebitInfo debit={subscription.payment.debit} />
          )}
      </div>
    </div>
  );
};
