import React from 'react';
import styles from './MemberDetailsModal.module.scss';
import { SFChip, SFText } from 'sfui';
import { PanelModal, PanelModalAnchor } from '../PanelModal/PanelModal';
import { Avatar } from '../Avatar/Avatar';
import { Member, MemberGroup } from '../../Models';
import { isRoleOwner } from '../../Helpers';
import { Loader } from '../Loader/Loader';

export interface MemberDetailsModalProps {
  isOpen: boolean;
  member?: Member;
  isLoading?: boolean;
  onBack: () => void;
  onClose: () => void;
}

export const MemberDetailsModal = ({
  isOpen,
  member,
  isLoading,
  onBack,
  onClose
}: MemberDetailsModalProps): React.ReactElement<MemberDetailsModalProps> => {
  const [anchor, setAnchor] = React.useState<PanelModalAnchor>('right');
  return (
    <PanelModal
      anchor={anchor}
      isOpen={isOpen}
      dialogCloseButton={{
        label: 'Close',
        sfColor: 'grey',
        onClick: onBack
      }}
      onBack={onBack}
      onClose={() => {
        setAnchor('bottom');
        onClose();
      }}
    >
      {isLoading && <Loader />}
      {!isLoading && member && (
        <div className={styles.memberDetails}>
          <Avatar size="large" name={member.name} url={member.avatar_url} />

          <div className={styles.memberName}>
            {member.title && (
              <SFText type="component-1">
                {member.title.name.toUpperCase()}
              </SFText>
            )}
            {member.name && <span className={styles.name}>{member.name}</span>}
            <span className={styles.email}>{member.email}</span>
          </div>

          {member.role && (
            <div className={styles.infoItemChip}>
              <span className={styles.infoItemChipLabel}>Role</span>
              <SFChip
                label={member.role.name}
                sfColor="primary"
                variant={isRoleOwner(member.role.id) ? 'default' : 'outlined'}
                size="small"
              />
            </div>
          )}

          <div className={styles.infoItemChip}>
            <span className={styles.infoItemChipLabel}>Status</span>
            <SFChip
              label={member.status}
              sfColor={member.status === 'Active' ? 'primary' : 'default'}
              variant="outlined"
              size="small"
            />
          </div>

          {member.officer_id && (
            <div className={styles.infoItem}>
              <span className={styles.infoItemLabel}>Officer ID Number</span>
              <span className={styles.infoItemValue}>{member.officer_id}</span>
            </div>
          )}

          {member.officer_post_number && (
            <div className={styles.infoItem}>
              <span className={styles.infoItemLabel}>POST Number</span>
              <span className={styles.infoItemValue}>
                {member.officer_post_number}
              </span>
            </div>
          )}

          {member.groups && (
            <div className={styles.infoItemChip}>
              <span className={styles.infoItemChipLabel}>Groups</span>
              {member.groups.length === 0 && (
                <SFText type="component-1" sfColor="neutral">
                  This member is not part of any group.
                </SFText>
              )}
              {member.groups.length > 0 &&
                member.groups.map((group: MemberGroup) => (
                  <SFChip
                    key={group.id}
                    sfColor="default"
                    size="small"
                    variant="outlined"
                    label={group.name}
                  />
                ))}
            </div>
          )}
        </div>
      )}
    </PanelModal>
  );
};
