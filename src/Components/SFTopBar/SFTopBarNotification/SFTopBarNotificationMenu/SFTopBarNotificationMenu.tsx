import React from 'react';
import styles from './SFTopBarNotificationMenu.module.scss';
import { SFButton, SFDivider } from 'sfui';
import { AppNotification } from '../../../../Models';

export interface SFTopBarNotificationMenuProps {
  notifications: AppNotification[];
  unreadNotifications: AppNotification[];
}

export const SFTopBarNotificationMenu = ({
  notifications,
  unreadNotifications
}: SFTopBarNotificationMenuProps): React.ReactElement<SFTopBarNotificationMenuProps> => {
  //TODO remove
  console.log(notifications);

  return (
    <div className={styles.sFTopBarNotificationMenu}>
      <div className={styles.topActions}>
        <div className={styles.filters}>// TODO add chip filters</div>

        <SFButton
          variant="text"
          sfColor="blue"
          size="medium"
          disabled={unreadNotifications.length === 0}
          onClick={() => {
            //TODO
          }}
        >
          Mark all as read
        </SFButton>
      </div>

      <SFDivider size={1} />

      <div>//TODO notifications list</div>
    </div>
  );
};
