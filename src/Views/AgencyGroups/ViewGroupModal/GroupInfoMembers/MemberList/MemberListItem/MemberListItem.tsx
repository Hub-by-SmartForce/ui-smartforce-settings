import React from 'react';
import styles from './MemberListItem.module.scss';
import { SFChip, SFIconButton, SFMenu, SFMenuItem, SFText } from 'sfui';
import { GroupMember, User } from '../../../../../../Models';
import { Avatar } from '../../../../../../Components/Avatar/Avatar';
import { isRoleOwner, upperFirstChar } from '../../../../../../Helpers';
import { InteractiveBox } from '../../../../../../Components';

export interface MemberListItemProps {
  isActive: boolean;
  user: User;
  member: GroupMember;
  onClick?: () => void;
  onRemove: () => void;
}

export const MemberListItem = ({
  isActive,
  user,
  member,
  ...props
}: MemberListItemProps): React.ReactElement<MemberListItemProps> => {
  const [menuAnchorElement, setMenuAnchorElement] = React.useState<
    HTMLButtonElement | undefined
  >(undefined);

  const onMenuOpen = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setMenuAnchorElement(e.currentTarget);
  };

  const onMenuClose = () => setMenuAnchorElement(undefined);

  const onRemove = () => {
    onMenuClose();
    props.onRemove();
  };

  const isUser: boolean = user.id === member.id;

  return (
    <div
      className={`${styles.memberListItem} ${isActive ? styles.withMenu : ''}`}
    >
      <Avatar name={member.name} url={member.avatar_thumbnail_url} />

      <InteractiveBox className={styles.memberInfo} onClick={props.onClick}>
        <SFText type="component-2">
          {member.name}
          {isUser && <span className={styles.textNeutral}>{' (You)'}</span>}
        </SFText>

        <SFText type="component-2" sfColor="neutral">
          {member.email}
        </SFText>

        <SFChip
          className={styles.role}
          label={upperFirstChar(member.role)}
          sfColor="primary"
          variant={isRoleOwner(member.role) ? 'default' : 'outlined'}
          size="small"
        />
      </InteractiveBox>

      {isActive && (
        <div>
          <SFIconButton
            rotate="left"
            sfIcon="Other"
            sfSize="medium"
            onClick={onMenuOpen}
          />

          <SFMenu
            className={styles.optionsMenu}
            autoFocus={false} // eslint-disable-line jsx-a11y/no-autofocus
            anchorEl={menuAnchorElement}
            open={Boolean(menuAnchorElement)}
            onClose={onMenuClose}
            variant="menu"
            getContentAnchorEl={null}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <SFMenuItem tabIndex={0} onClick={onRemove}>
              Remove from group
            </SFMenuItem>
          </SFMenu>
        </div>
      )}
    </div>
  );
};
