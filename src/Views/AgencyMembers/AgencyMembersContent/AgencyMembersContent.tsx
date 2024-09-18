import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from './AgencyMembersContent.module.scss';
import { SFButton, SFSearch } from 'sfui';
import { AddMembersModal } from './AddMembersModal/AddMembersModal';
import { MemberItem, MemberList } from './MemberList/MemberList';
import { SubscriptionContext, UserContext } from '../../../Context';
import { NoMembersResult } from './NoMembersResult/NoMembersResult';
import {
  AGENCY_SUBSCRIPTION_READ,
  AGENCY_INVITATIONS_CREATE
} from '../../../Constants';
import {
  asyncDebounce,
  checkPermissions,
  isRoleOfficer
} from '../../../Helpers';
import {
  MemberResponse,
  Member,
  Subscription,
  SettingsError
} from '../../../Models';
import {
  GetMembersFn,
  getMembers,
  getNextMembers,
  addMembers,
  getSubscriptions
} from '../../../Services';
import { Divider } from '../../../Components/Divider/Divider';
import { ApiContext } from '../../../Context';
import { TourContext, TourTooltip, useCloseTour } from '../../../Modules/Tour';

const PAGE_SIZE = 10;

type SearchMemberFnResponse = (filter: string) => Promise<MemberResponse>;

interface MemoizeMember {
  [key: string]: MemberResponse;
}

const memoizedMemberFn = (
  baseUrl: string,
  fn: GetMembersFn
): SearchMemberFnResponse => {
  const cache: MemoizeMember = {};

  return async (filter: string): Promise<MemberResponse> => {
    const cacheFilter = filter.length < 3 ? '' : filter;
    if (cacheFilter in cache) {
      return cache[cacheFilter];
    } else {
      try {
        let response: MemberResponse = await fn(
          baseUrl,
          'invitations',
          cacheFilter
        );

        if (!response.links.next) {
          const membersResult = await fn(baseUrl, 'members', cacheFilter);
          response.data = [...response.data, ...membersResult.data];
          if (membersResult.data.length > 0) {
            response.links.next = membersResult.links.next;
          }
        }
        cache[cacheFilter] = response;

        return response;
      } catch (e) {
        console.error('AgencyMembers::SearchMembersFn', e);
        return { data: [], links: {} };
      }
    }
  };
};

function setFirstOfficer(members: Member[]): MemberItem[] {
  let result: MemberItem[] = [];
  let officerFound = false;

  for (let member of members) {
    let newMember: MemberItem = {
      ...member,
      isFirstOfficer: false
    };

    if (!officerFound && isRoleOfficer(member.role?.id)) {
      officerFound = true;
      newMember.isFirstOfficer = true;
      result = [...result, newMember];
    } else {
      result = [...result, newMember];
    }
  }

  return result;
}

export interface AgencyMembersContentProps {
  onClose: () => void;
  onError: (e: SettingsError) => void;
  onHome: () => void;
}

export const AgencyMembersContent = ({
  onClose,
  onError,
  onHome
}: AgencyMembersContentProps): React.ReactElement<AgencyMembersContentProps> => {
  const {
    onNext: onTourNext,
    onClose: onTourClose,
    setIsFeatureReminderOpen
  } = useContext(TourContext);
  const apiBaseUrl = useContext(ApiContext).settings;
  const { user } = React.useContext(UserContext);
  const { setSubscriptions } = React.useContext(SubscriptionContext);

  const [members, setMembers] = React.useState<MemberItem[]>([]);
  const [searchValue, setSearchValue] = React.useState<string>('');
  const [showLimit, setShowLimit] = React.useState<number>(PAGE_SIZE);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const [isAddMembersModalOpen, setIsAddMembersModalOpen] = useState(false);
  const [hasMoreMembers, setHasMoreMembers] = React.useState<boolean>(false);

  const refPrevSearch = useRef<string>('');
  const refSeeMoreUrl = React.useRef<string | undefined>();
  const refGetSearchMembers = React.useRef<any>(
    asyncDebounce(memoizedMemberFn(apiBaseUrl, getMembers), 250)
  );

  useCloseTour([1, 2, 3]);

  useEffect(() => {
    let subscribed: boolean = true;

    const search = async () => {
      try {
        if (refGetSearchMembers.current) {
          setIsLoading(true);

          // Clear members and show loading
          if (searchValue.length >= 3 || refPrevSearch.current.length >= 3) {
            setMembers([]);
          }

          const response = await refGetSearchMembers.current(searchValue);

          if (subscribed && response) {
            refSeeMoreUrl.current = response.links.next;
            setMembers(setFirstOfficer(response.data));
            setHasMoreMembers(!!response.links.next);
            setShowLimit(PAGE_SIZE);
            setIsLoading(false);

            refPrevSearch.current = searchValue;
          }
        }
      } catch (e: any) {
        console.error('AgencyMembers::Update', e);
        onError(e);
      }
    };

    search();

    return () => {
      subscribed = false;
    };
  }, [searchValue, onError]);

  const loadMoreMembers = React.useCallback(async () => {
    if (refSeeMoreUrl.current) {
      try {
        setIsLoading(true);
        const response = await getNextMembers(refSeeMoreUrl.current);
        if (
          !response.links.next &&
          refSeeMoreUrl.current.includes('invitations')
        ) {
          const memberResponse = await getMembers(
            apiBaseUrl,
            'members',
            searchValue
          );

          response.data = setFirstOfficer([
            ...response.data,
            ...memberResponse.data
          ]);
          response.links.next = memberResponse.links.next;
        }
        refSeeMoreUrl.current = response.links.next;
        setMembers((members) => [...members, ...response.data]);
        setShowLimit((showLimit) => showLimit + PAGE_SIZE);
        setHasMoreMembers(!!response.links.next);
        setIsLoading(false);
      } catch (e: any) {
        console.error('AgencyMembers::Update', e);
        onError(e);
      }
    }
  }, [apiBaseUrl, searchValue, onError]);

  const onSeeMore = () => {
    if (hasMoreMembers) {
      loadMoreMembers();
    } else {
      setShowLimit((showLimit) => showLimit + PAGE_SIZE);
    }
  };

  const onSeeLess = () => {
    setShowLimit(PAGE_SIZE);
  };

  const resetSearchFn = () => {
    refGetSearchMembers.current = asyncDebounce(
      memoizedMemberFn(apiBaseUrl, getMembers),
      250
    );
  };

  const onAddMembers = async (members: string[], isTour: boolean) => {
    setIsSaving(true);
    try {
      await addMembers(apiBaseUrl, members);

      // Reset search cache and update member list
      resetSearchFn();

      const response = await refGetSearchMembers.current(searchValue);
      if (response) {
        setMembers(setFirstOfficer(response.data));
        setHasMoreMembers(!!response.links.next);
        setShowLimit(PAGE_SIZE);

        if (
          checkPermissions(AGENCY_SUBSCRIPTION_READ, user?.role.permissions)
        ) {
          const newSubscriptions: Subscription[] = await getSubscriptions(
            apiBaseUrl
          );

          setSubscriptions(newSubscriptions);
        }
      }

      setIsSaving(false);
      setIsAddMembersModalOpen(false);

      if (isTour) {
        setIsFeatureReminderOpen(true);
      }
    } catch (e: any) {
      console.error(`AgencyMembersContent:AddMembers`, e);
      onError(e);
    }
  };

  const onSearchMembers = async (value: string): Promise<void> => {
    refSeeMoreUrl.current = undefined;
    setSearchValue(value);
  };

  const onUpdateList = (newMembers: Member[]) => {
    setMembers(setFirstOfficer(newMembers));
    //Clear cached results to avoid roles inconsistency
    resetSearchFn();
  };

  const showAddMembersButton = checkPermissions(
    AGENCY_INVITATIONS_CREATE,
    user?.role?.permissions
  );

  const onModalClose = () => {
    onClose();
    onTourClose([1]);
    setIsAddMembersModalOpen(false);
  };

  return (
    <div className={styles.agencyMembersContent}>
      <AddMembersModal
        isOpen={isAddMembersModalOpen}
        isSaving={isSaving}
        onBack={() => setIsAddMembersModalOpen(false)}
        onClose={onModalClose}
        onAddMembers={onAddMembers}
      />

      {showAddMembersButton && (
        <TourTooltip
          title="Invite your agency members"
          description="You can invite as many officers as your agency needs. Just click the “Add Members” button and follow the steps."
          step={1}
          lastStep={3}
          tourId={1}
          preventOverflow
        >
          <SFButton
            variant="outlined"
            fullWidth
            onClick={() => {
              setIsAddMembersModalOpen(true);
              onTourNext({ tourId: 1, step: 1 });
            }}
          >
            Add Members
          </SFButton>
        </TourTooltip>
      )}

      <div className={styles.searchUser}>
        <SFSearch
          label="Search member"
          value={searchValue}
          onChange={onSearchMembers}
        />
      </div>
      <Divider size={2} />

      <MemberList
        members={members}
        limit={showLimit}
        isLoading={isLoading}
        onError={onError}
        onHome={onHome}
        onUpdate={onUpdateList}
        onClose={onClose}
      />

      {!isLoading && members.length === 0 && (
        <NoMembersResult searchValue={searchValue} />
      )}

      {!isLoading && (hasMoreMembers || members.length > PAGE_SIZE) && (
        <div className={styles.seeMore}>
          {(hasMoreMembers || members.length > showLimit) && (
            <SFButton
              fullWidth
              variant="text"
              sfColor="grey"
              onClick={onSeeMore}
            >
              See More
            </SFButton>
          )}
          {!hasMoreMembers &&
            members.length > PAGE_SIZE &&
            members.length <= showLimit && (
              <SFButton
                fullWidth
                variant="text"
                sfColor="grey"
                onClick={onSeeLess}
              >
                See Less
              </SFButton>
            )}
        </div>
      )}
    </div>
  );
};
