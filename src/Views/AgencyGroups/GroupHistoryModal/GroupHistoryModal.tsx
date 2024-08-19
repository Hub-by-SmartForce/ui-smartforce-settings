import React, { useContext } from 'react';
import styles from './GroupHistoryModal.module.scss';
import { SFSpinner, SFTimeline, SFTimelineItem } from 'sfui';
import { GroupHistory, GroupUser, User } from '../../../Models';
import { formatDateString } from '../../../Helpers';
import { HistoryTimeLineItem } from '../../../Components/HistoryTimeLineItem/HistoryTimeLineItem';
import {
  PanelModal,
  PanelModalAnchor
} from '../../../Components/PanelModal/PanelModal';
import { UserContext } from '../../../Context';

export interface GroupHistoryModalProps {
  history: GroupHistory[];
  isOpen: boolean;
  isLoading: boolean;
  onBack: () => void;
  onClose: () => void;
}

const getHistoryItemValue = (
  history: GroupHistory,
  activeUser: User
): SFTimelineItem => {
  let historySubtitle: string = '';

  switch (history.type) {
    case 'create':
      historySubtitle = `Created Group \nName: ${
        history.changes.name
      } \nAcronym: ${
        history.changes.acronym
      } \nAdded members: ${history.changes.members
        ?.map((member: GroupUser) => member.name)
        ?.join(', ')}`;
      break;
    case 'delete':
      historySubtitle = 'Deleted group';
      break;
    case 'restore':
      historySubtitle = 'Restored group';
      break;
    case 'update':
      historySubtitle = `Edited group \nName: ${history.changes.name} \nAcronym: ${history.changes.acronym}`;
      break;
    case 'upload':
      historySubtitle = 'Edited avatar';
      break;
    case 'add_members':
      historySubtitle = `Added members: ${history.changes.members
        ?.map((member: GroupUser) => member.name)
        ?.join(', ')}`;
      break;
    default:
      historySubtitle = `Removed members: ${history.changes.members
        ?.map((member: GroupUser) => member.name)
        ?.join(', ')}`;
      break;
  }

  const userName: string = `${history.created_by_user.name}${
    activeUser.id === history.created_by_user.id ? ' (You)' : ''
  }`;

  return {
    title: formatDateString(history.created_at, 'MM/DD/YYYY'),
    children: (
      <HistoryTimeLineItem
        userName={userName}
        avatarUrl={history.created_by_user.avatar_thumbnail_url}
      />
    ),
    subtitle: historySubtitle
  };
};

const transformGroupHistoryToTimeLineItems = (
  history: GroupHistory[],
  activeUser: User
): SFTimelineItem[] => {
  return history.map((h: GroupHistory) => getHistoryItemValue(h, activeUser));
};

export const GroupHistoryModal = ({
  history,
  isOpen,
  isLoading,
  onBack,
  onClose
}: GroupHistoryModalProps): React.ReactElement<GroupHistoryModalProps> => {
  const user = useContext(UserContext).user as User;
  const [anchor, setAnchor] = React.useState<PanelModalAnchor>('right');
  const historyItems = transformGroupHistoryToTimeLineItems(history, user);

  return (
    <PanelModal
      anchor={anchor}
      title="View history"
      isOpen={isOpen}
      onBack={onBack}
      onClose={() => {
        setAnchor('bottom');
        onClose();
      }}
      dialogCloseButton={{
        label: 'Close',
        sfColor: 'grey',
        onClick: onBack
      }}
    >
      <div className={styles.groupHistoryModal}>
        {isLoading && (
          <div className={styles.spinner}>
            <SFSpinner aria-label="Loading" />
          </div>
        )}

        {!isLoading && (
          <SFTimeline
            selectable={false}
            className={styles.timeLine}
            items={historyItems}
          />
        )}
      </div>
    </PanelModal>
  );
};
