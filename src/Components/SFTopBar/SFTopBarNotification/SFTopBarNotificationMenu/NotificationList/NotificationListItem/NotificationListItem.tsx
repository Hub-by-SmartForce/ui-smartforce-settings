import React, { useContext } from 'react';
import styles from './NotificationListItem.module.scss';
import moment from 'moment-timezone';
import { AppNotification, Customer } from '../../../../../../Models';
import { SFText } from 'sfui';
import { CustomerContext } from '../../../../../../Context';
import { InteractiveBox } from '../../../../../InteractiveBox/InteractiveBox';

function getDateLabel(
  date: string,
  timezone: string,
  isOlder?: boolean
): string {
  const notificationDate = moment(date).tz(timezone);

  if (isOlder) {
    return notificationDate.format('MM/DD/YYYY');
  } else {
    const now = moment().tz(timezone);
    const daysDiff = now.diff(notificationDate, 'days');

    if (daysDiff >= 1) {
      return `${daysDiff} day${daysDiff > 1 ? 's' : ''} ago`;
    } else {
      const minutesDiff = now.diff(notificationDate, 'minutes');
      if (minutesDiff > 60) {
        const hoursDiff = now.diff(notificationDate, 'hours');
        return `${hoursDiff} hour${hoursDiff > 1 ? 's' : ''} ago`;
      } else {
        return `${minutesDiff} min ago`;
      }
    }
  }
}

export interface NotificationListItemProps {
  notification: AppNotification;
  isOlder?: boolean;
  onClick: () => void;
}

export const NotificationListItem = ({
  notification,
  isOlder = false,
  onClick
}: NotificationListItemProps): React.ReactElement<NotificationListItemProps> => {
  const customer = useContext(CustomerContext).customer as Customer;

  return (
    <InteractiveBox className={styles.notificationListItem} onClick={onClick}>
      <img
        src={notification.author.thumbnail_image}
        className={styles.avatar}
        alt="Author Avatar"
      />

      <div className={styles.body}>
        <div className={styles.text}>
          <SFText type="component-1">
            <span className={styles.author}>{notification.author.name}</span>
            {' - '}
            {notification.title}
          </SFText>
          <SFText type="component-3" sfColor="neutral">
            {getDateLabel(notification.start_date, customer.timezone, isOlder)}
          </SFText>
        </div>

        {!notification.read_at && <div className={styles.unread}></div>}
      </div>
    </InteractiveBox>
  );
};
