import React, { useState } from 'react';
import { AgencyBillingItem } from '../AgencyBillingItem/AgencyBillingItem';
import { SFButton } from 'sfui';
import { BillingCycleType } from '../../../Models';

export interface BillingCycleProps {
  billing_cycle: BillingCycleType;
  canChange: boolean;
}

export const BillingCycle = ({
  billing_cycle,
  canChange
}: BillingCycleProps): React.ReactElement<BillingCycleProps> => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  console.log(isModalOpen);

  return (
    <AgencyBillingItem
      title="Billing Cycle"
      action={
        canChange ? (
          <SFButton
            size="small"
            variant="text"
            onClick={() => setIsModalOpen(true)}
          >
            Change Billing Cycle
          </SFButton>
        ) : undefined
      }
    >{`Annual plan / Pay ${billing_cycle}`}</AgencyBillingItem>
  );
};
