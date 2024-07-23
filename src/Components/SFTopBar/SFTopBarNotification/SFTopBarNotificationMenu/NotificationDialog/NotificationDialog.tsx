import React from 'react';
import styles from './NotificationDialog.module.scss';
import { AppNotification } from '../../../../../Models';
import { SFButton, SFDialog, SFText } from 'sfui';

export interface NotificationDialogProps {
  isOpen: boolean;
  notification: AppNotification;
  onClose: () => void;
}

export const NotificationDialog = ({
  notification,
  isOpen,
  onClose
}: NotificationDialogProps): React.ReactElement<NotificationDialogProps> => {
  const onReadMore = () => window.open(notification.external_link, '_blank');

  return (
    <SFDialog
      PaperProps={{ className: styles.notificationDialog }}
      open={isOpen}
    >
      {notification.image && (
        <div
          className={styles.imageContainer}
          style={{ backgroundImage: `url(${notification.image})` }}
        />
      )}

      <div className={styles.container}>
        <div
          className={`${styles.content} ${
            notification.image ? styles.withImage : ''
          }`}
        >
          <SFText type="component-title">
            {notification.author.name} {notification.title}
          </SFText>

          {!notification.image && (
            <SFText type="component-1">
              <span
                dangerouslySetInnerHTML={{ __html: notification.body }}
              ></span>
            </SFText>
          )}

          {notification.image && (
            <SFText type="component-2" sfColor="neutral">
              <span
                dangerouslySetInnerHTML={{ __html: notification.body }}
              ></span>
            </SFText>
          )}
        </div>

        <div className={styles.footer}>
          {notification.external_link && (
            <SFButton
              variant="text"
              sfColor="blue"
              size="large"
              onClick={onReadMore}
            >
              Read More
            </SFButton>
          )}

          <SFButton
            variant="contained"
            sfColor="blue"
            size="large"
            onClick={onClose}
          >
            I Understand
          </SFButton>
        </div>
      </div>
    </SFDialog>
  );
};
