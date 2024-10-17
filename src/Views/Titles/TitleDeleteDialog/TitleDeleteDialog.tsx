import React, { useState } from 'react';
import styles from './TitleDeleteDialog.module.scss';
import { SFAlertDialog, SFText } from 'sfui';
import { SettingsError, UserTitle } from '../../../Models';

export interface TitleDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onError: (e: SettingsError) => void;
  onDelete: (title: UserTitle) => void;
  value: UserTitle;
}

export const TitleDeleteDialog = ({
  isOpen,
  onClose,
  onError,
  onDelete,
  value
}: TitleDeleteDialogProps): React.ReactElement<TitleDeleteDialogProps> => {
  //   const apiBaseUrl = useContext(ApiContext).shifts;
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const onTitleDelete = async () => {
    setIsSaving(true);

    try {
      // TODO endpoint call
      setIsSaving(false);
      onDelete(value);
    } catch (e: any) {
      setIsSaving(false);
      onError(e);
    }
  };

  return (
    <SFAlertDialog
      className={styles.titleDeleteDialog}
      title="Delete Title"
      open={isOpen}
      leftAction={{
        label: 'Cancel',
        buttonProps: { variant: 'text', onClick: onClose, disabled: isSaving }
      }}
      rightAction={{
        label: 'Delete Title',
        buttonProps: {
          sfColor: 'red',
          onClick: onTitleDelete,
          isLoading: isSaving,
          disabled: isSaving
        }
      }}
    >
      <SFText type="component-1">
        <span className={styles.textName}>{value.name}</span> will be
        permanently deleted and some members might be affected.
      </SFText>
    </SFAlertDialog>
  );
};
