import React, { useEffect, useState } from 'react';
import styles from './ChangeBillingCycleModal.module.scss';
import { PanelModal, PanelModalAnchor } from '../../../Components';
import { SFAlert, SFRadio } from 'sfui';
import { dispatchCustomEvent } from '../../../Helpers';
import { SETTINGS_CUSTOM_EVENT } from '../../../Constants';
import { SettingsError } from '../../../Models';

export interface ChangeBillingCycleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onError: (e: SettingsError) => void;
  onPanelClose: () => void;
}

export const ChangeBillingCycleModal = ({
  isOpen,
  onClose,
  onPanelClose,
  onError
}: ChangeBillingCycleModalProps): React.ReactElement<ChangeBillingCycleModalProps> => {
  //   const { setSubscriptions } = useContext(SubscriptionContext);
  const [anchor, setAnchor] = useState<PanelModalAnchor>('right');
  const [checked, setChecked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setChecked(false);
    }
  }, [isOpen]);

  const onSave = async () => {
    setIsLoading(true);
    try {
      // TODO api call

      // UPDATE subscription context
      //   setSubscriptions((subscriptions) => {
      //     const currentSubscriptionIndex = subscriptions.findIndex(
      //       (s) => s.id === newSubscription.id
      //     );

      //     return replaceElementAt(
      //       subscriptions,
      //       {
      //         ...newSubscription
      //       },
      //       currentSubscriptionIndex
      //     );
      //   });

      dispatchCustomEvent(SETTINGS_CUSTOM_EVENT, {
        message: 'Your change was saved successfully.'
      });

      setIsLoading(false);
      onPanelClose();
    } catch (e) {
      const error: SettingsError = e as SettingsError;
      console.error('Settings::AgencyBilling::ChangeCreditCard');
      setIsLoading(false);
      onError(error);
    }
  };

  return (
    <PanelModal
      anchor={anchor}
      title="Change Billing Cycle"
      actionButton={{
        label: 'Save Changes',
        disabled: !checked,
        isLoading: isLoading,
        onClick: onSave
      }}
      dialogCloseButton={{
        label: 'Discard',
        variant: 'text',
        sfColor: 'grey',
        onClick: onPanelClose
      }}
      isOpen={isOpen}
      onBack={onPanelClose}
      onClose={() => {
        setAnchor('bottom');
        onClose();
        onPanelClose();
      }}
    >
      <div className={styles.changeBillingCycleModal}>
        <SFAlert
          type="info"
          title="The changes will take effect in the upcoming renewal"
        />

        <div>
          <h3 className={styles.h3Alt}>Billing Cycle for your Annual Plan</h3>
          <SFRadio
            label="Pay monthly"
            checked={checked}
            onChange={(_e, checked) => setChecked(checked)}
          />
        </div>
      </div>
    </PanelModal>
  );
};
