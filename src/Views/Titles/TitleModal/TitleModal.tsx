import React, { useContext, useEffect, useState } from 'react';
import { PanelModal, PanelModalAnchor } from '../../../Components';
import { SFTextField } from 'sfui';
import { ApiContext } from '../../../Context';
import { createTitle } from '../../../Services';
import { SettingsError } from '../../../Models';

export interface TitleModalProps {
  name?: string;
  isOpen: boolean;
  onBack: () => void;
  onClose: () => void;
  onError: (e: SettingsError) => void;
  onFinish: () => void;
  onTransitionEnd: () => void;
}

export const TitleModal = ({
  name,
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
  const [nameValue, setNameValue] = useState<string>(name ?? '');

  const isEdit = !!name && name.length > 0;

  const onSave = async () => {
    setIsSaving(true);

    try {
      if (isEdit) {
        //TODO
      } else {
        await createTitle(apiBaseUrl, nameValue);
      }

      setIsSaving(false);
      onFinish();
      onClose();
    } catch (e: any) {
      setIsSaving(false);
      onError(e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setNameValue(name ?? '');
    }
  }, [isOpen, name]);

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
          isSaving || nameValue.length === 0 || (isEdit && nameValue === name),
        onClick: onSave
      }}
      onExit={onTransitionEnd}
    >
      <div>
        <SFTextField
          required
          label="Name"
          helperText="It must be between 1 and 32 characters."
          inputProps={{ maxLength: 32 }}
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
        />
      </div>
    </PanelModal>
  );
};
