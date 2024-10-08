import React, { Fragment, useContext } from 'react';
import styles from './CurrentPlan.module.scss';
import { SFButton, SFText } from 'sfui';
import { CancelDialog } from './CancelDialog/CancelDialog';
import { ResumeDialog } from './ResumeDialog/ResumeDialog';
import { SubscriptionContext } from '../../../Context';
import {
  getPlanLabel,
  isFreePlan,
  isFreeTrial,
  isPlanAnalytics,
  replaceElementAt
} from '../../../Helpers';
import {
  ApplicationProduct,
  SettingsError,
  Subscription
} from '../../../Models';
import { cancelSubscription, resumeSubscription } from '../../../Services';
import { ApiContext } from '../../../Context';
import { CurrentPlanStatus } from './CurrentPlanStatus/CurrentPlanStatus';
import { AgencyBillingItem } from '../AgencyBillingItem/AgencyBillingItem';

export interface CurrentPlanProps {
  canUpdate: boolean;
  currentSubscription: Subscription;
  product: ApplicationProduct;
  isPending: boolean;
  onError: (e: SettingsError) => void;
  onActivate: () => void;
  onUpgrade: () => void;
}

export const CurrentPlan = ({
  canUpdate,
  currentSubscription,
  product,
  isPending,
  onError,
  onActivate,
  onUpgrade
}: CurrentPlanProps): React.ReactElement<CurrentPlanProps> => {
  const { setSubscriptions } = useContext(SubscriptionContext);
  const apiBaseUrl = useContext(ApiContext).settings;
  const [isCancelDialogOpen, setIsCancelDialogOpen] =
    React.useState<boolean>(false);
  const [isResumeDialogOpen, setIsResumeDialogOpen] =
    React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const showActivate =
    isFreeTrial(currentSubscription) &&
    !currentSubscription?.payment?.method &&
    !currentSubscription.renew;

  const onCloseDialog = () => {
    setIsCancelDialogOpen(false);
    setIsResumeDialogOpen(false);
  };

  const onCancelPlan = async () => {
    setIsLoading(true);
    try {
      await cancelSubscription(apiBaseUrl, currentSubscription.product);
      setSubscriptions((subscriptions) => {
        const currentSubscriptionIndex = subscriptions.findIndex(
          (s) => s.id === currentSubscription.id
        );

        return replaceElementAt(
          subscriptions,
          {
            ...currentSubscription,
            renew: false
          },
          currentSubscriptionIndex
        );
      });
      setIsLoading(false);
      setIsCancelDialogOpen(false);
    } catch (error: any) {
      console.error('Settings::AgencyBilling::CurrentPlan::Cancel', error);
      onError(error);
    }
  };

  const onResumePlan = async () => {
    setIsLoading(true);
    try {
      await resumeSubscription(apiBaseUrl, currentSubscription.product);
      setSubscriptions((subscriptions) => {
        const currentSubscriptionIndex = subscriptions.findIndex(
          (s) => s.id === currentSubscription.id
        );

        return replaceElementAt(
          subscriptions,
          {
            ...currentSubscription,
            renew: true
          },
          currentSubscriptionIndex
        );
      });
      setIsLoading(false);
      setIsResumeDialogOpen(false);
    } catch (error: any) {
      console.error('Settings::AgencyBilling::CurrentPlan::Resume', error);
      onError(error);
    }
  };

  return (
    <>
      <CancelDialog
        isOpen={isCancelDialogOpen}
        isLoading={isLoading}
        onClose={onCloseDialog}
        onClick={onCancelPlan}
      />

      <ResumeDialog
        isOpen={isResumeDialogOpen}
        isLoading={isLoading}
        onClose={onCloseDialog}
        onClick={onResumePlan}
      />

      <AgencyBillingItem
        title="Current Plan"
        action={
          canUpdate ? (
            <>
              {showActivate && (
                <SFButton onClick={onActivate}>Activate Plan</SFButton>
              )}

              {!showActivate && !isFreePlan(currentSubscription.plan) && (
                <>
                  {currentSubscription.renew === false && (
                    <SFButton onClick={() => setIsResumeDialogOpen(true)}>
                      Resume Plan
                    </SFButton>
                  )}

                  {!isPending && currentSubscription.renew === true && (
                    <Fragment>
                      <SFButton
                        sfColor="grey"
                        variant="text"
                        onClick={() => setIsCancelDialogOpen(true)}
                      >
                        Cancel Plan
                      </SFButton>
                    </Fragment>
                  )}
                </>
              )}

              {product !== 'shift' &&
                !isPlanAnalytics(currentSubscription.plan) &&
                currentSubscription.product !== 'shift' &&
                currentSubscription.status === 'Active' && (
                  <SFButton onClick={onUpgrade}>Upgrade Plan</SFButton>
                )}
            </>
          ) : undefined
        }
      >
        <div className={styles.currentPlan}>
          <SFText type="component-1-medium">
            {getPlanLabel(currentSubscription.plan)}
          </SFText>

          <CurrentPlanStatus
            subscription={currentSubscription}
            isPending={isPending}
          />
        </div>
      </AgencyBillingItem>
    </>
  );
};
