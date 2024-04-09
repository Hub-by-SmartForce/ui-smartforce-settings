import React, { useContext } from 'react';
import { TransitionGroup } from 'react-transition-group';
import { GroupMember, User } from '../../../../../Models';
import { MemberListItem } from './MemberListItem/MemberListItem';
import { UserContext } from '../../../../../Context';
import { SFCollapse, SFDivider } from 'sfui';

export interface MemberListProps {
  isActive: boolean;
  members: GroupMember[];
  onClick: (id: string) => void;
  onRemove: (member: GroupMember) => void;
}

export const MemberList = ({
  isActive,
  members,
  onClick,
  onRemove
}: MemberListProps): React.ReactElement<MemberListProps> => {
  const user = useContext(UserContext).user as User;

  return (
    <TransitionGroup component="div">
      {members.map((member: GroupMember, index: number) => (
        <SFCollapse key={member.id} timeout={480}>
          <MemberListItem
            key={member.id}
            isActive={isActive}
            member={member}
            onRemove={() => onRemove(member)}
            onClick={() => onClick(member.id)}
            user={user}
          />

          {index < members.length - 1 && <SFDivider />}
        </SFCollapse>
      ))}
    </TransitionGroup>
  );
};
