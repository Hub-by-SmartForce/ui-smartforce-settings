import React, { Fragment, useCallback, useContext, useState } from 'react';
import styles from './MemberList.module.scss';
import { MemberListItem } from './MemberListItem/MemberListItem';
import { SFSpinner } from 'sfui';
import { MemberDetailsModal } from '../../../../Components/MemberDetailsModal/MemberDetailsModal';
import { ChangeRoleModal } from '../ChangeRoleModal/ChangeRoleModal';
import { TransferModal } from './TransferModal/TransferModal';
import { RemoveModal } from './RemoveModal/RemoveModal';
import { DowngradeModal } from './DowngradeModal/DowngradeModal';
import {
  UserContext,
  CustomerContext,
  SubscriptionContext
} from '../../../../Context';
import {
  Customer,
  Member,
  MemberRole,
  SettingsError,
  Subscription,
  User
} from '../../../../Models';
import { ApiContext } from '../../../../Context';
import {
  getCustomer,
  changeRole,
  getSubscriptions,
  getUser,
  removeMember,
  deleteTitle,
  setTitle
} from '../../../../Services';
import {
  AGENCY_SUBSCRIPTION_READ,
  SETTINGS_CUSTOM_EVENT
} from '../../../../Constants';
import {
  checkPermissions,
  dispatchCustomEvent,
  isRoleOwner
} from '../../../../Helpers';
import { TourContext } from '../../../../Modules/Tour';
import { SetTitleModal } from '../SetTitleModal/SetTitleModal';

const filterRoles = (
  customerRoles: MemberRole[],
  userRole: MemberRole
): MemberRole[] => {
  return customerRoles.filter(
    (r: MemberRole) => r.priority >= userRole.priority
  );
};

export interface MemberItem extends Member {
  isFirstOfficer?: boolean;
}

export interface MemberListProps {
  members: MemberItem[];
  limit: number;
  isLoading?: boolean;
  onClose: () => void;
  onHome: () => void;
  onError: (e: SettingsError) => void;
  onUpdate: (newMembers: Member[]) => void;
}

export const MemberList = ({
  members,
  limit,
  isLoading,
  onClose,
  onHome,
  onError,
  onUpdate
}: MemberListProps): React.ReactElement<MemberListProps> => {
  const apiBaseUrl = useContext(ApiContext).settings;
  const { onClose: onTourClose, setIsFeatureReminderOpen } =
    useContext(TourContext);
  const { user, setUser } = useContext(UserContext);
  const { customer, setCustomer } = useContext(CustomerContext);
  const { setSubscriptions } = React.useContext(SubscriptionContext);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] =
    useState<boolean>(false);
  const [selected, setSelected] = useState<Member>();
  const [newRole, setNewRole] = useState<MemberRole>();
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState<boolean>(false);
  const [isDowngradeModalOpen, setIsDowngradeModalOpen] =
    useState<boolean>(false);
  const [isTransferModalOpen, setIsTransferModalOpen] =
    useState<boolean>(false);
  const [isSetTitleModalOpen, setIsSetTitleModalOpen] =
    useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);
  const [removeMemberItem, setRemoveMemberItem] = React.useState<Member>();

  const onSelectMember = (member: Member) => {
    setSelected(member);
    setIsDetailsModalOpen(true);
  };

  // Returns updated member, null if encounters an error
  const changeRoleHandler = useCallback(
    async (member: Member, role: MemberRole): Promise<Member | null> => {
      try {
        setIsSaving(true);
        await changeRole(apiBaseUrl, member.id as string, role.id);

        return {
          ...member,
          role
        };
      } catch (e: any) {
        console.error(`MemberList:ChangeRole`, e);
        onError(e);
        return null;
      }
    },
    [apiBaseUrl, onError]
  );

  const onUpdateMember = (updatedMember: Member) => {
    const memberIndex: number = members.findIndex(
      (m: Member) => m.id === updatedMember.id
    );

    const newMembers: Member[] = [
      ...members.slice(0, memberIndex),
      updatedMember,
      ...members.slice(memberIndex + 1, members.length)
    ];

    onUpdate(newMembers);
  };

  const onChangeRole = async (
    member: Member,
    newRole: MemberRole,
    isTour: boolean
  ) => {
    const memberRole = member.role as MemberRole;
    const isDowngrade = newRole.priority > memberRole.priority;

    setNewRole(newRole);

    if (user?.role?.id === newRole.id) {
      setIsChangeRoleModalOpen(false);
      setIsTransferModalOpen(true);
    } else if (isDowngrade) {
      setIsChangeRoleModalOpen(false);
      setIsDowngradeModalOpen(true);
    } else {
      const updatedMember = await changeRoleHandler(member, newRole);

      if (updatedMember) {
        setIsSaving(false);
        onUpdateMember(updatedMember);
        setIsChangeRoleModalOpen(false);
        dispatchCustomEvent(SETTINGS_CUSTOM_EVENT, {
          message: 'The role change was saved.'
        });
      }
    }

    if (isTour) {
      setIsFeatureReminderOpen(true);
    }
  };

  const onChangeMemberRole = (member: Member) => {
    setSelected(member);
    setIsChangeRoleModalOpen(true);
  };

  const onRemoveMember = (member: Member) => {
    setSelected(member);
    setIsRemoveModalOpen(true);
  };

  const onDowngrade = async () => {
    const updatedMember = await changeRoleHandler(
      selected as Member,
      newRole as MemberRole
    );

    if (updatedMember) {
      setIsSaving(false);
      onUpdateMember(updatedMember);
      onDowngradeModalClose();
    }
  };

  const onRemove = async () => {
    if (selected) {
      try {
        setIsSaving(true);
        await removeMember(apiBaseUrl, selected);
        setRemoveMemberItem(selected);

        if (
          checkPermissions(AGENCY_SUBSCRIPTION_READ, user?.role.permissions)
        ) {
          const subscriptions: Subscription[] = await getSubscriptions(
            apiBaseUrl
          );
          setSubscriptions(subscriptions);
        }

        setIsSaving(false);
      } catch (e: any) {
        console.error('MemberList::removeMember', e);
        onError(e);
        return;
      }
    }

    onRemoveModalClose();
  };

  const onTransfer = async () => {
    const updatedMember = await changeRoleHandler(
      selected as Member,
      newRole as MemberRole
    );

    if (updatedMember) {
      try {
        const userData: User = await getUser(apiBaseUrl);
        const customerData: Customer = await getCustomer(apiBaseUrl);
        setUser(userData);
        setCustomer(customerData);
        setIsSaving(false);
        onTransferModalClose();
        onHome();
      } catch (e: any) {
        console.error('MemberList::TransferRole', e);
        onError(e);
      }
    }
  };

  const onRemoveModalClose = () => {
    setIsRemoveModalOpen(false);
  };

  const onDowngradeModalClose = () => {
    setIsDowngradeModalOpen(false);
  };

  const onTransferModalClose = () => {
    setIsTransferModalOpen(false);
  };

  const onRemoveTransitionEnd = () => {
    if (removeMemberItem) {
      const newMembersList = members.filter(
        (m: Member) => m.email !== removeMemberItem.email
      );
      onUpdate(newMembersList);
      setRemoveMemberItem(undefined);
    }
  };

  const onSetTitle = (member: Member) => {
    setSelected(member);
    setIsSetTitleModalOpen(true);
  };

  const onSaveTitle = async (member: Member, titleId: string) => {
    try {
      setIsSaving(true);

      let memberUpdated = { ...member };

      if (titleId.length === 0) {
        await deleteTitle(apiBaseUrl, member.id as string);
        memberUpdated.title = undefined;
      } else {
        const newTitle = await setTitle(
          apiBaseUrl,
          member.id as string,
          titleId
        );
        memberUpdated.title = newTitle;
      }

      onUpdateMember(memberUpdated);

      setIsSaving(false);
      setIsSetTitleModalOpen(false);
    } catch (e: any) {
      console.error('MemberList::onSaveTitle', e);
      onError(e);
      return;
    }
  };

  const rolesAvailable: MemberRole[] = filterRoles(
    customer?.roles as MemberRole[],
    user?.role as MemberRole
  );

  return (
    <div className={styles.memberList}>
      {selected && (
        <Fragment>
          <DowngradeModal
            name={selected.name}
            newRole={newRole?.name}
            open={isDowngradeModalOpen}
            isSaving={isSaving}
            onClose={onDowngradeModalClose}
            onDowngrade={onDowngrade}
          />

          <RemoveModal
            member={selected}
            open={isRemoveModalOpen}
            isSaving={isSaving}
            onRemove={onRemove}
            onClose={onRemoveModalClose}
          />

          <TransferModal
            isOwner={isRoleOwner(user?.role?.id)}
            open={isTransferModalOpen}
            isSaving={isSaving}
            onTransfer={onTransfer}
            onClose={onTransferModalClose}
          />

          <SetTitleModal
            isOpen={isSetTitleModalOpen}
            member={selected}
            isSaving={isSaving}
            onSave={onSaveTitle}
            onBack={() => setIsSetTitleModalOpen(false)}
            onClose={() => {
              onClose();
              setIsSetTitleModalOpen(false);
            }}
          />
        </Fragment>
      )}

      <MemberDetailsModal
        isOpen={isDetailsModalOpen}
        member={selected}
        onBack={() => setIsDetailsModalOpen(false)}
        onClose={() => {
          onClose();
          setIsDetailsModalOpen(false);
        }}
      />

      <ChangeRoleModal
        isOpen={isChangeRoleModalOpen}
        member={selected}
        roles={rolesAvailable}
        isSaving={isSaving}
        onSave={onChangeRole}
        onBack={() => {
          onTourClose([2]);
          setIsChangeRoleModalOpen(false);
        }}
        onClose={() => {
          onClose();
          setIsChangeRoleModalOpen(false);
        }}
      />

      <div>
        {members.slice(0, limit).map((member: Member) => {
          return (
            <MemberListItem
              key={member.email}
              member={member}
              wasRemoved={member.email === removeMemberItem?.email}
              onError={onError}
              onClick={() => onSelectMember(member)}
              onSetTitle={() => onSetTitle(member)}
              onChangeRole={() => onChangeMemberRole(member)}
              onRemove={() => onRemoveMember(member)}
              onTransitionEnd={onRemoveTransitionEnd}
            />
          );
        })}
      </div>

      {isLoading && (
        <div className={styles.spinner}>
          <SFSpinner aria-label="Loading" />
        </div>
      )}
    </div>
  );
};
