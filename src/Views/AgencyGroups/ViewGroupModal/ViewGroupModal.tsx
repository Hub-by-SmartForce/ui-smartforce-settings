import React, { Fragment, useContext, useEffect, useState } from 'react';
import styles from './ViewGroupModal.module.scss';
import { PanelModal, PanelModalAnchor } from '../../../Components';
import {
  addGroupMembers,
  getGroup,
  removeGroupMember
} from '../../../Services';
import {
  Group,
  GroupMember,
  SettingsError,
  User,
  UserGroup
} from '../../../Models';
import { SFPeopleOption, SFSpinner } from 'sfui';
import { GroupInfoHeader } from './GroupInfoHeader/GroupInfoHeader';
import { GroupInfoMembers } from './GroupInfoMembers/GroupInfoMembers';
import { AddMembersModal } from './AddMembersModal/AddMembersModal';
import { UserContext } from '../../../Context';
import { ApiContext } from '../../../Context';

export interface ViewGroupModalProps {
  selected?: Group;
  isOpen: boolean;
  onBack: () => void;
  onClose: () => void;
  onUpdate: () => void;
  onError: (e: SettingsError) => void;
  onRemoveMembers: (newGroup: Group) => void;
}

export const ViewGroupModal = ({
  selected,
  isOpen,
  onBack,
  onClose,
  onUpdate,
  onError,
  onRemoveMembers
}: ViewGroupModalProps): React.ReactElement<ViewGroupModalProps> => {
  const apiBaseUrl = useContext(ApiContext).settings;
  const { user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [group, setGroup] = useState<Group | undefined>();
  const [isAddMembersOpen, setIsAddMembersOpen] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [anchor, setAnchor] = useState<PanelModalAnchor>('right');

  useEffect(() => {
    let isSubscribed = true;

    const update = async () => {
      setIsLoading(true);
      if (selected) {
        try {
          const group = await getGroup(apiBaseUrl, selected.id);
          setIsLoading(false);

          if (isSubscribed) {
            setGroup(group);
          }
        } catch (e: any) {
          setIsLoading(false);
          console.error('Settings::ViewGroupModal::Update');
          onError(e);
        }
      } else {
        setIsLoading(false);
        setGroup(undefined);
      }
    };

    update();

    return () => {
      isSubscribed = false;
    };
  }, [apiBaseUrl, selected, onError]);

  const onMemberRemove = (member: GroupMember) => {
    if (group) {
      try {
        removeGroupMember(apiBaseUrl, group.id, member.id);
      } catch (e: any) {
        console.error('Settins::ViewGroupModal::Remove');
        onError(e);
      }

      const newMemberList = group.members.filter(
        (m: GroupMember) => m.id !== member.id
      );

      const newGroup: Group = {
        ...group,
        members: newMemberList
      };

      setGroup(newGroup);

      // If the removed user it's the active user, remove the group from the context
      const activeUser: User = user as User;

      if (activeUser.id === member.id && activeUser.groups) {
        setUser({
          ...activeUser,
          groups: activeUser.groups.filter((g: UserGroup) => g.id !== group.id)
        });
      }

      onRemoveMembers(newGroup);
    }
  };

  const onAddMembers = async (members: SFPeopleOption[]) => {
    if (group) {
      setIsAdding(true);
      try {
        const membersIds = members.map((m: SFPeopleOption) => m.asyncObject.id);
        await addGroupMembers(apiBaseUrl, group.id, membersIds);
        const updatedGroup = await getGroup(apiBaseUrl, group.id);
        setGroup(updatedGroup);
        setIsAdding(false);
        setIsAddMembersOpen(false);
        const isUserInGroup: boolean =
          members.find((m) => m.asyncObject.id === user?.id) !== undefined;

        if (user && isUserInGroup) {
          const userGroups: UserGroup[] = user.groups ?? [];
          setUser({
            ...user,
            groups: [
              ...userGroups,
              {
                name: updatedGroup.name,
                id: updatedGroup.id,
                acronym: updatedGroup.acronym
              }
            ]
          });
        }
        onUpdate();
      } catch (e: any) {
        setIsAdding(false);
        console.error('Settings::ViewGroupModal::Add');
        onError(e);
      }
      onUpdate();
    }
  };

  const isActive: boolean = group?.status === 'Active';

  return (
    <PanelModal
      anchor={anchor}
      classes={{
        dialog: {
          root: styles.viewGroupModal,
          container: styles.dialogContainer,
          content: styles.dialogContent
        },
        drawer: {
          paper: styles.viewGroupModal,
          content: styles.drawerContent
        }
      }}
      isOpen={isOpen}
      dialogCloseButton={{
        label: 'Close',
        sfColor: 'grey',
        onClick: onBack
      }}
      onBack={onBack}
      onClose={() => {
        setAnchor('bottom');
        onClose();
      }}
    >
      <Fragment key={group?.id}>
        {isActive && (
          <AddMembersModal
            members={group?.members}
            isOpen={isAddMembersOpen}
            isSaving={isAdding}
            onAdd={onAddMembers}
            onBack={() => setIsAddMembersOpen(false)}
            onClose={() => {
              setAnchor('bottom');
              onClose();
              setIsAddMembersOpen(false);
            }}
          />
        )}

        {isLoading && (
          <div className={styles.spinner}>
            <SFSpinner aria-label="Loading" />
          </div>
        )}

        {!isLoading && group && (
          <div className={styles.container}>
            <GroupInfoHeader group={group} />

            <GroupInfoMembers
              isActive={isActive}
              members={group.members}
              onError={onError}
              onClose={onClose}
              onAdd={() => setIsAddMembersOpen(true)}
              onRemove={onMemberRemove}
            />
          </div>
        )}
      </Fragment>
    </PanelModal>
  );
};
