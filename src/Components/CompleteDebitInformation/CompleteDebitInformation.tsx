import React from 'react';
import styles from './CompleteDebitInformation.module.scss';
import { SFBlueMainLight, SFButton, SFCard, SFIcon, SFText } from 'sfui';
import { SFTopBarUser } from '../SFTopBar/SFTopBarUser/SFTopBarUser';

export interface CompleteDebitInformationProps {
  officerCardUrl: string;
  onLogout: () => void;
  onFinish: () => void;
}

export const CompleteDebitInformation = ({
  onFinish,
  ...props
}: CompleteDebitInformationProps): React.ReactElement<CompleteDebitInformationProps> => {
  return (
    <div className={styles.completeDebitInformation}>
      <div className={styles.topBar}>
        <SFTopBarUser {...props} />
      </div>

      <SFCard className={styles.card} sfElevation={2}>
        <div className={styles.cardContent}>
          <div className={styles.icon}>
            <SFIcon icon="File-2" size={96} color={SFBlueMainLight} />
          </div>

          <h2 className={styles.title}>Complete your payment information.</h2>

          <SFText type="component-2" sfColor="neutral">
            Complete all payment information by clicking on the button below to
            finish the process.
          </SFText>

          <div className={styles.button}>
            <SFButton onClick={onFinish}>Complete Information</SFButton>
          </div>
        </div>
      </SFCard>
    </div>
  );
};
