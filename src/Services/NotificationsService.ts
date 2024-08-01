import { getUserSession } from './AuthService';
import {
  AppNotification,
  EmailNotificationsType,
  Preferences,
  RecipientsEmails
} from '../Models';
import { apiGet } from '../Helpers';

export const getNotificationsPreferences = async (
  baseUrl: string
): Promise<Preferences> => {
  const url: string = `${baseUrl}/agencies/me/preferences`;

  return fetch(url, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `bearer ${getUserSession().access_token}`
    })
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
};

export const updateRecipientsNotifications = async (
  baseUrl: string,
  recipients: string[],
  type: EmailNotificationsType
): Promise<RecipientsEmails> => {
  try {
    const url: string = `${baseUrl}/agencies/me/notifications/email/${type}`;

    const fetchResp = await fetch(url, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `bearer ${getUserSession().access_token}`
      }),
      body: JSON.stringify({ emails: recipients })
    });

    const fetchData = await fetchResp.json();

    if (!fetchResp.ok) {
      return Promise.reject({
        code: fetchResp.status,
        text: fetchResp.statusText,
        detail: fetchData.detail
      });
    }

    return fetchData;
  } catch (e) {
    return Promise.reject(e);
  }
};

export function getAppNotifications(
  baseUrl: string
): Promise<AppNotification[]> {
  const url: string = `${baseUrl}/user-notifications`;
  return apiGet(url, getUserSession().access_token);
}

export async function updateNotificationsRead(
  baseUrl: string,
  idList: string[]
): Promise<void> {
  const url: string = `${baseUrl}/user-notifications/read`;
  try {
    const fetchResp = await fetch(url, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `bearer ${getUserSession().access_token}`
      }),
      body: JSON.stringify(idList)
    });

    if (fetchResp.ok) {
      return;
    } else {
      const fetchData = await fetchResp.json();
      return Promise.reject({
        code: fetchResp.status,
        text: fetchResp.statusText,
        detail: fetchData.detail
      });
    }
  } catch (e) {
    return Promise.reject(e);
  }
}
