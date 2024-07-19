import React, { useState } from 'react';
import styles from './SFTopBarNotification.module.scss';
import { SFBadge, SFIconButton, SFPopover } from 'sfui';

export interface SFTopBarNotificationProps {}

export const SFTopBarNotification =
  (): React.ReactElement<SFTopBarNotificationProps> => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const onOpenMenu: React.MouseEventHandler<HTMLButtonElement> = (
      event
    ): void => {
      setAnchorEl(event.currentTarget);
    };

    const onClose = (): void => setAnchorEl(null);

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
          <div>//TODO</div>
        </SFPopover>

        <SFBadge
          className={styles.sFTopBarNotification}
          //TODO set this value if there are unread notifications
          value={100}
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
