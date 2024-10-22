import React, { useContext, useEffect, useState } from 'react';
import styles from './SetTitleModal.module.scss';
import { Avatar, PanelModal, PanelModalAnchor } from '../../../../Components';
import { Member, UserTitle } from '../../../../Models';
import { SFSelect, SFText } from 'sfui';
import { getTitles } from '../../../../Services';
import { ApiContext } from '../../../../Context';

function getInitialValue(member: Member): string {
  if (member.title) {
    return member.title.id;
  } else {
    return '';
  }
}

export interface SetTitleModalProps {
  isOpen: boolean;
  member: Member;
  isSaving?: boolean;
  onSave: (member: Member, titleId: string) => void;
  onBack: () => void;
  onClose: () => void;
}

export const SetTitleModal = ({
  isOpen,
  member,
  isSaving,
  onSave,
  onBack,
  onClose
}: SetTitleModalProps): React.ReactElement<SetTitleModalProps> => {
  const apiBaseUrl = useContext(ApiContext).settings;
  const [anchor, setAnchor] = useState<PanelModalAnchor>('right');
  const [value, setValue] = useState<string>(getInitialValue(member));
  const [titles, setTitles] = useState<UserTitle[]>([]);

  const options = [
    { label: '', value: '' },
    ...titles.map((t) => ({ label: t.name, value: t.id }))
  ];

  const isSaveDisabled =
    (!member.title && value.length === 0) || member.title?.id === value;

  useEffect(() => {
    if (isOpen) {
      setValue(getInitialValue(member));
    }
  }, [isOpen, member]);

  useEffect(() => {
    let isSubscribed = true;
    const init = async () => {
      const titles = await getTitles(apiBaseUrl);
      if (isSubscribed) {
        setTitles(titles);
      }
    };

    init();

    return () => {
      isSubscribed = false;
    };
  }, [apiBaseUrl]);

  return (
    <PanelModal
      classes={{
        drawer: {
          paper: styles.setTitleModal
        },
        dialog: {
          root: styles.setTitleModal,
          container: styles.dialogContainer
        }
      }}
      anchor={anchor}
      isOpen={isOpen}
      title="Set title"
      dialogCloseButton={{
        label: 'Discard',
        variant: 'text',
        sfColor: 'grey',
        disabled: isSaving,
        onClick: onBack
      }}
      actionButton={{
        label: isSaving ? 'Saving' : 'Save Changes',
        isLoading: isSaving,
        disabled: isSaveDisabled,
        onClick: () => onSave(member, value)
      }}
      onBack={onBack}
      onClose={() => {
        setAnchor('bottom');
        onClose();
      }}
    >
      {member && (
        <div className={styles.content}>
          <SFText className={styles.dialogTitle} type="component-title">
            Set title
          </SFText>

          <div className={styles.memberInfo}>
            <Avatar size="medium" name={member.name} url={member.avatar_url} />

            <div>
              {member.title && (
                <SFText type="component-3">
                  {member.title.name.toUpperCase()}
                </SFText>
              )}
              <SFText type="component-1-medium">{member.name}</SFText>
            </div>
          </div>

          <SFSelect
            value={value}
            label="Title"
            options={options}
            onChange={(e) => setValue(e.target.value as string)}
          />
        </div>
      )}
    </PanelModal>
  );
};
