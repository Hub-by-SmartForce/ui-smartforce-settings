export type EmailNotificationsType =
  | 'state_report_recipients'
  | 'invoice_recipients';

export interface EmailNotifications {
  state_report_recipients: string[];
  invoice_recipients: string[];
}

interface Notifications {
  email: EmailNotifications;
}

export interface Preferences {
  notifications: Notifications;
}

export interface RecipientsEmails {
  emails: string[];
}

export interface AppNotificationAuthor {
  name: string;
  email: string;
  thumbnail_image: string;
  user_id: string;
}

export interface AppNotification {
  id: string;
  notification_id: string;
  user_id: string;
  author: AppNotificationAuthor;
  title: string;
  body: string;
  image?: string;
  external_link?: string;
  start_date: string;
  end_date: string;
  delivered_at?: string;
  readed_at?: string;
  created_at: string;
}
