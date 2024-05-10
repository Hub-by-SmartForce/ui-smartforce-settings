import React, { useContext, useEffect, useState } from 'react';
import styles from './AddMembersModal.module.scss';
import { ChipFieldValueType, SFButton } from 'sfui';
import {
  PanelModal,
  PanelModalAnchor
} from '../../../../Components/PanelModal/PanelModal';
import { AgencyMembersForm } from './AgencyMembersForm/AgencyMembersForm';
import { TourContext, TourTooltip } from '../../../../Modules/Tour';
import { isChipListValid } from '../../../../Helpers';

export interface AddMembersModalProps {
  isOpen: boolean;
  isSaving: boolean;
  onAddMembers: (members: string[], isTour: boolean) => void;
  onBack: () => void;
  onClose: () => void;
}

export const AddMembersModal = ({
  isOpen,
  isSaving,
  onAddMembers,
  onBack,
  onClose
}: AddMembersModalProps): React.ReactElement<AddMembersModalProps> => {
  const { status: tourStatus, onEnd: onEndTour } = useContext(TourContext);
  const [members, setMembers] = useState<ChipFieldValueType[]>([]);
  const [anchor, setAnchor] = React.useState<PanelModalAnchor>('right');

  const isMemberListValid = isChipListValid(members);

  useEffect(() => {
    if (!isOpen) {
      setMembers([]);
    }
  }, [isOpen]);

  const onAdd = () => {
    if (tourStatus === 'active') {
      onEndTour();
    }

    onAddMembers(
      members.map((value: ChipFieldValueType) => value.value),
      tourStatus === 'active'
    );
  };

  return (
    <PanelModal
      anchor={anchor}
      isOpen={isOpen}
      title="Add Members"
      onBack={onBack}
      onClose={() => {
        setAnchor('bottom');
        onClose();
      }}
    >
      <div className={styles.addMembersModal}>
        <AgencyMembersForm
          members={members}
          onChange={(newMembers: ChipFieldValueType[]) =>
            setMembers(newMembers)
          }
        />

        <div className={styles.actions}>
          <SFButton
            variant="text"
            sfColor="grey"
            size="large"
            disabled={isSaving}
            onClick={onClose}
          >
            Discard
          </SFButton>

          <TourTooltip
            title="Add members"
            description='By clicking the "Add Members" button, you will invite members to your agency. You can remove them at any time.'
            step={3}
            lastStep={3}
            tourId={1}
            width="fit"
            placement="top-end"
            topZIndex
          >
            <SFButton
              isLoading={isSaving}
              disabled={!isMemberListValid}
              onClick={onAdd}
              size="large"
            >
              {isSaving ? 'Adding' : 'Add Members'}
            </SFButton>
          </TourTooltip>
        </div>
      </div>
    </PanelModal>
  );
};
