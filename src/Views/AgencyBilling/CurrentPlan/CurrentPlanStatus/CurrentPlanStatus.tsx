import React from 'react';
import { Subscription } from '../../../../Models';
import { SFChip } from 'sfui';
import { isFreePlan, isFreeTrial } from '../../../../Helpers';

function getPlanStatus(subscription: Subscription): string | undefined {
  if (isFreeTrial(subscription)) {
    return '100% Free Trial';
  } else if (
    (!isFreePlan(subscription.plan) && !subscription.payment) ||
    subscription.status === 'Incomplete'
  ) {
    return 'Pending';
  } else if (subscription.status !== 'Active') {
    return subscription.status;
  } else {
    return undefined;
  }
}

export interface CurrentPlanStatusProps {
  subscription: Subscription;
}

export const CurrentPlanStatus = ({
  subscription
}: CurrentPlanStatusProps): React.ReactElement<CurrentPlanStatusProps> => {
  const status: string | undefined = getPlanStatus(subscription);

  return (
    <>
      {status && (
        <SFChip
          sfColor="primary"
          variant="outlined"
          size="small"
          hasError={subscription.status === 'Unpaid'}
          label={status}
        />
      )}
    </>
  );
};
