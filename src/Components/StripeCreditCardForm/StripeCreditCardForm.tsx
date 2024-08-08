import React from 'react';
import styles from './StripeCreditCardForm.module.scss';

import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement
} from '@stripe/react-stripe-js';

import {
  StripeCardCvcElementChangeEvent,
  StripeCardCvcElementOptions,
  StripeCardExpiryElementChangeEvent,
  StripeCardExpiryElementOptions,
  StripeCardNumberElementChangeEvent,
  StripeCardNumberElementOptions
} from '@stripe/stripe-js';

import { SFAlert, SFSpinner, SFTextField } from 'sfui';
import {
  getElementClasses,
  getElementStyle
} from './StripeElementStyles/StripeElementStyles';
import { ThemeTypeContext } from '../../Context';

interface StripeInputState {
  complete: boolean;
  error: boolean;
}

const initStripeInputState = {
  complete: false,
  error: false
};

const initStripeInputs = {
  number: initStripeInputState,
  expire: initStripeInputState,
  cvc: initStripeInputState
};

const initReadyElements = {
  number: false,
  expire: false,
  cvc: false
};

export interface StripeCardError {
  title: string;
  message: string;
}

export interface StripeCreditCardFormProps {
  error?: StripeCardError;
  name: string;
  onNameChange: (name: string) => void;
  onCardValidChange: (isValid: boolean) => void;
}

export const StripeCreditCardForm = ({
  error,
  name,
  onCardValidChange,
  onNameChange
}: StripeCreditCardFormProps): React.ReactElement<StripeCreditCardFormProps> => {
  const { themeType } = React.useContext(ThemeTypeContext);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const refStripeInputs =
    React.useRef<Record<string, StripeInputState>>(initStripeInputs);

  const refReadyElements = React.useRef(initReadyElements);

  const onReady = (elementName: string) => {
    refReadyElements.current = {
      ...refReadyElements.current,
      [elementName]: true
    };

    if (
      refReadyElements.current.cvc &&
      refReadyElements.current.expire &&
      refReadyElements.current.number
    ) {
      setIsLoading(false);
    }
  };

  const onInputChange = (
    name: string,
    e:
      | StripeCardNumberElementChangeEvent
      | StripeCardExpiryElementChangeEvent
      | StripeCardCvcElementChangeEvent
  ) => {
    // Update input state ref
    refStripeInputs.current[name] = {
      complete: e.complete,
      error: !!e.error
    };
    let valid = true;

    // Check if the inputs are valid (complete and without error)
    for (const key in refStripeInputs.current) {
      const inputState = refStripeInputs.current[key];
      if (!inputState.complete || inputState.error) {
        valid = false;
        break;
      }
    }

    onCardValidChange(valid);
  };

  const CARD_NUMBER_ELEMENT_OPTIONS: StripeCardNumberElementOptions = {
    showIcon: true,
    iconStyle: 'solid',
    placeholder: 'Card Number *',
    classes: getElementClasses(),
    style: getElementStyle(themeType)
  };

  const CARD_CVC_ELEMENT_OPTIONS: StripeCardCvcElementOptions = {
    placeholder: 'Security Code *',
    classes: getElementClasses(),
    style: getElementStyle(themeType)
  };

  const CARD_EXPIRY_ELEMENT_OPTIONS: StripeCardExpiryElementOptions = {
    placeholder: 'Expiry Date *',
    classes: getElementClasses(),
    style: getElementStyle(themeType)
  };

  return (
    <div className={styles.stripeCreditCardForm}>
      {error && (
        <SFAlert type="error" title={error.title}>
          {error.message}
        </SFAlert>
      )}

      {isLoading && (
        <SFSpinner aria-label="Initializing form" className={styles.spinner} />
      )}

      <div className={`${styles.form} ${isLoading ? styles.isLoading : ''}`}>
        <CardNumberElement
          options={CARD_NUMBER_ELEMENT_OPTIONS}
          onChange={(e: StripeCardNumberElementChangeEvent) =>
            onInputChange('number', e)
          }
          onReady={() => onReady('number')}
        />

        <SFTextField
          value={name}
          label="Name on Card"
          required
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onNameChange(e.target.value)
          }
        />

        <div className={styles.cardInformation}>
          <CardExpiryElement
            options={CARD_EXPIRY_ELEMENT_OPTIONS}
            onChange={(e: StripeCardExpiryElementChangeEvent) =>
              onInputChange('expire', e)
            }
            onReady={() => onReady('expire')}
          />
          <CardCvcElement
            options={CARD_CVC_ELEMENT_OPTIONS}
            onChange={(e: StripeCardCvcElementChangeEvent) =>
              onInputChange('cvc', e)
            }
            onReady={() => onReady('cvc')}
          />
        </div>
      </div>
    </div>
  );
};
