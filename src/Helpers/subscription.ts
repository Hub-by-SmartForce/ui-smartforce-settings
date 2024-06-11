import {
  PLAN_ENGAGE,
  PLAN_ANALYTICS,
  PLAN_CONNECT,
  ANNUALLY_FEE_ANALYTICS,
  MONTHLY_FEE_ANALYTICS,
  PLAN_SCHEDULE,
  ANNUALLY_FEE_SCHEDULE,
  MONTHLY_FEE_SCHEDULE
} from '../Constants';
import { BillingCycleType, Subscription } from '../Models';
import { upperFirstChar } from './format';

export function isPlanConnect(plan?: string): boolean {
  return plan === PLAN_CONNECT;
}

export function isPlanEngage(plan?: string): boolean {
  return plan === PLAN_ENGAGE;
}

export function isPlanAnalytics(plan?: string): boolean {
  return plan === PLAN_ANALYTICS;
}

export function isPlanSchedule(plan?: string): boolean {
  return plan === PLAN_SCHEDULE;
}

export function getPlanLabel(plan: string): string {
  if (isPlanEngage(plan)) {
    return 'Engage';
  }

  return upperFirstChar(plan);
}

export function isFreePlan(plan: string | undefined): boolean {
  return isPlanConnect(plan);
}

export function getInvoiceAmmount(
  plan: string,
  billCycle: BillingCycleType,
  seats: number
): number {
  if (plan === PLAN_SCHEDULE) {
    if (billCycle === 'annually') {
      return ANNUALLY_FEE_SCHEDULE * seats;
    }

    return MONTHLY_FEE_SCHEDULE * seats;
  }

  if (plan === PLAN_ANALYTICS) {
    if (billCycle === 'annually') {
      return ANNUALLY_FEE_ANALYTICS * seats;
    }

    return MONTHLY_FEE_ANALYTICS * seats;
  }

  return 0;
}

export const getAppSubscription = (
  subscriptions: Subscription[],
  appName: string
): Subscription | undefined => {
  return subscriptions.find(
    (subscription: Subscription) => subscription.product === appName
  );
};

export function getPaidSubscription(
  subscriptions: Subscription[]
): Subscription | undefined {
  return subscriptions.find((s) => s.free === false);
}
