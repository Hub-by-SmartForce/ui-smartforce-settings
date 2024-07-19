import { getUserSession } from './AuthService';
import {
  AppNotification,
  EmailNotificationsType,
  Preferences,
  RecipientsEmails
} from '../Models';

// TODO remove mock
export const APP_NOTIFICATIONS: AppNotification[] = [
  {
    id: '1',
    author_avatar:
      'https://s3-alpha-sig.figma.com/img/ff21/961e/50c5b60575aa983332fb646e50e92e79?Expires=1722211200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=nmfG53ZWAT2NOaBP2ReZAO9py~g2h8GlZhMzqWOW7rdqk89gvRFSeibCo9mSVWSAVPIrkj8H3nQtMHIyImFuRM7YfQjrEz3HtW9peginilNEFTYo11wNJ5rn5B9EQcpYTYiNQzk0dNmQZ3DNVvjSjlGUHUpVaMYdCQ9X3yHtbTPeXpT6PlcjZT~c39rZuSr72MLiOKcQUZh6tgzWCDa-USh2EihrSlDf8aoOvrPvdQZGy-3CXOsyjpCGElMjTLHyxvRl9kFuvqoeZb2YgaPdqtnPG0Smjyxig0h~PSb8ExiEZRgt0I7WOJ1jOs9o5iTHxkhzGgPksIhPWGA3M6CUiw__',
    author: 'CitizenContact™',
    title: 'free trial ending soon',
    date_start: '2024-07-18T14:38:40.074Z',
    date_read: new Date().toISOString()
  },
  {
    id: '2',
    author_avatar:
      'https://s3-alpha-sig.figma.com/img/ff21/961e/50c5b60575aa983332fb646e50e92e79?Expires=1722211200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=nmfG53ZWAT2NOaBP2ReZAO9py~g2h8GlZhMzqWOW7rdqk89gvRFSeibCo9mSVWSAVPIrkj8H3nQtMHIyImFuRM7YfQjrEz3HtW9peginilNEFTYo11wNJ5rn5B9EQcpYTYiNQzk0dNmQZ3DNVvjSjlGUHUpVaMYdCQ9X3yHtbTPeXpT6PlcjZT~c39rZuSr72MLiOKcQUZh6tgzWCDa-USh2EihrSlDf8aoOvrPvdQZGy-3CXOsyjpCGElMjTLHyxvRl9kFuvqoeZb2YgaPdqtnPG0Smjyxig0h~PSb8ExiEZRgt0I7WOJ1jOs9o5iTHxkhzGgPksIhPWGA3M6CUiw__',
    author: 'CitizenContact™',
    title: 'released new privacy policies',
    date_start: '2024-07-15T14:38:40.074Z',
    date_read: new Date().toISOString()
  }
];

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

export function getAppNotifications(): Promise<AppNotification[]> {
  // TODO replace mock up
  return Promise.resolve(APP_NOTIFICATIONS);
  // const url: string = `${baseUrl}/notifications`;
  // return apiGet(url, getUserSession().access_token)
}
