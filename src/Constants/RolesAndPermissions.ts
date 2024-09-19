// ROLES id's
export const OWNER_ROLE_ID: string = 'owner';
export const OFFICER_ROLE_ID: string = 'officer';
export const MANAGER_ROLE_ID: string = 'manager';
export const WATCHER_ROLE_ID: string = 'watcher';

/**
 * AGENCY PERMISSIONS
 */

//Create an agency (BE)
export const AGENCY_CREATE: string = 'agency.create';

// Get the agency info
export const AGENCY_INFORMATION_READ: string = 'agency.information.read';
// Update the agency information
export const AGENCY_INFORMATION_UPDATE: string = 'agency.information.update';
// Update agency notification email distribution list
export const AGENCY_NOTIFICATIONS_EMAIL_UPDATE: string =
  'agency.notifications.email.update';
// See agency preferences tab in settings
export const AGENCY_PREFERENCES_READ: string = 'agency.preferences.read';

// List agency members
export const AGENCY_MEMBERS_READ: string = 'agency.members.read';
// Remove agency members
export const AGENCY_MEMBERS_REMOVE: string = 'agency.members.remove';
// Change the role of an agency member
export const AGENCY_MEMBERS_ROLE_UPDATE: string = 'agency.members.role.update';
// Re-incorporate Ex agency members (BE)
export const AGENCY_MEMBERS_REINCORPORATE: string =
  'agency.members.reincorporate';
// List agency members (People picker) (BE)
export const AGENCY_MEMBERS_PICK: string = 'agency.members.pick';

// Invite new users to the agency
export const AGENCY_INVITATIONS_CREATE: string = 'agency.invitations.create';
// List agency invitations
export const AGENCY_INVITATIONS_READ: string = 'agency.invitations.read';
// Resend agency invitations
export const AGENCY_INVITATIONS_RESEND: string = 'agency.invitations.resend';
// Remove agency invitations
export const AGENCY_INVITATIONS_REMOVE: string = 'agency.invitations.remove';

export const AGENCY_SUBSCRIPTION_READ: string = 'agency.subscription.read';
export const AGENCY_SUBSCRIPTION_UPDATE: string = 'agency.subscription.update';

// View the Agency Areas section
export const AGENCY_AREAS_CREATE: string = 'agency.areas.create';
export const AGENCY_AREAS_UPDATE: string = 'agency.areas.update';

export const AGENCY_GROUPS_READ: string = 'agency.groups.read';
export const AGENCY_GROUPS_CREATE: string = 'agency.groups.create';

/**
 * USER PERMISSIONS
 */

// View their profile/settings
export const USER_PROFILE_READ: string = 'self.profile.read';
// Update their profile/settings/password/avatar
export const USER_PROFILE_UPDATE: string = 'self.profile.update';
