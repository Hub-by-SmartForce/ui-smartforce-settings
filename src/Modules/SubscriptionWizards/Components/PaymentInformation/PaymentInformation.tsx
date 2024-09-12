import React, { useEffect, useState } from 'react';
import styles from './PaymentInformation.module.scss';
import {
  SFButton,
  SFCheckbox,
  SFLink,
  SFRadioOptionsProps,
  SFScrollable,
  SFScrollableRefHandler
} from 'sfui';
import { WizardStepSection } from '../WizardStepSection/WizardStepSection';
import { CreditCardForm } from './CreditCardForm/CreditCardForm';
import { BillingDetailsForm } from './BillingDetailsForm/BillingDetailsForm';
import { PaymentMethodOption } from './PaymentMethodOption/PaymentMethodOption';
import { StripeCardError } from '../../../../Components';
import { isFormEmpty, isValueEmpty } from '../../../../Helpers';
import { BillingDetailsValue } from '../../../../Models';

function getIsButtonDisabled(
  method: string,
  value: PaymentFormValue,
  isCardValid: boolean
): boolean {
  if (
    !value.acceptConditions ||
    isFormEmpty<BillingDetailsValue>(value.billing_details)
  ) {
    return true;
  } else {
    if (method === 'card') {
      return isValueEmpty(value.cardName) || !isCardValid;
    }
  }

  return false;
}

function getOptions(hideDebit: boolean): SFRadioOptionsProps[] {
  let result: SFRadioOptionsProps[] = [{ label: 'Credit Card', value: 'card' }];
  if (hideDebit) {
    result = [...result, { label: 'Bank Account', value: 'debit' }];
  }
  return result;
}

export interface PaymentFormValue {
  acceptConditions: boolean;
  billing_details: BillingDetailsValue;
  cardName: string;
}

export interface PaymentInformationProps {
  method: string;
  hideDebit: boolean;
  onChange: (value: PaymentFormValue) => void;
  onConfirm: () => void;
  onMethodChange: (method: string) => void;
  error?: StripeCardError;
  value: PaymentFormValue;
}

export const PaymentInformation = React.forwardRef(
  (
    {
      error,
      method,
      hideDebit,
      onChange,
      onConfirm,
      onMethodChange,
      value
    }: PaymentInformationProps,
    ref: React.Ref<SFScrollableRefHandler>
  ) => {
    const [isCardValid, setIsCardValid] = useState<boolean>(false);

    useEffect(() => {
      // If method change reset card valid state
      // because the strip inputs will be cleaned
      setIsCardValid(false);
    }, [method]);

    const onCreditCardValidChange = (valid: boolean) => {
      if (valid !== isCardValid) {
        setIsCardValid(valid);
      }
    };

    return (
      <div className={styles.paymentInformation}>
        <SFScrollable containerClassName={styles.scrollable} ref={ref}>
          <WizardStepSection
            className={styles.paymentMethodOptions}
            title="Payment method"
          >
            {getOptions(hideDebit).map((option: SFRadioOptionsProps) => (
              <PaymentMethodOption
                key={option.label}
                option={option}
                checked={method === option.value}
                onChange={() => onMethodChange(option.value)}
              />
            ))}
          </WizardStepSection>

          {method === 'card' && (
            <CreditCardForm
              error={error}
              name={value.cardName}
              onNameChange={(cardName) =>
                onChange({
                  ...value,
                  cardName
                })
              }
              onCardValidChange={onCreditCardValidChange}
            />
          )}

          <BillingDetailsForm
            value={value.billing_details}
            onChange={(newBilling) =>
              onChange({
                ...value,
                billing_details: newBilling
              })
            }
          />

          <SFCheckbox
            label={
              <React.Fragment>
                I've read and understood the{' '}
                <SFLink
                  sfSize="small"
                  color="primary"
                  target="_blank"
                  href="https://smartforcetech.com/#/agreement-citizencontact"
                >
                  SmartForce® general terms and conditions
                </SFLink>
              </React.Fragment>
            }
            checked={value.acceptConditions}
            onChange={(_e, checked: boolean) =>
              onChange({
                ...value,
                acceptConditions: checked
              })
            }
          />
        </SFScrollable>

        <div className={styles.button}>
          <SFButton
            size="large"
            fullWidth
            disabled={getIsButtonDisabled(method, value, isCardValid)}
            onClick={onConfirm}
          >
            {method === 'card' ? 'Confirm Payment' : 'Generate Payment Link'}
          </SFButton>
        </div>
      </div>
    );
  }
);
