import React from 'react';
import styles from './AgencyEventsModal.module.scss';
import { PanelModal, PanelModalAnchor } from '../../../Components';
import { SFTextField } from 'sfui';
import { Divider } from '../../../Components/Divider/Divider';
import { ColorPicker } from './ColorPicker/ColorPicker';
import { AgencyEvent, AgencyEventType, SettingsError } from '../../../Models';
import { ApiContext } from '../../../Context';
import { createEventType, editEventType } from '../../../Services';

const isSaveDisabled = (
  isSaving: boolean,
  formValue?: AgencyEvent,
  value?: AgencyEventType
) => {
  return (
    !formValue ||
    !formValue.color ||
    !formValue.name ||
    isSaving ||
    (formValue.color === value?.color && formValue.name === value?.name)
  );
};

const defaultFormValue: AgencyEvent = {
  name: '',
  color: ''
};

export interface AgencyEventsModalProps {
  isOpen: boolean;
  onBack: () => void;
  onClose: () => void;
  onError: (e: SettingsError) => void;
  onFinish: () => void;
  value?: AgencyEventType;
}

export const AgencyEventsModal = ({
  isOpen,
  onBack,
  onClose,
  onError,
  onFinish,
  value
}: AgencyEventsModalProps): React.ReactElement<AgencyEventsModalProps> => {
  const apiBaseUrl = React.useContext(ApiContext).shifts;
  const [anchor, setAnchor] = React.useState<PanelModalAnchor>('right');
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const [formValue, setFormValue] = React.useState<AgencyEvent>(
    value ?? defaultFormValue
  );

  const onColorChange = (color: string): void => {
    setFormValue({ ...formValue, color });
  };

  const onNameChange = (name: string): void => {
    setFormValue({ ...formValue, name });
  };

  const onSave = async () => {
    setIsSaving(true);

    try {
      if (value) {
        await editEventType(apiBaseUrl, { ...value, ...formValue });
      } else {
        await createEventType(apiBaseUrl, formValue);
      }

      setIsSaving(false);
      onFinish();
      onClose();
    } catch (e: any) {
      setIsSaving(false);
      onError(e);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      setFormValue(value ?? defaultFormValue);
    }
  }, [isOpen, value]);

  return (
    <PanelModal
      title={`${value ? 'Edit' : 'Create'} Event Type`}
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
        label: value ? 'Save Changes' : 'Create Event Type',
        isLoading: isSaving,
        disabled: isSaveDisabled(isSaving, formValue, value),
        onClick: onSave
      }}
    >
      <div className={styles.agencyEventsModal}>
        <SFTextField
          required
          label="Name"
          helperText="It must be between 1 and 32 characters."
          inputProps={{ maxLength: 32 }}
          value={formValue?.name}
          onChange={(e) => onNameChange(e.target.value)}
        />
        <Divider />
        <ColorPicker
          title="Set color"
          selected={formValue?.color}
          onClick={onColorChange}
        />
      </div>
    </PanelModal>
  );
};
