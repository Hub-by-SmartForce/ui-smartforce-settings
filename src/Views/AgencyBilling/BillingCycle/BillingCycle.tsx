import React, { useState } from 'react';
import { AgencyBillingItem } from '../AgencyBillingItem/AgencyBillingItem';
import { SFButton } from 'sfui';
import { BillingCycleType, SettingsError } from '../../../Models';
import { ChangeBillingCycleModal } from '../ChangeBillingCycleModal/ChangeBillingCycleModal';

export interface BillingCycleProps {
  billing_cycle: BillingCycleType;
  canChange: boolean;
  onClose: () => void;
  onError: (e: SettingsError) => void;
}

export const BillingCycle = ({
  billing_cycle,
  canChange,
  onClose,
  onError
}: BillingCycleProps): React.ReactElement<BillingCycleProps> => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <ChangeBillingCycleModal
        isOpen={isModalOpen}
        onClose={onClose}
        onPanelClose={() => setIsModalOpen(false)}
        onError={onError}
      />

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
    </>
  );
};
