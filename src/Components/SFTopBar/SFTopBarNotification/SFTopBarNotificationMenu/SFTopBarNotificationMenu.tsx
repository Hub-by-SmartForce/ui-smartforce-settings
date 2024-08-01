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
  onReadAll: () => void;
}

export const SFTopBarNotificationMenu = ({
  notifications,
  unreadNotifications,
  onOpen,
  onReadAll
}: SFTopBarNotificationMenuProps): React.ReactElement<SFTopBarNotificationMenuProps> => {
  const [filterUnread, setFilterUnread] = useState<boolean>(false);
  const isEmpty = notifications.length === 0;

  return (
    <div
      className={`${styles.sFTopBarNotificationMenu} ${
        isEmpty ? styles.isEmpty : ''
      }`}
    >
      {isEmpty && <div>There are no notifications at the moment.</div>}

      {!isEmpty && (
        <>
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
        </>
      )}
    </div>
  );
};
