import React from 'react';
import styles from './CreditCardInfo.module.scss';
import { SFText } from 'sfui';
import { SubscriptionPaymentCard } from '../../../../Models';

export interface CreditCardInfoProps {
  card: SubscriptionPaymentCard;
}

export const CreditCardInfo = ({
  card
}: CreditCardInfoProps): React.ReactElement<CreditCardInfoProps> => {
  return (
    <div className={styles.creditCardInfo}>
      <div className={styles.info}>
        <div className={styles.card}>
          <SFText type="component-1-medium">{`*** **** **** ${card.last_4_digits}`}</SFText>
          <SFText
            type="component-messages"
            sfColor="neutral"
          >{`Expires ${card.exp_month}/${card.exp_year}`}</SFText>
        </div>

        <SFText type="component-1-medium">{card.name}</SFText>
      </div>
    </div>
  );
};
