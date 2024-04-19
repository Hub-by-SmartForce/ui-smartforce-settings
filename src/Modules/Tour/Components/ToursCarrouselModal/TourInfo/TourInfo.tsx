import React from 'react';
import styles from './TourInfo.module.scss';
import { SFButton, SFText } from 'sfui';

export interface TourInfoProps {
  title: string;
  description: string;
  onStart: () => void;
}

export const TourInfo = ({
  title,
  description,
  onStart
}: TourInfoProps): React.ReactElement<TourInfoProps> => {
  return (
    <div className={styles.tourInfo}>
      <div className={styles.info}>
        <SFText type="component-title">{title}</SFText>
        <SFText type="component-2" sfColor="neutral">
          {description}
        </SFText>
      </div>

      <SFButton fullWidth onClick={onStart}>
        Start Here
      </SFButton>
    </div>
  );
};
