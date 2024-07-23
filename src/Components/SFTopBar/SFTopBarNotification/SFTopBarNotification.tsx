import React, { useState } from 'react';
import styles from './SFTopBarNotification.module.scss';
import { SFBadge, SFIconButton, SFPopover } from 'sfui';
import { SFTopBarNotificationMenu } from './SFTopBarNotificationMenu/SFTopBarNotificationMenu';
import { APP_NOTIFICATIONS } from '../../../Services';
import { AppNotification } from '../../../Models';

export interface SFTopBarNotificationProps {}

export const SFTopBarNotification =
  (): React.ReactElement<SFTopBarNotificationProps> => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const unreadNotifications = APP_NOTIFICATIONS.filter((n) => !n.readed_at);

    const onOpenMenu: React.MouseEventHandler<HTMLButtonElement> = (
      event
    ): void => {
      setAnchorEl(event.currentTarget);
    };

    const onClose = (): void => setAnchorEl(null);

    const onOpenDialog = (_notification: AppNotification) => {
      //TODO
    };

    return (
      <>
        <SFPopover
          PaperProps={{ style: { display: 'flex' } }}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          onClose={onClose}
        >
          <SFTopBarNotificationMenu
            notifications={APP_NOTIFICATIONS}
            unreadNotifications={unreadNotifications}
            onOpen={onOpenDialog}
          />
        </SFPopover>

        <SFBadge
          className={styles.sFTopBarNotification}
          value={unreadNotifications.length > 0 ? 100 : 0}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          overlap="circular"
        >
          <SFIconButton
            sfIcon="Bell"
            iconSize={20}
            buttonSize={34}
            onClick={onOpenMenu}
          />
        </SFBadge>
      </>
    );
  };
