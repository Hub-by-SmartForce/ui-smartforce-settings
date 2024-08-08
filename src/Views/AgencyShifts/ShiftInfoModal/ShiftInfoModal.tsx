import React from 'react';
import styles from './ShiftInfoModal.module.scss';
import moment from 'moment';
import { Avatar, PanelModal } from '../../../Components';
import { Divider } from '../../../Components/Divider/Divider';
import { Member, SettingsError, Shift, ShiftMember } from '../../../Models';
import { SFButton, SFPeopleOption, SFSpinner, SFText } from 'sfui';
import {
  formatArrayToString,
  getRecurrenceString,
  getTimeRangeString
} from '../../../Helpers';
import { ShiftInfoModalItem } from './ShiftInfoModalItem/ShiftInfoModalItem';
import { ProgressBar } from './ProgressBar/ProgressBar';
import { ListManagment } from '../../../Components/ListManagment/ListManagment';
import { AddMembersModal } from './AddMembersModal/AddMembersModal';
import {
  addShiftMembers,
  getMemberById,
  removeShiftMember
} from '../../../Services';
import { ApiContext } from '../../../Context';
import { AvatarListItem } from '../../../Components/AvatarListItem/AvatarListItem';
import { MemberDetailsModal } from '../../../Components/MemberDetailsModal/MemberDetailsModal';
import { OcurrenceStatus } from './OcurrenceStatus/OcurrenceStatus';

const filterShiftMembers = (
  list: ShiftMember[],
  filter: string
): ShiftMember[] => {
  if (filter.length < 3) {
    return list;
  }

  return list.filter((l: ShiftMember) =>
    l.name.toLowerCase().includes(filter.toLowerCase())
  );
};

export interface ShiftInfoModalProps {
  isOpen: boolean;
  isLoading: boolean;
  shift?: Shift;
  onClose: () => void;
  onBack: () => void;
  onError: (e: SettingsError) => void;
}

export const ShiftInfoModal = ({
  isOpen,
  onClose,
  onBack,
  onError,
  shift,
  ...props
}: ShiftInfoModalProps): React.ReactElement<ShiftInfoModalProps> => {
  const apiBaseUrl = React.useContext(ApiContext).shifts;
  const settingsBaseUrl = React.useContext(ApiContext).settings;
  const [isAddMembersOpen, setIsAddMembersOpen] =
    React.useState<boolean>(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] =
    React.useState<boolean>(false);
  const [detailsModalValue, setDetailsModalValue] = React.useState<Member>();
  const [participants, setParticipants] = React.useState<ShiftMember[]>(
    shift?.participants ?? []
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isModalLoading, setIsModalLoading] = React.useState<boolean>(false);
  const isActive: boolean = shift?.status === 'Active';

  const onMemberRemove = async (member: ShiftMember) => {
    setIsLoading(true);

    try {
      if (shift) {
        await removeShiftMember(apiBaseUrl, shift.id, member.id);
        const removedMember = participants.filter(
          (p: ShiftMember) => p.id !== member.id
        );
        setParticipants(removedMember);
        setIsLoading(false);
      }
    } catch (e: any) {
      setIsLoading(false);
      onError(e);
    }
  };

  const onAddMembers = async (members: SFPeopleOption[]) => {
    const newMembers = members.map((m: SFPeopleOption) => ({
      id: m.asyncObject.id
    }));
    setIsModalLoading(true);

    try {
      if (shift) {
        const addedMembers = await addShiftMembers(
          apiBaseUrl,
          shift.id,
          newMembers
        );
        setParticipants([...participants, ...addedMembers]);
        setIsModalLoading(false);
        setIsAddMembersOpen(false);
      }
    } catch (e: any) {
      setIsModalLoading(false);
      onError(e);
    }
  };

  const onSeeMemberInformation = async (item: ShiftMember) => {
    setIsModalLoading(true);
    setIsDetailsModalOpen(true);

    try {
      const response = await getMemberById(settingsBaseUrl, item.id);
      setIsModalLoading(false);
      setDetailsModalValue(response);
    } catch (e: any) {
      setIsModalLoading(false);
      onError(e);
    }
  };

  React.useEffect(() => {
    if (shift) {
      setParticipants(shift.participants);
    }
  }, [shift]);

  return (
    <PanelModal
      isOpen={isOpen}
      onClose={onClose}
      onBack={onBack}
      dialogCloseButton={{
        label: 'Close',
        sfColor: 'grey',
        onClick: onBack
      }}
    >
      <AddMembersModal
        participants={participants}
        isOpen={isAddMembersOpen}
        isSaving={isModalLoading}
        onAdd={onAddMembers}
        onBack={() => setIsAddMembersOpen(false)}
        onClose={() => {
          onClose();
          setIsAddMembersOpen(false);
        }}
      />

      {props.isLoading && (
        <div className={styles.spinner}>
          <SFSpinner aria-label="Loading" />
        </div>
      )}

      {!props.isLoading && shift && (
        <div className={styles.shiftInfoModal}>
          <MemberDetailsModal
            member={detailsModalValue}
            isOpen={isDetailsModalOpen}
            isLoading={isModalLoading}
            onClose={() => {
              onClose();
              setIsDetailsModalOpen(false);
            }}
            onBack={() => setIsDetailsModalOpen(false)}
          />
          <Avatar acronym={shift?.acronym} size="large" />
          <div className={styles.header}>
            <SFText type="component-title">{shift?.name}</SFText>
            <OcurrenceStatus
              start={shift.start.datetime}
              end={shift.end.datetime}
              recurrence={shift.recurrence}
            />
          </div>

          <div className={styles.content}>
            <ShiftInfoModalItem
              icon="Refresh"
              text={getRecurrenceString(shift.recurrence)}
            />
            <ShiftInfoModalItem
              icon="Clock"
              text={`${getTimeRangeString(
                shift.start.datetime,
                shift.end.datetime
              )}`}
            />
            <ShiftInfoModalItem
              icon="Callendar"
              text={`From ${moment(shift.start.datetime).format('L')}`}
            />
            {shift.areas && shift.areas.length > 0 && (
              <ShiftInfoModalItem
                icon="Map"
                text={formatArrayToString(shift.areas.map((a) => a.name))}
              />
            )}
            {shift.supervisor && (
              <ShiftInfoModalItem icon="User-1" text={shift.supervisor.name} />
            )}
          </div>
          <Divider />
          <div>
            <ShiftInfoModalItem icon="Users" text="Minimum Staffing" />
            <ProgressBar value={participants.length} peak={shift.min_staff} />
          </div>
          <Divider />
          <ListManagment<ShiftMember>
            renderCreateButton={(props) => (
              <SFButton
                {...props}
                disabled={!isActive}
                onClick={() => setIsAddMembersOpen(true)}
              >
                Add Members
              </SFButton>
            )}
            emptyMessage="There are no members yet."
            label="Member"
            showItemMenu={isActive}
            list={participants}
            isLoading={isLoading}
            filter={filterShiftMembers}
            onClick={onSeeMemberInformation}
            options={[
              {
                label: 'Remove from shift',
                onClick: onMemberRemove
              }
            ]}
            renderItem={(item) => (
              <AvatarListItem
                name={item.name}
                url={item.avatar_thumbnail_url}
              />
            )}
          />
        </div>
      )}
    </PanelModal>
  );
};
