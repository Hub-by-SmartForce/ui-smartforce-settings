import { getUserSession } from './AuthService';
import { apiGet, apiPost } from '../Helpers';
import { Customer, UserTitle } from '../Models';

export const saveCustomer = async (
  baseUrl: string,
  full_name: string,
  state_name: string,
  phone1: string,
  email: string,
  ori: string,
  timezone: string
): Promise<Customer> => {
  try {
    const url: string = `${baseUrl}/agencies/`;

    const fetchResponse = await fetch(url, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `bearer ${getUserSession().access_token}`
      }),
      body: JSON.stringify({
        full_name,
        state_name,
        phone1,
        email,
        ori,
        timezone
      })
    });

    const fetchData = await fetchResponse.json();

    if (fetchResponse.ok) {
      return fetchData;
    } else {
      return Promise.reject({
        code: fetchResponse.status,
        text: fetchResponse.statusText,
        detail: fetchData?.detail
      });
    }
  } catch (e) {
    return Promise.reject(e);
  }
};

/**
 * Update Customer with the values passed by params.
 * @param customer Partial Customer model
 * @returns
 */
export const updateCustomer = async (
  baseUrl: string,
  customer: Partial<Customer>
): Promise<Customer> => {
  try {
    const url: string = `${baseUrl}/agencies/me`;

    const fetchResponse = await fetch(url, {
      method: 'PATCH',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `bearer ${getUserSession().access_token}`
      }),
      body: JSON.stringify({
        ...customer
      })
    });

    const fetchData = await fetchResponse.json();

    if (fetchResponse.ok) {
      return fetchData;
    } else {
      return Promise.reject({
        code: fetchResponse.status,
        text: fetchResponse.statusText,
        detail: fetchData?.detail
      });
    }
  } catch (e) {
    return Promise.reject(e);
  }
};

/**
 *
 * @returns the User's customer
 */
export const getCustomer = (baseUrl: string): Promise<Customer> => {
  const url: string = `${baseUrl}/agencies/me`;
  return apiGet<Customer>(url, getUserSession().access_token);
};

export const updateBadge = async (
  baseUrl: string,
  file: Blob
): Promise<string> => {
  const url: string = `${baseUrl}/agencies/me/badges`;

  const formData = new FormData();
  formData.append('badge', file, 'badge.jpeg');

  const fetchResp = await fetch(url, {
    method: 'POST',
    headers: new Headers({
      Authorization: `bearer ${getUserSession().access_token}`
    }),
    body: formData
  });

  if (fetchResp.ok) {
    const fetchData = await fetchResp.json();
    return Promise.resolve(fetchData.url);
  } else {
    const fetchData = await fetchResp.json();
    return Promise.reject({
      code: fetchResp.status,
      text: fetchResp.statusText,
      detail: fetchData.detail
    });
  }
};

export async function getTitles(baseUrl: string): Promise<UserTitle[]> {
  const url = `${baseUrl}/agencies/me/titles`;
  return apiGet<UserTitle[]>(url, getUserSession().access_token);
}

export async function createTitle(
  baseUrl: string,
  name: string
): Promise<UserTitle> {
  const url = `${baseUrl}/agencies/me/titles`;
  return apiPost(url, { name }, getUserSession().access_token);
}

export async function moveTitle(
  baseUrl: string,
  titleId: string,
  priority: number
): Promise<UserTitle[]> {
  const url = `${baseUrl}/agencies/me/titles/${titleId}/move`;
  return apiPost(url, { priority }, getUserSession().access_token);
}
