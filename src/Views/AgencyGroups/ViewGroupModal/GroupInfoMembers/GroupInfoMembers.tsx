import React, { Fragment, useState } from 'react';
import styles from './GroupInfoMembers.module.scss';
import { SFButton, SFDivider, SFScrollable, SFSearch, SFText } from 'sfui';
import { GroupMember, Member, SettingsError } from '../../../../Models';
import { MemberList } from './MemberList/MemberList';
import { ApiContext } from '../../../../Context';
import { getMemberById } from '../../../../Services';
import { MemberDetailsModal } from '../../../../Components/MemberDetailsModal/MemberDetailsModal';

const MEMBERS_LIMIT = 10;

function getFilteredMembers(
  members: GroupMember[],
  filter: string
): GroupMember[] {
  if (filter.length < 3) {
    return members;
  } else {
    const filterLower = filter.toLowerCase();
    return members.filter((m: GroupMember) =>
      m.name.toLowerCase().includes(filterLower)
    );
  }
}

export interface GroupInfoMembersProps {
  isActive: boolean;
  members: GroupMember[];
  onAdd: () => void;
  onClose: () => void;
  onError: (e: SettingsError) => void;
  onRemove: (member: GroupMember) => void;
}

export const GroupInfoMembers = ({
  isActive,
  members,
  onAdd,
  onClose,
  onError,
  onRemove
}: GroupInfoMembersProps): React.ReactElement<GroupInfoMembersProps> => {
  const settingsBaseUrl = React.useContext(ApiContext).settings;
  const [searchValue, setSearchValue] = useState<string>('');
  const [limit, setLimit] = useState<number>(MEMBERS_LIMIT);
  const [isDetailsModalOpen, setIsDetailsModalOpen] =
    React.useState<boolean>(false);
  const [detailsModalValue, setDetailsModalValue] = React.useState<Member>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const filteredMembers: GroupMember[] = getFilteredMembers(
    members,
    searchValue
  );

  const visibleMembers: GroupMember[] = filteredMembers.slice(0, limit);
  const refSearchValueLength = React.useRef<number>(searchValue.length);

  const onSeeMemberInformation = async (memberId: string) => {
    setIsLoading(true);
    setIsDetailsModalOpen(true);

    try {
      const response = await getMemberById(settingsBaseUrl, memberId);
      setIsLoading(false);
      setDetailsModalValue(response);
    } catch (e: any) {
      setIsLoading(false);
      onError(e);
    }
  };

  React.useEffect(() => {
    if (searchValue.length > 2 || refSearchValueLength.current > 2) {
      setLimit(MEMBERS_LIMIT);
    }

    refSearchValueLength.current = searchValue.length;
  }, [searchValue]);

  const isEmpty: boolean = members.length === 0;

  return (
    <SFScrollable containerClassName={styles.groupInfoMembers}>
      <MemberDetailsModal
        isOpen={isDetailsModalOpen}
        isLoading={isLoading}
        member={detailsModalValue}
        onBack={() => setIsDetailsModalOpen(false)}
        onClose={() => {
          setIsDetailsModalOpen(false);
          onClose();
        }}
      />
      <div className={styles.addMember}>
        <SFText type="component-1">{members.length} group members</SFText>
        <SFButton
          disabled={!isActive}
          fullWidth
          variant="outlined"
          sfColor="blue"
          size="medium"
          onClick={onAdd}
        >
          Add Members
        </SFButton>
      </div>

      {!isEmpty && (
        <div className={styles.search}>
          <SFSearch
            label="Search member"
            value={searchValue}
            onChange={(value: string) => setSearchValue(value)}
          />
        </div>
      )}

      <SFDivider size={2} />

      {isEmpty && (
        <SFText className={styles.emptyMsg} type="component-2">
          There are no members added.
        </SFText>
      )}

      {!isEmpty && (
        <Fragment>
          <MemberList
            isActive={isActive}
            onClick={onSeeMemberInformation}
            members={visibleMembers}
            onRemove={onRemove}
          />

          {limit < filteredMembers.length && (
            <SFButton
              fullWidth
              sfColor="grey"
              size="medium"
              variant="text"
              onClick={() => setLimit((limit) => limit + MEMBERS_LIMIT)}
            >
              See More
            </SFButton>
          )}

          {visibleMembers.length === members.length &&
            limit > MEMBERS_LIMIT && (
              <SFButton
                fullWidth
                sfColor="grey"
                size="medium"
                variant="text"
                onClick={() => setLimit(MEMBERS_LIMIT)}
              >
                See Less
              </SFButton>
            )}
        </Fragment>
      )}
    </SFScrollable>
  );
};
