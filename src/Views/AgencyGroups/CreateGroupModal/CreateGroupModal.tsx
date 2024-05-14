import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from './CreateGroupModal.module.scss';
import {
  PanelModal,
  PanelModalAnchor
} from '../../../Components/PanelModal/PanelModal';
import {
  CreateGroupError,
  CreateGroupForm,
  GroupFormValue
} from './CreateGroupForm/CreateGroupForm';
import { Group, User, SettingsError } from '../../../Models';
import { saveGroup, saveGroupAvatar } from '../../../Services/GroupService';
import { HttpStatusCode, SFButton, SFPeopleOption } from 'sfui';
import { removeRepetead } from '../../../Helpers';
import {
  ERROR_GROUP_ACRONYM_ALREADY_EXISTS,
  ERROR_GROUP_NAME_ALREADY_EXISTS
} from '../../../Constants';
import { UserContext, ApiContext } from '../../../Context';
import { TourContext, TourTooltip } from '../../../Modules/Tour';

const initValue: GroupFormValue = {
  name: '',
  acronym: '',
  members: []
};

const initError: CreateGroupError = {
  name: false,
  acronym: false
};

function isFormInvalid(
  formValue: GroupFormValue,
  error: CreateGroupError
): boolean {
  return (
    formValue.name.length === 0 ||
    formValue.acronym.length === 0 ||
    error.name ||
    error.acronym
  );
}

export interface CreateGroupModalProps {
  isOpen: boolean;
  onBack: () => void;
  onClose: () => void;
  onCreate: () => void;
  onError: (e: SettingsError) => void;
}

export const CreateGroupModal = ({
  isOpen,
  onBack,
  onClose,
  onError,
  ...props
}: CreateGroupModalProps): React.ReactElement<CreateGroupModalProps> => {
  const apiBaseUrl = useContext(ApiContext).settings;
  const { user, setUser } = useContext(UserContext);
  const { onNext: onTourNext } = useContext(TourContext);
  const [value, setValue] = useState<GroupFormValue>(initValue);
  const [error, setError] = useState<CreateGroupError>(initError);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [anchor, setAnchor] = React.useState<PanelModalAnchor>('right');

  const refPristine = useRef<boolean>(true);
  const refIsMembersPristine = useRef<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      refPristine.current = true;
      refIsMembersPristine.current = true;
      setValue(initValue);
      setError(initError);
    }
  }, [isOpen]);

  const onDiscard = () => {
    setValue(initValue);
    setError(initError);
    onBack();
  };

  const onGroupChange = (newGroup: GroupFormValue) => {
    let newError = { ...error };

    if (newGroup.name !== value.name) {
      newError = { ...newError, name: false };
    }

    if (newGroup.acronym !== value.acronym) {
      newError = { ...newError, acronym: false };
    }

    if (refPristine.current && !isFormInvalid(newGroup, newError)) {
      refPristine.current = false;
      onTourNext({ tourId: 9, step: 2 });
    }

    if (
      refIsMembersPristine.current &&
      newGroup.members &&
      newGroup.members?.length > 0
    ) {
      refIsMembersPristine.current = false;
      onTourNext({ tourId: 9, step: 3 });
    }

    setError(newError);
    setValue(newGroup);
  };

  const onCreate = async () => {
    setIsSaving(true);

    try {
      const selectedMembers = (value.members as SFPeopleOption[]).map(
        (option: SFPeopleOption) => option.asyncObject.id
      );

      const activeUser = user as User;

      const newGroup: Group = await saveGroup(apiBaseUrl, {
        name: value.name,
        acronym: value.acronym,
        members: removeRepetead<string>([activeUser.id, ...selectedMembers])
      });

      // Add the image to the group
      if (value.avatar instanceof Blob) {
        await saveGroupAvatar(apiBaseUrl, value.avatar, newGroup.id);
      }

      // Add the group to the user's context
      setUser({
        ...activeUser,
        groups: [
          ...(activeUser.groups || []),
          {
            id: newGroup.id,
            name: newGroup.name
          }
        ]
      });

      setIsSaving(false);
      props.onCreate();
      onBack();
    } catch (e: any) {
      setIsSaving(false);
      if (e.code === HttpStatusCode.BAD_REQUEST) {
        const groupError: CreateGroupError = {
          name: e.detail.includes(ERROR_GROUP_NAME_ALREADY_EXISTS),
          acronym: e.detail.includes(ERROR_GROUP_ACRONYM_ALREADY_EXISTS)
        };
        setError(groupError);
      } else {
        console.error('Settings::CreateGroupModal::Create', e);
        onError(e);
      }
    }
  };

  return (
    <PanelModal
      anchor={anchor}
      isOpen={isOpen}
      title="Create Group"
      onBack={onDiscard}
      onClose={() => {
        setAnchor('bottom');
        onClose();
      }}
    >
      <div className={styles.createGroupModal}>
        <CreateGroupForm
          isNew
          error={error}
          value={value}
          onChange={onGroupChange}
        />

        <div className={styles.actions}>
          <SFButton
            variant="text"
            sfColor="grey"
            size="large"
            disabled={isSaving}
            onClick={onDiscard}
          >
            Discard
          </SFButton>

          <TourTooltip
            title="Create the group"
            description='By clicking the "Create Group" button will create the group in your agency. You can delete the group at any time.'
            step={5}
            lastStep={5}
            tourId={9}
            width="fit"
            placement="top-end"
            topZIndex
          >
            <SFButton
              isLoading={isSaving}
              disabled={isFormInvalid(value, error)}
              onClick={onCreate}
              size="large"
            >
              Create Group
            </SFButton>
          </TourTooltip>
        </div>
      </div>
    </PanelModal>
  );
};
