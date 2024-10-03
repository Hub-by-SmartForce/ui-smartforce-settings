import React, { useContext, useState } from 'react';
import {
  PanelModal,
  PanelModalAnchor,
  StripeCardError,
  StripeCreditCardForm
} from '../../../../Components';
import { SettingsError, Subscription } from '../../../../Models';
import { HttpStatusCode } from 'sfui';
import { SETTINGS_CUSTOM_EVENT } from '../../../../Constants';
import {
  replaceElementAt,
  dispatchCustomEvent,
  getCardErrorMessage
} from '../../../../Helpers';
import { getStripeCardToken, updateCreditCard } from '../../../../Services';
import { useElements, useStripe } from '@stripe/react-stripe-js';
import { ApiContext, SubscriptionContext } from '../../../../Context';

export interface ChangeCreditCardModalProps {
  subscription: Subscription;
  isOpen: boolean;
  onClose: () => void;
  onError: (e: SettingsError) => void;
  onPanelClose: () => void;
}

export const ChangeCreditCardModal = ({
  subscription,
  isOpen,
  onClose,
  onError,
  ...props
}: ChangeCreditCardModalProps): React.ReactElement<ChangeCreditCardModalProps> => {
  const apiBaseUrl = useContext(ApiContext).settings;
  const { setSubscriptions } = useContext(SubscriptionContext);
  const elements = useElements();
  const stripe = useStripe();
  const [anchor, setAnchor] = useState<PanelModalAnchor>('right');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentError, setPaymentError] = React.useState<
    StripeCardError | undefined
  >();
  const [isCreditCardValid, setIsCreditCardValid] =
    React.useState<boolean>(false);
  const [cardOwnerName, setCardOwnerName] = React.useState<string>('');

  const isSaveDisabled = !isCreditCardValid || cardOwnerName === '';

  const onPanelClose = () => {
    setPaymentError(undefined);
    setCardOwnerName('');
    props.onPanelClose();
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
  );
};
