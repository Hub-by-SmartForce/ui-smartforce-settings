import React, { useContext } from 'react';
import styles from './NotificationList.module.scss';
import { SFScrollable, SFText } from 'sfui';
import moment from 'moment-timezone';
import { NotificationListItem } from './NotificationListItem/NotificationListItem';
import { AppNotification, Customer } from '../../../../../Models';
import { CustomerContext } from '../../../../../Context';

interface GroupedNotifications {
  last: AppNotification[];
  older: AppNotification[];
}

function getGroupedNotifications(
  list: AppNotification[],
  timezone: string
): GroupedNotifications {
  const result: GroupedNotifications = { last: [], older: [] };
  const now = moment().tz(timezone);

  for (const notification of list) {
    if (now.diff(notification.date_start, 'days') > 7) {
      result.older = [...result.older, notification];
    } else {
      result.last = [...result.last, notification];
    }
  }

  return result;
}

export interface NotificationListProps {
  list: AppNotification[];
}

export const NotificationList = ({
  list
}: NotificationListProps): React.ReactElement<NotificationListProps> => {
  const customer = useContext(CustomerContext).customer as Customer;
  const groupedNotifications = getGroupedNotifications(list, customer.timezone);

  return (
    <SFScrollable containerClassName={styles.notificationList}>
      {groupedNotifications.last.length > 0 && (
        <div className={styles.section}>
          <SFText
            className={styles.sectionTitle}
            type="component-messages"
            sfColor="neutral"
          >
            LAST 7 DAYS
          </SFText>

          <div className={styles.list}>
            {groupedNotifications.last.map((notification) => (
              <NotificationListItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        </div>
      )}

      {groupedNotifications.older.length > 0 && (
        <div className={styles.section}>
          <SFText
            className={styles.sectionTitle}
            type="component-messages"
            sfColor="neutral"
          >
            OLDER
          </SFText>

          <div className={styles.list}>
            {groupedNotifications.older.map((notification) => (
              <NotificationListItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        </div>
      )}
    </SFScrollable>
  );
};
