import React, { useState } from 'react';
import { AgencyBillingItem } from '../AgencyBillingItem/AgencyBillingItem';
import { SFButton } from 'sfui';
import {
  ApplicationProduct,
  BillingCycleType,
  SettingsError
} from '../../../Models';
import { ChangeBillingCycleModal } from '../ChangeBillingCycleModal/ChangeBillingCycleModal';

export interface BillingCycleProps {
  product: ApplicationProduct;
  cycle: BillingCycleType;
  nextCycle?: BillingCycleType;
  canChange: boolean;
  onClose: () => void;
  onError: (e: SettingsError) => void;
}

export const BillingCycle = ({
  product,
  cycle,
  nextCycle,
  canChange,
  onClose,
  onError
}: BillingCycleProps): React.ReactElement<BillingCycleProps> => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <ChangeBillingCycleModal
        product={product}
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
      >{`Annual plan / Pay ${nextCycle || cycle}`}</AgencyBillingItem>
    </>
  );
};
