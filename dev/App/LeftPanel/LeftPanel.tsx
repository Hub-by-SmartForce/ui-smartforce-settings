import React from 'react';
import styles from './LeftPanel.module.scss';
import { SFIcon, SFText } from 'sfui';
import { ToursReminderTooltip, InteractiveBox } from '../../../src';

export interface LeftPanelProps {
  isFeatureReminderOpen: boolean;
  onGotIt: (checked: boolean) => void;
  onShowTours: () => void;
}

export const LeftPanel = ({
  isFeatureReminderOpen,
  onGotIt,
  onShowTours
}: LeftPanelProps): React.ReactElement<LeftPanelProps> => {
  return (
    <div className={styles.leftPanel}>
      <ToursReminderTooltip open={isFeatureReminderOpen} onGotIt={onGotIt}>
        <InteractiveBox className={styles.tours} onClick={onShowTours}>
          <SFIcon icon="Rectangle-Star" />
          <SFText type="component-1" sfColor="neutral">
            Feature Tours
          </SFText>
        </InteractiveBox>
      </ToursReminderTooltip>
    </div>
  );
};
