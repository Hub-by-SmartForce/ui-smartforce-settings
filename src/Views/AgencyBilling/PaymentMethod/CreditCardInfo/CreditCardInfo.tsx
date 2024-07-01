import React, { useContext } from 'react';
import styles from './CreditCardInfo.module.scss';
import { SFButton, SFText } from 'sfui';
import { SubscriptionPaymentCard } from '../../../../Models';
import { AGENCY_SUBSCRIPTION_UPDATE } from '../../../../Constants';
import { checkPermissions } from '../../../../Helpers';
import { UserContext } from '../../../../Context';

export interface CreditCardInfoProps {
  card: SubscriptionPaymentCard;
  onChangeCardClick: () => void;
}

export const CreditCardInfo = ({
  card,
  onChangeCardClick
}: CreditCardInfoProps): React.ReactElement<CreditCardInfoProps> => {
  const { user } = useContext(UserContext);

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

      {checkPermissions(AGENCY_SUBSCRIPTION_UPDATE, user?.role.permissions) && (
        <SFButton
          className={styles.changeLink}
          size="small"
          variant="text"
          color="primary"
          onClick={onChangeCardClick}
        >
          Change Credit Card
        </SFButton>
      )}
    </div>
  );
};
