import React from 'react';
import styles from './TitleItem.module.scss';
import { UserTitle } from '../../../Models';
import { SFIconButton, SFText } from 'sfui';

export interface TitleItemProps {
  title: UserTitle;
  onDown?: () => void;
  onUp?: () => void;
}

export const TitleItem = ({
  title,
  onDown,
  onUp
}: TitleItemProps): React.ReactElement<TitleItemProps> => {
  return (
    <div className={styles.titleItem}>
      <div>
        <SFIconButton
          disabled={!onDown}
          sfIcon="Down-7"
          sfSize="small"
          onClick={onDown}
        />
        <SFIconButton
          disabled={!onUp}
          sfIcon="Up-7"
          sfSize="small"
          onClick={onUp}
        />
      </div>

      <div className={styles.info}>
        <div className={styles.priority}>
          <SFText type="component-2" sfColor="neutral">
            {title.priority}
          </SFText>
        </div>

        <SFText type="component-2" sfColor="neutral">
          {title.name}
        </SFText>
      </div>
    </div>
  );
};
