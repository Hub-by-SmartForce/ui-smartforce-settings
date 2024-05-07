import { apiGet, apiPatch, apiPost } from '../Helpers';
import { isUserInvitationAlreadyAccepted } from '../Helpers/errors';
import {
  BusinessCardSettings,
  User,
  UserExtraJobs,
  UserGroup,
  UserSettings
} from '../Models';
import { getUserSession } from './AuthService';

const LS_INVITATION_KEY = 'Smartforce.UserInvitation';

export interface TourActionBody {
  circuit: number;
  step?: number;
}

export const getUser = (baseUrl: string): Promise<User> => {
  const url: string = `${baseUrl}/users/me`;

  return fetch(url, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `bearer ${getUserSession().access_token}`
    })
  }).then(async (resp: Response) => {
    if (resp.ok) {
      return resp.json().then((data: User) => data);
    } else {
      const body = await resp.json();
      return Promise.reject({
        code: resp.status,
        text: resp.statusText,
        detail: body.detail
      });
    }
  });
};

/**
 * Update user with the values passed by params.
 * @param user Partial User model
 * @returns
 */
export const updateUser = (
  baseUrl: string,
  user: Partial<User>
): Promise<User> => {
  const url: string = `${baseUrl}/users/me`;

  return fetch(url, {
    method: 'PATCH',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `bearer ${getUserSession().access_token}`
    }),
    body: JSON.stringify(
      {
        ...user
      },
      (_key, value) => (value === undefined ? null : value)
    )
  }).then(async (resp: Response) => {
    if (resp.ok) {
      return resp.json().then((data: User) => data);
    } else {
      const body = await resp.json();
      return Promise.reject({
        code: resp.status,
        text: resp.statusText,
        detail: body.detail
      });
    }
  });
};

export interface AvatarImg {
  url: string;
  url_thumbnail: string;
}

export const updateAvatar = async (
  baseUrl: string,
  file: Blob
): Promise<AvatarImg> => {
  const url: string = `${baseUrl}/users/me/avatars`;

  const formData = new FormData();
  formData.append('avatar', file, 'avatar.jpeg');

  const fetchResp = await fetch(url, {
    method: 'POST',
    headers: new Headers({
      Authorization: `bearer ${getUserSession().access_token}`
    }),
    body: formData
  });

  if (fetchResp.ok) {
    const fetchData = await fetchResp.json();
    return Promise.resolve({
      url: fetchData.url,
      url_thumbnail: fetchData.url_thumbnail
    });
  } else {
    const fetchData = await fetchResp.json();
    return Promise.reject({
      code: fetchResp.status,
      text: fetchResp.statusText,
      detail: fetchData.detail
    });
  }
};

export const acceptInvitation = (
  baseUrl: string,
  invite: string
): Promise<void> => {
  const url: string = `${baseUrl}/users/agency-invitation`;

  return fetch(url, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `bearer ${getUserSession().access_token}`
    }),
    body: JSON.stringify({
      token: invite
    })
  }).then(async (resp: Response) => {
    if (resp.ok) {
      acceptUserInvitation(invite);
      return Promise.resolve();
    } else {
      const body = await resp.json();

      if (
        isUserInvitationAlreadyAccepted({
          code: resp.status,
          text: resp.statusText,
          detail: body.detail
        })
      ) {
        // This is not an error for users that already accepted the invitation.
        console.warn(`Login::InvitationAlreadyAccepted`, resp);
        // Remove invitation from local storage again.
        acceptUserInvitation(invite);
        return Promise.resolve();
      }

      return Promise.reject({
        code: resp.status,
        text: resp.statusText,
        detail: body.detail
      });
    }
  });
};

export const getUserInvitation = (): string | null => {
  const item = localStorage.getItem(LS_INVITATION_KEY);

  return item;
};

export const saveUserInvitation = (invite: string): void => {
  localStorage.setItem(LS_INVITATION_KEY, invite);
};

export const acceptUserInvitation = (invite: string | null): void => {
  if (invite) {
    removeUserInvitation();
  }
};

export const removeUserInvitation = (): void => {
  localStorage.removeItem(LS_INVITATION_KEY);
};

export async function getUserGroups(
  baseUrl: string,
  name: string,
  id?: string
): Promise<UserGroup[]> {
  const url = `${baseUrl}/agencies/me/users?active_only=True&name=${name}`;

  const users = await apiGet<User[]>(url, getUserSession().access_token);

  if (users.length > 0) {
    let user: User | undefined = users[0];

    if (id) {
      user = users.find((u: User) => u.id === id);
    }

    if (user && user.groups) {
      return user.groups;
    }
  }

  return [];
}

export async function getUserSettings(baseUrl: string): Promise<UserSettings> {
  const url = `${baseUrl}/users/me/settings`;
  return apiGet<UserSettings>(url, getUserSession().access_token);
}

export async function saveBusinessCardSettings(
  baseUrl: string,
  settings: BusinessCardSettings
): Promise<BusinessCardSettings> {
  const url: string = `${baseUrl}/users/me/settings/business-card`;

  return fetch(url, {
    method: 'PUT',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `bearer ${getUserSession().access_token}`
    }),
    body: JSON.stringify({ ...settings })
  }).then(async (resp: Response) => {
    if (resp.ok) {
      return resp.json();
    } else {
      const body = await resp.json();
      return Promise.reject({
        code: resp.status,
        text: resp.statusText,
        detail: body.detail
      });
    }
  });
}

export async function toggleExtraJobs(
  baseUrl: string,
  enabled: boolean
): Promise<UserExtraJobs> {
  const url: string = `${baseUrl}/users/me/settings/tour/{app}/{action}`;

  return apiPatch(url, { enabled }, getUserSession().access_token);
}

export async function hideTours(baseUrl: string, app: string): Promise<void> {
  const url: string = `${baseUrl}/users/me/setting/tour/${app}/hide`;
  return apiPost(url, {}, getUserSession().access_token);
}

export async function saveTourAction(
  baseUrl: string,
  app: string,
  action: string,
  circuit: number,
  step?: number
): Promise<void> {
  const url: string = `${baseUrl}/users/me/settings/tour/${app}/${action}`;
  try {
    apiPost<TourActionBody, TourActionBody>(
      url,
      { circuit, step },
      getUserSession().access_token
    );
  } catch (e) {
    console.error('Save Tour action error:', e);
  }
}
