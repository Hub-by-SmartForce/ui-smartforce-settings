import React, { useContext, useState } from 'react';
import styles from './TitleDeleteDialog.module.scss';
import { SFAlertDialog, SFText } from 'sfui';
import { SettingsError, UserTitle } from '../../../Models';
import { ApiContext } from '../../../Context';
import { deleteTitle } from '../../../Services';

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
  const apiBaseUrl = useContext(ApiContext).settings;
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const onTitleDelete = async () => {
    setIsSaving(true);

    try {
      await deleteTitle(apiBaseUrl, value.id);
      setIsSaving(false);
      onDelete(value);
    } catch (e: any) {
      setIsSaving(false);
      console.error('TitleDeleteDialog::onTitleDelete', e);
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
