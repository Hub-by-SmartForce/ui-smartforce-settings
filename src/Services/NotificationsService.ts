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
    id: 'a8922f4a-8a01-46db-9997-4d1e7cc1c683',
    notification_id: '961f63f7-278b-4810-a93f-d4edbe21afea',
    user_id: 'cf4fab6d-e18f-4181-9801-457c984d8a73',
    author: {
      name: 'CitizenContact™',
      email: 'cc@smartforcetech.com',
      thumbnail_image:
        'https://s3-alpha-sig.figma.com/img/ff21/961e/50c5b60575aa983332fb646e50e92e79?Expires=1722816000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=MdUTnHpFUl9OxZymK6w-m82Egfd4AH9QtaBqb2fyXWPZFLpHu9r8S8-rs9bkgQUtWR3-wQiM5-WNw3sjCfZx7oniBMUujmOqaInze70pPT5E0fU0I05XbinXJMKFuz4ejem12FKyngq0RffNYoRyK9pH8Kpbpwmc1iCYG2oldYUgLOpZJH1H~VdYB2axhuHjw15zwy9wSqVAe96flmGPFnLTmyKjPHjNojPg-XqzhErJZ6dKwl8Ocn-A8NG7n9ju4yUpugvrj~-AgPPYYuSq9BcOafGrnuOYFkwCr80FZ2MUPi2iiguVYhytPgP4Zb1R6dsj5mhYRSZVje1Psgo23A__',
      user_id: '961f63f7-278b-4810-a93f-d4edbe21afea'
    },
    title: 'released new privacy policies',
    body: 'Please take a moment to review these updates to stay informed about how your data is handled and protected.',
    start_date: '2024-10-01T18:21:00Z',
    end_date: '2024-10-20T18:21:00Z',
    delivered_at: '2024-07-18T20:20:00Z',
    created_at: '2024-07-18T18:21:00Z'
  },
  {
    id: '846e6f0b-a066-4134-965d-d37f034cfb3b',
    notification_id: '961f63f7-278b-4810-a93f-d4edbe21aeee',
    user_id: 'cf4fab6d-e18f-4181-9801-457c984d8a73',
    author: {
      name: 'SmartForce®',
      email: 'smartforce@smartforcetech.com',
      thumbnail_image:
        'https://s3-alpha-sig.figma.com/img/ff21/961e/50c5b60575aa983332fb646e50e92e79?Expires=1722816000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=MdUTnHpFUl9OxZymK6w-m82Egfd4AH9QtaBqb2fyXWPZFLpHu9r8S8-rs9bkgQUtWR3-wQiM5-WNw3sjCfZx7oniBMUujmOqaInze70pPT5E0fU0I05XbinXJMKFuz4ejem12FKyngq0RffNYoRyK9pH8Kpbpwmc1iCYG2oldYUgLOpZJH1H~VdYB2axhuHjw15zwy9wSqVAe96flmGPFnLTmyKjPHjNojPg-XqzhErJZ6dKwl8Ocn-A8NG7n9ju4yUpugvrj~-AgPPYYuSq9BcOafGrnuOYFkwCr80FZ2MUPi2iiguVYhytPgP4Zb1R6dsj5mhYRSZVje1Psgo23A__',
      user_id: '961f63f7-278b-4810-a93f-d4edbe21afea'
    },
    title: 'has released Shifts (Beta Version)',
    body: 'You can try Shifts (Beta Version) by clicking the "Read More" button below.',
    external_link: 'https://shifts-dev.smartforce.com/',
    image:
      'https://s3-alpha-sig.figma.com/img/b63b/d695/35d735cdb0c9acada4ed42708155a877?Expires=1722816000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=iGaAe~XbbRRgOgAsBDGgrTUCblLHj1DFaqIo2eTkjrDqyPv4V4gKNkQkmAehVIPs7gctGZ3Mx4U-PI7za3QIRamImJ812z51IixTfnMftbtTjZ2tYXwFZLupU1RezJHBuPsGjuiWUPl9DHhViBA5xHeDyQInsMucH~ydXfVBWr1gSCHJ-3h5PCXSOswZR62-l91mD7ufQX2yTNS3x-kPp4PPCkJPtJYrkCxZK23FtVx63YigvaZ5N9rEyAsdgCaO5ri0mwU137EFz8oQmFgQL8H4PbQaRZ5F5vCPh8~7~uddhWGErDd2Fjbs0d-U~1Y3Pkf7S7~NWZLc0Fml4hiXGA__',
    start_date: '2024-10-01T18:21:00Z',
    end_date: '2024-09-18T18:00:00Z',
    created_at: '2024-07-01T18:21:00Z'
  },
  {
    id: '1e7911b9-ae99-47b8-8bed-d0e15c1dcde4',
    notification_id: '961f63f7-278b-4810-a93f-d4edbe21afea',
    user_id: 'cf4fab6d-e18f-4181-9801-457c984d8a73',
    author: {
      name: 'CitizenContact™',
      email: 'cc@smartforcetech.com',
      thumbnail_image:
        'https://s3-alpha-sig.figma.com/img/ff21/961e/50c5b60575aa983332fb646e50e92e79?Expires=1722816000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=MdUTnHpFUl9OxZymK6w-m82Egfd4AH9QtaBqb2fyXWPZFLpHu9r8S8-rs9bkgQUtWR3-wQiM5-WNw3sjCfZx7oniBMUujmOqaInze70pPT5E0fU0I05XbinXJMKFuz4ejem12FKyngq0RffNYoRyK9pH8Kpbpwmc1iCYG2oldYUgLOpZJH1H~VdYB2axhuHjw15zwy9wSqVAe96flmGPFnLTmyKjPHjNojPg-XqzhErJZ6dKwl8Ocn-A8NG7n9ju4yUpugvrj~-AgPPYYuSq9BcOafGrnuOYFkwCr80FZ2MUPi2iiguVYhytPgP4Zb1R6dsj5mhYRSZVje1Psgo23A__',
      user_id: '961f63f7-278b-4810-a93f-d4edbe21afea'
    },
    title: 'free trial ending soon',
    body: 'To activate your agency subscription, please go to the <b>“Plans and Billing”</b> section in the settings.',
    external_link: 'https://shifts-dev.smartforce.com/',

    start_date: '2024-08-18T18:21:00Z',
    end_date: '2024-09-18T18:21:00Z',
    delivered_at: '2024-07-18T19:21:00Z',
    readed_at: '2024-07-18T19:40:00Z',
    created_at: '2024-07-18T18:21:00Z'
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
