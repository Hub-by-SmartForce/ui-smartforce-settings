import React, { useState } from 'react';
import styles from './ChangePaymentMethodModal.module.scss';
import {
  PanelModal,
  PanelModalAnchor,
  StripeCardError
} from '../../../../Components';
import { HttpStatusCode, SFRadio, SFRadioOptionsProps } from 'sfui';
import {
  BillingDetailsValue,
  SettingsError,
  Subscription,
  SubscriptionPaymentMethod
} from '../../../../Models';
import { BillingDetailsForm } from '../../../../Components/BillingDetailsForm/BillingDetailsForm';
import {
  dispatchCustomEvent,
  getCardErrorMessage,
  isFormEmpty
} from '../../../../Helpers';
import { CreditCardForm } from '../../../../Components/CreditCardForm/CreditCardForm';
import { SETTINGS_CUSTOM_EVENT } from '../../../../Constants';

function getOptions(method?: SubscriptionPaymentMethod): SFRadioOptionsProps[] {
  let result: SFRadioOptionsProps[] = [];
  if (method !== 'card') {
    result = [{ label: 'Credit Card', value: 'card' }];
  }
  if (method !== 'debit') {
    result = [...result, { label: 'Bank Account', value: 'debit' }];
  }
  return result;
}

function getIsButtonDisabled(
  billingDetails: BillingDetailsValue,
  cardName: string,
  isCardValid: boolean,
  method?: SubscriptionPaymentMethod
): boolean {
  return (
    (method === 'debit' && isFormEmpty<BillingDetailsValue>(billingDetails)) ||
    (method === 'card' && (!isCardValid || cardName.length === 0))
  );
}

function getInitialMethod(
  subscription: Subscription
): SubscriptionPaymentMethod {
  if (subscription.payment?.method === 'card') {
    return 'debit';
  } else {
    return 'card';
  }
}

const initialBillingDetails = {
  full_name: '',
  phone: '',
  full_address: ''
};

export interface ChangePaymentMethodModalProps {
  subscription: Subscription;
  isOpen: boolean;
  onClose: () => void;
  onError: (e: SettingsError) => void;
  onPanelClose: () => void;
  onGenerateDebitUrl: (url: string) => void;
}

export const ChangePaymentMethodModal = ({
  subscription,
  isOpen,
  onClose,
  onError,
  onPanelClose,
  onGenerateDebitUrl
}: ChangePaymentMethodModalProps): React.ReactElement<ChangePaymentMethodModalProps> => {
  const [anchor, setAnchor] = useState<PanelModalAnchor>('right');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [method, setMethod] = useState<SubscriptionPaymentMethod>(
    getInitialMethod(subscription)
  );
  const [isCardValid, setIsCardValid] = useState<boolean>(false);
  const [cardName, setCardName] = useState<string>('');
  const [paymentError, setPaymentError] = useState<
    StripeCardError | undefined
  >();
  const [billingDetailsValue, setBillingDetailsValue] =
    useState<BillingDetailsValue>(initialBillingDetails);

  const clearForms = () => {
    setBillingDetailsValue(initialBillingDetails);
    setCardName('');
    setIsCardValid(false);
  };

  const onCreditCardValidChange = (valid: boolean) => {
    if (valid !== isCardValid) {
      setIsCardValid(valid);
    }
  };

  const onSave = () => {
    setIsLoading(true);

    if (method === 'card') {
      try {
        // TODO api call

        dispatchCustomEvent(SETTINGS_CUSTOM_EVENT, {
          message: 'Your change was saved successfully.'
        });

        setIsLoading(false);
        onPanelClose();
      } catch (e: any) {
        setIsLoading(false);

        if (e.code === HttpStatusCode.BAD_REQUEST) {
          const cardErrorMsg = getCardErrorMessage(e.detail);
          setPaymentError({
            title: 'We could not proceed with the payment.',
            message: cardErrorMsg
          });
        } else {
          onError(e);
        }
      }
    } else {
      try {
        // TODO api call to get url
        let url = '';
        onGenerateDebitUrl(url);
        setIsLoading(false);
        onPanelClose();
      } catch (e: any) {
        onError(e);
      }
    }
  };

  const onExitCloseTransition = () => {
    setMethod(getInitialMethod(subscription));
    clearForms();
  };

  return (
    <PanelModal
      onExit={onExitCloseTransition}
      anchor={anchor}
      title="Change Payment Method"
      actionButton={{
        label: method === 'debit' ? 'Generate Payment Link' : 'Save Changes',
        disabled:
          getIsButtonDisabled(
            billingDetailsValue,
            cardName,
            isCardValid,
            method
          ) || isLoading,
        onClick: onSave,
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
      <div className={styles.changePaymentMethodModal}>
        <div className={styles.radioOptions}>
          {getOptions(subscription.payment?.method).map((option) => (
            <SFRadio
              key={option.value}
              label={option.label}
              checked={method === option.value}
              onChange={() => {
                clearForms();
                setMethod(option.value as SubscriptionPaymentMethod);
              }}
            />
          ))}
        </div>

        <div className={styles.form}>
          {method === 'card' && (
            <CreditCardForm
              error={paymentError}
              name={cardName}
              onNameChange={(cardName) => setCardName(cardName)}
              onCardValidChange={onCreditCardValidChange}
            />
          )}

          {method && (
            <BillingDetailsForm
              value={billingDetailsValue}
              onChange={(v) => setBillingDetailsValue(v)}
            />
          )}
        </div>
      </div>
    </PanelModal>
  );
};
