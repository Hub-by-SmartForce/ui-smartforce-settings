import {
  MANAGER_ROLE_ID,
  OFFICER_ROLE_ID,
  OWNER_ROLE_ID,
  WATCHER_ROLE_ID
} from '../Constants';
import { UserRole } from '../Models';

export function isRoleOwner(roleId?: string): boolean {
  return !!roleId && roleId === OWNER_ROLE_ID;
}

export function isRoleOfficer(roleId?: string): boolean {
  return !!roleId && roleId === OFFICER_ROLE_ID;
}

export function isRoleManager(roleId?: string): boolean {
  return !!roleId && roleId === MANAGER_ROLE_ID;
}

export function isRoleWatcher(roleId?: string): boolean {
  return !!roleId && roleId === WATCHER_ROLE_ID;
}

export function getRoleLabel(role: UserRole): string {
  return isRoleOfficer(role.id) ? 'Member' : role.name;
}
