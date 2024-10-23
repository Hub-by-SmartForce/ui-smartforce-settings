import React, { useContext, useEffect, useState } from 'react';
import { PanelModal, PanelModalAnchor } from '../../../Components';
import { HttpStatusCode, SFTextField } from 'sfui';
import { ApiContext } from '../../../Context';
import { createTitle, editTitle } from '../../../Services';
import { SettingsError, UserTitle } from '../../../Models';

export interface TitleModalProps {
  title?: UserTitle;
  isOpen: boolean;
  onBack: () => void;
  onClose: () => void;
  onError: (e: SettingsError) => void;
  onFinish: () => void;
  onTransitionEnd: () => void;
}

export const TitleModal = ({
  title,
  isOpen,
  onBack,
  onClose,
  onError,
  onFinish,
  onTransitionEnd
}: TitleModalProps): React.ReactElement<TitleModalProps> => {
  const apiBaseUrl = useContext(ApiContext).settings;
  const [anchor, setAnchor] = useState<PanelModalAnchor>('right');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [nameValue, setNameValue] = useState<string>(title?.name ?? '');
  const [isError, setIsError] = useState<boolean>(false);

  const isEdit = !!title;

  const onSave = async () => {
    setIsSaving(true);

    try {
      if (isEdit) {
        await editTitle(apiBaseUrl, title.id, nameValue);
      } else {
        await createTitle(apiBaseUrl, nameValue);
      }

      setIsSaving(false);
      onFinish();
      onClose();
    } catch (e: any) {
      setIsSaving(false);
      if (e.code === HttpStatusCode.BAD_REQUEST) {
        setIsError(true);
      } else {
        console.error('Settings::CreateGroupModal::Create', e);
        onError(e);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      setNameValue(title?.name ?? '');
      setIsError(false);
    }
  }, [isOpen, title]);

  const onNameChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (isError) {
      setIsError(false);
    }
    setNameValue(e.target.value);
  };

  return (
    <PanelModal
      title={`${isEdit ? 'Edit' : 'Create'} Title`}
      isOpen={isOpen}
      onClose={() => {
        setAnchor('bottom');
        onClose();
      }}
      onBack={onBack}
      anchor={anchor}
      dialogCloseButton={{
        label: 'Discard',
        variant: 'text',
        sfColor: 'grey',
        disabled: isSaving,
        onClick: onBack
      }}
      actionButton={{
        label: isEdit ? 'Save Changes' : 'Create Title',
        isLoading: isSaving,
        disabled:
          isSaving ||
          nameValue.length === 0 ||
          (isEdit && nameValue === title.name),
        onClick: onSave
      }}
      onExit={onTransitionEnd}
    >
      <div>
        <SFTextField
          required
          label="Name"
          error={isError}
          helperText={
            isError
              ? 'This name is already taken.'
              : 'It must be between 1 and 32 characters.'
          }
          inputProps={{ maxLength: 32 }}
          value={nameValue}
          onChange={onNameChange}
        />
      </div>
    </PanelModal>
  );
};
