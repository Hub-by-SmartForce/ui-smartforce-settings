import React from 'react';
import styles from './CompleteDebitInformation.module.scss';
import { SFBlueMainLight, SFButton, SFCard, SFIcon, SFText } from 'sfui';

export interface CompleteDebitInformationProps {
  onFinish: () => void;
}

export const CompleteDebitInformation = ({
  onFinish
}: CompleteDebitInformationProps): React.ReactElement<CompleteDebitInformationProps> => {
  return (
    <SFCard className={styles.completeDebitInformation} sfElevation={2}>
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
  );
};
