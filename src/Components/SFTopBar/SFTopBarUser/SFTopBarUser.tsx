import React, { Fragment, MouseEvent } from 'react';
import styles from './SFTopBarUser.module.scss';
import { SFIcon } from 'sfui';
import { UserContext } from '../../../Context';
import UserMenu from './UserMenu/UserMenu';
import { SFTopBarUserMenuItem } from './SFTopBarUserMenuItem/SFTopBarUserMenuItem';
import { Divider } from '../../Divider/Divider';
import { User } from '../../../Models';
import { Avatar } from '../../Avatar/Avatar';
import { QRCodeModal } from '../../QRCodeModal/QRCodeModal';

export interface SFTopBarUserProps {
  children?: React.ReactNode;
  onLogout: () => void;
}

export const SFTopBarUser = ({
  children,
  onLogout
}: SFTopBarUserProps): React.ReactElement<SFTopBarUserProps> => {
  const user = React.useContext(UserContext).user as User;
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = React.useState<boolean>(false);

  const onMenuOpen = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onMenuClose = () => {
    setAnchorEl(null);
  };

  const scanQRCode = () => {
    setIsQRModalOpen(true);
    onMenuClose();
  };

  const logOut = () => {
    onLogout();
    onMenuClose();
  };

  return (
    <Fragment>
      <QRCodeModal
        baseUrl="https://officercard-dev.citizencontact.app"
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        title="Scan the QR Code"
        subTitle={`Citizen can scan this QR code to get officer's information.`}
        user={user as User}
      />

      <div
        className={styles.SFTopBarUser}
        onClick={onMenuOpen}
        aria-label="User Menu"
        role="button"
      >
        <Avatar
          className={styles.avatar}
          name={user.name}
          url={user.avatar_url}
        />

        <p className={styles.userName}>{user?.name}</p>
        <SFIcon className={styles.icon} icon="Down-2" size={12} />
      </div>

      <UserMenu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={onMenuClose}
      >
        {user.agency_id && [
          <SFTopBarUserMenuItem
            key={user.email}
            title={user.name}
            subTitle={user.email}
            onClick={scanQRCode}
          >
            <SFIcon className={styles.qrIcon} icon="Name-Tag" />
          </SFTopBarUserMenuItem>,
          children,
          <Divider key="user-menu-divider" className={styles.divider} />
        ]}

        <SFTopBarUserMenuItem
          key={`${user.email}-logout`}
          title="Log out"
          onClick={logOut}
        />
      </UserMenu>
    </Fragment>
  );
};
