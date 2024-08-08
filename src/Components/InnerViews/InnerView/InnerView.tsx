import React, { useContext } from 'react';
import styles from './InnerView.module.scss';
import { SectionItemValue } from '../../../SFSettings';
import { TourContext, TourTooltip } from '../../../Modules/Tour';

export interface InnerViewProps {
  className?: string;
  view: SectionItemValue;
  hideHeader: boolean;
  isPhone: boolean;
}

export const InnerView = ({
  className = '',
  view,
  hideHeader,
  isPhone
}: InnerViewProps): React.ReactElement<InnerViewProps> => {
  const { onEnd: onTourEnd, setIsFeatureReminderOpen } =
    useContext(TourContext);
  const isBilling = view.name === 'billing';

  return (
    <div
      className={`${styles.innerView} ${
        hideHeader ? styles.hideHeader : ''
      } ${className}`}
      key={`view-${view.name}`}
    >
      {!hideHeader && (
        <div className={styles.textContainer}>
          {isBilling && (
            <TourTooltip
              title="Plans and Billing"
              description="In this section, you will see everything related to your plan and billing, such as the number of members and seats available, invoice, payment method, etc."
              step={1}
              lastStep={1}
              tourId={3}
              preventOverflow
              placement="top-start"
              onGotIt={() => {
                onTourEnd();
                setIsFeatureReminderOpen(true);
              }}
            >
              <h2 className={styles.title}>{view.viewTitle}</h2>
            </TourTooltip>
          )}

          {!isBilling && <h2 className={styles.title}>{view.viewTitle}</h2>}

          {!isPhone && <p className={styles.description}>{view.description}</p>}
        </div>
      )}

      {view.component}
    </div>
  );
};
