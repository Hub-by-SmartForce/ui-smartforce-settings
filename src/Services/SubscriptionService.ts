import { apiGet, apiPost } from '../Helpers';
import {
  ApplicationProduct,
  Subscription,
  SubscriptionPaymentCard,
  SubscriptionValue
} from '../Models';
import { getUserSession } from './AuthService';

export const getSubscriptions = (baseUrl: string): Promise<Subscription[]> => {
  const url: string = `${baseUrl}/subscriptions/me`;
  return apiGet<Subscription[]>(url, getUserSession().access_token);
};

export const createSubscription = async (
  baseUrl: string,
  subscription: SubscriptionValue
): Promise<Subscription> => {
  try {
    const url: string = `${baseUrl}/subscriptions/`;

    const fetchResp = await fetch(url, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `bearer ${getUserSession().access_token}`
      }),
      body: JSON.stringify({ ...subscription })
    });

    const fetchData = await fetchResp.json();

    if (!fetchResp.ok) {
      return Promise.reject({
        code: fetchResp.status,
        text: fetchResp.statusText,
        detail: fetchData.detail
      });
    }

    return fetchData as Subscription;
  } catch (e) {
    return Promise.reject(e);
  }
};

export const cancelSubscription = async (
  baseUrl: string,
  product: ApplicationProduct
): Promise<void> => {
  try {
    const url: string = `${baseUrl}/subscriptions/${product}/renew`;

    const fetchResp = await fetch(url, {
      method: 'DELETE',
      headers: new Headers({
        Authorization: `bearer ${getUserSession().access_token}`
      })
    });

    if (!fetchResp.ok) {
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
};

export const resumeSubscription = async (
  baseUrl: string,
  product: ApplicationProduct
): Promise<void> => {
  try {
    const url: string = `${baseUrl}/subscriptions/${product}/renew`;

    const fetchResp = await fetch(url, {
      method: 'PUT',
      headers: new Headers({
        Authorization: `bearer ${getUserSession().access_token}`
      })
    });

    if (!fetchResp.ok) {
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
};

export const updateSubscription = async (
  baseUrl: string,
  subscription: SubscriptionValue
): Promise<Subscription> => {
  try {
    const url: string = `${baseUrl}/subscriptions/${subscription.product}/upgrade`;

    const fetchResp = await fetch(url, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `bearer ${getUserSession().access_token}`
      }),
      body: JSON.stringify({ ...subscription })
    });

    const fetchData = await fetchResp.json();

    if (!fetchResp.ok) {
      return Promise.reject({
        code: fetchResp.status,
        text: fetchResp.statusText,
        detail: fetchData.detail
      });
    }

    return fetchData as Subscription;
  } catch (e) {
    return Promise.reject(e);
  }
};

export const activateSubscription = async (
  baseUrl: string,
  subscription: Omit<SubscriptionValue, 'plan'>
): Promise<Subscription> => {
  const url: string = `${baseUrl}/subscriptions/${subscription.product}/activate`;
  return apiPost(url, subscription, getUserSession().access_token);
};

export const updateCreditCard = async (
  baseUrl: string,
  cardToken: string,
  product: ApplicationProduct
): Promise<SubscriptionPaymentCard> => {
  try {
    const url: string = `${baseUrl}/subscriptions/${product}/card`;

    const fetchResp = await fetch(url, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `bearer ${getUserSession().access_token}`
      }),
      body: JSON.stringify({ card_token: cardToken })
    });

    const fetchData = await fetchResp.json();

    if (!fetchResp.ok) {
      return Promise.reject({
        code: fetchResp.status,
        text: fetchResp.statusText,
        detail: fetchData.detail
      });
    }

    return fetchData.card;
  } catch (e) {
    return Promise.reject(e);
  }
};
