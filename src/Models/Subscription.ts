import { ApplicationProduct } from './Apps';

export type BillingCycleType = 'monthly' | 'annually';

export interface SubscriptionPaymentCard {
  name: string;
  brand: string;
  last_4_digits: string;
  exp_month: number;
  exp_year: number;
}

export interface SubscriptionPaymentDebit {
  name?: string;
  bank_name: string;
  last_4_digits: string;
  routing_number?: string;
  account_type?: string;
}

export type SubscriptionPaymentMethod =
  | 'card'
  | 'debit'
  | 'check'
  | 'wire_transfer';

export interface SubscriptionPayment {
  method: SubscriptionPaymentMethod;
  card?: SubscriptionPaymentCard;
  debit?: SubscriptionPaymentDebit;
  payment_method_setup_url?: string;
}

export type SubscriptionPlan = 'basic' | 'connect' | 'analytics' | 'schedule';
export type SubscriptionStatus =
  | 'Active'
  | 'Unpaid'
  | 'Canceled'
  | 'Pending'
  | 'Past Due';

export interface SubscriptionCoupon {
  id: string;
  name: string;
  code?: string;
  label: string;
  amount: number;
  type: string;
  months?: number;
  start: string;
  end?: string;
}

export interface SubscriptionUnverifiedPayment {
  method: SubscriptionPaymentMethod;
  payment_method_setup_url: string;
  card?: SubscriptionPaymentCard;
  debit?: SubscriptionPaymentDebit;
}

export interface Subscription {
  id: string;
  created_at: string;
  status: SubscriptionStatus;
  product: ApplicationProduct;
  plan: SubscriptionPlan;
  triggered_by_user: string;
  total_seats_paid: number;
  total_seats_used: number;
  total_seats_billed: number;
  payment: SubscriptionPayment | null;
  billing_cycle: BillingCycleType;
  next_billing_cycle?: BillingCycleType;
  start_date: string;
  end_date: string;
  renew: boolean;
  renewal_date: string;
  free: boolean;
  early_adopter?: boolean;
  current_coupon?: SubscriptionCoupon;
  next_coupon?: SubscriptionCoupon;
  coupons: SubscriptionCoupon[];
  unverified_payment?: SubscriptionUnverifiedPayment;
}

export interface BillingDetailsValue {
  full_name: string;
  phone: string;
  full_address: string;
}

export interface ContactDetailsValue {
  full_name: string;
  phone: string;
  email: string;
  agency_name: string;
}

export interface SubscriptionValue {
  plan: string;
  product: ApplicationProduct;
  card_token?: string;
  payment_method: 'card' | 'check' | 'debit';
  additional_seats?: number;
  billing_cycle?: BillingCycleType;
  billing_details?: BillingDetailsValue;
  contact_details?: ContactDetailsValue;
}
