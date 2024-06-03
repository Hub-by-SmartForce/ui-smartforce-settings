import { ApplicationProduct } from './Apps';

export type BillingCycleType = 'monthly' | 'annually';
export type PaymentMethod = 'card' | 'wire_transfer' | 'check' | 'debit';

export interface SubscriptionPaymentCard {
  name: string;
  brand: string;
  last_4_digits: string;
  exp_month: number;
  exp_year: number;
}

export interface SubscriptionPayment {
  method: string;
  card: SubscriptionPaymentCard | null;
}

export type SubscriptionPlan = 'basic' | 'connect' | 'analytics' | 'schedule';
export type SubscriptionStatus =
  | 'Active'
  | 'Incomplete'
  | 'Unpaid'
  | 'Canceled';

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
  start_date: string;
  end_date: string;
  renew: boolean;
  free: boolean;
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
  payment_method: PaymentMethod;
  additional_seats?: number;
  billing_cycle?: BillingCycleType;
  billing_details?: BillingDetailsValue;
  contact_details?: ContactDetailsValue;
}
