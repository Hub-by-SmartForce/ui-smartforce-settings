import { Pagination } from './Pagination';
import { UserTitleBase } from './User';

export type GetMemberType = 'invitations' | 'members';

export interface MemberRole {
  id: string;
  name: string;
  priority: number;
}

export interface MemberGroup {
  id: string;
  name: string;
  acronym: string;
}

export interface MemberResponse extends Pagination {
  data: Member[];
}

export interface Member {
  id?: string;
  role?: MemberRole;
  name?: string;
  officer_id?: string;
  officer_post_number?: string;
  avatar_url?: string | null;
  avatar_thumbnail_url?: string;
  is_active?: boolean;
  level?: number;
  email?: string;
  status?:
    | 'Active'
    | 'Invitation not accepted'
    | 'Account not verified'
    | 'Account not created';
  groups: MemberGroup[];
  title?: UserTitleBase;
}
