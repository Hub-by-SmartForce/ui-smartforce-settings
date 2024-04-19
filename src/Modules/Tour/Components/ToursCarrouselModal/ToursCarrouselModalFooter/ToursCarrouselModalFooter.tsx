import React from 'react';
import styles from './ToursCarrouselModalFooter.module.scss';
import { SFButton } from 'sfui';

export interface ToursCarrouselModalFooterProps {
  className: string;
  disabledBack: boolean;
  disabledNext: boolean;
  onSkip: () => void;
  onBack: () => void;
  onNext?: () => void;
  onDone?: () => void;
}

export const ToursCarrouselModalFooter = (
  props: ToursCarrouselModalFooterProps
): React.ReactElement<ToursCarrouselModalFooterProps> => {
  return (
    <div className={`${styles.toursCarrouselModalFooter} ${props.className}`}>
      <SFButton
        variant="text"
        sfColor="grey"
        size="large"
        onClick={props.onSkip}
      >
        Skip
      </SFButton>

      <div className={styles.rightActions}>
        <SFButton
          disabled={props.disabledBack}
          variant="text"
          size="large"
          onClick={props.onBack}
        >
          Back
        </SFButton>
        {props.onNext && (
          <SFButton
            disabled={props.disabledNext}
            variant="text"
            size="large"
            onClick={props.onNext}
          >
            Next
          </SFButton>
        )}
        {props.onDone && (
          <SFButton variant="text" size="large" onClick={props.onDone}>
            Done
          </SFButton>
        )}
      </div>
    </div>
  );
};
