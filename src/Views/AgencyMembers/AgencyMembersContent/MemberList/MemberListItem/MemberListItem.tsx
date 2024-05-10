import React, { Fragment, useContext, useRef } from 'react';
import styles from './MemberListItem.module.scss';
import { SFChip, SFCollapse, SFIconButton, SFMenu, SFMenuItem } from 'sfui';
import { UserContext } from '../../../../../Context';
import { Avatar } from '../../../../../Components/Avatar/Avatar';
import {
  AGENCY_INVITATIONS_RESEND,
  AGENCY_MEMBERS_ROLE_UPDATE,
  AGENCY_MEMBERS_REMOVE,
  AGENCY_INVITATIONS_REMOVE
} from '../../../../../Constants';
import {
  checkPermissions,
  dispatchCustomEvent,
  isRoleOwner
} from '../../../../../Helpers';
import { User, SettingsError } from '../../../../../Models';
import { resendInvitation } from '../../../../../Services';
import { SETTINGS_CUSTOM_EVENT } from '../../../../../Constants';
import { ApiContext } from '../../../../../Context';
import { TourContext, TourTooltip } from '../../../../../Modules/Tour';
import { MemberItem } from '../MemberList';

export interface MemberListItemProps {
  member: MemberItem;
  wasRemoved: boolean;
  onError: (e: SettingsError) => void;
  onClick: () => void;
  onChangeRole: () => void;
  onRemove: () => void;
  onTransitionEnd: () => void;
}

export const MemberListItem = ({
  member,
  wasRemoved,
  onError,
  onClick,
  onTransitionEnd,
  ...props
}: MemberListItemProps): React.ReactElement<MemberListItemProps> => {
  const apiBaseUrl = useContext(ApiContext).settings;
  const { onNext: onTourNext, onClose: onTourClose } = useContext(TourContext);
  const user = useContext(UserContext).user as User;
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
  const refAnchorEl = useRef<HTMLDivElement | null>(null);

  const isUser: boolean = member.email === user.email;
  const isActive: boolean = member.status === 'Active';
  const isRoleLower: boolean =
    !member.role || member.role.priority > user.role.priority;

  const onResendInvitation = async () => {
    setIsMenuOpen(false);
    onTourClose([2]);

    try {
      if (member.email) {
        await resendInvitation(apiBaseUrl, member.email);

        dispatchCustomEvent(SETTINGS_CUSTOM_EVENT, {
          message: 'The invitation was resent.'
        });
      }
    } catch (e: any) {
      console.error('MemberListItem::ResendInvitation', e);
      onError(e);
    }
  };

  const onSeeProfile = () => {
    setIsMenuOpen(false);
    onTourClose([2]);
    onClick();
  };

  const onChangeRole = () => {
    setIsMenuOpen(false);
    props.onChangeRole();
  };

  const onRemove = () => {
    setIsMenuOpen(false);
    onTourClose([2]);
    props.onRemove();
  };

  const showResendInvitationItem =
    !isActive &&
    checkPermissions(AGENCY_INVITATIONS_RESEND, user.role.permissions);

  const showChangeRoleItem =
    isActive &&
    checkPermissions(AGENCY_MEMBERS_ROLE_UPDATE, user.role.permissions);

  const showRemoveItem = checkPermissions(
    isActive ? AGENCY_MEMBERS_REMOVE : AGENCY_INVITATIONS_REMOVE,
    user.role.permissions
  );

  const showMenu = !isUser && (showResendInvitationItem || isRoleLower);

  return (
    <SFCollapse
      className={styles.memberListItem}
      timeout={480}
      in={!wasRemoved}
      onExited={onTransitionEnd}
    >
      <div className={styles.itemWrapper}>
        <SFMenu
          open={isMenuOpen}
          anchorEl={refAnchorEl ? refAnchorEl.current : null}
          onClose={() => {
            onTourClose([2]);
            setIsMenuOpen(false);
          }}
        >
          <SFMenuItem onClick={onSeeProfile}>See profile</SFMenuItem>
          {showResendInvitationItem && (
            <SFMenuItem onClick={onResendInvitation}>
              Resend invitation
            </SFMenuItem>
          )}
          {showChangeRoleItem && member.isFirstOfficer && (
            <TourTooltip
              enterDelay={100}
              title="Change the role"
              description='By clicking on the "Change role" option, you will see all the roles that you can select.'
              step={2}
              lastStep={3}
              tourId={2}
              placement="right"
            >
              <SFMenuItem
                onClick={() => {
                  onTourNext({ tourId: 2, step: 2 });
                  onChangeRole();
                }}
              >
                Change role
              </SFMenuItem>
            </TourTooltip>
          )}

          {showChangeRoleItem && !member.isFirstOfficer && (
            <SFMenuItem onClick={onChangeRole}>Change role</SFMenuItem>
          )}

          {showRemoveItem && <SFMenuItem onClick={onRemove}>Remove</SFMenuItem>}
        </SFMenu>

        <div className={styles.content} onClick={onClick}>
          <Avatar name={member.name} url={member.avatar_thumbnail_url} />

          <div className={styles.memberInfo} onClick={onClick}>
            {member.name && (
              <p className={styles.nameWrapper}>
                <span className={styles.name}>{member.name}</span>
                {isUser && (
                  <span className={styles.textNeutral}>{'(You)'}</span>
                )}
              </p>
            )}

            <p className={`${styles.email} ${styles.textNeutral}`}>
              {member.email}
            </p>

            <div className={styles.chips}>
              {member.role && (
                <SFChip
                  label={member.role?.name}
                  sfColor="primary"
                  variant={isRoleOwner(member.role.id) ? 'default' : 'outlined'}
                  size="small"
                />
              )}

              <SFChip
                label={member.status}
                sfColor={member.status === 'Active' ? 'primary' : 'default'}
                variant="outlined"
                size="small"
              />
            </div>
          </div>
        </div>

        <div className={styles.menu} ref={refAnchorEl}>
          {showMenu && (
            <Fragment>
              {member.isFirstOfficer && (
                <TourTooltip
                  title="Add managers to your agency"
                  description="You can add as many managers as your agency needs. Just click on the 3 ellipses next to the name of the officer you want to make a manager."
                  step={1}
                  lastStep={3}
                  tourId={2}
                  preventOverflow
                  placement="top-end"
                >
                  <SFIconButton
                    className={styles.menuButton}
                    sfIcon="Other"
                    sfSize="medium"
                    onClick={() => {
                      setIsMenuOpen(true);
                      onTourNext({ tourId: 2, step: 1 });
                    }}
                  />
                </TourTooltip>
              )}

              {!member.isFirstOfficer && (
                <SFIconButton
                  className={styles.menuButton}
                  sfIcon="Other"
                  sfSize="medium"
                  onClick={() => {
                    setIsMenuOpen(true);
                  }}
                />
              )}
            </Fragment>
          )}
        </div>
      </div>
    </SFCollapse>
  );
};
