import React, { useState } from 'react';
import styles from './SFTopBarNotificationMenu.module.scss';
import { SFButton, SFDivider } from 'sfui';
import { FilterOption } from './FilterOption/FilterOption';
import { NotificationList } from './NotificationList/NotificationList';
import { AppNotification } from '../../../../Models';

export interface SFTopBarNotificationMenuProps {
  notifications: AppNotification[];
  unreadNotifications: AppNotification[];
  onOpen: (notification: AppNotification) => void;
}

export const SFTopBarNotificationMenu = ({
  notifications,
  unreadNotifications,
  onOpen
}: SFTopBarNotificationMenuProps): React.ReactElement<SFTopBarNotificationMenuProps> => {
  const [filterUnread, setFilterUnread] = useState<boolean>(false);

  const onReadAll = () => {
    //TODO
  };

  return (
    <div className={styles.sFTopBarNotificationMenu}>
      <div className={styles.topActions}>
        <div className={styles.filters}>
          <FilterOption
            label="All"
            selected={!filterUnread}
            onClick={() => setFilterUnread(false)}
          />

          <FilterOption
            label={`Unread${
              unreadNotifications.length > 0
                ? ` (${unreadNotifications.length})`
                : ''
            }`}
            selected={filterUnread}
            disabled={unreadNotifications.length === 0}
            onClick={() => setFilterUnread(true)}
          />
        </div>

        <SFButton
          variant="text"
          sfColor="blue"
          size="medium"
          disabled={unreadNotifications.length === 0}
          onClick={onReadAll}
        >
          Mark all as read
        </SFButton>
      </div>

      <SFDivider size={1} />

      <NotificationList
        list={filterUnread ? unreadNotifications : notifications}
        onOpen={onOpen}
      />
    </div>
  );
};