import { MemberRole } from './Member';

export interface Height {
  ft?: number;
  in?: number;
}

export interface UserExtraJobs {
  enabled: boolean;
  updated_at: string | null;
}

export interface UserGroup {
  id: string;
  name: string;
  acronym?: string;
  avatar_thumbnail_url?: string;
}

export interface UserBasic {
  id: string;
  name: string;
  avatar_thumbnail_url?: string;
}

export interface UserRole extends MemberRole {
  permissions?: string[];
}

export interface UserTitle {
  id: string;
  name: string;
  priority: number;
}

export interface User {
  agency_id: string;
  agency_name: string;
  agency_ori: string;
  avatar_thumbnail_url?: string | null;
  avatar_url?: string | null;
  career_start_date?: string;
  dob?: string;
  email?: string;
  gender?: string;
  height?: Height;
  id: string;
  is_active: boolean;
  name: string;
  officer_id: string;
  officer_post_number?: string;
  password?: string;
  phone?: string;
  race_ethnicity?: string[];
  role: UserRole;
  weight?: number;
  groups?: UserGroup[];
  extra_jobs?: UserExtraJobs;
  title?: UserTitle;
}

export interface BusinessCardSettings {
  officer_information: {
    show_name: boolean;
    show_officer_id: boolean;
    show_email: boolean;
    show_phone: boolean;
    show_photo: boolean;
    show_title: boolean;
  };
  agency_information: {
    show_name: boolean;
    show_state: boolean;
    show_email: boolean;
    show_phone: boolean;
    show_website: boolean;
    show_photo: boolean;
  };
}

export interface TourSettings {
  app: string;
  show_again: boolean;
  circuit: number | null;
}

export interface UserSettings {
  business_card: BusinessCardSettings;
  tours: TourSettings[];
}
