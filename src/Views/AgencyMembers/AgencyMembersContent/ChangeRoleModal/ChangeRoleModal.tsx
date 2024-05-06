import React, { useContext, useEffect, useState } from 'react';
import styles from './ChangeRoleModal.module.scss';
import {
  PanelModal,
  PanelModalAnchor
} from '../../../../Components/PanelModal/PanelModal';
import { SFRadioGroup, SFRadioOptionsProps, SFText } from 'sfui';
import { Member, MemberRole } from '../../../../Models';
import { TourContext, TourTooltip } from '../../../../Modules/Tour';

export interface ChangeRoleModalProps {
  isOpen: boolean;
  member?: Member;
  roles: MemberRole[];
  isSaving?: boolean;
  onSave: (member: Member, role: MemberRole, isTour: boolean) => void;
  onBack: () => void;
  onClose: () => void;
}

export const ChangeRoleModal = ({
  isOpen,
  member,
  roles,
  isSaving = false,
  onSave,
  onBack,
  onClose
}: ChangeRoleModalProps): React.ReactElement<ChangeRoleModalProps> => {
  const { status: tourStatus, onEnd: onEndTour } = useContext(TourContext);
  const [roleSelected, setRoleSelected] = useState<string | undefined>(
    member?.role?.id
  );
  const [anchor, setAnchor] = React.useState<PanelModalAnchor>('right');

  useEffect(() => {
    if (isOpen) {
      setRoleSelected(member?.role?.id);
    }
  }, [isOpen, member]);

  const isSaveDisabled: boolean = roleSelected === member?.role?.id;

  const roleOptions: SFRadioOptionsProps[] = roles.map((role: MemberRole) => ({
    value: role.id,
    label: role.name,
    disabled: false
  }));

  const onSaveClick = () => {
    if (tourStatus === 'active') {
      onEndTour();
    }

    onSave(
      member as Member,
      roles.find((role: MemberRole) => role.id === roleSelected) as MemberRole,
      tourStatus === 'active'
    );
  };

  return (
    <PanelModal
      classes={{
        drawer: {
          paper: styles.changeRoleModal
        },
        dialog: {
          root: styles.changeRoleModal,
          container: styles.dialogContainer
        }
      }}
      anchor={anchor}
      isOpen={isOpen}
      title="Change Role"
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
        onClick: () => onSaveClick()
      }}
      onBack={onBack}
      onClose={() => {
        setAnchor('bottom');
        onClose();
      }}
    >
      <div className={styles.content}>
        <TourTooltip
          title="Select the role"
          description="Click on the role you want to assign to the agency member and click on the “Save Changes” button.
              If you are the owner, remember that if you transfer the ownership of the agency to another member, you will lose owner account permissions."
          step={3}
          lastStep={3}
          tourId={2}
          placement="right"
          width="fit"
        >
          <SFText className={styles.dialogTitle} type="component-title">
            Change Role
          </SFText>
        </TourTooltip>

        <SFRadioGroup
          options={roleOptions}
          value={roleSelected}
          onChange={(_e, value: string) => setRoleSelected(value)}
        />
      </div>
    </PanelModal>
  );
};
