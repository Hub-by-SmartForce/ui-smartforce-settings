import React, { useContext, useState } from 'react';
import styles from './SFTopBarNotification.module.scss';
import { SFBadge, SFIconButton, SFPopover } from 'sfui';
import { SFTopBarNotificationMenu } from './SFTopBarNotificationMenu/SFTopBarNotificationMenu';
import { AppEnv, AppNotification, SettingsError } from '../../../Models';
import { NotificationDialog } from './SFTopBarNotificationMenu/NotificationDialog/NotificationDialog';
import { AppNotificationsContext } from '../../../Context';
import { updateNotificationsRead } from '../../../Services';
import { getApiBaseUrl } from '../../../Helpers/application';

export interface SFTopBarNotificationProps {
  enviroment: AppEnv;
  onError: (e: SettingsError) => void;
}

export const SFTopBarNotification = ({
  enviroment,
  onError
}: SFTopBarNotificationProps): React.ReactElement<SFTopBarNotificationProps> => {
  const { notifications, setNotificationsRead } = useContext(
    AppNotificationsContext
  );
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<AppNotification | undefined>();

  const unreadNotifications = notifications.filter((n) => !n.read_at);

  const onOpenMenu: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ): void => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = (): void => setAnchorEl(null);

  const onOpenDialog = (notification: AppNotification) => {
    setSelected(notification);
    setIsDialogOpen(true);
    setAnchorEl(null);
  };

  const onMarkRead = async (ids: string[]) => {
    try {
      setNotificationsRead(ids);
      await updateNotificationsRead(getApiBaseUrl(enviroment), ids);
    } catch (e: any) {
      console.error('SFTopBarNotification::onMarkRead', e);
      onError(e);
    }
  };

  const onReadAll = async () => {
    const unreadListId = unreadNotifications.map((n) => n.id);
    onMarkRead(unreadListId);
  };

  return (
    <>
      {selected && (
        <NotificationDialog
          isOpen={isDialogOpen}
          notification={selected}
          onClose={() => {
            setIsDialogOpen(false);
            !selected.read_at && onMarkRead([selected.id]);
          }}
        />
      )}

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
          notifications={notifications}
          unreadNotifications={unreadNotifications}
          onOpen={onOpenDialog}
          onReadAll={onReadAll}
        />
      </SFPopover>

      <SFBadge
        className={styles.sFTopBarNotification}
        value={unreadNotifications.length > 0 ? 100 : 0}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        overlap="circular"
      >
        <SFIconButton
          aria-label="Open notifications menu"
          sfIcon="Bell"
          iconSize={20}
          buttonSize={34}
          onClick={onOpenMenu}
        />
      </SFBadge>
    </>
  );
};
