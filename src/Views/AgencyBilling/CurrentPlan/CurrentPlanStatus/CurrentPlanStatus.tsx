import React from 'react';
import { Subscription } from '../../../../Models';
import { SFChip } from 'sfui';
import { isFreeTrial } from '../../../../Helpers';

function getPlanStatus(
  subscription: Subscription,
  isPending: boolean
): string | undefined {
  if (isPending || subscription.status === 'Past Due') {
    return 'Pending';
  } else if (!subscription.renew && !isFreeTrial(subscription)) {
    return 'Canceled';
  } else if (subscription.status !== 'Active') {
    return subscription.status;
  } else {
    return undefined;
  }
}

export interface CurrentPlanStatusProps {
  subscription: Subscription;
  isPending: boolean;
}

export const CurrentPlanStatus = ({
  subscription,
  isPending
}: CurrentPlanStatusProps): React.ReactElement<CurrentPlanStatusProps> => {
  const status: string | undefined = getPlanStatus(subscription, isPending);

  return (
    <>
      {status && (
        <SFChip
          sfColor="primary"
          variant="outlined"
          size="small"
          hasError={subscription.status === 'Unpaid' || status === 'Canceled'}
          label={status}
        />
      )}

      {isFreeTrial(subscription) && (
        <SFChip
          sfColor="primary"
          variant="outlined"
          size="small"
          label="100% Free Trial"
        />
      )}
    </>
  );
};
