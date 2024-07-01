import React, { useContext, useRef } from 'react';
import styles from './AgencyMembersForm.module.scss';
import { ChipFieldValueType, SFChipListInput } from 'sfui';
import { SubscriptionContext, UserContext } from '../../../../../Context';
import { RemainingSeats } from './RemainingSeats/RemainingSeats';
import {
  getPaidSubscription,
  isChipListValid,
  isEmailValid,
  isFreeTrial
} from '../../../../../Helpers';
import { TourContext, TourTooltip } from '../../../../../Modules/Tour';

export interface AgencyMembersFormProps {
  members: ChipFieldValueType[];
  onChange: (members: ChipFieldValueType[]) => void;
}

export const AgencyMembersForm = ({
  members,
  onChange
}: AgencyMembersFormProps): React.ReactElement<AgencyMembersFormProps> => {
  const { onNext: onTourNext } = useContext(TourContext);
  const { user } = React.useContext(UserContext);
  const { subscriptions } = React.useContext(SubscriptionContext);
  const paidSubscription = getPaidSubscription(subscriptions);

  const refPristine = useRef<boolean>(true);

  const onChipsChange = (members: ChipFieldValueType[]) => {
    if (refPristine.current && isChipListValid(members)) {
      refPristine.current = false;
      onTourNext({ tourId: 1, step: 2 });
    }

    onChange(members);
  };

  return (
    <div className={styles.agencyMembersForm}>
      <div
        className={`${styles.emails} ${
          members.length === 0 ? styles.emptyList : ''
        }`}
      >
        {paidSubscription && !isFreeTrial(paidSubscription) && (
          <RemainingSeats
            seatsBilled={paidSubscription.total_seats_billed}
            seatsUsed={paidSubscription.total_seats_used}
            membersAmmount={members.length}
          />
        )}

        <TourTooltip
          title="Type the emails"
          description="You can list all the emails you need separated by commas and press ENTER."
          step={2}
          lastStep={3}
          tourId={1}
          topZIndex
        >
          <SFChipListInput
            label="E-mail"
            items={members}
            onChange={onChipsChange}
            isValid={(value: string) =>
              isEmailValid(value) &&
              value.toLocaleLowerCase() !== user?.email?.toLocaleLowerCase()
            }
            helperText="List the emails separated by commas and press ENTER."
            inputMinWidth="full-width"
          />
        </TourTooltip>
      </div>
    </div>
  );
};
